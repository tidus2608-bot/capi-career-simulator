-- Capi Career Simulator - Feedback Responses schema + RLS
-- Apply with `supabase db push` (or paste into the SQL editor for an existing project).

-- ─── Tables ──────────────────────────────────────────────────────────────────

create table if not exists public.feedback_responses (
  id              uuid primary key default gen_random_uuid(),
  run_id          uuid references public.runs(id) on delete set null,
  user_id         uuid references auth.users(id) on delete set null,
  answers         jsonb not null default '{}'::jsonb,
  consent_given   boolean not null default false,
  created_at      timestamptz not null default now()
);

-- Index for querying feedback by run or creation date
create index if not exists idx_feedback_created_at
  on public.feedback_responses (created_at desc);

create index if not exists idx_feedback_run_id
  on public.feedback_responses (run_id);

-- ─── RLS ─────────────────────────────────────────────────────────────────────

alter table public.feedback_responses enable row level security;

-- Allow anyone (guest or authenticated) to submit a feedback response.
drop policy if exists "feedback_insert_anyone" on public.feedback_responses;
create policy "feedback_insert_anyone"
  on public.feedback_responses for insert
  to public
  with check (true);

-- No public select/update/delete. Admin reads via service-role key in Cloudflare Functions.
