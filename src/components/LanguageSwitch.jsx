import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGS } from '../lib/i18n/index.js'
import Button from './Button.jsx'

const LANG_LABELS = {
  vi: 'VI',
  en: 'EN',
}

export default function LanguageSwitch({ style = {} }) {
  const { i18n, t } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language || 'vi'

  return (
    <div role="group" aria-label="Language" className="lang-switch" style={style}>
      {SUPPORTED_LANGS.map((lng) => {
        const active = current === lng
        return (
          <Button
            key={lng}
            variant="ghost"
            type="button"
            onClick={() => i18n.changeLanguage(lng)}
            aria-pressed={active}
            aria-label={t(`lang.${lng}`)}
            title={t(`lang.${lng}`)}
            className={`lang-switch-btn ${active ? 'active' : ''}`}
          >
            {LANG_LABELS[lng]}
          </Button>
        )
      })}
    </div>
  )
}
