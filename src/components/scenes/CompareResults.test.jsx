import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CompareResultsScene from './CompareResults.jsx'
import { WizardProvider } from '../../contexts/WizardContext.jsx'

vi.mock('../../audio.js', () => ({
  capiAudio: {
    playBgm: vi.fn(),
    stopBgm: vi.fn(),
    playSfx: vi.fn(),
  },
}))

describe('CompareResultsScene', () => {
  const mockRun1 = {
    id: 'run-1',
    created_at: '2026-08-20T10:00:00Z',
    mission_id: 1,
    primary_role: 'builder',
    secondary_role: 'explorer',
    scores: {
      phase2: {
        builder: 85,
        explorer: 65,
        operator: 40,
        connector: 55,
        communicator: 30,
      },
    },
  }

  const mockRun2 = {
    id: 'run-2',
    created_at: '2026-08-22T14:30:00Z',
    mission_id: 2,
    primary_role: 'operator',
    secondary_role: 'communicator',
    scores: {
      phase2: {
        builder: 50,
        explorer: 45,
        operator: 88,
        connector: 60,
        communicator: 75,
      },
    },
  }

  it('renders 2 comparison columns when passed 2 runs in location state', () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: '/history/compare',
            state: { run1: mockRun1, run2: mockRun2 },
          },
        ]}
      >
        <WizardProvider>
          <CompareResultsScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    expect(screen.getAllByText(/Compare Results|So sánh kết quả/i).length).toBeGreaterThan(0)
    const columns = document.querySelectorAll('.compare-result-column')
    expect(columns).toHaveLength(2)
  })

  it('renders empty fallback when no runs are provided', () => {
    render(
      <MemoryRouter initialEntries={['/history/compare']}>
        <WizardProvider>
          <CompareResultsScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    expect(
      screen.getByText(/No Comparison Data Found|Không tìm thấy dữ liệu so sánh/i),
    ).toBeInTheDocument()
  })
})
