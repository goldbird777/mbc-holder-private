// transfers_db.js — SQLite 모듈 (incremental_scan + server.js 공용)
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = '/home/ubuntu/transfers.db';
const POOL_ADDR_PATH = '/home/ubuntu/pool_addresses.json';

let db = null;

function open() {
    if (db) return db;
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    db.pragma('cache_size = -32000');  // 32MB: keep API memory modest on 1GB hosts
    db.pragma('temp_store = MEMORY');
    db.pragma('busy_timeout = 5000');
    db.pragma('mmap_size = 268435456');
    init();
    return db;
}

function init() {
    db.exec(`
        CREATE TABLE IF NOT EXISTS transfers (
            txid TEXT NOT NULL,
            vout_idx INTEGER NOT NULL,
            block INTEGER NOT NULL,
            time INTEGER NOT NULL,
            from_addr TEXT,
            to_addr TEXT,
            amount INTEGER NOT NULL,
            is_pool INTEGER DEFAULT 0,
            PRIMARY KEY (txid, vout_idx)
        );
        CREATE INDEX IF NOT EXISTS idx_block_desc ON transfers(block DESC);
        CREATE INDEX IF NOT EXISTS idx_time_desc ON transfers(time DESC);
        CREATE INDEX IF NOT EXISTS idx_from ON transfers(from_addr);
        CREATE INDEX IF NOT EXISTS idx_to ON transfers(to_addr);
        CREATE INDEX IF NOT EXISTS idx_amount_time ON transfers(amount, time);
        CREATE INDEX IF NOT EXISTS idx_pool_amount_time ON transfers(is_pool, amount, time);
        CREATE TABLE IF NOT EXISTS scan_progress (
            key TEXT PRIMARY KEY,
            value INTEGER NOT NULL
        );
    `);
}

function getProgress(key) {
    const row = db.prepare('SELECT value FROM scan_progress WHERE key = ?').get(key);
    return row ? row.value : 0;
}

function setProgress(key, value) {
    db.prepare('INSERT OR REPLACE INTO scan_progress(key, value) VALUES(?, ?)').run(key, value);
}

// 풀 주소 캐시 (10분)
let poolCache = { ts: 0, set: new Set() };
function loadPoolAddresses() {
    if (Date.now() - poolCache.ts < 10 * 60 * 1000) return poolCache.set;
    try {
        const fs = require('fs');
        const arr = JSON.parse(fs.readFileSync(POOL_ADDR_PATH, 'utf8'));
        poolCache = { ts: Date.now(), set: new Set(arr.map(x => (x.address || x).trim())) };
    } catch (e) {
        poolCache = { ts: Date.now(), set: new Set() };
    }
    return poolCache.set;
}

function reloadPoolAddresses() {
    poolCache = { ts: 0, set: new Set() };
    return loadPoolAddresses();
}

function getPoolAddresses() {
    try {
        const fs = require('fs');
        return JSON.parse(fs.readFileSync(POOL_ADDR_PATH, 'utf8'));
    } catch (e) { return []; }
}

function savePoolAddresses(arr) {
    const fs = require('fs');
    fs.writeFileSync(POOL_ADDR_PATH, JSON.stringify(arr, null, 2));
    reloadPoolAddresses();
}

// 전체 DB의 is_pool 컬럼을 현재 풀 주소 리스트에 맞춰 다시 마킹
function syncPoolMarking() {
    const addresses = getPoolAddresses().map(x => (x.address || x).trim()).filter(Boolean);
    const tx = db.transaction(() => {
        db.prepare('UPDATE transfers SET is_pool = 0 WHERE is_pool = 1').run();
        const stmt = db.prepare('UPDATE transfers SET is_pool = 1 WHERE from_addr = ?');
        for (const a of addresses) stmt.run(a);
    });
    tx();
    return db.prepare('SELECT COUNT(*) AS c FROM transfers WHERE is_pool = 1').get().c;
}

// 풀 후보 자동 추출 (송금 횟수 많은 주소)
function getPoolCandidates(minCount, limit) {
    minCount = minCount || 5;
    limit = limit || 20;
    return db.prepare(`
        SELECT from_addr AS address, COUNT(*) AS count
        FROM transfers
        WHERE from_addr IS NOT NULL
        GROUP BY from_addr
        HAVING count >= ?
        ORDER BY count DESC
        LIMIT ?
    `).all(minCount, limit);
}

// 단일 transfer INSERT (중복 시 무시) — vout 단위
const insertStmtCache = { stmt: null };
function insertTransfer(t) {
    if (!insertStmtCache.stmt) {
        insertStmtCache.stmt = db.prepare(
            'INSERT OR IGNORE INTO transfers(txid, vout_idx, block, time, from_addr, to_addr, amount, is_pool) VALUES (@txid, @vout_idx, @block, @time, @from_addr, @to_addr, @amount, @is_pool)'
        );
    }
    const pools = loadPoolAddresses();
    const isPool = (t.from_addr && pools.has(t.from_addr)) ? 1 : 0;
    insertStmtCache.stmt.run({
        txid: t.txid,
        vout_idx: t.vout_idx,
        block: t.block,
        time: t.time,
        from_addr: t.from_addr || null,
        to_addr: t.to_addr || null,
        amount: t.amount,
        is_pool: isPool
    });
}

