const http = require('http');
const fs = require('fs');
const transfersDb = require('/home/ubuntu/mbc-api/transfers_db');

const RPC_CONFIG = {
  hostname: '127.0.0.1',
  port: 18332,
  auth: 'myuser:mypassword'
};

const HOLDERS_FILE = '/home/ubuntu/mbc_holders_final.json';
const POLL_INTERVAL = 30000;
const CHECKPOINT_INTERVAL = 100;

// transfers DB 초기화 (모듈 로드 시 한 번)
transfersDb.open();

function pickAddr(spk) {
  if (!spk) return null;
  return spk.address || (spk.addresses && spk.addresses[0]) || null;
}

// tx에서 모든 transfer 추출 (vout 단위, coinbase 제외)
// 한 tx의 모든 vout이 각각 하나의 transfer row가 됨 (etherscan 방식)
// 자기 자신에게 돌아가는 change vout은 제외
async function extractTransfers(tx, blockHeight, blockTime, rpcFn) {
  if (tx.vin && tx.vin[0] && tx.vin[0].coinbase) return [];

  // from: 첫 비-coinbase vin의 prev tx 주소 (UTXO 표준 = 같은 tx의 input은 한 sender)
  let fromAddr = null;
  for (const vin of (tx.vin || [])) {
    if (vin.coinbase) continue;
    if (fromAddr) break;
    try {
      const prevTx = await rpcFn('getrawtransaction', [vin.txid, true]);
      const prevOut = prevTx.vout[vin.vout];
      fromAddr = pickAddr(prevOut.scriptPubKey);
    } catch (e) {}
  }

  // 모든 vout 각각을 transfer로 (change = from으로 되돌아가는 건 제외)
  const out = [];
  const vouts = tx.vout || [];
  for (let i = 0; i < vouts.length; i++) {
    const vout = vouts[i];
    const addr = pickAddr(vout.scriptPubKey);
    if (!addr) continue;
    if (addr === fromAddr) continue; // change skip
    const v = Math.round((vout.value || 0) * 10000);
    if (v <= 0) continue;
    out.push({
      txid: tx.txid,
      vout_idx: i,
      block: blockHeight,
      time: blockTime,
      from_addr: fromAddr,
      to_addr: addr,
      amount: v
    });
  }

  // 모든 vout이 fromAddr로 돌아간 경우(전부 change) → 가장 큰 1개를 to로 강제 저장
  if (out.length === 0) {
    let maxIdx = -1, maxV = 0;
    for (let i = 0; i < vouts.length; i++) {
      const v = Math.round((vouts[i].value || 0) * 10000);
      if (v > maxV) { maxV = v; maxIdx = i; }
    }
    if (maxIdx >= 0) {
      out.push({
        txid: tx.txid,
        vout_idx: maxIdx,
        block: blockHeight,
        time: blockTime,
        from_addr: fromAddr,
        to_addr: pickAddr(vouts[maxIdx].scriptPubKey),
        amount: maxV
      });
    }
  }

  return out;
}

function rpc(method, params) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      jsonrpc: '1.0',
      id: 'incr',
      method: method,
      params: params || []
    });

    const req = http.request({
      hostname: RPC_CONFIG.hostname,
      port: RPC_CONFIG.port,
      path: '/',
      method: 'POST',
      auth: RPC_CONFIG.auth,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, res => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          if (json.error) reject(json.error);
          else resolve(json.result);
        } catch(e) { reject(e); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy());
    req.write(data);
    req.end();
  });
}

function saveHolders(balances, lastBlock) {
  const holders = [];
  for (const [addr, bal] of balances.entries()) {
    if (bal > 0) holders.push({ address: addr, balance: bal });
  }
  holders.sort((a, b) => b.balance - a.balance);

  const result = {
    holders: holders,
    count: holders.length,
    blockHeight: lastBlock,
    lastScannedBlock: lastBlock,
    updatedAt: new Date().toISOString()
  };

  const tmp = HOLDERS_FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(result));
  fs.renameSync(tmp, HOLDERS_FILE);
  return result.count;
}

