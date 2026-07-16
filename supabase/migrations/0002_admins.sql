-- Capi Career Simulator - database-backed admin authorization
-- Apply with `supabase db push` or paste into the Supabase SQL editor.

create table if not exists public.admins (
  email      text primary key,
  created_at timestamptz not null default now(),
  created_by text,
  constraint admins_email_normalized check (email = lower(btrim(email)) and position('@' in email) > 1)
);

create unique index if not exists admins_email_unique on public.admins (email);
create index if not exists admins_created_at_idx on public.admins (created_at desc);

alter table public.admins enable row level security;

revoke all on table public.admins from anon;
revoke all on table public.admins from authenticated;
revoke all on table public.admins from public;

-- Serialize deletes so concurrent requests cannot remove the final admins.
create or replace function public.delete_admin(target_email text, actor_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  admin_count integer;
begin
  perform pg_advisory_xact_lock(hashtext('capi-career-simulator:admins'));

  if lower(btrim(target_email)) = lower(btrim(actor_email)) then
    raise exception 'You cannot delete your own admin account';
  end if;

  select count(*)::integer into admin_count from public.admins;
  if admin_count <= 1 then
    raise exception 'You cannot delete the last admin';
  end if;

  delete from public.admins where email = lower(btrim(target_email));
  if not found then
    raise exception 'Admin not found';
  end if;
end;
$$;

revoke execute on function public.delete_admin(text, text) from anon, authenticated, public;
grant execute on function public.delete_admin(text, text) to service_role;

-- No anon/authenticated policies are defined. Cloudflare Functions access this
-- table only with the Supabase service-role key, which bypasses RLS.
