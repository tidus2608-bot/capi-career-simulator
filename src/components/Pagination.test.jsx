import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination.jsx'

describe('Pagination Component', () => {
  it('does not render when total pages is <= 1', () => {
    const { container } = render(<Pagination current={1} total={1} onChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders all navigation buttons and page numbers', () => {
    const handleChange = vi.fn()
    render(<Pagination current={2} total={5} onChange={handleChange} />)

    expect(screen.getByLabelText('First page')).toBeInTheDocument()
    expect(screen.getByLabelText('Previous page')).toBeInTheDocument()
    expect(screen.getByLabelText('Next page')).toBeInTheDocument()
    expect(screen.getByLabelText('Last page')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Next page'))
    expect(handleChange).toHaveBeenCalledWith(3)

    fireEvent.click(screen.getByLabelText('First page'))
    expect(handleChange).toHaveBeenCalledWith(1)
  })
})
