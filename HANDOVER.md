# Capi Career Path Simulator — Agent Handover

## 1. Project Overview

**Capi Career Path Simulator** is a React + Vite career discovery game for Vietnamese students. It implements a 3-phase assessment flow (self-perception → mission simulation → reflection) and produces a career certificate identifying primary and secondary STEAM roles.

- **Live**: https://capi-career-simulator.pages.dev/
- **Deployment**: Cloudflare Pages (CI/CD via GitHub Actions)
- **Version**: 1.0.0
- **Working branch**: `claude/fervent-goldberg-GaEGP` (development branch for this session)

---

## 2. Project Structure

```
capi-career-simulator/
├── src/
│   ├── App.jsx                    # Root state machine — scene routing
│   ├── main.tsx                   # React entry point
│   ├── audio.js                   # WebAudio engine (sfx + ambient pads)
│   ├── data.js                    # UI data re-exports from missions.json
│   ├── types.ts                   # TypeScript domain types
│   ├── styles.css                 # Global styles (1025 lines, design tokens)
│   ├── components/
│   │   ├── Capi.jsx               # Animated capybara mascot (PNG sprite, 12 frames)
│   │   ├── UI.jsx                 # Particles, Typed, Radar, DualRadar, RoleIcon
│   │   ├── ErrorBoundary.jsx
│   │   ├── LanguageSwitch.jsx     # vi/en toggle
│   │   ├── illustrations/         # SVG/JSX scene art helpers
│   │   └── scenes/                # 10 scene components (see §6)
│   ├── lib/
│   │   ├── scoring.js             # Pure scoring engine, fully unit-tested
│   │   └── scoring.test.js
│   ├── data/
│   │   ├── missions.json          # Single source of truth (v2.0.0 schema)
│   │   └── missionVisuals.js
│   └── i18n/
│       ├── index.js               # i18next config (vi/en, localStorage cache)
│       └── locales/{vi,en}/common.json
│
├── functions/                     # Cloudflare Pages Functions (TypeScript)
│   ├── _auth.ts                   # HMAC-SHA256 session + Google allow-list
│   ├── _supabase.ts               # Service-role REST helper
│   └── api/auth/{login,callback,logout}.ts, results.ts, export.ts
│
├── supabase/migrations/0001_runs.sql
│
├── public/
│   ├── capi/capi-[0-11].png       # Mascot sprite frames
│   ├── illos/                     # 250+ scene/question illustrations (94 MB)
│   │   ├── m{1-6}-q{01-20}.{webp|png}
│   │   ├── mission-{1-6}-{start,end}.{webp|svg}
│   │   ├── sx4-*.svg              # Theme/select backgrounds
│   │   └── ending-*.webp
│   └── admin.html
│
├── .github/workflows/
│   ├── verify.yml                 # PR: lint → typecheck → test → build
│   └── deploy.yml                 # On main: Cloudflare Pages deploy
│
├── vite.config.js
├── wrangler.toml
└── package.json
```

---

## 3. Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 8, react-i18next 17 |
| Backend | Cloudflare Pages Functions (TypeScript) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Google OAuth via Supabase; HMAC-SHA256 admin session cookies |
| Styling | Vanilla CSS with CSS custom properties |
| Audio | Web Audio API (no library) |
| Testing | Vitest (jsdom for components, Node for functions) |
| Linting | ESLint 9 (React + hooks + a11y) |

---

## 4. App Flow (State Machine)

`App.jsx` is a single-file state machine — no router library. Stages are string constants:

```
'intro'
  ↓ (auth or guest)
'scan'          ← Phase 1: 15 Likert + 2 confidence questions
  ↓
'role-reveal'   ← Shows preliminary top role
  ↓
'theme'         ← Pick Ark-Capi or Techno
  ↓
'mission-pick'  ← Pick 1 of 3 missions in theme
  ↓
'mission-play'  ← Phase 2: 20 Q/A questions
                   sub-stages: 'intro' → 'q' → 'ending'
  ↓
'reflect'       ← Phase 3: 1 Likert per role (5 questions)
  ↓
'certificate'   ← Results, save to Supabase, history link
  ↓
'history'       ← Past runs (Supabase query, auth required)
```

**Dev shortcuts** (keyboard in-app): `Ctrl+.` / `Cmd+.` opens tweaks panel to jump stages.

---

## 5. Data Model

**Source of truth**: `/src/data/missions.json` (v2.0.0)

**Key exports from `src/data.js`**:

