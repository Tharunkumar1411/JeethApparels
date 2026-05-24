# CLAUDE.md — Merchant Admin Panel

Project rules for AI assistants (Claude Code) working in this repo. Keep edits aligned with these conventions so the codebase stays consistent.

## Project

Internal admin tool for managing merchants and generating referral codes.

- **Stack**: React 18 + Vite + Material UI v6 + React Router v6 + React Query v5 + React Hook Form + Supabase
- **Module system**: ESM (`"type": "module"`)
- **Language**: JavaScript (JSX). Do not introduce TypeScript without explicit user approval.
- **Path alias**: `@/*` maps to `src/*` (configured in `vite.config.js`).

## Commands

| Action | Command |
| --- | --- |
| Install deps | `npm install` |
| Dev server | `npm run dev` (http://localhost:5173) |
| Build | `npm run build` |
| Preview build | `npm run preview` |

## Folder structure

```
src/
  pages/        Route-level screens (one component per route)
  components/   Reusable UI building blocks
  services/     Supabase client + data access functions (no React inside)
  hooks/        React hooks (data fetching wrappers, auth context)
  utils/        Pure helpers and constants
  routes/       Route definitions + ProtectedRoute guard
  theme/        Material UI theme config
```

### Rules per folder

- **pages/**: Top-level screens only. Compose using components and hooks. Never call Supabase directly here — go through `hooks/` which call `services/`.
- **components/**: Reusable, presentational where possible. Accept props, avoid coupling to specific routes.
- **services/**: Plain async functions that wrap Supabase calls. Throw on error; never swallow. No React imports.
- **hooks/**: `useXxxQuery` / `useXxxMutation` wrappers around React Query. One `useAuth` context provider lives here.
- **utils/**: Pure functions, constants, no I/O.
- **routes/**: `AppRoutes.jsx` is the only place that declares routes. `ProtectedRoute` guards authenticated routes.

## Conventions

### Data fetching
- All server state goes through **React Query** hooks in `src/hooks/`.
- Query keys: `['merchants']`, `['merchants', id]`. On mutation, invalidate the matching keys.
- Never call `supabase.from(...)` from a page or component — use a service function.

### Forms
- Use **React Hook Form** for every form. Validate inline via `register` options.
- Surface server errors with a top-of-form `<Alert severity="error">`.

### Styling
- Use **Material UI** components and the `sx` prop. Do not add CSS files or other styling libraries.
- The theme lives in `src/theme/index.js`. Extend it there instead of hard-coding colors/typography in components.

### Responsiveness (mobile-first)
- Layouts should work at 360px width.
- Prefer responsive props (`{ xs: ..., sm: ..., md: ... }`) over CSS media queries.
- Tables should wrap in `<TableContainer sx={{ overflowX: 'auto' }}>`.
- The protected layout has a permanent drawer on `md+` and a temporary drawer below.

### Routing
- Route constants live in `src/utils/constants.js` under `ROUTES`. Reference them — don't hard-code paths.
- New protected pages must be added under the `<ProtectedRoute>` element in `AppRoutes.jsx`.

### Supabase
- Client is initialized once in `src/services/supabase.js` from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` (legacy `VITE_SUPABASE_ANON_KEY` is still accepted as a fallback).
- Auth state is exposed via `useAuth()` (in `hooks/useAuth.jsx`). Use that instead of re-reading the session.
- Service functions throw on error — let React Query surface it.

### Environment
- Local env: copy `.env.example` to `.env` and fill in. Never commit `.env`.
- Only variables prefixed with `VITE_` are exposed to the client.

## Database (expected schema)

`merchants` table (created in Supabase). See `supabase/schema.sql` for the canonical DDL.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | primary key, default `gen_random_uuid()` |
| `store_name` | text | not null |
| `mobile` | text | not null |
| `city` | text | not null |
| `state` | text | not null |
| `email` | text | nullable |
| `description` | text | nullable |
| `referral_code` | text | not null, unique |
| `status` | boolean | not null, default `true` (true = active, false = inactive) |
| `created_at` | timestamptz | not null, default `now()` |

RLS is enabled. The MVP policy grants any authenticated user full CRUD; tighten this once an `admins` table or role claim exists.

## What NOT to do

- Don't add TypeScript, CSS-in-JS libraries (styled-components, Tailwind), or alternative routers without asking.
- Don't introduce a state-management library (Redux/Zustand) — React Query + local state is enough.
- Don't bypass `ProtectedRoute` for authenticated pages.
- Don't query Supabase directly from pages/components — always go through `services/` via a hook.
- Don't hard-code referral codes; use `generateReferralCode()` from `utils/referralCode.js`.
- Don't commit secrets. `.env` is gitignored — keep it that way.

## When adding a new page

1. Add the path to `ROUTES` in `src/utils/constants.js`.
2. Create the page in `src/pages/`.
3. Register the route in `src/routes/AppRoutes.jsx` (inside `<ProtectedRoute>` unless it's public).
4. Add a sidebar nav entry in `src/components/ProtectedLayout.jsx` if it should be reachable from the menu.

## When adding a new data table

1. Create a service file in `src/services/<entity>.js` with `list / get / create / update / delete` functions.
2. Create a hooks file in `src/hooks/use<Entity>.js` exposing `useXxxQuery` / `useXxxMutation` wrappers.
3. Consume the hooks from pages.
