# Mother's Words Movement — 40-Day Tracker

A small, mobile-friendly web app that lets a region track the 40-day movement
(**Nov 1 – Dec 10, 2026**) together, in **English and Spanish**.

It's organized as **region → churches → teams**. **Team leaders report their team's numbers**
each day, and everyone (members, leaders, the Elder) can see the results. No names are
collected, only counts:

| Reported by team leaders | Goal per church? |
|---|---|
| 🏠 Visits to members | ✅ |
| ⛪ Members who came back to church (each person once) | ✅ |
| 🙏 Prayers for members | — (counted only) |
| ✉️ Letters sent to Mother | ✅ |
| 📖 The 9 "Words of Mother's Love" checklist: each member ticks it on their own phone | streaks; counts toward the member's team |

Everyone sees their church's progress and the whole region's progress. There's also:

- **Day X of 40** banner with a pixel "level map" of the 40 days
- **Word of the day**: the admin can enter one teaching per day (EN/ES)
- **Church leaderboard** ranked by % of goal, and a daily activity chart
- **Activity feed**: team reports, badges, level-ups, new teams and anonymous stories, with 🙏 / ❤️ cheers
- **Today's focus phrase**: one of the 9 phrases is spotlighted each day
- **Celebrations**: confetti when a church or the region reaches 25 / 50 / 75 / 100 % of a goal
- **Teams**: team leaders get an **invitation** (link or code), create their team with a
  name and a team PIN, then report their team's daily totals on the **Team** tab. They can
  pick an earlier date to correct a day.
- **Fair comparison (Brothers / Sisters)**: each team is marked Brothers or Sisters and enters how
  many people are on it. Rankings can show **per member** averages (default) or totals, filtered
  by side. **Awards are given per side, by per-member average**, so a small brothers' team
  can win against a large sisters' team on equal terms.
- **Weekly challenge**: each week has a focus (visits, prayers, letters, returned, phrases…);
  the best per-member team on each side becomes the Weekly Champion.
- **Badges & levels**: ~39 team badges and ~30 member badges (bronze → legend tiers, plus one
  for each of the 9 phrases). A team's pixel flower grows with its badges:
  Seed → Sprout → Bud → Flower → Daisy → Bouquet.
- **Region garden**: every member who comes back plants a pixel daisy.
- **Share**: one tap sends the day's results to WhatsApp (or any app).
- **TV mode** (`/#/tv`): auto-rotating full-screen scoreboard for a projector at church.
- **Final results & certificates** (`/#/recap`): awards per side with printable certificates.
- **Leaders page**: each church leader (with their own leader PIN) and the Elder can edit
  the church's goals and **enter counts for members who can't update on their own**.
  Those entries are added to the totals and can be removed if entered by mistake.
- **Admin page** (the Elder): churches, join codes, leader PINs, goals, checklist, words of the day, CSV export

It's one Docker container with a built-in SQLite database. It has no external services
and no npm dependencies.

---

## Install on ZimaOS

1. In ZimaOS open **App Store → ⋮ / + → Install a customized app** (or use the
   terminal, see below).
2. The simplest way is from the terminal on the Zima (SSH or the web terminal):

   ```sh
   cd /DATA
   git clone https://github.com/Manny1994RD/MothersWordsMovement.git
   cd MothersWordsMovement
   # edit ADMIN_PIN and TZ first:
   nano docker-compose.yml
   docker compose up -d --build
   ```

3. Open `http://<zima-ip>:8090` on your network to check that it works.

To update after new changes are pushed to GitHub:

```sh
cd /DATA/MothersWordsMovement && git pull && docker compose up -d --build
```

Data lives in `/DATA/AppData/mothers-words-movement/movement.db`. The app also saves a daily
copy to `/DATA/AppData/mothers-words-movement/backups/` and keeps the last 14 days. To restore,
stop the container, copy a backup over `movement.db`, and start it again.

### Settings (`docker-compose.yml`)

| Variable | Meaning |
|---|---|
| `ADMIN_PIN` | Password for the admin page. **Change it.** |
| `TZ` | Time zone that decides when "today" rolls over, e.g. `America/New_York`. |
| ports `8090:8080` | Change `8090` if that port is already used on your Zima. |

---

## Letting members reach it from outside (Tailscale)

There are two ways to do this:

**A. Tailscale Funnel (recommended for members).** This gives a public `https://…ts.net`
link. Members only open the link and don't need to install anything.