- `CAPI_ROLES` — 5 career archetypes: `explorer`, `builder`, `operator`, `connector`, `communicator`
- `CAPI_THEMES` — 2 narrative themes:
  - `ark-capi` → missions 1, 2, 6
  - `techno` → missions 3, 4, 5
- `CAPI_MISSIONS` — 6 missions, each with 20 questions; each question has A/B/C options tagged with `primary_role` (+2pts) and `secondary_role` (+1pt)
- `PHASE1_QUESTIONS` — 15 Likert questions (5 per role)
- `CONFIDENCE_CHECKS` — 2 Likert questions for confidence scaling
- `PHASE3_QUESTIONS` — 5 reflection Likert questions (1 per role)

**Scoring** (`/src/lib/scoring.js`):
1. Phase 1: Aggregate Likert per role → scale 0–100, apply confidence factor
2. Phase 2: Aggregate mission option votes per role → normalize to max
3. Phase 3: Aggregate reflection Likert per role → scale 0–100
4. Final: weighted sum (weights from missions.json)
5. Profile type: `"Hidden"` (reality gap ≥15), `"Emerging"` (learning gap ≥15), or `"Aligned"`

---

## 6. Component Inventory

### Scenes (`src/components/scenes/`)

| File | Description |
|------|-------------|
| `Intro.jsx` | Welcome screen, Google auth / guest, `sx4-intro.svg` background |
| `Scanning.jsx` | Phase 1 Likert grid + confidence questions |
| `RoleReveal.jsx` | Animated preliminary role card |
| `Theme.jsx` | Theme card picker (hero banner + 2 cards) |
| `MissionPick.jsx` | Mission card picker within theme |
| `MissionPlay.jsx` | Phase 2: intro splash → Q/A loop → ending splash |
| `Reflection.jsx` | Phase 3: per-role Likert questions |
| `Certificate.jsx` | 12-section result certificate + Supabase save |
| `History.jsx` | User's past runs (paginated Supabase query) |
| `Transition.jsx` | Scene flash animation wrapper |
| `SceneShell.jsx` | Common full-screen scene wrapper (light mode variant) |
| `LikertSlider.jsx` | Reusable 5-point Likert scale |

### UI Components (`src/components/UI.jsx`)
- `Particles` — 24 floating animated dots
- `Typed` — Typewriter effect (22ms/char default)
- `Radar` — 5-axis role pentagon chart
- `DualRadar` — Overlay self-perception vs behaviour radars
- `RoleIcon` — SVG icon per role (compass, hammer, gear, network, broadcast)

---

## 7. Styling

**File**: `src/styles.css` (1025 lines, vanilla CSS)

