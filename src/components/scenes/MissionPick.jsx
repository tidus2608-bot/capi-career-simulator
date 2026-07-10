import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES, CAPI_MISSIONS } from '../../data.js'
import SceneShell from './SceneShell.jsx'

const MISSION_ILLO = { 6: '03' }
const mIllo = (id) => `/illos/m${id}-q${MISSION_ILLO[id] || '01'}.webp`

export default function MissionPickScene({ themeId, onPick, onBack }) {
  const theme = CAPI_THEMES[themeId]
  const missions = theme.missionIds.map((id) => CAPI_MISSIONS[id])
  const { t } = useTranslation()
  const [selectedId, setSelectedId] = useState(null)

  return (
    <SceneShell light className="no-scroll-shell">
      <div
        className="p2-new-layout"
        style={{
          height: '100%',
          padding: 'clamp(20px, 3.5vh, 40px) 48px clamp(16px, 2.5vh, 32px)',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
        }}
      >
        <h2 className="p2-new-header" style={{ margin: '0 0 16px', flexShrink: 0 }}>
          {t('common.select_challenge')}
        </h2>

        <div className="p2-mission-grid">
          {missions.map((m, i) => {
            return (
              <div
                key={m.id}
                className={`p2-mission-card ${selectedId === m.id ? 'selected' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => {
                  capiAudio.sfx('click')
                  setSelectedId(m.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    capiAudio.sfx('click')
                    setSelectedId(m.id)
                  }
                }}
              >
                <img
                  className="bg"
                  src={mIllo(m.id)}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />
                <div className="p2-mission-card-gradient" />
                <div className="p2-mission-card-info">
                  <div className="p2-mission-card-subtitle">
                    {t('common.mission_title_prefix')} {i + 1}
                  </div>
                  <div className="p2-mission-card-title">{t(`missions.${m.id}.name`)}</div>
                  <div className="p2-mission-card-desc">{t(`missions.${m.id}.desc`)}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p2-new-actions" style={{ width: '100%', maxWidth: 1000, flexShrink: 0 }}>
          <button
            className="p2-btn-outline"
            onClick={() => {
              capiAudio.sfx('click')
              onBack()
            }}
          >
            {t('common.back_btn')}
          </button>
          <button
            className={`p2-btn-solid ${selectedId ? 'active' : ''}`}
            disabled={!selectedId}
            onClick={() => {
              if (selectedId) {
                capiAudio.sfx('whoosh')
                onPick(selectedId)
              }
            }}
          >
            {t('common.start_btn')}
          </button>
        </div>
      </div>
    </SceneShell>
  )
}