function insertTransfersBatch(arr) {
    if (!arr || arr.length === 0) return;
    const tx = db.transaction((items) => {
        for (const t of items) insertTransfer(t);
    });
    tx(arr);
}

// 검색/페이지네이션
function listTransfers(opts) {
    opts = opts || {};
    const page = Math.max(1, parseInt(opts.page) || 1);
    const perPage = Math.min(100, Math.max(10, parseInt(opts.perPage) || 25));
    const offset = (page - 1) * perPage;
    const excludePool = opts.excludePool ? 1 : 0;
    const address = (opts.address || '').trim();

    let where = '1=1';
    const params = {};
    if (excludePool) where += ' AND is_pool = 0';
    if (opts.excludeDust) {
        const threshold = parseInt(opts.dustThreshold);
        params.dustThreshold = (threshold > 0) ? threshold : 10000;  // 기본 1 MBC = 10000 units
        where += ' AND amount >= @dustThreshold';
    }
    if (address) {
        where += ' AND (from_addr = @addr OR to_addr = @addr)';
        params.addr = address;
    }

    const totalRow = db.prepare(`SELECT COUNT(*) AS c FROM transfers WHERE ${where}`).get(params);
    const total = totalRow.c;
    const totalPages = Math.ceil(total / perPage);

    let rows;
    const reverseOffset = Math.max(0, total - offset - perPage);
    if (reverseOffset < offset) {
        rows = db.prepare(`
            SELECT txid, block, time, from_addr, to_addr, amount, is_pool
            FROM transfers
            WHERE ${where}
            ORDER BY block ASC, txid DESC
            LIMIT @perPage OFFSET @reverseOffset
        `).all(Object.assign({}, params, { perPage: perPage, reverseOffset: reverseOffset })).reverse();
    } else {
        rows = db.prepare(`
            SELECT txid, block, time, from_addr, to_addr, amount, is_pool
            FROM transfers
            WHERE ${where}
            ORDER BY block DESC, txid
            LIMIT @perPage OFFSET @offset
        `).all(Object.assign({}, params, { perPage: perPage, offset: offset }));
    }

    return {
        total: total,
        page: page,
        perPage: perPage,
        totalPages: Math.ceil(total / perPage),
        items: rows.map(r => ({
            txid: r.txid,
            block: r.block,
            time: r.time,
            from: r.from_addr,
            to: r.to_addr,
            amount: r.amount,
            is_pool: !!r.is_pool
        }))
    };
}

function recentTransfers(limit) {
    limit = Math.min(100, Math.max(1, parseInt(limit) || 50));
    return db.prepare(`
        SELECT txid, block, time, from_addr, to_addr, amount, is_pool
        FROM transfers
        ORDER BY block DESC, txid
        LIMIT ?
    `).all(limit).map(r => ({
        txid: r.txid,
        block: r.block,
        time: r.time,
        from: r.from_addr,
        to: r.to_addr,
        amount: r.amount,
        is_pool: !!r.is_pool
    }));
}

let statsCache = { ts: 0, data: null };
function stats() {
    if (statsCache.data && Date.now() - statsCache.ts < 30000) return statsCache.data;
    const total = db.prepare('SELECT COUNT(*) AS c FROM transfers').get().c;
    const latest = db.prepare('SELECT MAX(block) AS b FROM transfers').get().b;
    const earliest = db.prepare('SELECT MIN(block) AS b FROM transfers').get().b;
    const fullscanCursor = getProgress('fullscan_block');
    const lastIncremental = getProgress('last_incremental_block');
    statsCache = { ts: Date.now(), data: {
        total: total,
        latestBlock: latest,
        earliestBlock: earliest,
        fullscanCursor: fullscanCursor,
        lastIncremental: lastIncremental
    } };
    return statsCache.data;
}

function countLargeSince(threshold, sinceTime, excludePool) {
    threshold = parseInt(threshold) || 0;
    sinceTime = parseInt(sinceTime) || 0;
    if (excludePool) {
        return db.prepare('SELECT COUNT(*) AS c FROM transfers WHERE is_pool = 0 AND amount >= ? AND time >= ?').get(threshold, sinceTime).c;
    }
    return db.prepare('SELECT COUNT(*) AS c FROM transfers WHERE amount >= ? AND time >= ?').get(threshold, sinceTime).c;
}

module.exports = {
    open,
    init,
    insertTransfer,
    insertTransfersBatch,
    listTransfers,
    recentTransfers,
    stats,
    getProgress,
    setProgress,
    getPoolAddresses,
    savePoolAddresses,
    syncPoolMarking,
    getPoolCandidates,
    countLargeSince,
    reloadPoolAddresses
};
