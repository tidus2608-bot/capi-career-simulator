import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { RoleIcon } from '../UI.jsx'
import Capi from '../Capi.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_ROLES } from '../../data.js'
import SceneShell from './SceneShell.jsx'

export default function RoleRevealScene({ role, onContinue }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const r = role ? CAPI_ROLES[role] || CAPI_ROLES.explorer : CAPI_ROLES.explorer

  useEffect(() => {
    capiAudio.sfx('success')
  }, [])

  return (
    <SceneShell light>
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 24 }}>
        <div
          className="glass fade-up"
          style={{ padding: '36px 40px', maxWidth: 580, textAlign: 'center', width: '100%' }}
        >
          <div className="mono" style={{ color: '#9ca3af', marginBottom: 20 }}>
            {t('reveal.phase1_complete')}
          </div>

          <div style={{ margin: '0 auto 18px', display: 'grid', placeItems: 'center' }}>
            <RoleIcon role={r.key} size={80} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px,5vw,48px)',
              margin: '0 0 4px',
              color: r.color,
            }}
          >
            {isEn ? r.name : r.name}
          </h2>
          {!isEn && (
            <div className="mono" style={{ color: '#6b7280', marginBottom: 20 }}>
              {r.nameVn}
            </div>
          )}

          <div
            className="dialogue"
            style={{
              textAlign: 'left',
              margin: '0 auto 20px',
              maxWidth: 480,
              marginTop: isEn ? 20 : 0,
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Capi outfit="lab" pose="talk" size={56} style={{ flexShrink: 0 }} />
              <div>
                <div className="mono" style={{ color: '#843497', marginBottom: 6 }}>
                  CAPI
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: '#374151' }}>
                  {t('reveal.capi_dialogue_prefix')}
                  <b style={{ color: r.color }}>{isEn ? r.name : r.nameVn}</b>
                  {t('reveal.capi_dialogue_suffix')}
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24, lineHeight: 1.5 }}>
            {t('reveal.disclaimer')}
          </p>

          <button className="btn btn-primary" onClick={onContinue} style={{ width: '100%' }}>
            {t('reveal.btn_select_gate')}
          </button>
        </div>
      </div>
    </SceneShell>
  )
}
