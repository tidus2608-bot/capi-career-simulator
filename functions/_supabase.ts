/**
 * Tiny Supabase REST helper for Cloudflare Functions.
 * Uses the service-role key (bypasses RLS — only safe server-side).
 *
 * Required env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

interface SupabaseEnv {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

interface SelectOptions {
  select?: string
  filter?: string
  order?: string
  limit?: number
  offset?: number
  count?: 'exact' | 'planned' | 'estimated'
}

interface SelectResult<T> {
  rows: T[]
  total: number | null
}

export function supabaseRest(env: SupabaseEnv) {
  const base = env.SUPABASE_URL?.replace(/\/$/, '')
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!base || !key) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  }

  async function request(path: string, init: RequestInit = {}): Promise<Response> {
    const url = `${base}/rest/v1/${path}`
    const res = await fetch(url, {
      ...init,
      headers: {
        apikey: key!,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
    })
    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Supabase ${res.status}: ${text}`)
    }
    return res
  }

  return {
    async select<T = unknown>(
      table: string,
      { select = '*', filter = '', order, limit, offset, count }: SelectOptions = {},
    ): Promise<SelectResult<T>> {
      const params = new URLSearchParams()
      params.set('select', select)
      if (order) params.set('order', order)
      if (limit != null) params.set('limit', String(limit))
      if (offset != null) params.set('offset', String(offset))

      const headers: Record<string, string> = {}
      if (count) headers.Prefer = `count=${count}`

      const path = `${table}?${params.toString()}${filter ? '&' + filter : ''}`
      const res = await request(path, { method: 'GET', headers })
      const rows = (await res.json()) as T[]
      const total = count ? parseTotalCount(res.headers.get('content-range')) : null
      return { rows, total }
    },
  }
}

function parseTotalCount(contentRange: string | null): number | null {
  if (!contentRange) return null
  const m = contentRange.match(/\/(\d+|\*)$/)
  if (!m || m[1] === '*' || !m[1]) return null
  return parseInt(m[1], 10)
}
