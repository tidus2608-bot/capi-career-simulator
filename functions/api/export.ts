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

const ROLES = ['explorer', 'builder', 'operator', 'connector', 'communicator'] as const

export async function onRequestGet({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const email = await verifySession(request, env)
  if (!email) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const sb = supabaseRest(env)

    const all: RunRow[] = []
    const PAGE = 1000
    for (let offset = 0; ; offset += PAGE) {
      const { rows } = await sb.select<RunRow>('runs', {
        select:
          'id,created_at,display_name,theme,mission_id,primary_role,secondary_role,profile_type,confidence_factor,scores',
        order: 'created_at.desc',
        limit: PAGE,
        offset,
      })
      all.push(...rows)
      if (rows.length < PAGE) break
      if (all.length >= 50000) break
    }

    const header = [
      'id',
      'created_at',
      'display_name',
      'theme',
      'mission_id',
      'primary_role',
      'secondary_role',
      'profile_type',
      'confidence_factor',
      ...ROLES.map((r) => `final_${r}`),
      ...ROLES.map((r) => `phase1_${r}`),
      ...ROLES.map((r) => `phase2_${r}`),
      ...ROLES.map((r) => `phase3_${r}`),
    ].join(',')

    const lines = all.map((row) => {
      const s = row.scores || {}
      const final = s.final || {}
      const phase1 = s.phase1 || {}
      const phase2 = s.phase2 || {}
      const phase3 = s.phase3 || {}
      return [
        row.id,
        row.created_at,
        csvEsc(row.display_name),
        csvEsc(row.theme),
        row.mission_id ?? '',
        csvEsc(row.primary_role),
        csvEsc(row.secondary_role),
        csvEsc(row.profile_type),
        row.confidence_factor ?? '',
        ...ROLES.map((r) => round1(final[r])),
        ...ROLES.map((r) => round1(phase1[r])),
        ...ROLES.map((r) => round1(phase2[r])),
        ...ROLES.map((r) => round1(phase3[r])),
      ].join(',')
    })

    const csv = [header, ...lines].join('\r\n')
    const filename = `capi-runs-${new Date().toISOString().slice(0, 10)}.csv`

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('export error', err)
    const message = err instanceof Error ? err.message : String(err)
    return new Response(`Internal error: ${message}`, { status: 500 })
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { headers: { 'Access-Control-Allow-Methods': 'GET, OPTIONS' } })
}

function csvEsc(val: string | number | null | undefined): string {
  if (val == null) return ''
  const s = String(val)
  return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
}

function round1(n: number | undefined | null): string {
  if (n == null) return ''
  return String(Math.round(Number(n) * 10) / 10)
}
