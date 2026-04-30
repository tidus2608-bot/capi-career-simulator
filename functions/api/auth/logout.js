export async function onRequestGet() {
  return new Response(null, {
    status: 302,
    headers: {
      Location:     '/admin',
      'Set-Cookie': 'admin_session=; Path=/; HttpOnly; Secure; Max-Age=0',
    },
  });
}
