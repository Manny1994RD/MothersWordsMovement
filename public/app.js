// Mother's Words Movement tracker — client (no build step).
'use strict';

const I18N = {
  en: {
    nav_home: 'Home', nav_board: 'Region', nav_stories: 'Stories', tagline: "40 Days of Mother's Love",
    hero_kicker: 'Beginning of Peace', hero_a: 'The Words of', hero_b: "Mother's Love",
    welcome: 'Welcome!', join_intro: 'Choose your church and enter the code your leader gave you. No names are collected — only counts.',
    church: 'Church', code: 'Church code', join: 'Join', bad_code: 'That code is not correct for this church.',
    no_churches: 'No churches have been set up yet. Ask your admin.',
    day_of: (d, t) => `Day ${d} of ${t}`, starts_in: (n) => `Starts in ${n} day${n === 1 ? '' : 's'}`,
    finished: 'The 40 days are complete — thank you!', word_today: "Today's word",
    my_today: 'My activity today', visits: 'Visits', returned: 'Members returned', prayers: 'Prayers for members',
    letters: 'Letters to Mother', visits_hint: 'Visits made to members', returned_hint: 'Someone who came back to church',
    prayers_hint: 'Times you prayed for a member', letters_hint: 'Letters sent to Mother',
    my_total: (n) => `My total: ${n}`, saved: 'Saved ✓',
    checklist: "Mother's words in practice", streak: (n) => `${n}-day streak`, streak_zero: 'Check one off today to start a streak!',
    my_church: 'My church', region: 'Region', of_goal: (n, g) => `${n} / ${g}`, no_goal: 'no goal set',
    region_totals: 'Region totals', members_joined: 'Members joined', practiced: 'Checklist practices',
    ranking: 'Churches', by: 'Rank by', per_day: 'Activity per day',
    stories_title: 'Stories of grace', stories_intro: 'Share a short, anonymous testimony to encourage everyone. Please don\'t include names.',
    share: 'Share', story_placeholder: 'e.g. A sister came back after 2 years 🙏', no_stories: 'No stories yet — be the first!',
    milestone: (p, who) => `🎉 ${who} reached ${p}% of the goal!`, you_church: 'Your church', the_region: 'The region',
    switch_church: 'Switch church', switch_confirm: 'Leave this church on this phone? Your past counts stay recorded.',
    admin: 'Admin', pin: 'Admin PIN', login: 'Log in', bad_pin: 'Wrong PIN.',
    leader: 'Leaders', leader_title: 'Leader page', leader_intro: 'For church leaders and the Elder: set goals and enter counts for members who can’t update on their own.',
    leader_pin: 'Leader PIN', elder_note: 'Logged in as Elder — you can manage any church.',
    goals: 'Church goals', save_goals: 'Save goals', for_member: 'Enter for a member',
    for_member_intro: 'Adds to the church totals. No names — only numbers.', date: 'Date',
    phrases_practiced: 'Phrases practiced (of the 9)', add_entry: 'Add entry', added: 'Added ✓',
    recent: 'Entered by leaders', none_yet: 'Nothing entered yet.', remove: 'Remove', remove_confirm: 'Remove this entry?',
    by_elder: 'Elder', by_leader: 'Leader', log_out: 'Log out', empty_entry: 'Enter at least one number.',
  },
  es: {
    nav_home: 'Inicio', nav_board: 'Región', nav_stories: 'Historias', tagline: '40 días del amor de la Madre',
    hero_kicker: 'Inicio de la Paz', hero_a: 'Palabras de Amor de la', hero_b: 'Madre',
    welcome: '¡Bienvenido!', join_intro: 'Elige tu iglesia e ingresa el código que te dio tu líder. No se piden nombres — solo números.',
    church: 'Iglesia', code: 'Código de la iglesia', join: 'Entrar', bad_code: 'Ese código no es correcto para esta iglesia.',
    no_churches: 'Aún no hay iglesias configuradas. Pregunta a tu administrador.',
    day_of: (d, t) => `Día ${d} de ${t}`, starts_in: (n) => `Comienza en ${n} día${n === 1 ? '' : 's'}`,
    finished: 'Los 40 días han terminado — ¡gracias!', word_today: 'Palabra de hoy',
    my_today: 'Mi actividad de hoy', visits: 'Visitas', returned: 'Miembros que regresaron', prayers: 'Oraciones por miembros',
    letters: 'Cartas a la Madre', visits_hint: 'Visitas hechas a miembros', returned_hint: 'Alguien que regresó a la iglesia',
    prayers_hint: 'Veces que oraste por un miembro', letters_hint: 'Cartas enviadas a la Madre',
    my_total: (n) => `Mi total: ${n}`, saved: 'Guardado ✓',
    checklist: 'Palabras de la Madre en práctica', streak: (n) => `Racha de ${n} día${n === 1 ? '' : 's'}`, streak_zero: '¡Marca uno hoy para empezar una racha!',
    my_church: 'Mi iglesia', region: 'Región', of_goal: (n, g) => `${n} / ${g}`, no_goal: 'sin meta',
    region_totals: 'Totales de la región', members_joined: 'Miembros unidos', practiced: 'Prácticas de la lista',
    ranking: 'Iglesias', by: 'Ordenar por', per_day: 'Actividad por día',
    stories_title: 'Historias de gracia', stories_intro: 'Comparte un testimonio corto y anónimo para animar a todos. Por favor no incluyas nombres.',
    share: 'Compartir', story_placeholder: 'ej. Una hermana regresó después de 2 años 🙏', no_stories: 'Aún no hay historias — ¡sé el primero!',
    milestone: (p, who) => `🎉 ¡${who} alcanzó el ${p}% de la meta!`, you_church: 'Tu iglesia', the_region: 'La región',
    switch_church: 'Cambiar iglesia', switch_confirm: '¿Salir de esta iglesia en este teléfono? Tus números anteriores se quedan registrados.',
    admin: 'Admin', pin: 'PIN de administrador', login: 'Entrar', bad_pin: 'PIN incorrecto.',
    leader: 'Líderes', leader_title: 'Página de líderes', leader_intro: 'Para líderes de iglesia y el Anciano: fijar metas e ingresar números por miembros que no pueden hacerlo solos.',
    leader_pin: 'PIN de líder', elder_note: 'Conectado como Anciano — puede administrar cualquier iglesia.',
    goals: 'Metas de la iglesia', save_goals: 'Guardar metas', for_member: 'Ingresar por un miembro',
    for_member_intro: 'Se suma a los totales de la iglesia. Sin nombres — solo números.', date: 'Fecha',
    phrases_practiced: 'Frases practicadas (de las 9)', add_entry: 'Agregar', added: 'Agregado ✓',
    recent: 'Ingresado por líderes', none_yet: 'Nada ingresado todavía.', remove: 'Quitar', remove_confirm: '¿Quitar esta entrada?',
    by_elder: 'Anciano', by_leader: 'Líder', log_out: 'Salir', empty_entry: 'Ingrese al menos un número.',
  },
};

