-- Capi Career Simulator - admin dashboard aggregates
-- Apply with `supabase db push` (or paste into the SQL editor) BEFORE deploying
-- the Cloudflare Functions that call these RPCs.
--
-- Aggregates are computed in the database so they cover every row. Fetching
-- rows and counting in the Function silently truncated at PostgREST's
-- max-rows limit (1000 by default on Supabase).

create or replace function public.admin_run_stats(p_role text default null, p_mission integer default null)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with filtered as (
    select primary_role, mission_id, profile_type, confidence_factor
    from public.runs
    where (p_role is null or primary_role = p_role)
      and (p_mission is null or mission_id = p_mission)
  )
  select jsonb_build_object(
    'total', (select count(*) from filtered),
    'distinct_roles', (
      select count(distinct primary_role) from filtered where primary_role <> ''
    ),
    'avg_confidence_factor', (select avg(confidence_factor) from filtered),
    'role_dist', coalesce((
      select jsonb_agg(jsonb_build_object('key', primary_role, 'count', n) order by n desc, primary_role)
      from (
        select primary_role, count(*) as n from filtered
        where primary_role is not null and primary_role <> ''
        group by primary_role
      ) s
    ), '[]'::jsonb),
    'mission_dist', coalesce((
      select jsonb_agg(jsonb_build_object('mission_id', mission_id, 'count', n) order by n desc, mission_id)
      from (
        select mission_id, count(*) as n from filtered
        where mission_id is not null
        group by mission_id
      ) s
    ), '[]'::jsonb),
    'profile_dist', coalesce((
      select jsonb_agg(jsonb_build_object('profile_type', profile_type, 'count', n) order by n desc, profile_type)
      from (
        select profile_type, count(*) as n from filtered
        where profile_type is not null and profile_type <> ''
        group by profile_type
      ) s
    ), '[]'::jsonb)
  );
$$;

create or replace function public.admin_feedback_stats()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select jsonb_build_object(
    'total', count(*),
    'avg_q1', avg((answers->>'q1')::numeric) filter (where jsonb_typeof(answers->'q1') = 'number'),
    'avg_q11', avg((answers->>'q11')::numeric) filter (where jsonb_typeof(answers->'q11') = 'number'),
    'bug_reports_count', count(*) filter (
      where jsonb_typeof(answers->'q13') = 'array' and jsonb_array_length(answers->'q13') > 0
    )
  )
  from public.feedback_responses;
$$;

revoke execute on function public.admin_run_stats(text, integer) from anon, authenticated, public;
revoke execute on function public.admin_feedback_stats() from anon, authenticated, public;
grant execute on function public.admin_run_stats(text, integer) to service_role;
grant execute on function public.admin_feedback_stats() to service_role;
