import { createClient } from '@supabase/supabase-js'
import { clearCookie, createSession, isAllowed, sessionCookie } from '../../_auth.js'

interface Env {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SESSION_SECRET: string
  ALLOWED_EMAIL?: string
  ALLOWED_DOMAIN?: string
}

const adminSessionCookieName = 'admin_session'

export async function onRequestPost({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const accessToken = bearerToken(request)
  if (!accessToken) {
    return authFailure(401)
  }

  let userResult: Awaited<ReturnType<ReturnType<typeof createSupabaseClient>['auth']['getUser']>>
  try {
    userResult = await createSupabaseClient(env).auth.getUser(accessToken)
  } catch {
    return authFailure(401)
  }

  const { data, error } = userResult
  if (error || !data.user?.email) {
    return authFailure(401)
  }

  const email = data.user.email
  if (!isAllowed(email, env)) {
    return authFailure(403)
  }

  const token = await createSession(email, env.SESSION_SECRET)
  const headers = jsonHeaders()
  headers.append('Set-Cookie', sessionCookie(token))

  return Response.json({ authenticated: true, role: 'admin', email }, { headers })
}

function bearerToken(request: Request): string | null {
  const authorization = request.headers.get('Authorization')
  const match = authorization?.match(/^Bearer ([^\s]+)$/)
  return match?.[1] ?? null
}

function createSupabaseClient(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}

function authFailure(status: 401 | 403): Response {
  const headers = jsonHeaders()
  headers.append('Set-Cookie', clearCookie(adminSessionCookieName))
  return Response.json({ authenticated: false, role: null, email: null }, { status, headers })
}

function jsonHeaders(): Headers {
  return new Headers({
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
  })
}
