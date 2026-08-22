import { describe, it, expect, beforeEach, vi } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { WizardProvider, useWizard, clearAppStorage, APP_STORAGE_KEYS } from './WizardContext.jsx'

function TestComponent() {
  const {
    selectedMission,
    setSelectedMission,
    selectedTheme,
    setSelectedTheme,
    phase1Answers,
    onRestart,
  } = useWizard()

  return (
    <div>
      <span data-testid="mission">{String(selectedMission)}</span>
      <span data-testid="theme">{String(selectedTheme)}</span>
      <span data-testid="p1-answers">{JSON.stringify(phase1Answers)}</span>
      <button onClick={() => setSelectedMission(1)}>Set Mission 1</button>
      <button onClick={() => setSelectedTheme('ark-capi')}>Set Ark Theme</button>
      <button onClick={onRestart}>Restart</button>
    </div>
  )
}

describe('WizardContext Client State Integrity', () => {
  beforeEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
  })

  it('initializes clean defaults when localStorage is empty', () => {
    render(
      <WizardProvider>
        <TestComponent />
      </WizardProvider>,
    )

    expect(screen.getByTestId('mission').textContent).toBe('null')
    expect(screen.getByTestId('theme').textContent).toBe('null')
    expect(screen.getByTestId('p1-answers').textContent).toBe(
      JSON.stringify({ selfPerception: {}, confidence: {} }),
    )
  })

  it('recovers gracefully from corrupted JSON in localStorage', () => {
    window.localStorage.setItem('selectedMission', '{invalid json syntax...')
    window.localStorage.setItem('phase1Answers', 'not-an-object')

    render(
      <WizardProvider>
        <TestComponent />
      </WizardProvider>,
    )

    expect(screen.getByTestId('mission').textContent).toBe('null')
    expect(screen.getByTestId('p1-answers').textContent).toBe(
      JSON.stringify({ selfPerception: {}, confidence: {} }),
    )
  })

  it('discards invalid/nonexistent mission IDs and themes from localStorage', () => {
    window.localStorage.setItem('selectedMission', JSON.stringify(999999))
    window.localStorage.setItem('selectedTheme', JSON.stringify('non-existent-theme-key'))

    render(
      <WizardProvider>
        <TestComponent />
      </WizardProvider>,
    )

    expect(screen.getByTestId('mission').textContent).toBe('null')
    expect(screen.getByTestId('theme').textContent).toBe('null')
  })

  it('hydrates valid mission IDs and themes correctly', () => {
    window.localStorage.setItem('selectedMission', JSON.stringify(1))
    window.localStorage.setItem('selectedTheme', JSON.stringify('ark-capi'))

    render(
      <WizardProvider>
        <TestComponent />
      </WizardProvider>,
    )

    expect(screen.getByTestId('mission').textContent).toBe('1')
    expect(screen.getByTestId('theme').textContent).toBe('ark-capi')
  })

  it('clearAppStorage removes all designated application keys', () => {
    for (const k of APP_STORAGE_KEYS) {
      window.localStorage.setItem(k, 'sample-value')
    }

    clearAppStorage()

    for (const k of APP_STORAGE_KEYS) {
      expect(window.localStorage.getItem(k)).toBeNull()
    }
  })
})
