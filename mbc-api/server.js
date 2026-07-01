const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const http = require('http');
const crypto = require('crypto');
const path = require('path');
const transfersDb = require('./transfers_db');

transfersDb.open();

const app = express();
app.use(express.json({ limit: '12mb' }));  // 이미지(1MB) + 백서 PDF(8MB) base64 대비

// ── 풀노드 RPC ─────────────────────────────────────────────
var RPC_CONFIG = { hostname: '127.0.0.1', port: 18332, auth: 'myuser:mypassword' };
function rpc(method, params) {
    return new Promise(function(resolve, reject) {
        var data = JSON.stringify({ jsonrpc: '1.0', id: 'r', method: method, params: params || [] });
        var req = http.request({
            hostname: RPC_CONFIG.hostname,
            port: RPC_CONFIG.port,
            path: '/',
            method: 'POST',
            auth: RPC_CONFIG.auth,
            headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
        }, function(res) {
            var body = '';
            res.on('data', function(c) { body += c; });
            res.on('end', function() {
                try {
                    var json = JSON.parse(body);
                    if (json.error) reject(json.error);
                    else resolve(json.result);
                } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.setTimeout(20000, function() { req.destroy(new Error('RPC timeout')); });
        req.write(data);
        req.end();
    });
}

// ── 주소 조회 결과 캐시 ────────────────────────────────
// 거래 내역(addr:*)은 5분, 토큰 잔액(token:*)은 60분 — 토큰 잔액은 자주 안 바뀜
var addrCache = {};
var CACHE_TTL = 5 * 60 * 1000;         // 거래 내역 5분
var TOKEN_CACHE_TTL = 60 * 60 * 1000;  // 토큰 잔액 60분

// 채굴풀 candidates 메모리 캐시 (10분) — SQLite GROUP BY 비용 큼
var poolCandidatesCache = { ts: 0, data: null };
var POOL_CANDIDATES_TTL = 10 * 60 * 1000;

function getCached(key) {
    var entry = addrCache[key];
    if (!entry) return null;
    // key prefix별 TTL 다르게 적용
    var ttl = (key.indexOf('token:') === 0 || key.indexOf('token-holders:') === 0) ? TOKEN_CACHE_TTL : CACHE_TTL;
    if (Date.now() - entry.ts > ttl) { delete addrCache[key]; return null; }
    return entry.data;
}
function setCache(key, data) {
    addrCache[key] = { ts: Date.now(), data: data };
}

var tokenAddressInflight = {};
function fetchTokenAddress(addr) {
    var cacheKey = 'token:' + addr;
    var cached = getCached(cacheKey);
    if (cached) return Promise.resolve(cached);
    if (tokenAddressInflight[addr]) return tokenAddressInflight[addr];

    tokenAddressInflight[addr] = fetchWithRetry('https://tokens.mbc.wiki/layer/address/' + encodeURIComponent(addr), 2)
        .then(function(data) {
            setCache(cacheKey, data);
            return data;
        })
        .finally(function() {
            delete tokenAddressInflight[addr];
        });
    return tokenAddressInflight[addr];
}

function extractInputAddress(txResp) {
    var tx = txResp && (txResp.result || txResp);
    var vins = (tx && tx.vin) || [];
    for (var i = 0; i < vins.length; i++) {
        var vin = vins[i];
        if (!vin || vin.coinbase) continue;
        var spk = vin.scriptPubKey || {};
        var addr = spk.address || (spk.addresses && spk.addresses[0]) ||
            vin.address || (vin.addresses && vin.addresses[0]) || null;
        if (addr) return addr;
    }
    return null;
}

function fillMissingFromAddresses(items) {
    var missing = (items || []).filter(function(t) { return t && !t.from && t.txid; });
    if (missing.length === 0) return Promise.resolve(items);

    return limitedAll(missing.slice(0, 10), 3, function(t) {
        var cacheKey = 'tx-from:' + t.txid;
        var cached = getCached(cacheKey);
        if (cached) {
            t.from = cached.from || null;
            return Promise.resolve(t);
        }

        return fetchWithRetry('https://api.mbc.wiki/transaction/' + encodeURIComponent(t.txid), 2)
            .then(function(tx) {
                var from = extractInputAddress(tx);
                if (from) t.from = from;
                setCache(cacheKey, { from: t.from || null });
                return t;
            })
            .catch(function() { return t; });
    }).then(function() {
        return items;
    });
}

function removeSelfTransfers(items) {
    return (items || []).filter(function(t) {
        return !(t && t.from && t.to && t.from === t.to);
    });
}

// ── 재시도 래퍼 (최대 3회, 지수 백오프) ──────────────────────
function fetchWithRetry(url, maxRetry) {
    maxRetry = maxRetry || 3;
    return new Promise(function(resolve, reject) {
        var attempt = 0;
        function run() {
            fetch(url, { timeout: 7000 })
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

// ── 홀더 목록 (page/limit 페이지네이션 + mtime 캐시) ───────────
// holders.json은 25k+ 항목. parse/totalSupply는 mtime 동안 1회만 수행.
// 페이지 응답은 매번 stringify (50개라 비용 작음). 전체 응답(CSV용)은 캐시.
var holdersCache = { mtime: 0, parsed: null, fullBody: null, totalSupply: 0, loadedAt: 0 };
var HOLDERS_CACHE_TTL = 5 * 60 * 1000;
function getHoldersData() {
    var path = '/home/ubuntu/mbc_holders_final.json';
    if (holdersCache.parsed && (Date.now() - holdersCache.loadedAt) < HOLDERS_CACHE_TTL) return holdersCache;
    var stat = fs.statSync(path);
    var mtime = stat.mtimeMs;
    if (holdersCache.parsed && holdersCache.mtime === mtime) return holdersCache;
    var parsed = JSON.parse(fs.readFileSync(path, 'utf8'));
    var arr = parsed.holders || [];
    var sum = 0;
    for (var i = 0; i < arr.length; i++) sum += (arr[i].balance || 0);
    holdersCache = { mtime: mtime, parsed: parsed, fullBody: null, totalSupply: sum, loadedAt: Date.now() };
    return holdersCache;
}
app.get('/api/holders', function(req, res) {
    try {
        var cache = getHoldersData();
        var holders = cache.parsed.holders || [];
        var total = cache.parsed.count || holders.length;
        var blockHeight = cache.parsed.blockHeight || 0;
        var page = parseInt(req.query.page);
        var limit = parseInt(req.query.limit);

        if (page > 0 && limit > 0) {
            var start = (page - 1) * limit;
            return res.json({
                holders: holders.slice(start, start + limit),
                count: total,
                totalSupply: cache.totalSupply,
                page: page,
                limit: limit,
                totalPages: Math.ceil(total / limit),
                blockHeight: blockHeight
            });
        }
        // 전체 응답 (CSV 등) — stringify 캐시
        if (!cache.fullBody) {
            cache.fullBody = JSON.stringify({
                holders: holders,
                count: total,
                totalSupply: cache.totalSupply,
                blockHeight: blockHeight
            });
        }
        res.type('application/json').send(cache.fullBody);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/holder/:addr', function(req, res) {
    try {
        var addr = req.params.addr;
        var cache = getHoldersData();
        var holders = cache.parsed.holders || [];
        var idx = -1;
        for (var i = 0; i < holders.length; i++) {
            if (holders[i].address === addr) { idx = i; break; }
        }
        if (idx < 0) {
            return res.json({
                address: addr,
                found: false,
                balance: 0,
                rank: null,
                percent: 0,
                totalSupply: cache.totalSupply,
                blockHeight: cache.parsed.blockHeight || 0
            });
        }
        var h = holders[idx];
        res.json({
            address: addr,
            found: true,
            balance: h.balance || 0,
            rank: idx + 1,
            percent: cache.totalSupply ? ((h.balance || 0) / cache.totalSupply * 100) : 0,
            totalSupply: cache.totalSupply,
            blockHeight: cache.parsed.blockHeight || 0
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

                        // ── COINBASE: 채굴 보상 1 row ──
                        if (isCoinbase) {
                            vouts.forEach(function(vout) {
                                var a = getVoutAddr(vout);
                                if (a === addr) received += (vout.value || 0) / 10000;
                            });
                            return [{
                                txid: txid,
                                from: 'Coinbase(채굴)',
                                to: addr,
                                received: Math.round(received * 10000),
                                sent: 0,
                                confirmations: result.confirmations || 0,
                                time: result.time || 0
                            }];
                        }

                        // ── SENDER: 자기가 보낸 거. 모든 비-자기 vout마다 1 row ──
                        if (iAmSender) {
                            var senderFrom = null;
                            for (var vi = 0; vi < vins.length; vi++) {
                                var a = getVinAddr(vins[vi]);
                                if (a) { senderFrom = a; break; }
                            }
                            if (!senderFrom) senderFrom = addr;

                            var rows = [];
                            for (var oi = 0; oi < vouts.length; oi++) {
                                var vout = vouts[oi];
                                var voutAddr = getVoutAddr(vout);
                                if (!voutAddr) continue;
                                if (voutAddr === addr) continue; // change skip
                                var amount = Math.round(vout.value || 0);
                                if (amount <= 0) continue;
                                rows.push({
                                    txid: txid,
                                    vout_idx: oi,
                                    from: senderFrom,
                                    to: voutAddr,
                                    received: 0,
                                    sent: amount,
                                    confirmations: result.confirmations || 0,
                                    time: result.time || 0
                                });
                            }
                            // 모두 자기에게 돌아온 경우 (change만) → 1 row로 표시
                            if (rows.length === 0) {
                                rows.push({
                                    txid: txid,
                                    from: senderFrom,
                                    to: addr,
                                    received: 0,
                                    sent: 0,
                                    confirmations: result.confirmations || 0,
                                    time: result.time || 0
                                });
                            }
                            return rows;
                        }

                        // ── RECEIVER: 자기가 받은 거. 자기에게 들어온 각 vout마다 1 row ──
                        var receiverFrom = null;
                        for (var vi2 = 0; vi2 < vins.length; vi2++) {
                            var a2 = getVinAddr(vins[vi2]);
                            if (a2) { receiverFrom = a2; break; }
                        }
                        if (!receiverFrom) receiverFrom = '알수없음';

                        var recvRows = [];
                        for (var ri = 0; ri < vouts.length; ri++) {
                            var rvout = vouts[ri];
                            var ra = getVoutAddr(rvout);
                            if (ra !== addr) continue;
                            var ramt = Math.round(rvout.value || 0);
                            if (ramt <= 0) continue;
                            recvRows.push({
                                txid: txid,
                                vout_idx: ri,
                                from: receiverFrom,
                                to: addr,
                                received: ramt,
                                sent: 0,
                                confirmations: result.confirmations || 0,
                                time: result.time || 0
                            });
                        }
                        if (recvRows.length === 0) {
                            recvRows.push({
                                txid: txid,
                                from: receiverFrom,
                                to: addr,
                                received: 0,
                                sent: 0,
                                confirmations: result.confirmations || 0,
                                time: result.time || 0
                            });
                        }
                        return recvRows;
                    })
                    .catch(function() { return null; });
            })
            .then(function(results) {
                // results: 배열의 배열. flatten 처리.
                var transactions = [];
                for (var i = 0; i < results.length; i++) {
                    var rs = results[i];
                    if (!rs) continue;
                    if (Array.isArray(rs)) for (var j = 0; j < rs.length; j++) transactions.push(rs[j]);
                    else transactions.push(rs);
                }
                transactions.sort(function(a, b) {
                    if (b.time !== a.time) return b.time - a.time;
                    // 같은 시간: txid 같으면 vout_idx 오름차순
                    if (a.txid === b.txid) return (a.vout_idx || 0) - (b.vout_idx || 0);
                    return 0;
                });
                console.log('[' + addr.substring(0,10) + '...] 완료: ' + transactions.length + ' rows / ' + txids.length + ' tx');
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
    fetchTokenAddress(addr)
        .then(function(data) { res.json(data); })
        .catch(function(e) { res.status(500).json({ error: e.message }); });
});

app.get('/api/tokens/addresses', function(req, res) {
    var addrs = String(req.query.addrs || '')
        .split(',')
        .map(function(a) { return a.trim(); })
        .filter(function(a, i, arr) { return a && arr.indexOf(a) === i; })
        .slice(0, 25);

    if (addrs.length === 0) return res.json({ results: {} });

    limitedAll(addrs, 2, function(addr) {
        return fetchTokenAddress(addr)
            .then(function(data) { return { addr: addr, data: data }; })
            .catch(function(e) { return { addr: addr, data: { error: e.message, balances: [] } }; });
    }).then(function(rows) {
        var results = {};
        rows.forEach(function(row) {
            if (row && row.addr) results[row.addr] = row.data;
        });
        res.json({ results: results });
    }).catch(function(e) {
        res.status(500).json({ error: e.message });
    });
});

// ── 토큰별 홀더 리스트 (외부 API 프록시 + 캐시) ─────────────
app.get('/api/tokens/holders/:ticker', function(req, res) {
    var ticker = (req.params.ticker || '').toUpperCase();
    var page = Math.max(1, parseInt(req.query.page) || 1);
    var cacheKey = 'token-holders:' + ticker + ':' + page;
    var cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    Promise.all([
        fetchWithRetry('https://tokens.mbc.wiki/layer/token/' + encodeURIComponent(ticker)).catch(function(){ return null; }),
        fetchWithRetry('https://tokens.mbc.wiki/layer/token/' + encodeURIComponent(ticker) + '/holders?page=' + page).catch(function(){ return null; })
    ]).then(function(results) {
        var info = results[0];
        var holdersResp = results[1];

        if (!info && !holdersResp) {
            return res.json({
                available: false, ticker: ticker, count: 0, holders: [],
                error: '외부 API 응답 없음'
            });
        }

        var holdersList = (holdersResp && holdersResp.list) || [];
        var pagination = (holdersResp && holdersResp.pagination) || { page: 1, pages: 0, total: 0 };

        var response = {
            available: true,
            ticker: ticker,
            count: (info && info.holders) || pagination.total || 0,
            supply: (info && info.supply) || 0,
            decimals: (info && info.decimals) || 4,
            transfers: (info && info.transfers) || 0,
            reissuable: info && info.reissuable,
            page: pagination.page || page,
            totalPages: pagination.pages || 0,
            holders: holdersList.map(function(h) {
                return {
                    address: h.address,
                    balance: h.value,
                    received: h.received,
                    sent: h.sent
                };
            }),
            source: 'tokens.mbc.wiki',
            updatedAt: new Date().toISOString()
        };
        setCache(cacheKey, response);
        res.json(response);
    }).catch(function(e) {
        res.json({ available: false, error: e.message, count: 0, holders: [] });
    });
});

// ── 토큰 전송 내역 ────────────────────────────────────────────
app.get('/api/tokens/transfers/:addr/:ticker', function(req, res) {
    var addr = req.params.addr;
    var ticker = req.params.ticker;
    fetchWithRetry('https://tokens.mbc.wiki/layer/address/' + addr + '/transfers/' + ticker)
        .then(function(data) { res.json(data); })
        .catch(function(e) { res.status(500).json({ error: e.message }); });
});


// ── MBC 시세 (CMC 시총 역산) ───────────────────────────────
var priceCache = { ts: 0, data: null };

app.get("/api/price", function(req, res) {
    if (priceCache.data && Date.now() - priceCache.ts < 5 * 60 * 1000) {
        return res.json(Object.assign({}, priceCache.data, { cached: true }));
    }
    Promise.all([
        fetchWithRetry("https://api.coinmarketcap.com/data-api/v3/cryptocurrency/quote/latest?slug=microbitcoin").catch(function(){ return null; }),
        fetchWithRetry("https://open.er-api.com/v6/latest/USD").catch(function(){ return null; })
    ]).then(function(results) {
        var cmc = results[0];
        var fx = results[1];
        var usdKrw = (fx && fx.rates && fx.rates.KRW) ? fx.rates.KRW : 1400;
        var priceUsd = null, marketCapUsd = null, supply = null;
        var change24 = null, change7d = null, change30d = null, change1y = null;
        var lastUpdated = null;
        if (cmc && cmc.data && cmc.data[0]) {
            var d = cmc.data[0];
            supply = d.totalSupply || d.circulatingSupply;
            if (d.quotes && d.quotes[0]) {
                marketCapUsd = d.quotes[0].fullyDilutedMarketCap;
                change24 = d.quotes[0].percentChange24h;
                change7d = d.quotes[0].percentChange7d;
                change30d = d.quotes[0].percentChange30d;
                lastUpdated = d.quotes[0].lastUpdatedTime;
            }
            change1y = d.percentChange1y;
            if (marketCapUsd && supply) {
                priceUsd = marketCapUsd / supply;
            }
        }
        var priceKrw = priceUsd != null ? priceUsd * usdKrw : null;
        var response = {
            mbc_usd: priceUsd,
            mbc_krw: priceKrw,
            usd_krw_rate: usdKrw,
            market_cap_usd: marketCapUsd,
            circulating_supply: supply,
            change_24h: change24,
            change_7d: change7d,
            change_30d: change30d,
            change_1y: change1y,
            last_cmc_update: lastUpdated,
            source: "CoinMarketCap (시총 역산)",
            source_url: "https://coinmarketcap.com/currencies/microbitcoin/",
            trade_url: "https://www.lbank.com/trade/mbc_usdt",
            note: "MBC는 거래량이 낮아 가격이 부정확할 수 있습니다. 실거래는 LBank에서 확인하세요.",
            updated: new Date().toISOString(),
            cached: false
        };
        priceCache = { ts: Date.now(), data: response };
        res.json(response);
    }).catch(function(e) {
        if (priceCache.data) {
            return res.json(Object.assign({}, priceCache.data, { cached: true }));
        }
        res.status(500).json({ error: e.message });
    });
});



// ── 사이트 통계 (방문자 수) ────────────────────────────────
var statsCache = { ts: 0, data: null };

app.get("/api/stats", function(req, res) {
    if (statsCache.data && Date.now() - statsCache.ts < 5 * 60 * 1000) {
        return res.json(statsCache.data);
    }

    var fs = require("fs");
    var today = new Date();
    var d = String(today.getUTCDate()).padStart(2, "0");
    var month = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][today.getUTCMonth()];
    var year = today.getUTCFullYear();
    var datePrefix = d + "/" + month + "/" + year;

    try {
        var log = fs.readFileSync("/var/log/nginx/access.log", "utf-8");
        var lines = log.split("\n");

        // 봇 차단 패턴
        var botPattern = /bot|crawl|spider|scan|wget|curl|python-requests|go-http-client|ahrefs|semrush|baiduspider|yandex|googlebot|bingbot/i;

        // 사이트 파일만 카운트 (로봇 스캐닝하는 admin/.env 등 제외)
        var validPaths = /(GET|HEAD)\s+(\/|\/api\/holders|\/api\/address|\/api\/tokens|\/api\/price|\/api\/stats|\/assets\/)/;

        var todayIps = new Set();
        var allTimeIps = new Set();
        var totalPageViews = 0;

        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (!line) continue;

            // nginx combined 로그 포맷에서 IP 추출
            var ipMatch = line.match(/^([\d.]+)/);
            if (!ipMatch) continue;
            var ip = ipMatch[1];

            // User-Agent 봇 차단
            if (botPattern.test(line)) continue;

            // 유효 path 만 카운트
            if (!validPaths.test(line)) continue;

            allTimeIps.add(ip);
            totalPageViews++;

            if (line.indexOf(datePrefix) > -1) {
                todayIps.add(ip);
            }
        }

        var result = {
            todayVisitors: todayIps.size,
            totalVisitors: allTimeIps.size,
            pageViews: totalPageViews,
            updated: new Date().toISOString()
        };
        statsCache = { ts: Date.now(), data: result };
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message, todayVisitors: 0 });
    }
});


// ── 마이닝 정보 (풀노드 실시간) ──────────────────────────
var miningInfoCache = { ts: 0, data: null };
var MINING_INFO_TTL = 30 * 1000;

app.get('/api/mining-info', function(req, res) {
    if (miningInfoCache.data && Date.now() - miningInfoCache.ts < MINING_INFO_TTL) {
        return res.json(Object.assign({}, miningInfoCache.data, { cached: true }));
    }
    Promise.all([
        rpc('getmininginfo'),
        rpc('getnetworkhashps', [720]).catch(function(){ return null; }),   // 12h 평균
        rpc('getnetworkhashps', [1440]).catch(function(){ return null; })   // 24h 평균
    ]).then(function(results) {
        var info = results[0] || {};
        var data = {
            blocks: info.blocks,
            difficulty: info.difficulty,
            networkhashps: info.networkhashps,           // 기본 120블록 (~2h)
            networkhashps_12h: results[1],
            networkhashps_24h: results[2],
            pooledtx: info.pooledtx,
            chain: info.chain,
            updatedAt: new Date().toISOString(),
            source: 'MBC fullnode RPC (getmininginfo)',
            cached: false
        };
        miningInfoCache = { ts: Date.now(), data: data };
        res.json(data);
    }).catch(function(e) {
        if (miningInfoCache.data) {
            return res.json(Object.assign({}, miningInfoCache.data, { cached: true, stale: true }));
        }
        res.status(500).json({ error: e.message || String(e) });
    });
});

// ── 최근 트랜잭션 (채굴 제외) ─────────────────────────────
// 백그라운드 워커가 30초마다 최근 5블록을 스캔해 캐시 갱신.
// 클라이언트는 캐시만 읽으므로 항상 즉시 응답.
var recentCache = { ts: 0, data: { transfers: [], blockHeight: 0, updatedAt: null, loading: true } };
var RECENT_SCAN_BLOCKS = 5;
var RECENT_MAX = 50;
var RECENT_CACHE_TTL = 60 * 1000;
var recentRefreshInFlight = false;

function pickAddr(spk) {
    if (!spk) return null;
    return spk.address || (spk.addresses && spk.addresses[0]) || null;
}

async function buildRecentTransfers() {
    var transfers = transfersDb.recentTransfers(RECENT_MAX);
    var latestBlock = transfers.length ? transfers[0].block : 0;
    return {
        transfers: transfers,
        blockHeight: latestBlock,
        scanBlocks: 0,
        source: 'transfers_db',
        updatedAt: new Date().toISOString()
    };
}

async function refreshRecentTransfers() {
    if (recentRefreshInFlight) return;
    recentRefreshInFlight = true;
    try {
        var data = await buildRecentTransfers();
        recentCache = { ts: Date.now(), data: data };
        console.log('[recent-transfers] cached ' + data.transfers.length + ' transfers @ block ' + data.blockHeight);
    } catch (e) {
        console.error('[recent-transfers] refresh failed:', e.message || e);
    } finally {
        recentRefreshInFlight = false;
    }
}

// Keep the API process responsive on 1CPU hosts. Incremental scan workers update
// transfers.db; this endpoint serves the last in-memory cache without polling.

app.get('/api/recent-transfers', function(req, res) {
    if ((!recentCache.ts || Date.now() - recentCache.ts > RECENT_CACHE_TTL) && !recentRefreshInFlight) {
        refreshRecentTransfers();
    }
    res.json(recentCache.data);
});


// ─────────────────────────────────────────────────────────
//  Q&A 익명 게시판 (비밀번호 4자리 + 관리자 답글)
// ─────────────────────────────────────────────────────────

function hashPassword(pw) {
    return crypto.createHash('sha256').update(String(pw)).digest('hex');
}

// 비밀번호 hash 제거하여 외부에 노출 안 되도록
function sanitizeQna(item) {
    if (!item) return item;
    var copy = Object.assign({}, item);
    delete copy.passwordHash;
    return copy;
}

function publicQnaItems(data) {
    return (Array.isArray(data) ? data : []).filter(function(it) { return !it.isPrivate; });
}

// 목록 조회 (페이지네이션)
app.get('/api/qna', function(req, res) {
    var page = Math.max(1, parseInt(req.query.page) || 1);
    var perPage = Math.min(100, Math.max(5, parseInt(req.query.perPage) || 15));
    var data = (function() {
        var f = boardFile('qna');
        if (!f) return [];
        try { return JSON.parse(fs.readFileSync(f, 'utf8')); }
        catch (e) { return []; }
    })();
    if (!isAdmin(req)) data = publicQnaItems(data);
    var total = data.length;
    var totalPages = Math.ceil(total / perPage);
    var offset = (page - 1) * perPage;
    var items = data.slice(offset, offset + perPage).map(function(it) {
        var s = sanitizeQna(it);
        // 답변 상태
        s.hasReply = !!(it.replies && it.replies.length > 0);
        s.replyCount = it.replies ? it.replies.length : 0;
        return s;
    });
    res.json({
        items: items,
        page: page,
        perPage: perPage,
        total: total,
        totalPages: totalPages
    });
});

// 단일 글 조회 (조회수 증가)
app.get('/api/qna/:id', function(req, res) {
    var data = loadBoard('qna') || [];
    var idx = data.findIndex(function(x) { return x.id === req.params.id; });
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    if (data[idx].isPrivate && !isAdmin(req)) return res.status(404).json({ error: 'not found' });
    // 조회수 +1
    data[idx].viewCount = (data[idx].viewCount || 0) + 1;
    saveBoard('qna', data);
    res.json(sanitizeQna(data[idx]));
});

// 익명 글쓰기
app.post('/api/qna', function(req, res) {
    var body = req.body || {};
    var title = (body.title || '').toString().trim().slice(0, 200);
    var content = (body.content || '').toString().trim().slice(0, 20000);
    var author = (body.author || '익명').toString().trim().slice(0, 30) || '익명';
    var password = (body.password || '').toString();
    var isPrivate = body.isPrivate === true || body.isPrivate === 'true' || body.private === true || body.private === 'true';
    if (!title || !content) return res.status(400).json({ error: '제목과 본문을 입력하세요' });
    if (!password || password.length < 4) return res.status(400).json({ error: '비밀번호는 최소 4자 이상' });

    var data = loadBoard('qna') || [];
    var item = {
        id: Date.now().toString(36) + crypto.randomBytes(3).toString('hex'),
        title: title,
        content: content,
        author: author,
        isPrivate: isPrivate,
        passwordHash: hashPassword(password),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        viewCount: 0,
        replies: []
    };
    data.unshift(item);
    saveBoard('qna', data);
    res.json({ ok: true, item: sanitizeQna(item) });
});

// 글 수정 (비밀번호 또는 관리자)
app.put('/api/qna/:id', function(req, res) {
    var data = loadBoard('qna') || [];
    var idx = data.findIndex(function(x) { return x.id === req.params.id; });
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    var item = data[idx];
    var body = req.body || {};
    var isAdminCheck = isAdmin(req);
    if (!isAdminCheck) {
        var pw = (body.password || '').toString();
        if (!pw || hashPassword(pw) !== item.passwordHash) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다' });
        }
    }
    if (body.title != null) item.title = body.title.toString().trim().slice(0, 200);
    if (body.content != null) item.content = body.content.toString().trim().slice(0, 20000);
    if (body.author != null) item.author = body.author.toString().trim().slice(0, 30);
    if (body.isPrivate != null) item.isPrivate = body.isPrivate === true || body.isPrivate === 'true';
    item.updatedAt = new Date().toISOString();
    data[idx] = item;
    saveBoard('qna', data);
    res.json({ ok: true, item: sanitizeQna(item) });
});

// 글 삭제 (비밀번호 또는 관리자)
app.delete('/api/qna/:id', function(req, res) {
    var data = loadBoard('qna') || [];
    var idx = data.findIndex(function(x) { return x.id === req.params.id; });
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    var item = data[idx];
    var body = req.body || {};
    var isAdminCheck = isAdmin(req);
    if (!isAdminCheck) {
        var pw = (body.password || '').toString();
        if (!pw || hashPassword(pw) !== item.passwordHash) {
            return res.status(401).json({ error: '비밀번호가 일치하지 않습니다' });
        }
    }
    data.splice(idx, 1);
    saveBoard('qna', data);
    res.json({ ok: true });
});

// 비밀번호 검증 (수정 모달 진입용)
app.post('/api/qna/:id/verify', function(req, res) {
    var data = loadBoard('qna') || [];
    var item = data.find(function(x) { return x.id === req.params.id; });
    if (!item) return res.status(404).json({ error: 'not found' });
    var pw = (req.body && req.body.password) || '';
    var ok = isAdmin(req) || hashPassword(pw) === item.passwordHash;
    res.json({ ok: ok });
});

// 답글 추가 (관리자만)
app.post('/api/qna/:id/reply', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: '관리자만 답글 작성 가능' });
    var data = loadBoard('qna') || [];
    var idx = data.findIndex(function(x) { return x.id === req.params.id; });
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    var content = ((req.body && req.body.content) || '').toString().trim().slice(0, 20000);
    if (!content) return res.status(400).json({ error: '답글 내용을 입력하세요' });
    if (!data[idx].replies) data[idx].replies = [];
    data[idx].replies.push({
        content: content,
        isAdmin: true,
        createdAt: new Date().toISOString()
    });
    saveBoard('qna', data);
    res.json({ ok: true });
});

// 답글 삭제 (관리자만)
app.delete('/api/qna/:id/reply/:replyIdx', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: '관리자만 답글 삭제 가능' });
    var data = loadBoard('qna') || [];
    var idx = data.findIndex(function(x) { return x.id === req.params.id; });
    if (idx < 0) return res.status(404).json({ error: 'not found' });
    var ri = parseInt(req.params.replyIdx);
    if (isNaN(ri) || ri < 0 || ri >= (data[idx].replies || []).length) {
        return res.status(404).json({ error: 'reply not found' });
    }
    data[idx].replies.splice(ri, 1);
    saveBoard('qna', data);
    res.json({ ok: true });
});


