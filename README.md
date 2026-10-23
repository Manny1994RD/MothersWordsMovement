# Mother's Words Movement — 40-Day Tracker

A small, mobile-friendly web app that lets a region track the 40-day movement
(**Nov 1 – Dec 10, 2026**) together, in **English and Spanish**.

Members use it on their phones (no names collected, only counts):

| Tracked | Goal per church? |
|---|---|
| 🏠 Visits to members | ✅ |
| ⛪ Members who returned to church | ✅ |
| 🙏 Prayers for members | — (counted only) |
| ✉️ Letters sent to Mother | ✅ |
| 📖 The 9 "Words of Mother's Love" checklist, ticked daily | streaks |

Everyone sees their church's progress and the whole region's progress. There's also:

- **Day X of 40** banner with a pixel "level map" of the 40 days
- **Word of the day**: the admin can enter one teaching per day (EN/ES)
- **Church leaderboard** ranked by % of goal, and a daily activity chart
- **Stories**: short, anonymous testimonies
- **Celebrations**: confetti when a church or the region reaches 25 / 50 / 75 / 100 % of a goal
- **Admin page**: churches, join codes, goals, checklist, words of the day, CSV export

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

Data lives in `/DATA/AppData/mothers-words-movement/movement.db`. Back up that file.

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

## First-time setup (admin)

1. Open the app → **Admin** link at the bottom of the Home page (or go to `/#/admin`).
2. Enter your `ADMIN_PIN`.
3. **Settings:** region name; dates are prefilled as 2026-11-01 → 2026-12-10.
4. **Churches & goals:** add each church with a **join code** (e.g. `BRONX40`) and the
   goals the elder assigns (visits, returned, letters). The region goal is the sum.
5. **Checklist:** the 9 phrases from the poster are preloaded in EN/ES. Put the description
   on the first line and the phrase on the second.
6. **Word of the day** (optional): fill in days 1–40.
7. Share the link plus each church's join code with its members. They tap
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
- `public/`: the single-page app (`app.js`, `pixel.js` for 8-bit icons, `styles.css`)
- `seed-checklist.json`: checklist loaded into a fresh database
