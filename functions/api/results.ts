import { verifySession } from '../_auth.js'
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
  const cors = corsHeaders(request)

  const email = await verifySession(request, env)
  if (!email) {
    return json({ ok: false, error: 'Unauthorized' }, 401, cors)
  }

  const url = new URL(request.url)
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10), 1000)
  const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10), 0)
  const role = url.searchParams.get('role')
  const mission = url.searchParams.get('mission')

  try {
    const sb = supabaseRest(env)

    const filterParts: string[] = []
    if (role) filterParts.push(`primary_role=eq.${encodeURIComponent(role)}`)
    if (mission) filterParts.push(`mission_id=eq.${encodeURIComponent(mission)}`)
    const filter = filterParts.join('&')

    const { rows, total } = await sb.select<RunRow>('runs', {
      select:
        'id,created_at,display_name,theme,mission_id,primary_role,secondary_role,profile_type,confidence_factor,scores',
      filter,
      order: 'created_at.desc',
      limit,
      offset,
      count: 'exact',
    })

    const { rows: allRows } = await sb.select<RunRow>('runs', {
      select: 'primary_role,mission_id,profile_type,confidence_factor',
      filter,
      limit: 10000,
    })

    const stats = {
      total: total ?? allRows.length,
      distinct_roles: new Set(allRows.map((r) => r.primary_role).filter(Boolean)).size,
      avg_confidence_factor: avg(
        allRows.map((r) => r.confidence_factor).filter((n): n is number => n != null),
      ),
    }

    const roleDist = countBy(allRows, 'primary_role').map(([key, count]) => ({ key, count }))
    const missionDist = countBy(allRows, 'mission_id').map(([key, count]) => ({
      mission_id: key,
      count,
    }))
    const profileDist = countBy(allRows, 'profile_type').map(([key, count]) => ({
      profile_type: key,
      count,
    }))

    return json(
      { ok: true, stats, roleDist, missionDist, profileDist, rows, limit, offset },
      200,
      cors,
    )
  } catch (err) {
    console.error('results error', err)
    // Authenticated admins see the actual error; this is gated above by
    // verifySession, so it's safe to surface details to the caller.
    const message = err instanceof Error ? err.message : String(err)
    return json({ ok: false, error: 'Internal error', detail: message }, 500, cors)
  }
}

export async function onRequestOptions({ request }: { request: Request }): Promise<Response> {
  return new Response(null, {
    headers: {
      ...corsHeaders(request),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

function corsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || ''
  return { 'Access-Control-Allow-Origin': origin, Vary: 'Origin' }
}

function json(body: unknown, status: number, extraHeaders: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  })
}

function countBy<T>(rows: T[], key: keyof T): Array<[unknown, number]> {
  const map = new Map<unknown, number>()
  for (const r of rows) {
    const v = r[key]
    if (v == null || v === '') continue
    map.set(v, (map.get(v) || 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1])
}

function avg(arr: number[]): number | null {
  if (!arr.length) return null
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
