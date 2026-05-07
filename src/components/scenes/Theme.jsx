import { SceneArt } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_THEMES } from '../../data.js'
import SceneShell from './SceneShell.jsx'

export default function ThemeScene({ onPick }) {
  return (
    <SceneShell>
      <div
        style={{
          height: '100%',
          padding: '32px 28px',
          display: 'grid',
          alignContent: 'start',
          gap: 24,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <div className="fade-up" style={{ textAlign: 'center' }}>
          <div className="mono" style={{ color: 'var(--cyan)' }}>
            PHASE 2 &middot;&nbsp; THE SIMULATION
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px,4vw,44px)',
              margin: '8px 0 4px',
            }}
          >
            Chọn một cổng mô phỏng
          </h2>
          <p style={{ color: 'var(--ink-dim)', margin: 0 }}>
            Hãy chọn 1 trong 2 chủ đề để &ldquo;thực chiến&rdquo; ngay.
          </p>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))',
            gap: 20,
            marginTop: 20,
          }}
        >
          {Object.values(CAPI_THEMES).map((t, i) => (
            <button
              key={t.id}
              className="glass fade-up"
              style={{
                animationDelay: `${0.1 + i * 0.1}s`,
                padding: 28,
                textAlign: 'left',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                borderColor: t.accent + '44',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = t.accent
                e.currentTarget.style.transform = 'translateY(-4px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = t.accent + '44'
                e.currentTarget.style.transform = 'none'
              }}
              onClick={() => {
                capiAudio.sfx('whoosh')
                onPick(t.id)
              }}
            >
              <div style={{ position: 'absolute', inset: 0, opacity: 0.25, pointerEvents: 'none' }}>
                <SceneArt variant={t.id === 'ark-capi' ? 'river' : 'home'} />
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="mono" style={{ color: t.accent, marginBottom: 8 }}>
                  CỔNG {i + 1}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    margin: '0 0 4px',
                    color: t.accent,
                  }}
                >
                  {t.name}
                </h3>
                <div style={{ color: 'var(--ink-dim)', fontSize: 14, marginBottom: 14 }}>
                  {t.subtitle}
                </div>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink)', opacity: 0.88 }}>
                  {t.blurb}
                </p>
                <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {t.mood.split(' • ').map((m) => (
                    <span
                      key={m}
                      className="pill"
                      style={{ borderColor: t.accent + '55', color: t.accent }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    marginTop: 20,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span className="mono">{t.missionIds.length} NHIỆM VỤ</span>
                  <span
                    style={{
                      color: t.accent,
                      fontFamily: 'var(--font-display)',
                      fontWeight: 600,
                    }}
                  >
                    BƯỚC VÀO →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}
