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

  it('renders windowed pagination with ellipsis when total > 5', () => {
    const handleChange = vi.fn()
    render(<Pagination current={1} total={7} onChange={handleChange} />)

    expect(screen.getByText('01')).toBeInTheDocument()
    expect(screen.getByText('02')).toBeInTheDocument()
    expect(screen.getByText('03')).toBeInTheDocument()
    expect(screen.getByText('…')).toBeInTheDocument()
    expect(screen.getByText('07')).toBeInTheDocument()
    // Should NOT render 04, 05, 06 directly in initial window
    expect(screen.queryByText('04')).toBeNull()

    fireEvent.click(screen.getByText('07'))
    expect(handleChange).toHaveBeenCalledWith(7)
  })
})
