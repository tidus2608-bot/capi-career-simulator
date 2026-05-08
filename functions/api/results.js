import { verifySession } from '../_auth.js';
import { supabaseRest } from '../_supabase.js';

/**
 * GET /api/results
 *
 * Auth: signed admin session cookie (Google OAuth via /api/auth/login).
 * Reads from the Supabase `runs` table via service-role key (bypasses RLS).
 *
 * Query params: limit (default 50, max 1000), offset, role, mission
 *
 * Response shape (admin.html depends on this):
 *   {
 *     ok: true,
 *     stats: { total, distinct_roles, avg_confidence_factor },
 *     roleDist:    [{ key, count }],          // primary_role
 *     missionDist: [{ mission_id, count }],
 *     profileDist: [{ profile_type, count }], // Hidden | Aligned | Emerging
 *     rows: [...],
 *     limit, offset,
 *   }
 */
export async function onRequestGet(ctx) {
  const { request, env } = ctx;

  const cors = corsHeaders(request);

  const email = await verifySession(request, env);
  if (!email) {
    return json({ ok: false, error: 'Unauthorized' }, 401, cors);
  }

  const url     = new URL(request.url);
  const limit   = Math.min(parseInt(url.searchParams.get('limit')  || '50',  10), 1000);
  const offset  = Math.max(parseInt(url.searchParams.get('offset') || '0',   10), 0);
  const role    = url.searchParams.get('role');
  const mission = url.searchParams.get('mission');

  try {
    const sb = supabaseRest(env);

    // Filter clause for PostgREST
    const filterParts = [];
    if (role)    filterParts.push(`primary_role=eq.${encodeURIComponent(role)}`);
    if (mission) filterParts.push(`mission_id=eq.${encodeURIComponent(mission)}`);
    const filter = filterParts.join('&');

    // Page of rows + total count
    const { rows, total } = await sb.select('runs', {
      select: 'id,created_at,display_name,theme,mission_id,primary_role,secondary_role,profile_type,confidence_factor,scores',
      filter,
      order: 'created_at.desc',
      limit,
      offset,
      count: 'exact',
    });

    // Aggregates — fetch lightweight projection of all matching rows once.
    // For the data sizes we expect (hundreds-thousands), this is fine.
    const { rows: allRows } = await sb.select('runs', {
      select: 'primary_role,mission_id,profile_type,confidence_factor',
      filter,
      limit: 10000,
    });

    const stats = {
      total: total ?? allRows.length,
      distinct_roles: new Set(allRows.map(r => r.primary_role).filter(Boolean)).size,
      avg_confidence_factor: avg(allRows.map(r => r.confidence_factor).filter(n => n != null)),
    };

    const roleDist    = countBy(allRows, 'primary_role').map(([key, count]) => ({ key, count }));
    const missionDist = countBy(allRows, 'mission_id').map(([key, count]) => ({ mission_id: key, count }));
    const profileDist = countBy(allRows, 'profile_type').map(([key, count]) => ({ profile_type: key, count }));

    return json(
      { ok: true, stats, roleDist, missionDist, profileDist, rows, limit, offset },
      200,
      cors,
    );
  } catch (err) {
    console.error('results error', err);
    return json({ ok: false, error: 'Internal error' }, 500, cors);
  }
}

export async function onRequestOptions(ctx) {
  return new Response(null, {
    headers: {
      ...corsHeaders(ctx.request),
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// ─── helpers ──────────────────────────────────────────────────────────────
function corsHeaders(request) {
  // Same-origin admin only — the request comes from /admin.html on the
  // same Pages domain, so we can echo the request's Origin if present.
  const origin = request.headers.get('Origin') || '';
  return {
    'Access-Control-Allow-Origin': origin,
    'Vary': 'Origin',
  };
}

function json(body, status, extraHeaders = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

function countBy(rows, key) {
  const map = new Map();
  for (const r of rows) {
    const v = r[key];
    if (v == null || v === '') continue;
    map.set(v, (map.get(v) || 0) + 1);
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1]);
}

function avg(arr) {
  if (!arr.length) return null;
  return arr.reduce((a, b) => a + Number(b), 0) / arr.length;
}
