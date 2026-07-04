import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES, CAPI_MISSIONS } from '../../data.js'

const MISSION_ILLO = { 6: '03' }
const mIllo = (id) => `/illos/m${id}-q${MISSION_ILLO[id] || '01'}.jpg`

export default function MissionPickScene({ themeId, onPick, onBack }) {
  const theme = CAPI_THEMES[themeId]
  const missions = theme.missionIds.map((id) => CAPI_MISSIONS[id])
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="p2-shell">
      <div className="p2-new-layout">
        <h2 className="p2-new-header">{t('common.select_challenge')}</h2>

        <div className="p2-new-grid">
          {missions.map((m, i) => {
            return (
              <div
                key={m.id}
                className={`p2-new-card ${selectedId === m.id ? 'selected' : ''}`}
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
                <div className="p2-new-card-gradient" />
                <div className="p2-new-card-content">
                  <div className="p2-new-card-subtitle">
                    {isEn ? `MISSION ${i + 1}` : `NHIỆM VỤ ${i + 1}`}
                  </div>
                  <div className="p2-new-card-title">
                    {isEn ? m.name_en || m.name_vn : m.name_vn}
                  </div>
                  <div className="p2-new-card-desc">
                    {isEn
                      ? m.questions[0]?.context_en || m.questions[0]?.context_vn || ''
                      : m.questions[0]?.context_vn || ''}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p2-new-actions">
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
    </div>
  )
}