const METRICS = [
  { key: 'visits', goal: true },
  { key: 'returned', goal: true },
  { key: 'prayers', goal: false },
  { key: 'letters', goal: true },
];
const icon = (name, size = 24) => pixelIcon(name, size);

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

let lang = store.get('lang') || ((navigator.language || '').toLowerCase().startsWith('es') ? 'es' : 'en');
const t = (k, ...a) => { const v = I18N[lang][k] ?? I18N.en[k] ?? k; return typeof v === 'function' ? v(...a) : v; };

// Tiny DOM builder: h('div.card', {onclick}, children...)
function h(sel, attrs, ...kids) {
  const [tag, ...classes] = sel.split('.');
  const el = document.createElement(tag || 'div');
  if (classes.length) el.className = classes.join(' ');
  if (attrs != null && (typeof attrs !== 'object' || attrs instanceof Node || Array.isArray(attrs))) { kids.unshift(attrs); attrs = null; }
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className += ' ' + v;
    else if (k === 'value') el.value = v;
    else if (k === 'checked') el.checked = !!v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const kid of kids.flat()) if (kid != null && kid !== false) el.append(kid instanceof Node ? kid : String(kid));
  return el;
}

async function api(path, opts = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = store.get('member');
  if (token) headers['X-Member'] = token;
  const pin = sessionStorage.getItem('adminPin');
  if (pin && (path.startsWith('/api/admin') || path.startsWith('/api/leader'))) headers['X-Admin-Pin'] = pin;
  const leaderPin = sessionStorage.getItem('leaderPin');
  if (leaderPin && path.startsWith('/api/leader')) headers['X-Leader-Pin'] = leaderPin;
  const res = await fetch(path, {
    method: opts.body ? 'POST' : 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) { const err = new Error(data.error || 'error'); err.status = res.status; throw err; }
  return data;
}

const app = document.getElementById('app');
const pct = (n, g) => (g > 0 ? Math.min(100, Math.round((n / g) * 100)) : 0);
const pickText = (o) => (lang === 'es' ? o.text_es || o.text_en : o.text_en || o.text_es);

function progressRow(label, n, goal, iconName) {
  const p = pct(n, goal);
  return h('div.progress',
    h('div.row', h('span', iconName ? icon(iconName, 20) : null, label),
      h('span.num', goal > 0 ? `${t('of_goal', n, goal)} ${p}%` : `${n}`)),
    goal > 0 ? h('div.bar' + (p >= 100 ? '.done' : ''), h('div', { style: `width:${p}%` })) : null
  );
}

function dayBanner(c) {
  let text;
  if (c.day_number < 1) text = t('starts_in', 1 - c.day_number);
  else if (c.day_number > c.total_days) text = t('finished');
  else text = t('day_of', c.day_number, c.total_days);
  // One block per day, like an 8-bit level map.
  const blocks = Array.from({ length: c.total_days }, (_, i) => {
    const n = i + 1;
    return h('i' + (n < c.day_number ? '.on' : n === c.day_number ? '.now' : ''));
  });
  return h('div.hero',
    h('div.kicker', t('hero_kicker')),
    h('div.title', t('hero_a'), ' ', h('em', t('hero_b'))),
    h('div.ribbon', h('div.big', text), h('div.dates', `${c.start_date} → ${c.end_date}`)),
    h('div.day-track', blocks)
  );
}

// ---------- Milestones & confetti ----------
function checkMilestones(key, label, totals) {
  const goals = METRICS.filter((m) => m.goal && totals[`goal_${m.key}`] > 0);
  for (const m of goals) {
    const p = pct(totals[m.key], totals[`goal_${m.key}`]);
    const reached = [25, 50, 75, 100].filter((x) => p >= x).pop();
    if (!reached) continue;
    const storeKey = `ms:${key}:${m.key}`;
    if (Number(store.get(storeKey) || 0) < reached) {
      store.set(storeKey, reached);
      celebrate(`${t('milestone', reached, label)} (${t(m.key)})`);
      return;
    }
  }
}

function celebrate(message) {
  const toast = h('div.toast', message);
  document.body.append(toast);
  setTimeout(() => toast.remove(), 4000);
  const cv = document.getElementById('confetti');
  const ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ['#6b2a8c', '#e8584f', '#ffd84a', '#5bb04a', '#7cc8ec', '#f39a3b'];
  const bits = Array.from({ length: 140 }, () => ({
    x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * 0.5,
    vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3, r: Math.random() * 6.28,
    s: [4, 8, 8, 12][(Math.random() * 4) | 0], c: colors[(Math.random() * colors.length) | 0],
  }));
  const start = performance.now();
  (function frame(now) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (const b of bits) {
      b.x += b.vx; b.y += b.vy; b.r += 0.1;
      ctx.fillStyle = b.c;
      ctx.fillRect(Math.round(b.x / 4) * 4, Math.round(b.y / 4) * 4, b.s, b.s);
    }
    if (now - start < 3500) requestAnimationFrame(frame); else ctx.clearRect(0, 0, cv.width, cv.height);
  })(start);
}

