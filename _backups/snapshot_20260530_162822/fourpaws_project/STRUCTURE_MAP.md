# FOUR PAWS — STRUCTURE MAP (RUN 1 AUDIT)
Generated: 2026-05-30

---

## ACTIVE FILES (deployed via Vercel)

| File | Route | Lines | Role |
|------|-------|-------|------|
| `ap3x/demo/index.html`        | `/`        | 886  | Landing page |
| `ap3x/demo/trainer-demo.html` | `/trainer` | 1482 | Trainer Intelligence OS |
| `ap3x/demo/owner-demo.html`   | `/owner`   | 1739 | Owner Training Portal (PWA) |
| `ap3x/demo/dataProvider.js`   | shared     | 188  | Storage abstraction layer |
| `ap3x/demo/sw.js`             | `/sw.js`   | 54   | Service worker (PWA) |
| `ap3x/demo/manifest.json`     | `/manifest.json` | — | PWA manifest (start_url: /owner) |

## DEAD FILES (not routed, not served)
- `ap3x/demo/clinician-demo.html` — legacy AP3X clinician UI
- `ap3x/demo/patient-demo.html`   — legacy AP3X patient UI
- `ap3x/clinician-dashboard/*`    — unused legacy dashboard
- `ap3x/companion/*`              — unused early PWA attempt
- `ap3x/patient-pwa/*`            — unused legacy PWA
- `ap3x/anxietycore/*`            — legacy anxiety module
- `bco/*`                         — unrelated BCO framework
- `ap3x/shared/*`                 — legacy auth/constants (not imported anywhere active)

---

## COURSE DATA — WHERE IT LIVES

### Owner PWA (`owner-demo.html` lines 11–47)
```
const CURRICULUM = [ 5 modules × 5 lessons = 25 lessons ]
```
- Module 1: Foundations (5 lessons)
- Module 2: Core Obedience (5 lessons)
- Module 3: Socialisation (5 lessons)
- Module 4: Home Life (5 lessons)
- Module 5: Enrichment & Development (5 lessons)

Each lesson has: `id`, `name`, `desc`, `tip`, `xp`

### Trainer OS (`trainer-demo.html` lines 1186–1193)
```
const MODULES = [ 5 modules, lesson NAMES only (no IDs, no desc, no xp) ]
```
- Module 1: Foundations (lesson names match CURRICULUM)
- Module 2: Core Obedience (matches)
- Module 3: Socialisation & Confidence (name drift vs owner: "Socialisation")
- Module 4: Home Life Success (name drift vs owner: "Home Life")
- Module 5: Enrichment & Long-Term Development (name drift vs owner: "Enrichment & Development")

**PROBLEM:** Two separate definitions. MODULES in trainer is a subset of CURRICULUM. They are NOT linked. They share no IDs. The trainer reads lesson names as strings — there is no ID-based link between trainer progress display and owner lesson completions.

---

## STORAGE — CURRENT STATE

### Owner PWA storage keys (direct localStorage)
| Key | What it stores |
|-----|----------------|
| `lessons_done_demo` / `lessons_done_{dogId}` | Array of completed lesson IDs |
| `checkins` | Session check-in objects |
| `ex_done` | Completed enrichment activity IDs |
| `journal` | Journal entries |
| `goals` | Training goals |
| `theme` | Dark/light preference |
| `fp_dog_name` | Dog name (written by trainer deploy) |
| `fp_dog_breed` | Dog breed |
| `fp_dog_age` | Dog age |
| `fp_trainer_name` | Trainer name |
| `fp_trainer_notes` | Trainer notes |
| `fp_streak` | Streak count |
| `fourpaws_tour_completed` | Tour state |

### Trainer OS storage keys (direct localStorage)
| Key | What it stores |
|-----|----------------|
| `fpTrainerTheme` | Dark/light |
| `fp_access_codes` | Deployed client records |
| `fp_pwa_events` | PWA install analytics |
| `fp_sb_url` / `fp_sb_key` | Supabase config |
| `fp_dog_name` etc | Written during deploy (same keys as owner reads) |

