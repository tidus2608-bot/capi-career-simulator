import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { RoleIcon } from '../UI.jsx'
import Capi from '../Capi.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_ROLES } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'

const ROLE_BADGE_STYLES = {
  explorer: { bg: '#eee8ff', color: '#7c5cff' },
  builder: { bg: '#ffd6df', color: '#f42d55' },
  operator: { bg: '#fff3d6', color: '#d97706' },
  connector: { bg: '#d1fae5', color: '#10b981' },
  communicator: { bg: '#ffe3e8', color: '#ec4899' },
}

export default function RoleRevealScene() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { phase1TopRole } = useWizard()
  const isEn = i18n.language === 'en'
  const r = phase1TopRole ? CAPI_ROLES[phase1TopRole] || CAPI_ROLES.explorer : CAPI_ROLES.explorer
  const badgeStyle = ROLE_BADGE_STYLES[r.key] || { bg: '#ffd6df', color: '#f42d55' }

  useEffect(() => {
    capiAudio.sfx('success')
  }, [])

  return (
    <SceneShell light className="no-scroll-shell">
      <div
        style={{
          position: 'relative',
          minHeight: '100%',
          width: '100%',
          display: 'grid',
          placeItems: 'center',
          padding: '24px 16px',
          boxSizing: 'border-box',
          overflow: 'hidden',
          background: '#f4f3f6',
        }}
      >
        {/* Extracted ambient background decoration SVG */}
        <img
          src="/illos/ambient-circles.webp"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />

        {/* Main Card */}
        <div
          className="fade-up"
          style={{
            position: 'relative',
            zIndex: 2,
            background: '#e6e5ea',
            borderRadius: 24,
            padding: '40px 36px 32px',
            maxWidth: 440,
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {/* Header */}
          <div
            style={{
              color: '#77767f',
              fontSize: 16,
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
            }}
          >
            {t('common.phase1_completed')}
          </div>

          {/* Icon Badge Circle */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              backgroundColor: badgeStyle.bg,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <RoleIcon role={r.key} size={44} color={badgeStyle.color} />
          </div>

          {/* Role Name + Tagline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(32px, 5vw, 40px)',
                fontWeight: 600,
                margin: 0,
                color: '#1c1c24',
              }}
            >
              {r.name}
            </h2>
            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                color: '#23232c',
              }}
            >
              {t(`common.roles.${r.key}.tagline`)}
            </div>
          </div>

          {/* Capi Dialogue */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              alignItems: 'center',
              textAlign: 'left',
            }}
          >
            <Capi outfit="lab" pose="cheer" size={52} style={{ flexShrink: 0 }} />
            <div
              style={{
                fontSize: 13.5,
                lineHeight: 1.5,
                color: '#2d2d37',
                fontWeight: 500,
              }}
            >
              {t('reveal.capi_dialogue_prefix')}
              {isEn ? r.name.toLowerCase() : r.nameVn}
              {t('reveal.capi_dialogue_suffix')}
            </div>
          </div>

          {/* Disclaimer */}
          <p
            style={{
              fontSize: 11.5,
              color: '#8c8b94',
              lineHeight: 1.4,
              textAlign: 'left',
              margin: 0,
            }}
          >
            {t('reveal.disclaimer')}
          </p>

          {/* Action Button */}
          <Button
            variant="solid"
            active
            style={{
              width: '100%',
              height: 48,
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
            onClick={() => navigate('/theme')}
          >
            {t('reveal.btn_select_gate')}
          </Button>
        </div>
      </div>
    </SceneShell>
  )
}

