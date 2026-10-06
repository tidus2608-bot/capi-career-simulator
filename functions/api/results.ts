import { verifySession } from '../_auth.js'
import { intParam, json } from '../_http.js'
import { supabaseRest } from '../_supabase.js'

interface Env {
  SESSION_SECRET: string
  ALLOWED_EMAIL?: string
  ALLOWED_DOMAIN?: string
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

interface RunRow {
  id: string
  created_at: string
  display_name: string | null
  theme: string | null
  mission_id: number | null
  primary_role: string | null
  secondary_role: string | null
  profile_type: string | null
  confidence_factor: number | null
  scores?: {
    final?: Record<string, number>
    phase1?: Record<string, number>
    phase2?: Record<string, number>
    phase3?: Record<string, number>
  }
}

/** Shape returned by the `admin_run_stats` RPC (supabase/migrations/0004_admin_stats.sql). */
interface RunStats {
  total: number
  distinct_roles: number
  avg_confidence_factor: number | null
  role_dist: Array<{ key: string; count: number }>
  mission_dist: Array<{ mission_id: number; count: number }>
  profile_dist: Array<{ profile_type: string; count: number }>
}

/**
 * GET /api/results
 *
 * Auth: signed admin session cookie issued by /api/auth/session.
 * Reads from the Supabase `runs` table via service-role key (bypasses RLS).
 */
export async function onRequestGet({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const email = await verifySession(request, env)
  if (!email) {
    return json({ ok: false, error: 'Unauthorized' }, 401)
  }

  const url = new URL(request.url)
  const limit = intParam(url.searchParams.get('limit'), 50, 1, 1000)
  const offset = intParam(url.searchParams.get('offset'), 0, 0, Number.MAX_SAFE_INTEGER)
  const role = url.searchParams.get('role') || null
  const missionParam = url.searchParams.get('mission')
  if (missionParam && !/^\d+$/.test(missionParam)) {
    return json({ ok: false, error: 'Invalid mission' }, 400)
  }
  const mission = missionParam ? Number(missionParam) : null

  try {
    const sb = supabaseRest(env)

    const filterParts: string[] = []
    if (role) filterParts.push(`primary_role=eq.${encodeURIComponent(role)}`)
    if (mission != null) filterParts.push(`mission_id=eq.${mission}`)
    const filter = filterParts.join('&')

    const { rows } = await sb.select<RunRow>('runs', {
      select:
        'id,created_at,display_name,theme,mission_id,primary_role,secondary_role,profile_type,confidence_factor,scores',
      filter,
      order: 'created_at.desc,id.desc',
      limit,
      offset,
    })

    const agg = await sb.rpc<RunStats>('admin_run_stats', { p_role: role, p_mission: mission })

    const stats = {
      total: agg.total,
      distinct_roles: agg.distinct_roles,
      avg_confidence_factor: agg.avg_confidence_factor,
    }

    return json({
      ok: true,
      stats,
      roleDist: agg.role_dist,
      missionDist: agg.mission_dist,
      profileDist: agg.profile_dist,
      rows,
      limit,
      offset,
    })
  } catch (err) {
    console.error('results error', err)
    // Authenticated admins see the actual error; this is gated above by
    // verifySession, so it's safe to surface details to the caller.
    const message = err instanceof Error ? err.message : String(err)
    return json({ ok: false, error: 'Internal error', detail: message }, 500)
  }
}
