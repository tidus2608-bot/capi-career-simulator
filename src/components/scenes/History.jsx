import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
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

function LoginPrompt({ handleLogin, t }) {
  return (
    <div
      className="glass fade-up"
      style={{
        padding: '60px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        maxWidth: 500,
        margin: '40px auto 0 auto',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: '#F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#64748B',
          marginBottom: 8,
        }}
      >
        <Icon icon="mdi:lock-outline" width={32} height={32} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: '#0F172A',
            margin: 0,
            fontFamily: 'var(--font-display)',
          }}
        >
          {t('history.login_required_title', 'Yêu cầu đăng nhập')}
        </h3>
        <p
          style={{
            fontSize: 15,
            color: '#64748B',
            margin: 0,
            lineHeight: 1.5,
            maxWidth: '35ch',
          }}
        >
          {t(
            'history.login_required_desc',
            'Vui lòng đăng nhập tài khoản của bạn để xem và đồng bộ lịch sử các lượt làm bài test.',
          )}
        </p>
      </div>

      <Button
        variant="solid"
        onClick={handleLogin}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          backgroundColor: '#8B2FA9',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 15,
          width: '100%',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <Icon icon="mdi:google" width={20} height={20} />
        <span>{t('common.admin_login', 'Đăng nhập với Google')}</span>
      </Button>
    </div>
  )
}

function HistoryItem({ run, onClick, index, t }) {
  const pr = CAPI_ROLES[run.primary_role] || {
    color: '#843497',
    name: run.primary_role,
    nameVn: run.primary_role,
  }
  const sr = CAPI_ROLES[run.secondary_role]
  const profileColor = PROFILE_COLOR[run.profile_type] || '#843497'
  const theme = CAPI_THEMES[run.theme]
  const dateObj = new Date(run.created_at)
  const dateStr = dateObj.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
  const timeStr = dateObj.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <button
      className="glass history-card fade-up"
      onClick={onClick}
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20,
        cursor: 'pointer',
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        animationDelay: `${index * 0.05}s`,
        border: '1.5px solid transparent',
        textAlign: 'left',
        fontFamily: 'inherit',
        color: 'inherit',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: pr.color,
              backgroundColor: `${pr.color}15`,
              padding: '4px 10px',
              borderRadius: 99,
              letterSpacing: 0.5,
              textTransform: 'uppercase',
            }}
          >
            {pr.nameVn}
          </span>
          {sr && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#64748B',
                backgroundColor: '#F1F5F9',
                padding: '4px 10px',
                borderRadius: 99,
              }}
            >
              + {sr.nameVn}
            </span>
          )}
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: profileColor,
              backgroundColor: `${profileColor}15`,
              padding: '4px 10px',
              borderRadius: 99,
            }}
          >
            {run.profile_type}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {theme && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                color: '#334155',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              <Icon icon="mdi:domain" width={16} />
              {theme.name}
            </div>
          )}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#64748B',
              fontSize: 14,
            }}
          >
            <Icon icon="mdi:calendar-blank" width={16} />
            {dateStr}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: '#64748B',
              fontSize: 14,
            }}
          >
            <Icon icon="mdi:clock-outline" width={16} />
            {timeStr}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        {run.scores?.final && (
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: 32,
                fontFamily: 'var(--font-display)',
                color: pr.color,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              {Math.round(run.scores.final[run.primary_role])}
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: '#94A3B8', marginTop: 4, textTransform: 'uppercase' }}
            >
              {t('history.final_score')}
            </div>
          </div>
        )}
        <div style={{ color: '#CBD5E1', display: 'flex', alignItems: 'center' }}>
          <Icon icon="mdi:chevron-right" width={28} height={28} />
        </div>
      </div>
    </button>
  )
}

export default function HistoryScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loadRun } = useWizard()
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false
    supabase
      .from('runs')
      .select('*')
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

  const handleItemClick = (runData) => {
    if (!runData.scores?.final) return
    loadRun(runData)
    navigate('/certificate/summary')
  }

  const handleLogin = async () => {
    const redirectTo =
      window.location.origin +
      window.location.pathname +
      window.location.search +
      window.location.hash

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })
      if (error) {
        console.error('OAuth login error:', error)
      }
    } catch (err) {
      console.error('OAuth login exception:', err)
    }
  }

  return (
    <SceneShell light>
      <style>{`
        .history-card {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1.5px solid transparent;
        }
        .history-card:hover {
          border-color: #8B2FA9;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -10px rgba(139, 47, 169, 0.15);
        }
        .history-card:active {
          transform: translateY(1px) scale(0.99);
        }
      `}</style>
      <div
        style={{
          padding: '40px 24px',
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
          minHeight: '100dvh',
        }}
      >
        <div
          className="fade-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            borderBottom: '2px solid #E2E8F0',
            paddingBottom: '20px',
          }}
        >
          <div>
            <div className="mono" style={{ color: '#843497', fontSize: 13, marginBottom: 4 }}>
              {t('history.section_label')}
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 32,
                margin: 0,
                color: '#0F172A',
                fontWeight: 800,
              }}
            >
              {t('history.title')}
            </h2>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              borderColor: '#CBD5E1',
              color: '#475569',
              flex: 'none',
              width: 'fit-content',
            }}
          >
            {t('common.back', 'Quay lại')}
          </Button>
        </div>

        {!user ? (
          <LoginPrompt handleLogin={handleLogin} t={t} />
        ) : loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div className="mono" style={{ color: '#94A3B8', fontSize: 14 }}>
              <Icon
                icon="mdi:loading"
                width={24}
                height={24}
                className="spin"
                style={{ margin: '0 auto 8px auto', display: 'block' }}
              />
              {t('common.loading')}
            </div>
          </div>
        ) : error ? (
          <div
            className="glass"
            style={{
              padding: '40px 30px',
              textAlign: 'center',
              color: '#E11D48',
              borderColor: '#FECDD3',
              backgroundColor: '#FFF1F2',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              borderRadius: 16,
            }}
          >
            <Icon icon="mdi:alert-circle-outline" width={48} height={48} style={{ opacity: 0.8 }} />
            <div style={{ fontSize: 16, fontWeight: 500 }}>
              {t('history.load_error', { error })}
            </div>
          </div>
        ) : runs.length === 0 ? (
          <div
            className="glass"
            style={{
              padding: '60px 30px',
              textAlign: 'center',
              color: '#64748B',
              backgroundColor: '#F8FAFC',
              borderColor: '#E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              borderRadius: 16,
            }}
          >
            <Icon
              icon="mdi:text-box-search-outline"
              width={48}
              height={48}
              style={{ opacity: 0.5 }}
            />
            <div style={{ fontSize: 16 }}>{t('history.empty')}</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {runs.map((r, i) => (
              <HistoryItem key={r.id} run={r} onClick={() => handleItemClick(r)} index={i} t={t} />
            ))}
          </div>
        )}
      </div>
    </SceneShell>
  )
}
