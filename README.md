# ProtocolOS

**An offline-first fitness PWA — training plans, progressive-overload coaching, CrossFit WODs, and nutrition tracking — built entirely in vanilla JavaScript with zero backend.**

**Live app:** [flowopsai.co.il/fitness_app](https://flowopsai.co.il/fitness_app/)

ProtocolOS is a complete personal training system that runs 100% in the browser. All data lives in `localStorage`, the service worker keeps it working with no connection, and it installs to the home screen like a native app. The UI is in Hebrew (full RTL support).

## Features

### Training
- **Push / Pull / Legs / Arms split** with weekly scheduling — supports 1–7 training days per week, including A/B and A/B/C split variants
- **Home-workout mode** with three equipment tiers: bodyweight only, resistance bands, or dumbbells — the app resolves the active plan automatically from the user's equipment
- **Exercise database of 100+ exercises**, each with Hebrew and English names, set/rep schemes, rest times, difficulty level, target muscles, technique description, form tips, and exercise alternatives
- **Integrated rest timer** with Web Audio API beeps and device vibration
- **Plate calculator and 1RM calculator** (estimated one-rep max, updated when a PR is saved)

### Progressive-Overload Coach
A rule-based coaching engine analyzes each exercise's logged history and tells the user what to do next:
- Detects **stagnation** (4+ identical sessions) and suggests changing the exercise or intensity
- Detects when the rep-range ceiling is hit repeatedly and prompts a **+2.5 kg increase**
- Detects when weight is too heavy (reps below range) and suggests a **deload**
- Per-exercise **SVG sparklines** visualize the last 6 sessions at a glance

### CrossFit
- **20 curated WODs** — benchmark workouts (Fran, Annie) and Hero WODs (Murph) plus home-friendly ones — in AMRAP, EMOM, and For Time formats with time caps
- Deterministic **WOD-of-the-day rotation** and score logging per workout

### Nutrition
- **BMR / TDEE calculation** (Mifflin-St Jeor) with goal-based calorie targets — lean bulk, bulk, cut, maintain — and automatic protein/fat/carb macro split
- **Daily food diary** with product search powered by the **Open Food Facts API**
- Water intake tracker
- **AI nutrition advisor**: works fully offline with a built-in rule-based Q&A engine, and optionally upgrades to the **Claude API** (user supplies their own key, stored locally only)

### Progress & Gamification
- Body-weight log with progress graph, body measurements, PR tracking, RPE and recovery logging, habit tracking
- XP system, streak-based achievement badges, and **rotating weekly "boss challenges"** (e.g. 100 push-ups this week, 5,000 kg total volume)
- Full **JSON export/import** for backup and device migration

### App Experience
- Installable **PWA** with app shortcuts that deep-link straight into PUSH/PULL/LEGS/ARMS day
- Three themes: dark, light, and AMOLED
- Portrait-oriented, standalone display, RTL Hebrew UI

## Tech Stack

| Layer | Choice |
|---|---|
| Language | Vanilla JavaScript (ES modules) — no framework |
| Offline | Service Worker + Cache Storage |
| Persistence | `localStorage` only — no backend, no accounts, no tracking |
| External APIs | Open Food Facts (food search), Claude API (optional, user-keyed) |
| Build | Vite + Terser minification |
| Testing | Vitest — pure logic extracted to `src/pure.js` for unit testing |
| CI/CD | GitHub Actions: test, then build and deploy to GitHub Pages on every push to `main` |
| Hosting | GitHub Pages behind a custom domain |

## Architecture Notes

- **Offline strategy** (`sw.js`): network-first for the app shell (HTML/JS/CSS) so users always get fresh code when online, with cache fallback when offline; cache-first for static assets (icons, fonts). Old caches are purged on activation and open clients are notified via `postMessage` when a new version is live.
- **No backend by design.** Every feature — workout logs, nutrition history, achievements — is computed client-side and persisted in namespaced `localStorage` keys. The result: zero hosting cost beyond static files, instant loads, and complete data privacy.
- **Data migration and backup** are built in: state can be exported as a dated JSON file and re-imported on another device.
- **Testable core**: nutrition math, rep-range parsing, and sparkline generation live as pure functions in `src/pure.js`, covered by Vitest and gated in CI before deploy.

## Try It

1. Open **[flowopsai.co.il/fitness_app](https://flowopsai.co.il/fitness_app/)** on your phone or desktop.
2. On mobile, choose **"Add to Home Screen"** to install it as a PWA.
3. Turn on airplane mode — it keeps working.

## Development

```bash
npm ci
npm run dev      # Vite dev server on port 3000
npm test         # Vitest unit tests
npm run build    # production build to dist/
```

## License

ISC
