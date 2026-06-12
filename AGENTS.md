# AGENTS.md

## Project Goal

FIRE Progress Companion — Web-first FIRE progress tracking app with real user accounts, persistent data, and bilingual UI.

**Current status**: Supabase backend integrated. Google OAuth login working. Demo mode fallback when Supabase env vars are missing.

## Tech Stack

- Next.js App Router (v16)
- TypeScript
- Tailwind CSS
- Recharts
- Zustand
- Zod
- Vitest
- Supabase (Auth + PostgreSQL + Row Level Security)

## Setup and Run Commands

```bash
npm install
npm run dev          # start dev server on port 3000
npm run lint         # eslint
npm run test         # vitest run
npm run build        # next build
```

## Environment Variables

```bash
# .env.local (gitignored)
NEXT_PUBLIC_SUPABASE_URL=https://vkfnzfliloqoachrmoxz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Supabase project ref: `vkfnzfliloqoachrmoxz`

## Directory Guide

- `src/app/` — Next.js App Router pages
- `src/app/auth/callback/` — OAuth callback route
- `src/components/` — shared shell, switchers
- `src/features/fire/` — FIRE calculations and display components
- `src/features/checkins/` — check-in form, history, schema, helpers
- `src/features/insights/` — insight rules engine and cards
- `src/features/settings/` — settings form
- `src/lib/i18n/` — bilingual dictionaries
- `src/lib/supabase/` — Supabase client and API layer
- `src/lib/` — formatters, storage helpers
- `src/mock/` — demo data (legacy, still used as seed)
- `src/store/` — Zustand app store (dual-mode: supabase + demo)
- `src/types/` — domain types and database types
- `supabase/migrations/` — SQL schema files

## Code Conventions

- Keep business rules in pure functions
- **All UI text must go through `src/lib/i18n/dictionaries.ts`** — no hardcoded strings in components
- Demo data notes use dictionary keys (e.g. `"noteSteady"`) — the display layer translates them
- Use `formatCurrency` for all money displays, never raw `toLocaleString()`
- Prefer small feature-focused files over broad utility dumping grounds
- Store uses dynamic `import()` for Supabase modules — keeps demo mode lightweight

## Architecture: Dual-Mode Store

The Zustand store (`src/store/app-store.ts`) operates in two modes:

1. **Supabase mode** — when `NEXT_PUBLIC_SUPABASE_URL` is set and doesn't contain "your-supabase". Uses real auth and database.
2. **Demo mode** — fallback when env vars are missing. Uses localStorage.

Detection is automatic via `isSupabaseConfigured` constant at the top of the store file.

## Database Schema

Three tables with Row Level Security:
- `profiles` — user profile (auto-created on signup via trigger)
- `fire_plans` — FIRE plan per user
- `checkins` — check-in records linked to plan and user

Schema file: `supabase/migrations/001_initial_schema.sql`

## Known Pitfalls

- **npm rejects Chinese project names** — use English name in `package.json`, rename folder after scaffolding
- **Dev server dies on bash timeout** — use `nohup npx next dev -p 3000 > /tmp/fire-dev.log 2>&1 &`
- **Next.js 16 deprecated `middleware.ts`** — use `proxy.ts` convention or remove middleware entirely; old convention causes 404
- **Supabase key name** — project uses `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (not `ANON_KEY`); code supports both via fallback
- **Supabase CLI TLS timeout** — `supabase db push` may fail behind proxy/VPN; use Management API `POST /v1/projects/{ref}/database/query` instead
- **Demo data notes must be dictionary keys** — hardcoded English notes won't translate
- **`buildInsights()` takes a `language` parameter** — insights text must be bilingual
- **`signOut` button must check `session`** — don't show when not logged in

## Delivery Checklist

- `npm run lint` — 0 errors
- `npm run test` — all unit tests pass
- `npm run build` — succeeds, all routes generated
- Verify bilingual copy on every route (switch ZH/EN)
- Verify both currency modes (switch CNY/USD)
- Verify Google login flow works end-to-end
- Verify check-in saves to Supabase and persists across sessions
- Verify sign out only shows when logged in
- Verify demo mode fallback works without env vars

## Supabase Management API

Use when CLI fails (TLS issues behind proxy):

```bash
# Execute SQL
curl -s -X POST "https://api.supabase.com/v1/projects/vkfnzfliloqoachrmoxz/database/query" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"query\": \"$SQL\"}"

# Update auth config (enable providers, set URLs)
curl -s -X PATCH "https://api.supabase.com/v1/projects/vkfnzfliloqoachrmoxz/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'
```

## Skill Extraction Notes

Reusable methods discovered during this project:

- **Next.js + Zustand dual-mode pattern**: Store auto-detects env vars, falls back to localStorage. Useful for any app that needs to work both offline (demo) and online (real backend).
- **Bilingual demo data with dictionary keys**: Store note keys in data, translate at display layer. Avoids duplicating seed data per language.
- **Supabase Management API as CLI fallback**: When `supabase db push` fails due to network, use REST API to execute SQL directly.
