import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import {
  CAPI_MISSIONS,
  PHASE1_QUESTIONS,
  PHASE3_QUESTIONS,
  getRoleConfig,
  getLayerConfig,
} from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import { supabase } from '../../lib/supabase.js'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import Pagination from '../Pagination.jsx'
import Modal from '../Modal.jsx'
import CapiImage from '../CapiImage.jsx'
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
        backgroundColor: 'var(--surface-light)',
        border: '1.5px solid var(--border-light)',
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
          backgroundColor: 'var(--surface-lavender)',
          border: '1px solid var(--border-purple)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
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
            color: 'var(--ink-dark)',
            margin: 0,
            fontFamily: 'var(--font-display)',
          }}
        >
          {t('history.login_required_title', 'Yêu cầu đăng nhập')}
        </h3>
        <p
          style={{
            fontSize: 15,
            color: 'var(--ink-secondary)',
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
        active
        onClick={handleLogin}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '12px 24px',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 15,
          width: '100%',
        }}
      >
        <Icon icon="mdi:google" width={20} height={20} />
        <span>{t('history.btn_login')}</span>
      </Button>
    </div>
  )
}

function getLayerBadge(layerKey, t) {
  if (!layerKey) return null
  const conf = getLayerConfig(layerKey)
  const label = t(`history.layer_${conf.key}`, conf.nameVn)

  return (
    <span
      style={{
        fontSize: 11.5,
        fontWeight: 600,
        color: conf.color,
        backgroundColor: conf.bg,
        border: `1px solid ${conf.border}`,
        padding: '2px 9px',
        borderRadius: 9999,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Icon icon="mdi:tag-outline" width={12} height={12} />
      {label}
    </span>
  )
}

function ScoreMeter({ score, roleConfig }) {
  const numericScore = typeof score === 'number' ? score : parseInt(score, 10) || 0
  const isPresent = score !== undefined && score !== null && !isNaN(numericScore)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '4px 8px',
        borderRadius: 8,
        backgroundColor: isPresent ? roleConfig.bg : 'var(--surface-subtle)',
        minWidth: 46,
        flexShrink: 0,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: isPresent ? roleConfig.color : 'var(--ink-muted)',
            lineHeight: 1,
          }}
        >
          {isPresent ? numericScore : '-'}
        </span>
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 600,
            color: 'var(--ink-muted)',
            lineHeight: 1,
          }}
        >
          /5
        </span>
      </div>
      <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        {[1, 2, 3, 4, 5].map((step) => {
          const isFilled = isPresent && numericScore >= step
          return (
            <div
              key={step}
              style={{
                width: 4.5,
                height: 4.5,
                borderRadius: '50%',
                backgroundColor: isFilled ? roleConfig.color : 'var(--border-light)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

function AnswersModal({ run, onClose, onViewReport, t }) {
  const [activeTab, setActiveTab] = useState('phase1')
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

  const p2QuestionsCount = mission?.questions?.length || 0

  return (
    <div className="answers-modal-overlay">
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
        className="glass answers-modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={t('history.answers_modal_title', 'Chi tiết câu trả lời')}
      >
        {/* Modal Header - Pinned at top */}
        <div className="answers-modal-header">
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 700,
                color: 'var(--ink-main)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {t('history.answers_modal_title', 'Chi tiết câu trả lời')}
            </h3>
            <div style={{ fontSize: 12.5, color: 'var(--ink-secondary)', marginTop: 3 }}>
              {missionTitle} • {formatDateTime(run.created_at)}
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t('common.close', 'Đóng')}
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              backgroundColor: 'var(--surface-subtle)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              transition: 'background-color 150ms ease, color 150ms ease',
            }}
          >
            <Icon icon="mdi:close" width={18} height={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs - Pinned with flexShrink: 0 */}
        <div className="answers-modal-tabs">
          {[
            {
              id: 'phase1',
              label: t('history.phase1_tab', 'Giai đoạn 1: Nhận thức'),
              badge: `${PHASE1_QUESTIONS.length} ${t('history.items_count', { count: '' }).trim()}`,
            },
            {
              id: 'phase2',
              label: t('history.phase2_tab', 'Giai đoạn 2: Nhiệm vụ'),
              badge: `${p2QuestionsCount} ${t('history.situations_count', { count: '' }).trim()}`,
            },
            {
              id: 'phase3',
              label: t('history.phase3_tab', 'Giai đoạn 3: Phản chiếu'),
              badge: `${PHASE3_QUESTIONS.length} ${t('history.roles_count', { count: '' }).trim()}`,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="answers-modal-tab-btn"
                style={{
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary)' : 'var(--ink-secondary)',
                  borderBottom: isActive
                    ? '2.5px solid var(--color-primary)'
                    : '2.5px solid transparent',
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '2px 7px',
                    borderRadius: 9999,
                    backgroundColor: isActive ? 'var(--surface-lavender)' : 'var(--surface-subtle)',
                    color: isActive ? 'var(--color-primary)' : 'var(--ink-secondary)',
                  }}
                >
                  {tab.badge}
                </span>
              </button>
            )
          })}
        </div>

        {/* Modal Scrollable Content - Pure open editorial layout, ZERO card-in-card */}
        <div className="answers-modal-content">
          {activeTab === 'phase1' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PHASE1_QUESTIONS.map((q, idx) => {
                const score = p1Answers[q.id]
                const roleConfig = getRoleConfig(q.role)
                const isLast = idx === PHASE1_QUESTIONS.length - 1
                return (
                  <div
                    key={q.id}
                    style={{
                      padding: '12px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: roleConfig.color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Icon icon={roleConfig.icon} width={14} height={14} />#{idx + 1} •{' '}
                          {t(`roles.${q.role}.name`)}
                        </span>
                      </div>
                      <div style={{ fontSize: 13.5, color: 'var(--ink-main)', lineHeight: 1.45 }}>
                        {t(`questions.${q.id}`)}
                      </div>
                    </div>
                    <ScoreMeter score={score} roleConfig={roleConfig} />
                  </div>
                )
              })}
            </div>
          )}

          {activeTab === 'phase2' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {mission?.questions?.length > 0 ? (
                mission.questions.map((q, qIdx) => {
                  const selectedOptLabel = p2Answers[q.id]
                  const isLastQuestion = qIdx === mission.questions.length - 1
                  return (
                    <div
                      key={q.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10,
                        paddingBottom: isLastQuestion ? 4 : 20,
                        borderBottom: isLastQuestion ? 'none' : '1px solid var(--border-light)',
                      }}
                    >
                      {/* Chapter and Layer Meta Header */}
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
                            fontSize: 12,
                            fontWeight: 800,
                            color: 'var(--color-primary)',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {t(
                            `missions.${run.mission_id}.questions.${q.id}.chapter`,
                            `Câu ${qIdx + 1}`,
                          )}
                        </span>
                        {q.layer && getLayerBadge(q.layer, t)}
                      </div>

                      {/* Scenario Dialogue Prompt */}
                      <div
                        style={{
                          fontSize: 14.5,
                          fontWeight: 600,
                          color: 'var(--ink-main)',
                          lineHeight: 1.45,
                        }}
                      >
                        {t(
                          `missions.${run.mission_id}.questions.${q.id}.dialogue`,
                          `Tình huống ${qIdx + 1}`,
                        )}
                      </div>

                      {/* Options without Left Color Bar */}
                      <div
                        style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 2 }}
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
                                lineHeight: 1.45,
                                backgroundColor: isSelected
                                  ? 'var(--surface-lavender)'
                                  : 'var(--surface-subtle)',
                                border: isSelected
                                  ? '1px solid var(--border-purple)'
                                  : '1px solid var(--border-light)',
                                color: 'var(--ink-main)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 10,
                                transition: 'background-color 150ms ease, border-color 150ms ease',
                              }}
                            >
                              <span
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: 4,
                                  backgroundColor: isSelected
                                    ? 'var(--color-primary)'
                                    : 'var(--surface-light)',
                                  color: isSelected ? '#FFFFFF' : 'var(--ink-secondary)',
                                  border: isSelected ? 'none' : '1px solid var(--border-light)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontWeight: 700,
                                  fontSize: 11.5,
                                  flexShrink: 0,
                                  marginTop: 1,
                                }}
                              >
                                {opt.label}
                              </span>
                              <span
                                style={{
                                  flex: 1,
                                  fontWeight: isSelected ? 600 : 400,
                                  lineHeight: 1.4,
                                }}
                              >
                                {t(
                                  `missions.${run.mission_id}.questions.${q.id}.options.${opt.label}`,
                                )}
                              </span>
                              {isSelected && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    fontWeight: 700,
                                    color: 'var(--color-primary)',
                                    backgroundColor: 'rgba(132, 52, 151, 0.12)',
                                    padding: '2px 8px',
                                    borderRadius: 9999,
                                    flexShrink: 0,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3,
                                  }}
                                >
                                  <Icon icon="mdi:check-bold" width={11} height={11} />
                                  {t('history.selected_answer', 'Bạn đã chọn')}
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
                <div
                  style={{ textAlign: 'center', padding: '30px', color: 'var(--ink-secondary)' }}
                >
                  {t('history.no_answers_recorded')}
                </div>
              )}
            </div>
          )}

          {activeTab === 'phase3' && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {PHASE3_QUESTIONS.map((q, idx) => {
                const score = p3Answers[q.role]
                const roleConfig = getRoleConfig(q.role)
                const isLast = idx === PHASE3_QUESTIONS.length - 1
                return (
                  <div
                    key={q.id}
                    style={{
                      padding: '12px 0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 14,
                      borderBottom: isLast ? 'none' : '1px solid var(--border-light)',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: roleConfig.color,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                          }}
                        >
                          <Icon icon={roleConfig.icon} width={14} height={14} />
                          {t(`roles.${q.role}.name`)}
                        </span>
                      </div>
                      <div style={{ fontSize: 13.5, color: 'var(--ink-main)', lineHeight: 1.45 }}>
                        {t(`phase3_questions.${q.role}`)}
                      </div>
                    </div>
                    <ScoreMeter score={score} roleConfig={roleConfig} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Modal Footer - Pinned at bottom */}
        <div className="answers-modal-footer">
          <Button variant="outline" onClick={onClose}>
            {t('common.close', 'Đóng')}
          </Button>
          <Button
            variant="solid"
            active
            onClick={() => onViewReport(run)}
            style={{
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
      className={`history-grid-card fade-up ${isSelected ? 'is-selected' : ''}`}
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
        backgroundColor: isSelected ? 'var(--surface-lavender)' : 'var(--surface-light)',
        borderRadius: 20,
        border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--border-light)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSelected
          ? '0 0 0 2px var(--color-primary), 0 12px 28px -6px rgba(132, 52, 151, 0.25)'
          : '0 4px 16px -2px rgba(0, 0, 0, 0.03)',
        transition:
          'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 150ms ease, box-shadow 150ms ease',
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
          backgroundColor: 'var(--surface-subtle)',
        }}
      >
        <CapiImage
          src={previewImg}
          alt={title}
          fallbackSrc="/illos/m1-preview.webp"
          theme="light"
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Compare Select Checkbox Indicator (Top-Left) */}
        {isSelected ? (
          <div
            aria-label={t('history.selected_for_compare', 'Đã chọn')}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 24,
              height: 24,
              borderRadius: 6,
              backgroundColor: 'var(--color-primary)',
              border: '2px solid var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(132, 52, 151, 0.4)',
              transition: 'background-color 150ms ease, border-color 150ms ease',
              userSelect: 'none',
            }}
          >
            <Icon icon="mdi:check-bold" width={15} height={15} />
          </div>
        ) : (
          <div
            aria-label={t('history.select_to_compare', 'Chọn so sánh')}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 24,
              height: 24,
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '2px solid var(--border-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
              transition: 'border-color 150ms ease, background-color 150ms ease',
              userSelect: 'none',
            }}
          />
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
              color: 'var(--ink-dark)',
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
              color: 'var(--ink-muted)',
            }}
          >
            <Icon icon="mdi:clock-outline" width={16} height={16} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Role Badge Container with Role-Specific Micro-Accents */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${isSelected ? 'var(--border-purple)' : 'var(--border-light)'}`,
              borderRadius: 14,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
              transition: 'border-color 150ms ease',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 800,
                  color: roleConfig.color,
                  textTransform: 'capitalize',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                {t(`roles.${roleConfig.key}.name`, roleConfig.name)}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ink-muted)',
                  fontWeight: 500,
                  marginTop: 1,
                }}
              >
                {t('history.primary_role_badge', 'Vai trò chính')}
              </div>
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: roleConfig.bg,
                color: roleConfig.color,
                border: `1px solid ${roleConfig.color}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 2px 8px -1px ${roleConfig.color}20`,
                flexShrink: 0,
              }}
            >
              <Icon icon={roleConfig.icon} width={20} height={20} />
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
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onOpenAnswers(run)
              }}
              style={{
                padding: '8px 10px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                gap: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span>{t('history.btn_view_answers', 'Xem câu trả lời')}</span>
              <Icon icon="mdi:arrow-top-right" width={15} height={15} />
            </Button>

            <Button
              variant="solid"
              active
              onClick={(e) => {
                e.stopPropagation()
                onOpenReport(run)
              }}
              style={{
                padding: '8px 10px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                gap: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span>{t('history.btn_view_report', 'Xem báo cáo')}</span>
              <Icon icon="mdi:eye-outline" width={16} height={16} />
            </Button>
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
  const { dominantRoleKey, roleCounts } = useMemo(() => {
    const counts = { builder: 0, explorer: 0, operator: 0, connector: 0, communicator: 0 }
    if (!runs.length) return { dominantRoleKey: 'connector', roleCounts: counts }
    for (const r of runs) {
      const rk = (r.primary_role || '').toLowerCase()
      if (counts[rk] !== undefined) counts[rk] += 1
      else counts[rk] = 1
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return { dominantRoleKey: sorted[0]?.[0] || 'connector', roleCounts: counts }
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

  return (
    <SceneShell light>
      {/* Ambient Lighting Background */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 1200,
          height: 480,
          background:
            'radial-gradient(ellipse 65% 55% at 50% 12%, rgba(132, 52, 151, 0.09) 0%, rgba(2, 132, 199, 0.04) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div className="history-page-shell">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'var(--ink-muted)',
            marginBottom: -8,
          }}
        >
          <button
            onClick={() => navigate('/certificate/summary')}
            style={{
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              transition: 'color 150ms ease',
            }}
          >
            {t('history.breadcrumb_report')}
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/certificate/details')}
            style={{
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              transition: 'color 150ms ease',
            }}
          >
            {t('history.breadcrumb_detail')}
          </button>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            {t('history.breadcrumb_history')}
          </span>
        </nav>

        {/* Integrated Page Header */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--ink-main)',
              margin: 0,
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-display)',
            }}
          >
            {t('history.title')}
          </h1>
          <p
            style={{
              fontSize: 14.5,
              color: 'var(--ink-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {t('history.desc')}
          </p>
        </div>

        {!user ? (
          <LoginPrompt handleLogin={handleLogin} t={t} />
        ) : loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div
              className="mono"
              style={{ color: 'var(--ink-muted)', fontSize: 14, textAlign: 'center' }}
            >
              <Icon
                icon="mdi:loading"
                width={28}
                height={28}
                className="spin"
                style={{
                  margin: '0 auto 12px auto',
                  display: 'block',
                  color: 'var(--color-primary)',
                }}
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
              color: 'var(--color-danger, #E11D48)',
              borderColor: 'rgba(225, 29, 72, 0.2)',
              backgroundColor: 'rgba(225, 29, 72, 0.05)',
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
            {/* Section 1: Bento Dossier Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: 'var(--ink-main)',
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t('history.overview_title', 'Tổng quan')}
                </h2>
              </div>

              <div className="bento-dossier-grid fade-up">
                {/* Bento Card 1: Dominant Role Hero Spotlight */}
                <div
                  className="bento-dossier-card bento-hero-card"
                  style={{
                    backgroundImage: `radial-gradient(circle at 92% 12%, ${dominantRoleConfig.color}15 0%, transparent 55%)`,
                  }}
                >
                  <div className="bento-hero-header">
                    <span className="bento-tag" style={{ color: dominantRoleConfig.color }}>
                      <Icon icon="mdi:crown-outline" width={16} />
                      {t('history.dominant_archetype', 'Hình mẫu chủ đạo')}
                    </span>
                    <span className="bento-role-pct">
                      {Math.round(
                        ((roleCounts[dominantRoleKey] || 0) / (totalExperiences || 1)) * 100,
                      )}
                      % {t('history.frequency', 'tổng số lượt')}
                    </span>
                  </div>

                  <div className="bento-hero-body">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        className="bento-hero-role-title"
                        style={{ color: dominantRoleConfig.color }}
                      >
                        {t(`roles.${dominantRoleKey}.name`, dominantRoleConfig.name)}
                      </h3>
                      <p className="bento-hero-role-desc">
                        {dominantRoleConfig.nameVn} •{' '}
                        {t('history.top_role_sub', 'Role xuất hiện nhiều nhất qua các bài làm.')}
                      </p>
                    </div>

                    <div
                      className="bento-hero-icon-emblem"
                      style={{
                        backgroundColor: dominantRoleConfig.bg,
                        color: dominantRoleConfig.color,
                        border: `1.5px solid ${dominantRoleConfig.color}35`,
                        boxShadow: `0 8px 24px -4px ${dominantRoleConfig.color}25`,
                      }}
                    >
                      <Icon icon={dominantRoleConfig.icon} width={34} height={34} />
                    </div>
                  </div>

                  {/* Archetype Distribution Strip */}
                  <div className="bento-role-distribution">
                    {['builder', 'explorer', 'operator', 'connector', 'communicator'].map(
                      (roleKey) => {
                        const count = roleCounts[roleKey] || 0
                        const rc = getRoleConfig(roleKey)
                        return (
                          <div
                            key={roleKey}
                            className="bento-role-pill"
                            style={{
                              borderColor:
                                roleKey === dominantRoleKey ? rc.color : 'var(--border-light)',
                              backgroundColor:
                                roleKey === dominantRoleKey ? rc.bg : 'var(--surface-light)',
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: rc.color,
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ fontWeight: 700, color: rc.color }}>
                              {t(`roles.${roleKey}.name`, rc.name)}
                            </span>
                            <span style={{ color: 'var(--ink-muted)', fontSize: 11 }}>{count}</span>
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>

                {/* Bento Card 2: Quest Progress & Metrics */}
                <div className="bento-dossier-card bento-stats-card">
                  <div className="bento-stats-header">
                    <span className="bento-tag">
                      <Icon icon="mdi:compass-rose" width={16} />
                      {t('history.quest_progress', 'Hành trình khám phá')}
                    </span>
                    <span className="bento-level-badge">
                      Level {Math.max(1, Math.floor(totalExperiences / 2))}
                    </span>
                  </div>

                  <div className="bento-stats-main">
                    <div className="bento-stat-number-wrapper">
                      <span className="bento-stat-huge-number">{totalExperiences}</span>
                      <span className="bento-stat-unit">{t('history.runs_unit', 'lượt làm')}</span>
                    </div>
                    <p className="bento-stat-subtext">
                      {t(
                        'history.total_runs_sub',
                        'Số lần đã hoàn thành bài mô phỏng nghề nghiệp.',
                      )}
                    </p>
                  </div>

                  <div className="bento-stats-footer">
                    <div className="bento-stat-footer-item">
                      <Icon
                        icon="mdi:clock-check-outline"
                        width={18}
                        style={{ color: 'var(--color-primary)' }}
                      />
                      <span>
                        {filteredRuns.length} {t('history.filtered_count', 'lượt hiển thị')}
                      </span>
                    </div>
                    <div className="bento-stat-footer-item">
                      <Icon
                        icon="mdi:shield-check-outline"
                        width={18}
                        style={{ color: 'var(--color-success, #059669)' }}
                      />
                      <span>{t('history.authenticated_data', 'Dữ liệu đã đồng bộ')}</span>
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
                      color: 'var(--ink-main)',
                      margin: 0,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {t('history.list_title', 'Lịch sử làm bài')}
                  </h2>
                  <div
                    className="history-compare-hint"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      margin: '8px 0 0 0',
                      padding: '6px 14px',
                      borderRadius: 9999,
                      backgroundColor: 'var(--surface-lavender)',
                      border: '1px solid var(--border-purple)',
                      color: 'var(--color-primary)',
                      fontSize: 13,
                      fontWeight: 600,
                      boxShadow: '0 2px 6px rgba(132, 52, 151, 0.08)',
                      width: 'fit-content',
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 0 6px rgba(132, 52, 151, 0.3)',
                      }}
                    >
                      <Icon icon="mdi:lightbulb-on" width={13} height={13} />
                    </div>
                    <span>
                      {t(
                        'history.compare_hint',
                        'Mẹo: Nhấn vào thẻ để chọn và so sánh 2 lượt làm bài với nhau.',
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setFilterOpen((o) => !o)}
                  aria-label={t('history.filter_by_role', 'Lọc danh sách')}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid var(--border-light)',
                    backgroundColor: filterOpen
                      ? 'var(--surface-lavender)'
                      : 'var(--surface-light)',
                    color: filterOpen ? 'var(--color-primary)' : 'var(--ink-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition:
                      'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
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
                    backgroundColor: 'var(--surface-light)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-secondary)' }}>
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
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-secondary)' }}>
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
                    color: 'var(--ink-secondary)',
                    backgroundColor: 'var(--surface-light)',
                    borderColor: 'var(--border-light)',
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
                  className="history-cards-grid"
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
                  className="history-pagination-wrapper"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <div
                    className="history-pagination-info"
                    style={{ fontSize: 14, color: 'var(--ink-secondary)' }}
                  >
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

      {/* Floating Compare Action Bar (Centered Light Frosted Glass) */}
      {selectedCompareRunIds.length > 0 && (
        <div className="floating-compare-bar">
          <div className="compare-info-group">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13,
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(132, 52, 151, 0.35)',
              }}
            >
              {selectedCompareRunIds.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="compare-info-title"
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: 'var(--ink-main)',
                  fontFamily: 'var(--font-display)',
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
                  fontSize: 11.5,
                  color:
                    selectedCompareRunIds.length === 2
                      ? 'var(--color-primary)'
                      : 'var(--ink-secondary)',
                  fontWeight: selectedCompareRunIds.length === 2 ? 600 : 500,
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
                color: 'var(--ink-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 8,
                whiteSpace: 'nowrap',
                transition: 'color 150ms ease, background-color 150ms ease',
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
                padding: '9px 18px',
                borderRadius: 9999,
                fontWeight: 700,
                fontSize: 13,
                whiteSpace: 'nowrap',
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
