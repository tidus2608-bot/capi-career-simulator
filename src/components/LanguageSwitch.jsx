import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGS } from '../i18n/index.js'

const LANG_LABELS = {
  vi: 'VI',
  en: 'EN',
}

export default function LanguageSwitch({ style = {} }) {
  const { i18n, t } = useTranslation()
  const current = i18n.resolvedLanguage || i18n.language || 'vi'

  return (
    <div
      role="group"
      aria-label="Language"
      className="lang-switch"
      style={{
        display: 'inline-flex',
        gap: 4,
        padding: 4,
        border: '1px solid var(--line)',
        borderRadius: 999,
        background: 'rgba(10,16,48,0.5)',
        backdropFilter: 'blur(8px)',
        ...style,
      }}
    >
      {SUPPORTED_LANGS.map((lng) => {
        const active = current === lng
        return (
          <button
            key={lng}
            type="button"
            onClick={() => i18n.changeLanguage(lng)}
            aria-pressed={active}
            aria-label={t(`lang.${lng}`)}
            title={t(`lang.${lng}`)}
            style={{
              padding: '4px 10px',
              borderRadius: 999,
              fontSize: 12,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.1em',
              fontWeight: 600,
              background: active ? 'var(--cyan)' : 'transparent',
              color: active ? '#021820' : 'var(--ink-dim)',
              border: 'none',
              cursor: active ? 'default' : 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {LANG_LABELS[lng]}
          </button>
        )
      })}
    </div>
  )
}
