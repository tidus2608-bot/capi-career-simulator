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

Apply the database schema and RLS to your Supabase project (one-off):

```bash
# Either: paste supabase/migrations/0001_runs.sql into the Supabase SQL editor
# Or:
supabase db push
```

Configure Google OAuth in Supabase: **Authentication → Providers → Google**, set the client ID/secret and add `https://<your-domain>` to the Redirect URLs.

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
  _auth.ts             # HMAC-signed session cookies + Google OAuth allow-list
  _supabase.ts         # Service-role REST helper
  api/
    results.ts         # GET /api/results  (admin: aggregates + paginated rows)
    export.ts          # GET /api/export   (admin: CSV dump)
    auth/
      login.ts         # GET /api/auth/login    (Google OAuth redirect)
      callback.ts      # GET /api/auth/callback (exchange + cookie)
      logout.ts        # GET /api/auth/logout   (clear cookie)

supabase/
  migrations/
    0001_runs.sql      # `runs` schema + RLS policies
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
| `SUPABASE_SERVICE_ROLE_KEY` | encrypted | `/api/*`       |
| `GOOGLE_CLIENT_ID`          | plaintext | `/api/auth`    |
| `GOOGLE_CLIENT_SECRET`      | encrypted | `/api/auth`    |
| `SESSION_SECRET`            | encrypted | `/api/auth`    |
| `ALLOWED_DOMAIN`            | plaintext | `/api/auth`    |
| `ALLOWED_EMAIL`             | plaintext | `/api/auth`    |

### Branch protection

To require the verify job before merging, enable in **Settings → Branches → main**:

- Require status checks to pass: `verify`
- Require branches to be up to date

## Architecture notes

- **Frontend writes directly to Supabase** via the SDK with anon key. RLS policies in `supabase/migrations/0001_runs.sql` scope every row to `auth.uid()`.
- **Admin reads Supabase via Cloudflare Functions** using the service-role key. The service-role key is never shipped to the browser.
- **No `/api/submit` D1 endpoint** — that path was retired in PR 2 of the overhaul. The old D1 binding was dropped from `wrangler.toml`.
- **Scoring** lives in `src/lib/scoring.js` — pure functions, fully unit-tested, easy to port to TypeScript. The single source of truth for all question/mission/role data is `src/data/missions.json`.
