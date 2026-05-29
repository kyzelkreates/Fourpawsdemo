# AP3X Intelligent AI Clinical System

> Built on top of BCO Core — extends without rewriting.

---

## What This Is

AP3X Intelligent AI is a dual-system clinical monitoring platform that extends BCO Core with:

1. **Patient PWA** — mobile-first daily check-in app with offline support
2. **Clinician Dashboard** — real-time patient monitoring and risk management
3. **AP3X Intelligent AI Rules Engine** — lightweight rule evaluator integrated into BCO's event/action pipeline
4. **Supabase backend** — shared data layer with Row Level Security

---

## Architecture

```
BCO Core (unchanged)
│
└── ap3x/                           ← AP3X layer (extension only)
    ├── index.js                    ← Single import barrel + initAP3X()
    ├── anxietycore/
    │   ├── engine/
    │   │   └── rules-engine.js     ← Pure-function rule evaluator
    │   └── module/
    │       ├── anxietycore.module.js  ← BCO module registration (Run 3 contract)
    │       ├── checkin-service.js     ← All patient data writes (via BCO events)
    │       └── streak-tracker.js     ← Daily check-in streak
    ├── patient-pwa/
    │   ├── index.html              ← PWA shell
    │   ├── patient.css             ← Calm mobile-first styles
    │   ├── patient-app.js          ← UI entry point
    │   ├── chart.js                ← Zero-dep canvas sparkline
    │   ├── manifest.json           ← PWA manifest
    │   └── ap3x-sw.js              ← Service worker (extends bco-sw.js)
    ├── clinician-dashboard/
    │   ├── index.html              ← Dashboard shell
    │   ├── clinician.css           ← Dense clinical styles
    │   ├── clinician-app.js        ← Dashboard UI entry
    │   └── risk-aggregator.js      ← Reads Supabase, runs rules, exposes summaries
    ├── shared/
    │   ├── constants.js            ← SSOT for keys, thresholds, roles, disclaimer
    │   └── sync-service.js         ← Local queue → Supabase sync
    └── supabase/
        ├── schema.sql              ← Full DB schema + RLS policies
        └── setup-guide.md          ← Step-by-step Supabase setup
```

---

## BCO Core Principles Maintained

| Principle | How AP3X honours it |
|-----------|---------------------|
| Single Source of Truth | All local state via `storage.js` + `AP3X_KEYS` prefix. No duplicate stores. |
| Event-First | Every patient write calls `emitEvent()` → BCO rule engine → storage |
| Storage Abstraction | All writes via BCO `storage.update()` — never `localStorage` directly |
| Module Isolation | AP3X Intelligent AI registered as a BCO module via `anxietyCoreModule` manifest |
| AI Non-Destructive | Risk engine is pure-function — suggests only, never mutates |
| Rule Engine Authority | BCO rules evaluate every `AP3X_LOG_*` event |
| UI Read-Only | Both UIs dispatch events or call service functions only |
| No Hard Coupling | AP3X modules communicate via events/actions, never direct cross-writes |

---

## AP3X Intelligent AI Rules (Implemented)

| Rule | Trigger | Risk Output |
|------|---------|-------------|
| High single score | `anxiety_score >= 8` | HIGH |
| Low sleep + elevated anxiety | `sleep < 4h AND anxiety > 6` | HIGH |
| Consecutive medium scores | 3 entries ≥ 6 in a row | MEDIUM |
| Missing data | No check-in for 48h | MISSING_DATA |

---

## Data Flow

```
Patient PWA
  → user interaction
  → emitEvent() [BCO pipeline]
  → BCO rule engine evaluates
  → storage.update() [local SSOT]
  → enqueue() [sync queue]
  → flushQueue() [online] → Supabase

Supabase
  → Realtime subscription
  → Clinician Dashboard live update
  → risk-aggregator.js runs rules
  → UI renders risk summary
```

---

## Role Security

| Action | Patient | Clinician |
|--------|---------|-----------|
| Write anxiety / mood / sleep / trigger logs | ✅ own data | ❌ never |
| Read own logs | ✅ | ❌ |
| Read assigned patient logs | ❌ | ✅ |
| Write clinician notes | ❌ | ✅ |
| Read clinician notes | ❌ | ✅ own notes |
| Set follow-up status | ❌ | ✅ |

Row Level Security enforced at the database layer (Supabase policies).

---

## Quick Start

### 1. Set up Supabase

Follow `ap3x/supabase/setup-guide.md`.

### 2. Add credentials to `ap3x/index.js`

```js
const SUPABASE_URL      = "https://YOUR_PROJECT.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";
```

### 3. Patient PWA

Serve `ap3x/patient-pwa/index.html` over HTTPS (required for PWA/Service Worker).

```js
import { initAP3X } from './ap3x/index.js';
await initAP3X({ mode: 'patient' });
```

### 4. Clinician Dashboard

Serve `ap3x/clinician-dashboard/index.html`.

```js
import { initAP3X } from './ap3x/index.js';
await initAP3X({ mode: 'clinician' });
```

### 5. BCO module registration (optional, for governance layer)

```js
import { initSystem } from './bco/core/init.js';
import { moduleRegistry } from './bco/core/modules.js';
import { anxietyCoreModule } from './ap3x/anxietycore/module/anxietycore.module.js';

initSystem({ mode: 'LOCAL', tenantId: 'ap3x' });
moduleRegistry.register(anxietyCoreModule);
```

---

## Safety & Compliance

- ⚠️ **NOT a medical device**
- ⚠️ **Does NOT provide medical diagnoses**
- All outputs are **informational only**
- Disclaimer shown in all UI footers
- No emergency automation — emergency button displays a configurable contact link only
- No AI-generated clinical decisions

---

*AP3X Intelligent AI — built on BCO Core by Kyzel Kreates*
