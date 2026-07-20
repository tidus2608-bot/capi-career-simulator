import { afterEach, describe, expect, it, vi } from 'vitest'
import { createSession } from './_auth.js'
import {
  onRequestDelete as deleteAdminRoute,
  onRequestGet as listAdminsRoute,
  onRequestPost as createAdminRoute,
} from './api/admins.js'

const env = {
  SESSION_SECRET: 'a-very-long-test-secret-32+chars',
  ALLOWED_EMAIL: 'admin@example.com',
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('/api/admins', () => {
  it('rejects unauthenticated list requests', async () => {
    const response = await listAdminsRoute({
      request: new Request('https://site.test/api/admins'),
      env,
    })

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: 'Unauthorized' })
  })

  it('lists normalized admins for an authorized admin', async () => {
    const fetchMock = mockFetch(
      adminRows([{ email: 'admin@example.com' }], 1),
      jsonRows([{ email: 'admin@example.com' }]),
      jsonRows([
        {
          email: 'admin@example.com',
          created_at: '2026-07-15T00:00:00.000Z',
          created_by: null,
        },
      ]),
    )

    const response = await listAdminsRoute({ request: await authedRequest('GET'), env })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      ok: true,
      admins: [
        {
          email: 'admin@example.com',
          created_at: '2026-07-15T00:00:00.000Z',
          created_by: null,
        },
      ],
    })
    expect(String(fetchMock.mock.calls[2]?.[0])).toContain('order=email.asc')
  })

  it('requires same-origin POST requests', async () => {
    const response = await createAdminRoute({
      request: new Request('https://site.test/api/admins', {
        method: 'POST',
        headers: { Origin: 'https://evil.test', 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'new@example.com' }),
      }),
      env,
    })

    expect(response.status).toBe(403)
    await expect(response.json()).resolves.toMatchObject({ error: 'Invalid request origin' })
  })

  it('rejects malformed emails on create', async () => {
    mockFetch(adminRows([{ email: 'admin@example.com' }], 1), jsonRows([{ email: 'admin@example.com' }]))

    const response = await createAdminRoute({
      request: await authedRequest('POST', 'https://site.test/api/admins', { email: 'not-an-email' }),
      env,
    })

    expect(response.status).toBe(400)
    await expect(response.json()).resolves.toMatchObject({ error: 'Invalid email' })
  })

  it('normalizes and creates an admin with the actor email', async () => {
    const fetchMock = mockFetch(
      adminRows([{ email: 'admin@example.com' }], 1),
      jsonRows([{ email: 'admin@example.com' }]),
      jsonRows([]),
      jsonRows([
        {
          email: 'new@example.com',
          created_at: '2026-07-15T00:00:00.000Z',
          created_by: 'admin@example.com',
        },
      ], 201),
    )

    const response = await createAdminRoute({
      request: await authedRequest('POST', 'https://site.test/api/admins', {
        email: ' New@Example.COM ',
      }),
      env,
    })

    expect(response.status).toBe(201)
    await expect(response.json()).resolves.toMatchObject({
      ok: true,
      admin: { email: 'new@example.com', created_by: 'admin@example.com' },
    })
    expect(fetchMock.mock.calls[3]?.[1]?.body).toBe(
      JSON.stringify({ email: 'new@example.com', created_by: 'admin@example.com' }),
    )
  })

  it('returns 409 for duplicate admin creation', async () => {
    mockFetch(
      adminRows([{ email: 'admin@example.com' }], 1),
      jsonRows([{ email: 'admin@example.com' }]),
      jsonRows([{ email: 'new@example.com' }]),
    )

    const response = await createAdminRoute({
      request: await authedRequest('POST', 'https://site.test/api/admins', {
        email: 'new@example.com',
      }),
      env,
    })

    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({ error: 'Admin already exists' })
  })

  it('requires same-origin DELETE requests', async () => {
    const response = await deleteAdminRoute({
      request: new Request('https://site.test/api/admins?email=other@example.com', {
        method: 'DELETE',
        headers: { Origin: 'https://evil.test' },
      }),
      env,
    })

    expect(response.status).toBe(403)
  })

  it('rejects deleting self', async () => {
    mockFetch(adminRows([{ email: 'admin@example.com' }], 1), jsonRows([{ email: 'admin@example.com' }]))

    const response = await deleteAdminRoute({
      request: await authedRequest('DELETE', 'https://site.test/api/admins?email=ADMIN@example.com'),
      env,
    })

    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({
      error: 'You cannot delete your own admin account',
    })
  })

  it('rejects deleting the last admin', async () => {
    const fetchMock = mockFetch(
      adminRows([{ email: 'admin@example.com' }], 1),
      jsonRows([{ email: 'admin@example.com' }]),
      new Response('You cannot delete the last admin', { status: 409 }),
    )

    const response = await deleteAdminRoute({
      request: await authedRequest('DELETE', 'https://site.test/api/admins?email=other@example.com'),
      env,
    })

    expect(fetchMock.mock.calls).toHaveLength(3)
    expect(response.status).toBe(409)
    await expect(response.json()).resolves.toMatchObject({ error: 'You cannot delete the last admin' })
  })

  it('deletes another admin when more than one admin remains', async () => {
    const fetchMock = mockFetch(
      adminRows([{ email: 'admin@example.com' }], 2),
      jsonRows([{ email: 'admin@example.com' }]),
      new Response('null', { status: 200 }),
    )

    const response = await deleteAdminRoute({
      request: await authedRequest('DELETE', 'https://site.test/api/admins?email=other@example.com'),
      env,
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ ok: true })
    expect(String(fetchMock.mock.calls[2]?.[0])).toContain('/rest/v1/rpc/delete_admin')
    expect(fetchMock.mock.calls[2]?.[1]?.method).toBe('POST')
  })
})

async function authedRequest(
  method: string,
  url = 'https://site.test/api/admins',
  body?: unknown,
): Promise<Request> {
  const token = await createSession('admin@example.com', env.SESSION_SECRET)
  const headers = new Headers({ Cookie: `admin_session=${token}` })
  if (method !== 'GET') headers.set('Origin', 'https://site.test')
  if (body != null) headers.set('Content-Type', 'application/json')
  return new Request(url, {
    method,
    headers,
    body: body == null ? undefined : JSON.stringify(body),
  })
}

function mockFetch(...responses: Response[]) {
  const fetchMock = vi.spyOn(globalThis, 'fetch')
  for (const response of responses) fetchMock.mockResolvedValueOnce(response)
  return fetchMock
}

function adminRows(rows: Array<{ email: string }>, total: number): Response {
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'Content-Range': `0-${Math.max(rows.length - 1, 0)}/${total}` },
  })
}

function jsonRows(rows: unknown[], status = 200): Response {
  return new Response(JSON.stringify(rows), { status })
}