async function scan() {
  let existing = { holders: [], count: 0, blockHeight: 0, lastScannedBlock: 0 };

  if (fs.existsSync(HOLDERS_FILE)) {
    existing = JSON.parse(fs.readFileSync(HOLDERS_FILE));
  }

  const balances = new Map();
  for (const h of existing.holders) {
    balances.set(h.address, h.balance);
  }

  const currentHeight = await rpc('getblockcount');
  const startBlock = (existing.lastScannedBlock || existing.blockHeight || 0) + 1;

  if (startBlock > currentHeight) {
    return { newBlocks: 0, currentHeight: currentHeight };
  }

  const total = currentHeight - startBlock + 1;
  console.log(`[${new Date().toLocaleTimeString('ko-KR')}] Scanning ${total} new blocks (${startBlock} → ${currentHeight})...`);

  let processed = 0;
  let lastSavedBlock = startBlock - 1;
  const startTime = Date.now();

  for (let h = startBlock; h <= currentHeight; h++) {
    try {
      const blockHash = await rpc('getblockhash', [h]);
      const block = await rpc('getblock', [blockHash, 2]);

      const blockTransfers = [];

      for (const tx of block.tx) {
        // 홀더 잔액 갱신 (기존 로직)
        for (const vin of (tx.vin || [])) {
          if (vin.coinbase) continue;
          try {
            const prevTx = await rpc('getrawtransaction', [vin.txid, true]);
            const prevOut = prevTx.vout[vin.vout];
            const spk = prevOut.scriptPubKey;
            const addr = spk.address || (spk.addresses && spk.addresses[0]);
            if (addr) {
              const cur = balances.get(addr) || 0;
              balances.set(addr, cur - Math.round((prevOut.value || 0) * 10000));
            }
          } catch(e) {}
        }

        for (const vout of (tx.vout || [])) {
          const spk = vout.scriptPubKey;
          const addr = spk.address || (spk.addresses && spk.addresses[0]);
          if (addr) {
            const cur = balances.get(addr) || 0;
            balances.set(addr, cur + Math.round((vout.value || 0) * 10000));
          }
        }

        // 모든 vout transfer 추출 + DB 저장 (coinbase 제외, change 제외)
        const trs = await extractTransfers(tx, h, block.time || 0, rpc);
        if (trs && trs.length > 0) for (const t of trs) blockTransfers.push(t);
      }

      if (blockTransfers.length > 0) {
        try { transfersDb.insertTransfersBatch(blockTransfers); }
        catch (e) { console.error(`Block ${h} DB insert error:`, e.message); }
      }
      transfersDb.setProgress('last_incremental_block', h);

      processed++;

      if (processed % CHECKPOINT_INTERVAL === 0) {
        const cnt = saveHolders(balances, h);
        lastSavedBlock = h;
        const elapsed = (Date.now() - startTime) / 1000;
        const rate = processed / elapsed;
        const remain = total - processed;
        const eta = remain / rate;
        console.log(`[${new Date().toLocaleTimeString('ko-KR')}] Checkpoint: ${processed}/${total} blocks (block ${h}, holders ${cnt.toLocaleString()}, ${rate.toFixed(1)} blk/s, ETA ${Math.ceil(eta)}s)`);
      }
    } catch(e) {
      console.error(`Block ${h} error:`, e.message);
    }
  }

  if (lastSavedBlock < currentHeight) {
    const cnt = saveHolders(balances, currentHeight);
    const duration = ((Date.now() - startTime) / 1000).toFixed(0);
    console.log(`[${new Date().toLocaleTimeString('ko-KR')}] ✓ Scanned ${processed} blocks in ${duration}s. Holders: ${cnt.toLocaleString()}, Block: ${currentHeight.toLocaleString()}`);
  }

  return { newBlocks: processed, currentHeight: currentHeight };
}

async function runLoop() {
  console.log('=== Realtime UTXO Scan Started ===');
  console.log('Poll interval: 30 seconds');
  console.log('Checkpoint interval: ' + CHECKPOINT_INTERVAL + ' blocks');
  console.log('Time:', new Date().toLocaleString('ko-KR'));
  console.log('');

  while (true) {
    try {
      const result = await scan();

      if (result.newBlocks === 0) {
        console.log(`[${new Date().toLocaleTimeString('ko-KR')}] Up to date (block ${result.currentHeight.toLocaleString()}). Waiting 30s...`);
      }
    } catch(e) {
      console.error(`[${new Date().toLocaleTimeString('ko-KR')}] Error:`, e.message || e);
    }

    await new Promise(r => setTimeout(r, POLL_INTERVAL));
  }
}

runLoop().catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
