import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import FeedbackScene from './FeedbackScene.jsx'
import { supabase } from '../../lib/supabase.js'
import '../../i18n/index.js'

describe('FeedbackScene', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    window.scrollTo = vi.fn()
  })

  it('renders initial question (Question 01 of 13) and disables next until choice is selected', () => {
    render(
      <MemoryRouter initialEntries={['/feedback?run=run-test-123']}>
        <FeedbackScene />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Question 01 of 13/i)).toBeInTheDocument()
    expect(screen.getByText(/0% Hoàn thiện|0% Completed/i)).toBeInTheDocument()
    expect(
      screen.getByText(
        /Nhìn chung, bạn cảm thấy trải nghiệm này như thế nào\?|Overall, how was your experience\?/i,
      ),
    ).toBeInTheDocument()

    const nextBtn = screen.getByRole('button', { name: /Tiếp tục|Continue/i })
    expect(nextBtn).toBeDisabled()

    const optionBtn = screen.getByRole('button', { name: /Rất hài lòng|Very satisfied/i })
    fireEvent.click(optionBtn)

    expect(nextBtn).not.toBeDisabled()
  })

  it('navigates through questions and allows skipping optional text fields', () => {
    render(
      <MemoryRouter initialEntries={['/feedback?run=run-test-123']}>
        <FeedbackScene />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /^Hài lòng$|^Satisfied$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^Tiếp tục$|^Continue$/i }))

    expect(screen.getByText(/Question 02 of 13/i)).toBeInTheDocument()

    const rating5 = screen.getByRole('button', { name: '5' })
    fireEvent.click(rating5)
    fireEvent.click(screen.getByRole('button', { name: /^Tiếp tục$|^Continue$/i }))

    expect(screen.getByText(/Question 03 of 13/i)).toBeInTheDocument()
  })

  it('submits response to Supabase when completed with consent', async () => {
    const insertMock = vi.fn().mockResolvedValue({ error: null })
    vi.spyOn(supabase, 'from').mockReturnValue({
      insert: insertMock,
    })

    render(
      <MemoryRouter initialEntries={['/feedback?run=run-test-123']}>
        <FeedbackScene />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /Rất hài lòng|Very satisfied/i }))
    fireEvent.click(screen.getByRole('button', { name: /Tiếp tục|Continue/i }))

    for (let i = 2; i <= 8; i++) {
      fireEvent.click(screen.getByRole('button', { name: '5' }))
      fireEvent.click(screen.getByRole('button', { name: /Tiếp tục|Continue/i }))
    }

    fireEvent.click(screen.getByRole('button', { name: /Radar chart/i }))
    fireEvent.click(screen.getByRole('button', { name: /Tiếp tục|Continue/i }))

    fireEvent.click(screen.getByRole('button', { name: /Tiếp tục|Continue/i }))

    fireEvent.click(screen.getByRole('button', { name: /Rất chính xác|Very accurate/i }))
    fireEvent.click(screen.getByRole('button', { name: /Tiếp tục|Continue/i }))

    fireEvent.click(screen.getByRole('button', { name: /Tiếp tục|Continue/i }))

    expect(screen.getByText(/Question 13 of 13/i)).toBeInTheDocument()

    const finishBtn = screen.getByRole('button', { name: /Hoàn thành|Finish/i })
    expect(finishBtn).toBeDisabled()

    const consentBox = screen.getByRole('checkbox', { name: /Tôi đồng ý|I agree/i })
    fireEvent.click(consentBox)

    expect(finishBtn).not.toBeDisabled()
    fireEvent.click(finishBtn)

    await waitFor(() => {
      expect(insertMock).toHaveBeenCalledTimes(1)
      expect(
        screen.getByText(/Cảm ơn bạn đã đóng góp ý kiến!|Thank you for your feedback!/i),
      ).toBeInTheDocument()
    })
  })
})
