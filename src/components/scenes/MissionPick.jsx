import { SceneArt } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES, CAPI_MISSIONS, MISSION_ICONS } from '../../data.js'

export default function MissionPickScene({ themeId, onPick, onBack }) {
  const theme = CAPI_THEMES[themeId]
  const missions = theme.missionIds.map((id) => CAPI_MISSIONS[id])
  const heroVariant = themeId === 'ark-capi' ? 'river' : 'home'

  return (
    <div className="p2-shell">
      <div className="p2-hero">
        <div style={{ position: 'absolute', inset: 0, opacity: 0.35 }}>
          <SceneArt variant={heroVariant} />
        </div>
        <div className="p2-hero-overlay">
          <h2 className="p2-hero-title">CHỌN NHIỆM VỤ BẠN YÊU THÍCH</h2>
        </div>
        <button className="p2-back-btn" onClick={onBack}>
          ← Quay về
        </button>
      </div>
      <div className="p2-content">
        <div className="p2-mission-grid">
          {missions.map((m, i) => {
            const icon = MISSION_ICONS[m.id] || { bg: '#e5e7eb', color: '#6b7280', emoji: '📋' }
            return (
              <div key={m.id} className="p2-card">
                <div
                  className="p2-icon-badge"
                  style={{ background: icon.bg, color: icon.color }}
                >
                  {icon.emoji}
                </div>
                <div
                  className="mono"
                  style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.1em', marginBottom: 4 }}
                >
                  NHIỆM VỤ {i + 1}
                </div>
                <div className="p2-card-title">{m.name_vn}</div>
                <p
                  style={{
                    fontSize: 13,
                    color: '#6b7280',
                    lineHeight: 1.5,
                    margin: '0 0 0',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {m.questions[0]?.context_vn || ''}
                </p>
                <button
                  className="p2-btn"
                  onClick={() => {
                    capiAudio.sfx('whoosh')
                    onPick(m.id)
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
