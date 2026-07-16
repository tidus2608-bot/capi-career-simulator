/**
 * Shared session helpers for admin auth.
 * Uses HMAC-SHA256 signed cookies, with Supabase validating browser tokens.
 *
 * Required Cloudflare Pages secrets:
 *   SESSION_SECRET       - random string >= 32 chars for signing cookies
 *
 * Bootstrap-only admin allowlist, used only while public.admins is empty:
 *   ALLOWED_EMAIL  - comma-separated list of allowed email addresses
 *   ALLOWED_DOMAIN - domain suffix; any *@<domain> is granted access
 */

import { authorizeAdminEmail } from './_admins.js'

interface AuthEnv {
  SESSION_SECRET: string
  ALLOWED_EMAIL?: string
  ALLOWED_DOMAIN?: string
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

/** Returns true if `email` is authorised for admin access. */
export function isAllowed(email: string, env: AuthEnv): boolean {
  if (!email) return false
  if (env.ALLOWED_DOMAIN) {
    const domain = env.ALLOWED_DOMAIN.trim().toLowerCase().replace(/^@/, '')
    if (email.toLowerCase().endsWith('@' + domain)) return true
  }
  if (env.ALLOWED_EMAIL) {
    const allowed = env.ALLOWED_EMAIL.split(',').map((e) => e.trim().toLowerCase())
    if (allowed.includes(email.toLowerCase())) return true
  }
  return false
}

async function hmacSign(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

export async function createSession(email: string, secret: string): Promise<string> {
  const payload = btoa(JSON.stringify({ email, ts: Date.now() }))
  const sig = await hmacSign(payload, secret)
  return `${payload}.${sig}`
}

export async function verifySession(request: Request, env: AuthEnv): Promise<string | null> {
  const token = getCookie(request, 'admin_session')
  if (!token) return null

  try {
    const parts = token.split('.')
    if (parts.length !== 2) return null
    const [payload, sig] = parts
    if (!payload || !sig) return null
    const expectedSig = await hmacSign(payload, env.SESSION_SECRET)
    if (sig !== expectedSig) return null

    const { email, ts } = JSON.parse(atob(payload)) as { email?: string; ts?: number }
    if (!email || !ts) return null
    if (Date.now() - ts > 86_400_000) return null // 24h expiry
    if (!(await authorizeAdminEmail(email, env, (candidate) => isAllowed(candidate, env)))) return null
    return email
  } catch {
    return null
  }
}

export function sessionCookie(token: string, maxAge = 86400): string {
  return `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`
}

export function getCookie(request: Request, name: string): string | null {
  const cookie = request.headers.get('Cookie') || ''
  const prefix = `${name}=`
  const value = cookie
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix))

  return value ? value.slice(prefix.length) : null
}

export function clearCookie(name: string): string {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`
}
