import React, { useEffect, useState, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import SummaryRadar from '../SummaryRadar.jsx'
import UserAvatar from '../UserAvatar.jsx'
import { CAPI_ROLES, getRoleConfig } from '../../data.js'
import { supabase } from '../../lib/supabase.js'
import { formatDateTime } from '../../lib/format.js'
import { useWizard } from '../../contexts/WizardContext.jsx'

function getMissionTitle(run, t) {
  if (!run) return ''
  if (run.mission_id) {
    return t(`missions.${run.mission_id}.name`, `Mission #${run.mission_id}`)
  }
  if (run.theme) {
    return t(`themes.${run.theme}.displayName`, run.theme)
  }
  return t('history.default_mission_name', 'Simulation Attempt')
}

function ComparisonColumn({ run, index, isEn, t }) {
  const primaryRoleKey = (run.primary_role || 'explorer').toLowerCase()
  const roleConfig = getRoleConfig(primaryRoleKey)
  const roleMeta = CAPI_ROLES[primaryRoleKey] || {}
  const missionTitle = getMissionTitle(run, t)
  const formattedDate = formatDateTime(run.created_at)

  const roleName = isEn ? roleMeta.name || roleConfig.name : roleMeta.nameVn || roleConfig.nameVn

  // Fetch catalogs for this role
  const roleCatalog = useMemo(
    () => t(`roles.${primaryRoleKey}`, { returnObjects: true }) || {},
    [t, primaryRoleKey],
  )
  const reportCatalog = useMemo(() => t('report.data', { returnObjects: true }) || {}, [t])

  // 3.2: Bạn thường tỏa sáng khi (2-3 natural behaviors)
  const naturalBehaviors = useMemo(() => {
    if (Array.isArray(roleCatalog.natural_behaviors) && roleCatalog.natural_behaviors.length > 0) {
      return roleCatalog.natural_behaviors.slice(0, 3)
    }
    if (typeof roleCatalog.natural_behaviors === 'string') {
      return roleCatalog.natural_behaviors
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 3)
    }
    return []
  }, [roleCatalog])

  // 3.3: Một nghề nghiệp phù hợp
  const singleCareer = useMemo(() => {
    const careermapList = (reportCatalog.careermap || []).filter(
      (c) => c.role_id === primaryRoleKey,
    )
    return careermapList[0] || null
  }, [reportCatalog, primaryRoleKey])

  // 3.4: Môi trường phù hợp
  const bestEnvironment =
    roleCatalog.best_environment ||
    roleCatalog.best_fit_for ||
    t('roles.best_environment_default', 'Môi trường làm việc năng động, kích thích sáng tạo.')

  // 3.5: Bạn có thể thử (2-3 activities)
  const activitiesList = useMemo(() => {
    const acts = (reportCatalog.activities || []).filter((a) => a.role_id === primaryRoleKey)
    return acts.slice(0, 3)
  }, [reportCatalog, primaryRoleKey])

  const accentColor = index === 0 ? '#E11D48' : '#2563EB'
  const accentBorder = index === 0 ? '#FECDD3' : '#BFDBFE'

  return (
    <div
      className="compare-result-column"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        border: `1.5px solid ${accentBorder}`,
        padding: '28px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Column Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          paddingBottom: 18,
          borderBottom: '1px solid #F1F5F9',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: accentColor,
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: 14,
              fontFamily: 'var(--font-display)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {index + 1}
          </span>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: '#0F172A',
              fontFamily: 'var(--font-display)',
            }}
          >
            {t('compare.test_run_label', { num: index + 1 })}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              backgroundColor: '#F1F5F9',
              color: '#334155',
              padding: '4px 12px',
              borderRadius: 9999,
            }}
          >
            {missionTitle}
          </span>
          <span
            style={{
              fontSize: 13.5,
              color: '#64748B',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
            }}
          >
            {formattedDate}
          </span>
        </div>
      </div>

      {/* 3.1: Radar Chart & Role Identification */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          padding: '8px 0',
        }}
      >
        <SummaryRadar scores={run.scores?.phase2 || run.scores?.final} size={260} />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: roleConfig.bg,
            padding: '10px 20px',
            borderRadius: 16,
            border: `1px solid ${roleConfig.color}25`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: '#FFFFFF',
              color: roleConfig.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            }}
          >
            <Icon icon={roleConfig.icon} width={22} height={22} />
          </div>
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: '#0F172A',
                fontFamily: 'var(--font-display)',
                lineHeight: 1.25,
              }}
            >
              {roleName}
            </div>
            <div
              style={{
                fontSize: 12.5,
                color: '#64748B',
                fontWeight: 700,
                fontFamily: 'var(--font-display)',
                marginTop: 1,
              }}
            >
              {t('history.primary_role_badge', 'Vai trò chính')}
            </div>
          </div>
        </div>
      </div>

      {/* 3.2: Bạn thường sẽ tỏa sáng khi... */}
      <div
        style={{
          borderTop: '1px solid #F1F5F9',
          paddingTop: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              backgroundColor: '#EEF2FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon icon="lucide:sparkles" width={16} height={16} color="#6366F1" />
          </div>
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              color: '#0F172A',
              fontFamily: 'var(--font-display)',
            }}
          >
            {t('compare.shine_when_title', 'Bạn thường sẽ tỏa sáng khi...')}
          </h4>
        </div>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {naturalBehaviors.length > 0 ? (
            naturalBehaviors.map((item, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: '#334155',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span
                  style={{
                    color: roleConfig.color,
                    fontWeight: 800,
                    fontSize: 18,
                    lineHeight: 1,
                    marginTop: 1,
                  }}
                >
                  •
                </span>
                <span>{item}</span>
              </li>
            ))
          ) : (
            <li
              style={{
                fontSize: 14.5,
                color: '#64748B',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.6,
              }}
            >
              {roleCatalog.tagline || roleCatalog.subtitle || ''}
            </li>
          )}
        </ul>
      </div>

      {/* 3.3: Một nghề nghiệp phù hợp */}
      {singleCareer && (
        <div
          style={{
            borderTop: '1px solid #F1F5F9',
            paddingTop: 18,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon icon="mdi:briefcase-outline" width={20} height={20} color="#843497" />
              <h4
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: '#0F172A',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {t('compare.career_fit_title', 'Nghề nghiệp phù hợp')}
              </h4>
            </div>

            {singleCareer.domain && (
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  fontFamily: 'var(--font-display)',
                  backgroundColor: '#EFF6FF',
                  color: '#2563EB',
                  padding: '3px 10px',
                  borderRadius: 8,
                }}
              >
                {singleCareer.domain}
              </span>
            )}
          </div>

          {/* Career Name */}
          <div
            style={{
              fontSize: 17,
              fontWeight: 800,
              color: '#0F172A',
              fontFamily: 'var(--font-display)',
              marginTop: 2,
            }}
          >
            {singleCareer.career || singleCareer.name}
          </div>

          {/* Suggested Major */}
          {singleCareer.suggested_major && (
            <div
              style={{
                fontSize: 14.5,
                color: '#334155',
                lineHeight: 1.6,
                fontFamily: 'var(--font-body)',
              }}
            >
              <strong style={{ color: '#0F172A', fontWeight: 700 }}>
                {t('compare.major_label', 'Chuyên ngành')}:
              </strong>{' '}
              {singleCareer.suggested_major}
            </div>
          )}

          {/* Rationale / Why fit */}
          {singleCareer.why_fit && (
            <div
              style={{
                fontSize: 14,
                color: '#475569',
                lineHeight: 1.6,
                fontFamily: 'var(--font-body)',
              }}
            >
              <strong style={{ color: '#1E293B', fontWeight: 700 }}>
                {t('compare.reason_label', 'Lý do')}:
              </strong>{' '}
              {singleCareer.why_fit}
            </div>
          )}
        </div>
      )}

      {/* 3.4: Môi trường phù hợp */}
      <div
        style={{
          borderTop: '1px solid #F1F5F9',
          paddingTop: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon icon="mdi:domain" width={20} height={20} color="#843497" />
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              color: '#0F172A',
              fontFamily: 'var(--font-display)',
            }}
          >
            {t('compare.best_env_title', 'Môi trường phù hợp')}
          </h4>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 14.5,
            lineHeight: 1.6,
            color: '#334155',
            fontWeight: 500,
            fontFamily: 'var(--font-body)',
          }}
        >
          {bestEnvironment}
        </p>
      </div>

      {/* 3.5: Bạn có thể thử */}
      <div
        style={{
          borderTop: '1px solid #F1F5F9',
          paddingTop: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon icon="mdi:rocket-launch-outline" width={20} height={20} color="#843497" />
          <h4
            style={{
              margin: 0,
              fontSize: 16,
              fontWeight: 800,
              color: '#0F172A',
              fontFamily: 'var(--font-display)',
            }}
          >
            {t('compare.activities_try_title', 'Bạn có thể thử')}
          </h4>
        </div>
        <ul
          style={{
            margin: 0,
            padding: 0,
            listStyle: 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {activitiesList.length > 0 ? (
            activitiesList.map((act, i) => (
              <li
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#1E293B',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ color: '#843497', fontSize: 14 }}>✦</span>
                <span>{act.activity_name}</span>
              </li>
            ))
          ) : (
            <li
              style={{
                fontSize: 14,
                color: '#64748B',
                fontFamily: 'var(--font-body)',
              }}
            >
              {t('compare.default_activity', 'Tham gia các dự án thực tế và câu lạc bộ học tập.')}
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default function CompareResultsScene() {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useWizard()

  const [runs, setRuns] = useState(() => {
    if (location.state?.run1 && location.state?.run2) {
      return [location.state.run1, location.state.run2]
    }
    return []
  })
  const [loading, setLoading] = useState(() => {
    if (location.state?.run1 && location.state?.run2) return false
    const params = new URLSearchParams(location.search)
    return Boolean(params.get('run1') && params.get('run2'))
  })
  const [error, setError] = useState(null)

  // Fetch runs from query params if not provided in state (direct link/refresh)
  useEffect(() => {
    if (runs.length === 2) return

    const params = new URLSearchParams(location.search)
    const run1Id = params.get('run1')
    const run2Id = params.get('run2')

    if (!run1Id || !run2Id) return

    let cancelled = false
    supabase
      .from('runs')
      .select('*')
      .in('id', [run1Id, run2Id])
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) {
          setError(err.message || 'Lỗi tải dữ liệu so sánh')
        } else if (data && data.length === 2) {
          // Sort to match run1, run2 order
          const sortedRuns = [
            data.find((r) => r.id === run1Id) || data[0],
            data.find((r) => r.id === run2Id) || data[1],
          ]
          setRuns(sortedRuns)
        } else {
          setError(t('compare.no_data_desc'))
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [location.search, runs.length, t])

  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null

  return (
    <SceneShell light>
      <div className="history-page-shell compare-page-shell">
        {/* Top Header Card */}
        <div className="history-header-card fade-up">
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: '#0F172A',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-display)',
              }}
            >
              {t('compare.header_title', 'So sánh & Đối chiếu kết quả')}
            </h1>
            <p
              style={{
                fontSize: 15,
                color: '#64748B',
                margin: '6px 0 0 0',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.5,
              }}
            >
              {t(
                'compare.header_desc',
                'Theo dõi sự chuyển dịch về năng lực và định hướng nghề nghiệp qua các lần trải nghiệm.',
              )}
            </p>
          </div>

            <UserAvatar
              src={userAvatar}
              alt={user?.email || 'User'}
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #E2E8F0',
              }}
              fallbackStyle={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B',
                border: '2px solid #E2E8F0',
              }}
              iconSize={26}
            />
        </div>

        {/* Breadcrumbs Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 14,
            fontWeight: 500,
            color: '#64748B',
            fontFamily: 'var(--font-body)',
            marginTop: -8,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => navigate('/certificate/summary')}
            style={{
              color: '#64748B',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {t('compare.breadcrumb_report', 'Báo cáo tóm tắt')}
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/certificate/details')}
            style={{
              color: '#64748B',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {t('compare.breadcrumb_detail', 'Báo cáo chi tiết')}
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/history')}
            style={{
              color: '#64748B',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
            }}
          >
            {t('compare.breadcrumb_history', 'Lịch sử đánh giá')}
          </button>
          <span>/</span>
          <span style={{ color: '#843497', fontWeight: 700 }}>
            {t('compare.breadcrumb_compare', 'So sánh kết quả')}
          </span>
        </nav>

        {/* Screen Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
          }}
        >
          <h2
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#0F172A',
              margin: 0,
              fontFamily: 'var(--font-display)',
            }}
          >
            {t('compare.title', 'So sánh kết quả')}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: '#64748B',
              fontFamily: 'var(--font-body)',
              lineHeight: 1.5,
            }}
          >
            {t(
              'compare.desc',
              'Đối chiếu chi tiết giữa 2 lần làm bài để thấy sự thay đổi về điểm mạnh, tiềm năng và định hướng.',
            )}
          </p>
        </div>

        {/* Comparison Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div className="mono" style={{ color: '#94A3B8', fontSize: 14, textAlign: 'center' }}>
              <Icon
                icon="mdi:loading"
                width={28}
                height={28}
                className="spin"
                style={{ margin: '0 auto 12px auto', display: 'block' }}
              />
              {t('common.loading', 'Đang tải...')}
            </div>
          </div>
        ) : error || runs.length !== 2 ? (
          <div
            className="glass"
            style={{
              padding: '50px 30px',
              textAlign: 'center',
              color: '#E11D48',
              borderColor: '#FECDD3',
              backgroundColor: '#FFF1F2',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              borderRadius: 24,
            }}
          >
            <Icon icon="mdi:alert-circle-outline" width={48} height={48} />
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#9F1239' }}>
                {t('compare.no_data_title', 'Không tìm thấy dữ liệu so sánh')}
              </div>
              <div style={{ fontSize: 14, color: '#BE123C', marginTop: 4 }}>
                {error ||
                  t(
                    'compare.no_data_desc',
                    'Vui lòng quay lại trang lịch sử và chọn đủ 2 lượt làm bài để đối chiếu.',
                  )}
              </div>
            </div>
            <Button variant="solid" active onClick={() => navigate('/history')}>
              {t('compare.btn_back_history', 'Quay lại lịch sử')}
            </Button>
          </div>
        ) : (
          <div
            className="compare-columns-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 24,
              alignItems: 'start',
            }}
          >
            <ComparisonColumn run={runs[0]} index={0} isEn={isEn} t={t} />
            <ComparisonColumn run={runs[1]} index={1} isEn={isEn} t={t} />
          </div>
        )}
      </div>
    </SceneShell>
  )
}