// ---------- Views ----------
async function viewJoin() {
  const info = await api('/api/info');
  document.getElementById('region-name').textContent = info.campaign.region_name;
  if (!info.churches.length) return [h('h1', t('welcome')), h('div.card', t('no_churches'))];
  const sel = h('select', info.churches.map((c) => h('option', { value: c.id }, c.name)));
  const code = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'characters' });
  const err = h('div.error');
  const form = h('form.card', {
    onsubmit: async (e) => {
      e.preventDefault();
      err.textContent = '';
      try {
        const r = await api('/api/join', { body: { church_id: Number(sel.value), code: code.value } });
        store.set('member', r.token);
        route();
      } catch { err.textContent = t('bad_code'); }
    },
  },
    h('p.muted', t('join_intro')),
    h('label.field', h('span', t('church')), sel),
    h('label.field', h('span', t('code')), code),
    h('button.btn.block', { type: 'submit' }, t('join')),
    err
  );
  return [dayBanner(info.campaign), h('h1', t('welcome')), form];
}

async function viewHome() {
  if (!store.get('member')) return viewJoin();
  let me;
  try { me = await api('/api/me'); } catch (e) {
    if (e.status === 401) { store.del('member'); return viewJoin(); }
    throw e;
  }
  document.getElementById('region-name').textContent = me.campaign.region_name;

  const out = [dayBanner(me.campaign)];
  if (me.word) out.push(h('div.card.word', h('h2', icon('star'), t('word_today')), h('p', pickText(me.word))));

  // Counters — saved shortly after the last tap.
  const counts = { ...me.today };
  const savedNote = h('span.saved');
  let timer;
  const save = () => {
    clearTimeout(timer);
    savedNote.textContent = '';
    timer = setTimeout(async () => {
      await api('/api/me/counts', { body: counts });
      savedNote.textContent = t('saved');
    }, 600);
  };
  const counterRows = METRICS.map((m) => {
    const val = h('span.val', counts[m.key]);
    const total = h('small', t('my_total', me.totals[m.key]));
    const bump = (d) => {
      const next = Math.max(0, Math.min(50, counts[m.key] + d));
      val.classList.remove('bump'); void val.offsetWidth; val.classList.add('bump');
      me.totals[m.key] += next - counts[m.key];
      counts[m.key] = next;
      val.textContent = next;
      total.textContent = t('my_total', me.totals[m.key]);
      save();
    };
    return h('div.counter',
      h('div.label', icon(m.key, 34), h('div', h('b', t(m.key)), h('small', t(m.key + '_hint')), total)),
      h('button.pxbtn', { type: 'button', 'aria-label': `${t(m.key)} −1`, onclick: () => bump(-1) }, '-'),
      val,
      h('button.pxbtn.plus', { type: 'button', 'aria-label': `${t(m.key)} +1`, onclick: () => bump(1) }, '+')
    );
  });
  out.push(h('div.card', h('h2', icon('heart'), t('my_today'), savedNote), counterRows));

  // Checklist
  const done = new Set(me.done);
  const streakText = h('span');
  const setStreak = (n) => { streakText.textContent = n ? t('streak', n) : t('streak_zero'); };
  setStreak(me.streak);
  const streakEl = h('div.streak', icon('flame', 26), streakText);
  const checks = me.checklist.map((item, i) => {
    const box = h('input', { type: 'checkbox', checked: done.has(item.id) });
    const num = h('span.num', i + 1);
    const setNum = () => num.replaceChildren(box.checked ? icon('check', 22) : String(i + 1));
    setNum();
    const lines = pickText(item).split('\n');
    const quote = lines.length > 1 ? lines.pop() : '';
    const row = h('label.check' + (done.has(item.id) ? '.done' : ''), box, num,
      h('span', h('span.desc', lines.join(' ')), quote ? h('span.quote', quote) : null));
    box.addEventListener('change', async () => {
      row.classList.toggle('done', box.checked);
      setNum();
      const r = await api('/api/me/checklist', { body: { item_id: item.id, done: box.checked } });
      setStreak(r.streak);
      if (box.checked && me.checklist.every((it) => it.id === item.id || done.has(it.id))) celebrate('💯 9/9!');
      box.checked ? done.add(item.id) : done.delete(item.id);
    });
    return row;
  });
  out.push(h('div.card', h('h2', icon('book'), t('checklist')), checks, streakEl));

  const progressCard = (iconName, title, totals) => h('div.card', h('h2', icon(iconName), title),
    METRICS.map((m) => progressRow(t(m.key), totals[m.key], m.goal ? totals[`goal_${m.key}`] : 0, m.key)));
  if (me.church) out.push(progressCard('returned', `${t('my_church')}: ${me.church.name}`, me.church));
  out.push(progressCard('globe', `${t('region')}: ${me.campaign.region_name}`, me.region));

  out.push(h('p.footer-links',
    h('a', { href: '#', onclick: (e) => {
      e.preventDefault();
      if (confirm(t('switch_confirm'))) { store.del('member'); route(); }
    } }, t('switch_church')), ' · ', h('a', { href: '#/leader' }, t('leader')), ' · ', h('a', { href: '#/admin' }, t('admin'))));

  if (me.church) checkMilestones(`c${me.church.id}`, t('you_church'), me.church);
  checkMilestones('region', t('the_region'), me.region);
  return out;
}

