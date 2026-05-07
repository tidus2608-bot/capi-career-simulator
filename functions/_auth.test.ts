import { describe, it, expect } from 'vitest'
import { isAllowed, createSession, verifySession } from './_auth.js'

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
  // Web Crypto APIs are available in Node 20+ (Vitest runs Node).
  it('createSession + verifySession round-trips for an allowed email', async () => {
    const env = {
      SESSION_SECRET: 'a-very-long-test-secret-32+chars',
      ALLOWED_DOMAIN: 'example.com',
    }
    const token = await createSession('user@example.com', env.SESSION_SECRET)
    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${token}` } })
    expect(await verifySession(req, env)).toBe('user@example.com')
  })

  it('rejects a tampered signature', async () => {
    const env = {
      SESSION_SECRET: 'a-very-long-test-secret-32+chars',
      ALLOWED_DOMAIN: 'example.com',
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
    }
    const token = await createSession('user@old.com', envSign.SESSION_SECRET)
    const req = new Request('https://x.test/', { headers: { Cookie: `admin_session=${token}` } })
    expect(await verifySession(req, envVerify)).toBeNull()
  })
})
