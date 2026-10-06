import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSession } from './_auth.js'
import { onRequestGet as getResults } from './api/results.js'

const env = {
  SESSION_SECRET: 'a-very-long-test-secret-32+chars',
  ALLOWED_EMAIL: 'admin@example.com',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
}

afterEach(() => {
  vi.restoreAllMocks()
})

function mockAdminSession() {
  return vi
    .spyOn(globalThis, 'fetch')
    .mockResolvedValueOnce(
      new Response(JSON.stringify([{ email: 'admin@example.com' }]), {
        status: 200,
        headers: { 'Content-Range': '0-0/1' },
      }),
    )
    .mockResolvedValueOnce(
      new Response(JSON.stringify([{ email: 'admin@example.com' }]), { status: 200 }),
    )
}

async function authedRequest(query = '') {
  const token = await createSession('admin@example.com', env.SESSION_SECRET)
  return new Request(`https://site.test/api/results${query}`, {
    headers: { Cookie: `admin_session=${token}` },
  })
}

describe('GET /api/results', () => {
  it('returns 401 without a session', async () => {
    const response = await getResults({
      request: new Request('https://site.test/api/results'),
      env,
    })
    expect(response.status).toBe(401)
  })

  it('returns page rows plus aggregates computed by the admin_run_stats RPC', async () => {
    const fetchMock = mockAdminSession()
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ id: 'run-1', primary_role: 'builder' }]), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            total: 2500,
            distinct_roles: 3,
            avg_confidence_factor: 0.75,
            role_dist: [{ key: 'builder', count: 2000 }],
            mission_dist: [{ mission_id: 2, count: 2500 }],
            profile_dist: [{ profile_type: 'focused', count: 2500 }],
          }),
          { status: 200 },
        ),
      )

    const response = await getResults({
      request: await authedRequest('?role=builder&mission=2'),
      env,
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    const body = (await response.json()) as Record<string, unknown>
    expect(body).toMatchObject({
      ok: true,
      stats: { total: 2500, distinct_roles: 3, avg_confidence_factor: 0.75 },
      roleDist: [{ key: 'builder', count: 2000 }],
      missionDist: [{ mission_id: 2, count: 2500 }],
      profileDist: [{ profile_type: 'focused', count: 2500 }],
      rows: [{ id: 'run-1', primary_role: 'builder' }],
      limit: 50,
      offset: 0,
    })

    const selectUrl = new URL(String(fetchMock.mock.calls[2]?.[0]))
    expect(selectUrl.searchParams.get('primary_role')).toBe('eq.builder')
    expect(selectUrl.searchParams.get('mission_id')).toBe('eq.2')
    expect(selectUrl.searchParams.get('order')).toBe('created_at.desc,id.desc')

    const [rpcUrl, rpcInit] = fetchMock.mock.calls[3] ?? []
    expect(String(rpcUrl)).toBe('https://example.supabase.co/rest/v1/rpc/admin_run_stats')
    expect(JSON.parse(String(rpcInit?.body))).toEqual({ p_role: 'builder', p_mission: 2 })
  })

  it('clamps limit and ignores non-numeric values', async () => {
    const fetchMock = mockAdminSession()
      .mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            total: 0,
            distinct_roles: 0,
            avg_confidence_factor: null,
            role_dist: [],
            mission_dist: [],
            profile_dist: [],
          }),
          { status: 200 },
        ),
      )

    const response = await getResults({
      request: await authedRequest('?limit=5000&offset=abc'),
      env,
    })

    expect(response.status).toBe(200)
    const selectUrl = new URL(String(fetchMock.mock.calls[2]?.[0]))
    expect(selectUrl.searchParams.get('limit')).toBe('1000')
    expect(selectUrl.searchParams.get('offset')).toBe('0')
    const [, rpcInit] = fetchMock.mock.calls[3] ?? []
    expect(JSON.parse(String(rpcInit?.body))).toEqual({ p_role: null, p_mission: null })
  })

  it('rejects a non-numeric mission filter', async () => {
    mockAdminSession()
    const response = await getResults({ request: await authedRequest('?mission=1;drop'), env })
    expect(response.status).toBe(400)
  })
})
