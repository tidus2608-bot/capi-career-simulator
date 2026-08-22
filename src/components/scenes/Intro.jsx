import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { capiAudio } from '../../audio.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import { Icon } from '@iconify/react'

export default function IntroScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setStartedAt, setScanIntroActive, onRestart } = useWizard()

  const handleStart = () => {
    capiAudio.sfx('confirm')
    onRestart()
    setStartedAt(new Date().toISOString())
    setScanIntroActive(true)
    navigate('/scan')
  }

  const handleInfo = () => {
    capiAudio.sfx('click')
    navigate('/capi-gene-info')
  }

  return (
    <SceneShell>
      <img
        src="/illos/sx4-intro.webp"
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(10, 16, 48, 0.9) 0%, rgba(10, 16, 48, 0.4) 45%, transparent 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        className="intro-hero-content"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 24,
          }}
          className="fade-up"
        >
          <div
            style={{
              background: '#843497',
              color: '#fff',
              padding: '8px 16px',
              borderRadius: 10,
              display: 'inline-block',
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              alignSelf: 'flex-start',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {t('intro.new_badge')}
          </div>

          <h1
            className="intro-hero-title"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 3.8vw, 48px)',
              fontWeight: 800,
              lineHeight: 1.2,
              margin: 0,
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            {t('intro.new_title')}
          </h1>

          <p
            className="intro-hero-blurb"
            style={{ fontSize: 'var(--text-base)', lineHeight: 1.65, color: '#e2e8f0', margin: 0 }}
          >
            {t('intro.new_blurb')}
          </p>

          <div
            className="intro-hero-actions"
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}
          >
            <Button
              variant="solid"
              active
              style={{
                padding: '16px 30px',
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                borderRadius: 14,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                minHeight: 52,
              }}
              onClick={handleStart}
            >
              {t('intro.btn_scan_gene')}
              <Icon icon="mdi:arrow-right" width="22" height="22" />
            </Button>

            <Button
              variant="outline"
              style={{
                background: '#fff',
                color: '#1a1a2e',
                padding: '16px 28px',
                fontSize: 'var(--text-base)',
                fontWeight: 700,
                borderRadius: 14,
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                cursor: 'pointer',
                opacity: 0.95,
                minHeight: 52,
              }}
              onClick={handleInfo}
            >
              {t('intro.btn_what_is_gene')}
              <Icon icon="mdi:arrow-right" width="22" height="22" />
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#e2e8f0',
            fontSize: 'var(--text-xs)',
            opacity: 0.85,
            paddingTop: 16,
          }}
        >
          <Icon icon="mdi:information-outline" width="18" height="18" style={{ flexShrink: 0 }} />
          {t('intro.footer_hint')}
        </div>
      </div>
    </SceneShell>
  )
}
