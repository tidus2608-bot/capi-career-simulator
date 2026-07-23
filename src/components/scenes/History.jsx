import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CAPI_ROLES, CAPI_THEMES } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import { supabase } from '../../lib/supabase.js'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'

const PROFILE_COLOR = {
  Hidden: '#e11d48',
  Aligned: '#16a34a',
  Emerging: '#d97706',
}

export default function HistoryScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useWizard()
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const visibleRuns = user ? runs : []
  const visibleError = user ? error : null
  const visibleLoading = user ? loading : false

  useEffect(() => {
    if (!user) return undefined
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
  }, [user])

  return (
    <SceneShell light>
      <div
        style={{
          padding: '28px 24px',
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}
      >
        <div
          className="fade-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <Button variant="ghost" onClick={() => navigate('/certificate')}>
            {t('common.back')}
          </Button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div className="mono" style={{ color: '#843497' }}>
              {t('history.section_label')}
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                margin: 0,
                color: '#1a1a2e',
              }}
            >
              {t('history.title')}
            </h2>
          </div>
        </div>

        {visibleLoading ? (
          <div className="mono" style={{ color: '#9ca3af', textAlign: 'center', marginTop: 60 }}>
            {t('common.loading')}
          </div>
        ) : visibleError ? (
          <div
            className="glass"
            style={{
              padding: 30,
              textAlign: 'center',
              color: '#e11d48',
              borderColor: '#fecdd3',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 40 }}>⚠️</div>
            {t('history.load_error', { error: visibleError })}
          </div>
        ) : visibleRuns.length === 0 ? (
          <div
            className="glass"
            style={{
              padding: 30,
              textAlign: 'center',
              color: '#6b7280',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 40 }}>📋</div>
            {t('history.empty')}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 12 }}>
            {visibleRuns.map((r) => {
              const pr = CAPI_ROLES[r.primary_role] || {
                color: '#843497',
                name: r.primary_role,
                nameVn: r.primary_role,
              }
              const profileColor = PROFILE_COLOR[r.profile_type] || '#843497'
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
                    <div className="mono" style={{ color: '#9ca3af', fontSize: 11 }}>
                      {t('history.mission_prefix')}
                      {r.mission_id} ·{' '}
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
                      <div className="mono" style={{ fontSize: 10, color: '#9ca3af' }}>
                        {t('history.final_score')}
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
