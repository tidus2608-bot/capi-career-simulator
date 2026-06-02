import { useEffect } from 'react'
import { RoleIcon } from '../UI.jsx'
import Capi from '../Capi.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_ROLES } from '../../data.js'
import SceneShell from './SceneShell.jsx'

export default function RoleRevealScene({ role, onContinue }) {
  const r = role ? CAPI_ROLES[role] || CAPI_ROLES.explorer : CAPI_ROLES.explorer

  useEffect(() => {
    capiAudio.sfx('success')
  }, [])

  return (
    <SceneShell light>
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 24 }}>
        <div className="glass fade-up" style={{ padding: '36px 40px', maxWidth: 580, textAlign: 'center', width: '100%' }}>

          <div className="mono" style={{ color: '#9ca3af', marginBottom: 20 }}>
            SƠ BỘ · PHASE 1 COMPLETE
          </div>

          <div style={{ margin: '0 auto 18px', display: 'grid', placeItems: 'center' }}>
            <RoleIcon role={r.key} size={80} />
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px,5vw,48px)',
              margin: '0 0 4px',
              color: r.color,
            }}
          >
            {r.name}
          </h2>
          <div className="mono" style={{ color: '#6b7280', marginBottom: 20 }}>{r.nameVn}</div>

          <div className="dialogue" style={{ textAlign: 'left', margin: '0 auto 20px', maxWidth: 480 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <Capi outfit="lab" pose="talk" size={56} style={{ flexShrink: 0 }} />
              <div>
                <div className="mono" style={{ color: '#843497', marginBottom: 6 }}>CAPI</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: '#374151' }}>
                  Ồ, một <b style={{ color: r.color }}>{r.name}</b> đầy triển vọng! Hãy chọn một
                  cổng mô phỏng để mình xem bạn tỏa sáng thế nào trong thực tế nhé!
                </div>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 24, lineHeight: 1.5 }}>
            * Đây chỉ là kết quả sơ bộ. Kết quả chính thức sẽ được tính sau khi bạn hoàn thành nhiệm vụ.
          </p>

          <button className="btn btn-primary" onClick={onContinue} style={{ width: '100%' }}>
            Chọn cổng mô phỏng →
          </button>
        </div>
      </div>
    </SceneShell>
  )
}
