// token_collector.js
// 25,883명 활성 홀더의 모든 토큰 잔액을 tokens.mbc.wiki에서 수집
// 결과: /home/ubuntu/token_holders.json
// 24시간마다 자동 갱신
const fs = require('fs');
const fetch = require('node-fetch');

const HOLDERS_FILE = '/home/ubuntu/mbc_holders_final.json';
const OUTPUT_FILE = '/home/ubuntu/token_holders.json';
const CONCURRENT = 5;
const REQ_TIMEOUT = 15000;
const RUN_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24시간

function fetchWithTimeout(url, timeout) {
    // node-fetch v2의 내장 timeout 옵션 사용 (Node v12 호환)
    return fetch(url, { timeout: timeout });
}

async function collectOnce() {
    console.log('=== Token Collection Started ===');
    console.log('Time:', new Date().toLocaleString('ko-KR'));

    const holdersData = JSON.parse(fs.readFileSync(HOLDERS_FILE, 'utf8'));
    const addresses = (holdersData.holders || []).map(h => h.address);
    console.log('Total addresses to scan:', addresses.length);

    const tokenMap = {};  // { TICKER: { address: balance } }
    let processed = 0;
    let errors = 0;
    let nextIdx = 0;
    const startTime = Date.now();
    let lastLog = startTime;

    async function worker(id) {
        while (true) {
            const idx = nextIdx++;
            if (idx >= addresses.length) return;
            const addr = addresses[idx];

            try {
                const res = await fetchWithTimeout(
                    `https://tokens.mbc.wiki/layer/address/${encodeURIComponent(addr)}`,
                    REQ_TIMEOUT
                );
                if (res.ok) {
                    const data = await res.json();
                    const balances = data.balances || [];
                    for (const b of balances) {
                        if (!b.ticker || !b.value || b.value <= 0) continue;
                        if (!tokenMap[b.ticker]) tokenMap[b.ticker] = {};
                        tokenMap[b.ticker][addr] = b.value;
                    }
                } else {
                    errors++;
                }
            } catch (e) {
                errors++;
            }

            processed++;
            if (Date.now() - lastLog > 10000) {
                const elapsed = (Date.now() - startTime) / 1000;
                const rate = processed / elapsed;
                const remain = (addresses.length - processed) / rate;
                console.log(
                    `[${new Date().toLocaleTimeString('ko-KR')}] ` +
                    `${processed}/${addresses.length} (${(processed / addresses.length * 100).toFixed(1)}%) ` +
                    `${rate.toFixed(1)}/s, ETA ${Math.ceil(remain / 60)}min, errors ${errors}, tokens ${Object.keys(tokenMap).length}`
                );
                lastLog = Date.now();
            }
        }
    }

    const workers = [];
    for (let i = 0; i < CONCURRENT; i++) workers.push(worker(i));
    await Promise.all(workers);

    // 결과 정리
    const result = {
        updatedAt: new Date().toISOString(),
        sourceAddressCount: addresses.length,
        errors: errors,
        tokens: {}
    };
    for (const ticker of Object.keys(tokenMap)) {
        const holders = Object.entries(tokenMap[ticker])
            .map(([addr, bal]) => ({ address: addr, balance: bal }))
            .sort((a, b) => b.balance - a.balance);
        const total = holders.reduce((s, h) => s + h.balance, 0);
        result.tokens[ticker] = {
            count: holders.length,
            totalSupplySeen: total,
            holders: holders
        };
    }

    const tmp = OUTPUT_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(result));
    fs.renameSync(tmp, OUTPUT_FILE);

    const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    console.log(`✓ Done in ${duration}min`);
    console.log(`  Tokens: ${Object.keys(result.tokens).length}`);
    console.log(`  Errors: ${errors}/${addresses.length}`);
    for (const ticker of Object.keys(result.tokens)) {
        console.log(`  ${ticker}: ${result.tokens[ticker].count} holders`);
    }
}

async function loop() {
    console.log('=== Token Collector Started ===');
    console.log('Concurrent workers:', CONCURRENT);
    console.log('Run interval:', RUN_INTERVAL_MS / 1000 / 60 / 60, 'hours');

    while (true) {
        try {
            await collectOnce();
        } catch (e) {
            console.error('Collection failed:', e.message || e);
        }
        console.log(`Sleeping ${RUN_INTERVAL_MS / 1000 / 60 / 60}h until next run...`);
        await new Promise(r => setTimeout(r, RUN_INTERVAL_MS));
    }
}

loop().catch(e => {
    console.error('Fatal:', e);
    process.exit(1);
});
