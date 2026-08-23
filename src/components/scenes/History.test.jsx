import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HistoryScene from './History.jsx'
import { WizardProvider } from '../../contexts/WizardContext.jsx'

vi.mock('../../audio.js', () => ({
  capiAudio: {
    playBgm: vi.fn(),
    stopBgm: vi.fn(),
    playSfx: vi.fn(),
  },
}))

vi.mock('../../lib/supabase.js', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({
        data: {
          session: {
            user: { id: 'user-123', email: 'test@example.com' },
          },
        },
      }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        order: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'run-1',
                created_at: '2026-08-20T10:00:00Z',
                mission_id: 1,
                primary_role: 'builder',
                secondary_role: 'explorer',
                scores: { final: { builder: 80 } },
              },
              {
                id: 'run-2',
                created_at: '2026-08-21T11:00:00Z',
                mission_id: 2,
                primary_role: 'operator',
                secondary_role: 'connector',
                scores: { final: { operator: 85 } },
              },
              {
                id: 'run-3',
                created_at: '2026-08-22T12:00:00Z',
                mission_id: 3,
                primary_role: 'connector',
                secondary_role: 'communicator',
                scores: { final: { connector: 90 } },
              },
            ],
            error: null,
          }),
        }),
      }),
    }),
  },
}))

describe('HistoryScene', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders history cards, displays tips label, and allows whole-card compare selection with floating bar', async () => {
    render(
      <MemoryRouter initialEntries={['/history']}>
        <WizardProvider>
          <HistoryScene />
        </WizardProvider>
      </MemoryRouter>,
    )

    // Wait for history cards to appear
    await waitFor(() => {
      expect(document.querySelectorAll('.history-grid-card').length).toBe(3)
    })

    // Tips label should be visible
    expect(
      screen.getByText(
        /(mẹo: nhấn vào thẻ để chọn và so sánh 2 lượt làm bài với nhau|tip: click any card to select and compare 2 simulation attempts)/i,
      ),
    ).toBeInTheDocument()

    // Get the card wrappers
    const cards = document.querySelectorAll('.history-grid-card')
    expect(cards.length).toBe(3)

    // Select first run by clicking on the card itself
    fireEvent.click(cards[0])
    expect(screen.getByText(/(đã chọn 1\/2 lượt|selected 1\/2 attempts)/i)).toBeInTheDocument()

    // Select second run by clicking on the card itself
    fireEvent.click(cards[1])
    expect(screen.getByText(/(đã chọn 2\/2 lượt|selected 2\/2 attempts)/i)).toBeInTheDocument()
    expect(screen.getByText(/(sẵn sàng đối chiếu|ready to compare)/i)).toBeInTheDocument()

    // Select third run -> should trigger max limit modal
    fireEvent.click(cards[2])
    expect(
      screen.getByText(
        /(chỉ được phép chọn tối đa 2 lượt làm test|you can only select up to 2 test runs)/i,
      ),
    ).toBeInTheDocument()
  })
})
