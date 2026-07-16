import { describe, it, expect, vi, afterEach } from 'vitest'
import { supabaseRest } from './_supabase.js'

const env = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY: 'sr-key-test',
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('supabaseRest', () => {
  it('throws when env is missing', () => {
    expect(() => supabaseRest({})).toThrow(/Missing SUPABASE_URL/)
  })

  it('builds a select request with auth headers and params', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify([{ id: '1' }]), {
        status: 200,
        headers: { 'Content-Range': '0-0/1' },
      }),
    )
    const sb = supabaseRest(env)
    const { rows, total } = await sb.select<{ id: string }>('runs', {
      select: 'id',
      order: 'created_at.desc',
      limit: 10,
      count: 'exact',
    })
    expect(rows).toEqual([{ id: '1' }])
    expect(total).toBe(1)

    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe(
      'https://example.supabase.co/rest/v1/runs?select=id&order=created_at.desc&limit=10',
    )
    const headers = (init as RequestInit).headers as Record<string, string>
    expect(headers.apikey).toBe('sr-key-test')
    expect(headers.Authorization).toBe('Bearer sr-key-test')
    expect(headers.Prefer).toBe('count=exact')
  })

  it('throws on non-2xx response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('boom', { status: 500 }))
    const sb = supabaseRest(env)
    await expect(sb.select('runs')).rejects.toThrow(/Supabase 500/)
  })

  it('passes raw filter string through', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('[]', { status: 200 }))
    const sb = supabaseRest(env)
    await sb.select('runs', { filter: 'primary_role=eq.builder' })
    const [url] = fetchMock.mock.calls[0]!
    expect(String(url)).toContain('&primary_role=eq.builder')
  })

  it('inserts a row and requests the created representation', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify([{ email: 'admin@example.com' }]), { status: 201 }),
    )
    const sb = supabaseRest(env)
    const { rows } = await sb.insert('admins', { email: 'admin@example.com' })

    expect(rows).toEqual([{ email: 'admin@example.com' }])
    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe('https://example.supabase.co/rest/v1/admins?select=*')
    expect((init as RequestInit).method).toBe('POST')
    const headers = (init as RequestInit).headers as Record<string, string>
    expect(headers.Prefer).toBe('return=representation')
    expect((init as RequestInit).body).toBe(JSON.stringify({ email: 'admin@example.com' }))
  })

  it('deletes rows by a caller-provided filter', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 204 }))
    const sb = supabaseRest(env)
    await sb.delete('admins', 'email=eq.admin%40example.com')

    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe(
      'https://example.supabase.co/rest/v1/admins?email=eq.admin%40example.com',
    )
    expect((init as RequestInit).method).toBe('DELETE')
  })

  it('calls a protected RPC with JSON arguments', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }))
    const sb = supabaseRest(env)
    await expect(sb.rpc('delete_admin', { target_email: 'x@example.com' })).resolves.toEqual({ ok: true })
    const [url, init] = fetchMock.mock.calls[0]!
    expect(String(url)).toBe('https://example.supabase.co/rest/v1/rpc/delete_admin')
    expect((init as RequestInit).method).toBe('POST')
    expect((init as RequestInit).body).toBe(JSON.stringify({ target_email: 'x@example.com' }))
  })
})