// ─────────────────────────────────────────────────────────
//  토큰 아이콘 업로드 (어드민) — base64 → 파일
// ─────────────────────────────────────────────────────────
var TOKEN_ICON_DIR = '/var/www/uploads/tokens';

app.post('/api/admin/upload/token-icon', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var body = req.body || {};
    var dataUrl = (body.dataUrl || '').toString();
    var ticker = (body.ticker || '').toString().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    if (!dataUrl) return res.status(400).json({ error: '이미지 데이터가 없습니다' });
    if (!ticker) return res.status(400).json({ error: '티커를 지정하세요' });

    var match = dataUrl.match(/^data:image\/(png|jpeg|jpg|gif|svg\+xml|webp);base64,(.+)$/i);
    if (!match) return res.status(400).json({ error: '지원하지 않는 이미지 형식 (png/jpg/gif/svg/webp만 허용)' });

    var rawExt = match[1].toLowerCase();
    var ext = rawExt === 'svg+xml' ? 'svg' : (rawExt === 'jpeg' ? 'jpg' : rawExt);
    var buf;
    try { buf = Buffer.from(match[2], 'base64'); }
    catch (e) { return res.status(400).json({ error: 'base64 디코딩 실패' }); }
    if (buf.length > 1024 * 1024) return res.status(400).json({ error: '이미지가 너무 큽니다 (최대 1MB)' });
    if (buf.length < 100) return res.status(400).json({ error: '이미지가 너무 작거나 손상됨' });

    try { if (!fs.existsSync(TOKEN_ICON_DIR)) fs.mkdirSync(TOKEN_ICON_DIR, { recursive: true }); }
    catch (e) { return res.status(500).json({ error: '저장 디렉토리 생성 실패: ' + e.message }); }

    // 기존 다른 확장자 파일 정리 (ticker.png 있을 때 새로 svg 올리면 png 삭제)
    var extList = ['png', 'jpg', 'gif', 'svg', 'webp'];
    for (var i = 0; i < extList.length; i++) {
        var old = TOKEN_ICON_DIR + '/' + ticker + '.' + extList[i];
        if (old !== TOKEN_ICON_DIR + '/' + ticker + '.' + ext && fs.existsSync(old)) {
            try { fs.unlinkSync(old); } catch (e) {}
        }
    }

    var filename = ticker + '.' + ext;
    var filepath = TOKEN_ICON_DIR + '/' + filename;
    try { fs.writeFileSync(filepath, buf); }
    catch (e) { return res.status(500).json({ error: '파일 저장 실패: ' + e.message }); }

    var url = '/uploads/tokens/' + filename + '?v=' + Date.now();  // 캐시 무효화 querystring
    res.json({ ok: true, url: url, size: buf.length });
});

