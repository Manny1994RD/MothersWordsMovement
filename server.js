// Mother's Words Movement tracker: a small zero-dependency server (Node 22+).
// Stores counts only. Team leaders report their team's numbers; members are anonymous
// device tokens tied to a church (and optionally a team) who view results and keep the checklist.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');
const { teamBadges, memberBadges, levelFor } = require('./badges');

const PORT = Number(process.env.PORT || 8080);
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const ADMIN_PIN = process.env.ADMIN_PIN || 'changeme';
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_PER_DAY = 50;
// Counters team leaders report each day. Metrics with a goal get a goal_<key> column on churches.
const METRICS = [
  { key: 'visits', goal: true },
  { key: 'returned', goal: true },
  { key: 'prayers', goal: false },
  { key: 'letters', goal: true },
];
const GOAL_METRICS = METRICS.filter((m) => m.goal);
const SIDES = ['sisters', 'brothers'];
// Weekly challenge focus, one per week of the campaign (40 days = 6 weeks).
const WEEKLY = ['visits', 'prayers', 'letters', 'returned', 'practiced', 'visits'];

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
  CREATE TABLE IF NOT EXISTS teams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    church_id INTEGER NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    pin TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  -- One report per team per day; the team leader can correct it later.
  CREATE TABLE IF NOT EXISTS team_reports (
    team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    church_id INTEGER NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
    day TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    PRIMARY KEY (team_id, day)
  );
  -- Activity feed (team reports, badges, new teams, stories).
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ukey TEXT UNIQUE,
    kind TEXT NOT NULL,
    church_id INTEGER REFERENCES churches(id) ON DELETE CASCADE,
    team_id INTEGER REFERENCES teams(id) ON DELETE CASCADE,
    data TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS cheers (
    event_id INTEGER NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    client TEXT NOT NULL,
    kind TEXT NOT NULL,
    PRIMARY KEY (event_id, client, kind)
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
  if (cols.includes(column)) return false;
  db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type}`);
  return true;
}
for (const m of METRICS) addColumn('entries', m.key);
for (const m of METRICS) addColumn('manual_entries', m.key);
for (const m of METRICS) addColumn('team_reports', m.key);
addColumn('manual_entries', 'team_id', 'INTEGER REFERENCES teams(id) ON DELETE SET NULL');
addColumn('members', 'team_id', 'INTEGER REFERENCES teams(id) ON DELETE SET NULL');
addColumn('churches', 'team_code', "TEXT NOT NULL DEFAULT ''");
addColumn('teams', 'side', "TEXT NOT NULL DEFAULT ''");
addColumn('teams', 'size', 'INTEGER NOT NULL DEFAULT 0');
addColumn('testimonies', 'member', 'TEXT');
addColumn('members', 'shares', 'INTEGER NOT NULL DEFAULT 0');
addColumn('members', 'nickname', 'TEXT');
addColumn('members', 'pin_hash', 'TEXT');
// Each checklist tick counts for the team the member was on that day, so switching teams
// later doesn't move past practice (and past weekly results) to the new team.
if (addColumn('checklist_done', 'team_id', 'INTEGER')) {
  db.exec('UPDATE checklist_done SET team_id = (SELECT team_id FROM members WHERE token = checklist_done.member)');
}
for (const m of GOAL_METRICS) addColumn('churches', `goal_${m.key}`);
addColumn('churches', 'leader_pin', "TEXT NOT NULL DEFAULT ''");

const randomCode = (prefix) => `${prefix}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
for (const c of db.prepare("SELECT id FROM churches WHERE team_code = ''").all()) {
  db.prepare('UPDATE churches SET team_code = ? WHERE id = ?').run(randomCode('TEAM'), c.id);
}

