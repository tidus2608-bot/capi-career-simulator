function isValidReturn(path: string | null): path is string {
  if (!path || !path.startsWith('/') || path.startsWith('//') || path.includes('\\')) return false

  for (let i = 0; i < path.length; i++) {
    const code = path.charCodeAt(i)
    if (code < 32 || code === 127) return false
  }

  return true
}

export async function onRequestGet({ request }: { request: Request }): Promise<Response> {
  const requestedReturn = new URL(request.url).searchParams.get('returnTo')
  const returnTo = isValidReturn(requestedReturn) ? requestedReturn : '/admin.html'

  return new Response(null, {
    status: 302,
    headers: {
      Location: `/?logout=1&returnTo=${encodeURIComponent(returnTo)}`,
      'Set-Cookie': 'admin_session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  })
}
