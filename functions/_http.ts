/**
 * Shared HTTP helpers for the admin Cloudflare Functions.
 */

/** JSON response that is never cached (admin data is per-session). */
export function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

/**
 * Parses an integer query parameter, falling back to `fallback` when it is
 * missing or not a number, and clamping the result to [min, max].
 */
export function intParam(raw: string | null, fallback: number, min: number, max: number): number {
  const n = raw == null ? NaN : Number.parseInt(raw, 10)
  if (!Number.isFinite(n)) return fallback
  return Math.min(Math.max(n, min), max)
}