const DEFAULT_SETTINGS = {
  region_name: 'Our Region',
  start_date: '2026-11-01',
  end_date: '2026-12-10',
  overseer_pin: '',
};
for (const [k, v] of Object.entries(DEFAULT_SETTINGS)) {
  db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)').run(k, v);
}
// Words of the day from the "Words of Mother's Love" posters (EN/ES); editable in Admin.
if (db.prepare('SELECT COUNT(*) AS n FROM daily_words').get().n === 0) {
  const ins = db.prepare('INSERT INTO daily_words (day_number, text_en, text_es) VALUES (?, ?, ?)');
  for (const w of require('./seed-words.json')) ins.run(w.day, w.en, w.es);
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
  // Only public settings: the overseer PIN must never reach the browser.
  return { region_name: s.region_name, start_date: s.start_date, end_date: s.end_date, today: t, total_days: total, day_number: dayNumber };
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

// Team reports, leader/elder manual entries, and any older per-member entries, combined.
function allEntriesSql() {
  const cols = METRICS.map((m) => m.key).join(', ');
  return `SELECT church_id, team_id, day, ${cols}, 0 AS practiced FROM team_reports
    UNION ALL SELECT church_id, team_id, day, ${cols}, practiced FROM manual_entries
    UNION ALL SELECT church_id, NULL AS team_id, day, ${cols}, 0 AS practiced FROM entries`;
}

function churchTotals() {
  const { start_date, end_date } = getSettings();
  const goals = GOAL_METRICS.map((m) => `c.goal_${m.key}`).join(', ');
  const sums = METRICS.map((m) => `COALESCE(t.${m.key}, 0) AS ${m.key}`).join(', ');
  return db.prepare(`
    SELECT c.id, c.name, ${goals}, ${sums},
      (SELECT COUNT(*) FROM checklist_done d WHERE d.church_id = c.id AND d.day BETWEEN ? AND ?)
        + COALESCE(t.practiced, 0) AS practiced,
      (SELECT COUNT(*) FROM members m WHERE m.church_id = c.id) AS members,
      (SELECT COUNT(*) FROM teams tm WHERE tm.church_id = c.id) AS teams
    FROM churches c
    LEFT JOIN (
      SELECT church_id, ${METRICS.map((m) => `SUM(${m.key}) AS ${m.key}`).join(', ')}, SUM(practiced) AS practiced
      FROM (${allEntriesSql()}) WHERE day BETWEEN ? AND ? GROUP BY church_id
    ) t ON t.church_id = c.id
    ORDER BY c.name
  `).all(start_date, end_date, start_date, end_date);
}

function teamTotals(churchId, from, to) {
  const { start_date, end_date } = getSettings();
  from ||= start_date;
  to ||= end_date;
  const sums = METRICS.map((m) => `COALESCE(t.${m.key}, 0) AS ${m.key}`).join(', ');
  return db.prepare(`
    SELECT tm.id, tm.name, tm.church_id, tm.side, tm.size, c.name AS church, ${sums},
      (SELECT COUNT(*) FROM checklist_done d WHERE d.team_id = tm.id AND d.day BETWEEN ? AND ?)
        + COALESCE(t.practiced, 0) AS practiced,
      (SELECT COUNT(*) FROM members m WHERE m.team_id = tm.id) AS members,
      (SELECT MAX(day) FROM team_reports r WHERE r.team_id = tm.id) AS last_report
    FROM teams tm JOIN churches c ON c.id = tm.church_id
    LEFT JOIN (
      SELECT team_id, ${METRICS.map((m) => `SUM(${m.key}) AS ${m.key}`).join(', ')}, SUM(practiced) AS practiced
      FROM (${allEntriesSql()}) WHERE team_id IS NOT NULL AND day BETWEEN ? AND ? GROUP BY team_id
    ) t ON t.team_id = tm.id
    ${churchId ? 'WHERE tm.church_id = ?' : ''}
    ORDER BY c.name, tm.name
  `).all(from, to, from, to, ...(churchId ? [churchId] : []));
}

// ---------- Weekly challenge, badges, levels ----------
function weeks() {
  const info = campaignInfo();
  const out = [];
  for (let w = 0; w * 7 < info.total_days; w++) {
    const from = addDays(info.start_date, w * 7);
    const to = addDays(info.start_date, Math.min(w * 7 + 6, info.total_days - 1));
    out.push({ week: w + 1, from, to, metric: WEEKLY[w % WEEKLY.length], done: to < info.today, current: from <= info.today && info.today <= to });
  }
  return out;
}

function addDays(day, n) {
  const d = new Date(day + 'T12:00:00Z');
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const perMember = (team, key) => (team.size > 0 ? team[key] / team.size : 0);

// Winner per side for each finished week (highest per-member result in the week's focus).
function weeklyWinners() {
  return weeks().filter((w) => w.done).map((w) => {
    const teams = teamTotals(null, w.from, w.to);
    const winners = {};
    for (const side of SIDES) {
      const best = teams.filter((x) => x.side === side && x.size > 0 && x[w.metric] > 0)
        .sort((a, b) => perMember(b, w.metric) - perMember(a, w.metric))[0];
      if (best) winners[side] = { id: best.id, name: best.name, church: best.church, value: best[w.metric], per_member: perMember(best, w.metric) };
    }
    return { ...w, winners };
  });
}

// Adds badges, level and per-member numbers to team rows.
function withBadges(teams) {
  const info = campaignInfo();
  const champs = {};
  for (const w of weeklyWinners()) for (const win of Object.values(w.winners)) champs[win.id] = (champs[win.id] || 0) + 1;
  const reports = db.prepare(`SELECT team_id, day, ${METRICS.map((m) => m.key).join(', ')} FROM team_reports WHERE day BETWEEN ? AND ?`)
    .all(info.start_date, info.end_date);
  return teams.map((t) => {
    const badges = teamBadges(t, reports.filter((r) => r.team_id === t.id), info, champs[t.id] || 0);
    const earned = badges.filter((b) => b.earned).length;
    return { ...t, badges, earned, badge_total: badges.length, champions: champs[t.id] || 0, ...levelFor(earned) };
  });
}

function badgesForMember(m) {
  const info = campaignInfo();
  const team = m.team_id ? withBadges(teamTotals().filter((x) => x.id === m.team_id))[0] : null;
  return memberBadges({
    startDate: info.start_date,
    teamLevel: team ? team.level : 0,
    teamChampion: team ? team.champions : 0,
    shares: db.prepare('SELECT shares FROM members WHERE token = ?').get(m.token)?.shares || 0,
    ticks: db.prepare('SELECT day, item_id FROM checklist_done WHERE member = ? AND day BETWEEN ? AND ?').all(m.token, info.start_date, info.end_date),
    itemIds: db.prepare('SELECT id FROM checklist_items ORDER BY sort, id').all().map((r) => r.id),
    stories: db.prepare('SELECT COUNT(*) AS n FROM testimonies WHERE member = ?').get(m.token).n,
    cheers: db.prepare('SELECT COUNT(*) AS n FROM cheers WHERE client = ?').get(m.token).n,
    joined: true,
  });
}

// ---------- Activity feed ----------
function addEvent(kind, { ukey = null, church_id = null, team_id = null, data = {} }) {
  db.prepare(`
    INSERT INTO events (ukey, kind, church_id, team_id, data) VALUES (?, ?, ?, ?, ?)
    ON CONFLICT (ukey) DO UPDATE SET data = excluded.data, created_at = datetime('now')
  `).run(ukey, kind, church_id, team_id, JSON.stringify(data));
}

function feed(client, limit = 40) {
  const rows = db.prepare(`
    SELECT e.id, e.kind, e.data, e.created_at, tm.name AS team, tm.side, c.name AS church,
      (SELECT COUNT(*) FROM cheers x WHERE x.event_id = e.id AND x.kind = 'pray') AS pray,
      (SELECT COUNT(*) FROM cheers x WHERE x.event_id = e.id AND x.kind = 'love') AS love,
      (SELECT group_concat(kind) FROM cheers x WHERE x.event_id = e.id AND x.client = ?) AS mine
    FROM events e LEFT JOIN teams tm ON tm.id = e.team_id LEFT JOIN churches c ON c.id = e.church_id
    ORDER BY e.created_at DESC, e.id DESC LIMIT ?
  `).all(client || '', limit);
  return rows.map((r) => ({ ...r, data: JSON.parse(r.data), mine: r.mine ? r.mine.split(',') : [] }));
}

function earnedIds(teamId) {
  const t = withBadges(teamTotals().filter((x) => x.id === teamId))[0];
  return t ? { ids: new Set(t.badges.filter((b) => b.earned).map((b) => b.id)), level: t.level } : { ids: new Set(), level: 1 };
}

function regionSummary() {
  const churches = churchTotals();
  const sum = (k) => churches.reduce((a, c) => a + c[k], 0);
  const out = { practiced: sum('practiced'), members: sum('members'), teams: sum('teams') };
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
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 100000) {
        reject(Object.assign(new Error('too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      const data = Buffer.concat(chunks).toString('utf8');
      try { resolve(data ? JSON.parse(data) : {}); } catch { reject(Object.assign(new Error('bad json'), { status: 400 })); }
    });
    req.on('error', reject);
    req.on('aborted', () => reject(Object.assign(new Error('aborted'), { status: 400 })));
  });
}

function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}