let boardMetric = 'returned';
let chartMetric = 'visits';
async function viewBoard() {
  const d = await api('/api/dashboard');
  document.getElementById('region-name').textContent = d.campaign.region_name;
  const r = d.region;
  const tiles = h('div.tiles',
    METRICS.map((m) => h('div.tile', icon(m.key, 30), h('div.n', r[m.key]), h('div.l', t(m.key)))),
    h('div.tile', icon('book', 30), h('div.n', r.practiced), h('div.l', t('practiced'))),
    h('div.tile', icon('people', 30), h('div.n', r.members), h('div.l', t('members_joined')))
  );

  const goalCard = h('div.card', h('h2', icon('globe'), t('region_totals')),
    METRICS.filter((m) => m.goal).map((m) => progressRow(t(m.key), r[m.key], r[`goal_${m.key}`], m.key)));

  // Ranking: by percent of goal where a goal exists, otherwise by raw count.
  const rankList = h('div');
  const seg = h('div.seg');
  const drawRank = () => {
    seg.replaceChildren(...METRICS.map((m) => h('button' + (m.key === boardMetric ? '.on' : ''), {
      type: 'button', onclick: () => { boardMetric = m.key; drawRank(); },
    }, icon(m.key, 18), t(m.key))));
    const m = METRICS.find((x) => x.key === boardMetric);
    const score = (c) => (m.goal && c[`goal_${m.key}`] > 0 ? c[m.key] / c[`goal_${m.key}`] : c[m.key] / 1e6);
    const sorted = [...d.churches].sort((a, b) => score(b) - score(a) || b[m.key] - a[m.key]);
    rankList.replaceChildren(...sorted.map((c, i) => h('div.rank',
      h('div.pos', i === 0 && c[m.key] > 0 ? icon('trophy', 26) : i + 1),
      h('div.body', h('div.name', c.name),
        progressRow(t(m.key), c[m.key], m.goal ? c[`goal_${m.key}`] : 0))
    )));
  };
  drawRank();

  // Daily bar chart
  const chartSeg = h('div.seg');
  const chartBox = h('div');
  const drawChart = () => {
    chartSeg.replaceChildren(...[...METRICS.map((m) => m.key), 'practiced'].map((k) => h('button' + (k === chartMetric ? '.on' : ''), {
      type: 'button', onclick: () => { chartMetric = k; drawChart(); },
    }, icon(k === 'practiced' ? 'book' : k, 18), k === 'practiced' ? t('practiced') : t(k))));
    const c = d.campaign;
    const days = [];
    for (let i = 0; i < c.total_days; i++) {
      const dt = new Date(c.start_date + 'T12:00:00Z'); dt.setUTCDate(dt.getUTCDate() + i);
      const key = dt.toISOString().slice(0, 10);
      days.push({ key, v: (d.series[key] || {})[chartMetric] || 0 });
    }
    const max = Math.max(1, ...days.map((x) => x.v));
    const W = 400, H = 140, bw = W / days.length;
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', `0 0 ${W} ${H + 10}`);
    svg.setAttribute('class', 'chart');
    svg.setAttribute('preserveAspectRatio', 'none');
    days.forEach((x, i) => {
      const rect = document.createElementNS(ns, 'rect');
      const bh = (x.v / max) * H;
      rect.setAttribute('x', i * bw + 1); rect.setAttribute('width', Math.max(1, bw - 2));
      rect.setAttribute('y', H - bh); rect.setAttribute('height', Math.max(bh, x.v ? 2 : 0.5));
      rect.setAttribute('rx', 2);
      if (x.key === c.today) rect.setAttribute('class', 'today');
      const title = document.createElementNS(ns, 'title'); title.textContent = `${x.key}: ${x.v}`;
      rect.append(title);
      svg.append(rect);
    });
    chartBox.replaceChildren(svg, h('div.small.muted', { style: 'display:flex;justify-content:space-between' },
      h('span', c.start_date), h('span', `max ${max}`), h('span', c.end_date)));
  };
  drawChart();

  checkMilestones('region', t('the_region'), r);
  return [dayBanner(d.campaign), tiles, goalCard,
    h('div.card', h('h2', icon('trophy'), t('ranking')), seg, rankList),
    h('div.card', h('h2', icon('chart'), t('per_day')), chartSeg, chartBox)];
}

