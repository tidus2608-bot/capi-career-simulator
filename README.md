# Capi Career Path Simulator

A React + Vite career-discovery game for Vietnamese students. Three-phase flow (self-perception scan → mission simulation → reflection) produces a 12-section certificate identifying the player's primary and secondary career roles.

- **Frontend**: React 18 + Vite 5, vanilla JS/JSX with TypeScript supported via `allowJs`. Mascot, particles, radar charts, ambient WebAudio.
- **Auth + storage**: Supabase (Google OAuth, RLS-scoped `runs` table per user).
- **Admin**: Cloudflare Pages Function `/admin.html` reads Supabase via service-role key (no D1).
- **Deploy**: Cloudflare Pages from `main` via GitHub Actions.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your Supabase URL + anon key
```

Apply the database schema and RLS to your Supabase project (one-off). This must
include `supabase/migrations/0002_admins.sql` so Cloudflare Functions can check
database-backed admin membership:

```bash
# Either: paste supabase/migrations/0001_runs.sql into the Supabase SQL editor
# Or:
supabase db push
```

### OAuth Setup

Admin and player authentication use Supabase Google OAuth. You must configure this in your Supabase project under **Authentication → Providers → Google**.

1. Enable the Google provider in Supabase.
2. Enter your Google Client ID and Client Secret.
3. Add the redirect URLs to your Supabase configuration.

In the Supabase dashboard, set the Site URL to your production domain, such as `https://capi-career-simulator.pages.dev`.

Add the following Redirect URLs for local development and preview deployments:

- `https://capi-career-simulator.pages.dev/**` (exact production host, preferred)
- `http://localhost:8788/**`
- `http://localhost:5173/**`
- `https://**.capi-career-simulator.pages.dev/**` (preview wildcard)

The same Supabase login flow creates player sessions. When an admin logs in, the frontend sends the token to the server. After validation, the server checks the email against `public.admins` and issues an admin session cookie. `ALLOWED_EMAIL` and `ALLOWED_DOMAIN` are bootstrap-only: they grant access only while `public.admins` is empty. After any admin row exists, database membership is authoritative and deleting a row invalidates existing admin cookies on the next request.

## Develop

```bash
npm run dev          # Vite dev server (frontend only)
npm run test:watch   # Vitest watch mode
```

For end-to-end including Cloudflare Functions (admin endpoints):

```bash
npm run build && npx wrangler pages dev dist
```

## Verify

A single command runs everything CI runs:

```bash
npm run verify   # = lint + typecheck + test + build
```

Individual checks:

- `npm run lint` — ESLint with React, hooks, jsx-a11y plugins
- `npm run typecheck` — TypeScript over `src/` and `functions/`
- `npm run test` — Vitest (jsdom for components, node for Functions)
- `npm run format` — Prettier write
- `npm run format:check` — Prettier check (no write)

## Project layout

```
src/
  App.jsx              # Top-level state machine, Supabase client, save flow
  main.tsx             # Entry point
  data.js              # UI data: roles, themes, missions index, helpers
  audio.js             # CapiAudio (WebAudio engine)
  types.ts             # Domain types (Role, ScoringResult, etc.)
  lib/
    scoring.js         # Pure scoring engine (3-phase model)
    scoring.test.js    # Profile-classification tests
  components/
    Capi.jsx           # SVG chibi capybara mascot
    UI.jsx             # Particles, Typed, Radar, RoleIcon, SceneArt
    Scenes.jsx         # All scenes (~900 LOC; split planned in PR 4)
    ErrorBoundary.jsx  # Async-failure fallback
  data/
    missions.json      # Source of truth for question/mission/role data

functions/             # Cloudflare Pages Functions (admin only)
  _auth.ts             # HMAC-signed session cookies + admin allowlist
  _admins.ts           # Service-role admin membership helper
  _supabase.ts         # Service-role REST helper
  api/
    admins.ts          # GET/POST/DELETE /api/admins (admin management)
    results.ts         # GET /api/results  (admin: aggregates + paginated rows)
    export.ts          # GET /api/export   (admin: CSV dump)
    auth/
      session.ts       # POST /api/auth/session (validate token + set session cookie)
      status.ts        # GET /api/auth/status   (check session status)
      logout.ts        # GET /api/auth/logout   (clear cookie)

supabase/
  migrations/
    0001_runs.sql      # `runs` schema + RLS policies
    0002_admins.sql    # `admins` schema + RLS lock-down
```

## Deploy

CI deploys `main` → `https://capi-career-simulator.pages.dev/`. The deploy
workflow runs `lint → typecheck → test → build → wrangler deploy`; failure at
any step blocks the deploy.

### Required secrets

**GitHub repository secrets** (Settings → Secrets and variables → Actions):

- `CLOUDFLARE_API_TOKEN` — Cloudflare API token with Pages:Edit
- `CLOUDFLARE_ACCOUNT_ID` — your Cloudflare account ID
- `VITE_SUPABASE_URL` — public Supabase URL (used at build time)
- `VITE_SUPABASE_ANON_KEY` — public anon JWT (used at build time)

**Cloudflare Pages → Settings → Environment Variables** (Production + Preview):

| Name                        | Type      | Used by        |
| --------------------------- | --------- | -------------- |
| `VITE_SUPABASE_URL`         | plaintext | frontend build |
| `VITE_SUPABASE_ANON_KEY`    | plaintext | frontend build |
| `SUPABASE_URL`              | plaintext | `/api/*`       |
| `SUPABASE_ANON_KEY`         | plaintext | `/api/*`       |
| `SUPABASE_SERVICE_ROLE_KEY` | encrypted | `/api/*`       |
| `SESSION_SECRET`            | encrypted | `/api/auth`    |
| `ALLOWED_DOMAIN`            | plaintext | `/api/auth` bootstrap only |
| `ALLOWED_EMAIL`             | plaintext | `/api/auth` bootstrap only |

For local development, frontend variables starting with `VITE_` remain in `.env`.
Server-side environment variables for Cloudflare Functions (such as `SUPABASE_URL`,
`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SESSION_SECRET`,
and the bootstrap allowlist variables `ALLOWED_EMAIL` or `ALLOWED_DOMAIN`) must be placed in a
`.dev.vars` file in the project root. This file is gitignored.

In production, these server variables belong in the Cloudflare Pages dashboard under
**Settings → Environment Variables**. You need to redeploy the project after changing
Pages variables for them to take effect.

### Branch protection

To require the verify job before merging, enable in **Settings → Branches → main**:

- Require status checks to pass: `verify`
- Require branches to be up to date

## Architecture notes

- **Frontend writes directly to Supabase** via the SDK with anon key. RLS policies in `supabase/migrations/0001_runs.sql` scope every row to `auth.uid()`.
- **Admin reads Supabase via Cloudflare Functions** using the service-role key. The service-role key is never shipped to the browser.
- **Admin authorization is database-backed** via `public.admins`. The `admins` table grants no direct anon/authenticated table access; all list/create/delete operations go through protected Cloudflare Functions.
- **No `/api/submit` D1 endpoint** — that path was retired in PR 2 of the overhaul. The old D1 binding was dropped from `wrangler.toml`.
- **Scoring** lives in `src/lib/scoring.js` — pure functions, fully unit-tested, easy to port to TypeScript. The single source of truth for all question/mission/role data is `src/data/missions.json`.
