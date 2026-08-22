import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CapiGeneInfoScene from './CapiGeneInfo.jsx'
import { WizardProvider } from '../../contexts/WizardContext.jsx'

describe('CapiGeneInfoScene', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('renders title, carousel navigation buttons, and dot indicators', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <CapiGeneInfoScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    expect(screen.getByRole('button', { name: /Previous role/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Next role/i })).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Go to role/i)).toHaveLength(5)
  })

  it('cycles active role when clicking next and previous', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <CapiGeneInfoScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    const nextBtn = screen.getByRole('button', { name: /Next role/i })
    fireEvent.click(nextBtn)

    // Verify second dot is active
    const dots = screen.getAllByLabelText(/Go to role/i)
    expect(dots[1].style.background).toBe('rgb(132, 52, 151)')
  })

  it('navigates with keyboard arrow keys', () => {
    render(
      <MemoryRouter>
        <WizardProvider>
          <CapiGeneInfoScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    const dots = screen.getAllByLabelText(/Go to role/i)
    expect(dots[1].style.background).toBe('rgb(132, 52, 151)')
  })
})
