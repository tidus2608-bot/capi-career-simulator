import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import UserAvatar from './UserAvatar.jsx'

describe('UserAvatar', () => {
  it('renders image with no-referrer policy when valid src provided', () => {
    render(
      <UserAvatar
        src="https://lh3.googleusercontent.com/avatar.jpg"
        alt="User"
        className="test-avatar"
      />,
    )

    const img = screen.getByRole('img')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://lh3.googleusercontent.com/avatar.jpg')
    expect(img).toHaveAttribute('referrerpolicy', 'no-referrer')
  })

  it('renders fallback icon when src is missing', () => {
    const { container } = render(
      <UserAvatar src={null} fallbackClassName="test-fallback" iconSize={20} />,
    )

    expect(screen.queryByRole('img')).toBeNull()
    const fallback = container.querySelector('.test-fallback')
    expect(fallback).toBeInTheDocument()
  })

  it('gracefully switches to fallback icon upon image load error', () => {
    const { container } = render(
      <UserAvatar
        src="https://lh3.googleusercontent.com/broken.jpg"
        fallbackClassName="test-fallback"
      />,
    )

    const img = container.querySelector('img')
    expect(img).not.toBeNull()
    fireEvent.error(img)

    expect(screen.queryByRole('img')).toBeNull()
    expect(container.querySelector('.test-fallback')).toBeInTheDocument()
  })
})
