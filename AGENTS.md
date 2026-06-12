# AGENTS.md

## Project Goal

Build a Web-first, high-fidelity clickable demo of FIRE Progress Companion. Phase 1 is front-end only and uses mock auth plus local persistence.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Recharts
- Zustand
- Zod
- Vitest

## Scope

- Bilingual UI: Chinese and English
- Currency switch: CNY and USD
- Routes: `/`, `/login`, `/dashboard`, `/checkins`, `/insights`, `/settings`
- Mock Google/Apple login only
- localStorage-backed demo data only

## Setup and Run Commands

```bash
npm install
npm run dev          # start dev server on port 3000
npm run lint         # eslint
npm run test         # vitest run
npm run build        # next build
```

## Directory Guide

- `src/app/` — Next.js App Router pages
- `src/components/` — shared shell, switchers
- `src/features/fire/` — FIRE calculations and display components
- `src/features/checkins/` — check-in form, history, schema, helpers
- `src/features/insights/` — insight rules engine and cards
- `src/features/settings/` — settings form
- `src/lib/i18n/` — bilingual dictionaries
- `src/lib/` — formatters, storage helpers
- `src/mock/` — demo data, mock auth, mock repository
- `src/store/` — Zustand app store
- `src/types/` — domain types

## Code Conventions

- Keep business rules in pure functions
- Keep storage access behind repository helpers
- **All UI text must go through `src/lib/i18n/dictionaries.ts`** — no hardcoded strings in components
- Demo data notes use dictionary keys (e.g. `"noteSteady"`) — the display layer translates them
- Prefer small feature-focused files over broad utility dumping grounds
- Use `formatCurrency` for all money displays, never raw `toLocaleString()`

## Known Pitfalls

- **npm rejects Chinese project names** — use English name in `package.json`, rename folder after scaffolding
- **Dev server dies on bash timeout** — use `nohup npx next dev -p 3000 > /tmp/fire-dev.log 2>&1 &` to keep it running
- **Recharts SSR width warning** — chart container has -1 dimensions during SSR; this is normal and does not affect the browser
- **Demo data notes must be dictionary keys** — if you hardcode English notes in `demo-data.ts`, they won't translate when language switches
- **`buildInsights()` takes a `language` parameter** — insights text must also be bilingual
- **localStorage keys** — session: `fire-demo-session`, state: `fire-demo-state`

## Implementation Caveats

- Phase 1 does not use real Supabase/Auth
- Currency switching is display-oriented and does not use live FX conversion
- Any future backend integration should replace mock auth/repository boundaries, not page logic
- The withdrawal-rate input accepts both `4` and `0.04`, but internal storage is normalized to decimal form

## Delivery Checklist

- `npm run lint` — 0 errors
- `npm run test` — all unit tests pass
- `npm run build` — succeeds, all routes generated
- Verify bilingual copy on every route (switch ZH/EN)
- Verify both currency modes (switch CNY/USD)
- Verify a new check-in updates dashboard and history
- Verify reset demo data returns to seed state
