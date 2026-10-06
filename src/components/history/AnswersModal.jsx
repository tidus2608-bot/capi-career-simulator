import React, { useState, useEffect } from 'react'
import { Icon } from '@iconify/react'
import {
  CAPI_MISSIONS,
  PHASE1_QUESTIONS,
  PHASE3_QUESTIONS,
  getRoleConfig,
  getLayerConfig,
} from '../../data.js'
import Button from '../Button.jsx'
import { formatDateTime } from '../../lib/format.js'
import { getMissionTitle } from './historyUtils.js'

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

export default function AnswersModal({ run, onClose, onViewReport, t }) {
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
