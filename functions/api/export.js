import { verifySession } from '../_auth.js';
import { supabaseRest } from '../_supabase.js';

/**
 * GET /api/export
 *
 * Auth: signed admin session cookie.
 * Streams a CSV of all `runs` rows (Supabase via service-role).
 */
export async function onRequestGet(ctx) {
  const { request, env } = ctx;

  const email = await verifySession(request, env);
  if (!email) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const sb = supabaseRest(env);

    // Pull everything in pages of 1000.
    const all = [];
    const PAGE = 1000;
    for (let offset = 0; ; offset += PAGE) {
      const { rows } = await sb.select('runs', {
        select: 'id,created_at,display_name,theme,mission_id,primary_role,secondary_role,profile_type,confidence_factor,scores',
        order: 'created_at.desc',
        limit: PAGE,
        offset,
      });
      all.push(...rows);
      if (rows.length < PAGE) break;
      if (all.length >= 50000) break; // hard cap
    }

    const ROLES = ['explorer', 'builder', 'operator', 'connector', 'communicator'];
    const header = [
      'id', 'created_at', 'display_name', 'theme', 'mission_id',
      'primary_role', 'secondary_role', 'profile_type', 'confidence_factor',
      ...ROLES.map(r => `final_${r}`),
      ...ROLES.map(r => `phase1_${r}`),
      ...ROLES.map(r => `phase2_${r}`),
      ...ROLES.map(r => `phase3_${r}`),
    ].join(',');

    const lines = all.map(row => {
      const s = row.scores || {};
      const final  = s.final  || {};
      const phase1 = s.phase1 || {};
      const phase2 = s.phase2 || {};
      const phase3 = s.phase3 || {};
      return [
        row.id,
        row.created_at,
        csvEsc(row.display_name),
        csvEsc(row.theme),
        row.mission_id ?? '',
        csvEsc(row.primary_role),
        csvEsc(row.secondary_role),
        csvEsc(row.profile_type),
        row.confidence_factor ?? '',
        ...ROLES.map(r => round1(final[r])),
        ...ROLES.map(r => round1(phase1[r])),
        ...ROLES.map(r => round1(phase2[r])),
        ...ROLES.map(r => round1(phase3[r])),
      ].join(',');
    });

    const csv = [header, ...lines].join('\r\n');
    const filename = `capi-runs-${new Date().toISOString().slice(0, 10)}.csv`;

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    console.error('export error', err);
    return new Response('Internal error', { status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: { 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  });
}

function csvEsc(val) {
  if (val == null) return '';
  const s = String(val);
  return s.includes(',') || s.includes('"') || s.includes('\n')
    ? `"${s.replace(/"/g, '""')}"` : s;
}

function round1(n) {
  if (n == null) return '';
  return Math.round(Number(n) * 10) / 10;
}
