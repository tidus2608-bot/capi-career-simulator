import { createSession, sessionCookie } from '../../_auth.js';

export async function onRequestGet({ request, env }) {
  const url  = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Missing OAuth code', { status: 400 });
  }

  // Exchange authorisation code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      redirect_uri:  `${url.origin}/api/auth/callback`,
      grant_type:    'authorization_code',
    }),
  });
  const tokens = await tokenRes.json();

  if (!tokens.id_token) {
    return new Response('OAuth error: ' + JSON.stringify(tokens), { status: 400 });
  }

  // Decode the JWT payload (HTTPS from Google = trusted; skip local sig verify)
  let email;
  try {
    const payload = JSON.parse(atob(tokens.id_token.split('.')[1]));
    email = payload.email;
  } catch {
    return new Response('Bad id_token', { status: 400 });
  }

  if (email !== env.ALLOWED_EMAIL) {
    return new Response(
      `<html><body style="font-family:sans-serif;padding:40px;background:#050617;color:#e8eaff">
        <h2 style="color:#ff4455">Access Denied</h2>
        <p>The account <strong>${email}</strong> is not authorised to access this portal.</p>
        <p><a href="/api/auth/login" style="color:#00d4ff">Try a different account →</a></p>
      </body></html>`,
      { status: 403, headers: { 'Content-Type': 'text/html' } }
    );
  }

  const token  = await createSession(email, env.SESSION_SECRET);
  const cookie = sessionCookie(token);

  return new Response(null, {
    status: 302,
    headers: { Location: '/admin', 'Set-Cookie': cookie },
  });
}
