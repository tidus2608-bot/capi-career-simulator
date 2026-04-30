/**
 * Shared session helpers for Google OAuth admin auth.
 * Uses HMAC-SHA256 signed cookies — no external JWT library needed.
 *
 * Required Cloudflare Pages secrets:
 *   GOOGLE_CLIENT_ID     – OAuth 2.0 client ID
 *   GOOGLE_CLIENT_SECRET – OAuth 2.0 client secret
 *   SESSION_SECRET       – random string ≥ 32 chars for signing cookies
 *   ALLOWED_EMAIL        – the one Google account allowed admin access
 */

async function hmacSign(data, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function createSession(email, secret) {
  const payload = btoa(JSON.stringify({ email, ts: Date.now() }));
  const sig     = await hmacSign(payload, secret);
  return `${payload}.${sig}`;
}

export async function verifySession(request, env) {
  const cookie = request.headers.get('Cookie') || '';
  const match  = cookie.match(/admin_session=([^;]+)/);
  if (!match) return null;

  try {
    const [payload, sig] = match[1].split('.');
    const expectedSig    = await hmacSign(payload, env.SESSION_SECRET);
    if (sig !== expectedSig) return null;

    const { email, ts } = JSON.parse(atob(payload));
    if (Date.now() - ts > 86_400_000) return null; // 24 h expiry
    if (email !== env.ALLOWED_EMAIL)   return null;
    return email;
  } catch {
    return null;
  }
}

export function sessionCookie(token, maxAge = 86400) {
  return `admin_session=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