// 백서 PDF 업로드
var WHITEPAPER_DIR = '/var/www/uploads/whitepapers';

app.post('/api/admin/upload/token-whitepaper', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var body = req.body || {};
    var dataUrl = (body.dataUrl || '').toString();
    var ticker = (body.ticker || '').toString().toUpperCase().replace(/[^A-Z0-9_-]/g, '');

    if (!dataUrl) return res.status(400).json({ error: '파일 데이터가 없습니다' });
    if (!ticker) return res.status(400).json({ error: '티커를 지정하세요' });

    var match = dataUrl.match(/^data:application\/pdf;base64,(.+)$/i);
    if (!match) return res.status(400).json({ error: 'PDF 파일만 업로드 가능합니다' });

    var buf;
    try { buf = Buffer.from(match[1], 'base64'); }
    catch (e) { return res.status(400).json({ error: 'base64 디코딩 실패' }); }
    if (buf.length > 8 * 1024 * 1024) return res.status(400).json({ error: 'PDF가 너무 큽니다 (최대 8MB)' });
    if (buf.length < 1024) return res.status(400).json({ error: 'PDF가 너무 작거나 손상됨' });
    // PDF magic number 검증
    if (buf.slice(0, 4).toString() !== '%PDF') return res.status(400).json({ error: 'PDF 형식이 아닙니다' });

    try { if (!fs.existsSync(WHITEPAPER_DIR)) fs.mkdirSync(WHITEPAPER_DIR, { recursive: true }); }
    catch (e) { return res.status(500).json({ error: '저장 디렉토리 생성 실패: ' + e.message }); }

    var filename = ticker + '_whitepaper.pdf';
    var filepath = WHITEPAPER_DIR + '/' + filename;
    try { fs.writeFileSync(filepath, buf); }
    catch (e) { return res.status(500).json({ error: '파일 저장 실패: ' + e.message }); }

    var url = '/uploads/whitepapers/' + filename + '?v=' + Date.now();
    res.json({ ok: true, url: url, size: buf.length });
});


