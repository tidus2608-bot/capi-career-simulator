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
  const { setStartedAt, setScanIntroActive } = useWizard()

  const handleStart = () => {
    capiAudio.sfx('confirm')
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
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '120px 48px 48px',
          maxWidth: 600,
        }}
      >
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          className="fade-up"
        >
          <div
            style={{
              background: '#843497',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: 8,
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 600,
              alignSelf: 'flex-start',
              marginBottom: 24,
              letterSpacing: '0.05em',
              opacity: 0.9,
            }}
          >
            {t('intro.new_badge')}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: '0 0 24px',
              color: '#fff',
            }}
          >
            {t('intro.new_title')}
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#e2e8f0', marginBottom: 32 }}>
            {t('intro.new_blurb')}
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Button
              variant="solid"
              active
              style={{
                padding: '14px 24px',
                fontSize: 16,
                borderRadius: 12,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
              onClick={handleStart}
            >
              {t('intro.btn_scan_gene')}
              <Icon icon="mdi:arrow-right" width="20" height="20" />
            </Button>

            <Button
              variant="outline"
              style={{
                background: '#fff',
                color: '#1a1a2e',
                padding: '14px 24px',
                fontSize: 16,
                borderRadius: 12,
                border: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                opacity: 0.9,
              }}
              onClick={handleInfo}
            >
              {t('intro.btn_what_is_gene')}
              <Icon icon="mdi:arrow-right" width="20" height="20" />
            </Button>
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#e2e8f0',
            fontSize: 13,
            opacity: 0.8,
          }}
        >
          <Icon icon="mdi:information-outline" width="16" height="16" style={{ flexShrink: 0 }} />
          {t('intro.footer_hint')}
        </div>
      </div>
    </SceneShell>
  )
}
