import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AdminAuthNav, { isValidReturn } from './AdminAuthNav'

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options = {}) => {
      const translations = {
        'common.admin_login': 'Login with Google',
        'common.admin_console': 'Admin Console',
        'common.admin_login_short': 'Google',
        'common.admin_console_short': 'Admin',
        'common.signed_in_as': 'Signed in as Alice Example',
        'common.signed_in_prefix': 'Signed in as',
        'common.sign_out': 'Sign out',
        'common.sign_out_short': 'Out',
        'common.account_menu': 'Account menu',
        'common.account_menu_for': `Account menu for ${options.name}`,
        'common.history': 'History',
      }
      return translations[key] || key
    },
  }),
}))

describe('isValidReturn', () => {
  it('allows valid relative paths', () => {
    expect(isValidReturn('/')).toBe(true)
    expect(isValidReturn('/admin.html')).toBe(true)
    expect(isValidReturn('/foo/bar?baz=1')).toBe(true)
  })

  it('rejects invalid paths', () => {
    expect(isValidReturn(null)).toBe(false)
    expect(isValidReturn('')).toBe(false)
    expect(isValidReturn('admin.html')).toBe(false)
    expect(isValidReturn('//evil.com')).toBe(false)
    expect(isValidReturn('/\\evil.com')).toBe(false)
    expect(isValidReturn('/admin\x00.html')).toBe(false)
    expect(isValidReturn('/admin\n.html')).toBe(false)
  })
})

