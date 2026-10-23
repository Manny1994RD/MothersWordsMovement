// Mother's Words Movement tracker: a small zero-dependency server (Node 22+).
// Stores counts only; members are anonymous device tokens tied to a church.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

const PORT = Number(process.env.PORT || 8080);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const ADMIN_PIN = process.env.ADMIN_PIN || 'changeme';
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_PER_DAY = 50;
// Counters members enter each day. Metrics with a goal get a goal_<key> column on churches.
const METRICS = [
  { key: 'visits', goal: true },
  { key: 'returned', goal: true },
  { key: 'prayers', goal: false },
  { key: 'letters', goal: true },
];
const GOAL_METRICS = METRICS.filter((m) => m.goal);

fs.mkdirSync(DATA_DIR, { recursive: true });
const db = new DatabaseSync(path.join(DATA_DIR, 'movement.db'));
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL);
  CREATE TABLE IF NOT EXISTS churches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    join_code TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS members (
    token TEXT PRIMARY KEY,
    church_id INTEGER NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS entries (
    member TEXT NOT NULL REFERENCES members(token) ON DELETE CASCADE,
    church_id INTEGER NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    PRIMARY KEY (member, day)
  );
  CREATE TABLE IF NOT EXISTS checklist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text_en TEXT NOT NULL,
    text_es TEXT NOT NULL,
    sort INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS checklist_done (
    member TEXT NOT NULL REFERENCES members(token) ON DELETE CASCADE,
    church_id INTEGER NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
    item_id INTEGER NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    PRIMARY KEY (member, item_id, day)
  );
  CREATE TABLE IF NOT EXISTS daily_words (
    day_number INTEGER PRIMARY KEY,
    text_en TEXT NOT NULL DEFAULT '',
    text_es TEXT NOT NULL DEFAULT ''
  );
  -- Counts a leader or the elder enters on behalf of members who can't use the app.
  CREATE TABLE IF NOT EXISTS manual_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    church_id INTEGER NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    practiced INTEGER NOT NULL DEFAULT 0,
    entered_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS testimonies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    church_id INTEGER NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

// Add metric columns so new metrics appear on existing databases too.
function addColumn(table, column, type = 'INTEGER NOT NULL DEFAULT 0') {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
  if (!cols.includes(column)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
}
for (const m of METRICS) addColumn('entries', m.key);
for (const m of METRICS) addColumn('manual_entries', m.key);
for (const m of GOAL_METRICS) addColumn('churches', `goal_${m.key}`);
addColumn('churches', 'leader_pin', "TEXT NOT NULL DEFAULT ''");

const DEFAULT_SETTINGS = {
  region_name: 'Our Region',
  start_date: '2026-11-01',
  end_date: '2026-12-10',
};
for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
  db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').run(k, v);
}
if (db.prepare('SELECT COUNT(*) AS n FROM checklist_items').get().n === 0) {
  const seed = require('./seed-checklist.json');
  const ins = db.prepare('INSERT INTO checklist_items (text_en, text_es, sort) VALUES (?, ?, ?)');
  seed.forEach((item, i) => ins.run(item.en, item.es, i));
}

function getSettings() {
  const out = {};
  for (const row of db.prepare('SELECT key, value FROM settings').all()) out[row.key] = row.value;
  return out;
}

// "Today" follows the container's TZ environment variable.
function today() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function daysBetween(a, b) {
  return Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000);
}

function campaignInfo() {
  const s = getSettings();
  const t = today();
  const total = daysBetween(s.start_date, s.end_date) + 1;
  const dayNumber = daysBetween(s.start_date, t) + 1;
  return { ...s, today: t, total_days: total, day_number: dayNumber };
}

function streak(token) {
  const days = new Set(
    db.prepare('SELECT DISTINCT day FROM checklist_done WHERE member = ?').all(token).map((r) => r.day)
  );
  let count = 0;
  const d = new Date(today() + 'T12:00:00Z');
  // A streak still counts if today isn't done yet but yesterday was.
  if (!days.has(d.toISOString().slice(0, 10))) d.setUTCDate(d.getUTCDate() - 1);
  while (days.has(d.toISOString().slice(0, 10))) {
    count++;
    d.setUTCDate(d.getUTCDate() - 1);
  }
  return count;
}