const clampCount = (n) => Math.max(0, Math.min(MAX_PER_DAY, Math.floor(Number(n) || 0)));
const clampSize = (n) => Math.max(0, Math.min(500, Math.floor(Number(n) || 0)));
const cleanText = (s, max) => String(s ?? '').trim().slice(0, max);

// ---------- Member nickname + PIN ----------
const PIN_RE = /^\d{4}$/;
function hashPin(pin) {
  const salt = crypto.randomBytes(8).toString('hex');
  return `${salt}:${crypto.scryptSync(pin, salt, 32).toString('hex')}`;
}
const isHashed = (v) => /^[0-9a-f]{16}:[0-9a-f]{64}$/.test(v || '');
function checkPin(pin, stored) {
  if (!stored) return false;
  const [salt, hash] = stored.split(':');
  return safeEqual(crypto.scryptSync(String(pin), salt, 32).toString('hex'), hash);
}
// Team PINs from before hashing: hash them once at startup.
for (const tm of db.prepare('SELECT id, pin FROM teams').all()) {
  if (!isHashed(tm.pin)) db.prepare('UPDATE teams SET pin = ? WHERE id = ?').run(hashPin(tm.pin), tm.id);
}
// Short PINs are easy to guess, so lock after repeated wrong tries (15 minutes).
const failures = new Map();
function locked(key, max = 5) {
  const f = failures.get(key);
  return !!f && f.count >= max && Date.now() - f.at < 15 * 60 * 1000;
}
function recordFailure(key) {
  const f = failures.get(key);
  const fresh = !f || Date.now() - f.at >= 15 * 60 * 1000;
  failures.set(key, { count: fresh ? 1 : f.count + 1, at: Date.now() });
}
const nicknameTaken = (churchId, nickname, exceptToken = '') =>
  !!db.prepare('SELECT 1 FROM members WHERE church_id = ? AND lower(nickname) = lower(?) AND token != ?').get(churchId, nickname, exceptToken);

