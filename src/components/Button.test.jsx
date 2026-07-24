import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from './Button.jsx'

describe('Button', () => {
  it('renders solid variant by default', () => {
    render(<Button>Click me</Button>)
    const btn = screen.getByRole('button', { name: /Click me/i })
    expect(btn.className).toContain('p2-btn-solid')
  })

  it('renders outline variant', () => {
    render(<Button variant="outline">Back</Button>)
    const btn = screen.getByRole('button', { name: /Back/i })
    expect(btn.className).toContain('p2-btn-outline')
  })

  it('renders ghost variant', () => {
    render(<Button variant="ghost">History</Button>)
    const btn = screen.getByRole('button', { name: /History/i })
    expect(btn.className).toContain('btn btn-ghost')
  })

  it('renders option variant with selected state', () => {
    render(
      <Button variant="option" selected={true}>
        Option A
      </Button>,
    )
    const btn = screen.getByRole('button', { name: /Option A/i })
    expect(btn.className).toContain('p2-option')
    expect(btn.className).toContain('p2-selected')
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Submit</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled prop', () => {
    render(<Button disabled>Disabled</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
  })
})
