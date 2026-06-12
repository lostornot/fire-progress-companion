# FIRE Progress Companion

FIRE Progress Companion is a Web-first progress tracking demo for financial independence planning.

## Phase 1

This branch is a front-end-only clickable demo with:

- quick FIRE estimation
- mock Google and Apple sign-in
- local demo persistence
- bilingual copy
- CNY and USD formatting

## Route Map

- `/` landing and quick estimate
- `/login` mock auth
- `/dashboard` progress overview
- `/checkins` history and new entry
- `/insights` rule-based trend analysis
- `/settings` preferences and demo reset

## Commands

```bash
npm install
npm run dev
npm run lint
npm run test
```

## Review Flow

1. Open `/`
2. Try quick estimate
3. Enter demo mode from `/login`
4. Review `/dashboard`
5. Add a record in `/checkins`
6. Confirm `/insights` and `/settings` behavior