### dataProvider.js
- Exists and is imported by both files via `<script src="./dataProvider.js">`
- Defines `FP_DATA` with semantic API
- Uses `fp_` namespace prefix
- **BUT: neither app actually calls FP_DATA methods** — both still use raw localStorage directly
- dataProvider is loaded but unused in actual data flow

---

## UI LOGIC DUPLICATION

| Issue | Location | Fix needed |
|-------|----------|------------|
| CURRICULUM defined in `<script>` inside owner-demo.html | Lines 11–47 | Move to storage.js |
| MODULES defined in `<script>` inside trainer-demo.html | Lines 1186–1193 | Replace with import from storage.js |
| Module names diverge between the two definitions | trainer vs owner | Normalise to single SSOT |
| `AI_INSIGHTS` hardcoded array in trainer-demo.html | Lines 1090–1097 | Replace with ai-layer.js derived output |
| `DOGS` hardcoded array in trainer-demo.html | Lines 887–986 | These are demo fixtures; mark clearly, feed through storage.js |
| `renderProgress()` hardcodes `68%`, `66%`, `70%`, `80%` | trainer line 1206 | Derive from DOGS data |
| `renderStats()` delta `↑ 2 this week` hardcoded | trainer line 1036 | Derive or mark as placeholder |
| Enrichment planner has hardcoded dog names in trainer | line 1199 | Map from DOGS array |

---

## DATA FLOW PROBLEMS

### Problem 1: Trainer reads nothing from owner
The trainer dashboard reads entirely from the hardcoded `DOGS` array.
Owner PWA writes to `lessons_done_*`, `checkins`, `goals` etc.
**These two systems are not connected.** The trainer never reads what the owner writes.

### Problem 2: dataProvider.js imported but bypassed
Both files load dataProvider.js but call `localStorage` directly.
Raw keys are inconsistent (`fp_dog_name` vs `fp_` namespaced).

### Problem 3: Module name drift
- Owner: "Module 3 — Socialisation"
- Trainer: "Socialisation & Confidence"
- Owner: "Module 4 — Home Life"
- Trainer: "Home Life Success"
- Owner: "Module 5 — Enrichment & Development"
- Trainer: "Enrichment & Long-Term Development"

### Problem 4: No lesson IDs in trainer
Trainer MODULES contain string arrays of lesson names.
Owner CURRICULUM uses structured objects with `id` fields.
Can't cross-reference completion data without IDs.

---

## WHAT WORKS CORRECTLY

- PWA install flow (manifest, sw.js, icons)
- Owner portal tabs (Home, Log, Lessons, Enrich, Progress, Badges)
- Lesson completion toggle + XP + streak toast
- Training check-in multi-step form
- Enrichment activity runner
- Journal
- Goals + achievements (Masterclass-based)
- Trainer OS sidebar navigation + all views
- Dog detail panel
- Deploy Portal workflow (generate code, email owner)
- PWA metrics view (event log, charts)
- Dark/light mode (both apps)
- Vercel routing

---

## REQUIRED SSOT FILES (to create in RUN 2)

1. `storage.js` — single source of truth for all data
   - Course/module/lesson definitions (CANONICAL)
   - Read/write API for sessions, completions, profiles, goals
   - Replaces both CURRICULUM and MODULES definitions
   - Replaces raw localStorage calls

2. `ai-layer.js` — derived intelligence only
   - Input: storage.js data
   - Output: risk score, engagement, struggle detection, trend summary
   - No data storage

3. `storage.js` module names (CANONICAL — 4 modules per brief):
   - Module 1: Foundation & Bonding
   - Module 2: Core Obedience
   - Module 3: Behaviour & Control
   - Module 4: Real World Application
