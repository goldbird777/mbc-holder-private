// fullscan.js — 과거 블록을 거꾸로 채우는 백그라운드 풀스캐너
// 최신 블록(incremental이 처리한 블록)부터 0번까지 거꾸로 진행하며 transfer를 DB에 채움.
// incremental_scan과 SQLite WAL 모드로 동시 안전.
const http = require('http');
const transfersDb = require('/home/ubuntu/mbc-api/transfers_db');

const RPC_CONFIG = { hostname: '127.0.0.1', port: 18332, auth: 'myuser:mypassword' };

function rpc(method, params) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ jsonrpc: '1.0', id: 'fs', method: method, params: params || [] });
        const req = http.request({
            hostname: RPC_CONFIG.hostname,
            port: RPC_CONFIG.port,
            path: '/',
            method: 'POST',
            auth: RPC_CONFIG.auth,
            headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
        }, res => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                try {
                    const j = JSON.parse(body);
                    if (j.error) reject(j.error); else resolve(j.result);
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.setTimeout(30000, () => req.destroy(new Error('RPC timeout')));
        req.write(data); req.end();
    });
}

function pickAddr(spk) {
    if (!spk) return null;
    return spk.address || (spk.addresses && spk.addresses[0]) || null;
}

// ── prevTx LRU 캐시 (RPC 호출 절감) ─────────────────────
// 한 블록 안에서 같은 prevTx 여러 번 조회 + 인접 블록 간 prevTx 공유 효과
const PREV_TX_CACHE_SIZE = 5000;
const prevTxCache = new Map();
async function getPrevTxAddr(txid, voutIdx) {
    const key = txid + ':' + voutIdx;
    if (prevTxCache.has(key)) {
        const v = prevTxCache.get(key);
        prevTxCache.delete(key);
        prevTxCache.set(key, v); // LRU: 최근 사용으로 이동
        return v;
    }
    try {
        const prevTx = await rpc('getrawtransaction', [txid, true]);
        const prevOut = prevTx.vout[voutIdx];
        const addr = pickAddr(prevOut.scriptPubKey);
        prevTxCache.set(key, addr);
        if (prevTxCache.size > PREV_TX_CACHE_SIZE) {
            // 가장 오래된 entry 제거
            const firstKey = prevTxCache.keys().next().value;
            prevTxCache.delete(firstKey);
        }
        return addr;
    } catch (e) {
        return null;
    }
}

async function extractTransfers(tx, blockHeight, blockTime) {
    if (tx.vin && tx.vin[0] && tx.vin[0].coinbase) return [];
    let fromAddr = null;
    for (const vin of (tx.vin || [])) {
        if (vin.coinbase) continue;
        if (fromAddr) break;
        fromAddr = await getPrevTxAddr(vin.txid, vin.vout); // 캐시 사용
    }
    const out = [];
    const vouts = tx.vout || [];
    for (let i = 0; i < vouts.length; i++) {
        const addr = pickAddr(vouts[i].scriptPubKey);
        if (!addr) continue;
        if (addr === fromAddr) continue; // change
        const v = Math.round((vouts[i].value || 0) * 10000);
        if (v <= 0) continue;
        out.push({
            txid: tx.txid, vout_idx: i, block: blockHeight, time: blockTime,
            from_addr: fromAddr, to_addr: addr, amount: v
        });
    }
    if (out.length === 0) {
        let maxIdx = -1, maxV = 0;
        for (let i = 0; i < vouts.length; i++) {
            const v = Math.round((vouts[i].value || 0) * 10000);
            if (v > maxV) { maxV = v; maxIdx = i; }
        }
        if (maxIdx >= 0) {
            out.push({
                txid: tx.txid, vout_idx: maxIdx, block: blockHeight, time: blockTime,
                from_addr: fromAddr, to_addr: pickAddr(vouts[maxIdx].scriptPubKey), amount: maxV
            });
        }
    }
    return out;
}

async function processBlock(h) {
    const blockHash = await rpc('getblockhash', [h]);
    const block = await rpc('getblock', [blockHash, 2]);
    const transfers = [];
    for (const tx of block.tx) {
        const trs = await extractTransfers(tx, h, block.time || 0);
        for (const t of trs) transfers.push(t);
    }
    if (transfers.length > 0) transfersDb.insertTransfersBatch(transfers);
    return transfers.length;
}

async function runLoop() {
    transfersDb.open();
    console.log('=== Fullscan Started ===');
    console.log('Time:', new Date().toLocaleString('ko-KR'));

    // 초기 커서 결정: 기존 fullscan 진행분이 있으면 거기서 이어서, 아니면 풀노드 현재 블록 - 1
    let cursor = transfersDb.getProgress('fullscan_cursor_down');
    if (cursor < 100) {
        try {
            const tip = await rpc('getblockcount');
            cursor = tip - 1;
            transfersDb.setProgress('fullscan_cursor_down', cursor);
            console.log(`Fresh start. Tip = ${tip}, starting fullscan from ${cursor}.`);
        } catch (e) {
            console.error('Failed to get tip:', e.message);
            console.log('Retry in 60s...');
            await new Promise(r => setTimeout(r, 60000));
            return runLoop();
        }
    }
    console.log(`Starting from block ${cursor}, going down to 0...`);

    const START_TIME = Date.now();
    let processed = 0;
    let lastLogTime = Date.now();
    let lastLogProcessed = 0;

    while (cursor > 0) {
        try {
            const cnt = await processBlock(cursor);
            cursor--;
            transfersDb.setProgress('fullscan_cursor_down', cursor);
            processed++;

            // 5초마다 진행 로그
            if (Date.now() - lastLogTime > 5000) {
                const rate = (processed - lastLogProcessed) / ((Date.now() - lastLogTime) / 1000);
                const stats = transfersDb.stats();
                console.log(`[${new Date().toLocaleTimeString('ko-KR')}] cursor=${cursor.toLocaleString()}, total=${stats.total.toLocaleString()} transfers, ${rate.toFixed(1)} blk/s`);
                lastLogTime = Date.now();
                lastLogProcessed = processed;
            }
        } catch (e) {
            console.error(`Block ${cursor} error:`, e.message || e);
            // 블록 에러 시 다음 블록으로 (한 번 실패한 블록을 너무 오래 붙들지 않음)
            cursor--;
            transfersDb.setProgress('fullscan_cursor_down', cursor);
            await new Promise(r => setTimeout(r, 1000));
        }
    }

    console.log('=== Fullscan complete ===');
    console.log('Total time:', ((Date.now() - START_TIME) / 1000 / 60).toFixed(1), 'minutes');
    transfersDb.setProgress('fullscan_done', 1);

    // 완료 후 대기 모드 (PM2가 자동 재시작 안 하도록)
    setInterval(() => {}, 60 * 60 * 1000);
}

runLoop().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
});