function validProfile(body) {
  const nickname = cleanText(body.nickname, 30);
  if (nickname.length < 2) return { error: 'nickname_required' };
  if (!PIN_RE.test(String(body.pin || ''))) return { error: 'pin_4_digits' };
  return { nickname, pin: String(body.pin) };
}

function getMember(req) {
  const token = req.headers['x-member'];
  if (!token) return null;
  return db.prepare('SELECT token, church_id, team_id FROM members WHERE token = ?').get(String(token)) || null;
}

function getTeam(req) {
  const token = req.headers['x-team'];
  if (!token) return null;
  return db.prepare('SELECT id, church_id, name, token FROM teams WHERE token = ?').get(String(token)) || null;
}

// A report day must be inside the campaign and not in the future.
const validDay = (day, info) =>
  /^\d{4}-\d{2}-\d{2}$/.test(day || '') && day >= info.start_date && day <= info.today && day <= info.end_date ? day : null;

// Roles: the admin (ADMIN_PIN) and the elder/overseer (overseer PIN) may act for any church;
// a church leader only for their own church.
function leaderRole(req, churchId) {
  const adminPin = req.headers['x-admin-pin'];
  if (adminPin && adminPinOk(adminPin)) return 'admin';
  const pin = req.headers['x-leader-pin'];
  if (!pin) return null;
  const key = `leader:${Number(churchId)}`;
  if (locked(key, 10)) return null;
  const overseer = getSettings().overseer_pin;
  if (overseer && safeEqual(pin, overseer)) return 'elder';
  const church = db.prepare('SELECT leader_pin FROM churches WHERE id = ?').get(Number(churchId));
  if (church && church.leader_pin && safeEqual(pin, church.leader_pin)) return 'leader';
  recordFailure(key);
  return null;
}

