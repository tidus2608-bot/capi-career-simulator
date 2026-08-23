import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { CAPI_MISSIONS, PHASE1_QUESTIONS, PHASE3_QUESTIONS } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import { supabase } from '../../lib/supabase.js'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import Pagination from '../Pagination.jsx'
import Modal from '../Modal.jsx'
import { formatDateTime } from '../../lib/format.js'

function useResponsiveItemsPerPage() {
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window === 'undefined') return 6
    if (window.innerWidth < 640) return 3
    if (window.innerWidth < 1024) return 4
    return 6
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setItemsPerPage(3)
      else if (width < 1024) setItemsPerPage(4)
      else setItemsPerPage(6)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return itemsPerPage
}

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

function getMissionTitle(run, t) {
  if (!run) return ''
  if (run.mission_id) {
    const mission = CAPI_MISSIONS[run.mission_id]
    if (mission) return t(`missions.${mission.id}.name`, mission.title)
    return t(`missions.${run.mission_id}.name`, `Mission #${run.mission_id}`)
  }
  if (run.theme) {
    return t(`themes.${run.theme}.displayName`, run.theme)
  }
  return t('history.default_mission_name', 'Chiến dịch khám phá')
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
          {t('history.login_required_desc')}
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
        <span>{t('history.btn_login')}</span>
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
        aria-hidden="true"
        tabIndex={-1}
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
        role="dialog"
        aria-modal="true"
        aria-label={t('history.answers_modal_title', 'Chi tiết câu trả lời')}
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
              {missionTitle} • {formatDateTime(run.created_at)}
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                          {t(
                            `missions.${run.mission_id}.questions.${q.id}.chapter`,
                            `Câu ${qIdx + 1}`,
                          )}
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
                        {t(
                          `missions.${run.mission_id}.questions.${q.id}.dialogue`,
                          `Tình huống ${qIdx + 1}`,
                        )}
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
                              <span style={{ flex: 1 }}>
                                {t(
                                  `missions.${run.mission_id}.questions.${q.id}.options.${opt.label}`,
                                )}
                              </span>
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
                                  ✓ {t('history.selected_answer')}
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
                  {t('history.no_answers_recorded')}
                </div>
              )}
            </div>
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
                          #{idx + 1} • {t(`roles.${q.role}.name`)}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.4 }}>
                        {t(`questions.${q.id}`)}
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
                          {t(`roles.${q.role}.name`)}
                        </span>
                      </div>
                      <div style={{ fontSize: 14, color: '#0F172A', lineHeight: 1.4 }}>
                        {t(`phase3_questions.${q.role}`)}
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

