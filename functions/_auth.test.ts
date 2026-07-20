import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSession, isAllowed, verifySession } from './_auth.js'
import { onRequestGet as logout } from './api/auth/logout.js'
import { onRequestPost as createAdminSession } from './api/auth/session.js'
import { onRequestGet as status } from './api/auth/status.js'

const { createClientMock, getUserMock } = vi.hoisted(() => ({
  createClientMock: vi.fn(),
  getUserMock: vi.fn(),
}))

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}))

const authEnv = {
  SUPABASE_URL: 'https://supabase.test',
  SUPABASE_ANON_KEY: 'anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
  SESSION_SECRET: 'a-very-long-test-secret-32+chars',
  ALLOWED_EMAIL: 'admin@example.com',
}

beforeEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
  createClientMock.mockReturnValue({ auth: { getUser: getUserMock } })
})

describe('isAllowed', () => {
  it('returns false when no env config is set', () => {
    expect(isAllowed('a@b.com', { SESSION_SECRET: 'x' })).toBe(false)
  })

  it('matches a comma-separated allowed email list (case-insensitive)', () => {
    const env = { SESSION_SECRET: 'x', ALLOWED_EMAIL: 'Alice@example.com, bob@example.com' }
    expect(isAllowed('alice@example.com', env)).toBe(true)
    expect(isAllowed('bob@example.com', env)).toBe(true)
    expect(isAllowed('eve@example.com', env)).toBe(false)
  })

  it('matches an allowed domain suffix', () => {
    const env = { SESSION_SECRET: 'x', ALLOWED_DOMAIN: 'steamforvietnam.org' }
    expect(isAllowed('anyone@steamforvietnam.org', env)).toBe(true)
    expect(isAllowed('anyone@evil.com', env)).toBe(false)
  })

  it('strips a leading @ from ALLOWED_DOMAIN', () => {
    const env = { SESSION_SECRET: 'x', ALLOWED_DOMAIN: '@example.com' }
    expect(isAllowed('user@example.com', env)).toBe(true)
  })

  it('rejects empty/missing email', () => {
    const env = { SESSION_SECRET: 'x', ALLOWED_DOMAIN: 'example.com' }
    expect(isAllowed('', env)).toBe(false)
  })
})

