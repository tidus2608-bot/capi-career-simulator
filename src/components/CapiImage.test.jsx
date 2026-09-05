import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import CapiImage from './CapiImage.jsx'

describe('CapiImage component', () => {
  it('renders an img element with default lazy loading', () => {
    render(<CapiImage src="/test.webp" alt="Test image" />)
    const img = screen.getByRole('img', { name: /test image/i })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('loading', 'lazy')
    expect(img).toHaveAttribute('decoding', 'async')
  })

  it('sets eager and high priority when priority is true', () => {
    render(<CapiImage src="/hero.webp" alt="Hero" priority />)
    const img = screen.getByRole('img', { name: /hero/i })
    expect(img).toHaveAttribute('loading', 'eager')
    expect(img).toHaveAttribute('fetchpriority', 'high')
  })

  it('applies aspectRatio to container to prevent CLS', () => {
    const { container } = render(<CapiImage src="/test.webp" alt="Aspect" aspectRatio="16 / 9" />)
    const wrapper = container.querySelector('.capi-img-container')
    expect(wrapper).toHaveStyle({ aspectRatio: '16 / 9' })
  })

  it('switches to fallbackSrc on error', () => {
    render(<CapiImage src="/missing.webp" fallbackSrc="/fallback.webp" alt="Fallback Test" />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', '/missing.webp')

    fireEvent.error(img)
    expect(img).toHaveAttribute('src', '/fallback.webp')
  })

  it('displays fallback placeholder if no fallbackSrc on error', () => {
    const { container } = render(<CapiImage src="/broken.webp" alt="Placeholder Test" />)
    const img = screen.getByRole('img')
    fireEvent.error(img)
    expect(container.querySelector('.capi-img-fallback')).toBeInTheDocument()
    expect(container.textContent).toContain('Placeholder Test')
  })

  it('marks image loaded on load event', () => {
    render(<CapiImage src="/valid.webp" alt="Load test" />)
    const img = screen.getByRole('img')
    expect(img).toHaveClass('capi-img-element--loading')
    fireEvent.load(img)
    expect(img).toHaveClass('capi-img-element--loaded')
  })
})