async function viewStories() {
  const d = await api('/api/dashboard');
  const out = [h('h1', t('stories_title'))];
  if (store.get('member')) {
    const ta = h('textarea', { maxlength: 500, placeholder: t('story_placeholder') });
    out.push(h('form.card', {
      onsubmit: async (e) => {
        e.preventDefault();
        if (ta.value.trim().length < 3) return;
        await api('/api/testimonies', { body: { text: ta.value } });
        route();
      },
    }, h('p.muted.small', t('stories_intro')), ta, h('div', { style: 'margin-top:10px' }, h('button.btn', { type: 'submit' }, t('share')))));
  }
  out.push(h('div.card', d.testimonies.length
    ? d.testimonies.map((s) => h('div.story', icon('heart', 22),
      h('div', h('p', s.text), h('div.small.muted', `${s.church} · ${s.created_at.slice(0, 10)}`))))
    : h('p.muted', t('no_stories'))));
  return out;
}

// ---------- Admin ----------
async function viewAdmin() {
  if (!sessionStorage.getItem('adminPin')) {
    const pin = h('input', { type: 'password', autocomplete: 'current-password' });
    const err = h('div.error');
    return [h('h1', '🔐 ' + t('admin')), h('form.card', {
      onsubmit: async (e) => {
        e.preventDefault();
        sessionStorage.setItem('adminPin', pin.value);
        try { await api('/api/admin/login', { body: {} }); route(); } catch {
          sessionStorage.removeItem('adminPin'); err.textContent = t('bad_pin');
        }
      },
    }, h('label.field', h('span', t('pin')), pin), h('button.btn.block', { type: 'submit' }, t('login')), err)];
  }
  let d;
  try { d = await api('/api/admin/data'); } catch (e) {
    if (e.status === 401) { sessionStorage.removeItem('adminPin'); return viewAdmin(); }
    throw e;
  }
  const post = async (path, body) => { await api(path, { body }); route(); };
  const field = (label, input) => h('label.field', h('span', label), input);

  // Settings
  const rn = h('input', { type: 'text', value: d.settings.region_name });
  const sd = h('input', { type: 'date', value: d.settings.start_date });
  const ed = h('input', { type: 'date', value: d.settings.end_date });
  const settings = h('form.card', { onsubmit: (e) => { e.preventDefault(); post('/api/admin/settings', { region_name: rn.value, start_date: sd.value, end_date: ed.value }); } },
    h('h2', '⚙️ Settings'), field('Region name', rn), h('div.grid2', field('Start date', sd), field('End date', ed)),
    h('button.btn', { type: 'submit' }, 'Save settings'));

  // Churches
  const churchForm = (c = {}) => {
    const name = h('input', { type: 'text', value: c.name || '', placeholder: 'Church name' });
    const code = h('input', { type: 'text', value: c.join_code || '', placeholder: 'Join code' });
    const lpin = h('input', { type: 'text', value: c.leader_pin || '', placeholder: 'Leader PIN' });
    const gv = h('input', { type: 'number', min: 0, value: c.goal_visits ?? 0 });
    const gr = h('input', { type: 'number', min: 0, value: c.goal_returned ?? 0 });
    const gl = h('input', { type: 'number', min: 0, value: c.goal_letters ?? 0 });
    return h('form.admin-row', { onsubmit: (e) => {
      e.preventDefault();
      post('/api/admin/church', { id: c.id, name: name.value, join_code: code.value, leader_pin: lpin.value, goal_visits: gv.value, goal_returned: gr.value, goal_letters: gl.value });
    } },
      h('div.grid3', field('Church name', name), field('Member join code', code), field('Leader PIN', lpin)),
      h('div.grid3', field('Goal: visits', gv), field('Goal: returned', gr), field('Goal: letters', gl)),
      h('div.actions',
        h('button.btn.sm', { type: 'submit' }, c.id ? 'Save' : '+ Add church'),
        c.id ? h('button.btn.sm.danger', { type: 'button', onclick: () => {
          if (confirm(`Delete ${c.name} and ALL its data?`)) post('/api/admin/church/delete', { id: c.id });
        } }, 'Delete') : null)
    );
  };
  const churches = h('div.card', h('h2', '⛪ Churches & goals'),
    h('p.small.muted', 'Members join with the join code. Leaders use the leader PIN on the Leaders page to edit goals and enter counts for members. Prayers are counted but have no goal.'),
    d.churches.map(churchForm), churchForm());

  // Checklist
  const itemForm = (it = {}) => {
    const en = h('textarea', { value: it.text_en || '', placeholder: 'English: description, then the phrase on a new line' });
    const es = h('textarea', { value: it.text_es || '', placeholder: 'Español: descripción, y la frase en una línea nueva' });
    const sort = h('input', { type: 'number', value: it.sort ?? d.checklist.length, style: 'max-width:90px' });
    return h('form.admin-row', { onsubmit: (e) => { e.preventDefault(); post('/api/admin/checklist', { id: it.id, text_en: en.value, text_es: es.value, sort: sort.value }); } },
      en, es,
      h('div.actions', sort, h('button.btn.sm', { type: 'submit' }, it.id ? 'Save' : '+ Add item'),
        it.id ? h('button.btn.sm.danger', { type: 'button', onclick: () => {
          if (confirm('Delete this checklist item?')) post('/api/admin/checklist/delete', { id: it.id });
        } }, 'Delete') : null));
  };
  const checklist = h('div.card', h('h2', "📖 Mother's words checklist"), d.checklist.map(itemForm), itemForm());

  // Daily words
  const total = Math.round((Date.parse(d.settings.end_date) - Date.parse(d.settings.start_date)) / 86400000) + 1;
  const words = Object.fromEntries(d.words.map((w) => [w.day_number, w]));
  const wordRows = [];
  for (let n = 1; n <= total; n++) {
    const w = words[n] || {};
    const en = h('textarea', { placeholder: 'English', value: w.text_en || '' });
    const es = h('textarea', { placeholder: 'Español', value: w.text_es || '' });
    const note = h('span.saved');
    wordRows.push(h('form.admin-row', { onsubmit: async (e) => {
      e.preventDefault();
      await api('/api/admin/word', { body: { day_number: n, text_en: en.value, text_es: es.value } });
      note.textContent = 'Saved ✓';
    } }, h('strong', `Day ${n}`), en, es, h('div.actions', h('button.btn.sm', { type: 'submit' }, 'Save'), note)));
  }
  const wordsCard = h('div.card', h('details', h('summary', `✨ Word of the day (${d.words.filter((w) => w.text_en || w.text_es).length}/${total} filled)`), wordRows));

  // Testimonies
  const stories = h('div.card', h('details', h('summary', `💌 Stories (${d.testimonies.length})`),
    d.testimonies.map((s) => h('div.story', h('p', s.text), h('div.actions', h('span.small.muted', `${s.church} · ${s.created_at}`),
      h('button.btn.sm.danger', { type: 'button', onclick: () => post('/api/admin/testimony/delete', { id: s.id }) }, 'Remove'))))));

  // Export / reset
  const tools = h('div.card', h('h2', '🧰 Tools'),
    h('p', h('a.btn.ghost', { href: '#/leader' }, 'Open the Leaders page (enter counts / goals for any church)')),
    h('div.actions',
      h('button.btn.ghost', { type: 'button', onclick: async () => {
        const res = await fetch('/api/admin/export.csv', { headers: { 'X-Admin-Pin': sessionStorage.getItem('adminPin') } });
        const url = URL.createObjectURL(await res.blob());
        h('a', { href: url, download: 'movement.csv' }).click();
        URL.revokeObjectURL(url);
      } }, '⬇️ Export CSV'),
      h('button.btn.danger', { type: 'button', onclick: () => {
        const c = prompt('This deletes ALL counts, checklist marks and stories (churches and settings stay). Type RESET to confirm.');
        if (c === 'RESET') post('/api/admin/reset-activity', { confirm: 'RESET' });
      } }, 'Reset activity'),
      h('button.btn.ghost', { type: 'button', onclick: () => { sessionStorage.removeItem('adminPin'); location.hash = '#/'; } }, 'Log out')));

  return [h('h1', '🔐 Admin'), settings, churches, checklist, wordsCard, stories, tools];
}

