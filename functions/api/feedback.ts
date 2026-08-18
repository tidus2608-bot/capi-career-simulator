import { verifySession } from '../_auth.js'
import { supabaseRest } from '../_supabase.js'

interface Env {
  SESSION_SECRET: string
  ALLOWED_EMAIL?: string
  ALLOWED_DOMAIN?: string
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

interface FeedbackRow {
  id: string
  created_at: string
  run_id: string | null
  user_id: string | null
  answers: Record<string, unknown>
  consent_given: boolean
}

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

  try {
    const sb = supabaseRest(env)

    const { rows, total } = await sb.select<FeedbackRow>('feedback_responses', {
      select: 'id,created_at,run_id,user_id,answers,consent_given',
      order: 'created_at.desc',
      limit,
      offset,
      count: 'exact',
    })

    const { rows: allRows } = await sb.select<FeedbackRow>('feedback_responses', {
      select: 'answers',
      limit: 10000,
    })

    const q1Scores: number[] = []
    const q11Scores: number[] = []
    let bugReportCount = 0

    for (const r of allRows) {
      const ans = r.answers || {}
      if (typeof ans.q1 === 'number') q1Scores.push(ans.q1)
      if (typeof ans.q11 === 'number') q11Scores.push(ans.q11)
      if (Array.isArray(ans.q13) && ans.q13.length > 0) bugReportCount++
    }

    const stats = {
      total: total ?? allRows.length,
      avg_q1: avg(q1Scores),
      avg_q11: avg(q11Scores),
      bug_reports_count: bugReportCount,
    }

    return json({ ok: true, stats, rows, limit, offset }, 200, cors)
  } catch (err) {
    console.error('feedback error', err)
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

function avg(arr: number[]): number | null {
  if (!arr.length) return null
  return arr.reduce((a, b) => a + b, 0) / arr.length
}
