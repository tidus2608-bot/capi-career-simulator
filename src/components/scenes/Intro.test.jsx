import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import IntroScene from './Intro.jsx'
import { WizardProvider } from '../../contexts/WizardContext.jsx'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockSignInWithOAuth = vi.fn().mockResolvedValue({ data: {}, error: null })
vi.mock('../../lib/supabase.js', () => ({
  supabase: {
    auth: {
      signInWithOAuth: (...args) => mockSignInWithOAuth(...args),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}))

describe('IntroScene', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders hero, perspectives, genes, and ready sections', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <IntroScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    // Hero section
    expect(
      screen.getByText(/CAPI GENE - (GIẢI MÃ GEN NGHỀ NGHIỆP|DECODE CAREER GENES)/i),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Giải mã ngay|Decode Now/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Tìm hiểu Capi Gene|Learn About Capi Gene/i })).toBeInTheDocument()

    // Perspectives section
    expect(screen.getByText(/TRIẾT LÝ HOẠT ĐỘNG|OPERATING PHILOSOPHY/i)).toBeInTheDocument()
    expect(screen.getByText(/BÓC TÁCH "TAM GIÁC PHẢN XẠ"|DECONSTRUCTING/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /TÔI NGHĨ GÌ\?|WHAT DO I THINK\?/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /TÔI LÀM GÌ\?|WHAT DO I DO\?/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /TÔI NHÌN LẠI ĐƯỢC GÌ\?|WHAT DO I REFLECT/i })).toBeInTheDocument()
    expect(
      screen.getByText(/Điểm đắt giá nhất|The most valuable takeaway/i),
    ).toBeInTheDocument()

    // Genes section
    expect(screen.getByText(/GIẢI MÃ BỘ 5 CAPI GENE|DECODING THE 5 CAPI GENES/i)).toBeInTheDocument()
    expect(screen.getAllByRole('tab').length).toBe(5)

    // Ready section
    expect(screen.getByText(/Sẵn sàng khám phá|Ready to discover/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Khám phá ngay|Explore Now/i }),
    ).toBeInTheDocument()
  })

  it('shows login prompt modal when unauthenticated user clicks hero start button, and can continue to test', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <IntroScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Giải mã ngay|Decode Now/i }))

    // Modal dialog opens
    expect(
      screen.getByText(
        /Đăng nhập để lưu kết quả bài test và xem lại bất cứ lúc nào nhé!|Log in to save your test results/i,
      ),
    ).toBeInTheDocument()

    // Clicking "Tiếp tục làm test" proceeds to /scan
    fireEvent.click(screen.getByRole('button', { name: /Tiếp tục làm test|Continue test/i }))
    expect(mockNavigate).toHaveBeenCalledWith('/scan')
  })

  it('triggers OAuth login when clicking "Đăng nhập ngay" in modal', async () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <IntroScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Giải mã ngay|Decode Now/i }))

    const loginBtn = screen.getByRole('button', { name: /Đăng nhập ngay|Log in now/i })
    fireEvent.click(loginBtn)

    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringMatching(/\/scan$/),
      },
    })
  })

  it('shows login prompt modal when unauthenticated user clicks ready section start button', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <IntroScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Khám phá ngay|Explore Now/i }))

    expect(
      screen.getByText(
        /Đăng nhập để lưu kết quả bài test và xem lại bất cứ lúc nào nhé!|Log in to save your test results/i,
      ),
    ).toBeInTheDocument()
  })

  it('switches active gene when clicking a gene tab, displaying tagline only on active card', () => {
    const { container } = render(
      <MemoryRouter>
        <WizardProvider>
          <IntroScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    // Exactly 1 tagline in the entire genes deck (only on active card)
    const taglines = container.querySelectorAll('.intro-gene-tagline')
    expect(taglines.length).toBe(1)

    const tabs = screen.getAllByRole('tab')
    // Builder is index 1
    fireEvent.click(tabs[1])
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true')

    const updatedTaglines = container.querySelectorAll('.intro-gene-tagline')
    expect(updatedTaglines.length).toBe(1)
  })

  it('navigates to /credits when clicking footer credits link', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <IntroScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    const creditsBtn = screen.getByRole('button', { name: /Đội ngũ phát triển|Credits & Team/i })
    fireEvent.click(creditsBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/credits')
  })
})
