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

interface FeedbackRow {
  id: string
  created_at: string
  run_id: string | null
  user_id: string | null
  answers: Record<string, unknown>
  consent_given: boolean
}

/** Shape returned by the `admin_feedback_stats` RPC (supabase/migrations/0004_admin_stats.sql). */
interface FeedbackStats {
  total: number
  avg_q1: number | null
  avg_q11: number | null
  bug_reports_count: number
}

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

  try {
    const sb = supabaseRest(env)

    const { rows } = await sb.select<FeedbackRow>('feedback_responses', {
      select: 'id,created_at,run_id,user_id,answers,consent_given',
      order: 'created_at.desc,id.desc',
      limit,
      offset,
    })

    const stats = await sb.rpc<FeedbackStats>('admin_feedback_stats', {})

    return json({ ok: true, stats, rows, limit, offset })
  } catch (err) {
    console.error('feedback error', err)
    return json({ ok: false, error: 'Internal error' }, 500)
  }
}
