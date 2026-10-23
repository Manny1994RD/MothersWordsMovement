// Mother's Words Movement tracker — client (no build step).
'use strict';

const I18N = {
  en: {
    nav_home: 'Home', nav_board: 'Region', nav_stories: 'Activity', tagline: "40 Days of Mother's Love",
    hero_kicker: 'Beginning of Peace', hero_a: 'The Words of', hero_b: "Mother's Love",
    welcome: 'Welcome!', join_intro: 'Choose your church and enter the code your leader gave you. Use a nickname: no real name needed, and results are only counts.',
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
    leader_pin: 'Leader PIN', elder_note: 'Logged in as Elder (overseer) — you can see and adjust every church.',
    admin_note: 'Logged in as Admin — you can see and adjust every church.', overseer_opt: '★ Elder / Overseer (all churches)',
    pin: 'PIN', overview: 'All churches', reported_today: (a, b) => `${a}/${b} teams reported today`, manage: 'Manage', by_admin: 'Admin',
    goals: 'Church goals', save_goals: 'Save goals', for_member: 'Enter for a member',
    for_member_intro: 'Adds to the church totals. No names — only numbers.', date: 'Date',
    phrases_practiced: 'Phrases practiced (of the 9)', add_entry: 'Add entry', added: 'Added ✓',
    recent: 'Entered by leaders', none_yet: 'Nothing entered yet.', remove: 'Remove', remove_confirm: 'Remove this entry?',
    by_elder: 'Elder', by_leader: 'Leader', log_out: 'Log out', empty_entry: 'Enter at least one number.',
    nav_team: 'Team', team: 'Team', my_team: 'My team', no_team: '— No team —', team_optional: 'Your team (optional)',
    team_title: 'Team leader', team_intro: 'Team leaders report their team’s numbers. Everyone else can see the results.',
    have_invite: 'I have an invitation', new_team: 'Create my team', team_code: 'Team invitation code',
    team_name: 'Team name', team_pin: 'Team PIN (at least 4 digits, to log in on another phone)',
    already_team: 'My team is already set up', pick_team: 'Team', bad_team_pin: 'Wrong team PIN.',
    team_exists: 'A team with that name already exists in this church.', pin_too_short: 'The PIN needs at least 4 characters.',
    name_required: 'Enter a team name.', team_pin_short: 'Team PIN', report_for: 'Report for', report_title: 'Team report',
    report_hint: 'Totals for your whole team on this day. Change the date to fix an earlier day.',
    team_totals: 'Team totals (all 40 days)', church_teams: 'Teams in my church', rank_teams: 'Team ranking',
    top_teams: 'Top teams in the region', awards: 'Awards', award_visits: 'Most visits', award_returned: 'Most members brought back',
    award_prayers: 'Most prayers', award_letters: 'Most letters to Mother', award_practiced: 'Most Words of Mother practiced',
    no_teams: 'No teams yet. Team leaders join with an invitation.', last_report: (d) => `Last report: ${d}`,
    team_leader_cta: 'Are you a team leader? Report your team’s numbers here.',
    invite: 'Team leader invitation', invite_intro: 'Send this link (or the code) to each team leader. They enter their team name and a PIN.',
    copy_link: 'Copy invitation link', copied: 'Copied ✓', teams_title: 'Teams', reset_pin: 'New PIN', delete_team: 'Delete team',
    delete_team_confirm: (n) => `Delete team “${n}”? Its reports are deleted too.`, new_pin_prompt: 'New team PIN (at least 4 characters):',
    for_team: 'Team (optional)', church_wide: '— Whole church —', reported_by_teams: 'Results are reported by team leaders.',
  },
  es: {
    nav_home: 'Inicio', nav_board: 'Región', nav_stories: 'Actividad', tagline: '40 días del amor de la Madre',
    hero_kicker: 'Inicio de la Paz', hero_a: 'Palabras de Amor de la', hero_b: 'Madre',
    welcome: '¡Bienvenido!', join_intro: 'Elige tu iglesia e ingresa el código que te dio tu líder. Usa un apodo: no hace falta tu nombre real, y los resultados son solo números.',
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
    leader_pin: 'PIN de líder', elder_note: 'Conectado como Anciano (supervisor) — puede ver y ajustar todas las iglesias.',
    admin_note: 'Conectado como Admin — puede ver y ajustar todas las iglesias.', overseer_opt: '★ Anciano / Supervisor (todas las iglesias)',
    pin: 'PIN', overview: 'Todas las iglesias', reported_today: (a, b) => `${a}/${b} equipos reportaron hoy`, manage: 'Administrar', by_admin: 'Admin',
    goals: 'Metas de la iglesia', save_goals: 'Guardar metas', for_member: 'Ingresar por un miembro',
    for_member_intro: 'Se suma a los totales de la iglesia. Sin nombres — solo números.', date: 'Fecha',
    phrases_practiced: 'Frases practicadas (de las 9)', add_entry: 'Agregar', added: 'Agregado ✓',
    recent: 'Ingresado por líderes', none_yet: 'Nada ingresado todavía.', remove: 'Quitar', remove_confirm: '¿Quitar esta entrada?',
    by_elder: 'Anciano', by_leader: 'Líder', log_out: 'Salir', empty_entry: 'Ingrese al menos un número.',
    nav_team: 'Equipo', team: 'Equipo', my_team: 'Mi equipo', no_team: '— Sin equipo —', team_optional: 'Tu equipo (opcional)',
    team_title: 'Líder de equipo', team_intro: 'Los líderes de equipo reportan los números de su equipo. Todos los demás pueden ver los resultados.',
    have_invite: 'Tengo una invitación', new_team: 'Crear mi equipo', team_code: 'Código de invitación del equipo',
    team_name: 'Nombre del equipo', team_pin: 'PIN del equipo (mínimo 4 dígitos, para entrar en otro teléfono)',
    already_team: 'Mi equipo ya está creado', pick_team: 'Equipo', bad_team_pin: 'PIN del equipo incorrecto.',
    team_exists: 'Ya existe un equipo con ese nombre en esta iglesia.', pin_too_short: 'El PIN necesita al menos 4 caracteres.',
    name_required: 'Ingrese un nombre de equipo.', team_pin_short: 'PIN del equipo', report_for: 'Reporte del', report_title: 'Reporte del equipo',
    report_hint: 'Totales de todo tu equipo en este día. Cambia la fecha para corregir un día anterior.',
    team_totals: 'Totales del equipo (los 40 días)', church_teams: 'Equipos de mi iglesia', rank_teams: 'Clasificación de equipos',
    top_teams: 'Mejores equipos de la región', awards: 'Premios', award_visits: 'Más visitas', award_returned: 'Más miembros que regresaron',
    award_prayers: 'Más oraciones', award_letters: 'Más cartas a la Madre', award_practiced: 'Más Palabras de la Madre practicadas',
    no_teams: 'Aún no hay equipos. Los líderes de equipo entran con una invitación.', last_report: (d) => `Último reporte: ${d}`,
    team_leader_cta: '¿Eres líder de equipo? Reporta aquí los números de tu equipo.',
    invite: 'Invitación para líderes de equipo', invite_intro: 'Envía este enlace (o el código) a cada líder de equipo. Ellos ponen el nombre del equipo y un PIN.',
    copy_link: 'Copiar enlace de invitación', copied: 'Copiado ✓', teams_title: 'Equipos', reset_pin: 'Nuevo PIN', delete_team: 'Eliminar equipo',
    delete_team_confirm: (n) => `¿Eliminar el equipo “${n}”? Sus reportes también se eliminan.`, new_pin_prompt: 'Nuevo PIN del equipo (mínimo 4 caracteres):',
    for_team: 'Equipo (opcional)', church_wide: '— Toda la iglesia —', reported_by_teams: 'Los resultados los reportan los líderes de equipo.',
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
  const teamToken = store.get('team');
  if (teamToken && path.startsWith('/api/team')) headers['X-Team'] = teamToken;
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
  const firstVisit = !store.get('seen:' + key);
  for (const m of goals) {
    const p = pct(totals[m.key], totals[`goal_${m.key}`]);
    const reached = [25, 50, 75, 100].filter((x) => p >= x).pop();
    if (!reached) continue;
    const storeKey = `ms:${key}:${m.key}`;
    // On a device's first visit, remember milestones already reached instead of celebrating old news.
    if (store.get(storeKey) == null && !store.get('seen:' + key)) { store.set(storeKey, reached); continue; }
    if (Number(store.get(storeKey) || 0) < reached) {
      store.set(storeKey, reached);
      celebrate(`${t('milestone', reached, label)} (${t(m.key)})`);
      store.set('seen:' + key, '1');
      return;
    }
  }
  if (firstVisit) store.set('seen:' + key, '1');
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

// Hash routes may carry a query, e.g. #/team?church=1&code=TEAM-ABC
const hashParams = () => new URLSearchParams(location.hash.split('?')[1] || '');

async function teamSelect(churchId, selected, emptyLabel) {
  const { teams } = await api(`/api/teams?church_id=${churchId}`);
  const sel = h('select', h('option', { value: '' }, emptyLabel),
    teams.map((x) => h('option', { value: x.id, selected: x.id === selected }, x.name)));
  return { sel, teams };
}

const RANK_KEYS = [...METRICS.map((m) => m.key), 'practiced'];
const rankLabel = (k) => (k === 'practiced' ? t('practiced') : t(k));
const rankIcon = (k) => (k === 'practiced' ? 'book' : k);

// ---------- Extra text: badges, levels, sides, feed ----------
Object.assign(I18N.en, {
  save: 'Save', sisters: 'Sisters', brothers: 'Brothers', all_sides: 'All', side: 'Side', side_required: 'Choose Brothers or Sisters.',
  team_size: 'People on the team', team_size_hint: 'Used to compare teams fairly (results per member).',
  total: 'Total', per_member: 'Per member', per_member_short: (v) => `${v} / member`, set_size: 'Set team size to rank per member',
  team_settings: 'Team settings', badges: 'Badges', my_badges: 'My badges', team_badges: 'Team badges',
  earned_of: (a, b) => `${a} of ${b} earned`, locked: 'Locked', show_all: 'Show all', earned_only: 'Earned only',
  level: (n) => `Level ${n}`, level_next: (a, b) => `${a} / ${b} badges to the next level`, level_max: 'Highest level!',
  lv1: 'Seed', lv2: 'Sprout', lv3: 'Bud', lv4: 'Flower', lv5: 'Daisy', lv6: 'Bouquet',
  tier_bronze: 'Bronze', tier_silver: 'Silver', tier_gold: 'Gold', tier_diamond: 'Diamond', tier_legend: 'Legend',
  awards_note: 'Awards compare results per member, Sisters with Sisters and Brothers with Brothers.',
  weekly: (n) => `Week ${n} challenge`, weekly_focus: (m) => `${m}: the highest average per member this week wins`, past_winners: 'Past weekly champions',
  garden: 'Region garden', garden_intro: 'Every member who comes back plants a daisy.', garden_empty: 'The garden is waiting for its first daisy…',
  focus_today: "Today's focus phrase", nav_feed: 'Activity', feed_title: 'Activity', feed_empty: 'No activity yet.',
  ev_report: (team) => `${team} reported`, ev_badge: (team) => `${team} earned new badges!`, ev_level: (team, n, name) => `${team} grew to Level ${n} · ${name}!`,
  ev_team: (team, side) => `New team: ${team}${side ? ` (${side})` : ''}`, ev_story: 'Story of grace',
  ago_now: 'just now', ago_min: (n) => `${n} min ago`, ago_h: (n) => `${n} h ago`, ago_d: (n) => `${n} d ago`,
  share: 'Share', share_region: 'Share today’s results', share_team: 'Share our team’s day',
  tv: 'TV mode', recap: 'Final results', certificate: 'Certificate', print: 'Print', cert_title: 'Certificate of Recognition',
  cert_body: (team, church) => `presented to team ${team} of ${church}`, cert_for: 'for', not_reported: 'Not reported today',
  new_badge_toast: (n) => `🏅 ${n} new badge${n === 1 ? '' : 's'}!`, level_up_toast: (n) => `🌼 Level up! Level ${n}`,
  recap_intro: 'Results so far. After the last day these are the final awards.',
  nickname: 'Nickname', nickname_hint: 'Only your team leader sees it. You use it to get back in on another phone.',
  pin4: '4-digit PIN', pin4_hint: 'Remember it. You’ll need it with your nickname.',
  already_joined: 'I already joined', already_intro: 'Logged out or using a new phone? Enter your nickname and PIN.',
  get_back_in: 'Get back in', bad_login: 'Nickname or PIN is not correct.', too_many_tries: 'Too many tries. Wait 15 minutes and try again.',
  nickname_taken: 'That nickname is already used in this church. Try another one.', nickname_required: 'Choose a nickname (at least 2 letters).',
  pin_4_digits: 'The PIN must be exactly 4 digits.', invited_to: (team, church) => `You’re invited to team ${team} · ${church}`,
  save_spot: 'Save your spot', save_spot_intro: 'Pick a nickname and a 4-digit PIN so you can get back in if you change phones.',
  signed_in_as: (n) => `Signed in as ${n}`, invite_members: 'Invite members',
  invite_members_intro: 'Send this link to your team’s group chat. Members open it, pick a nickname and PIN, and they’re on your team.',
  send_invite: 'Send invitation', team_members: (n) => `Team members (${n})`, no_members: 'No members have joined yet. Send them the invitation!',
  practiced_today: 'Practiced today', not_yet_today: 'Not yet today', new_member_pin: 'New 4-digit PIN for this member:',
  remove_member_confirm: (n) => `Remove ${n} from the team?`, moved_to_team: (team) => `You joined team ${team}!`,
  invite_text: (team) => `Join our team ${team} in the 40 Days of Mother's Love app 🌼`, member_pin_reset: 'PIN changed. Tell the member their new PIN.',
  badges_how: 'You earn your own badges: practice Mother’s words every day (especially today’s focus phrase), share stories, cheer others in Activity, share the results — and when your team grows, you grow with it.',
});
Object.assign(I18N.es, {
  save: 'Guardar', sisters: 'Hermanas', brothers: 'Hermanos', all_sides: 'Todos', side: 'Lado', side_required: 'Elige Hermanos o Hermanas.',
  team_size: 'Personas en el equipo', team_size_hint: 'Sirve para comparar equipos de forma justa (resultados por miembro).',
  total: 'Total', per_member: 'Por miembro', per_member_short: (v) => `${v} / miembro`, set_size: 'Indica el tamaño del equipo para clasificar por miembro',
  team_settings: 'Ajustes del equipo', badges: 'Insignias', my_badges: 'Mis insignias', team_badges: 'Insignias del equipo',
  earned_of: (a, b) => `${a} de ${b} ganadas`, locked: 'Bloqueada', show_all: 'Ver todas', earned_only: 'Solo ganadas',
  level: (n) => `Nivel ${n}`, level_next: (a, b) => `${a} / ${b} insignias para el siguiente nivel`, level_max: '¡Nivel máximo!',
  lv1: 'Semilla', lv2: 'Brote', lv3: 'Capullo', lv4: 'Flor', lv5: 'Margarita', lv6: 'Ramo',
  tier_bronze: 'Bronce', tier_silver: 'Plata', tier_gold: 'Oro', tier_diamond: 'Diamante', tier_legend: 'Leyenda',
  awards_note: 'Los premios comparan resultados por miembro: Hermanas con Hermanas y Hermanos con Hermanos.',
  weekly: (n) => `Reto de la semana ${n}`, weekly_focus: (m) => `${m}: gana el promedio más alto por miembro esta semana`, past_winners: 'Campeones de semanas anteriores',
  garden: 'Jardín de la región', garden_intro: 'Cada miembro que regresa planta una margarita.', garden_empty: 'El jardín espera su primera margarita…',
  focus_today: 'Frase de enfoque de hoy', nav_feed: 'Actividad', feed_title: 'Actividad', feed_empty: 'Aún no hay actividad.',
  ev_report: (team) => `${team} reportó`, ev_badge: (team) => `¡${team} ganó nuevas insignias!`, ev_level: (team, n, name) => `¡${team} creció al Nivel ${n} · ${name}!`,
  ev_team: (team, side) => `Nuevo equipo: ${team}${side ? ` (${side})` : ''}`, ev_story: 'Historia de gracia',
  ago_now: 'ahora', ago_min: (n) => `hace ${n} min`, ago_h: (n) => `hace ${n} h`, ago_d: (n) => `hace ${n} d`,
  share: 'Compartir', share_region: 'Compartir resultados de hoy', share_team: 'Compartir el día del equipo',
  tv: 'Modo TV', recap: 'Resultados finales', certificate: 'Certificado', print: 'Imprimir', cert_title: 'Certificado de Reconocimiento',
  cert_body: (team, church) => `otorgado al equipo ${team} de ${church}`, cert_for: 'por', not_reported: 'No ha reportado hoy',
  new_badge_toast: (n) => `🏅 ¡${n} insignia${n === 1 ? '' : 's'} nueva${n === 1 ? '' : 's'}!`, level_up_toast: (n) => `🌼 ¡Subió de nivel! Nivel ${n}`,
  recap_intro: 'Resultados hasta ahora. Después del último día, estos son los premios finales.',
  nickname: 'Apodo', nickname_hint: 'Solo tu líder de equipo lo ve. Lo usas para volver a entrar en otro teléfono.',
  pin4: 'PIN de 4 dígitos', pin4_hint: 'Recuérdalo. Lo necesitarás junto con tu apodo.',
  already_joined: 'Ya me uní', already_intro: '¿Se cerró la sesión o tienes un teléfono nuevo? Ingresa tu apodo y PIN.',
  get_back_in: 'Volver a entrar', bad_login: 'El apodo o el PIN no es correcto.', too_many_tries: 'Demasiados intentos. Espera 15 minutos y vuelve a intentar.',
  nickname_taken: 'Ese apodo ya se usa en esta iglesia. Prueba otro.', nickname_required: 'Elige un apodo (al menos 2 letras).',
  pin_4_digits: 'El PIN debe tener exactamente 4 dígitos.', invited_to: (team, church) => `Estás invitado al equipo ${team} · ${church}`,
  save_spot: 'Guarda tu lugar', save_spot_intro: 'Elige un apodo y un PIN de 4 dígitos para poder volver a entrar si cambias de teléfono.',
  signed_in_as: (n) => `Conectado como ${n}`, invite_members: 'Invitar miembros',
  invite_members_intro: 'Envía este enlace al chat de tu equipo. Los miembros lo abren, eligen un apodo y PIN, y quedan en tu equipo.',
  send_invite: 'Enviar invitación', team_members: (n) => `Miembros del equipo (${n})`, no_members: 'Aún no se ha unido nadie. ¡Envíales la invitación!',
  practiced_today: 'Practicó hoy', not_yet_today: 'Aún no hoy', new_member_pin: 'Nuevo PIN de 4 dígitos para este miembro:',
  remove_member_confirm: (n) => `¿Quitar a ${n} del equipo?`, moved_to_team: (team) => `¡Te uniste al equipo ${team}!`,
  invite_text: (team) => `Únete a nuestro equipo ${team} en la app 40 días del amor de la Madre 🌼`, member_pin_reset: 'PIN cambiado. Dile al miembro su nuevo PIN.',
  badges_how: 'Ganas tus propias insignias: practica las palabras de la Madre cada día (sobre todo la frase de enfoque), comparte historias, anima a otros en Actividad, comparte los resultados — y cuando tu equipo crece, tú creces con él.',
});

// name / description for each badge, in both languages. Tiered badges share a group name.
const BADGE_TEXT = {
  first_report: [['First Report', 'Report your team’s numbers for the first time'], ['Primer reporte', 'Reportar los números del equipo por primera vez']],
  day_one: [['Day One', 'Report on the first day of the movement'], ['Día uno', 'Reportar el primer día del movimiento']],
  full_house: [['Full House', 'Visits, returns, prayers and letters all in one day'], ['Casa llena', 'Visitas, regresos, oraciones y cartas en un mismo día']],
  big_day: [['Big Day', '10 or more visits in one day'], ['Gran día', '10 o más visitas en un día']],
  prayer_day: [['Prayer Warriors', '20 or more prayers in one day'], ['Guerreros de oración', '20 o más oraciones en un día']],
  letter_day: [['Mail Day', '5 or more letters to Mother in one day'], ['Día de cartas', '5 o más cartas a la Madre en un día']],
  roster: [['Full Roster', 'Everyone on the team joined the app'], ['Equipo completo', 'Todos en el equipo se unieron a la app']],
  champion: [['Weekly Champion', 'Win a weekly challenge'], ['Campeón semanal', 'Ganar un reto semanal']],
  champion3: [['Triple Champion', 'Win 3 weekly challenges'], ['Triple campeón', 'Ganar 3 retos semanales']],
  visits: [['Visitor', (g) => `${g} visits`], ['Visitante', (g) => `${g} visitas`]],
  returned: [['Homecoming', (g) => `${g} members came back`], ['Regreso a casa', (g) => `${g} miembros regresaron`]],
  prayers: [['Prayer Chain', (g) => `${g} prayers for members`], ['Cadena de oración', (g) => `${g} oraciones por miembros`]],
  letters: [['Letters of Love', (g) => `${g} letters to Mother`], ['Cartas de amor', (g) => `${g} cartas a la Madre`]],
  practiced: [['Words in Action', (g) => `${g} phrases practiced by the team`], ['Palabras en acción', (g) => `${g} frases practicadas por el equipo`]],
  report_streak: [['Faithful Reporter', (g) => `Report ${g} days in a row`], ['Reportero fiel', (g) => `Reportar ${g} días seguidos`]],
  welcome: [['Welcome', 'Join the movement'], ['Bienvenida', 'Unirse al movimiento']],
  first_phrase: [['First Words', 'Practice your first phrase'], ['Primeras palabras', 'Practicar tu primera frase']],
  every_phrase: [['Complete Heart', 'Practice all 9 phrases at least once'], ['Corazón completo', 'Practicar las 9 frases al menos una vez']],
  storyteller: [['Storyteller', 'Share a story of grace'], ['Narrador', 'Compartir una historia de gracia']],
  supporter: [['Supporter', 'Cheer 10 times in the activity feed'], ['Animador', 'Animar 10 veces en la actividad']],
  super_supporter: [['Super Supporter', 'Cheer 50 times in the activity feed'], ['Gran animador', 'Animar 50 veces en la actividad']],
  streak: [['Daily Heart', (g) => `Practice ${g} days in a row`], ['Corazón diario', (g) => `Practicar ${g} días seguidos`]],
  all9: [['Perfect Day', (g) => `All 9 phrases in a day, ${g} time${g === 1 ? '' : 's'}`], ['Día perfecto', (g) => `Las 9 frases en un día, ${g} vez${g === 1 ? '' : 'es'}`]],
  focus: [['Focus Follower', (g) => `Practice the day’s focus phrase on ${g} day${g === 1 ? '' : 's'}`], ['Seguidor del enfoque', (g) => `Practicar la frase de enfoque del día en ${g} día${g === 1 ? '' : 's'}`]],
  team_pride: [['Team Pride', (g) => `Your team reaches Level ${g}`], ['Orgullo de equipo', (g) => `Tu equipo llega al Nivel ${g}`]],
  messenger: [['Messenger', 'Share the results once'], ['Mensajero', 'Compartir los resultados una vez']],
  herald: [['Herald', 'Share the results 10 times'], ['Heraldo', 'Compartir los resultados 10 veces']],
  champion_member: [['Champion Team Member', 'Your team wins a weekly challenge'], ['Miembro campeón', 'Tu equipo gana un reto semanal']],
  ticks: [['Words Collector', (g) => `${g} phrases practiced`], ['Coleccionista de palabras', (g) => `${g} frases practicadas`]],
};
const PHRASE_NAMES = [
  ['Greeter', 'Saludador'], ['Grateful Heart', 'Corazón agradecido'], ['Comforter', 'Consolador'],
  ['Forgiver', 'Perdonador'], ['Patient Soul', 'Alma paciente'], ['Good Listener', 'Buen oyente'],
  ['Encourager', 'Alentador'], ['Helper', 'Ayudador'], ['Kind Words', 'Palabras amables'],
];
function badgeText(b) {
  const li = lang === 'es' ? 1 : 0;
  if (b.phrase) {
    const name = (PHRASE_NAMES[b.phrase - 1] || [`Phrase ${b.phrase}`, `Frase ${b.phrase}`])[li];
    return [name, lang === 'es' ? `Frase #${b.phrase} × 10 (${b.have}/10)` : `Phrase #${b.phrase} × 10 (${b.have}/10)`];
  }
  const [name, desc] = (BADGE_TEXT[b.group || b.id] || [[b.id, ''], [b.id, '']])[li];
  return [name, typeof desc === 'function' ? desc(b.goal) : desc];
}

const LEVEL_ART = ['seed', 'sprout', 'bud', 'flower', 'daisy', 'bouquet'];
function levelBox(team) {
  const span = team.next ? team.next : team.earned;
  return h('div.levelbox',
    h('div.level-art', icon(LEVEL_ART[team.level - 1] || 'seed', 64)),
    h('div', { style: 'flex:1;min-width:0' },
      h('div.level-name', t('level', team.level), ' · ', t('lv' + team.level)),
      h('div.bar.thin', h('div', { style: `width:${team.next ? Math.round((team.earned / span) * 100) : 100}%` })),
      h('div.small.muted', team.next ? t('level_next', team.earned, team.next) : t('level_max'))));
}

function badgeGrid(badges, title, open, hint) {
  const earned = badges.filter((b) => b.earned).length;
  let all = true;
  const grid = h('div.badges');
  const toggle = h('button.btn.sm.ghost', { type: 'button' });
  const draw = () => {
    toggle.textContent = all ? t('earned_only') : t('show_all');
    const list = [...badges].sort((a, b) => b.earned - a.earned);
    grid.replaceChildren(...list.filter((b) => all || b.earned).map((b) => {
      const [name, desc] = badgeText(b);
      return h('div.badge' + (b.earned ? '' : '.locked') + (b.tier ? '.' + b.tier : '.special'), { title: desc },
        h('div.badge-icon', icon(b.icon, 30)),
        h('div.badge-name', name),
        b.tier ? h('div.badge-tier', t('tier_' + b.tier)) : null,
        h('div.badge-desc', desc));
    }));
  };
  toggle.addEventListener('click', () => { all = !all; draw(); });
  draw();
  return h('details.card.badge-card', { open: open || null },
    h('summary', h('h2', { style: 'margin:0' }, icon('trophy'), title, h('span.badge-count', `${earned}/${badges.length}`))),
    hint ? h('p.small.how', hint) : null,
    h('p.small.muted', t('earned_of', earned, badges.length), ' ', toggle),
    grid);
}

// ---------- Fair rankings ----------
const perMember = (x, k) => (x.size > 0 ? x[k] / x.size : null);
const fmt1 = (v) => (v == null ? '—' : (Math.round(v * 10) / 10).toString());

function teamRanking(teams, state, showChurch) {
  const k = state.key;
  let list = teams.filter((x) => state.side === 'all' || x.side === state.side);
  const val = (x) => (state.mode === 'per' ? perMember(x, k) : x[k]);
  list = [...list].sort((a, b) => (val(b) ?? -1) - (val(a) ?? -1) || a.name.localeCompare(b.name));
  if (!list.length) return h('p.muted', t('no_teams'));
  const max = Math.max(0.0001, ...list.map((x) => val(x) || 0));
  return h('div', list.map((x, i) => {
    const v = val(x);
    return h('div.rank',
      h('div.pos', i === 0 && v > 0 ? icon('trophy', 26) : i + 1),
      h('div.body',
        h('div.row-between', h('span.name', x.name, x.side ? h('span.side-tag.' + x.side, t(x.side)) : null),
          h('span.num', state.mode === 'per' ? fmt1(v) : v)),
        h('div.small.muted', [showChurch ? x.church : null, state.mode === 'per' ? (x.size ? `${t('total')}: ${x[k]} · ${x.size} 👥` : t('set_size')) : (x.size ? t('per_member_short', fmt1(perMember(x, k))) : null)].filter(Boolean).join(' · ')),
        h('div.bar.thin', h('div', { style: `width:${Math.round(((v || 0) / max) * 100)}%` }))));
  }));
}

function segButtons(options, current, onPick) {
  return h('div.seg', options.map(([value, label, ic]) => h('button' + (value === current ? '.on' : ''), {
    type: 'button', onclick: () => onPick(value),
  }, ic ? icon(ic, 18) : null, label)));
}

function rankCard(title, iconName, teams, showChurch, state) {
  const box = h('div');
  const draw = () => box.replaceChildren(
    segButtons([['all', t('all_sides')], ['sisters', t('sisters')], ['brothers', t('brothers')]], state.side, (v) => { state.side = v; draw(); }),
    segButtons([['per', t('per_member')], ['total', t('total')]], state.mode, (v) => { state.mode = v; draw(); }),
    segButtons(RANK_KEYS.map((k) => [k, rankLabel(k), rankIcon(k)]), state.key, (v) => { state.key = v; draw(); }),
    teamRanking(teams, state, showChurch));
  draw();
  return h('div.card', h('h2', icon(iconName), title), box);
}
const newRank = () => ({ key: 'visits', side: 'all', mode: 'per' });

// Awards: best per-member team on each side, per category.
function awardWinners(teams, side) {
  return RANK_KEYS.map((k) => {
    const best = teams.filter((x) => x.side === side && x.size > 0 && x[k] > 0)
      .sort((a, b) => perMember(b, k) - perMember(a, k))[0];
    return { key: k, best };
  });
}

function awardsCard(teams, state, withCerts) {
  const box = h('div');
  const draw = () => box.replaceChildren(
    segButtons([['sisters', t('sisters')], ['brothers', t('brothers')]], state.side, (v) => { state.side = v; draw(); }),
    h('div.awards', awardWinners(teams, state.side).map(({ key, best }) => h('div.award', icon(rankIcon(key), 30),
      h('div', { style: 'flex:1;min-width:0' },
        h('div.small.muted', t('award_' + key)),
        best ? h('div', h('b', best.name), h('span.small.muted', ` · ${best.church}`),
          h('div.small', t('per_member_short', fmt1(perMember(best, key))), ` · ${t('total')}: ${best[key]}`)) : h('div.muted', '—')),
      withCerts && best ? h('a.btn.sm.ghost', { href: `#/cert?team=${best.id}&award=${key}` }, t('certificate')) : null))));
  draw();
  return h('div.card', h('h2', icon('star'), t('awards')), h('p.small.muted', { style: 'margin-top:0' }, t('awards_note')), box);
}

function weeklyCard(week, winners) {
  if (!week) return null;
  const k = week.metric;
  const sideTop = (side) => week.teams.filter((x) => x.side === side && x.size > 0)
    .sort((a, b) => perMember(b, k) - perMember(a, k)).slice(0, 3);
  return h('div.card.weekly',
    h('h2', icon(rankIcon(k)), t('weekly', week.week)),
    h('p', { style: 'margin-top:0' }, h('b', t('weekly_focus', rankLabel(k))), h('span.small.muted', ` · ${week.from} → ${week.to}`)),
    h('div.grid2', ['sisters', 'brothers'].map((side) => h('div',
      h('div.side-head.' + side, t(side)),
      sideTop(side).length ? sideTop(side).map((x, i) => h('div.row-between.small', h('span', `${i + 1}. ${x.name}`), h('span.num', fmt1(perMember(x, k)))))
        : h('div.small.muted', '—')))),
    winners.length ? h('details', { style: 'margin-top:10px' }, h('summary', t('past_winners')),
      winners.map((w) => h('div.small', { style: 'padding:4px 0' }, h('b', t('weekly', w.week)), ` · ${rankLabel(w.metric)}: `,
        ['sisters', 'brothers'].map((s) => w.winners[s] ? `${t(s)} → ${w.winners[s].name}` : null).filter(Boolean).join(' · ') || '—'))) : null);
}

function gardenCard(returned) {
  const shown = Math.min(returned, 120);
  return h('div.card.garden-card', h('h2', icon('daisy'), t('garden'), h('span.badge-count', returned)),
    h('p.small.muted', { style: 'margin-top:0' }, t('garden_intro')),
    h('div.garden', returned ? [
      ...Array.from({ length: shown }, (_, i) => h('span.plant', { style: `animation-delay:${(i % 12) * 60}ms` }, icon('daisy', 22))),
      returned > shown ? h('span.more', `+${returned - shown}`) : null,
    ] : h('div.muted.small', t('garden_empty'))));
}

// ---------- Feed ----------
function clientId() {
  let id = store.get('cid');
  if (!id) { id = Array.from(crypto.getRandomValues(new Uint8Array(12)), (b) => b.toString(16).padStart(2, '0')).join(''); store.set('cid', id); }
  return id;
}
function ago(ts) {
  const mins = Math.max(0, Math.round((Date.now() - Date.parse(ts.replace(' ', 'T') + 'Z')) / 60000));
  if (mins < 1) return t('ago_now');
  if (mins < 60) return t('ago_min', mins);
  if (mins < 1440) return t('ago_h', Math.round(mins / 60));
  return t('ago_d', Math.round(mins / 1440));
}
function feedItem(e) {
  let ic = 'heart';
  let title;
  let body = null;
  if (e.kind === 'report') {
    ic = 'chart'; title = t('ev_report', e.team);
    body = h('div.feed-stats', METRICS.filter((m) => e.data[m.key]).map((m) => h('span', icon(m.key, 16), ` ${e.data[m.key]}`)));
  } else if (e.kind === 'badge') {
    ic = 'trophy'; title = t('ev_badge', e.team);
    body = h('div.small', (e.data.badges || [e.data.badge]).map((id) => {
      const [group, n] = id.match(/^(.*)_(\d)$/) ? [id.replace(/_\d$/, ''), Number(id.slice(-1))] : [id, 0];
      const [name] = badgeText({ id, group, goal: 0 });
      return `🏅 ${name}${n ? ` · ${t('tier_' + ['bronze', 'silver', 'gold', 'diamond', 'legend'][n - 1])}` : ''}`;
    }).join('  '));
  } else if (e.kind === 'level') {
    ic = LEVEL_ART[e.data.level - 1] || 'daisy'; title = t('ev_level', e.team, e.data.level, t('lv' + e.data.level));
  } else if (e.kind === 'team_joined') {
    ic = 'people'; title = t('ev_team', e.team, e.side ? t(e.side) : '');
  } else if (e.kind === 'story') {
    ic = 'letters'; title = t('ev_story'); body = h('p', e.data.text);
  }
  const cheerBtn = (kind, ic2) => {
    const on = e.mine.includes(kind);
    const btn = h('button.cheer' + (on ? '.on' : ''), { type: 'button', 'aria-pressed': String(on) }, icon(ic2, 18), h('span', e[kind]));
    btn.addEventListener('click', async () => {
      const r = await api('/api/cheer', { body: { event_id: e.id, kind, client: clientId() } });
      e[kind] += r.on ? 1 : -1;
      e.mine = r.on ? [...e.mine, kind] : e.mine.filter((x) => x !== kind);
      btn.classList.toggle('on', r.on);
      btn.lastChild.textContent = e[kind];
      if (r.on) { btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop'); }
    });
    return btn;
  };
  return h('div.feed-item',
    h('div.feed-icon', icon(ic, 28)),
    h('div', { style: 'flex:1;min-width:0' },
      h('div.feed-title', title),
      body,
      h('div.feed-meta', h('span.small.muted', [e.church, ago(e.created_at)].filter(Boolean).join(' · ')),
        h('span.cheers', cheerBtn('pray', 'prayers'), cheerBtn('love', 'heart')))));
}

// ---------- Sharing ----------
async function shareText(text) {
  const url = location.origin + '/';
  if (navigator.share) {
    try { await navigator.share({ text, url }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`, '_blank', 'noopener');
}
function shareBtn(label, makeText) {
  return h('button.btn.share-btn', { type: 'button', onclick: async () => {
    await shareText(makeText());
    if (!store.get('member')) return;
    // Sharing counts toward the member's Messenger / Herald badges.
    const r = await api('/api/me/shared', { body: {} }).catch(() => null);
    const fresh = r ? r.badges.filter((b) => b.earned && ['messenger', 'herald'].includes(b.id) && !store.get('b:' + b.id)) : [];
    for (const b of fresh) store.set('b:' + b.id, '1');
    if (fresh.length) celebrate(`${t('new_badge_toast', fresh.length)} ${fresh.map((b) => badgeText(b)[0]).join(', ')}`);
  } }, icon('share', 20), label);
}
function statLine(x) {
  return METRICS.map((m) => `${t(m.key)}: ${x[m.key]}`).join(' · ');
}

// ---------- Views ----------
function profileFields() {
  const nickname = h('input', { type: 'text', maxlength: 30, autocomplete: 'nickname', autocapitalize: 'words' });
  const pin = h('input', { type: 'password', inputmode: 'numeric', pattern: '[0-9]{4}', maxlength: 4, autocomplete: 'new-password' });
  return {
    nickname, pin,
    nodes: [
      h('label.field', h('span', t('nickname')), nickname, h('small.muted', t('nickname_hint'))),
      h('label.field', h('span', t('pin4')), pin, h('small.muted', t('pin4_hint'))),
    ],
  };
}
const errText = (e, fallback) => (I18N.en[e.message] ? t(e.message) : t(fallback));

// Join (optionally from a team invite link: #/join?church=1&code=BRONX&team=3), or get back in.
async function viewJoin() {
  const info = await api('/api/info');
  document.getElementById('region-name').textContent = info.campaign.region_name;
  if (!info.churches.length) return [h('h1', t('welcome')), h('div.card', t('no_churches'))];
  const q = hashParams();
  const invited = q.get('church') && q.get('code');
  const churchOpts = () => info.churches.map((c) => h('option', { value: c.id, selected: String(c.id) === q.get('church') }, c.name));

  const sel = h('select', churchOpts());
  const code = h('input', { type: 'text', autocomplete: 'off', autocapitalize: 'characters', value: q.get('code') || '' });
  const teamBox = h('div');
  let teamSel = null;
  let inviteTeam = null;
  const loadTeams = async () => {
    const { sel: ts, teams } = await teamSelect(sel.value, Number(q.get('team')) || null, t('no_team'));
    teamSel = teams.length ? ts : null;
    inviteTeam = teams.find((x) => String(x.id) === q.get('team')) || null;
    teamBox.replaceChildren(teamSel ? h('label.field', h('span', t('team_optional')), teamSel) : '');
  };
  sel.addEventListener('change', loadTeams);
  await loadTeams();
  const prof = profileFields();
  const err = h('div.error');
  const form = h('form.card', {
    onsubmit: async (e) => {
      e.preventDefault();
      err.textContent = '';
      try {
        const r = await api('/api/join', { body: {
          church_id: Number(sel.value), code: code.value, team_id: teamSel ? Number(teamSel.value) || null : null,
          nickname: prof.nickname.value, pin: prof.pin.value,
        } });
        store.set('member', r.token);
        location.hash = '#/';
        route();
      } catch (ex) { err.textContent = errText(ex, 'bad_code'); }
    },
  },
    invited && inviteTeam
      ? h('div.invite-banner', icon('people', 30), h('b', t('invited_to', inviteTeam.name, info.churches.find((c) => String(c.id) === q.get('church'))?.name || '')))
      : h('p.muted', t('join_intro')),
    // From an invite link the church, code and team are already filled in.
    h('div', { hidden: invited && inviteTeam ? true : null },
      h('label.field', h('span', t('church')), sel),
      h('label.field', h('span', t('code')), code),
      teamBox),
    prof.nodes,
    h('button.btn.block', { type: 'submit' }, t('join')),
    err
  );

  // Get back in with nickname + PIN
  const sel2 = h('select', churchOpts());
  const nick2 = h('input', { type: 'text', maxlength: 30, autocomplete: 'username' });
  const pin2 = h('input', { type: 'password', inputmode: 'numeric', maxlength: 4, autocomplete: 'current-password' });
  const err2 = h('div.error');
  const back = h('details.card', { open: q.get('back') ? true : null },
    h('summary', h('h2', { style: 'margin:0' }, icon('heart'), t('already_joined'))),
    h('form', { style: 'margin-top:12px', onsubmit: async (e) => {
      e.preventDefault(); err2.textContent = '';
      try {
        const r = await api('/api/member/login', { body: { church_id: Number(sel2.value), nickname: nick2.value, pin: pin2.value } });
        store.set('member', r.token);
        location.hash = '#/';
        route();
      } catch (ex) { err2.textContent = errText(ex, 'bad_login'); }
    } },
      h('p.small.muted', { style: 'margin-top:0' }, t('already_intro')),
      h('label.field', h('span', t('church')), sel2),
      h('label.field', h('span', t('nickname')), nick2),
      h('label.field', h('span', t('pin4')), pin2),
      h('button.btn.block.ghost', { type: 'submit' }, t('get_back_in')), err2));

  return [dayBanner(info.campaign), h('h1', t('welcome')), form, back,
    h('a.card.cta', { href: '#/team' }, icon('people', 30), h('span', t('team_leader_cta')))];
}

// Invite link opened by someone who is already a member: move them to that team.
async function viewJoinLink() {
  const q = hashParams();
  if (!store.get('member')) return viewJoin();
  const team = Number(q.get('team'));
  if (team) {
    try {
      const me = await api('/api/me');
      if (me.church && String(me.church.id) === q.get('church') && me.team_id !== team) {
        await api('/api/me/team', { body: { team_id: team } });
        const tm = me.teams.find((x) => x.id === team);
        if (tm) setTimeout(() => celebrate(t('moved_to_team', tm.name)), 300);
      }
    } catch {}
  }
  history.replaceState(null, '', '#/');
  return viewHome();
}

const homeRank = newRank();
async function viewHome() {
  if (!store.get('member')) return viewJoin();
  let me;
  try { me = await api('/api/me'); } catch (e) {
    if (e.status === 401) { store.del('member'); return viewJoin(); }
    throw e;
  }
  document.getElementById('region-name').textContent = me.campaign.region_name;

  const out = [dayBanner(me.campaign)];
  if (!me.nickname) {
    // Members from before nicknames existed: ask once so they can get back in later.
    const prof = profileFields();
    const perr = h('div.error');
    out.push(h('form.card.save-spot', { onsubmit: async (e) => {
      e.preventDefault(); perr.textContent = '';
      try { await api('/api/me/profile', { body: { nickname: prof.nickname.value, pin: prof.pin.value } }); route(); }
      catch (ex) { perr.textContent = errText(ex, 'nickname_required'); }
    } }, h('h2', icon('heart'), t('save_spot')), h('p.small.muted', { style: 'margin-top:0' }, t('save_spot_intro')),
      prof.nodes, h('button.btn', { type: 'submit' }, t('save')), perr));
  }
  // One of the 9 phrases is spotlighted each day; the word of the day follows the same order.
  const focusIdx = me.checklist.length ? (Math.max(1, me.campaign.day_number) - 1) % me.checklist.length : -1;
  if (me.word) {
    // First line is the phrase, then its description, then (some days) a passage from the poster.
    const [quote, ...rest] = pickText(me.word).split('\n');
    const [desc, ...extra] = rest.join('\n').split('\n\n');
    out.push(h('div.card.focus-card', h('h2', icon('star'), t('word_today'), focusIdx >= 0 ? h('span.focus-num', focusIdx + 1) : null),
      h('p.focus-quote', quote),
      desc ? h('p.small.muted', { style: 'margin:0' }, desc) : null,
      extra.length ? h('p.word-passage', extra.join('\n\n')) : null));
  } else if (focusIdx >= 0) {
    const lines = pickText(me.checklist[focusIdx]).split('\n');
    out.push(h('div.card.focus-card', h('h2', icon('daisy'), t('focus_today'), h('span.focus-num', focusIdx + 1)),
      h('p.focus-quote', lines[lines.length - 1]), lines.length > 1 ? h('p.small.muted', { style: 'margin:0' }, lines.slice(0, -1).join(' ')) : null));
  }

  // Results are reported by team leaders; members see their team and church teams.
  const { sel: myTeam } = await teamSelect(me.church?.id, me.team_id, t('no_team'));
  const teamNote = h('span.saved');
  myTeam.addEventListener('change', async () => {
    await api('/api/me/team', { body: { team_id: Number(myTeam.value) || null } });
    teamNote.textContent = t('saved');
    setTimeout(route, 500);
  });
  const mine = me.teams.find((x) => x.id === me.team_id);
  out.push(h('div.card', h('h2', icon('people'), t('my_team'), teamNote),
    h('label.field', myTeam),
    mine ? levelBox(mine) : null,
    mine ? h('div.tiles.mini', RANK_KEYS.map((k) => h('div.tile', icon(rankIcon(k), 24), h('div.n', mine[k]), h('div.l', rankLabel(k))))) : null,
    h('p.small.muted', { style: 'margin-bottom:0' }, t('reported_by_teams'), ' ', h('a', { href: '#/team' }, t('team_leader_cta')))));

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
    const row = h('label.check' + (done.has(item.id) ? '.done' : '') + (i === focusIdx ? '.focus' : ''), box, num,
      h('span', h('span.desc', lines.join(' ')), quote ? h('span.quote', quote) : null));
    box.addEventListener('change', async () => {
      row.classList.toggle('done', box.checked);
      setNum();
      const r = await api('/api/me/checklist', { body: { item_id: item.id, done: box.checked } });
      setStreak(r.streak);
      const had = new Set(myBadges.filter((b) => b.earned).map((b) => b.id));
      const fresh = r.badges.filter((b) => b.earned && !had.has(b.id));
      myBadges = r.badges;
      badgeBox.replaceChildren(badgeGrid(myBadges, t('my_badges'), badgeBox.firstChild?.open, t('badges_how')));
      if (fresh.length) celebrate(`${t('new_badge_toast', fresh.length)} ${fresh.map((b) => badgeText(b)[0]).join(', ')}`);
      if (box.checked && me.checklist.every((it) => it.id === item.id || done.has(it.id))) celebrate('💯 9/9!');
      box.checked ? done.add(item.id) : done.delete(item.id);
    });
    return row;
  });
  out.push(h('div.card', h('h2', icon('book'), t('checklist')), checks, streakEl));
  let myBadges = me.badges;
  const badgeBox = h('div', badgeGrid(myBadges, t('my_badges'), false, t('badges_how')));
  out.push(badgeBox);

  const progressCard = (iconName, title, totals) => h('div.card', h('h2', icon(iconName), title),
    METRICS.map((m) => progressRow(t(m.key), totals[m.key], m.goal ? totals[`goal_${m.key}`] : 0, m.key)));
  if (me.church) out.push(progressCard('returned', `${t('my_church')}: ${me.church.name}`, me.church));
  out.push(rankCard(t('church_teams'), 'trophy', me.teams, false, homeRank));
  out.push(progressCard('globe', `${t('region')}: ${me.campaign.region_name}`, me.region));
  out.push(h('div.share-row', shareBtn(t('share_region'), () => [
    `🌼 ${me.campaign.region_name} · ${t('day_of', Math.max(1, Math.min(me.campaign.day_number, me.campaign.total_days)), me.campaign.total_days)}`,
    statLine(me.region),
    me.checklist.length ? `✨ ${pickText(me.checklist[focusIdx]).split('\n').pop()}` : '',
  ].filter(Boolean).join('\n'))));

  out.push(h('p.footer-links',
    me.nickname ? h('span.muted', t('signed_in_as', me.nickname), ' · ') : null,
    h('a', { href: '#', onclick: (e) => {
      e.preventDefault();
      if (confirm(t('switch_confirm'))) { store.del('member'); route(); }
    } }, t('switch_church')), ' · ', h('a', { href: '#/team' }, t('team_title')), ' · ', h('a', { href: '#/leader' }, t('leader')), ' · ', h('a', { href: '#/admin' }, t('admin'))));

  if (me.church) checkMilestones(`c${me.church.id}`, t('you_church'), me.church);
  checkMilestones('region', t('the_region'), me.region);
  return out;
}

let boardMetric = 'returned';
const boardRank = newRank();
const boardAwards = { side: 'sisters' };
let chartMetric = 'visits';
async function viewBoard() {
  const d = await api('/api/dashboard');
  document.getElementById('region-name').textContent = d.campaign.region_name;
  const r = d.region;
  const tiles = h('div.tiles',
    METRICS.map((m) => h('div.tile', icon(m.key, 30), h('div.n', r[m.key]), h('div.l', t(m.key)))),
    h('div.tile', icon('book', 30), h('div.n', r.practiced), h('div.l', t('practiced'))),
    h('div.tile', icon('people', 30), h('div.n', r.teams), h('div.l', t('teams_title'))),
    h('div.tile', icon('heart', 30), h('div.n', r.members), h('div.l', t('members_joined')))
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
  const share = shareBtn(t('share_region'), () => [
    `🌼 ${d.campaign.region_name} · ${t('day_of', Math.max(1, Math.min(d.campaign.day_number, d.campaign.total_days)), d.campaign.total_days)}`,
    statLine(r),
    ...['sisters', 'brothers'].map((side) => {
      const best = awardWinners(d.teams, side).find((a) => a.key === 'visits')?.best;
      return best ? `🏆 ${t(side)}: ${best.name} (${t('per_member_short', fmt1(perMember(best, 'visits')))} ${t('visits').toLowerCase()})` : null;
    }).filter(Boolean),
  ].join('\n'));

  return [dayBanner(d.campaign), h('div.share-row', share), gardenCard(r.returned), weeklyCard(d.week, d.winners),
    awardsCard(d.teams, boardAwards), tiles, goalCard,
    rankCard(t('top_teams'), 'people', d.teams, true, boardRank),
    h('div.card', h('h2', icon('trophy'), t('ranking')), seg, rankList),
    h('div.card', h('h2', icon('chart'), t('per_day')), chartSeg, chartBox),
    h('p.footer-links', h('a', { href: '#/tv' }, t('tv')), ' · ', h('a', { href: '#/recap' }, t('recap')))].filter(Boolean);
}

async function viewStories() {
  const { feed } = await api(`/api/feed?client=${clientId()}`);
  const out = [h('h1', t('feed_title'))];
  if (store.get('member')) {
    const ta = h('textarea', { maxlength: 500, placeholder: t('story_placeholder') });
    out.push(h('form.card', {
      onsubmit: async (e) => {
        e.preventDefault();
        if (ta.value.trim().length < 3) return;
        await api('/api/testimonies', { body: { text: ta.value } });
        route();
      },
    }, h('h2', icon('letters'), t('stories_title')), h('p.muted.small', { style: 'margin-top:0' }, t('stories_intro')), ta,
      h('div', { style: 'margin-top:10px' }, h('button.btn', { type: 'submit' }, t('share')))));
  }
  out.push(h('div.card.feed', feed.length ? feed.map(feedItem) : h('p.muted', t('feed_empty'))));
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
  const op = h('input', { type: 'text', value: d.settings.overseer_pin || '', placeholder: 'At least 4 characters' });
  const sd = h('input', { type: 'date', value: d.settings.start_date });
  const ed = h('input', { type: 'date', value: d.settings.end_date });
  const settings = h('form.card', { onsubmit: (e) => { e.preventDefault(); post('/api/admin/settings', { region_name: rn.value, start_date: sd.value, end_date: ed.value, overseer_pin: op.value }); } },
    h('h2', '⚙️ Settings'), field('Region name', rn), h('div.grid2', field('Start date', sd), field('End date', ed)),
    field('Elder / Overseer PIN (sees and adjusts every church on the Leaders page)', op),
    h('button.btn', { type: 'submit' }, 'Save settings'));

  // Churches
  const churchForm = (c = {}) => {
    const name = h('input', { type: 'text', value: c.name || '', placeholder: 'Church name' });
    const code = h('input', { type: 'text', value: c.join_code || '', placeholder: 'Join code' });
    const lpin = h('input', { type: 'text', value: c.leader_pin || '', placeholder: 'Leader PIN' });
    const tcode = h('input', { type: 'text', value: c.team_code || '', placeholder: 'Auto' });
    const gv = h('input', { type: 'number', min: 0, value: c.goal_visits ?? 0 });
    const gr = h('input', { type: 'number', min: 0, value: c.goal_returned ?? 0 });
    const gl = h('input', { type: 'number', min: 0, value: c.goal_letters ?? 0 });
    return h('form.admin-row', { onsubmit: (e) => {
      e.preventDefault();
      post('/api/admin/church', { id: c.id, name: name.value, join_code: code.value, leader_pin: lpin.value, team_code: tcode.value, goal_visits: gv.value, goal_returned: gr.value, goal_letters: gl.value });
    } },
      h('div.grid2', field('Church name', name), field('Member join code', code)),
      h('div.grid2', field('Church leader PIN', lpin), field('Team leader invitation code', tcode)),
      h('div.grid3', field('Goal: visits', gv), field('Goal: returned', gr), field('Goal: letters', gl)),
      h('div.actions',
        h('button.btn.sm', { type: 'submit' }, c.id ? 'Save' : '+ Add church'),
        c.id ? h('button.btn.sm.danger', { type: 'button', onclick: () => {
          if (confirm(`Delete ${c.name} and ALL its data?`)) post('/api/admin/church/delete', { id: c.id });
        } }, 'Delete') : null)
    );
  };
  const churches = h('div.card', h('h2', '⛪ Churches & goals'),
    h('p.small.muted', 'Members join with the member code (to view results and keep the checklist). Team leaders create their team with the invitation code and report their team’s numbers. Church leaders use the leader PIN on the Leaders page. Prayers are counted but have no goal.'),
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
    h('p.actions', h('a.btn.ghost', { href: '#/tv' }, icon('tv', 20), 'TV / projector mode'), h('a.btn.ghost', { href: '#/recap' }, icon('trophy', 20), 'Final results & certificates')),
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

// ---------- Team leaders ----------
function sideSelect(value) {
  return h('select', h('option', { value: '' }, '—'),
    ['sisters', 'brothers'].map((x) => h('option', { value: x, selected: x === value }, t(x))));
}

async function viewTeam() {
  if (!store.get('team')) return viewTeamJoin();
  const day = hashParams().get('day') || '';
  let d;
  try { d = await api('/api/team/me' + (day ? `?day=${day}` : '')); } catch (e) {
    if (e.status === 401) { store.del('team'); return viewTeamJoin(); }
    throw e;
  }
  document.getElementById('region-name').textContent = d.campaign.region_name;
  const out = [h('h1', d.team.name, h('div.small.muted', { style: 'font-size:16px;font-weight:700' }, `${t('team')} · ${d.church.name}`))];

  // Report for the chosen day — saved shortly after the last tap.
  const vals = { ...d.report };
  const note = h('span.saved');
  let timer;
  const save = () => {
    clearTimeout(timer);
    note.textContent = '';
    timer = setTimeout(async () => {
      const r = await api('/api/team/report', { body: { day: d.day, ...vals } });
      note.textContent = t('saved');
      if (r.level_up) celebrate(t('level_up_toast', r.level));
      else if (r.new_badges.length) celebrate(t('new_badge_toast', r.new_badges.length));
    }, 600);
  };
  const date = h('input', { type: 'date', value: d.day, max: d.campaign.today, min: d.campaign.start_date,
    onchange: () => { location.hash = `#/team?day=${date.value}`; } });
  const rows = METRICS.map((m) => {
    const val = h('span.val', vals[m.key]);
    const bump = (n) => {
      vals[m.key] = Math.max(0, Math.min(50, vals[m.key] + n));
      val.textContent = vals[m.key];
      val.classList.remove('bump'); void val.offsetWidth; val.classList.add('bump');
      save();
    };
    return h('div.counter',
      h('div.label', icon(m.key, 34), h('div', h('b', t(m.key)), h('small', t(m.key + '_hint')))),
      h('button.pxbtn', { type: 'button', 'aria-label': `${t(m.key)} −1`, onclick: () => bump(-1) }, '-'),
      val,
      h('button.pxbtn.plus', { type: 'button', 'aria-label': `${t(m.key)} +1`, onclick: () => bump(1) }, '+'));
  });
  out.push(h('div.card', h('h2', icon('heart'), t('report_title'), note),
    h('label.field', h('span', t('report_for')), date),
    h('p.small.muted', { style: 'margin-top:0' }, t('report_hint')),
    rows));

  out.push(h('div.card', h('h2', icon('chart'), t('team_totals')),
    levelBox(d.team),
    h('div.tiles.mini', RANK_KEYS.map((k) => h('div.tile', icon(rankIcon(k), 24), h('div.n', d.team[k]),
      h('div.l', rankLabel(k)), d.team.size ? h('div.l', t('per_member_short', fmt1(perMember(d.team, k)))) : null))),
    h('div.share-row', shareBtn(t('share_team'), () => [
      `🌼 ${d.team.name} · ${d.church.name} · ${d.day}`,
      statLine(vals),
      `${t('level', d.team.level)} · ${t('lv' + d.team.level)} · 🏅 ${d.team.earned}`,
    ].join('\n')))));
  out.push(badgeGrid(d.team.badges, t('team_badges')));
  out.push(rankCard(t('church_teams'), 'trophy', d.teams, false, homeRank));

  // Invite members and see who joined (nicknames are only visible to the team leader)
  const memberLink = `${location.origin}/#/join?church=${d.team.church_id}&code=${encodeURIComponent(d.join_code)}&team=${d.team.id}`;
  const copied = h('span.saved');
  out.push(h('div.card', h('h2', icon('letters'), t('invite_members')),
    h('p.small.muted', { style: 'margin-top:0' }, t('invite_members_intro')),
    h('div.actions',
      h('button.btn.share-btn', { type: 'button', onclick: () => shareText(`${t('invite_text', d.team.name)}\n${memberLink}`) }, icon('share', 20), t('send_invite')),
      h('button.btn.ghost', { type: 'button', onclick: async () => {
        try { await navigator.clipboard.writeText(memberLink); copied.textContent = t('copied'); } catch { prompt(t('copy_link'), memberLink); }
      } }, t('copy_link')), copied)));
  out.push(h('div.card', h('h2', icon('people'), t('team_members', d.members.length)),
    d.members.length ? d.members.map((mb) => h('div.story',
      h('div', { style: 'flex:1;min-width:0' }, h('b', mb.nickname || '—'),
        h('div.small' + (mb.today ? '.ok' : '.muted'), mb.today ? `✓ ${t('practiced_today')} (${mb.today})` : t('not_yet_today'))),
      mb.nickname ? h('button.btn.sm.ghost', { type: 'button', onclick: async () => {
        const pin = prompt(t('new_member_pin'));
        if (!pin) return;
        try { await api('/api/team/member/pin', { body: { member_id: mb.id, pin } }); alert(t('member_pin_reset')); }
        catch (e) { alert(errText(e, 'pin_4_digits')); }
      } }, t('reset_pin')) : null,
      h('button.btn.sm.danger', { type: 'button', 'aria-label': t('remove'), onclick: async () => {
        if (!confirm(t('remove_member_confirm', mb.nickname || '—'))) return;
        await api('/api/team/member/remove', { body: { member_id: mb.id } });
        route();
      } }, '✕')))
      : h('p.muted', t('no_members'))));

  // Side and size (size makes per-member comparisons fair)
  const side = sideSelect(d.team.side);
  const size = h('input', { type: 'number', min: 0, max: 500, value: d.team.size || '' });
  const sNote = h('span.saved');
  const sErr = h('div.error');
  out.push(h('form.card', { onsubmit: async (e) => {
    e.preventDefault(); sErr.textContent = '';
    try { await api('/api/team/settings', { body: { side: side.value, size: size.value } }); sNote.textContent = t('saved'); setTimeout(route, 600); }
    catch (ex) { sErr.textContent = t(ex.message); }
  } }, h('h2', icon('people'), t('team_settings'), sNote),
    h('div.grid2', h('label.field', h('span', t('side')), side), h('label.field', h('span', t('team_size')), size)),
    h('p.small.muted', { style: 'margin-top:0' }, t('team_size_hint')),
    h('button.btn', { type: 'submit' }, t('save')), sErr));
  out.push(h('p.footer-links', h('a', { href: '#', onclick: (e) => {
    e.preventDefault(); store.del('team'); route();
  } }, t('log_out'))));
  return out;
}

async function viewTeamJoin() {
  const info = await api('/api/info');
  document.getElementById('region-name').textContent = info.campaign.region_name;
  if (!info.churches.length) return [h('h1', t('team_title')), h('div.card', t('no_churches'))];
  const q = hashParams();
  const churchOptions = () => info.churches.map((c) => h('option', { value: c.id, selected: String(c.id) === q.get('church') }, c.name));
  const showError = (el, e) => { el.textContent = t(e.message === 'bad_code' ? 'bad_code' : e.message === 'bad_pin' ? 'bad_team_pin' : e.message); };

  // Create a team with the invitation
  const church = h('select', churchOptions());
  const code = h('input', { type: 'text', value: q.get('code') || '', autocomplete: 'off', autocapitalize: 'characters' });
  const name = h('input', { type: 'text', maxlength: 60 });
  const pin = h('input', { type: 'password', inputmode: 'numeric', autocomplete: 'new-password' });
  const side = sideSelect('');
  const size = h('input', { type: 'number', min: 1, max: 500 });
  const err1 = h('div.error');
  const createForm = h('form.card', { onsubmit: async (e) => {
    e.preventDefault(); err1.textContent = '';
    try {
      const r = await api('/api/team/create', { body: { church_id: Number(church.value), code: code.value, name: name.value, pin: pin.value, side: side.value, size: size.value } });
      store.set('team', r.token);
      location.hash = '#/team';
      route();
    } catch (ex) { showError(err1, ex); }
  } },
    h('h2', icon('letters'), t('have_invite')),
    h('label.field', h('span', t('church')), church),
    h('label.field', h('span', t('team_code')), code),
    h('label.field', h('span', t('team_name')), name),
    h('div.grid2', h('label.field', h('span', t('side')), side), h('label.field', h('span', t('team_size')), size)),
    h('p.small.muted', { style: 'margin-top:0' }, t('team_size_hint')),
    h('label.field', h('span', t('team_pin')), pin),
    h('button.btn.block', { type: 'submit' }, t('new_team')), err1);

  // Log in to an existing team
  const church2 = h('select', churchOptions());
  const teamBox = h('div');
  let teamSel;
  const loadTeams = async () => {
    ({ sel: teamSel } = await teamSelect(church2.value, null, '—'));
    teamBox.replaceChildren(h('label.field', h('span', t('pick_team')), teamSel));
  };
  church2.addEventListener('change', loadTeams);
  await loadTeams();
  const pin2 = h('input', { type: 'password', inputmode: 'numeric', autocomplete: 'current-password' });
  const err2 = h('div.error');
  const loginForm = h('form.card', { onsubmit: async (e) => {
    e.preventDefault(); err2.textContent = '';
    try {
      const r = await api('/api/team/login', { body: { team_id: Number(teamSel.value), pin: pin2.value } });
      store.set('team', r.token);
      location.hash = '#/team';
      route();
    } catch (ex) { showError(err2, ex); }
  } },
    h('h2', icon('people'), t('already_team')),
    h('label.field', h('span', t('church')), church2),
    teamBox,
    h('label.field', h('span', t('team_pin_short')), pin2),
    h('button.btn.block', { type: 'submit' }, t('login')), err2);

  return [h('h1', t('team_title')), h('p.muted', t('team_intro')), createForm, loginForm];
}

// ---------- Leaders (and the Elder) ----------
async function viewLeader() {
  const info = await api('/api/info');
  document.getElementById('region-name').textContent = info.campaign.region_name;
  const isElder = !!sessionStorage.getItem('adminPin');  // the admin can always open this page
  let churchId = Number(sessionStorage.getItem('leaderChurch')) || (isElder ? info.churches[0]?.id : 0);
  if (!info.churches.length) return [h('h1', t('leader_title')), h('div.card', t('no_churches'))];

  const loginForm = (message) => {
    const sel = h('select', h('option', { value: 'overseer' }, t('overseer_opt')),
      info.churches.map((c) => h('option', { value: c.id, selected: String(c.id) === sessionStorage.getItem('leaderChurch') }, c.name)));
    if (!sessionStorage.getItem('leaderChurch')) sel.value = String(info.churches[0].id);
    const pin = h('input', { type: 'password', autocomplete: 'off' });
    const err = h('div.error', message || '');
    return [h('h1', t('leader_title')), h('form.card', {
      onsubmit: async (e) => {
        e.preventDefault();
        // The overseer PIN works with any church; start on the first one.
        const id = sel.value === 'overseer' ? String(info.churches[0].id) : sel.value;
        sessionStorage.setItem('leaderPin', pin.value);
        sessionStorage.setItem('leaderChurch', id);
        try { await api('/api/leader/church', { body: { church_id: Number(id) } }); route(); } catch {
          sessionStorage.removeItem('leaderPin'); err.textContent = t('bad_pin');
        }
      },
    }, h('p.muted', t('leader_intro')),
      h('label.field', h('span', t('church')), sel),
      h('label.field', h('span', t('pin')), pin),
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

  if (d.role !== 'leader') {
    const pick = (id) => { sessionStorage.setItem('leaderChurch', id); route(); };
    const sel = h('select', { onchange: () => pick(sel.value) },
      info.churches.map((x) => h('option', { value: x.id, selected: x.id === c.id }, x.name)));
    out.push(h('div.card', h('h2', icon('globe'), t('overview')),
      h('p.small.muted', { style: 'margin-top:0' }, t(d.role === 'admin' ? 'admin_note' : 'elder_note')),
      d.overview.map((x) => h('div.story' + (x.id === c.id ? '.current' : ''),
        h('div', { style: 'flex:1;min-width:0' }, h('b', x.name),
          h('div.small', `${t('visits')}: ${x.visits}/${x.goal_visits} · ${t('returned')}: ${x.returned}/${x.goal_returned} · ${t('letters')}: ${x.letters}/${x.goal_letters}`),
          h('div.small' + (x.reported_today < x.teams ? '.warn' : '.muted'), t('reported_today', x.reported_today, x.teams))),
        h('button.btn.sm' + (x.id === c.id ? '' : '.ghost'), { type: 'button', onclick: () => pick(x.id) }, t('manage')))),
      h('label.field', { style: 'margin-top:10px' }, h('span', t('church')), sel)));
  }

  // Team leader invitation and team management
  const inviteUrl = `${location.origin}/#/team?church=${c.id}&code=${encodeURIComponent(d.team_code)}`;
  const copyNote = h('span.saved');
  out.push(h('div.card', h('h2', icon('letters'), t('invite')),
    h('p.small.muted', { style: 'margin-top:0' }, t('invite_intro')),
    h('div.codebox', h('span.small.muted', t('team_code')), h('b', d.team_code)),
    h('div.actions', h('button.btn.ghost', { type: 'button', onclick: async () => {
      try { await navigator.clipboard.writeText(inviteUrl); copyNote.textContent = t('copied'); }
      catch { prompt(t('copy_link'), inviteUrl); }
    } }, t('copy_link')), copyNote)));
  out.push(h('div.card', h('h2', icon('people'), `${t('teams_title')} (${d.teams.length})`),
    d.teams.length ? d.teams.map((tm) => h('div.story',
      h('div', { style: 'flex:1' }, h('b', tm.name), tm.side ? h('span.side-tag.' + tm.side, t(tm.side)) : null,
        h('div.small', RANK_KEYS.map((k) => `${rankLabel(k)}: ${tm[k]}`).join(' · ')),
        h('div.small.muted', `${t('level', tm.level)} · 🏅 ${tm.earned} · ${tm.size || '?'} 👥 · `,
          tm.last_report ? t('last_report', tm.last_report) : '—'),
        tm.last_report !== d.campaign.today && d.campaign.day_number >= 1 ? h('div.warn', '⚠ ' + t('not_reported')) : null,
        (() => {
          const sd = sideSelect(tm.side);
          const sz = h('input', { type: 'number', min: 0, value: tm.size || '', style: 'max-width:90px' });
          const save = async () => { try { await api('/api/leader/team/settings', { body: { church_id: c.id, team_id: tm.id, side: sd.value, size: sz.value } }); } catch (e) { alert(t(e.message)); } };
          sd.addEventListener('change', save); sz.addEventListener('change', save);
          return h('div.actions', { style: 'margin-top:6px' }, sd, sz);
        })()),
      h('div.actions', { style: 'flex-direction:column;align-items:stretch' },
        h('button.btn.sm.ghost', { type: 'button', onclick: async () => {
          const pin = prompt(t('new_pin_prompt'));
          if (!pin) return;
          try { await api('/api/leader/team/pin', { body: { church_id: c.id, team_id: tm.id, pin } }); alert(t('saved')); }
          catch (e) { alert(t(e.message)); }
        } }, t('reset_pin')),
        h('button.btn.sm.danger', { type: 'button', onclick: async () => {
          if (!confirm(t('delete_team_confirm', tm.name))) return;
          await api('/api/leader/team/delete', { body: { church_id: c.id, team_id: tm.id } });
          route();
        } }, t('delete_team')))))
      : h('p.muted', t('no_teams'))));

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
  const entryTeam = h('select', h('option', { value: '' }, t('church_wide')), d.teams.map((tm) => h('option', { value: tm.id }, tm.name)));
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
        await api('/api/leader/entry', { body: { church_id: c.id, team_id: Number(entryTeam.value) || null, day: date.value, ...vals, practiced } });
        ok.textContent = t('added');
        setTimeout(route, 700);
      } catch (err) { msg.textContent = err.message === 'empty' ? t('empty_entry') : err.message; }
    },
  }, h('h2', icon('heart'), t('for_member')),
    h('p.small.muted', { style: 'margin-top:0' }, t('for_member_intro')),
    h('div.grid2', h('label.field', h('span', t('date')), date), h('label.field', h('span', t('for_team')), entryTeam)),
    counterRows,
    h('details', { style: 'margin:10px 0' }, h('summary', `${t('phrases_practiced')}`), phraseBoxes.map((p) => p.row)),
    h('div.actions', h('button.btn', { type: 'submit' }, t('add_entry')), ok), msg));

  // Recent manual entries
  out.push(h('div.card', h('h2', icon('book'), t('recent')),
    d.entries.length ? d.entries.map((en) => h('div.story',
      h('div', { style: 'flex:1' },
        h('b', en.day), en.team ? ` · ${en.team}` : '', ' · ', h('span.small.muted', t('by_' + (en.entered_by || 'leader'))),
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
    if (d.role === 'admin') location.hash = '#/admin'; else route();
  } }, t('log_out'))));
  return out;
}

// ---------- TV mode (projector at church) ----------
let tvTimer = null;
async function viewTv() {
  const [d, f] = await Promise.all([api('/api/dashboard'), api(`/api/feed?client=${clientId()}`)]);
  document.getElementById('region-name').textContent = d.campaign.region_name;
  const r = d.region;
  const topPer = (state) => h('div.card', h('h2', icon('trophy'), t('top_teams'), h('span.small.muted', ` · ${t('per_member')} · ${rankLabel(state.key)}`)),
    teamRanking(d.teams, state, true));
  const slides = [
    () => [dayBanner(d.campaign), h('div.tiles.tv-tiles', RANK_KEYS.map((k) => h('div.tile', icon(rankIcon(k), 40), h('div.n', r[k]), h('div.l', rankLabel(k))))), gardenCard(r.returned)],
    () => [awardsCard(d.teams, { side: 'sisters' })],
    () => [awardsCard(d.teams, { side: 'brothers' })],
    () => [weeklyCard(d.week, d.winners) || gardenCard(r.returned)],
    () => [topPer({ key: 'visits', side: 'all', mode: 'per' })],
    () => [topPer({ key: 'returned', side: 'all', mode: 'per' })],
    () => [h('div.card.feed', h('h2', icon('heart'), t('feed_title')), f.feed.slice(0, 6).map(feedItem))],
  ];
  let i = 0;
  const stage = h('div.tv-stage');
  const dots = h('div.tv-dots');
  const show = () => {
    stage.replaceChildren(...slides[i]().filter(Boolean));
    stage.classList.remove('enter'); void stage.offsetWidth; stage.classList.add('enter');
    dots.replaceChildren(...slides.map((_, j) => h('i' + (j === i ? '.on' : ''))));
  };
  show();
  clearInterval(tvTimer);
  tvTimer = setInterval(() => {
    if (!location.hash.startsWith('#/tv')) return clearInterval(tvTimer);
    i = (i + 1) % slides.length;
    if (i === 0) route(); else show();   // refresh the data once per loop
  }, 12000);
  return [h('div.tv-head', h('img', { src: '/icon.svg', width: 40, height: 42, alt: '' }), h('b', d.campaign.region_name),
    h('span', t('tagline')), h('a.tv-exit', { href: '#/board', 'aria-label': 'Exit' }, '✕')), stage, dots];
}

// ---------- Final results & certificates ----------
const recapAwards = { side: 'sisters' };
async function viewRecap() {
  const d = await api('/api/dashboard');
  document.getElementById('region-name').textContent = d.campaign.region_name;
  const r = d.region;
  const levels = [...d.teams].sort((a, b) => b.earned - a.earned).slice(0, 5);
  return [h('h1', t('recap')), h('p.muted', t('recap_intro')),
    awardsCard(d.teams, recapAwards, true),
    h('div.tiles', RANK_KEYS.map((k) => h('div.tile', icon(rankIcon(k), 30), h('div.n', r[k]), h('div.l', rankLabel(k))))),
    gardenCard(r.returned),
    h('div.card', h('h2', icon('bouquet'), t('badges')), levels.length ? levels.map((x) => h('div.story', icon(LEVEL_ART[x.level - 1], 36),
      h('div', { style: 'flex:1' }, h('b', x.name), h('div.small.muted', `${x.church} · ${t('level', x.level)} · ${t('lv' + x.level)} · 🏅 ${x.earned}/${x.badge_total}`))))
      : h('p.muted', t('no_teams'))),
    d.winners.length ? weeklyCard({ ...d.winners[d.winners.length - 1], teams: [] }, d.winners) : null,
  ].filter(Boolean);
}

async function viewCert() {
  const q = hashParams();
  const d = await api('/api/dashboard');
  const team = d.teams.find((x) => x.id === Number(q.get('team')));
  const key = q.get('award');
  if (!team || !RANK_KEYS.includes(key)) return [h('div.card', '—')];
  return [h('div.cert',
    h('div.cert-inner',
      h('div.cert-art', icon('daisy', 48), icon('trophy', 56), icon('daisy', 48)),
      h('div.cert-kicker', d.campaign.region_name),
      h('div.cert-title', t('cert_title')),
      h('div.cert-body', t('cert_body', team.name, team.church)),
      h('div.cert-for', t('cert_for')),
      h('div.cert-award', t('award_' + key)),
      h('div.cert-stats', `${t('per_member_short', fmt1(perMember(team, key)))} · ${t('total')}: ${team[key]} · ${t(team.side || 'all_sides')}`),
      h('div.cert-foot', `${t('hero_a')} ${t('hero_b')} · ${d.campaign.start_date} → ${d.campaign.end_date}`))),
    h('div.actions.no-print', { style: 'justify-content:center;margin-top:16px' },
      h('button.btn', { type: 'button', onclick: () => print() }, t('print')),
      h('a.btn.ghost', { href: '#/recap' }, '←'))];
}

// ---------- Router ----------
const VIEWS = { '': viewHome, board: viewBoard, team: viewTeam, stories: viewStories, leader: viewLeader, admin: viewAdmin,
  tv: viewTv, recap: viewRecap, cert: viewCert, join: viewJoinLink };
async function route() {
  const name = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
  const view = VIEWS[name] || viewHome;
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  document.getElementById('lang-toggle').textContent = lang === 'en' ? 'ES' : 'EN';
  document.documentElement.lang = lang;
  document.querySelectorAll('#tabs a').forEach((a) => a.classList.toggle('on', a.dataset.tab === (name || 'home')));
  document.body.classList.toggle('tv-mode', name === 'tv');
  document.body.classList.toggle('cert-mode', name === 'cert');
  if (name !== 'tv') clearInterval(tvTimer);
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

// Offline support: cache the app so it opens fast on a weak signal.
if ('serviceWorker' in navigator) {
  addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => {}));
}
