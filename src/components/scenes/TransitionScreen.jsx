import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { capiAudio } from '../../audio.js'
import Button from '../Button.jsx'
import SceneShell from './SceneShell.jsx'

export default function TransitionScreen({ imageSrc, onNext, onBack }) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'

  const handleBack = () => {
    capiAudio.sfx('click')
    if (onBack) onBack()
  }

  const handleNext = () => {
    capiAudio.sfx('click')
    if (onNext) onNext()
  }

  return (
    <SceneShell light className="no-scroll-shell">
      <div
        className="transition-screen-layout"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '100%',
          width: '100%',
          boxSizing: 'border-box',
          padding: 'clamp(20px, 3.5vh, 40px) clamp(16px, 3vw, 32px)',
        }}
      >
        <div
          className="transition-screen-wrapper"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: '100%',
            maxWidth: 'min(820px, calc((100dvh - 180px) * 45 / 32))',
            margin: 'auto',
            boxSizing: 'border-box',
          }}
        >
          {/* Widescreen Illustration Card Container */}
          <div
            className="transition-screen-card"
            style={{
              width: '100%',
              aspectRatio: '45 / 32',
              maxHeight: 'calc(100dvh - 180px)',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.1)',
              border: '1px solid #E2E8F0',
              backgroundColor: '#0a1030',
              position: 'relative',
              boxSizing: 'border-box',
            }}
          >
            <img
              src={imageSrc}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          {/* Action buttons matching card width */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
              marginTop: 'clamp(16px, 2.5vh, 24px)',
              flexShrink: 0,
            }}
          >
            <Button
              variant="outline"
              onClick={handleBack}
              style={{
                flex: 1,
                minHeight: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1.5px solid #8B2FA9',
                color: '#8B2FA9',
                backgroundColor: '#FFFFFF',
              }}
            >
              <Icon icon="mdi:arrow-left" width={18} height={18} />
              <span>{isEn ? 'Back' : 'Quay lại'}</span>
            </Button>

            <Button
              variant="solid"
              active
              onClick={handleNext}
              style={{
                flex: 1,
                minHeight: '48px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: '#8B2FA9',
                color: '#FFFFFF',
                border: 'none',
              }}
            >
              <span>{isEn ? 'Continue' : 'Tiếp tục'}</span>
              <Icon icon="mdi:arrow-right" width={18} height={18} />
            </Button>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
