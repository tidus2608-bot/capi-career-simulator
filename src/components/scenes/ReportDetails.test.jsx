import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ReportDetails from './ReportDetails.jsx'

const mockNavigate = vi.fn()
const mockOutletContext = {
  result: {
    primaryRole: 'builder',
    secondaryRole: 'explorer',
    phase2: {
      builder: 85,
      explorer: 65,
      operator: 40,
      connector: 55,
      communicator: 30,
    },
    top3_skills: ['frontend', 'backend', 'system_design'],
    evidence: [],
  },
  certCopy: {
    userName: 'Tester',
  },
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useOutletContext: () => mockOutletContext,
  }
})

vi.mock('../../contexts/WizardContext.jsx', () => ({
  useWizard: () => ({
    selectedMission: { id: 1, title: 'Test Mission' },
    savedRunId: 'test-run-123',
  }),
}))

vi.mock('../../audio.js', () => ({
  capiAudio: {
    sfx: vi.fn(),
  },
}))

describe('ReportDetails Feedback Modal Scroll Behavior', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('does NOT open feedback modal immediately upon mounting', () => {
    render(
      <MemoryRouter>
        <ReportDetails />
      </MemoryRouter>,
    )

    const dialog = screen.queryByRole('dialog')
    expect(dialog).toBeNull()

    // Title should be visible
    expect(screen.getByText(/Chi Tiết Báo Cáo|Detailed Report/i)).toBeInTheDocument()
  })

  it('opens feedback modal when scrolling near the bottom of the container', () => {
    const { container } = render(
      <MemoryRouter>
        <ReportDetails />
      </MemoryRouter>,
    )

    const scroller = container.querySelector('.scene-shell')
    expect(scroller).not.toBeNull()

    // Simulate scroll to bottom
    Object.defineProperty(scroller, 'scrollTop', { value: 1000, configurable: true })
    Object.defineProperty(scroller, 'clientHeight', { value: 800, configurable: true })
    Object.defineProperty(scroller, 'scrollHeight', { value: 1600, configurable: true })

    fireEvent.scroll(scroller)

    // Now modal should be open
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('does NOT open modal if already marked prompted in localStorage', () => {
    localStorage.setItem('capi_feedback_prompted_test-run-123', 'true')

    const { container } = render(
      <MemoryRouter>
        <ReportDetails />
      </MemoryRouter>,
    )

    const scroller = container.querySelector('.scene-shell')
    expect(scroller).not.toBeNull()

    Object.defineProperty(scroller, 'scrollTop', { value: 1000, configurable: true })
    Object.defineProperty(scroller, 'clientHeight', { value: 800, configurable: true })
    Object.defineProperty(scroller, 'scrollHeight', { value: 1600, configurable: true })

    fireEvent.scroll(scroller)

    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
