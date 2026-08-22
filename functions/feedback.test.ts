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
        new Response(JSON.stringify([{ answers: { q1: 5, q11: 4, q13: ['ui_glitch'] } }]), {
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
