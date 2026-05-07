import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from './ErrorBoundary.jsx'

function Boom() {
  throw new Error('kaboom')
}

describe('ErrorBoundary', () => {
  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>safe content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })

  it('renders the fallback UI when a child throws', () => {
    // Silence the expected console.error from React's dev-mode error logging.
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByText(/Capi gặp sự cố/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Khởi động lại/i })).toBeInTheDocument()
    errorSpy.mockRestore()
  })
})
