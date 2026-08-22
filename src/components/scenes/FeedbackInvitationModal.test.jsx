import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import FeedbackInvitationModal from './FeedbackInvitationModal.jsx'
import '../../i18n/index.js'

describe('FeedbackInvitationModal', () => {
  it('does not render when isOpen is false', () => {
    const { container } = render(
      <FeedbackInvitationModal isOpen={false} onClose={() => {}} onAccept={() => {}} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders modal content when isOpen is true', () => {
    render(<FeedbackInvitationModal isOpen={true} onClose={() => {}} onAccept={() => {}} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/Phản hồi người dùng|User Feedback/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Không|No/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Làm khảo sát|Take Survey/i })).toBeInTheDocument()
  })

  it('calls onClose when clicking "Không"', () => {
    const handleClose = vi.fn()
    render(<FeedbackInvitationModal isOpen={true} onClose={handleClose} onAccept={() => {}} />)
    fireEvent.click(screen.getByRole('button', { name: /Không|No/i }))
    expect(handleClose).toHaveBeenCalledTimes(1)
  })

  it('calls onAccept when clicking "Làm khảo sát"', () => {
    const handleAccept = vi.fn()
    render(<FeedbackInvitationModal isOpen={true} onClose={() => {}} onAccept={handleAccept} />)
    fireEvent.click(screen.getByRole('button', { name: /Làm khảo sát|Take Survey/i }))
    expect(handleAccept).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when pressing Escape key', () => {
    const handleClose = vi.fn()
    render(<FeedbackInvitationModal isOpen={true} onClose={handleClose} onAccept={() => {}} />)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
