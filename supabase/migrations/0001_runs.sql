-- Capi Career Simulator — Supabase schema + RLS
-- Apply with `supabase db push` (or paste into the SQL editor for an existing project).

-- ─── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.runs (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  display_name      text,
  theme             text,
  mission_id        integer,
  started_at        timestamptz,
  completed_at      timestamptz,
  phase1_answers    jsonb not null default '{}'::jsonb,
  phase2_answers    jsonb not null default '{}'::jsonb,
  phase3_answers    jsonb not null default '{}'::jsonb,
  scores            jsonb not null default '{}'::jsonb,
  confidence_factor numeric,
  primary_role      text,
  secondary_role    text,
  profile_type      text,
  created_at        timestamptz not null default now()
);

-- Index for HistoryScene query (per-user, newest first)
create index if not exists idx_runs_user_created
  on public.runs (user_id, created_at desc);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

alter table public.runs enable row level security;

-- A signed-in user can insert a row only for themselves.
drop policy if exists "runs_insert_own" on public.runs;
create policy "runs_insert_own"
  on public.runs for insert
  to authenticated
  with check (auth.uid() = user_id);

-- A signed-in user can read only their own rows.
drop policy if exists "runs_select_own" on public.runs;
create policy "runs_select_own"
  on public.runs for select
  to authenticated
  using (auth.uid() = user_id);

-- A signed-in user can update only their own rows (used for save retry / upsert).
drop policy if exists "runs_update_own" on public.runs;
create policy "runs_update_own"
  on public.runs for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- No public access. Admin reads via service-role key (PR 2).
