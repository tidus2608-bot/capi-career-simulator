import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import {
  CAPI_ROLES,
  CAPI_MISSIONS,
  CAPI_THEMES,
  PHASE1_QUESTIONS,
  PHASE3_QUESTIONS,
} from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import { supabase } from '../../lib/supabase.js'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'

const ITEMS_PER_PAGE = 6

const ROLE_DISPLAY_CONFIG = {
  explorer: {
    name: 'Explorer',
    nameVn: 'Nhà Khám Phá',
    color: '#16A34A',
    bg: '#E8F5E9',
    icon: 'mdi:magnify-expand',
  },
  operator: {
    name: 'Operator',
    nameVn: 'Vận Hành Viên',
    color: '#2563EB',
    bg: '#EFF6FF',
    icon: 'mdi:file-document-outline',
  },
  connector: {
    name: 'Connector',
    nameVn: 'Người Kết Nối',
    color: '#EA580C',
    bg: '#FFF7ED',
    icon: 'mdi:account-group-outline',
  },
  communicator: {
    name: 'Communicator',
    nameVn: 'Người Truyền Cảm Hứng',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: 'mdi:comment-text-multiple-outline',
  },
  builder: {
    name: 'Builder',
    nameVn: 'Kỹ Sư Chế Tạo',
    color: '#E11D48',
    bg: '#FFE4E6',
    icon: 'mdi:hammer-wrench',
  },
}

function getRoleConfig(roleKey) {
  const key = (roleKey || '').toLowerCase()
  return (
    ROLE_DISPLAY_CONFIG[key] || {
      name: roleKey || 'Explorer',
      nameVn: roleKey || 'Nhà Khám Phá',
      color: '#843497',
      bg: '#F3E8FF',
      icon: 'mdi:compass-outline',
    }
  )
}

function formatRunDateTime(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  const pad = (n) => String(n).padStart(2, '0')
  const day = pad(d.getDate())
  const month = pad(d.getMonth() + 1)
  const year = d.getFullYear()
  const hours = pad(d.getHours())
  const minutes = pad(d.getMinutes())
  return `${day}/${month}/${year} . ${hours}:${minutes}`
}

function getMissionTitle(run, t) {
  const mission = CAPI_MISSIONS[run.mission_id]
  if (mission) {
    return t(
      `missions.${run.mission_id}.name`,
      mission.name_vn || mission.title || `Nhiệm vụ #${run.mission_id}`,
    )
  }
  if (run.theme) {
    const theme = CAPI_THEMES[run.theme]
    if (theme) return theme.name
  }
  return t('history.default_mission_name', 'Nhiệm vụ mô phỏng')
}

