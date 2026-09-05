import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../Button.jsx'
import CapiImage from '../CapiImage.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'

export default function ThemeScene() {
  const [selectedId, setSelectedId] = useState(null)
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setSelectedTheme } = useWizard()

  const themes = Object.values(CAPI_THEMES)

  return (
    <div className="p2-shell" style={{ overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div className="p2-new-layout theme-select-layout">
        <div className="p2-mission-header-group" style={{ textAlign: 'center', flexShrink: 0 }}>
          <h2 className="p2-new-header" style={{ margin: 0 }}>
            {t('common.select_challenge')}
          </h2>
          <div className="p2-mission-instruction-banner">
            {selectedId ? t('common.selected_mission_ready') : t('common.select_theme_instruction')}
          </div>
        </div>

        <div className="p2-new-grid theme-grid">
          {themes.map((tData) => {
            const isSelected = selectedId === tData.id
            return (
              <div
                key={tData.id}
                className={`p2-new-card ${isSelected ? 'selected' : ''} ${
                  selectedId && !isSelected ? 'unselected-dim' : ''
                }`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => {
                  capiAudio.sfx('click')
                  setSelectedId(tData.id)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    capiAudio.sfx('click')
                    setSelectedId(tData.id)
                  }
                }}
              >
                {/* Selected Status Pill */}
                {isSelected && (
                  <div className="p2-mission-selected-pill">
                    <span className="p2-mission-selected-pill-check">✓</span>
                    <span>{t('common.selected_badge')}</span>
                  </div>
                )}

                <CapiImage
                  className="bg"
                  src={
                    tData.id === 'ark-capi'
                      ? '/illos/sx4-theme-ark.webp'
                      : '/illos/sx4-theme-intern.webp'
                  }
                  alt=""
                  theme="dark"
                />
                <div className="p2-new-card-gradient" />
                <div className="p2-new-card-content">
                  <div className="p2-new-card-subtitle">{t(`themes.${tData.id}.displayName`)}</div>
                  <div className="p2-new-card-title">{t(`themes.${tData.id}.subtitle`)}</div>
                  <div className="p2-new-card-desc">{t(`themes.${tData.id}.blurb`)}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p2-new-actions">
          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/role-reveal')
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
                capiAudio.sfx('confirm')
                setSelectedTheme(selectedId)
                navigate('/mission-pick')
              }
            }}
          >
            {t('common.continue_btn')} →
          </Button>
        </div>
      </div>
    </div>
  )
}