// Member entries and leader/elder manual entries, combined.
function allEntriesSql() {
  const cols = METRICS.map((m) => m.key).join(', ');
  return `SELECT church_id, day, ${cols}, 0 AS practiced FROM entries
    UNION ALL SELECT church_id, day, ${cols}, practiced FROM manual_entries`;
}

function churchTotals() {
  const { start_date, end_date } = getSettings();
  const goals = GOAL_METRICS.map((m) => `c.goal_${m.key}`).join(', ');
  const sums = METRICS.map((m) => `COALESCE(t.${m.key}, 0) AS ${m.key}`).join(', ');
  return db.prepare(`
    SELECT c.id, c.name, ${goals}, ${sums},
      (SELECT COUNT(*) FROM checklist_done d WHERE d.church_id = c.id AND d.day BETWEEN ? AND ?)
        + COALESCE(t.practiced, 0) AS practiced,
      (SELECT COUNT(*) FROM members m WHERE m.church_id = c.id) AS members
    FROM churches c
    LEFT JOIN (
      SELECT church_id, ${METRICS.map((m) => `SUM(${m.key}) AS ${m.key}`).join(', ')}, SUM(practiced) AS practiced
      FROM (${allEntriesSql()}) WHERE day BETWEEN ? AND ? GROUP BY church_id
    ) t ON t.church_id = c.id
    ORDER BY c.name
  `).all(start_date, end_date, start_date, end_date);
}

function regionSummary() {
  const churches = churchTotals();
  const sum = (k) => churches.reduce((a, c) => a + c[k], 0);
  const out = { practiced: sum('practiced'), members: sum('members') };
  for (const m of METRICS) out[m.key] = sum(m.key);
  for (const m of GOAL_METRICS) out[`goal_${m.key}`] = sum(`goal_${m.key}`);
  return out;
}

function dailySeries() {
  const { start_date, end_date } = getSettings();
  const zero = () => Object.fromEntries([...METRICS.map((m) => [m.key, 0]), ['practiced', 0]]);
  const byDay = {};
  const rows = db.prepare(`
    SELECT day, ${METRICS.map((m) => `SUM(${m.key}) AS ${m.key}`).join(', ')}, SUM(practiced) AS practiced
    FROM (${allEntriesSql()}) WHERE day BETWEEN ? AND ? GROUP BY day
  `).all(start_date, end_date);
  for (const { day, ...r } of rows) byDay[day] = { ...zero(), ...r };
  const practiced = db.prepare(`
    SELECT day, COUNT(*) AS n FROM checklist_done WHERE day BETWEEN ? AND ? GROUP BY day
  `).all(start_date, end_date);
  for (const r of practiced) (byDay[r.day] ||= zero()).practiced += r.n;
  return byDay;
}

// ---------- HTTP helpers ----------
function send(res, status, body, headers = {}) {
  const isJson = typeof body !== 'string' && !Buffer.isBuffer(body);
  res.writeHead(status, {
    'Content-Type': isJson ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
    ...headers,
  });
  res.end(isJson ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 100000) reject(new Error('too large'));
    });
    req.on('end', () => {
      try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new Error('bad json')); }
    });
  });
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

const clampCount = (n) => Math.max(0, Math.min(MAX_PER_DAY, Math.floor(Number(n) || 0)));
const cleanText = (s, max) => String(s ?? '').trim().slice(0, max);

function getMember(req) {
  const token = req.headers['x-member'];
  if (!token) return null;
  return db.prepare('SELECT token, church_id FROM members WHERE token = ?').get(String(token)) || null;
}