function getMissionPreviewImg(run) {
  if (run.mission_id && run.mission_id >= 1 && run.mission_id <= 6) {
    return `/illos/m${run.mission_id}-preview.webp`
  }
  if (run.theme === 'ark-capi') return '/illos/m1-preview.webp'
  if (run.theme === 'techno') return '/illos/m3-preview.webp'
  return '/illos/m1-preview.webp'
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

function AnswersModal({ run, onClose, onViewReport, t }) {
  const [activeTab, setActiveTab] = useState('phase2')
  const mission = CAPI_MISSIONS[run.mission_id]
  const missionTitle = getMissionTitle(run, t)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const p2Answers = run.phase2_answers || {}
  const p1Answers = run.phase1_answers?.selfPerception || {}
  const p3Answers = run.phase3_answers || {}

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out',
      }}
    >
      {/* Invisible backdrop button for click-outside dismissal */}
      <button
        type="button"
        aria-label={t('common.cancel', 'Đóng')}
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'default',
        }}
      />
      <div
        className="glass"
        style={{
          position: 'relative',
          zIndex: 1,
          backgroundColor: '#FFFFFF',
          borderRadius: 24,
          width: '100%',
          maxWidth: 780,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 20,
                fontWeight: 700,
                color: '#0F172A',
                fontFamily: 'var(--font-display)',
              }}
            >
              {t('history.answers_modal_title', 'Chi tiết câu trả lời')}
            </h3>
            <div style={{ fontSize: 13, color: '#64748B', marginTop: 4 }}>
              {missionTitle} • {formatRunDateTime(run.created_at)}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.cancel', 'Đóng')}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748B',
              cursor: 'pointer',
            }}
          >
            <Icon icon="mdi:close" width={20} height={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div
          style={{
            padding: '12px 24px 0 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            gap: 12,
            backgroundColor: '#F8FAFC',
          }}
        >
          <button
            onClick={() => setActiveTab('phase2')}
            style={{
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: activeTab === 'phase2' ? 700 : 500,
              color: activeTab === 'phase2' ? '#843497' : '#64748B',
              borderBottom:
                activeTab === 'phase2' ? '2.5px solid #843497' : '2.5px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
            }}
          >
            {t('history.phase2_tab', 'Phase 2: Nhiệm vụ')}
          </button>
          <button
            onClick={() => setActiveTab('phase1')}
            style={{
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: activeTab === 'phase1' ? 700 : 500,
              color: activeTab === 'phase1' ? '#843497' : '#64748B',
              borderBottom:
                activeTab === 'phase1' ? '2.5px solid #843497' : '2.5px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
            }}
          >
            {t('history.phase1_tab', 'Phase 1: Nhận thức')}
          </button>
          <button
            onClick={() => setActiveTab('phase3')}
            style={{
              padding: '10px 16px',
              fontSize: 14,
              fontWeight: activeTab === 'phase3' ? 700 : 500,
              color: activeTab === 'phase3' ? '#843497' : '#64748B',
              borderBottom:
                activeTab === 'phase3' ? '2.5px solid #843497' : '2.5px solid transparent',
              background: 'none',
              borderTop: 'none',
              borderLeft: 'none',
              borderRight: 'none',
              cursor: 'pointer',
            }}
          >
            {t('history.phase3_tab', 'Phase 3: Phản chiếu')}
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
          }}
        >
          {activeTab === 'phase2' && (
            <>
              {mission?.questions?.length > 0 ? (
                mission.questions.map((q, qIdx) => {
                  const selectedOptLabel = p2Answers[q.id]
                  return (
                    <div
                      key={q.id}
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: 16,
                        border: '1px solid #E2E8F0',
                        padding: '18px 20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: '#843497',
                            textTransform: 'uppercase',
                          }}
                        >
                          {q.chapter_vn || `Câu ${qIdx + 1}`}
                        </span>
                        {q.layer && (
                          <span
                            style={{
                              fontSize: 11,
                              color: '#64748B',
                              backgroundColor: '#E2E8F0',
                              padding: '2px 8px',
                              borderRadius: 99,
                            }}
                          >
                            {q.layer}
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: '#0F172A',
                          lineHeight: 1.45,
                        }}
                      >
                        {q.capi_dialogue_vn || q.prompt_vn || `Tình huống ${qIdx + 1}`}
                      </div>
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}
                      >
                        {q.options?.map((opt) => {
                          const isSelected = selectedOptLabel === opt.label
                          return (
                            <div
                              key={opt.label}
                              style={{
                                padding: '10px 14px',
                                borderRadius: 10,
                                fontSize: 13.5,
                                lineHeight: 1.4,
                                backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                                border: isSelected ? '1.5px solid #3B82F6' : '1px solid #E2E8F0',
                                color: isSelected ? '#1E3A8A' : '#334155',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 10,
                              }}
                            >
                              <span
                                style={{
                                  fontWeight: 700,
                                  color: isSelected ? '#2563EB' : '#64748B',
                                  flexShrink: 0,
                                }}
                              >
                                {opt.label}.
                              </span>
                              <span style={{ flex: 1 }}>{opt.text_vn || opt.text}</span>
                              {isSelected && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: '#2563EB',
                                    backgroundColor: '#DBEAFE',
                                    padding: '2px 8px',
                                    borderRadius: 99,
                                    flexShrink: 0,
                                  }}
                                >
                                  ✓ {t('history.selected_answer', 'Bạn đã chọn')}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>
                  {t('history.no_answers_recorded', 'Không có dữ liệu câu trả lời cho phase này.')}
                </div>
              )}
            </>
          )}

          {activeTab === 'phase1' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PHASE1_QUESTIONS.map((q, idx) => {
                const score = p1Answers[q.id]
                const roleConfig = getRoleConfig(q.role)
                return (
                  <div
                    key={q.id}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: 14,
                      border: '1px solid #E2E8F0',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700, color: roleConfig.color }}>
                          #{idx + 1} • {roleConfig.name}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.4 }}>
                        {t(`questions.${q.id}`, q.text_vn)}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: score !== undefined ? roleConfig.bg : '#E2E8F0',
                        color: score !== undefined ? roleConfig.color : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {score !== undefined ? score : '-'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'phase3' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PHASE3_QUESTIONS.map((q) => {
                const score = p3Answers[q.role]
                const roleConfig = getRoleConfig(q.role)
                return (
                  <div
                    key={q.id}
                    style={{
                      backgroundColor: '#F8FAFC',
                      borderRadius: 14,
                      border: '1px solid #E2E8F0',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 16,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}
                      >
                        <span style={{ fontSize: 12, fontWeight: 700, color: roleConfig.color }}>
                          {roleConfig.name} ({roleConfig.nameVn})
                        </span>
                      </div>
                      <div style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.4 }}>
                        {q.text_vn}
                      </div>
                    </div>
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: score !== undefined ? roleConfig.bg : '#E2E8F0',
                        color: score !== undefined ? roleConfig.color : '#64748B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: 16,
                        flexShrink: 0,
                      }}
                    >
                      {score !== undefined ? score : '-'}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
            backgroundColor: '#F8FAFC',
          }}
        >
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel', 'Đóng')}
          </Button>
          <Button
            variant="solid"
            onClick={() => onViewReport(run)}
            style={{
              backgroundColor: '#843497',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Icon icon="mdi:eye-outline" width={18} />
            <span>{t('history.btn_view_report', 'Xem báo cáo')}</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

function HistoryCard({ run, onOpenAnswers, onOpenReport, t }) {
  const roleConfig = getRoleConfig(run.primary_role)
  const title = getMissionTitle(run, t)
  const previewImg = getMissionPreviewImg(run)
  const formattedDate = formatRunDateTime(run.created_at)

  return (
    <div
      className="history-grid-card fade-up"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 18px -2px rgba(0, 0, 0, 0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Top Image Frame */}
      <div
        style={{
          height: 175,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#F1F5F9',
        }}
      >
        <img
          src={previewImg}
          alt={title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={(e) => {
            e.currentTarget.src = '/illos/m1-preview.webp'
          }}
        />
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Mission Title */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#0F172A',
              lineHeight: 1.35,
              margin: 0,
              minHeight: '2.7em',
              fontFamily: 'var(--font-display)',
            }}
          >
            {title}
          </h3>

          {/* Date & Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#64748B',
            }}
          >
            <Icon icon="mdi:clock-outline" width={16} height={16} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Role Badge Container */}
          <div
            style={{
              backgroundColor: roleConfig.bg,
              borderRadius: 14,
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: roleConfig.color,
                  textTransform: 'capitalize',
                }}
              >
                {roleConfig.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: roleConfig.color,
                  opacity: 0.85,
                  fontWeight: 500,
                  marginTop: 1,
                }}
              >
                {t('history.primary_role_badge', 'Primary role')}
              </div>
            </div>
            <div style={{ color: roleConfig.color, display: 'flex', alignItems: 'center' }}>
              <Icon icon={roleConfig.icon} width={26} height={26} />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginTop: 2,
            }}
          >
            <button
              onClick={() => onOpenAnswers(run)}
              style={{
                padding: '9px 10px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                border: '1px solid #CBD5E1',
                color: '#475569',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{t('history.btn_view_answers', 'Xem câu trả lời')}</span>
              <Icon icon="mdi:arrow-top-right" width={15} height={15} />
            </button>

            <button
              onClick={() => onOpenReport(run)}
              style={{
                padding: '9px 10px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                border: 'none',
                color: '#FFFFFF',
                backgroundColor: '#843497',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 5,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{t('history.btn_view_report', 'Xem báo cáo')}</span>
              <Icon icon="mdi:eye-outline" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HistoryScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loadRun } = useWizard()
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modals & filters
  const [selectedRunForAnswers, setSelectedRunForAnswers] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false
    supabase
      .from('runs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60)
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

  const handleOpenReport = useCallback(
    (runData) => {
      if (!runData.scores?.final) return
      loadRun(runData)
      navigate('/certificate/summary')
    },
    [loadRun, navigate],
  )

  const handleOpenAnswers = useCallback((runData) => {
    setSelectedRunForAnswers(runData)
  }, [])

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

  // Summary Metrics
  const totalExperiences = runs.length
  const dominantRoleKey = useMemo(() => {
    if (!runs.length) return 'connector'
    const counts = {}
    for (const r of runs) {
      const rk = (r.primary_role || '').toLowerCase()
      if (rk) counts[rk] = (counts[rk] || 0) + 1
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return sorted[0]?.[0] || 'connector'
  }, [runs])

  const dominantRoleConfig = getRoleConfig(dominantRoleKey)

  // Filtered & Sorted runs
  const filteredRuns = useMemo(() => {
    let list = [...runs]
    if (selectedRoleFilter !== 'all') {
      list = list.filter((r) => (r.primary_role || '').toLowerCase() === selectedRoleFilter)
    }

    if (sortOrder === 'oldest') {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortOrder === 'score') {
      list.sort((a, b) => {
        const scoreA = a.scores?.final?.[a.primary_role] || 0
        const scoreB = b.scores?.final?.[b.primary_role] || 0
        return scoreB - scoreA
      })
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return list
  }, [runs, selectedRoleFilter, sortOrder])

  // Pagination
const totalPages = Math.ceil(filteredRuns.length / ITEMS_PER_PAGE) || 1

useEffect(() => {
  setCurrentPage((p) => Math.min(Math.max(1, p), totalPages))
}, [totalPages])

const paginatedRuns = useMemo(() => {
  const start = (currentPage - 1) * ITEMS_PER_PAGE
  return filteredRuns.slice(start, start + ITEMS_PER_PAGE)
}, [filteredRuns, currentPage])

  // User avatar resolution
  const userAvatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null

  return (
    <SceneShell light>
      <style>{`
        .history-grid-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 28px -6px rgba(139, 47, 169, 0.12);
        }
        .filter-chip {
          padding: 6px 14px;
          border-radius: 99px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          border: 1px solid #E2E8F0;
          background: #FFFFFF;
          color: #64748B;
        }
        .filter-chip.active {
          background: #843497;
          color: #FFFFFF;
          border-color: #843497;
        }
      `}</style>

      <div className="history-page-shell">
        {/* Top Header Card */}
        <div className="history-header-card fade-up">
          <div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: '#0F172A',
                margin: 0,
                fontFamily: 'var(--font-display)',
              }}
            >
              {t('history.title', 'Lịch sử khám phá của bạn')}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: '#64748B',
                margin: '4px 0 0 0',
              }}
            >
              {t(
                'history.subtitle',
                'Xem lại các nhiệm vụ đã hoàn thành và hành trình khám phá bản thân qua từng lần trải nghiệm.',
              )}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={user.email || 'User'}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #E2E8F0',
                }}
              />
            ) : (
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: '#F1F5F9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#64748B',
                  border: '2px solid #E2E8F0',
                }}
              >
                <Icon icon="mdi:account" width={24} height={24} />
              </div>
            )}
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: '#64748B',
            marginTop: -8,
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
            {t('history.breadcrumb_report', 'Final report')}
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
            {t('history.breadcrumb_detail', 'Report detail')}
          </button>
          <span>/</span>
          <span style={{ color: '#843497', fontWeight: 700 }}>
            {t('history.breadcrumb_history', 'History work')}
          </span>
        </nav>

        {!user ? (
          <LoginPrompt handleLogin={handleLogin} t={t} />
        ) : loading ? (
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
              borderRadius: 20,
            }}
          >
            <Icon icon="mdi:alert-circle-outline" width={48} height={48} style={{ opacity: 0.8 }} />
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {t('history.load_error', { error })}
            </div>
          </div>
        ) : (
          <>
            {/* Section 1: Overview Cards ("Tổng quan") */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: '#0F172A',
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {t('history.overview_title', 'Tổng quan')}
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 20,
                }}
              >
                {/* Overview Card 1: Total Runs */}
                <div
                  className="fade-up"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    border: '1px solid #E2E8F0',
                    borderLeft: '4px solid #2563EB',
                    padding: '22px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 18,
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 34,
                        fontWeight: 800,
                        color: '#2563EB',
                        fontFamily: 'var(--font-display)',
                        lineHeight: 1,
                      }}
                    >
                      {totalExperiences}
                    </span>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: '#EFF6FF',
                        color: '#2563EB',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon icon="mdi:pencil-outline" width={22} height={22} />
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                      {t('history.total_runs', 'Tổng lượt trải nghiệm')}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                      {t('history.total_runs_sub', 'Số lần đã làm simulator')}
                    </div>
                  </div>
                </div>

                {/* Overview Card 2: Dominant Role */}
                <div
                  className="fade-up"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 20,
                    border: '1px solid #E2E8F0',
                    borderLeft: `4px solid ${dominantRoleConfig.color}`,
                    padding: '22px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 18,
                    boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 30,
                        fontWeight: 800,
                        color: dominantRoleConfig.color,
                        fontFamily: 'var(--font-display)',
                        lineHeight: 1,
                        textTransform: 'capitalize',
                      }}
                    >
                      {dominantRoleConfig.name}
                    </span>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: '50%',
                        backgroundColor: dominantRoleConfig.bg,
                        color: dominantRoleConfig.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon icon="mdi:account-group-outline" width={22} height={22} />
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: '#0F172A' }}>
                      {t('history.top_role', 'Vai trò nổi bật')}
                    </div>
                    <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                      {t('history.top_role_sub', 'Role xuất hiện nhiều nhất')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: History List & Controls ("Lịch sử làm bài") */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <h2
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    color: '#0F172A',
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                  }}
                >
                  {t('history.list_title', 'Lịch sử làm bài')}
                </h2>

                <button
                  onClick={() => setFilterOpen((o) => !o)}
                  aria-label={t('history.filter_by_role', 'Lọc danh sách')}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid #E2E8F0',
                    backgroundColor: filterOpen ? '#F1F5F9' : '#FFFFFF',
                    color: filterOpen ? '#843497' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon icon="mdi:tune" width={20} height={20} />
                </button>
              </div>

              {/* Filter Row */}
              {filterOpen && (
                <div
                  className="fade-up"
                  style={{
                    padding: '16px 20px',
                    borderRadius: 16,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
                      {t('history.filter_by_role', 'Vai trò')}:
                    </span>
                    {['all', 'explorer', 'builder', 'operator', 'connector', 'communicator'].map(
                      (role) => (
                        <button
                          key={role}
                          className={`filter-chip ${selectedRoleFilter === role ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedRoleFilter(role)
                            setCurrentPage(1)
                          }}
                        >
                          {role === 'all'
                            ? t('history.filter_all', 'Tất cả')
                            : CAPI_ROLES[role]?.name || role}
                        </button>
                      ),
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
                      Sắp xếp:
                    </span>
                    {[
                      { key: 'newest', label: t('history.sort_newest', 'Mới nhất') },
                      { key: 'oldest', label: t('history.sort_oldest', 'Cũ nhất') },
                      { key: 'score', label: t('history.sort_score', 'Điểm cao nhất') },
                    ].map((s) => (
                      <button
                        key={s.key}
                        className={`filter-chip ${sortOrder === s.key ? 'active' : ''}`}
                        onClick={() => setSortOrder(s.key)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid of Simulation Cards */}
              {filteredRuns.length === 0 ? (
                <div
                  className="glass"
                  style={{
                    padding: '60px 30px',
                    textAlign: 'center',
                    color: '#64748B',
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    borderRadius: 20,
                  }}
                >
                  <Icon
                    icon="mdi:text-box-search-outline"
                    width={48}
                    height={48}
                    style={{ opacity: 0.4 }}
                  />
                  <div style={{ fontSize: 16, fontWeight: 500 }}>
                    {t('history.empty', 'Chưa có lần chạy nào phù hợp.')}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                    gap: 20,
                  }}
                >
                  {paginatedRuns.map((r) => (
                    <HistoryCard
                      key={r.id}
                      run={r}
                      onOpenAnswers={handleOpenAnswers}
                      onOpenReport={handleOpenReport}
                      t={t}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {filteredRuns.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <div style={{ fontSize: 14, color: '#64748B' }}>
                    {t('history.showing_results', {
                      count: paginatedRuns.length,
                      total: filteredRuns.length,
                    })}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {/* Double Left (First Page) */}
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      aria-label="First page"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#475569',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.35 : 1,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon icon="mdi:chevron-double-left" width={18} height={18} />
                    </button>

                    {/* Single Left (Prev Page) */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      aria-label="Previous page"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#475569',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        opacity: currentPage === 1 ? 0.35 : 1,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon icon="mdi:chevron-left" width={18} height={18} />
                    </button>

                    {/* Page Numbers */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                      const isActive = currentPage === pageNum
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          style={{
                            minWidth: 32,
                            height: 32,
                            padding: '0 4px',
                            fontSize: 14,
                            fontWeight: isActive ? 800 : 500,
                            color: isActive ? '#843497' : '#64748B',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: 6,
                          }}
                        >
                          {String(pageNum).padStart(2, '0')}
                        </button>
                      )
                    })}

                    {/* Single Right (Next Page) */}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      aria-label="Next page"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#843497',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        opacity: currentPage === totalPages ? 0.35 : 1,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon icon="mdi:chevron-right" width={18} height={18} />
                    </button>

                    {/* Double Right (Last Page) */}
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      aria-label="Last page"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        backgroundColor: '#843497',
                        color: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        opacity: currentPage === totalPages ? 0.35 : 1,
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Icon icon="mdi:chevron-double-right" width={18} height={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Answers Detail Modal */}
      {selectedRunForAnswers && (
        <AnswersModal
          run={selectedRunForAnswers}
          onClose={() => setSelectedRunForAnswers(null)}
          onViewReport={handleOpenReport}
          t={t}
        />
      )}
    </SceneShell>
  )
}
