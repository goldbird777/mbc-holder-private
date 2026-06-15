const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');

const app = express();

// ── 주소 조회 결과 캐시 (5분) ────────────────────────────────
var addrCache = {};
var CACHE_TTL = 5 * 60 * 1000;

function getCached(key) {
    var entry = addrCache[key];
    if (!entry) return null;
    if (Date.now() - entry.ts > CACHE_TTL) { delete addrCache[key]; return null; }
    return entry.data;
}
function setCache(key, data) {
    addrCache[key] = { ts: Date.now(), data: data };
}

// ── 재시도 래퍼 (최대 3회, 지수 백오프) ──────────────────────
function fetchWithRetry(url, maxRetry) {
    maxRetry = maxRetry || 3;
    return new Promise(function(resolve, reject) {
        var attempt = 0;
        function run() {
            fetch(url)
                .then(function(r) {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.json();
                })
                .then(resolve)
                .catch(function(err) {
                    attempt++;
                    if (attempt >= maxRetry) return reject(err);
                    setTimeout(run, 300 * attempt); // 300ms, 600ms, 900ms
                });
        }
        run();
    });
}

// ── 동시 실행 수 제한 (concurrency limiter) ───────────────────
function limitedAll(items, concurrency, taskFn) {
    return new Promise(function(resolve) {
        var results = new Array(items.length);
        var index = 0;
        var done = 0;
        var total = items.length;
        if (total === 0) return resolve(results);

        function next() {
            if (index >= total) return;
            var i = index++;
            taskFn(items[i], i)
                .then(function(r) { results[i] = r; })
                .catch(function()  { results[i] = null; })
                .then(function() {
                    done++;
                    if (done === total) resolve(results);
                    else next();
                });
        }
        // 초기 worker 시작
        for (var w = 0; w < Math.min(concurrency, total); w++) next();
    });
}

// ── 홀더 목록 ────────────────────────────────────────────────
app.get('/api/holders', function(req, res) {
    try {
        var data = fs.readFileSync('/home/ubuntu/mbc_holders_final.json', 'utf8');
        var parsed = JSON.parse(data);
        res.json({
            holders: parsed.holders || [],
            count: parsed.count || 0,
            blockHeight: parsed.blockHeight || 0
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// ── 주소 거래 내역 ────────────────────────────────────────────
app.get('/api/address/:addr', function(req, res) {
    var addr = req.params.addr;

    // 캐시 히트
    var cached = getCached('addr:' + addr);
    if (cached) {
        console.log('[cache hit] ' + addr);
        return res.json(cached);
    }

    fetchWithRetry('https://api.mbc.wiki/history/' + addr + '?limit=999')
        .then(function(data) {
            var txids = (data.result && data.result.tx) ? data.result.tx : [];
            if (txids.length === 0) {
                var empty = { transactions: [] };
                setCache('addr:' + addr, empty);
                return res.json(empty);
            }

            console.log('[' + addr.substring(0,10) + '...] ' + txids.length + ' txids 조회 시작');

            // 동시 10개 제한, 재시도 포함으로 tx 상세 조회
            limitedAll(txids, 10, function(txid) {
                return fetchWithRetry('https://api.mbc.wiki/transaction/' + txid, 3)
                    .then(function(tx) {
                        if (!tx || !tx.result) return null;

                        var result = tx.result;
                        var vins  = result.vin  || [];
                        var vouts = result.vout || [];
                        var received = 0;
                        var sent = 0;

                        var isCoinbase = vins.some(function(v) { return v.coinbase; });

                        // vin에서 주소 추출 (scriptPubKey 또는 최상위 address 필드 모두 확인)
                        function getVinAddr(vin) {
                            var spk = vin.scriptPubKey;
                            if (spk) {
                                var a = spk.address || (spk.addresses && spk.addresses[0]) || null;
                                if (a) return a;
                            }
                            // 일부 API 응답에서 address가 vin 최상위에 있는 경우
                            return vin.address || (vin.addresses && vin.addresses[0]) || null;
                        }

                        function getVoutAddr(vout) {
                            var spk = vout.scriptPubKey;
                            if (spk) {
                                var a = spk.address || (spk.addresses && spk.addresses[0]) || null;
                                if (a) return a;
                            }
                            return vout.address || (vout.addresses && vout.addresses[0]) || null;
                        }

                        var iAmSender = vins.some(function(vin) {
                            return getVinAddr(vin) === addr;
                        });

                        vouts.forEach(function(vout) {
                            var a = getVoutAddr(vout);
                            if (a === addr) received += (vout.value || 0) / 10000;
                        });

                        vins.forEach(function(vin) {
                            var a = getVinAddr(vin);
                            if (a === addr) sent += (vin.value || 0) / 10000;
                        });

                        var fromAddr, toAddr;

                        if (isCoinbase) {
                            fromAddr = 'Coinbase(채굴)';
                            toAddr = addr;

                        } else if (iAmSender) {
                            fromAddr = addr;
                            toAddr = null;
                            vouts.forEach(function(vout) {
                                if (toAddr) return;
                                var a = getVoutAddr(vout);
                                if (a && a !== addr) toAddr = a;
                            });
                            if (!toAddr) toAddr = addr;

                        } else {
                            fromAddr = null;
                            vins.forEach(function(vin) {
                                if (fromAddr) return;
                                var a = getVinAddr(vin);
                                if (a) fromAddr = a;
                            });
                            if (!fromAddr) fromAddr = '알수없음';
                            toAddr = addr;
                        }

                        return {
                            txid: txid,
                            from: fromAddr,
                            to: toAddr,
                            received: Math.round(received * 10000),
                            sent: Math.round(sent * 10000),
                            confirmations: result.confirmations || 0,
                            time: result.time || 0
                        };
                    })
                    .catch(function() { return null; });
            })
            .then(function(results) {
                var transactions = results.filter(function(t) { return t !== null; });
                transactions.sort(function(a, b) { return b.time - a.time; });
                console.log('[' + addr.substring(0,10) + '...] 완료: ' + transactions.length + '/' + txids.length + ' tx');
                var response = { transactions: transactions };
                setCache('addr:' + addr, response);
                res.json(response);
            });
        })
        .catch(function(e) {
            res.status(500).json({ error: e.message });
        });
});

// ── 토큰 잔액 ────────────────────────────────────────────────
app.get('/api/tokens/address/:addr', function(req, res) {
    var addr = req.params.addr;
    var cached = getCached('token:' + addr);
    if (cached) return res.json(cached);

    fetchWithRetry('https://tokens.mbc.wiki/layer/address/' + addr)
        .then(function(data) { setCache('token:' + addr, data); res.json(data); })
        .catch(function(e) { res.status(500).json({ error: e.message }); });
});

// ── 토큰 전송 내역 ────────────────────────────────────────────
app.get('/api/tokens/transfers/:addr/:ticker', function(req, res) {
    var addr = req.params.addr;
    var ticker = req.params.ticker;
    fetchWithRetry('https://tokens.mbc.wiki/layer/address/' + addr + '/transfers/' + ticker)
        .then(function(data) { res.json(data); })
        .catch(function(e) { res.status(500).json({ error: e.message }); });
});

app.listen(3000, function() {
    console.log('[' + new Date().toISOString() + '] API Server Started on port 3000');
});