// ─────────────────────────────────────────────────────────
//  후원 주소 (3채널: BTC / MBC / USDT-TRC20)
// ─────────────────────────────────────────────────────────
var DONATE_FILE = '/home/ubuntu/board_data/donate.json';
var DONATE_KEYS = ['btc', 'mbc', 'usdt'];

function loadDonate() {
    try { return JSON.parse(fs.readFileSync(DONATE_FILE, 'utf8')); }
    catch (e) {
        return {
            btc: { label: 'Bitcoin (BTC)', address: '', network: 'BTC Network' },
            mbc: { label: 'MicroBitcoin (MBC)', address: '', network: 'MBC Network' },
            usdt: { label: 'USDT (TRC20)', address: '', network: 'Tron Network (TRC20)' }
        };
    }
}

function saveDonate(data) {
    var tmp = DONATE_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, DONATE_FILE);
}

// 공개 GET
app.get('/api/donate', function(req, res) {
    res.json(loadDonate());
});

// 어드민 전용 PUT
app.put('/api/admin/donate', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var body = req.body || {};
    var current = loadDonate();
    for (var i = 0; i < DONATE_KEYS.length; i++) {
        var k = DONATE_KEYS[i];
        if (!body[k]) continue;
        if (!current[k]) current[k] = {};
        if (typeof body[k].address === 'string') current[k].address = body[k].address.trim().slice(0, 200);
        if (typeof body[k].label === 'string') current[k].label = body[k].label.trim().slice(0, 100);
        if (typeof body[k].network === 'string') current[k].network = body[k].network.trim().slice(0, 100);
    }
    saveDonate(current);
    res.json({ ok: true, data: current });
});


