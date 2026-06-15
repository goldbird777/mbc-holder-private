const http = require('http');
const fs = require('fs');

const RPC_CONFIG = {
  hostname: '127.0.0.1',
  port: 18332,
  auth: 'microbitcoin:microbitcoin777'
};

const HOLDERS_FILE = '/home/ubuntu/mbc_holders_final.json';
const POLL_INTERVAL = 30000;

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
  
  console.log(`[${new Date().toLocaleTimeString('ko-KR')}] Scanning ${currentHeight - startBlock + 1} new blocks...`);
  
  let processed = 0;
  const startTime = Date.now();
  
  for (let h = startBlock; h <= currentHeight; h++) {
    try {
      const blockHash = await rpc('getblockhash', [h]);
      const block = await rpc('getblock', [blockHash, 2]);
      
      for (const tx of block.tx) {
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
      }
      
      processed++;
    } catch(e) {
      console.error(`Block ${h} error:`, e.message);
    }
  }
  
  const holders = [];
  for (const [addr, bal] of balances.entries()) {
    if (bal > 0) holders.push({ address: addr, balance: bal });
  }
  holders.sort((a, b) => b.balance - a.balance);
  
  const result = {
    holders: holders,
    count: holders.length,
    blockHeight: currentHeight,
    lastScannedBlock: currentHeight,
    updatedAt: new Date().toISOString()
  };
  
  fs.writeFileSync(HOLDERS_FILE, JSON.stringify(result));
  
  const duration = ((Date.now() - startTime) / 1000).toFixed(0);
  console.log(`[${new Date().toLocaleTimeString('ko-KR')}] ✓ Scanned ${processed} blocks in ${duration}s. Holders: ${result.count.toLocaleString()}, Block: ${currentHeight.toLocaleString()}`);
  
  return { newBlocks: processed, currentHeight: currentHeight };
}

async function runLoop() {
  console.log('=== Realtime UTXO Scan Started ===');
  console.log('Poll interval: 30 seconds');
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
