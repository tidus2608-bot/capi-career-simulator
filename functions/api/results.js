/**
 * GET /api/results
 * Returns all survey results for the admin portal.
 * Protected by a simple admin key passed as ?key=<ADMIN_KEY>.
 *
 * Set the secret via:
 *   wrangler pages secret put ADMIN_KEY
 *
 * Query params:
 *   key      – required, must match ADMIN_KEY env var
 *   limit    – optional, default 200
 *   offset   – optional, default 0
 *   role     – optional filter by final_role
 *   mission  – optional filter by mission_id
 */
export async function onRequestGet(ctx) {
  const { request, env } = ctx;

  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  // Auth check
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response(
      JSON.stringify({ ok: false, error: 'Unauthorized' }),
      { status: 401, headers: cors },
    );
  }

  const limit  = Math.min(parseInt(url.searchParams.get('limit')  || '200', 10), 1000);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);
  const role   = url.searchParams.get('role');
  const mission = url.searchParams.get('mission');

  try {
    // Build WHERE clause
    const conditions = [];
    const bindings   = [];
    if (role)    { conditions.push('final_role = ?');  bindings.push(role); }
    if (mission) { conditions.push('mission_id = ?');  bindings.push(mission); }
    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    // Rows
    const rows = await env.DB.prepare(`
      SELECT id, created_at, final_role, mission_id,
             p1_scores, p2_scores, p3_scores,
             confidence, share_hash
      FROM results
      ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).bind(...bindings, limit, offset).all();

    // Summary stats
    const stats = await env.DB.prepare(`
      SELECT
        COUNT(*) AS total,
        COUNT(DISTINCT final_role) AS distinct_roles,
        AVG(confidence) AS avg_confidence
      FROM results
      ${where}
    `).bind(...bindings).first();

    // Role distribution
    const roleDist = await env.DB.prepare(`
      SELECT final_role, COUNT(*) AS count
      FROM results
      ${where}
      GROUP BY final_role
      ORDER BY count DESC
    `).bind(...bindings).all();

    // Mission distribution
    const missionDist = await env.DB.prepare(`
      SELECT mission_id, COUNT(*) AS count
      FROM results
      ${where}
      GROUP BY mission_id
      ORDER BY count DESC
    `).bind(...bindings).all();

    return new Response(
      JSON.stringify({
        ok: true,
        stats,
        roleDist: roleDist.results,
        missionDist: missionDist.results,
        rows: rows.results,
        limit,
        offset,
      }),
      { headers: cors },
    );

  } catch (err) {
    console.error('results error', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal error' }),
      { status: 500, headers: cors },
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
