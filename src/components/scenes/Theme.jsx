import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import Button from '../Button.jsx'
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
    <div className="p2-shell" style={{ overflowY: 'auto' }}>
      <div className="p2-new-layout">
        <h2 className="p2-new-header">{t('common.select_challenge')}</h2>

        <div className="p2-new-grid">
          {themes.map((tData) => (
            <div
              key={tData.id}
              className={`p2-new-card ${selectedId === tData.id ? 'selected' : ''}`}
              role="button"
              tabIndex={0}
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
              <img
                className="bg"
                src={
                  tData.id === 'ark-capi'
                    ? '/illos/sx4-theme-ark.webp'
                    : '/illos/sx4-theme-intern.webp'
                }
                alt=""
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="p2-new-card-gradient" />
              <div className="p2-new-card-content">
                <div className="p2-new-card-subtitle">
                  {t(`common.themes.${tData.id.replace('-', '_')}.displayName`)}
                </div>
                <div className="p2-new-card-title">
                  {t(`common.themes.${tData.id.replace('-', '_')}.subtitle`)}
                </div>
                <div className="p2-new-card-desc">
                  {t(`common.themes.${tData.id.replace('-', '_')}.blurb`)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p2-new-actions">
          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/role-reveal')
            }}
          >
            {t('common.back_btn')}
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
