/**
 * GET /api/export
 * Returns all results as a downloadable CSV file.
 * Protected by the same ?key=<ADMIN_KEY> as /api/results.
 */
export async function onRequestGet(ctx) {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const key = url.searchParams.get('key');

  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const rows = await env.DB.prepare(`
      SELECT id, created_at, final_role, mission_id,
             p1_scores, p2_scores, p3_scores,
             confidence, share_hash
      FROM results
      ORDER BY created_at DESC
    `).all();

    const ROLES = ['E', 'B', 'O', 'C', 'Cm'];

    // CSV header
    const header = [
      'id', 'created_at', 'final_role', 'mission_id', 'confidence',
      'p1_E','p1_B','p1_O','p1_C','p1_Cm',
      'p2_E','p2_B','p2_O','p2_C','p2_Cm',
      'p3_E','p3_B','p3_O','p3_C','p3_Cm',
      'share_hash',
    ].join(',');

    const lines = (rows.results || []).map(row => {
      const p1 = safeJson(row.p1_scores);
      const p2 = safeJson(row.p2_scores);
      const p3 = safeJson(row.p3_scores);
      return [
        row.id,
        row.created_at,
        csvEsc(row.final_role),
        csvEsc(row.mission_id),
        row.confidence ?? '',
        ...ROLES.map(r => p1[r] ?? 0),
        ...ROLES.map(r => p2[r] ?? 0),
        ...ROLES.map(r => p3[r] ?? 0),
        csvEsc(row.share_hash || ''),
      ].join(',');
    });

    const csv = [header, ...lines].join('\r\n');
    const filename = `capi-results-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.error('export error', err);
    return new Response('Internal error', { status: 500 });
  }
}

function safeJson(str) {
  try { return JSON.parse(str || '{}'); } catch { return {}; }
}

function csvEsc(val) {
  if (val == null) return '';
  const s = String(val);
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