// ---------- Leaders (and the Elder) ----------
async function viewLeader() {
  const info = await api('/api/info');
  document.getElementById('region-name').textContent = info.campaign.region_name;
  const isElder = !!sessionStorage.getItem('adminPin');
  let churchId = Number(sessionStorage.getItem('leaderChurch')) || (isElder ? info.churches[0]?.id : 0);
  if (!info.churches.length) return [h('h1', t('leader_title')), h('div.card', t('no_churches'))];

  const loginForm = (message) => {
    const sel = h('select', info.churches.map((c) => h('option', { value: c.id }, c.name)));
    const pin = h('input', { type: 'password', autocomplete: 'off' });
    const err = h('div.error', message || '');
    return [h('h1', t('leader_title')), h('form.card', {
      onsubmit: async (e) => {
        e.preventDefault();
        sessionStorage.setItem('leaderPin', pin.value);
        sessionStorage.setItem('leaderChurch', sel.value);
        try { await api('/api/leader/church', { body: { church_id: Number(sel.value) } }); route(); } catch {
          sessionStorage.removeItem('leaderPin'); err.textContent = t('bad_pin');
        }
      },
    }, h('p.muted', t('leader_intro')),
      h('label.field', h('span', t('church')), sel),
      h('label.field', h('span', t('leader_pin')), pin),
      h('button.btn.block', { type: 'submit' }, t('login')), err)];
  };
  if (!isElder && !sessionStorage.getItem('leaderPin')) return loginForm();

  let d;
  try { d = await api('/api/leader/church', { body: { church_id: churchId } }); } catch (e) {
    if (e.status === 401) { sessionStorage.removeItem('leaderPin'); return loginForm(t('bad_pin')); }
    throw e;
  }
  const c = d.church;
  const out = [h('h1', t('leader_title'))];

  if (d.role === 'elder') {
    const sel = h('select', { onchange: () => { sessionStorage.setItem('leaderChurch', sel.value); route(); } },
      info.churches.map((x) => h('option', { value: x.id, selected: x.id === c.id }, x.name)));
    out.push(h('div.card', h('p.small.muted', { style: 'margin-top:0' }, t('elder_note')), h('label.field', h('span', t('church')), sel)));
  }

  // Goals
  const goalInputs = {};
  const goalNote = h('span.saved');
  out.push(h('form.card', {
    onsubmit: async (e) => {
      e.preventDefault();
      const body = { church_id: c.id };
      for (const [k, el] of Object.entries(goalInputs)) body[`goal_${k}`] = el.value;
      await api('/api/leader/goals', { body });
      goalNote.textContent = t('saved');
    },
  }, h('h2', icon('trophy'), `${t('goals')}: ${c.name}`),
    h('div.grid3', METRICS.filter((m) => m.goal).map((m) => {
      goalInputs[m.key] = h('input', { type: 'number', min: 0, value: c[`goal_${m.key}`] });
      return h('label.field', h('span', t(m.key)), goalInputs[m.key]);
    })),
    h('div.actions', h('button.btn', { type: 'submit' }, t('save_goals')), goalNote),
    METRICS.map((m) => progressRow(t(m.key), c[m.key], m.goal ? c[`goal_${m.key}`] : 0, m.key))));

  // Enter counts for a member
  const date = h('input', { type: 'date', value: d.campaign.today, max: d.campaign.today, min: d.campaign.start_date });
  const vals = {};
  const counterRows = METRICS.map((m) => {
    vals[m.key] = 0;
    const val = h('span.val', 0);
    const bump = (n) => { vals[m.key] = Math.max(0, Math.min(50, vals[m.key] + n)); val.textContent = vals[m.key]; };
    return h('div.counter',
      h('div.label', icon(m.key, 30), h('div', h('b', t(m.key)))),
      h('button.pxbtn', { type: 'button', 'aria-label': `${t(m.key)} −1`, onclick: () => bump(-1) }, '-'),
      val,
      h('button.pxbtn.plus', { type: 'button', 'aria-label': `${t(m.key)} +1`, onclick: () => bump(1) }, '+'));
  });
  const phraseBoxes = d.checklist.map((item, i) => {
    const box = h('input', { type: 'checkbox' });
    const num = h('span.num', i + 1);
    const row = h('label.check', box, num, h('span.quote', pickText(item).split('\n').pop()));
    box.addEventListener('change', () => {
      row.classList.toggle('done', box.checked);
      num.replaceChildren(box.checked ? icon('check', 22) : String(i + 1));
    });
    return { box, row };
  });
  const msg = h('div.error');
  const ok = h('span.saved');
  out.push(h('form.card', {
    onsubmit: async (e) => {
      e.preventDefault();
      msg.textContent = ''; ok.textContent = '';
      const practiced = phraseBoxes.filter((p) => p.box.checked).length;
      try {
        await api('/api/leader/entry', { body: { church_id: c.id, day: date.value, ...vals, practiced } });
        ok.textContent = t('added');
        setTimeout(route, 700);
      } catch (err) { msg.textContent = err.message === 'empty' ? t('empty_entry') : err.message; }
    },
  }, h('h2', icon('heart'), t('for_member')),
    h('p.small.muted', { style: 'margin-top:0' }, t('for_member_intro')),
    h('label.field', h('span', t('date')), date),
    counterRows,
    h('details', { style: 'margin:10px 0' }, h('summary', `${t('phrases_practiced')}`), phraseBoxes.map((p) => p.row)),
    h('div.actions', h('button.btn', { type: 'submit' }, t('add_entry')), ok), msg));

  // Recent manual entries
  out.push(h('div.card', h('h2', icon('book'), t('recent')),
    d.entries.length ? d.entries.map((en) => h('div.story',
      h('div', { style: 'flex:1' },
        h('b', en.day), ' · ', h('span.small.muted', en.entered_by === 'elder' ? t('by_elder') : t('by_leader')),
        h('div.small', METRICS.filter((m) => en[m.key]).map((m) => `${t(m.key)}: ${en[m.key]}`)
          .concat(en.practiced ? [`${t('practiced')}: ${en.practiced}`] : []).join(' · '))),
      h('button.btn.sm.danger', { type: 'button', onclick: async () => {
        if (!confirm(t('remove_confirm'))) return;
        await api('/api/leader/entry/delete', { body: { church_id: c.id, id: en.id } });
        route();
      } }, t('remove'))))
      : h('p.muted', t('none_yet'))));

  out.push(h('p.footer-links', h('a', { href: '#', onclick: (e) => {
    e.preventDefault();
    sessionStorage.removeItem('leaderPin'); sessionStorage.removeItem('leaderChurch');
    if (d.role === 'elder') location.hash = '#/admin'; else route();
  } }, t('log_out'))));
  return out;
}