**Design tokens** (`:root`):
- Backgrounds: `--bg-0` (#050617), `--bg-1`, `--bg-2`, `--surface`
- Text: `--ink` (#e8ecff), `--ink-dim`, `--ink-mute`
- Accent: `--cyan` (#00e5ff), `--magenta` (#ff2d7a), `--gold` (#ffb020), `--violet`
- Fonts: `--font-display` / `--font-body` = "Plus Jakarta Sans"; `--font-mono` = "JetBrains Mono"

**Key CSS classes**:
- `.cosmic-bg` — Starfield + gradient backdrop
- `.glass` — Light card (white bg, shadow)
- `.btn`, `.btn-primary`, `.btn-ghost`
- `.p2-shell` / `.p2-q-shell` — Phase 2 scene containers
- `.p2-hero` — Sidebar hero banner
- `.p2-card` — Mission/theme selection card
- `.cert-*` — Certificate section styles
- `.mono` — Uppercase monospace label
- `.fade-up`, `.fade-in`, `.scene-flash` — Transition animations

---

## 8. Audio System (`src/audio.js`)

Singleton: `export const capiAudio = new CapiAudio()`

- **Ambient pads**: `capiAudio.pad(freqs, color)` — per-mission oscillator + LFO (6 mission configs hardcoded in MissionPlay)
- **SFX**: `capiAudio.sfx('click'|'confirm'|'scan'|'whoosh'|'success')`
- **Mute**: Toggled by top-right button in App.jsx, persisted in `localStorage`
- **Autoplay**: `capiAudio.resume()` called on first user interaction

---

## 9. Supabase Integration

**Table**: `public.runs`

```
id, user_id (FK auth.users), display_name, theme, mission_id,
started_at, completed_at,
phase1_answers (jsonb), phase2_answers (jsonb), phase3_answers (jsonb),
scores (jsonb), confidence_factor,
primary_role, secondary_role, profile_type,
created_at
```

**RLS**: Users can only insert/select/update their own rows. Admins use service-role key via Functions.

**Admin API** (Cloudflare Functions):
- `GET /api/results` — Paginated runs (with filters)
- `GET /api/export` — CSV dump
- `GET /api/auth/{login,callback,logout}` — Google OAuth for admin access

---

## 10. Environment Variables

| Variable | Used by |
|----------|---------|
| `VITE_SUPABASE_URL` | Frontend Supabase client |
| `VITE_SUPABASE_ANON_KEY` | Frontend Supabase client |
| `SUPABASE_URL` | Cloudflare Functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Cloudflare Functions (admin only) |
| `GOOGLE_CLIENT_ID` | OAuth (Cloudflare) |
| `GOOGLE_CLIENT_SECRET` | OAuth (Cloudflare) |
| `SESSION_SECRET` | HMAC-SHA256 admin cookie |
| `ALLOWED_DOMAIN` / `ALLOWED_EMAIL` | Admin allow-list |

---

## 11. Development Commands

```bash
npm install
npm run dev          # Vite dev server (frontend only)
npm run test:watch   # Vitest watch
npm run verify       # lint + typecheck + test + build (run before PRs)

# Test with Cloudflare Functions locally:
npm run build && npx wrangler pages dev dist
```

---

## 12. Recent Commits

```
f884dd4  Fix illustration cropping on transition/splash screens
058a4db  Remove Capi character from intro screen
d0c8ae2  Fix white screen on intro/ending stages
2da4a80  Add remaining 3 mission transition screens (missions 1 & 4 start/end)
62cb480  Add mission-5-end transition and switch to per-mission file lookup
d6d79d9  Add mission transition screens and wire into MissionPlay
b72d3cd  Add Capi sprite sheet and animated scene transition flash
b3f5e52  Fix 5 UI bugs from FE audit report
afec421  Responsive design audit fixes across all scenes
28c53ae  Replace procedural Capi character with new illustrated capybara SVG
a963f8b  Sync app fonts to Phase 2 design — switch to Plus Jakarta Sans
```

---

## 13. Work Done This Session

1. **Removed Capi character from intro screen** (PR #33, merged)
   - `src/components/scenes/Intro.jsx` — deleted the `<Capi>` overlay + pulse-ring `<div>` block and the unused import
   - The `sx4-intro.svg` background already contains the illustration; the React component was redundant

2. **Fixed illustration cropping on all transition screens** (PR #34, merged)
   - `src/components/scenes/MissionPlay.jsx` — added `objectPosition: 'top center'` to the `intro` stage and `ending` stage `<img>` elements
   - `src/components/scenes/Theme.jsx` — same fix to hero banner image
   - `src/components/scenes/MissionPick.jsx` — same fix to hero banner image
   - Root cause: all mission start/end SVGs are 1440×1024 (~1.4:1 ratio). On wider viewports (≥1500px, ratio ~1.6–1.8:1), `objectFit: cover` with default center alignment was cropping ~130px from the top, cutting off speech bubbles. Anchoring to `top center` preserves top content.

---

## 14. Notes for Next Agent

- **Single source of truth for missions/roles**: `src/data/missions.json` → any content changes go there first, then `data.js` re-exports
- **Scoring is pure and tested**: `src/lib/scoring.js` has no side effects; don't alter without updating `scoring.test.js`
- **i18n coverage is partial**: Only `intro`, `certificate`, `history` scenes are fully translated. Mission/reflection scenes use Vietnamese text directly in JSX.
- **Illustration naming is deterministic**: `m{mission_id}-q{index_padded}.{ext}` — question screens derive the `src` from `missionId + idx` (see `MissionPlay.jsx:51`). Adding new missions requires adding illustration files following this pattern.
- **Audio autoplay policy**: `capiAudio.resume()` must be called inside a user-event handler; the `AudioContext` is lazy-created.
- **RLS is critical**: All frontend writes go through RLS. Admin reads use service-role key only (never expose in frontend).
- **Build size**: ~700 KB limit; manual chunks in `vite.config.js` prevent react+supabase bloat — don't add heavy dependencies without splitting.
- **Design language**: Cosmic cyberpunk (dark bg, scanlines, HUD frames) for Phase 1; light glassmorphism cards (`#F5F6FA` bg, `.glass`) for Phase 2/3.
