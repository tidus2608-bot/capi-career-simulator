import { describe, it, expect, vi, beforeAll } from 'vitest'
import { render, screen } from '@testing-library/react'
import i18n from '../i18n/index.js'
import ErrorBoundary from './ErrorBoundary.jsx'

function Boom() {
  throw new Error('kaboom')
}

describe('ErrorBoundary', () => {
  beforeAll(async () => {
    // Pin to Vietnamese for assertion stability — jsdom's navigator.language
    // is en-US by default, which would otherwise auto-detect EN.
    await i18n.changeLanguage('vi')
  })

  it('renders children when no error is thrown', () => {
    render(
      <ErrorBoundary>
        <div>safe content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('safe content')).toBeInTheDocument()
  })

  it('renders the fallback UI when a child throws', () => {
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
