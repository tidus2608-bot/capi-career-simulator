import { describe, it, expect, beforeEach, vi } from 'vitest'
import { capiAudio } from './audio.js'

describe('CapiAudio Engine', () => {
  beforeEach(() => {
    localStorage.clear()
    capiAudio.setMuted(false)
  })

  it('initializes default mute state from localStorage or false', () => {
    expect(capiAudio.muted).toBe(false)
  })

  it('toggles muted state and updates localStorage', () => {
    const nextState = capiAudio.toggle()
    expect(nextState).toBe(true)
    expect(capiAudio.muted).toBe(true)
    expect(localStorage.getItem('capi_muted')).toBe('1')

    const secondState = capiAudio.toggle()
    expect(secondState).toBe(false)
    expect(capiAudio.muted).toBe(false)
    expect(localStorage.getItem('capi_muted')).toBe('0')
  })

  it('notifies subscribers upon mute changes', () => {
    const listener = vi.fn()
    const unsubscribe = capiAudio.subscribe(listener)

    expect(listener).toHaveBeenCalledWith(false)

    capiAudio.setMuted(true)
    expect(listener).toHaveBeenCalledWith(true)

    unsubscribe()
    capiAudio.setMuted(false)
    expect(listener).toHaveBeenCalledTimes(2) // Initial + 1 change, not called after unsubscribe
  })
})