```sh
# on the Zima, with Tailscale installed and logged in
tailscale funnel --bg 8090
tailscale funnel status   # shows the https://<zima-name>.<tailnet>.ts.net URL
```

Funnel must be allowed for your tailnet (Tailscale admin console → Access controls →
enable Funnel / HTTPS). Join codes keep strangers from adding counts, but anyone
with the link can view the totals.

**B. Tailscale only (private).** Every member installs Tailscale and is invited to your
tailnet, then opens `http://<zima-tailscale-name>:8090`. This is more private, but
asking every member to install a VPN app is a big hurdle.

---

## Who can do what

| Role | How they sign in | Can do |
|---|---|---|
| **Admin** (back end) | `ADMIN_PIN` on the **Admin** page | Everything: settings, dates, churches, codes and PINs, checklist, words of the day, stories, CSV export, reset. Can also open the Leaders page for any church. |
| **Elder / Overseer** | **Leaders** page → "★ Elder / Overseer" + the overseer PIN (set by the admin in Settings) | Sees an overview of every church (progress, who reported today) and adjusts anything in any church: goals, teams, team PINs, entries for members. The overseer PIN covers every church, including the one they lead. |
| **Church leader** | **Leaders** page → their church + its leader PIN | The same, but only for their own church. |
| **Team leader** | **Team** tab (invitation link, then team PIN) | Reports their team's daily numbers and edits the team's side and size. |
| **Member** | Team invite link (or member join code) + nickname + 4-digit PIN | Views results, keeps the daily checklist and earns personal badges. |

**How members join:** the team leader taps **Invite members** on the Team tab and sends the
link to the team's group chat. The link fills in the church, code and team; the member picks a
**nickname** and a **4-digit PIN** and taps Join. If they get logged out or change phones, they
tap **I already joined** and enter their nickname and PIN to get their badges and streak back.
Nicknames are only visible to their team leader, who can also reset a forgotten PIN. After 5
wrong PINs the nickname is locked for 15 minutes, and PINs are stored hashed.

**How members earn badges:** a team leader's report never takes badges away from members.
Members earn their own badges by practicing the checklist every day, especially the day's
focus phrase, and by sharing stories, cheering in the Activity feed and sharing the results.
Some badges come from their team: the **Team Pride** badges when their team reaches a new level,
and the **Champion Team Member** badge when their team wins a weekly challenge.

---

## First-time setup (admin)

1. Open the app → **Admin** link at the bottom of the Home page (or go to `/#/admin`).
2. Enter your `ADMIN_PIN`.
3. **Settings:** region name; dates are prefilled as 2026-11-01 → 2026-12-10. Set the
   **Elder / Overseer PIN** and give it to the elder.
4. **Churches & goals:** add each church with a member **join code** (e.g. `BRONX40`), a
   **leader PIN** for that church's leaders, a **team leader invitation code** (filled in
   automatically if left empty), and the goals the Elder assigns (visits,
   returned, letters). The region goal is the sum of the church goals.
5. **Checklist:** the 9 phrases from the poster are preloaded in EN/ES. Put the description
   on the first line and the phrase on the second.
6. **Word of the day** (optional): fill in days 1–40.
7. On the Leaders page, **Copy invitation link** and send it to each team leader. They
   create their team (name, Brothers/Sisters, number of people, PIN) and start reporting on
   the **Team** tab. The team size matters: it's used for the fair per-member rankings. If a team leader
   forgets their PIN, the church leader can set a new one (or delete the team).
8. Give each church's leaders their leader PIN. They open **Leaders** at the bottom of the
   Home page. The Elder can open the Leaders page from Admin → Tools and switch between churches.
9. Team leaders invite their members with **Invite members** on the Team tab. Members
   can also join with the church's member join code and pick their team themselves. They tap
   **Share → Add to Home Screen** so it opens like an app.

Testing before Nov 1? Set the start date earlier, try it out, then use
**Tools → Reset activity** (keeps churches/settings) and set the dates back.

---

## Development

Requires Node 22.5+.

```sh
npm run dev        # http://localhost:8080, admin PIN 1234, data in ./data
```

- `server.js`: HTTP server, API and SQLite schema
- `badges.js`: badge and level rules
- `public/sw.js`: offline cache (network-first)
- `public/`: the single-page app (`app.js`, `pixel.js` for 8-bit icons, `styles.css`)
- `seed-checklist.json`: checklist loaded into a fresh database
