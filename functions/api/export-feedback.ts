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

const CSV_FORMULA_PREFIX = /^[=+\-@\t\r\n]/

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

    const all: FeedbackRow[] = []
    const PAGE = 1000
    for (let offset = 0; ; offset += PAGE) {
      const { rows } = await sb.select<FeedbackRow>('feedback_responses', {
        select: 'id,created_at,run_id,user_id,answers,consent_given',
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
      'run_id',
      'user_id',
      'q1_overall',
      'q2_story',
      'q3_situations',
      'q4_choices',
      'q5_ui',
      'q6_accuracy_self',
      'q7_report_usefulness',
      'q8_duration',
      'q9_favorite_part',
      'q10_confusing',
      'q11_result_accuracy',
      'q12_discrepancies',
      'q13_bugs',
      'consent_given',
    ].join(',')

    const lines = all.map((row) => {
      const a = row.answers || {}
      const bugs = Array.isArray(a.q13) ? a.q13.join('; ') : ''

      return [
        row.id,
        row.created_at,
        row.run_id ?? '',
        row.user_id ?? '',
        a.q1 ?? '',
        a.q2 ?? '',
        a.q3 ?? '',
        a.q4 ?? '',
        a.q5 ?? '',
        a.q6 ?? '',
        a.q7 ?? '',
        a.q8 ?? '',
        csvEsc(a.q9 as string),
        csvEsc(a.q10 as string),
        a.q11 ?? '',
        csvEsc(a.q12 as string),
        csvEsc(bugs),
        row.consent_given ? 'true' : 'false',
      ].join(',')
    })

    const csv = [header, ...lines].join('\r\n')
    const filename = `capi-feedback-${new Date().toISOString().slice(0, 10)}.csv`

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (err) {
    console.error('export-feedback error', err)
    const message = err instanceof Error ? err.message : String(err)
    return new Response(`Internal error: ${message}`, { status: 500 })
  }
}

export async function onRequestOptions(): Promise<Response> {
  return new Response(null, { headers: { 'Access-Control-Allow-Methods': 'GET, OPTIONS' } })
}

function csvEsc(val: string | number | null | undefined): string {
  if (val == null) return ''
  let s = String(val)
  if (CSV_FORMULA_PREFIX.test(s)) s = `'${s}`
  return s.includes(',') || s.includes('"') || s.includes('\n') || s.includes('\r')
    ? `"${s.replace(/"/g, '""')}"`
    : s
}
