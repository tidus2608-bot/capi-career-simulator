import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Capi from '../Capi.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES } from '../../data.js'

export default function ThemeScene({ onPick }) {
  const [innerStage, setInnerStage] = useState('intro')
  const [selectedId, setSelectedId] = useState(null)
  const { t } = useTranslation()

  if (innerStage === 'intro') {
    return (
      <div className="p2-shell">
        <div className="p2-intro">
          <div>
            <Capi outfit="lab" pose="idle" size={160} />
          </div>
          <h2>Chào mừng bạn đến với cửa ải thứ 2 của trò chơi nhé</h2>
          <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, maxWidth: 480, margin: 0 }}>
            Hãy chọn một chủ đề nhiệm vụ và bắt đầu khám phá nhé!
          </p>
          <button
            className="p2-btn"
            style={{ maxWidth: 280, marginTop: 8 }}
            onClick={() => {
              capiAudio.sfx('confirm')
              setInnerStage('select')
            }}
          >
            Bắt đầu →
          </button>
        </div>
      </div>
    )
  }

  const themes = Object.values(CAPI_THEMES)

  return (
    <div className="p2-shell">
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
                src={tData.id === 'ark-capi' ? '/illos/sx4-theme-ark.jpg' : '/illos/sx4-theme-intern.jpg'} 
                alt="" 
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <div className="p2-new-card-gradient" />
              <div className="p2-new-card-content">
                <div className="p2-new-card-subtitle">{tData.displayName}</div>
                <div className="p2-new-card-title">{tData.subtitle}</div>
                <div className="p2-new-card-desc">{tData.blurb}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="p2-new-actions">
          <button 
            className="p2-btn-outline" 
            onClick={() => { 
              capiAudio.sfx('click')
              setInnerStage('intro') 
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
