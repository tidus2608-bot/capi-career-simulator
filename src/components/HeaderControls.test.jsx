import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import HeaderControls from './HeaderControls.jsx'

let mockPathname = '/'
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: mockPathname }),
  }
})

let mockUser = null
const mockOnRestart = vi.fn()
vi.mock('../contexts/WizardContext.jsx', () => ({
  useWizard: () => ({
    user: mockUser,
    onRestart: mockOnRestart,
  }),
}))

const mockSignOut = vi.fn().mockResolvedValue({ error: null })
const mockSignInWithOAuth = vi.fn().mockResolvedValue({ data: {}, error: null })
vi.mock('../lib/supabase.js', () => ({
  supabase: {
    auth: {
      signOut: () => mockSignOut(),
      signInWithOAuth: (...args) => mockSignInWithOAuth(...args),
    },
  },
}))

describe('HeaderControls', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUser = null
    mockPathname = '/'
  })

  it('renders login button on desktop and only hamburger on mobile when unauthenticated', () => {
    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    // Desktop login CTA exists
    const loginBtns = screen.getAllByRole('button', { name: /Đăng nhập|Log in/i })
    expect(loginBtns.length).toBeGreaterThan(0)

    // Contact button should NOT be rendered anywhere
    expect(screen.queryByRole('button', { name: /Liên hệ|Contact/i })).not.toBeInTheDocument()

    // Mobile controls has ONLY the hamburger button
    const mobileControls = document.querySelector('.mobile-nav-controls')
    expect(mobileControls).toBeInTheDocument()
    const mobileButtons = mobileControls.querySelectorAll('button')
    expect(mobileButtons.length).toBe(1)
    expect(mobileButtons[0]).toHaveAttribute('aria-label', 'Menu')
  })

  it('displays user avatar and name with dropdown menu on desktop when logged in', async () => {
    mockUser = {
      id: 'test-user-123',
      email: 'alex@example.com',
      user_metadata: {
        full_name: 'Alex Capi',
        avatar_url: 'https://example.com/avatar.jpg',
      },
    }

    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    // User trigger button displays name
    const trigger = screen.getByRole('button', { name: /Alex Capi/i })
    expect(trigger).toBeInTheDocument()

    // Avatar image is rendered
    const avatar = trigger.querySelector('.intro-nav-user-avatar')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')

    // Dropdown is initially closed
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    // Clicking trigger opens dropdown menu
    fireEvent.click(trigger)
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    expect(screen.getByText('alex@example.com')).toBeInTheDocument()

    // History and Sign out items
    const historyItem = screen.getByRole('menuitem', { name: /Lịch sử|History/i })
    const signOutItem = screen.getByRole('menuitem', { name: /Đăng xuất|Sign out/i })
    expect(historyItem).toBeInTheDocument()
    expect(signOutItem).toBeInTheDocument()

    // Clicking Sign out triggers supabase signOut
    fireEvent.click(signOutItem)
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('closes dropdown menu when pressing Escape or clicking outside', () => {
    mockUser = {
      id: 'test-user-123',
      email: 'alex@example.com',
      user_metadata: { full_name: 'Alex Capi' },
    }

    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    const trigger = screen.getByRole('button', { name: /Alex Capi/i })
    fireEvent.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()

    // Reopen and click outside
    fireEvent.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.mouseDown(document.body)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens mobile hamburger drawer with user card and sign out button when logged in', () => {
    mockUser = {
      id: 'test-user-123',
      email: 'alex@example.com',
      user_metadata: { full_name: 'Alex Capi' },
    }

    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    const menuBtn = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(menuBtn)

    // Drawer is open
    expect(screen.getAllByText('Capi Career').length).toBeGreaterThan(1)
    expect(screen.getByText('alex@example.com')).toBeInTheDocument()

    // Drawer options
    expect(
      screen.getByRole('button', { name: /5 Mảnh Ghép Capi-Gene|5 Capi-Gene/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Đội ngũ phát triển|Credits/i })).toBeInTheDocument()

    // Sign out button in drawer
    const drawerSignOut = screen.getByRole('button', { name: /Đăng xuất|Sign out/i })
    expect(drawerSignOut).toBeInTheDocument()
    fireEvent.click(drawerSignOut)
    expect(mockSignOut).toHaveBeenCalledTimes(1)
  })

  it('renders unified header with brand logo and name on non-home routes (SSOT)', () => {
    mockPathname = '/scan'

    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    const header = document.querySelector('header.intro-navbar')
    expect(header).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Capi Career' })).toBeInTheDocument()
    expect(header.querySelector('img.intro-navbar-logo')).toBeInTheDocument()
  })

  it('protects active quiz progress with confirmation exit modal when clicking brand on /scan', () => {
    mockPathname = '/scan'

    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    const brandBtn = screen.getByRole('button', { name: 'Capi Career' })
    fireEvent.click(brandBtn)

    // Modal dialog opens
    const modalDialog = screen.getByRole('dialog')
    expect(modalDialog).toBeInTheDocument()
    expect(mockNavigate).not.toHaveBeenCalled()

    // Click confirm in modal
    const confirmBtn = screen.getByRole('button', { name: /Rời đi|Exit/i })
    fireEvent.click(confirmBtn)

    expect(mockOnRestart).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('navigates directly home without modal when clicking brand on finished routes like /certificate/summary', () => {
    mockPathname = '/certificate/summary'

    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    const brandBtn = screen.getByRole('button', { name: 'Capi Career' })
    fireEvent.click(brandBtn)

    // No modal shown
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(mockOnRestart).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })

  it('renders back button on compare route (/history/compare)', () => {
    mockPathname = '/history/compare'

    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    const backBtn = screen.getByRole('button', { name: /Quay lại lịch sử|Back to history/i })
    expect(backBtn).toBeInTheDocument()

    fireEvent.click(backBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/history')
  })

  it('provides "Trang chủ" navigation in mobile drawer on non-home routes', () => {
    mockPathname = '/history'

    render(
      <MemoryRouter>
        <HeaderControls muted={false} toggleMute={vi.fn()} />
      </MemoryRouter>,
    )

    const menuBtn = screen.getByRole('button', { name: 'Menu' })
    fireEvent.click(menuBtn)

    const homeItem = screen.getByRole('button', { name: /Trang chủ|Back to home/i })
    expect(homeItem).toBeInTheDocument()

    fireEvent.click(homeItem)
    expect(mockOnRestart).toHaveBeenCalledTimes(1)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
