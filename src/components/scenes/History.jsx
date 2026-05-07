import { useState, useEffect } from 'react'
import { SceneArt } from '../UI.jsx'
import { CAPI_ROLES, CAPI_THEMES } from '../../data.js'
import SceneShell from './SceneShell.jsx'

const PROFILE_COLOR = {
  Hidden: 'var(--magenta)',
  Aligned: 'var(--green)',
  Emerging: 'var(--gold)',
}

export default function HistoryScene({ user, supabase, onBack }) {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    let cancelled = false
    supabase
      .from('runs')
      .select('id,created_at,mission_id,theme,primary_role,secondary_role,profile_type,scores')
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) setError(err.message || 'Lỗi tải lịch sử')
        else setRuns(data || [])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user, supabase])

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      <div
        style={{
          height: '100%',
          overflow: 'auto',
          padding: '28px 24px',
          maxWidth: 900,
          margin: '0 auto',
        }}
      >
        <div
          className="fade-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 28,
            flexWrap: 'wrap',
          }}
        >
          <button className="btn btn-ghost" onClick={onBack}>
            ← Quay lại
          </button>
          <div>
            <div className="mono" style={{ color: 'var(--cyan)' }}>
              LỊCH SỬ CHẠY
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, margin: '4px 0 0' }}>
              Các lần chơi trước
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="mono" style={{ color: 'var(--ink-mute)', textAlign: 'center', marginTop: 60 }}>
            Đang tải...
          </div>
        ) : error ? (
          <div
            className="glass"
            style={{
              padding: 30,
              textAlign: 'center',
              color: 'var(--magenta)',
              borderColor: 'var(--magenta)',
            }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
            Không tải được lịch sử: {error}
          </div>
        ) : runs.length === 0 ? (
          <div
            className="glass"
            style={{ padding: 30, textAlign: 'center', color: 'var(--ink-dim)' }}
          >
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            Chưa có lần chạy nào được lưu.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {runs.map((r) => {
              const pr = CAPI_ROLES[r.primary_role] || {
                color: 'var(--cyan)',
                name: r.primary_role,
                nameVn: r.primary_role,
              }
              const profileColor = PROFILE_COLOR[r.profile_type] || 'var(--cyan)'
              const theme = CAPI_THEMES[r.theme]
              return (
                <div
                  key={r.id}
                  className="glass fade-up"
                  style={{
                    padding: '18px 20px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    gap: 16,
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span
                        className="pill"
                        style={{ color: pr.color, borderColor: `${pr.color}55` }}
                      >
                        {pr.nameVn}
                      </span>
                      <span className="pill" style={{ color: profileColor }}>
                        {r.profile_type}
                      </span>
                      {theme && (
                        <span className="pill" style={{ fontSize: 11 }}>
                          {theme.name}
                        </span>
                      )}
                    </div>
                    <div className="mono" style={{ color: 'var(--ink-mute)', fontSize: 11 }}>
                      Mission #{r.mission_id} ·{' '}
                      {new Date(r.created_at).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  {r.scores?.final && (
                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: 24,
                          fontFamily: 'var(--font-display)',
                          color: pr.color,
                          fontWeight: 700,
                        }}
                      >
                        {Math.round(r.scores.final[r.primary_role])}
                      </div>
                      <div className="mono" style={{ fontSize: 10, color: 'var(--ink-mute)' }}>
                        Final Score
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </SceneShell>
  )
}
