import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FeedbackModal from './FeedbackModal.jsx'
import '../../lib/i18n/index.js'

describe('FeedbackModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(<FeedbackModal isOpen={false} onClose={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders modal dialog and question 1 when isOpen is true', () => {
    render(<FeedbackModal isOpen={true} onClose={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(
      screen.getByText(/Chia sẻ trải nghiệm của bạn|Share your experience/i),
    ).toBeInTheDocument()
    expect(screen.getByText(/Câu hỏi 01 \/ 13|Question 01 (of|\/) 13/i)).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn()
    render(<FeedbackModal isOpen={true} onClose={handleClose} />)
    const closeBtn = screen.getByRole('button', { name: /Đóng|Close/i })
    fireEvent.click(closeBtn)
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', () => {
    const handleClose = vi.fn()
    render(<FeedbackModal isOpen={true} onClose={handleClose} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('allows selecting an option and advancing to the next question', () => {
    render(<FeedbackModal isOpen={true} onClose={() => {}} />)
    const nextBtn = screen.getByRole('button', { name: /Tiếp tục|Next|Continue/i })
    expect(nextBtn).toBeDisabled()

    // Click an option in Q1 (e.g. "Rất hài lòng")
    const option = screen.getByRole('button', { name: /Rất hài lòng|Very satisfied/i })
    fireEvent.click(option)

    expect(nextBtn).not.toBeDisabled()
    fireEvent.click(nextBtn)

    // Should now be on question 2
    expect(screen.getByText(/Câu hỏi 02 \/ 13|Question 02 (of|\/) 13/i)).toBeInTheDocument()
  })
})
