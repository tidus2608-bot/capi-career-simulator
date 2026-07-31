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
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box',
          padding: 'clamp(20px, 4vh, 40px) 24px clamp(16px, 3vh, 32px)',
        }}
      >
        {/* Dynamic Wrapper that shrink-wraps to the card's calculated width */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            width: 'fit-content',
            maxWidth: '100%',
            height: '100%',
            maxHeight: '100%',
            boxSizing: 'border-box',
          }}
        >
          {/* Widescreen Illustration Card Container */}
          <div
            style={{
              height: 'min(calc(100% - 72px), calc((100vw - 48px) * 32 / 45))',
              maxWidth: '100%',
              aspectRatio: '45 / 32',
              borderRadius: '24px',
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
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
              marginTop: '24px',
              flexShrink: 0,
            }}
          >
            <Button
              variant="outline"
              onClick={handleBack}
              style={{
                flex: 1,
                height: '48px',
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
                height: '48px',
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
