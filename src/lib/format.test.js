import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatDuration, getWordCount } from './format.js'

describe('format utilities', () => {
  describe('formatDate', () => {
    it('formats ISO dates correctly', () => {
      const formatted = formatDate('2026-08-22T10:15:00Z', 'en-US')
      expect(formatted).toBe('08/22/2026')
    })

    it('handles null / empty / invalid input', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate('')).toBe('')
      expect(formatDate('invalid-date')).toBe('')
    })
  })

  describe('formatDateTime', () => {
    it('formats date and time correctly', () => {
      const d = new Date(2026, 7, 22, 10, 15)
      const formatted = formatDateTime(d, 'en-GB')
      expect(formatted).toBe('22/08/2026, 10:15')
    })

    it('handles invalid inputs', () => {
      expect(formatDateTime(null)).toBe('')
      expect(formatDateTime('invalid')).toBe('')
    })
  })

  describe('formatDuration', () => {
    it('formats seconds only', () => {
      expect(formatDuration(45)).toBe('45s')
    })

    it('formats minutes and seconds', () => {
      expect(formatDuration(125)).toBe('2m 5s')
    })

    it('handles zero and invalid inputs', () => {
      expect(formatDuration(0)).toBe('0s')
      expect(formatDuration(-10)).toBe('0s')
      expect(formatDuration(null)).toBe('0s')
      expect(formatDuration('abc')).toBe('0s')
    })
  })

  describe('getWordCount', () => {
    it('counts words accurately', () => {
      expect(getWordCount('Hello world')).toBe(2)
      expect(getWordCount('  Multiple   spaces   here  ')).toBe(3)
      expect(getWordCount('')).toBe(0)
      expect(getWordCount(null)).toBe(0)
    })
  })
})
