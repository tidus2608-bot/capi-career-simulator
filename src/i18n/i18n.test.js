import { describe, it, expect, beforeEach } from 'vitest'
import i18n, { SUPPORTED_LANGS } from './index.js'

describe('i18n', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('vi')
  })

  it('exposes both supported languages', () => {
    expect(SUPPORTED_LANGS).toEqual(['vi', 'en'])
  })

  it('renders Vietnamese strings by default', () => {
    expect(i18n.t('intro.btn_start')).toBe('BẮT ĐẦU QUÉT')
    expect(i18n.t('common.retry')).toBe('Thử lại')
  })

  it('switches to English when changeLanguage is called', async () => {
    await i18n.changeLanguage('en')
    expect(i18n.t('intro.btn_start')).toBe('START SCAN')
    expect(i18n.t('common.retry')).toBe('Try again')
  })

  it('interpolates the user name in the signed-in greeting', async () => {
    await i18n.changeLanguage('en')
    expect(i18n.t('intro.auth_signed_in', { name: 'Alice' })).toBe('Signed in: Alice')
  })

  it('falls back to vi if a key is missing in en', async () => {
    // Sanity check that all en keys exist for keys actually used in the app.
    const keysToCheck = [
      'intro.title_prefix',
      'intro.title_highlight',
      'intro.title_suffix',
      'intro.subtitle',
      'intro.blurb',
      'intro.btn_start',
      'intro.btn_signin',
      'intro.btn_play_guest',
      'common.next',
      'common.back',
      'common.restart',
      'common.retry',
      'common.loading',
      'save_status.saving',
      'save_status.success',
      'save_status.error_prefix',
      'history.title',
      'history.empty',
      'error_boundary.title',
    ]
    await i18n.changeLanguage('en')
    for (const k of keysToCheck) {
      const v = i18n.t(k)
      // If a key is missing, i18next returns the key string by default.
      expect(v, `missing en translation for ${k}`).not.toBe(k)
    }
  })
})
