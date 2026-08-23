import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
// Vietnamese bundles
import viCommon from './locales/vi/common.json'
import viGame from './locales/vi/game.json'
import viReport from './locales/vi/report.json'
import viRoles from './locales/vi/roles.json'
import viFeedback from './locales/vi/feedback.json'
import viMissions from './locales/vi/missions.json'

// English bundles
import enCommon from './locales/en/common.json'
import enGame from './locales/en/game.json'
import enReport from './locales/en/report.json'
import enRoles from './locales/en/roles.json'
import enFeedback from './locales/en/feedback.json'
import enMissions from './locales/en/missions.json'

export const SUPPORTED_LANGS = /** @type {const} */ (['vi', 'en'])
export const NAMESPACES = /** @type {const} */ ([
  'common',
  'game',
  'report',
  'roles',
  'feedback',
  'missions',
])

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi: {
        common: viCommon,
        game: viGame,
        report: viReport,
        roles: viRoles,
        feedback: viFeedback,
        missions: viMissions,
      },
      en: {
        common: enCommon,
        game: enGame,
        report: enReport,
        roles: enRoles,
        feedback: enFeedback,
        missions: enMissions,
      },
    },
    ns: NAMESPACES,
    defaultNS: 'common',
    fallbackNS: NAMESPACES,
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
