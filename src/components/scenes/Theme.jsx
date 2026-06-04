import { useState } from 'react'
import Capi from '../Capi.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES } from '../../data.js'

export default function ThemeScene({ onPick }) {
  const [innerStage, setInnerStage] = useState('intro')

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
      <div className="p2-hero">
        <img
          src="/illos/sx4-mission-select.svg"
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="p2-hero-overlay">
          <h2 className="p2-hero-title">CHỌN CHỦ ĐỀ CỦA BẠN</h2>
        </div>
        <button
          className="p2-back-btn"
          onClick={() => {
            capiAudio.sfx('click')
            setInnerStage('intro')
          }}
        >
          ← Quay về
        </button>
      </div>
      <div className="p2-content">
        <div className="p2-theme-grid">
          {themes.map((t) => {
            const firstMissionId = t.missionIds[0]
            return (
              <div key={t.id} className="p2-card">
                <div className="p2-illo-preview">
                  <img
                    src={t.id === 'ark-capi' ? '/illos/sx4-theme-ark.svg' : '/illos/sx4-theme-intern.svg'}
                    alt=""
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 11, letterSpacing: '0.15em', color: '#9ca3af', marginBottom: 6 }}
                >
                  {t.subtitle.toUpperCase()}
                </div>
                <div className="p2-card-title">{t.displayName}</div>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5, margin: '0 0 10px' }}>
                  {t.blurb}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 4 }}>
                  {t.moodTags.map((tag) => (
                    <span
                      key={tag.label}
                      className="p2-mood-tag"
                      style={{ background: tag.color, color: tag.textColor }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
                <button
                  className="p2-btn"
                  onClick={() => {
                    capiAudio.sfx('whoosh')
                    onPick(t.id)
                  }}
                >
                  Bắt đầu →
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
