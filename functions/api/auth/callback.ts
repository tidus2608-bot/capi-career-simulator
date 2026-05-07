import { createSession, isAllowed, sessionCookie } from '../../_auth.js'

interface Env {
  GOOGLE_CLIENT_ID: string
  GOOGLE_CLIENT_SECRET: string
  SESSION_SECRET: string
  ALLOWED_EMAIL?: string
  ALLOWED_DOMAIN?: string
}

interface GoogleTokenResponse {
  id_token?: string
  error?: string
  error_description?: string
}

export async function onRequestGet({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 })
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${url.origin}/api/auth/callback`,
      grant_type: 'authorization_code',
    }),
  })
  const tokens = (await tokenRes.json()) as GoogleTokenResponse

  if (!tokens.id_token) {
    return new Response('OAuth error: ' + JSON.stringify(tokens), { status: 400 })
  }

  let email: string | undefined
  try {
    const parts = tokens.id_token.split('.')
    if (parts.length < 2 || !parts[1]) throw new Error('malformed jwt')
    const payload = JSON.parse(atob(parts[1])) as { email?: string }
    email = payload.email
  } catch {
    return new Response('Bad id_token', { status: 400 })
  }

  if (!email || !isAllowed(email, env)) {
    const safeEmail = (email ?? '').replace(/[<>&"']/g, '')
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;background:#050617;color:#e8eaff">
        <h2 style="color:#ff4455">Access Denied</h2>
        <p>The account <strong>${safeEmail}</strong> is not authorised to access this portal.</p>
        <p><a href="/api/auth/login" style="color:#00d4ff">Try a different account →</a></p>
      </body></html>`,
      { status: 403, headers: { 'Content-Type': 'text/html' } },
    )
  }

  const token = await createSession(email, env.SESSION_SECRET)
  const cookie = sessionCookie(token)

  return new Response(null, {
    status: 302,
    headers: { Location: '/admin', 'Set-Cookie': cookie },
  })
}
