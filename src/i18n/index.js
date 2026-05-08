import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import vi from './locales/vi/common.json'
import en from './locales/en/common.json'

export const SUPPORTED_LANGS = /** @type {const} */ (['vi', 'en'])

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: { common: vi },
      en: { common: en },
    },
    ns: ['common'],
    defaultNS: 'common',
    fallbackLng: 'vi',
    supportedLngs: SUPPORTED_LANGS,
    detection: {
      // Auto-detect from browser, then cache choice in localStorage so the
      // user's preference sticks across visits.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'capi_lang',
    },
    interpolation: {
      escapeValue: false, // React handles escaping
    },
    returnNull: false,
  })

export default i18n
