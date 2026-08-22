/**
 * Centralized formatting utilities using native platform APIs.
 */

/**
 * Formats an ISO date string into DD/MM/YYYY.
 * @param {string|Date} dateInput
 * @param {string} [locale='vi-VN']
 * @returns {string}
 */
export function formatDate(dateInput, locale = 'vi-VN') {
  if (!dateInput) return ''
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(d.getTime())) return ''

  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Formats an ISO date string into HH:MM DD/MM/YYYY.
 * @param {string|Date} dateInput
 * @param {string} [locale='vi-VN']
 * @returns {string}
 */
export function formatDateTime(dateInput, locale = 'vi-VN') {
  if (!dateInput) return ''
  const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput
  if (isNaN(d.getTime())) return ''

  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  }).format(d)
}

/**
 * Formats a duration in seconds to "Xm Ys" or "Xs".
 * @param {number} totalSeconds
 * @returns {string}
 */
export function formatDuration(totalSeconds) {
  if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
    return '0s'
  }
  const m = Math.floor(totalSeconds / 60)
  const s = Math.floor(totalSeconds % 60)
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

/**
 * Computes word count in a text string.
 * @param {string} text
 * @returns {number}
 */
export function getWordCount(text) {
  if (!text || typeof text !== 'string') return 0
  const words = text.trim().split(/\s+/)
  return words[0] === '' ? 0 : words.length
}
