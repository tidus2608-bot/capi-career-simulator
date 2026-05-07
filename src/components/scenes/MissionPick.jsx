import { SceneArt } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES, CAPI_MISSIONS, MISSION_BG } from '../../data.js'
import SceneShell from './SceneShell.jsx'

export default function MissionPickScene({ themeId, onPick, onBack }) {
  const theme = CAPI_THEMES[themeId]
  const missions = theme.missionIds.map((id) => CAPI_MISSIONS[id])

  return (
    <SceneShell>
      <div
        style={{
          height: '100%',
          padding: '28px 28px',
          display: 'grid',
          gridTemplateRows: 'auto 1fr',
          gap: 20,
          maxWidth: 1240,
          margin: '0 auto',
        }}
      >
        <div
          className="fade-up"
          style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}
        >
          <button
            className="btn btn-ghost"
            onClick={onBack}
            style={{ padding: '8px 14px', fontSize: 13 }}
          >
            ← Đổi cổng
          </button>
          <div>
            <div className="mono" style={{ color: theme.accent }}>
              {theme.name.toUpperCase()}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '2px 0 0' }}>
              Chọn nhiệm vụ mô phỏng
            </h2>
          </div>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
            gap: 16,
            alignContent: 'start',
          }}
        >
          {missions.map((m, i) => (
            <button
              key={m.id}
              className="glass fade-up"
              style={{
                animationDelay: `${0.05 + i * 0.08}s`,
                padding: 0,
                textAlign: 'left',
                cursor: 'pointer',
                overflow: 'hidden',
                display: 'grid',
                gridTemplateRows: '140px auto',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.borderColor = theme.accent
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.borderColor = 'var(--line)'
              }}
              onClick={() => {
                capiAudio.sfx('whoosh')
                onPick(m.id)
              }}
            >
              <div style={{ position: 'relative', overflow: 'hidden', background: '#05081c' }}>
                <SceneArt variant={MISSION_BG[m.id]} />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg,rgba(5,6,23,0) 0%,rgba(5,6,23,0.8) 100%)',
                  }}
                />
                <div style={{ position: 'absolute', top: 12, left: 14, display: 'flex', gap: 6 }}>
                  <span
                    className="pill"
                    style={{ color: theme.accent, borderColor: theme.accent + '66' }}
                  >
                    MISSION {i + 1}
                  </span>
                  <span className="pill" style={{ fontSize: 10 }}>
                    20 câu
                  </span>
                </div>
              </div>
              <div style={{ padding: 18 }}>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: '0 0 4px' }}>
                  {m.name_vn}
                </h3>
                <p
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: 'var(--ink-dim)',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {m.questions[0]?.context_vn || ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}
