// Badge rules for teams and members. Badges are computed from the data each time,
// so nothing extra is stored and corrections (e.g. a fixed report) are reflected.
'use strict';

const TIERS = ['bronze', 'silver', 'gold', 'diamond', 'legend'];

// Tiered team badges: one badge per threshold reached.
const TEAM_TIERED = [
  { id: 'visits', icon: 'visits', steps: [10, 25, 50, 100, 200] },
  { id: 'returned', icon: 'returned', steps: [1, 5, 10, 20, 40] },
  { id: 'prayers', icon: 'prayers', steps: [25, 50, 100, 250, 500] },
  { id: 'letters', icon: 'letters', steps: [5, 15, 30, 60, 100] },
  { id: 'practiced', icon: 'book', steps: [25, 75, 150, 300, 500] },
  { id: 'report_streak', icon: 'flame', steps: [3, 7, 14, 21, 30] },
];

const MEMBER_TIERED = [
  { id: 'streak', icon: 'flame', steps: [3, 7, 14, 21, 30] },
  { id: 'all9', icon: 'star', steps: [1, 3, 7, 14, 21] },
  { id: 'ticks', icon: 'book', steps: [25, 75, 150, 250, 360] },
];

// Longest run of consecutive dates in a sorted list of YYYY-MM-DD strings.
function longestRun(days) {
  let best = 0;
  let run = 0;
  let prev = null;
  for (const d of [...new Set(days)].sort()) {
    const t = Date.parse(d + 'T00:00:00Z');
    run = prev !== null && t - prev === 86400000 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = t;
  }
  return best;
}

function tiered(defs, values) {
  const out = [];
  for (const def of defs) {
    def.steps.forEach((step, i) => {
      out.push({ id: `${def.id}_${i + 1}`, group: def.id, icon: def.icon, tier: TIERS[i], goal: step, earned: values[def.id] >= step });
    });
  }
  return out;
}

// team: totals row from teamTotals(); reports: that team's team_reports rows.
function teamBadges(team, reports, info, championWeeks) {
  const days = reports.filter((r) => r.visits + r.returned + r.prayers + r.letters > 0).map((r) => r.day);
  const values = {
    visits: team.visits,
    returned: team.returned,
    prayers: team.prayers,
    letters: team.letters,
    practiced: team.practiced,
    report_streak: longestRun(days),
  };
  const special = [
    { id: 'first_report', icon: 'check', earned: days.length > 0 },
    { id: 'day_one', icon: 'daisy', earned: days.includes(info.start_date) },
    { id: 'full_house', icon: 'heart', earned: reports.some((r) => r.visits > 0 && r.returned > 0 && r.prayers > 0 && r.letters > 0) },
    { id: 'big_day', icon: 'visits', earned: reports.some((r) => r.visits >= 10) },
    { id: 'prayer_day', icon: 'prayers', earned: reports.some((r) => r.prayers >= 20) },
    { id: 'letter_day', icon: 'letters', earned: reports.some((r) => r.letters >= 5) },
    { id: 'roster', icon: 'people', earned: team.size > 0 && team.members >= team.size },
    { id: 'champion', icon: 'trophy', earned: championWeeks >= 1 },
    { id: 'champion3', icon: 'trophy', tier: 'legend', earned: championWeeks >= 3 },
  ];
  return [...special, ...tiered(TEAM_TIERED, values)];
}

// ticks: [{day, item_id}] for one member; itemIds: checklist ids in display order.
function memberBadges({ ticks, itemIds, stories, cheers, joined }) {
  const byDay = new Map();
  const byItem = new Map();
  for (const t of ticks) {
    byDay.set(t.day, (byDay.get(t.day) || 0) + 1);
    byItem.set(t.item_id, (byItem.get(t.item_id) || 0) + 1);
  }
  const values = {
    streak: longestRun([...byDay.keys()]),
    all9: [...byDay.values()].filter((n) => n >= itemIds.length && itemIds.length > 0).length,
    ticks: ticks.length,
  };
  const special = [
    { id: 'welcome', icon: 'heart', earned: joined },
    { id: 'first_phrase', icon: 'check', earned: ticks.length > 0 },
    { id: 'every_phrase', icon: 'daisy', earned: itemIds.length > 0 && itemIds.every((id) => byItem.has(id)) },
    { id: 'storyteller', icon: 'letters', earned: stories >= 1 },
    { id: 'supporter', icon: 'prayers', earned: cheers >= 10 },
    { id: 'super_supporter', icon: 'prayers', tier: 'gold', earned: cheers >= 50 },
  ];
  // One "master" badge per phrase, practiced 10 times.
  const phrases = itemIds.slice(0, 12).map((id, i) => ({
    id: `phrase_${i + 1}`, icon: 'book', phrase: i + 1, goal: 10, have: byItem.get(id) || 0, earned: (byItem.get(id) || 0) >= 10,
  }));
  return [...special, ...tiered(MEMBER_TIERED, values), ...phrases];
}

// Team level (and its daisy) grows with the number of badges earned.
const LEVELS = [0, 3, 7, 12, 18, 25];
function levelFor(earnedCount) {
  let level = 1;
  LEVELS.forEach((min, i) => { if (earnedCount >= min) level = i + 1; });
  return { level, next: LEVELS[level] ?? null };
}

module.exports = { teamBadges, memberBadges, levelFor, longestRun };