// ---------- Router ----------
const VIEWS = { '': viewHome, board: viewBoard, stories: viewStories, leader: viewLeader, admin: viewAdmin };
async function route() {
  const name = location.hash.replace(/^#\/?/, '').split('/')[0];
  const view = VIEWS[name] || viewHome;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.getElementById('lang-toggle').textContent = lang === 'en' ? 'ES' : 'EN';
  document.documentElement.lang = lang;
  document.querySelectorAll('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === (name || 'home')));
  try {
    const nodes = await view();
    app.replaceChildren(...nodes);
  } catch (e) {
    console.error(e);
    app.replaceChildren(h('div.card', h('p.error', 'Could not load. Check your connection and try again.'),
      h('button.btn', { type: 'button', onclick: route }, '↻')));
  }
}

document.querySelectorAll('#tabs a').forEach((a) => a.querySelector('.ico').append(icon(a.dataset.icon, 26)));
document.getElementById('lang-toggle').addEventListener('click', () => {
  lang = lang === 'en' ? 'es' : 'en';
  store.set('lang', lang);
  route();
});
addEventListener('hashchange', route);
// Refresh the region board while it's open so it feels live.
setInterval(() => { if (location.hash.startsWith('#/board') && !document.hidden) route(); }, 60000);
route();
