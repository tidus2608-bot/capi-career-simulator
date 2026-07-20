import { supabaseRest } from './_supabase.js'

export interface AdminEnv {
  SUPABASE_URL?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  ALLOWED_EMAIL?: string
  ALLOWED_DOMAIN?: string
}

export interface AdminRow {
  email: string
  created_at: string
  created_by: string | null
}

export type BootstrapAllow = (email: string) => boolean

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeAdminEmail(email: string): string | null {
  const normalized = email.trim().toLowerCase()
  return EMAIL_RE.test(normalized) ? normalized : null
}

export async function authorizeAdminEmail(
  email: string,
  env: AdminEnv,
  bootstrapAllow: BootstrapAllow,
): Promise<boolean> {
  const normalized = normalizeAdminEmail(email)
  if (!normalized) return false

  try {
    const totalAdmins = await countAdmins(env)
    if (totalAdmins === 0) return bootstrapAllow(normalized)
    return Boolean(await getAdmin(normalized, env))
  } catch {
    return false
  }
}

export async function listAdmins(env: AdminEnv): Promise<AdminRow[]> {
  const { rows } = await supabaseRest(env).select<AdminRow>('admins', {
    select: 'email,created_at,created_by',
    order: 'email.asc',
  })
  return rows
}

export async function getAdmin(email: string, env: AdminEnv): Promise<AdminRow | null> {
  const normalized = normalizeAdminEmail(email)
  if (!normalized) return null

  const { rows } = await supabaseRest(env).select<AdminRow>('admins', {
    select: 'email,created_at,created_by',
    filter: `email=eq.${encodeURIComponent(normalized)}`,
    limit: 1,
  })
  return rows[0] ?? null
}

export async function createAdmin(email: string, actorEmail: string, env: AdminEnv): Promise<AdminRow> {
  const normalized = normalizeAdminEmail(email)
  if (!normalized) throw new AdminInputError('Invalid email')

  const existing = await getAdmin(normalized, env)
  if (existing) throw new AdminConflictError('Admin already exists')

  try {
    const { rows } = await supabaseRest(env).insert<AdminRow>('admins', {
      email: normalized,
      created_by: normalizeAdminEmail(actorEmail) ?? actorEmail.trim().toLowerCase(),
    })
    const created = rows[0]
    if (!created) throw new Error('Supabase insert returned no admin row')
    return created
  } catch (error) {
    if (error instanceof Error && /Supabase 409|duplicate key/i.test(error.message)) {
      throw new AdminConflictError('Admin already exists')
    }
    throw error
  }
}

export async function deleteAdmin(email: string, actorEmail: string, env: AdminEnv): Promise<void> {
  const normalized = normalizeAdminEmail(email)
  if (!normalized) throw new AdminInputError('Invalid email')

  const actor = normalizeAdminEmail(actorEmail)
  if (actor && normalized === actor) throw new AdminConflictError('You cannot delete your own admin account')

  try {
    await supabaseRest(env).rpc('delete_admin', {
      target_email: normalized,
      actor_email: actor,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (/own admin account/i.test(message)) {
      throw new AdminConflictError('You cannot delete your own admin account')
    }
    if (/last admin/i.test(message)) {
      throw new AdminConflictError('You cannot delete the last admin')
    }
    if (/admin not found/i.test(message)) throw new AdminNotFoundError('Admin not found')
    throw error
  }
}

export async function countAdmins(env: AdminEnv): Promise<number> {
  const { rows, total } = await supabaseRest(env).select<{ email: string }>('admins', {
    select: 'email',
    limit: 1,
    count: 'exact',
  })
  return total ?? rows.length
}

export class AdminInputError extends Error {}
export class AdminConflictError extends Error {}
export class AdminNotFoundError extends Error {}
