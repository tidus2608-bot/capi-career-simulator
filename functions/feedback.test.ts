import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSession } from './_auth.js'
import { onRequestGet as getFeedback } from './api/feedback.js'
import { onRequestGet as exportFeedback } from './api/export-feedback.js'

const env = {
  SESSION_SECRET: 'a-very-long-test-secret-32+chars',
  ALLOWED_EMAIL: 'admin@example.com',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
}

afterEach(() => {
  vi.restoreAllMocks()
})

function fetchCalls() {
  return vi.mocked(globalThis.fetch).mock.calls
}

describe('GET /api/feedback', () => {
  it('returns 401 when unauthorized', async () => {
    const response = await getFeedback({
      request: new Request('https://site.test/api/feedback'),
      env,
    })
    expect(response.status).toBe(401)
  })

  it('returns feedback list and stats for authorized admin', async () => {
    const token = await createSession('admin@example.com', env.SESSION_SECRET)
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ email: 'admin@example.com' }]), {
          status: 200,
          headers: { 'Content-Range': '0-0/1' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ email: 'admin@example.com' }]), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: 'fb-1',
              created_at: '2026-08-17T00:00:00.000Z',
              run_id: 'run-1',
              user_id: null,
              answers: { q1: 5, q11: 4, q13: ['ui_glitch'] },
              consent_given: true,
            },
          ]),
          {
            status: 200,
            headers: { 'Content-Range': '0-0/1' },
          },
        ),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ total: 1, avg_q1: 5, avg_q11: 4, bug_reports_count: 1 }), {
          status: 200,
        }),
      )

    const response = await getFeedback({
      request: new Request('https://site.test/api/feedback', {
        headers: { Cookie: `admin_session=${token}` },
      }),
      env,
    })

    expect(response.status).toBe(200)
    const body = (await response.json()) as {
      ok: boolean
      stats: { total: number; avg_q1: number; bug_reports_count: number }
      rows: Array<{ id: string }>
    }
    expect(body.ok).toBe(true)
    expect(body.stats.total).toBe(1)
    expect(body.stats.avg_q1).toBe(5)
    expect(body.stats.bug_reports_count).toBe(1)
    expect(body.rows).toHaveLength(1)
    expect(String(fetchCalls()[3]?.[0])).toBe(
      'https://example.supabase.co/rest/v1/rpc/admin_feedback_stats',
    )
  })

  it('falls back to default pagination for non-numeric limit/offset', async () => {
    const token = await createSession('admin@example.com', env.SESSION_SECRET)
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ email: 'admin@example.com' }]), {
          status: 200,
          headers: { 'Content-Range': '0-0/1' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ email: 'admin@example.com' }]), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ total: 0, avg_q1: null, avg_q11: null, bug_reports_count: 0 }),
          { status: 200 },
        ),
      )

    const response = await getFeedback({
      request: new Request('https://site.test/api/feedback?limit=abc&offset=-5', {
        headers: { Cookie: `admin_session=${token}` },
      }),
      env,
    })

    expect(response.status).toBe(200)
    const body = (await response.json()) as { limit: number; offset: number }
    expect(body.limit).toBe(50)
    expect(body.offset).toBe(0)
    const selectUrl = new URL(String(fetchCalls()[2]?.[0]))
    expect(selectUrl.searchParams.get('limit')).toBe('50')
    expect(selectUrl.searchParams.get('offset')).toBe('0')
  })
})

describe('GET /api/export-feedback', () => {
  it('returns CSV with sanitized formula cells', async () => {
    const token = await createSession('admin@example.com', env.SESSION_SECRET)
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ email: 'admin@example.com' }]), {
          status: 200,
          headers: { 'Content-Range': '0-0/1' },
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ email: 'admin@example.com' }]), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify([
            {
              id: 'fb-1',
              created_at: '2026-08-17T00:00:00.000Z',
              run_id: 'run-1',
              user_id: null,
              answers: {
                q1: 5,
                q9: '=CMD()',
                q10: '+formula',
                q13: ['ui_glitch'],
              },
              consent_given: true,
            },
          ]),
          { status: 200 },
        ),
      )

    const response = await exportFeedback({
      request: new Request('https://site.test/api/export-feedback', {
        headers: { Cookie: `admin_session=${token}` },
      }),
      env,
    })

    expect(response.status).toBe(200)
    const csv = await response.text()
    expect(csv).toContain('id,created_at,run_id')
    expect(csv).toContain("'+formula")
    expect(csv).toContain("'=CMD()")
    expect(csv).toContain('ui_glitch')
  })
})