function HistoryCard({ run, isSelected, onToggleCompare, onOpenAnswers, onOpenReport, t }) {
  const roleConfig = getRoleConfig(run.primary_role)
  const title = getMissionTitle(run, t)
  const previewImg = getMissionPreviewImg(run)
  const formattedDate = formatDateTime(run.created_at)

  return (
    <div
      className={`history-grid-card fade-up ${isSelected ? 'selected' : ''}`}
      onClick={() => onToggleCompare(run.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggleCompare(run.id)
        }
      }}
      style={{
        backgroundColor: isSelected ? '#FAF5FF' : '#FFFFFF',
        borderRadius: 20,
        border: isSelected ? '2.5px solid #843497' : '1.5px solid #E2E8F0',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSelected
          ? '0 12px 28px -4px rgba(132, 52, 151, 0.22)'
          : '0 4px 18px -2px rgba(0, 0, 0, 0.04)',
        transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Top Image Frame with Compare Toggle Pill */}
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

        {/* Compare Select Checkbox Indicator */}
        {isSelected ? (
          <div
            aria-label={t('history.selected_for_compare', 'Đã chọn')}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: '#843497',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1.5px solid #843497',
              borderRadius: 9999,
              padding: '4px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
              fontWeight: 700,
              boxShadow: '0 3px 10px rgba(132, 52, 151, 0.3)',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            <Icon icon="mdi:check" width={14} height={14} />
            <span>{t('history.selected_for_compare', 'Đã chọn')}</span>
          </div>
        ) : (
          <div
            aria-label={t('history.select_to_compare', 'Chọn so sánh')}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: 'rgba(255, 255, 255, 0.88)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1.5px solid #CBD5E1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid #94A3B8',
              }}
            />
          </div>
        )}
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
                {t('history.primary_role_badge')}
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
              onClick={(e) => {
                e.stopPropagation()
                onOpenAnswers(run)
              }}
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
              onClick={(e) => {
                e.stopPropagation()
                onOpenReport(run)
              }}
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
  const itemsPerPage = useResponsiveItemsPerPage()
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modals & filters for History list
  const [selectedRunForAnswers, setSelectedRunForAnswers] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Compare selection state
  const [selectedCompareRunIds, setSelectedCompareRunIds] = useState([])
  const [showMaxLimitModal, setShowMaxLimitModal] = useState(false)

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
        if (err) setError(err.message || t('history.load_error'))
        else setRuns(data || [])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user, t])

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

  // Pagination for History List
  const totalPages = Math.ceil(filteredRuns.length / itemsPerPage) || 1
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedRuns = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage
    return filteredRuns.slice(start, start + itemsPerPage)
  }, [filteredRuns, validCurrentPage, itemsPerPage])

  const historyFromCount = paginatedRuns.length > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0
  const historyToCount =
    paginatedRuns.length > 0 ? (validCurrentPage - 1) * itemsPerPage + paginatedRuns.length : 0

  const handleToggleCompareRun = useCallback((runId) => {
    setSelectedCompareRunIds((prev) => {
      if (prev.includes(runId)) {
        return prev.filter((id) => id !== runId)
      }
      if (prev.length >= 2) {
        setShowMaxLimitModal(true)
        return prev
      }
      return [...prev, runId]
    })
  }, [])

  const handleNavigateCompare = useCallback(() => {
    if (selectedCompareRunIds.length !== 2) return
    const run1 = runs.find((r) => r.id === selectedCompareRunIds[0])
    const run2 = runs.find((r) => r.id === selectedCompareRunIds[1])
    navigate(
      `/history/compare?run1=${encodeURIComponent(selectedCompareRunIds[0])}&run2=${encodeURIComponent(selectedCompareRunIds[1])}`,
      {
        state: { run1, run2 },
      },
    )
  }, [selectedCompareRunIds, runs, navigate])

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
                fontSize: 24,
                fontWeight: 800,
                color: '#0F172A',
                margin: 0,
                letterSpacing: '-0.02em',
                fontFamily: 'var(--font-display)',
              }}
            >
              {t('history.title')}
            </h1>
            <p
              style={{
                fontSize: 14,
                color: '#64748B',
                margin: '4px 0 0 0',
              }}
            >
              {t('history.desc')}
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
            {t('history.breadcrumb_report')}
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
            {t('history.breadcrumb_detail')}
          </button>
          <span>/</span>
          <span style={{ color: '#843497', fontWeight: 700 }}>
            {t('history.breadcrumb_history')}
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
                <div>
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
                  <p
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      margin: '4px 0 0 0',
                      fontSize: 13,
                      color: '#64748B',
                    }}
                  >
                    <Icon icon="mdi:lightbulb-on-outline" width={16} height={16} color="#843497" />
                    <span>
                      {t(
                        'history.compare_hint',
                        'Mẹo: Nhấn vào thẻ để chọn và so sánh 2 lượt làm bài với nhau.',
                      )}
                    </span>
                  </p>
                </div>

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
                          {role === 'all' ? t('history.filter_all') : t(`roles.${role}.name`, role)}
                        </button>
                      ),
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
                      {t('history.sort_label')}
                    </span>
                    {[
                      { key: 'newest', label: t('history.sort_newest') },
                      { key: 'oldest', label: t('history.sort_oldest') },
                      { key: 'score', label: t('history.sort_score') },
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
                      isSelected={selectedCompareRunIds.includes(r.id)}
                      onToggleCompare={handleToggleCompareRun}
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
                      from: historyFromCount,
                      to: historyToCount,
                      total: filteredRuns.length,
                    })}
                  </div>

                  <Pagination
                    current={validCurrentPage}
                    total={totalPages}
                    onChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Invisible Friction Compare Bar */}
      {selectedCompareRunIds.length > 0 && (
        <div className="floating-compare-bar fade-up">
          <div className="compare-info-group">
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                backgroundColor: '#843497',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 12.5,
                flexShrink: 0,
              }}
            >
              {selectedCompareRunIds.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="compare-info-title"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('history.selected_runs_count', {
                  count: selectedCompareRunIds.length,
                  total: 2,
                })}
              </span>
              <span
                className="compare-info-subtext"
                style={{
                  fontSize: 11,
                  color: '#94A3B8',
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedCompareRunIds.length === 2
                  ? t('history.ready_to_compare', 'Sẵn sàng đối chiếu')
                  : t('history.pick_one_more', 'Chọn thêm 1 lượt nữa')}
              </span>
            </div>
          </div>

          <div className="compare-actions-group">
            <button
              onClick={() => setSelectedCompareRunIds([])}
              className="compare-cancel-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 8px',
                whiteSpace: 'nowrap',
              }}
            >
              {t('common.cancel', 'Hủy')}
            </button>

            <Button
              variant="solid"
              active={selectedCompareRunIds.length === 2}
              disabled={selectedCompareRunIds.length !== 2}
              onClick={handleNavigateCompare}
              className="compare-submit-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 12,
                fontWeight: 700,
                fontSize: 13,
                backgroundColor: selectedCompareRunIds.length === 2 ? '#843497' : '#334155',
                color: '#FFFFFF',
                border: 'none',
                cursor: selectedCompareRunIds.length === 2 ? 'pointer' : 'not-allowed',
                whiteSpace: 'nowrap',
                boxShadow:
                  selectedCompareRunIds.length === 2
                    ? '0 4px 14px rgba(132, 52, 151, 0.4)'
                    : 'none',
              }}
            >
              <Icon icon="mdi:compare-horizontal" width={16} height={16} />
              <span className="compare-btn-label-desktop">
                {t('history.btn_compare', 'So sánh kết quả')}
              </span>
              <span className="compare-btn-label-mobile">
                {t('history.btn_compare_short', 'So sánh')}
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Answers Detail Modal */}
      {selectedRunForAnswers && (
        <AnswersModal
          run={selectedRunForAnswers}
          onClose={() => setSelectedRunForAnswers(null)}
          onViewReport={handleOpenReport}
          t={t}
        />
      )}

      {/* Limit Modal Alert when trying to select 3rd run */}
      <Modal
        isOpen={showMaxLimitModal}
        onClose={() => setShowMaxLimitModal(false)}
        title={t('history.max_selection_warning_title', 'Giới hạn lượt so sánh')}
        description={t(
          'history.max_selection_warning_desc',
          'Chỉ được phép chọn tối đa 2 lượt làm test.',
        )}
        icon="mdi:alert-circle-outline"
        confirmText={t('common.understood', 'Đã hiểu')}
        onConfirm={() => setShowMaxLimitModal(false)}
      />
    </SceneShell>
  )
}