// The elder (admin PIN) may act for any church; a leader only for their own church.
function leaderRole(req, churchId) {
  const adminPin = req.headers['x-admin-pin'];
  if (adminPin && safeEqual(adminPin, ADMIN_PIN)) return 'elder';
  const pin = req.headers['x-leader-pin'];
  const church = db.prepare('SELECT leader_pin FROM churches WHERE id = ?').get(Number(churchId));
  if (pin && church && church.leader_pin && safeEqual(pin, church.leader_pin)) return 'leader';
  return null;
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

function serveStatic(req, res, pathname) {
  const rel = pathname === '/' ? '/index.html' : pathname;
  const file = path.normalize(path.join(PUBLIC_DIR, rel));
  if (!file.startsWith(PUBLIC_DIR)) return send(res, 403, 'Forbidden');
  fs.readFile(file, (err, buf) => {
    if (err) {
      // Single-page app: unknown paths fall back to index.html.
      return fs.readFile(path.join(PUBLIC_DIR, 'index.html'), (e2, html) =>
        e2 ? send(res, 404, 'Not found') : send(res, 200, html, { 'Content-Type': MIME['.html'] })
      );
    }
    send(res, 200, buf, {
      'Content-Type': MIME[path.extname(file)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
  });
}

// ---------- API routes ----------
const routes = {
  // Public
  'GET /api/info': () => ({
    campaign: campaignInfo(),
    churches: db.prepare('SELECT id, name FROM churches ORDER BY name').all(),
  }),

  'POST /api/join': (req, body) => {
    const church = db.prepare('SELECT id, join_code FROM churches WHERE id = ?').get(Number(body.church_id));
    if (!church || !safeEqual(cleanText(body.code, 50).toUpperCase(), church.join_code.toUpperCase())) {
      return [403, { error: 'bad_code' }];
    }
    const token = crypto.randomBytes(24).toString('hex');
    db.prepare('INSERT INTO members (token, church_id) VALUES (?, ?)').run(token, church.id);
    return { token, church_id: church.id };
  },

  'GET /api/dashboard': () => {
    const series = dailySeries();
    const testimonies = db.prepare(`
      SELECT t.id, t.text, t.created_at, c.name AS church
      FROM testimonies t JOIN churches c ON c.id = t.church_id
      ORDER BY t.id DESC LIMIT 50
    `).all();
    return { campaign: campaignInfo(), region: regionSummary(), churches: churchTotals(), series, testimonies };
  },

  // Member
  'GET /api/me': (req) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const info = campaignInfo();
    const day = info.today;
    const cols = METRICS.map((x) => x.key).join(', ');
    const entry = db.prepare(`SELECT ${cols} FROM entries WHERE member = ? AND day = ?`).get(m.token, day)
      || Object.fromEntries(METRICS.map((x) => [x.key, 0]));
    const done = db.prepare('SELECT item_id FROM checklist_done WHERE member = ? AND day = ?')
      .all(m.token, day).map((r) => r.item_id);
    const mine = db.prepare(`
      SELECT ${METRICS.map((x) => `COALESCE(SUM(${x.key}), 0) AS ${x.key}`).join(', ')}
      FROM entries WHERE member = ? AND day BETWEEN ? AND ?
    `).get(m.token, info.start_date, info.end_date);
    const word = db.prepare('SELECT text_en, text_es FROM daily_words WHERE day_number = ?').get(info.day_number);
    return {
      campaign: info,
      church: churchTotals().find((c) => c.id === m.church_id),
      region: regionSummary(),
      today: entry,
      totals: mine,
      checklist: db.prepare('SELECT id, text_en, text_es FROM checklist_items ORDER BY sort, id').all(),
      done,
      streak: streak(m.token),
      word: word && (word.text_en || word.text_es) ? word : null,
    };
  },

  'POST /api/me/counts': (req, body) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const keys = METRICS.map((x) => x.key);
    const values = keys.map((k) => clampCount(body[k]));
    db.prepare(`
      INSERT INTO entries (member, church_id, day, ${keys.join(', ')}) VALUES (?, ?, ?, ${keys.map(() => '?').join(', ')})
      ON CONFLICT (member, day) DO UPDATE SET ${keys.map((k) => `${k} = excluded.${k}`).join(', ')}
    `).run(m.token, m.church_id, today(), ...values);
    return { ok: true, ...Object.fromEntries(keys.map((k, i) => [k, values[i]])) };
  },

  'POST /api/me/checklist': (req, body) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const itemId = Number(body.item_id);
    if (!db.prepare('SELECT 1 FROM checklist_items WHERE id = ?').get(itemId)) return [404, { error: 'no_item' }];
    if (body.done) {
      db.prepare('INSERT OR IGNORE INTO checklist_done (member, church_id, item_id, day) VALUES (?, ?, ?, ?)')
        .run(m.token, m.church_id, itemId, today());
    } else {
      db.prepare('DELETE FROM checklist_done WHERE member = ? AND item_id = ? AND day = ?').run(m.token, itemId, today());
    }
    return { ok: true, streak: streak(m.token) };
  },

  'POST /api/testimonies': (req, body) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const text = cleanText(body.text, 500);
    if (text.length < 3) return [400, { error: 'too_short' }];
    db.prepare('INSERT INTO testimonies (church_id, text) VALUES (?, ?)').run(m.church_id, text);
    return { ok: true };
  },

  // Church leaders (and the elder, for any church)
  'POST /api/leader/church': (req, body) => {
    const id = Number(body.church_id);
    const role = leaderRole(req, id);
    if (!role) return [401, { error: 'bad_pin' }];
    const church = churchTotals().find((c) => c.id === id);
    if (!church) return [404, { error: 'no_church' }];
    const entries = db.prepare(`
      SELECT id, day, ${METRICS.map((m) => m.key).join(', ')}, practiced, entered_by, created_at
      FROM manual_entries WHERE church_id = ? ORDER BY id DESC LIMIT 100
    `).all(id);
    return {
      role,
      church,
      entries,
      campaign: campaignInfo(),
      checklist: db.prepare('SELECT id, text_en, text_es FROM checklist_items ORDER BY sort, id').all(),
    };
  },

  'POST /api/leader/goals': (req, body) => {
    const id = Number(body.church_id);
    if (!leaderRole(req, id)) return [401, { error: 'bad_pin' }];
    const goalCols = GOAL_METRICS.map((x) => `goal_${x.key}`);
    const goals = goalCols.map((c) => Math.max(0, Math.floor(Number(body[c]) || 0)));
    db.prepare(`UPDATE churches SET ${goalCols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`).run(...goals, id);
    return { ok: true };
  },

  'POST /api/leader/entry': (req, body) => {
    const id = Number(body.church_id);
    const role = leaderRole(req, id);
    if (!role) return [401, { error: 'bad_pin' }];
    const info = campaignInfo();
    const day = /^\d{4}-\d{2}-\d{2}$/.test(body.day) ? body.day : info.today;
    if (day > info.today) return [400, { error: 'future_date' }];
    const keys = METRICS.map((m) => m.key);
    const values = keys.map((k) => clampCount(body[k]));
    const practiced = Math.max(0, Math.min(MAX_PER_DAY, Math.floor(Number(body.practiced) || 0)));
    if (values.every((v) => v === 0) && practiced === 0) return [400, { error: 'empty' }];
    db.prepare(`
      INSERT INTO manual_entries (church_id, day, ${keys.join(', ')}, practiced, entered_by)
      VALUES (?, ?, ${keys.map(() => '?').join(', ')}, ?, ?)
    `).run(id, day, ...values, practiced, role);
    return { ok: true };
  },

  'POST /api/leader/entry/delete': (req, body) => {
    const id = Number(body.church_id);
    if (!leaderRole(req, id)) return [401, { error: 'bad_pin' }];
    db.prepare('DELETE FROM manual_entries WHERE id = ? AND church_id = ?').run(Number(body.id), id);
    return { ok: true };
  },

  // Admin
  'POST /api/admin/login': () => ({ ok: true }),

  'GET /api/admin/data': () => ({
    settings: getSettings(),
    churches: db.prepare('SELECT * FROM churches ORDER BY name').all(),
    checklist: db.prepare('SELECT * FROM checklist_items ORDER BY sort, id').all(),
    words: db.prepare('SELECT * FROM daily_words ORDER BY day_number').all(),
    testimonies: db.prepare(`
      SELECT t.id, t.text, t.created_at, c.name AS church
      FROM testimonies t JOIN churches c ON c.id = t.church_id ORDER BY t.id DESC
    `).all(),
  }),

  'POST /api/admin/settings': (req, body) => {
    const up = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value');
    const dateRe = /^\d{4}-\d{2}-\d{2}$/;
    if (body.region_name !== undefined) up.run('region_name', cleanText(body.region_name, 100) || 'Our Region');
    for (const k of ['start_date', 'end_date']) {
      if (body[k] !== undefined) {
        if (!dateRe.test(body[k])) return [400, { error: 'bad_date' }];
        up.run(k, body[k]);
      }
    }
    return { ok: true };
  },

  'POST /api/admin/church': (req, body) => {
    const name = cleanText(body.name, 100);
    const code = cleanText(body.join_code, 50);
    const leaderPin = cleanText(body.leader_pin, 50);
    if (!name || !code) return [400, { error: 'name_and_code_required' }];
    const goalCols = GOAL_METRICS.map((x) => `goal_${x.key}`);
    const goals = goalCols.map((c) => Math.max(0, Math.floor(Number(body[c]) || 0)));
    if (body.id) {
      db.prepare(`UPDATE churches SET name = ?, join_code = ?, leader_pin = ?, ${goalCols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`)
        .run(name, code, leaderPin, ...goals, Number(body.id));
    } else {
      db.prepare(`INSERT INTO churches (name, join_code, leader_pin, ${goalCols.join(', ')}) VALUES (?, ?, ?, ${goalCols.map(() => '?').join(', ')})`)
        .run(name, code, leaderPin, ...goals);
    }
    return { ok: true };
  },

  'POST /api/admin/church/delete': (req, body) => {
    db.prepare('DELETE FROM churches WHERE id = ?').run(Number(body.id));
    return { ok: true };
  },

  'POST /api/admin/checklist': (req, body) => {
    const en = cleanText(body.text_en, 300);
    const es = cleanText(body.text_es, 300) || en;
    if (!en) return [400, { error: 'text_required' }];
    const sort = Math.floor(Number(body.sort) || 0);
    if (body.id) {
      db.prepare('UPDATE checklist_items SET text_en = ?, text_es = ?, sort = ? WHERE id = ?').run(en, es, sort, Number(body.id));
    } else {
      db.prepare('INSERT INTO checklist_items (text_en, text_es, sort) VALUES (?, ?, ?)').run(en, es, sort);
    }
    return { ok: true };
  },

  'POST /api/admin/checklist/delete': (req, body) => {
    db.prepare('DELETE FROM checklist_items WHERE id = ?').run(Number(body.id));
    return { ok: true };
  },

  'POST /api/admin/word': (req, body) => {
    const n = Math.floor(Number(body.day_number));
    if (!(n >= 1 && n <= 366)) return [400, { error: 'bad_day' }];
    db.prepare(`
      INSERT INTO daily_words (day_number, text_en, text_es) VALUES (?, ?, ?)
      ON CONFLICT (day_number) DO UPDATE SET text_en = excluded.text_en, text_es = excluded.text_es
    `).run(n, cleanText(body.text_en, 1000), cleanText(body.text_es, 1000));
    return { ok: true };
  },

  'POST /api/admin/testimony/delete': (req, body) => {
    db.prepare('DELETE FROM testimonies WHERE id = ?').run(Number(body.id));
    return { ok: true };
  },

  'POST /api/admin/reset-activity': (req, body) => {
    if (body.confirm !== 'RESET') return [400, { error: 'confirm_required' }];
    db.exec('DELETE FROM entries; DELETE FROM manual_entries; DELETE FROM checklist_done; DELETE FROM testimonies;');
    return { ok: true };
  },
};