describe('session round-trip', () => {
  it('createSession + verifySession round-trips for an allowed email', async () => {
    const env = {
      SESSION_SECRET: 'a-very-long-test-secret-32+chars',
      ALLOWED_DOMAIN: 'example.com',
      SUPABASE_URL: 'https://supabase.test',
      SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
    }
    mockEmptyAdmins()
    const token = await createSession('user@example.com', env.SESSION_SECRET)
    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${token}` } })
    expect(await verifySession(req, env)).toBe('user@example.com')
  })

  it('rejects a tampered signature', async () => {
    const env = {
      SESSION_SECRET: 'a-very-long-test-secret-32+chars',
      ALLOWED_DOMAIN: 'example.com',
      SUPABASE_URL: 'https://supabase.test',
      SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
    }
    const token = await createSession('user@example.com', env.SESSION_SECRET)
    const tampered = token.slice(0, -2) + 'XX'
    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${tampered}` } })
    expect(await verifySession(req, env)).toBeNull()
  })

  it('rejects a session for an email no longer allowed', async () => {
    const envSign = {
      SESSION_SECRET: 's3cret-test-32-chars-or-more----',
      ALLOWED_DOMAIN: 'old.com',
    }
    const envVerify = {
      SESSION_SECRET: 's3cret-test-32-chars-or-more----',
      ALLOWED_DOMAIN: 'new.com',
      SUPABASE_URL: 'https://supabase.test',
      SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
    }
    mockEmptyAdmins()
    const token = await createSession('user@old.com', envSign.SESSION_SECRET)
    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${token}` } })
    expect(await verifySession(req, envVerify)).toBeNull()
  })

  it('authorizes a signed cookie from database membership', async () => {
    const token = await createSession('db-admin@example.com', authEnv.SESSION_SECRET)
    mockAdminMembership('db-admin@example.com')

    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${token}` } })
    expect(await verifySession(req, authEnv)).toBe('db-admin@example.com')
  })

  it('rejects a signed cookie when the admin was removed from the table', async () => {
    const token = await createSession('removed@example.com', authEnv.SESSION_SECRET)
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(adminRows([{ email: 'other@example.com' }], 1))
      .mockResolvedValueOnce(adminRows([], 0))

    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${token}` } })
    expect(await verifySession(req, authEnv)).toBeNull()
  })

  it('fails closed when the admin lookup errors', async () => {
    const token = await createSession('admin@example.com', authEnv.SESSION_SECRET)
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('boom', { status: 500 }))

    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${token}` } })
    expect(await verifySession(req, authEnv)).toBeNull()
  })

  it('fails closed when database config is missing', async () => {
    const token = await createSession('admin@example.com', authEnv.SESSION_SECRET)
    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${token}` } })

    await expect(verifySession(req, { SESSION_SECRET: authEnv.SESSION_SECRET, ALLOWED_EMAIL: authEnv.ALLOWED_EMAIL })).resolves.toBeNull()
  })
})

describe('admin session bridge routes', () => {
  it('rejects a missing Authorization bearer token without reading a JSON token body', async () => {
    const response = await createAdminSession({
      request: new Request('https://site.test/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: 'browser-token' }),
      }),
      env: authEnv,
    })

    expect(response.status).toBe(401)
    expect(createClientMock).not.toHaveBeenCalled()
    expect(getUserMock).not.toHaveBeenCalled()
    expectAuthFailure(response)
  })

  it('rejects malformed Authorization headers', async () => {
    const malformedHeaders = [
      'browser-token',
      'Basic browser-token',
      'Bearer ',
      'Bearer token extra',
    ]

    for (const authorization of malformedHeaders) {
      const response = await createAdminSession({
        request: new Request('https://site.test/api/auth/session', {
          method: 'POST',
          headers: { Authorization: authorization },
        }),
        env: authEnv,
      })

      expect(response.status).toBe(401)
      expectAuthFailure(response)
    }
    expect(createClientMock).not.toHaveBeenCalled()
    expect(getUserMock).not.toHaveBeenCalled()
  })

  it('rejects an invalid Supabase token', async () => {
    getUserMock.mockResolvedValue({ data: { user: null }, error: new Error('invalid token') })

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })

    expect(response.status).toBe(401)
    expect(createClientMock).toHaveBeenCalledWith(authEnv.SUPABASE_URL, authEnv.SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    })
    expect(getUserMock).toHaveBeenCalledWith('browser-token')
    expectAuthFailure(response)
  })

  it('returns a controlled 401 when Supabase client creation throws', async () => {
    createClientMock.mockImplementation(() => {
      throw new Error('malformed supabase env')
    })

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })

    expect(response.status).toBe(401)
    expect(getUserMock).not.toHaveBeenCalled()
    expectAuthFailure(response)
    await expect(response.json()).resolves.toEqual({
      authenticated: false,
      role: null,
      email: null,
    })
  })

  it('returns a controlled 401 when Supabase user validation rejects', async () => {
    getUserMock.mockRejectedValue(new Error('network failure details'))

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })

    expect(response.status).toBe(401)
    expect(getUserMock).toHaveBeenCalledWith('browser-token')
    expectAuthFailure(response)
    await expect(response.json()).resolves.toEqual({
      authenticated: false,
      role: null,
      email: null,
    })
  })

  it('rejects a validated Supabase user without an email', async () => {
    getUserMock.mockResolvedValue({ data: { user: { id: 'user-id' } }, error: null })

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })

    expect(response.status).toBe(401)
    expect(getUserMock).toHaveBeenCalledWith('browser-token')
    expectAuthFailure(response)
  })

  it('rejects a valid Supabase user outside the admin allowlist', async () => {
    getUserMock.mockResolvedValue({ data: { user: { email: 'person@example.com' } }, error: null })
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(adminRows([{ email: 'admin@example.com' }], 1))
      .mockResolvedValueOnce(adminRows([], 0))

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })

    expect(response.status).toBe(403)
    expect(getUserMock).toHaveBeenCalledWith('browser-token')
    expectAuthFailure(response)
  })

  it('issues an admin session cookie for an allowed Supabase user', async () => {
    getUserMock.mockResolvedValue({ data: { user: { email: 'admin@example.com' } }, error: null })
    mockAdminMembership('admin@example.com', 2)

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })
    const setCookie = response.headers.get('Set-Cookie') ?? ''
    const sessionToken = readSetCookieValue(setCookie, 'admin_session')

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
    expect(response.headers.get('Content-Type')).toContain('application/json')
    await expect(response.json()).resolves.toEqual({
      authenticated: true,
      role: 'admin',
      email: 'admin@example.com',
    })
    expect(sessionToken).not.toBeNull()
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Secure')
    expect(setCookie).toContain('SameSite=Lax')
    const sessionRequest = new Request('https://site.test/', {
      headers: { Cookie: `admin_session=${sessionToken}` },
    })
    expect(await verifySession(sessionRequest, authEnv)).toBe('admin@example.com')
  })

  it('clears stale admin cookies on failed account switches', async () => {
    const staleToken = await createSession('admin@example.com', authEnv.SESSION_SECRET)
    getUserMock.mockResolvedValue({ data: { user: { email: 'person@example.com' } }, error: null })
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(adminRows([{ email: 'admin@example.com' }], 1))
      .mockResolvedValueOnce(adminRows([], 0))

    const response = await createAdminSession({
      request: bearerRequest('browser-token', `admin_session=${staleToken}`),
      env: authEnv,
    })

    expect(response.status).toBe(403)
    expect(response.headers.get('Set-Cookie')).toContain('admin_session=;')
    expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0')
  })

  it('returns an unauthorized role-oriented status response without a session', async () => {
    const response = await status({
      request: new Request('https://site.test/api/auth/status'),
      env: authEnv,
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('Content-Type')).toContain('application/json')
    await expect(response.json()).resolves.toEqual({
      authenticated: false,
      role: null,
      email: null,
    })
  })

  it('returns an authorized admin status response with a valid session', async () => {
    const token = await createSession('admin@example.com', authEnv.SESSION_SECRET)
    mockAdminMembership('admin@example.com')
    const response = await status({
      request: new Request('https://site.test/api/auth/status', {
        headers: { Cookie: `admin_session=${token}` },
      }),
      env: authEnv,
    })

    expect(response.headers.get('Cache-Control')).toBe('no-store')
    expect(response.headers.get('Content-Type')).toContain('application/json')
    await expect(response.json()).resolves.toEqual({
      authenticated: true,
      role: 'admin',
      email: 'admin@example.com',
    })
  })

  it('redirects logout through the main app and clears the session cookie consistently', async () => {
    const response = await logout({
      request: new Request('https://site.test/api/auth/logout'),
    })
    const setCookie = response.headers.get('Set-Cookie') ?? ''

    expect(response.status).toBe(302)
    expect(response.headers.get('Location')).toBe('/?logout=1&returnTo=%2Fadmin.html')
    expect(setCookie).toContain('admin_session=;')
    expect(setCookie).toContain('Path=/')
    expect(setCookie).toContain('HttpOnly')
    expect(setCookie).toContain('Secure')
    expect(setCookie).toContain('SameSite=Lax')
    expect(setCookie).toContain('Max-Age=0')
  })

  it('uses a safe relative logout return target and rejects external redirects', async () => {
    const homeResponse = await logout({
      request: new Request('https://site.test/api/auth/logout?returnTo=%2F'),
    })
    const unsafeResponse = await logout({
      request: new Request('https://site.test/api/auth/logout?returnTo=%2F%2Fevil.example'),
    })

    expect(homeResponse.headers.get('Location')).toBe('/?logout=1&returnTo=%2F')
    expect(unsafeResponse.headers.get('Location')).toBe('/?logout=1&returnTo=%2Fadmin.html')
  })

  it('uses the env allowlist only while the admins table is empty during session creation', async () => {
    getUserMock.mockResolvedValue({ data: { user: { email: 'admin@example.com' } }, error: null })
    mockEmptyAdmins()

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toMatchObject({
      authenticated: true,
      role: 'admin',
      email: 'admin@example.com',
    })
  })

  it('stops using the env allowlist after any admin row exists', async () => {
    getUserMock.mockResolvedValue({ data: { user: { email: 'admin@example.com' } }, error: null })
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(adminRows([{ email: 'other@example.com' }], 1))
      .mockResolvedValueOnce(adminRows([], 0))

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })

    expect(response.status).toBe(403)
    expectAuthFailure(response)
  })

  it('fails closed when session bridge admin lookup fails', async () => {
    getUserMock.mockResolvedValue({ data: { user: { email: 'admin@example.com' } }, error: null })
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('boom', { status: 500 }))

    const response = await createAdminSession({
      request: bearerRequest('browser-token'),
      env: authEnv,
    })

    expect(response.status).toBe(403)
    expectAuthFailure(response)
  })
})

function bearerRequest(token: string, cookie?: string): Request {
  const headers = new Headers({ Authorization: `Bearer ${token}` })
  if (cookie) headers.set('Cookie', cookie)
  return new Request('https://site.test/api/auth/session', { method: 'POST', headers })
}

function expectAuthFailure(response: Response): void {
  expect(response.headers.get('Set-Cookie')).toContain('admin_session=;')
  expect(response.headers.get('Set-Cookie')).toContain('Max-Age=0')
  expect(response.headers.get('Cache-Control')).toBe('no-store')
  expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff')
}

function readSetCookieValue(setCookie: string, name: string): string | null {
  const match = setCookie.match(new RegExp(`${name}=([^;,]+)`))
  return match?.[1] ?? null
}

function adminRows(rows: Array<{ email: string }>, total: number): Response {
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'Content-Range': `0-${Math.max(rows.length - 1, 0)}/${total}` },
  })
}

function mockEmptyAdmins(): void {
  vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(adminRows([], 0))
}

function mockAdminMembership(email: string, times = 1): void {
  const fetchMock = vi.spyOn(globalThis, 'fetch')
  for (let i = 0; i < times; i += 1) {
    fetchMock
      .mockResolvedValueOnce(adminRows([{ email }], 1))
      .mockResolvedValueOnce(new Response(JSON.stringify([{ email }]), { status: 200 }))
  }
}
