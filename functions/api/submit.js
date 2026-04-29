/**
 * POST /api/submit
 * Saves a completed survey result to Cloudflare D1.
 *
 * Expected JSON body:
 * {
 *   finalRole:  string,   // "Explorer" | "Builder" | "Operator" | "Connector" | "Communicator"
 *   missionId:  string,   // "m1" … "m6"
 *   p1Scores:   object,   // { E, B, O, C, Cm }
 *   p2Scores:   object,
 *   p3Scores:   object,
 *   confidence: number,   // 1–5
 *   shareHash:  string    // btoa-encoded share token
 * }
 */
export async function onRequestPost(ctx) {
  const { request, env } = ctx;

  // CORS pre-flight + headers
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const body = await request.json();
    const {
      finalRole, missionId,
      p1Scores, p2Scores, p3Scores,
      confidence, shareHash,
    } = body;

    if (!finalRole || !missionId) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing required fields' }),
        { status: 400, headers: cors },
      );
    }

    const userAgent = request.headers.get('user-agent') || null;

    await env.DB.prepare(`
      INSERT INTO results
        (final_role, mission_id, p1_scores, p2_scores, p3_scores, confidence, user_agent, share_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      finalRole,
      missionId,
      JSON.stringify(p1Scores || {}),
      JSON.stringify(p2Scores || {}),
      JSON.stringify(p3Scores || {}),
      confidence ?? null,
      userAgent,
      shareHash ?? null,
    ).run();

    return new Response(JSON.stringify({ ok: true }), { status: 201, headers: cors });

  } catch (err) {
    console.error('submit error', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'Internal error' }),
      { status: 500, headers: cors },
    );
  }
}

// Allow pre-flight OPTIONS
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