function adminPinOk(pin) {
  if (locked('admin', 10)) return false;
  if (safeEqual(pin, ADMIN_PIN)) return true;
  recordFailure('admin');
  return false;
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
    const profile = validProfile(body);
    if (profile.error) return [400, { error: profile.error }];
    if (nicknameTaken(church.id, profile.nickname)) return [409, { error: 'nickname_taken' }];
    const team = body.team_id
      ? db.prepare('SELECT id FROM teams WHERE id = ? AND church_id = ?').get(Number(body.team_id), church.id)
      : null;
    const token = crypto.randomBytes(24).toString('hex');
    db.prepare('INSERT INTO members (token, church_id, team_id, nickname, pin_hash) VALUES (?, ?, ?, ?, ?)')
      .run(token, church.id, team ? team.id : null, profile.nickname, hashPin(profile.pin));
    return { token, church_id: church.id };
  },

  // "I already joined": get back in on a new phone with nickname + PIN.
  'POST /api/member/login': (req, body) => {
    const churchId = Number(body.church_id);
    const nickname = cleanText(body.nickname, 30);
    const key = `${churchId}:${nickname.toLowerCase()}`;
    if (locked(key)) return [429, { error: 'too_many_tries' }];
    const m = db.prepare('SELECT token, pin_hash FROM members WHERE church_id = ? AND lower(nickname) = lower(?)').get(churchId, nickname);
    if (!m || !checkPin(String(body.pin || ''), m.pin_hash)) {
      recordFailure(key);
      return [401, { error: 'bad_login' }];
    }
    failures.delete(key);
    return { token: m.token };
  },

  'GET /api/teams': (req) => {
    const churchId = Number(new URL(req.url, 'http://x').searchParams.get('church_id'));
    return { teams: db.prepare('SELECT id, name FROM teams WHERE church_id = ? ORDER BY name').all(churchId) };
  },

  // Team leaders
  'POST /api/team/create': (req, body) => {
    const church = db.prepare('SELECT id, team_code FROM churches WHERE id = ?').get(Number(body.church_id));
    if (!church || !church.team_code || !safeEqual(cleanText(body.code, 50).toUpperCase(), church.team_code.toUpperCase())) {
      return [403, { error: 'bad_code' }];
    }
    const name = cleanText(body.name, 60);
    const pin = cleanText(body.pin, 30);
    if (name.length < 2) return [400, { error: 'name_required' }];
    if (pin.length < 4) return [400, { error: 'pin_too_short' }];
    if (!SIDES.includes(body.side)) return [400, { error: 'side_required' }];
    if (db.prepare('SELECT 1 FROM teams WHERE church_id = ? AND lower(name) = lower(?)').get(church.id, name)) {
      return [409, { error: 'team_exists' }];
    }
    const token = crypto.randomBytes(24).toString('hex');
    const size = clampSize(body.size);
    const { lastInsertRowid } = db.prepare('INSERT INTO teams (church_id, name, pin, token, side, size) VALUES (?, ?, ?, ?, ?, ?)')
      .run(church.id, name, hashPin(pin), token, body.side, size);
    addEvent('team_joined', { church_id: church.id, team_id: Number(lastInsertRowid) });
    return { token };
  },

  'POST /api/team/settings': (req, body) => {
    const team = getTeam(req);
    if (!team) return [401, { error: 'no_team' }];
    if (!SIDES.includes(body.side)) return [400, { error: 'side_required' }];
    const size = clampSize(body.size);
    db.prepare('UPDATE teams SET side = ?, size = ? WHERE id = ?').run(body.side, size, team.id);
    return { ok: true };
  },

  'POST /api/team/login': (req, body) => {
    const key = `team:${Number(body.team_id)}`;
    if (locked(key)) return [429, { error: 'too_many_tries' }];
    const team = db.prepare('SELECT token, pin FROM teams WHERE id = ?').get(Number(body.team_id));
    if (!team || !checkPin(cleanText(body.pin, 30), team.pin)) {
      recordFailure(key);
      return [401, { error: 'bad_pin' }];
    }
    failures.delete(key);
    return { token: team.token };
  },

  'GET /api/team/me': (req) => {
    const team = getTeam(req);
    if (!team) return [401, { error: 'no_team' }];
    const info = campaignInfo();
    const day = validDay(new URL(req.url, 'http://x').searchParams.get('day'), info) || info.today;
    const cols = METRICS.map((x) => x.key).join(', ');
    const report = db.prepare(`SELECT ${cols} FROM team_reports WHERE team_id = ? AND day = ?`).get(team.id, day)
      || Object.fromEntries(METRICS.map((x) => [x.key, 0]));
    const teams = withBadges(teamTotals(team.church_id));
    return {
      campaign: info,
      day,
      report,
      team: teams.find((x) => x.id === team.id),
      teams,
      church: churchTotals().find((c) => c.id === team.church_id),
      // Team leaders invite their members and can see their nicknames (nobody else can).
      join_code: db.prepare('SELECT join_code FROM churches WHERE id = ?').get(team.church_id).join_code,
      members: db.prepare(`
        SELECT m.rowid AS id, m.nickname,
          (SELECT COUNT(*) FROM checklist_done d WHERE d.member = m.token AND d.day = ?) AS today
        FROM members m WHERE m.team_id = ? ORDER BY lower(m.nickname)
      `).all(info.today, team.id),
    };
  },

  'POST /api/team/member/pin': (req, body) => {
    const team = getTeam(req);
    if (!team) return [401, { error: 'no_team' }];
    if (!PIN_RE.test(String(body.pin || ''))) return [400, { error: 'pin_4_digits' }];
    const r = db.prepare('UPDATE members SET pin_hash = ? WHERE rowid = ? AND team_id = ? AND nickname IS NOT NULL')
      .run(hashPin(String(body.pin)), Number(body.member_id), team.id);
    return r.changes ? { ok: true } : [404, { error: 'not_found' }];
  },

  'POST /api/team/member/remove': (req, body) => {
    const team = getTeam(req);
    if (!team) return [401, { error: 'no_team' }];
    db.prepare('UPDATE members SET team_id = NULL WHERE rowid = ? AND team_id = ?').run(Number(body.member_id), team.id);
    return { ok: true };
  },

  'POST /api/team/report': (req, body) => {
    const team = getTeam(req);
    if (!team) return [401, { error: 'no_team' }];
    const info = campaignInfo();
    const day = validDay(body.day || info.today, info);
    if (!day) return [400, { error: 'bad_date' }];
    const keys = METRICS.map((x) => x.key);
    const values = keys.map((k) => clampCount(body[k]));
    const before = earnedIds(team.id);
    db.prepare(`
      INSERT INTO team_reports (team_id, church_id, day, ${keys.join(', ')}) VALUES (?, ?, ?, ${keys.map(() => '?').join(', ')})
      ON CONFLICT (team_id, day) DO UPDATE SET ${keys.map((k) => `${k} = excluded.${k}`).join(', ')}, updated_at = datetime('now')
    `).run(team.id, team.church_id, day, ...values);
    // One feed item per team per day, updated as the leader adjusts the numbers.
    const data = Object.fromEntries(keys.map((k, i) => [k, values[i]]));
    if (values.some((v) => v > 0)) addEvent('report', { ukey: `report:${team.id}:${day}`, church_id: team.church_id, team_id: team.id, data: { ...data, day } });
    else db.prepare('DELETE FROM events WHERE ukey = ?').run(`report:${team.id}:${day}`);
    const after = earnedIds(team.id);
    const newBadges = [...after.ids].filter((id) => !before.ids.has(id));
    // Announce each badge only once, even if a corrected report drops and re-earns it.
    const announced = new Set(db.prepare(`
      SELECT j.value AS id FROM events e, json_each(e.data, '$.badges') j WHERE e.kind = 'badge' AND e.team_id = ?
    `).all(team.id).map((r) => r.id));
    const toAnnounce = newBadges.filter((id) => !announced.has(id));
    if (toAnnounce.length) {
      addEvent('badge', { church_id: team.church_id, team_id: team.id, data: { badges: toAnnounce } });
    }
    if (after.level > before.level) {
      addEvent('level', { ukey: `level:${team.id}:${after.level}`, church_id: team.church_id, team_id: team.id, data: { level: after.level } });
    }
    return { ok: true, new_badges: newBadges, level: after.level, level_up: after.level > before.level };
  },

  'GET /api/dashboard': () => {
    const series = dailySeries();
    const testimonies = db.prepare(`
      SELECT t.id, t.text, t.created_at, c.name AS church
      FROM testimonies t JOIN churches c ON c.id = t.church_id
      ORDER BY t.id DESC LIMIT 50
    `).all();
    const current = weeks().find((w) => w.current);
    return {
      campaign: campaignInfo(),
      region: regionSummary(),
      churches: churchTotals(),
      teams: withBadges(teamTotals()),
      week: current ? { ...current, teams: teamTotals(null, current.from, current.to) } : null,
      winners: weeklyWinners(),
      series,
      testimonies,
    };
  },

  'GET /api/feed': (req) => {
    const m = getMember(req);
    const client = m ? m.token : cleanText(new URL(req.url, 'http://x').searchParams.get('client'), 64);
    return { feed: feed(client) };
  },

  'POST /api/cheer': (req, body) => {
    const m = getMember(req);
    const client = m ? m.token : cleanText(body.client, 64);
    if (client.length < 8 || !['pray', 'love'].includes(body.kind)) return [400, { error: 'bad_request' }];
    const id = Number(body.event_id);
    if (!db.prepare('SELECT 1 FROM events WHERE id = ?').get(id)) return [404, { error: 'not_found' }];
    const had = db.prepare('SELECT 1 FROM cheers WHERE event_id = ? AND client = ? AND kind = ?').get(id, client, body.kind);
    if (had) db.prepare('DELETE FROM cheers WHERE event_id = ? AND client = ? AND kind = ?').run(id, client, body.kind);
    else db.prepare('INSERT INTO cheers (event_id, client, kind) VALUES (?, ?, ?)').run(id, client, body.kind);
    return { ok: true, on: !had };
  },

  // Member
  'GET /api/me': (req) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const info = campaignInfo();
    const day = info.today;
    const done = db.prepare('SELECT item_id FROM checklist_done WHERE member = ? AND day = ?')
      .all(m.token, day).map((r) => r.item_id);
    const nickname = db.prepare('SELECT nickname FROM members WHERE token = ?').get(m.token).nickname;
    const word = db.prepare('SELECT text_en, text_es FROM daily_words WHERE day_number = ?').get(info.day_number);
    return {
      campaign: info,
      church: churchTotals().find((c) => c.id === m.church_id),
      region: regionSummary(),
      team_id: m.team_id,
      nickname,
      teams: withBadges(teamTotals(m.church_id)),
      badges: badgesForMember(m),
      checklist: db.prepare('SELECT id, text_en, text_es FROM checklist_items ORDER BY sort, id').all(),
      done,
      streak: streak(m.token),
      word: word && (word.text_en || word.text_es) ? word : null,
    };
  },

  // Members who joined before nicknames existed (or want a new PIN) set them here.
  'POST /api/me/profile': (req, body) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const profile = validProfile(body);
    if (profile.error) return [400, { error: profile.error }];
    if (nicknameTaken(m.church_id, profile.nickname, m.token)) return [409, { error: 'nickname_taken' }];
    db.prepare('UPDATE members SET nickname = ?, pin_hash = ? WHERE token = ?').run(profile.nickname, hashPin(profile.pin), m.token);
    return { ok: true };
  },

  'POST /api/me/shared': (req) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    db.prepare('UPDATE members SET shares = shares + 1 WHERE token = ?').run(m.token);
    return { ok: true, badges: badgesForMember(m) };
  },

  'POST /api/me/team': (req, body) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const team = db.prepare('SELECT id FROM teams WHERE id = ? AND church_id = ?').get(Number(body.team_id), m.church_id);
    db.prepare('UPDATE members SET team_id = ? WHERE token = ?').run(team ? team.id : null, m.token);
    return { ok: true };
  },

  'POST /api/me/checklist': (req, body) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const itemId = Number(body.item_id);
    if (!db.prepare('SELECT 1 FROM checklist_items WHERE id = ?').get(itemId)) return [404, { error: 'no_item' }];
    if (body.done) {
      db.prepare('INSERT OR IGNORE INTO checklist_done (member, church_id, team_id, item_id, day) VALUES (?, ?, ?, ?, ?)')
        .run(m.token, m.church_id, m.team_id, itemId, today());
    } else {
      db.prepare('DELETE FROM checklist_done WHERE member = ? AND item_id = ? AND day = ?').run(m.token, itemId, today());
    }
    return { ok: true, streak: streak(m.token), badges: badgesForMember(m) };
  },

  'POST /api/testimonies': (req, body) => {
    const m = getMember(req);
    if (!m) return [401, { error: 'not_joined' }];
    const text = cleanText(body.text, 500);
    if (text.length < 3) return [400, { error: 'too_short' }];
    const { lastInsertRowid } = db.prepare('INSERT INTO testimonies (church_id, text, member) VALUES (?, ?, ?)').run(m.church_id, text, m.token);
    addEvent('story', { ukey: `story:${lastInsertRowid}`, church_id: m.church_id, data: { text } });
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
      SELECT e.id, e.day, ${METRICS.map((m) => `e.${m.key}`).join(', ')}, e.practiced, e.entered_by, e.created_at, tm.name AS team
      FROM manual_entries e LEFT JOIN teams tm ON tm.id = e.team_id
      WHERE e.church_id = ? ORDER BY e.id DESC LIMIT 100
    `).all(id);
    let overview = null;
    if (role !== 'leader') {
      const today = campaignInfo().today;
      const teams = teamTotals();
      overview = churchTotals().map((c) => ({
        id: c.id, name: c.name, visits: c.visits, returned: c.returned, letters: c.letters,
        goal_visits: c.goal_visits, goal_returned: c.goal_returned, goal_letters: c.goal_letters,
        teams: teams.filter((x) => x.church_id === c.id).length,
        reported_today: teams.filter((x) => x.church_id === c.id && x.last_report === today).length,
      }));
    }
    return {
      role,
      overview,
      church,
      team_code: db.prepare('SELECT team_code FROM churches WHERE id = ?').get(id).team_code,
      teams: withBadges(teamTotals(id)),
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
    const day = validDay(body.day || info.today, info);
    if (!day) return [400, { error: 'bad_date' }];
    const team = body.team_id
      ? db.prepare('SELECT id FROM teams WHERE id = ? AND church_id = ?').get(Number(body.team_id), id)
      : null;
    const keys = METRICS.map((m) => m.key);
    const values = keys.map((k) => clampCount(body[k]));
    const practiced = clampCount(body.practiced);
    if (values.every((v) => v === 0) && practiced === 0) return [400, { error: 'empty' }];
    db.prepare(`
      INSERT INTO manual_entries (church_id, team_id, day, ${keys.join(', ')}, practiced, entered_by)
      VALUES (?, ?, ?, ${keys.map(() => '?').join(', ')}, ?, ?)
    `).run(id, team ? team.id : null, day, ...values, practiced, role);
    return { ok: true };
  },

  'POST /api/leader/entry/delete': (req, body) => {
    const id = Number(body.church_id);
    if (!leaderRole(req, id)) return [401, { error: 'bad_pin' }];
    db.prepare('DELETE FROM manual_entries WHERE id = ? AND church_id = ?').run(Number(body.id), id);
    return { ok: true };
  },

  'POST /api/leader/team/pin': (req, body) => {
    const id = Number(body.church_id);
    if (!leaderRole(req, id)) return [401, { error: 'bad_pin' }];
    const pin = cleanText(body.pin, 30);
    if (pin.length < 4) return [400, { error: 'pin_too_short' }];
    db.prepare('UPDATE teams SET pin = ? WHERE id = ? AND church_id = ?').run(hashPin(pin), Number(body.team_id), id);
    return { ok: true };
  },

  'POST /api/leader/team/settings': (req, body) => {
    const id = Number(body.church_id);
    if (!leaderRole(req, id)) return [401, { error: 'bad_pin' }];
    if (!SIDES.includes(body.side)) return [400, { error: 'side_required' }];
    const size = clampSize(body.size);
    db.prepare('UPDATE teams SET side = ?, size = ? WHERE id = ? AND church_id = ?').run(body.side, size, Number(body.team_id), id);
    return { ok: true };
  },

  'POST /api/leader/team/delete': (req, body) => {
    const id = Number(body.church_id);
    if (!leaderRole(req, id)) return [401, { error: 'bad_pin' }];
    db.prepare('DELETE FROM teams WHERE id = ? AND church_id = ?').run(Number(body.team_id), id);
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
    if (body.overseer_pin !== undefined) {
      const pin = cleanText(body.overseer_pin, 50);
      if (pin && pin.length < 4) return [400, { error: 'pin_too_short' }];
      up.run('overseer_pin', pin);
    }
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
    const teamCode = cleanText(body.team_code, 50) || randomCode('TEAM');
    if (!name || !code) return [400, { error: 'name_and_code_required' }];
    const goalCols = GOAL_METRICS.map((x) => `goal_${x.key}`);
    const goals = goalCols.map((c) => Math.max(0, Math.floor(Number(body[c]) || 0)));
    if (body.id) {
      db.prepare(`UPDATE churches SET name = ?, join_code = ?, leader_pin = ?, team_code = ?, ${goalCols.map((c) => `${c} = ?`).join(', ')} WHERE id = ?`)
        .run(name, code, leaderPin, teamCode, ...goals, Number(body.id));
    } else {
      db.prepare(`INSERT INTO churches (name, join_code, leader_pin, team_code, ${goalCols.join(', ')}) VALUES (?, ?, ?, ?, ${goalCols.map(() => '?').join(', ')})`)
        .run(name, code, leaderPin, teamCode, ...goals);
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
    db.prepare('DELETE FROM events WHERE ukey = ?').run(`story:${Number(body.id)}`);
    return { ok: true };
  },

  'POST /api/admin/reset-activity': (req, body) => {
    if (body.confirm !== 'RESET') return [400, { error: 'confirm_required' }];
    db.exec('DELETE FROM entries; DELETE FROM team_reports; DELETE FROM manual_entries; DELETE FROM checklist_done; DELETE FROM testimonies; DELETE FROM events;');
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
  lines.push('', 'Team,Church,Side,Team size,Members joined,Visits,Returned,Prayers,Letters to Mother,Checklist practices,Badges,Level,Last report');
  for (const t of withBadges(teamTotals())) {
    lines.push([esc(t.name), esc(t.church), t.side, t.size, t.members, t.visits, t.returned, t.prayers, t.letters, t.practiced,
      t.earned, t.level, t.last_report || ''].join(','));
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
      if (!pin || !adminPinOk(pin)) return send(res, 401, { error: 'bad_pin' });
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
    if (err.status) return res.destroyed ? undefined : send(res, err.status, { error: err.message.replace(' ', '_') });
    console.error(err);
    send(res, 500, { error: 'server_error' });
  }
});

// Daily backup copy of the database, keeping the last 14.
function backup() {
  try {
    const dir = path.join(DATA_DIR, 'backups');
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `movement-${today()}.db`);
    if (!fs.existsSync(file)) db.exec(`VACUUM INTO '${file.replace(/'/g, "''")}'`);
    const old = fs.readdirSync(dir).filter((f) => /^movement-\d{4}-\d{2}-\d{2}\.db$/.test(f)).sort().slice(0, -14);
    for (const f of old) fs.unlinkSync(path.join(dir, f));
  } catch (err) {
    console.error('Backup failed:', err.message);
  }
}
backup();
setInterval(backup, 60 * 60 * 1000);

server.listen(PORT, () => {
  if (ADMIN_PIN === 'changeme') console.warn('WARNING: set ADMIN_PIN to something private.');
  console.log(`Mother's Words Movement tracker listening on :${PORT}`);
});
