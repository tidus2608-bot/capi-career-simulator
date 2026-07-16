import {
  AdminConflictError,
  AdminInputError,
  AdminNotFoundError,
  createAdmin,
  deleteAdmin,
  listAdmins,
} from '../_admins.js'
import { verifySession } from '../_auth.js'

interface Env {
  SESSION_SECRET: string
  ALLOWED_EMAIL?: string
  ALLOWED_DOMAIN?: string
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

export async function onRequestGet({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const actorEmail = await verifySession(request, env)
  if (!actorEmail) return json({ ok: false, error: 'Unauthorized' }, 401)

  try {
    const admins = await listAdmins(env)
    return json({ ok: true, admins })
  } catch (error) {
    return serverError(error)
  }
}

export async function onRequestPost({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const originError = validateMutationOrigin(request)
  if (originError) return originError

  const actorEmail = await verifySession(request, env)
  if (!actorEmail) return json({ ok: false, error: 'Unauthorized' }, 401)

  let body: { email?: unknown }
  try {
    body = (await request.json()) as { email?: unknown }
  } catch {
    return json({ ok: false, error: 'Invalid JSON body' }, 400)
  }

  if (typeof body.email !== 'string') {
    return json({ ok: false, error: 'Email is required' }, 400)
  }

  try {
    const admin = await createAdmin(body.email, actorEmail, env)
    return json({ ok: true, admin }, 201)
  } catch (error) {
    return adminError(error)
  }
}

export async function onRequestDelete({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const originError = validateMutationOrigin(request)
  if (originError) return originError

  const actorEmail = await verifySession(request, env)
  if (!actorEmail) return json({ ok: false, error: 'Unauthorized' }, 401)

  const url = new URL(request.url)
  const email = url.searchParams.get('email')
  if (!email) return json({ ok: false, error: 'Email is required' }, 400)

  try {
    await deleteAdmin(email, actorEmail, env)
    return json({ ok: true })
  } catch (error) {
    return adminError(error)
  }
}

export async function onRequestOptions({ request }: { request: Request }): Promise<Response> {
  const url = new URL(request.url)
  const origin = request.headers.get('Origin')
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (origin === url.origin) headers['Access-Control-Allow-Origin'] = origin
  return new Response(null, { headers })
}

function validateMutationOrigin(request: Request): Response | null {
  const origin = request.headers.get('Origin')
  const requestOrigin = new URL(request.url).origin
  if (origin !== requestOrigin) {
    return json({ ok: false, error: 'Invalid request origin' }, 403)
  }
  return null
}

function adminError(error: unknown): Response {
  if (error instanceof AdminInputError) return json({ ok: false, error: error.message }, 400)
  if (error instanceof AdminConflictError) return json({ ok: false, error: error.message }, 409)
  if (error instanceof AdminNotFoundError) return json({ ok: false, error: error.message }, 404)
  return serverError(error)
}

function serverError(error: unknown): Response {
  console.error('admins error', error)
  const message = error instanceof Error ? error.message : String(error)
  return json({ ok: false, error: 'Internal error', detail: message }, 500)
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
