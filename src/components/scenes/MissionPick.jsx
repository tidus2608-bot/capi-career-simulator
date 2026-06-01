import { capiAudio } from '../../audio.js'
import { CAPI_THEMES, CAPI_MISSIONS, MISSION_ICONS } from '../../data.js'

// First question illustration that exists for each mission (q01 unless missing)
const MISSION_ILLO = { 6: '03' }
const mIllo = (id) => `/illos/m${id}-q${MISSION_ILLO[id] || '01'}.webp`

export default function MissionPickScene({ themeId, onPick, onBack }) {
  const theme = CAPI_THEMES[themeId]
  const missions = theme.missionIds.map((id) => CAPI_MISSIONS[id])
  const heroMissionId = theme.missionIds[0]

  return (
    <div className="p2-shell">
      <div className="p2-hero">
        <img
          src={mIllo(heroMissionId)}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
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
                <div className="p2-illo-preview">
                  <img
                    src={mIllo(m.id)}
                    alt=""
                    onError={(e) => { e.currentTarget.style.display = 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div
                    className="p2-icon-badge"
                    style={{ background: icon.bg, color: icon.color, marginBottom: 0 }}
                  >
                    {icon.emoji}
                  </div>
                  <div>
                    <div
                      className="mono"
                      style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.1em' }}
                    >
                      NHIỆM VỤ {i + 1}
                    </div>
                    <div className="p2-card-title" style={{ margin: 0 }}>
                      {m.name_vn}
                    </div>
                  </div>
                </div>
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
