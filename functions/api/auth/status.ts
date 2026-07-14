import { verifySession } from '../../_auth.js'

interface Env {
  SESSION_SECRET: string
  ALLOWED_EMAIL?: string
  ALLOWED_DOMAIN?: string
}

export async function onRequestGet({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const email = await verifySession(request, env)

  return Response.json(
    {
      authenticated: Boolean(email),
      role: email ? 'admin' : null,
      email,
    },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}
