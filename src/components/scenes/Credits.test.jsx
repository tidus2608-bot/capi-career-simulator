import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CreditsScene from './Credits.jsx'
import { WizardProvider } from '../../contexts/WizardContext.jsx'

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('CreditsScene', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders credit headers, teams, and personnel members', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <CreditsScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { level: 1, name: /Credit/i })).toBeInTheDocument()
    expect(screen.getAllByText(/STEAM for Vietnam/i).length).toBeGreaterThan(0)
    expect(screen.getByText(/PRODUCT & LOGIC TEAM/i)).toBeInTheDocument()
    expect(screen.getByText(/DOMAIN ADVISORS/i)).toBeInTheDocument()
    expect(screen.getByText(/GAME ENGINEERING TEAM/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Joy Vũ/i).length).toBe(2)
    expect(screen.getByText(/Đạt Ngô/i)).toBeInTheDocument()
    expect(screen.getByText(/Vũ Tùng Minh/i)).toBeInTheDocument()
    expect(screen.getAllByText(/Tô Minh/i).length).toBe(4)
  })

  it('navigates back to home when clicking breadcrumb button', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <CreditsScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    const breadcrumbHomeBtn = screen.getByRole('button', { name: /Trang chủ|Home/i })
    fireEvent.click(breadcrumbHomeBtn)
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})