// ─────────────────────────────────────────────────────────
//  채굴풀 주소 관리 (어드민 전용)
// ─────────────────────────────────────────────────────────

// 등록된 풀 주소 목록
app.get('/api/admin/pools', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    try {
        var arr = transfersDb.getPoolAddresses();
        var poolCount = 0;
        try {
            var db = require('better-sqlite3')('/home/ubuntu/transfers.db', { readonly: true });
            db.pragma('journal_mode = WAL');
            poolCount = db.prepare('SELECT COUNT(*) AS c FROM transfers WHERE is_pool = 1').get().c;
            db.close();
        } catch (e) {}
        res.json({
            addresses: arr.map(function(x) { return typeof x === 'string' ? { address: x } : x; }),
            taggedCount: poolCount
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 풀 주소 추가 (객체 또는 문자열로 받음)
app.post('/api/admin/pools', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var body = req.body || {};
    var addr = (body.address || '').toString().trim();
    var label = (body.label || '').toString().trim();
    if (!addr) return res.status(400).json({ error: '주소를 입력하세요' });
    if (!/^[Bb][a-zA-Z0-9]{25,40}$/.test(addr) && !/^mbc1q[a-z0-9]{30,60}$/.test(addr)) {
        return res.status(400).json({ error: '유효한 MBC 주소 형식이 아닙니다 (B, b, mbc1q로 시작)' });
    }
    try {
        var arr = transfersDb.getPoolAddresses();
        // 중복 체크
        var exists = arr.some(function(x) { return (x.address || x) === addr; });
        if (exists) return res.status(409).json({ error: '이미 등록된 주소입니다' });
        arr.push(label ? { address: addr, label: label } : { address: addr });
        transfersDb.savePoolAddresses(arr);
        var tagged = transfersDb.syncPoolMarking();
        res.json({ ok: true, address: addr, taggedTotal: tagged });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 풀 주소 라벨 수정
app.put('/api/admin/pools/:address', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var addr = req.params.address;
    var body = req.body || {};
    var label = (body.label || '').toString().trim();
    try {
        var arr = transfersDb.getPoolAddresses();
        var found = false;
        arr = arr.map(function(x) {
            var a = x.address || x;
            if (a === addr) { found = true; return label ? { address: a, label: label } : { address: a }; }
            return x;
        });
        if (!found) return res.status(404).json({ error: '주소를 찾을 수 없습니다' });
        transfersDb.savePoolAddresses(arr);
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 풀 주소 삭제
app.delete('/api/admin/pools/:address', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var addr = req.params.address;
    try {
        var arr = transfersDb.getPoolAddresses();
        var nextArr = arr.filter(function(x) { return (x.address || x) !== addr; });
        if (nextArr.length === arr.length) return res.status(404).json({ error: '주소를 찾을 수 없습니다' });
        transfersDb.savePoolAddresses(nextArr);
        var tagged = transfersDb.syncPoolMarking();
        res.json({ ok: true, taggedTotal: tagged });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 풀 후보 자동 추출 (송금 횟수 많은 상위 주소) — 10분 메모리 캐시
app.get('/api/admin/pools/candidates', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    try {
        var minCount = parseInt(req.query.minCount) || 5;
        var limit = parseInt(req.query.limit) || 30;
        var cacheKey = minCount + ':' + limit;
        // 캐시 hit
        if (poolCandidatesCache.data && poolCandidatesCache.key === cacheKey &&
            (Date.now() - poolCandidatesCache.ts) < POOL_CANDIDATES_TTL) {
            return res.json(poolCandidatesCache.data);
        }
        var candidates = transfersDb.getPoolCandidates(minCount, limit);
        var registered = new Set(transfersDb.getPoolAddresses().map(function(x) { return x.address || x; }));
        var result = {
            candidates: candidates.map(function(c) {
                return { address: c.address, count: c.count, registered: registered.has(c.address) };
            }),
            cachedAt: new Date().toISOString()
        };
        poolCandidatesCache = { ts: Date.now(), key: cacheKey, data: result };
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// DB의 is_pool 컬럼을 풀 주소 리스트에 맞춰 재동기화 (수동 트리거)
app.post('/api/admin/pools/sync', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    try {
        var tagged = transfersDb.syncPoolMarking();
        res.json({ ok: true, taggedTotal: tagged });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// ─────────────────────────────────────────────────────────
//  트랜잭션 DB API (etherscan 스타일) — 30초 메모리 캐시
// ─────────────────────────────────────────────────────────
var txListCache = {};
var TX_LIST_TTL = 5 * 60 * 1000;
function pruneTxCache() {
    var now = Date.now();
    var keys = Object.keys(txListCache);
    if (keys.length > 200) {
        keys.forEach(function(k) { if (now - txListCache[k].ts > TX_LIST_TTL) delete txListCache[k]; });
    }
}
app.get('/api/transactions', function(req, res) {
    try {
        var page = parseInt(req.query.page) || 1;
        var perPage = parseInt(req.query.perPage) || 25;
        var excludePool = req.query.excludePool === '1' || req.query.excludePool === 'true';
        var excludeDust = req.query.excludeDust === '1' || req.query.excludeDust === 'true';
        var dustThreshold = parseInt(req.query.dustThreshold);
        var address = (req.query.address || '').toString().trim();
        // 캐시 키 = 모든 파라미터
        var key = 'tx:' + page + ':' + perPage + ':' + excludePool + ':' + excludeDust + ':' + dustThreshold + ':' + address;
        var c = txListCache[key];
        if (c && (Date.now() - c.ts) < TX_LIST_TTL) {
            return res.json(c.data);
        }
        var result = transfersDb.listTransfers({
            page: page,
            perPage: perPage,
            excludePool: excludePool,
            excludeDust: excludeDust,
            dustThreshold: dustThreshold,
            address: address
        });
        txListCache[key] = { ts: Date.now(), data: result };
        pruneTxCache();
        res.json(result);
    } catch (e) {
        res.status(500).json({ error: e.message || String(e) });
    }
});

app.get('/api/transactions/stats', function(req, res) {
    try {
        var s = transfersDb.stats();
        res.json(s);
    } catch (e) {
        res.status(500).json({ error: e.message || String(e) });
    }
});

// ── 🐳 Whale Alert (대형 거래) — 60초 메모리 캐시 ─────────────────────
var whaleCache = {};
var WHALE_TTL = 5 * 60 * 1000;
app.get('/api/whales', function(req, res) {
    try {
        var page = parseInt(req.query.page) || 1;
        var perPage = Math.min(100, Math.max(10, parseInt(req.query.perPage) || 25));
        var threshold = parseInt(req.query.threshold) || 1000000000000; // 기본 1억 MBC × 10000
        var excludePool = req.query.excludePool === '1' || req.query.excludePool === 'true';
        var key = 'w:' + page + ':' + perPage + ':' + threshold + ':' + excludePool;
        var c = whaleCache[key];
        if (c && (Date.now() - c.ts) < WHALE_TTL) {
            return res.json(c.data);
        }
        var result = transfersDb.listTransfers({
            page: page,
            perPage: perPage,
            excludePool: excludePool,
            excludeDust: true,
            dustThreshold: threshold
        });
        return fillMissingFromAddresses(result.items).then(function() {
        // 24시간 신규 (전체 카운트)
        var s = transfersDb.stats();
        // 24h count는 별도 쿼리로 추출
        try {
            var oneDayAgo = Math.floor(Date.now() / 1000) - 86400;
            result.count24h = transfersDb.countLargeSince(threshold, oneDayAgo, excludePool);
        } catch (e) { result.count24h = 0; }
            result.items = removeSelfTransfers(result.items);
            result.latestBlock = s.latestBlock || 0;
        result.threshold = threshold;
        whaleCache[key] = { ts: Date.now(), data: result };
        // 캐시 항목 너무 많이 쌓이지 않게 정리
        var wkeys = Object.keys(whaleCache);
        if (wkeys.length > 50) {
            var now = Date.now();
            wkeys.forEach(function(k) { if (now - whaleCache[k].ts > WHALE_TTL) delete whaleCache[k]; });
        }
        res.json(result);
        }).catch(function() {
            res.json(result);
        });
    } catch (e) {
        res.status(500).json({ error: e.message || String(e) });
    }
});

// ─────────────────────────────────────────────────────────
//  게시판 시스템 (News / Q&A / Links)
// ─────────────────────────────────────────────────────────
var BOARD_DIR = '/home/ubuntu/board_data';
var PUBLIC_BOARD_DIR = '/var/www/html/data/board';
var BOARD_TYPES = ['news', 'qna', 'lab', 'links', 'tokens'];

// 어드민 비밀번호 로드
var ADMIN_PASSWORD = '';
try {
    var cfg = fs.readFileSync('/home/ubuntu/.admin_config', 'utf8');
    var m = cfg.match(/^PASSWORD=(.+)$/m);
    if (m) ADMIN_PASSWORD = m[1].trim();
} catch (e) { console.error('admin config load failed:', e.message); }

// 활성 토큰 (메모리). 서버 재시작 시 자동 만료.
var adminTokens = {};
var ADMIN_TOKEN_TTL = 12 * 60 * 60 * 1000; // 12시간

function newAdminToken() {
    var token = crypto.randomBytes(32).toString('hex');
    adminTokens[token] = Date.now() + ADMIN_TOKEN_TTL;
    return token;
}

function isAdmin(req) {
    var h = req.headers['authorization'] || '';
    var token = h.replace(/^Bearer\s+/, '').trim();
    if (!token) return false;
    var exp = adminTokens[token];
    if (!exp) return false;
    if (Date.now() > exp) { delete adminTokens[token]; return false; }
    return true;
}

function boardFile(type) {
    if (BOARD_TYPES.indexOf(type) < 0) return null;
    return path.join(BOARD_DIR, type + '.json');
}

function loadBoard(type) {
    var f = boardFile(type);
    if (!f) return null;
    try { return JSON.parse(fs.readFileSync(f, 'utf8')); }
    catch (e) { return []; }
}

function saveBoard(type, data) {
    var f = boardFile(type);
    if (!f) return false;
    var tmp = f + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
    fs.renameSync(tmp, f);
    writePublicBoard(type, data);
    return true;
}

function publicBoardFile(type) {
    if (BOARD_TYPES.indexOf(type) < 0) return null;
    return path.join(PUBLIC_BOARD_DIR, type + '.json');
}

function publicBoardPayload(type, data) {
    data = Array.isArray(data) ? data : [];
    if (type === 'qna') {
        var visible = publicQnaItems(data);
        return {
            items: visible.map(function(it) {
                var s = sanitizeQna(it);
                s.hasReply = !!(it.replies && it.replies.length > 0);
                s.replyCount = it.replies ? it.replies.length : 0;
                return s;
            }),
            total: visible.length,
            updatedAt: new Date().toISOString()
        };
    }
    return {
        items: data,
        total: data.length,
        updatedAt: new Date().toISOString()
    };
}

function writePublicBoard(type, data) {
    var f = publicBoardFile(type);
    if (!f) return false;
    try {
        if (!fs.existsSync(PUBLIC_BOARD_DIR)) fs.mkdirSync(PUBLIC_BOARD_DIR, { recursive: true });
        var tmp = f + '.tmp';
        fs.writeFileSync(tmp, JSON.stringify(publicBoardPayload(type, data)));
        fs.renameSync(tmp, f);
        return true;
    } catch (e) {
        console.error('[board-cache] write failed:', type, e.message);
        return false;
    }
}

function refreshPublicBoards() {
    BOARD_TYPES.forEach(function(type) {
        writePublicBoard(type, loadBoard(type) || []);
    });
}

refreshPublicBoards();

// ── 어드민 로그인 ────────────────────────────────────────
app.post('/api/admin/login', function(req, res) {
    var pw = (req.body && req.body.password) || '';
    if (!ADMIN_PASSWORD) return res.status(500).json({ error: '서버 어드민 비밀번호 미설정' });
    // timing-safe compare
    var a = Buffer.from(pw);
    var b = Buffer.from(ADMIN_PASSWORD);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
        return res.status(401).json({ error: '비밀번호가 틀렸습니다' });
    }
    var token = newAdminToken();
    res.json({ token: token, expiresIn: ADMIN_TOKEN_TTL });
});

app.post('/api/admin/logout', function(req, res) {
    var h = req.headers['authorization'] || '';
    var token = h.replace(/^Bearer\s+/, '').trim();
    if (token) delete adminTokens[token];
    res.json({ ok: true });
});

app.get('/api/admin/check', function(req, res) {
    res.json({ admin: isAdmin(req) });
});

// ── 게시판 읽기 (누구나) ────────────────────────────────
app.get('/api/board/:type', function(req, res) {
    var data = loadBoard(req.params.type);
    if (data === null) return res.status(404).json({ error: 'unknown board' });
    res.json({ items: data });
});

// ── 게시판 작성/수정/삭제 (어드민만) ────────────────────
app.post('/api/board/:type', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var data = loadBoard(req.params.type);
    if (data === null) return res.status(404).json({ error: 'unknown board' });

    var body = req.body || {};
    var item = {
        id: Date.now().toString(36) + crypto.randomBytes(3).toString('hex'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    if (req.params.type === 'news' || req.params.type === 'qna' || req.params.type === 'lab') {
        item.title = (body.title || '').toString().slice(0, 200);
        item.content = (body.content || '').toString().slice(0, 20000);
        if (req.params.type === 'qna') {
            item.question = item.title;
            item.answer = item.content;
        }
    } else if (req.params.type === 'links') {
        item.name = (body.name || '').toString().slice(0, 100);
        item.url = (body.url || '').toString().slice(0, 500);
        item.description = (body.description || '').toString().slice(0, 300);
    } else if (req.params.type === 'tokens') {
        item.ticker = (body.ticker || '').toString().toUpperCase().slice(0, 20);
        item.name = (body.name || '').toString().slice(0, 100);
        item.description = (body.description || '').toString().slice(0, 500);
        item.url = (body.url || '').toString().slice(0, 500);
        item.supply = (body.supply || '').toString().slice(0, 50);
        item.iconUrl = (body.iconUrl || '').toString().slice(0, 500);
        item.whitepaperUrl = (body.whitepaperUrl || '').toString().slice(0, 500);
    }

    data.unshift(item);
    saveBoard(req.params.type, data);
    res.json({ ok: true, item: item });
});

app.put('/api/board/:type/:id', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var data = loadBoard(req.params.type);
    if (data === null) return res.status(404).json({ error: 'unknown board' });
    var idx = data.findIndex(function(x) { return x.id === req.params.id; });
    if (idx < 0) return res.status(404).json({ error: 'item not found' });

    var body = req.body || {};
    var item = data[idx];
    if (req.params.type === 'news' || req.params.type === 'qna' || req.params.type === 'lab') {
        if (body.title != null) item.title = body.title.toString().slice(0, 200);
        if (body.content != null) item.content = body.content.toString().slice(0, 20000);
        if (req.params.type === 'qna') {
            item.question = item.title;
            item.answer = item.content;
        }
    } else if (req.params.type === 'links') {
        if (body.name != null) item.name = body.name.toString().slice(0, 100);
        if (body.url != null) item.url = body.url.toString().slice(0, 500);
        if (body.description != null) item.description = body.description.toString().slice(0, 300);
    } else if (req.params.type === 'tokens') {
        if (body.ticker != null) item.ticker = body.ticker.toString().toUpperCase().slice(0, 20);
        if (body.name != null) item.name = body.name.toString().slice(0, 100);
        if (body.description != null) item.description = body.description.toString().slice(0, 500);
        if (body.url != null) item.url = body.url.toString().slice(0, 500);
        if (body.supply != null) item.supply = body.supply.toString().slice(0, 50);
        if (body.iconUrl != null) item.iconUrl = body.iconUrl.toString().slice(0, 500);
        if (body.whitepaperUrl != null) item.whitepaperUrl = body.whitepaperUrl.toString().slice(0, 500);
    }
    item.updatedAt = new Date().toISOString();
    data[idx] = item;
    saveBoard(req.params.type, data);
    res.json({ ok: true, item: item });
});

app.delete('/api/board/:type/:id', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var data = loadBoard(req.params.type);
    if (data === null) return res.status(404).json({ error: 'unknown board' });
    var next = data.filter(function(x) { return x.id !== req.params.id; });
    if (next.length === data.length) return res.status(404).json({ error: 'item not found' });
    saveBoard(req.params.type, next);
    res.json({ ok: true });
});

// ── 게시판 항목 순서 변경 (up/down) — links, tokens 전용 ─────────
app.post('/api/board/:type/:id/move', function(req, res) {
    if (!isAdmin(req)) return res.status(401).json({ error: 'unauthorized' });
    var type = req.params.type;
    if (type !== 'links' && type !== 'tokens') return res.status(400).json({ error: 'reorder not allowed for this board' });
    var data = loadBoard(type);
    if (data === null) return res.status(404).json({ error: 'unknown board' });
    var dir = (req.body && req.body.direction) || '';
    if (dir !== 'up' && dir !== 'down') return res.status(400).json({ error: 'direction must be up or down' });
    var idx = data.findIndex(function(x) { return x.id === req.params.id; });
    if (idx < 0) return res.status(404).json({ error: 'item not found' });
    var swap = dir === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= data.length) return res.json({ ok: true, moved: false });
    var tmp = data[idx]; data[idx] = data[swap]; data[swap] = tmp;
    saveBoard(type, data);
    res.json({ ok: true, moved: true });
});


app.listen(3000, function() {
    console.log('[' + new Date().toISOString() + '] API Server Started on port 3000');
});
