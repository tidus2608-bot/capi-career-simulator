interface Env {
  GOOGLE_CLIENT_ID: string
}

export async function onRequestGet({
  request,
  env,
}: {
  request: Request
  env: Env
}): Promise<Response> {
  const origin = new URL(request.url).origin
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: `${origin}/api/auth/callback`,
    response_type: 'code',
    scope: 'openid email',
    prompt: 'select_account',
  })
  return Response.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, 302)
}