function exportCsv(res) {
  const rows = churchTotals();
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = ['Church,Members,Visits,Goal visits,Returned,Goal returned,Prayers,Letters to Mother,Goal letters,Checklist practices'];
  for (const c of rows) {
    lines.push([esc(c.name), c.members, c.visits, c.goal_visits, c.returned, c.goal_returned,
      c.prayers, c.letters, c.goal_letters, c.practiced].join(','));
  }
  send(res, 200, lines.join('\n') + '\n', {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="movement-${today()}.csv"`,
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const key = `${req.method} ${url.pathname}`;
  try {
    if (url.pathname.startsWith('/api/admin/')) {
      const pin = req.headers['x-admin-pin'] || url.searchParams.get('pin');
      if (!pin || !safeEqual(pin, ADMIN_PIN)) return send(res, 401, { error: 'bad_pin' });
      if (key === 'GET /api/admin/export.csv') return exportCsv(res);
    }
    const handler = routes[key];
    if (handler) {
      const body = req.method === 'POST' ? await readBody(req) : {};
      const result = handler(req, body);
      return Array.isArray(result) ? send(res, result[0], result[1]) : send(res, 200, result);
    }
    if (url.pathname.startsWith('/api/')) return send(res, 404, { error: 'not_found' });
    if (req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, 'Method not allowed');
    serveStatic(req, res, url.pathname);
  } catch (err) {
    console.error(err);
    send(res, 500, { error: 'server_error' });
  }
});

server.listen(PORT, () => {
  if (ADMIN_PIN === 'changeme') console.warn('WARNING: set ADMIN_PIN to something private.');
  console.log(`Mother's Words Movement tracker listening on :${PORT}`);
});
