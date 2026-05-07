import { useEffect } from 'react'
import { RoleIcon } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_ROLES } from '../../data.js'
import SceneShell from './SceneShell.jsx'

export default function RoleRevealScene({ role, onContinue }) {
  const r = role ? CAPI_ROLES[role] || CAPI_ROLES.explorer : CAPI_ROLES.explorer

  useEffect(() => {
    capiAudio.sfx('success')
  }, [])

  return (
    <SceneShell bg="lab">
      <div style={{ display: 'grid', placeItems: 'center', height: '100%', padding: 24 }}>
        <div className="glass fade-up" style={{ padding: 36, maxWidth: 640, textAlign: 'center' }}>
          <div className="mono" style={{ color: r.color }}>
            SƠ BỘ &middot;&nbsp; PHASE 1 COMPLETE
          </div>
          <div style={{ margin: '18px 0', display: 'grid', placeItems: 'center' }}>
            <RoleIcon role={r.key} size={88} />
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 44,
              margin: '0 0 4px',
              color: r.color,
              textShadow: `0 0 30px ${r.color}66`,
            }}
          >
            {r.name}
          </h2>
          <div className="mono" style={{ marginBottom: 18 }}>
            {r.nameVn}
          </div>
          <div
            className="dialogue"
            style={{ textAlign: 'left', margin: '0 auto 22px', maxWidth: 520 }}
          >
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 6 }}>
              CAPI
            </div>
            <div>
              Ồ, một <b style={{ color: r.color }}>{r.name}</b> đầy triển vọng! Hãy chọn một cổng
              mô phỏng để mình xem bạn tỏa sáng thế nào trong thực tế nhé!
            </div>
          </div>
          <div className="mono" style={{ color: 'var(--ink-mute)', fontSize: 12, marginBottom: 20 }}>
            * Đây chỉ là kết quả sơ bộ. Kết quả chính thức sẽ được tính sau khi bạn hoàn thành nhiệm
            vụ.
          </div>
          <button className="btn btn-primary" onClick={onContinue}>
            CHỌN CỔNG MÔ PHỎNG
          </button>
        </div>
      </div>
    </SceneShell>
  )
}
