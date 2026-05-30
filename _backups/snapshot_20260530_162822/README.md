# Four Paws Training & Enrichment Academy — Demo

A fully rebranded pet training and enrichment platform with a built-in AI onboarding assistant.

## 🐾 About

**Four Paws Training & Enrichment Academy** is a structured learning platform for pet owners and trainers. Built on top of a robust demo architecture, it provides:

- **Owner Portal** — Daily training logs, enrichment activities, progress tracking, goals & streaks
- **Trainer Dashboard** — Full pet/owner management, session notes, review alerts, live progress overview

## 🗺️ AI Tour Guide

A guided onboarding system ("Four Paws Guide") is built into every page:

- Auto-detects first-time visitors via `localStorage`
- 5-step walkthrough highlighting key UI sections
- Step-by-step tooltips with friendly, clear explanations
- Replayable anytime via the "🗺️ Take Tour" button
- Storage keys: `fourpaws_tour_completed`, `fourpaws_tour_step`, `fourpaws_tour_version`

## 📁 Structure

```
Fourpawsdemo/
├── index.html                  ← Entry point (redirects to demo)
├── ap3x/
│   └── demo/
│       ├── index.html          ← Academy landing page + tour
│       ├── owner-demo.html     ← Owner Portal (training log, enrichment, goals)
│       └── trainer-demo.html   ← Trainer Dashboard (pet management, session log)
└── bco/                        ← Core BCO architecture (unchanged)
```

## 🚀 Running the Demo

Open `index.html` or `Fourpawsdemo/ap3x/demo/index.html` in any browser — no server required.

## ⚠️ Disclaimer

For education and demonstration purposes only. No medical or veterinary advice is provided.
