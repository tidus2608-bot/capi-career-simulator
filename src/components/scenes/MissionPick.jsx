import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES, CAPI_MISSIONS, MISSION_ICONS } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'

export default function MissionPickScene() {
  const { selectedTheme, setSelectedMission } = useWizard()
  const theme = CAPI_THEMES[selectedTheme]
  const missions = theme ? theme.missionIds.map((id) => CAPI_MISSIONS[id]) : []
  const { t } = useTranslation()
  const navigate = useNavigate()
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
        <h2 className="p2-new-header" style={{ margin: 0, flexShrink: 0 }}>
          {t('common.select_challenge')}
        </h2>

        <div className="p2-mission-grid">
          {missions.map((m) => {
            const hasEnglishName = !!t(`missions.${m.id}.english_name`)
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
                {/* Background preview image */}
                <img
                  className="bg"
                  src={`/illos/m${m.id}-preview.jpg`}
                  alt=""
                  onError={(e) => {
                    e.currentTarget.style.display = 'none'
                  }}
                />

                {/* Base View (Visible when not hovered/selected) */}
                <div className="p2-mission-card-base-view">
                  <div
                    className="p2-mission-badge"
                    style={{
                      backgroundColor: MISSION_ICONS[m.id]?.bg,
                      color: MISSION_ICONS[m.id]?.color,
                    }}
                  >
                    {MISSION_ICONS[m.id]?.emoji}
                  </div>
                  <div className="p2-mission-title">{t(`missions.${m.id}.name`)}</div>
                  {hasEnglishName && (
                    <div className="p2-mission-english-name">
                      {t(`missions.${m.id}.english_name`)}
                    </div>
                  )}
                </div>

                {/* Hover/Selected Detail View */}
                <div className="p2-mission-card-details-view">
                  <div className="p2-mission-card-details-top">
                    <div
                      className="p2-mission-badge"
                      style={{
                        backgroundColor: MISSION_ICONS[m.id]?.bg,
                        color: MISSION_ICONS[m.id]?.color,
                      }}
                    >
                      {MISSION_ICONS[m.id]?.emoji}
                    </div>
                    <div className="p2-mission-title">{t(`missions.${m.id}.name`)}</div>
                    {hasEnglishName && (
                      <div className="p2-mission-english-name">
                        {t(`missions.${m.id}.english_name`)}
                      </div>
                    )}
                    <p className="p2-mission-detail-desc">{t(`missions.${m.id}.desc`)}</p>
                  </div>

                  <div className="p2-mission-card-details-bottom">
                    <div className="p2-mission-goals-title">{t('common.goals_title')}</div>
                    <div className="p2-mission-goals-list">
                      {(t(`missions.${m.id}.goals`, { returnObjects: true }) || []).map(
                        (goal, idx) => (
                          <div key={idx} className="p2-mission-goal-item">
                            {goal}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p2-new-actions" style={{ width: '100%', maxWidth: 1200, flexShrink: 0 }}>
          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/theme')
            }}
          >
            ← {t('common.back_btn')}
          </Button>
          <Button
            variant="solid"
            active={!!selectedId}
            disabled={!selectedId}
            onClick={() => {
              if (selectedId) {
                capiAudio.sfx('whoosh')
                setSelectedMission(selectedId)
                navigate('/mission-play')
              }
            }}
          >
            {t('common.start_btn')} →
          </Button>
        </div>
      </div>
    </SceneShell>
  )
}