describe('AdminAuthNav', () => {
  let supabaseMock

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    // Mock window.location
    delete window.location
    window.location = {
      origin: 'http://localhost',
      pathname: '/test',
      search: '?foo=bar',
      hash: '#baz',
      href: 'http://localhost/test?foo=bar#baz',
    }

    supabaseMock = {
      auth: {
        signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
        signOut: vi.fn(),
      },
    }
  })

  it('renders nothing while loading', () => {
    vi.mocked(fetch).mockImplementationOnce(() => new Promise(() => {}))
    const { container } = render(<AdminAuthNav supabase={supabaseMock} session={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('fetches status when no session and renders Login with Google when not authenticated', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: false, role: null }),
    })

    render(<AdminAuthNav supabase={supabaseMock} session={null} />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login with Google' })).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith('/api/auth/status', expect.any(Object))

    const button = screen.getByRole('button', { name: 'Login with Google' })
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-label', 'Login with Google')
    expect(button).toHaveAttribute('title', 'Login with Google')
    expect(button).toHaveClass('admin-auth-link', 'admin-auth-link--login')
    expect(button).toHaveTextContent('Google')
  })

  it('calls signInWithOAuth with current location as redirectTo when login button is clicked', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: false, role: null }),
    })

    render(<AdminAuthNav supabase={supabaseMock} session={null} />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login with Google' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Login with Google' }))

    expect(supabaseMock.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost/test?foo=bar#baz',
      },
    })
  })

  it('handles OAuth error without crashing', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: false, role: null }),
    })

    supabaseMock.auth.signInWithOAuth.mockResolvedValueOnce({
      data: null,
      error: new Error('OAuth failed'),
    })
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<AdminAuthNav supabase={supabaseMock} session={null} />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Login with Google' })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: 'Login with Google' }))

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('OAuth login error:', expect.any(Error))
    })

    consoleErrorSpy.mockRestore()
  })

  it('bridges an admin session and shows the admin-only item in the account menu', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: true, role: 'admin' }),
    })

    const session = {
      access_token: 'test-token',
      user: { email: 'alice@example.com', user_metadata: { full_name: 'Alice Example' } },
    }
    const onHistory = vi.fn()
    render(<AdminAuthNav supabase={supabaseMock} session={session} onHistory={onHistory} />)

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: 'Account menu for Alice Example' }),
      ).toBeInTheDocument()
    })

    expect(fetch).toHaveBeenCalledWith(
      '/api/auth/session',
      expect.objectContaining({
        method: 'POST',
        headers: {
          Authorization: 'Bearer test-token',
        },
      }),
    )

    const trigger = screen.getByRole('button', { name: 'Account menu for Alice Example' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)

    const link = screen.getByRole('menuitem', { name: 'Admin Console' })
    expect(link).toHaveAttribute('href', '/admin.html')
    expect(screen.getByRole('menuitem', { name: 'History' })).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toHaveAttribute(
      'href',
      '/api/auth/logout?returnTo=%2F',
    )
  })

  it('shows History and sign-out but not Admin Console in a player account menu', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      status: 403,
      ok: false,
    })

    const session = {
      access_token: 'test-token',
      user: { email: 'player@example.com', user_metadata: { name: 'Player Name' } },
    }
    const onHistory = vi.fn()
    render(<AdminAuthNav supabase={supabaseMock} session={session} onHistory={onHistory} />)

    const trigger = await screen.findByRole('button', { name: 'Account menu for Player Name' })
    fireEvent.click(trigger)
    fireEvent.click(screen.getByRole('menuitem', { name: 'History' }))

    expect(onHistory).toHaveBeenCalledOnce()
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    fireEvent.click(trigger)
    expect(screen.getByRole('menuitem', { name: 'Sign out' })).toBeInTheDocument()
    expect(screen.queryByRole('menuitem', { name: 'Admin Console' })).not.toBeInTheDocument()
  })

  it('falls back to the signed-in email when profile names are missing', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 403, ok: false })
    const session = {
      access_token: 'test-token',
      user: { email: 'player@example.com', user_metadata: {} },
    }

    render(<AdminAuthNav supabase={supabaseMock} session={session} />)

    expect(
      await screen.findByRole('button', { name: 'Account menu for player@example.com' }),
    ).toBeInTheDocument()
  })

  it('closes the account menu on Escape and returns focus to the trigger', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 403, ok: false })
    const session = {
      access_token: 'test-token',
      user: { email: 'player@example.com', user_metadata: { name: 'Player Name' } },
    }
    render(<AdminAuthNav supabase={supabaseMock} session={session} onHistory={() => {}} />)

    const trigger = await screen.findByRole('button', { name: 'Account menu for Player Name' })
    fireEvent.click(trigger)
    fireEvent.keyDown(document, { key: 'Escape' })

    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it('opens with an arrow key and closes on an outside click', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ status: 403, ok: false })
    const session = {
      access_token: 'test-token',
      user: { email: 'player@example.com', user_metadata: { name: 'Player Name' } },
    }
    render(<AdminAuthNav supabase={supabaseMock} session={session} onHistory={() => {}} />)

    const trigger = await screen.findByRole('button', { name: 'Account menu for Player Name' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(screen.getByRole('menu')).toBeInTheDocument()

    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('handles logout query and redirects', async () => {
    window.location.search = '?logout=1&returnTo=/admin.html'

    render(<AdminAuthNav supabase={supabaseMock} session={null} />)

    await waitFor(() => {
      expect(supabaseMock.auth.signOut).toHaveBeenCalledWith({ scope: 'local' })
      expect(window.location.href).toBe('/admin.html')
    })
  })

  it('handles returnTo query after successful bridge and redirects', async () => {
    window.location.search = '?returnTo=/admin.html'

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ authenticated: true, role: 'admin' }),
    })

    const session = { access_token: 'test-token' }
    render(<AdminAuthNav supabase={supabaseMock} session={session} />)

    await waitFor(() => {
      expect(window.location.href).toBe('/admin.html')
    })
  })

  it('aborts fetch on unmount', () => {
    let abortSignal
    vi.mocked(fetch).mockImplementationOnce((url, options) => {
      abortSignal = options.signal
      return new Promise(() => {}) // Never resolves
    })

    const { unmount } = render(<AdminAuthNav supabase={supabaseMock} session={null} />)

    expect(abortSignal.aborted).toBe(false)
    unmount()
    expect(abortSignal.aborted).toBe(true)
  })

  it('does not bridge a stale session when logout returnTo is unsafe', async () => {
    window.location.search = '?logout=1&returnTo=//evil.example'

    render(<AdminAuthNav supabase={supabaseMock} session={{ access_token: 'stale-token' }} />)

    await waitFor(() => {
      expect(supabaseMock.auth.signOut).toHaveBeenCalledWith({ scope: 'local' })
      expect(window.location.href).toBe('/')
    })

    expect(fetch).not.toHaveBeenCalled()
  })
})
