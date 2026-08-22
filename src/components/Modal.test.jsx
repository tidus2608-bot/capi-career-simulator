import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Modal from './Modal.jsx'

describe('Modal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} title="Test Modal">
        <div>Content</div>
      </Modal>,
    )
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument()
  })

  it('renders content and responds to actions when isOpen is true', () => {
    const handleClose = vi.fn()
    const handleConfirm = vi.fn()

    render(
      <Modal
        isOpen={true}
        title="Confirm Delete"
        description="Are you sure?"
        confirmText="Yes, delete"
        cancelText="Cancel"
        onClose={handleClose}
        onConfirm={handleConfirm}
      />,
    )

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()

    fireEvent.click(screen.getByText('Cancel'))
    expect(handleClose).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByText('Yes, delete'))
    expect(handleConfirm).toHaveBeenCalledTimes(1)
  })

  it('closes on Escape key press', () => {
    const handleClose = vi.fn()
    render(<Modal isOpen={true} title="Closable" onClose={handleClose} />)

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(handleClose).toHaveBeenCalledTimes(1)
  })
})
