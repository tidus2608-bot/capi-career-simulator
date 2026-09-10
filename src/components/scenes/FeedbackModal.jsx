import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { supabase } from '../../lib/supabase.js'
import { getWordCount } from '../../lib/format.js'
import CapiImage from '../CapiImage.jsx'
import Button from '../Button.jsx'

const TOTAL_QUESTIONS = 13
const PROGRESS_PERCENT = Array.from({ length: TOTAL_QUESTIONS }, (_, i) =>
  Math.round((i / (TOTAL_QUESTIONS - 1)) * 100),
)

function FeedbackModalContent({ onClose, runId }) {
  const { t } = useTranslation()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [consentGiven, setConsentGiven] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // ESC key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const questions = [
    {
      id: 'q1',
      type: 'choice',
      titleKey: 'feedback.q1_title',
      options: [
        { key: 'q1_opt1', labelKey: 'feedback.q1_opt1', value: 1 },
        { key: 'q1_opt2', labelKey: 'feedback.q1_opt2', value: 2 },
        { key: 'q1_opt3', labelKey: 'feedback.q1_opt3', value: 3 },
        { key: 'q1_opt4', labelKey: 'feedback.q1_opt4', value: 4 },
        { key: 'q1_opt5', labelKey: 'feedback.q1_opt5', value: 5 },
      ],
      required: true,
    },
    {
      id: 'q2',
      type: 'rating',
      titleKey: 'feedback.q2_title',
      required: true,
    },
    {
      id: 'q3',
      type: 'rating',
      titleKey: 'feedback.q3_title',
      required: true,
    },
    {
      id: 'q4',
      type: 'rating',
      titleKey: 'feedback.q4_title',
      required: true,
    },
    {
      id: 'q5',
      type: 'rating',
      titleKey: 'feedback.q5_title',
      required: true,
    },
    {
      id: 'q6',
      type: 'rating',
      titleKey: 'feedback.q6_title',
      required: true,
    },
    {
      id: 'q7',
      type: 'rating',
      titleKey: 'feedback.q7_title',
      required: true,
    },
    {
      id: 'q8',
      type: 'rating',
      titleKey: 'feedback.q8_title',
      required: true,
    },
    {
      id: 'q9',
      type: 'choice',
      titleKey: 'feedback.q9_title',
      options: [
        { key: 'q9_opt1', labelKey: 'feedback.q9_opt1', value: 'story' },
        { key: 'q9_opt2', labelKey: 'feedback.q9_opt2', value: 'situations' },
        { key: 'q9_opt3', labelKey: 'feedback.q9_opt3', value: 'roles' },
        { key: 'q9_opt4', labelKey: 'feedback.q9_opt4', value: 'radar' },
        { key: 'q9_opt5', labelKey: 'feedback.q9_opt5', value: 'careers' },
        { key: 'q9_opt6', labelKey: 'feedback.q9_opt6', value: 'activities' },
        { key: 'q9_opt7', labelKey: 'feedback.q9_opt7', value: 'other' },
      ],
      required: true,
    },
    {
      id: 'q10',
      type: 'text',
      titleKey: 'feedback.q10_title',
      placeholderKey: 'feedback.q10_placeholder',
      required: false,
    },
    {
      id: 'q11',
      type: 'choice',
      titleKey: 'feedback.q11_title',
      options: [
        { key: 'q11_opt1', labelKey: 'feedback.q11_opt1', value: 1 },
        { key: 'q11_opt2', labelKey: 'feedback.q11_opt2', value: 2 },
        { key: 'q11_opt3', labelKey: 'feedback.q11_opt3', value: 3 },
        { key: 'q11_opt4', labelKey: 'feedback.q11_opt4', value: 4 },
        { key: 'q11_opt5', labelKey: 'feedback.q11_opt5', value: 5 },
      ],
      required: true,
    },
    {
      id: 'q12',
      type: 'text',
      titleKey: 'feedback.q12_title',
      placeholderKey: 'feedback.q12_placeholder',
      required: false,
    },
    {
      id: 'q13',
      type: 'bugs',
      titleKey: 'feedback.q13_title',
      options: [
        { key: 'q13_bug1', labelKey: 'feedback.q13_bug1', value: 'cant_proceed' },
        { key: 'q13_bug2', labelKey: 'feedback.q13_bug2', value: 'content_error' },
        { key: 'q13_bug3', labelKey: 'feedback.q13_bug3', value: 'image_failed' },
        { key: 'q13_bug4', labelKey: 'feedback.q13_bug4', value: 'no_result' },
        { key: 'q13_bug5', labelKey: 'feedback.q13_bug5', value: 'ui_glitch' },
        { key: 'q13_bug6', labelKey: 'feedback.q13_bug6', value: 'other' },
      ],
      required: false,
    },
  ]

  const currentQ = questions[currentIndex]
  const currentAnswer = answers[currentQ?.id]

  const isCurrentValid = () => {
    if (!currentQ) return false
    if (currentIndex === questions.length - 1) {
      return consentGiven
    }
    if (!currentQ.required) return true
    if (currentQ.type === 'choice' || currentQ.type === 'rating') {
      return currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== ''
    }
    return true
  }

  const handleSelectChoice = (val) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))
  }

  const handleToggleBug = (val) => {
    const list = Array.isArray(currentAnswer) ? [...currentAnswer] : []
    const idx = list.indexOf(val)
    if (idx >= 0) {
      list.splice(idx, 1)
    } else {
      list.push(val)
    }
    setAnswers((prev) => ({ ...prev, [currentQ.id]: list }))
  }

  const handleTextChange = (e) => {
    const val = e.target.value
    const words = val.trim().split(/\s+/).filter(Boolean)
    if (words.length <= 500) {
      setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
    }
  }

  const handleSubmit = async () => {
    if (!consentGiven) return
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      let userId = null
      try {
        const { data } = await supabase.auth.getUser()
        userId = data?.user?.id || null
      } catch (e) {
        void e
      }

      const row = {
        run_id: runId,
        user_id: userId,
        answers: answers,
        consent_given: true,
      }

      const { error } = await supabase.from('feedback_responses').insert(row)
      if (error) throw error

      setIsSubmitted(true)
    } catch (err) {
      console.error('Failed to submit feedback:', err)
      setSubmitError(t('feedback.submit_error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressNum = String(currentIndex + 1).padStart(2, '0')
  const totalNum = String(questions.length).padStart(2, '0')
  const percent = PROGRESS_PERCENT[currentIndex] ?? 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      className="feedback-modal-overlay"
    >
      <button
        type="button"
        aria-label="Backdrop"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'default',
        }}
      />
      <div className="feedback-modal-dialog" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header Bar */}
        <div className="feedback-modal-header">
          <div className="feedback-modal-header-left">
            <CapiImage
              src="/images/capi-survey.webp"
              alt="Capi"
              className="feedback-modal-header-mascot"
              width={42}
              height={42}
              theme="light"
            />
            <div>
              <h2 id="feedback-modal-title" className="feedback-modal-header-title">
                {t('feedback.header_title')}
              </h2>
              <p className="feedback-modal-header-subtitle">{t('feedback.header_subtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label={t('common.close', 'Đóng')}
            onClick={onClose}
            className="feedback-modal-close-btn"
          >
            <Icon icon="mdi:close" width={20} height={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="feedback-modal-body">
          {isSubmitted ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '24px 16px',
                gap: '16px',
              }}
            >
              <CapiImage
                src="/images/capi-survey.png"
                fallbackSrc="/images/capi-survey.webp"
                alt="Capi Thank You"
                className="feedback-thankyou-mascot"
                width={88}
                height={88}
                theme="light"
                objectFit="contain"
              />

              <h3 className="feedback-thankyou-title">{t('feedback.thank_you_title')}</h3>

              <p className="feedback-thankyou-desc">{t('feedback.thank_you_desc')}</p>

              <Button
                variant="solid"
                active
                onClick={onClose}
                style={{
                  minWidth: '160px',
                  marginTop: '12px',
                  height: '44px',
                }}
              >
                {t('common.close', 'Đóng')}
              </Button>
            </div>
          ) : (
            <>
              {/* Progress Section */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="feedback-progress-title" style={{ fontSize: '16px' }}>
                    {t('feedback.progress_question', { current: progressNum, total: totalNum })}
                  </span>
                  <span className="feedback-progress-pct" style={{ fontSize: '15px' }}>
                    {t('feedback.progress_percent', { percent })}
                  </span>
                </div>

                <div
                  style={{
                    width: '100%',
                    height: '6px',
                    backgroundColor: '#E5E7EB',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${percent}%`,
                      height: '100%',
                      backgroundColor: '#843497',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>

              {/* Question Title */}
              <h3
                className="feedback-question-title"
                style={{
                  fontSize: '18px',
                  marginTop: '4px',
                  textAlign: currentQ.type === 'rating' ? 'center' : 'left',
                }}
              >
                {t(currentQ.titleKey)}
              </h3>

              {/* Question Body by Type */}
              {currentQ.type === 'choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentQ.options.map((opt) => {
                    const isSelected = currentAnswer === opt.value
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => handleSelectChoice(opt.value)}
                        className="feedback-choice-btn"
                        style={{
                          backgroundColor: isSelected ? '#F6ECFB' : '#F8FAFC',
                          border: isSelected ? '1.5px solid #843497' : '1.5px solid #E2E8F0',
                          color: isSelected ? '#843497' : '#1A1A1A',
                          fontWeight: isSelected ? 700 : 600,
                          padding: '12px 16px',
                          boxShadow: isSelected ? '0 4px 12px rgba(132, 52, 151, 0.1)' : 'none',
                        }}
                      >
                        {t(opt.labelKey)}
                      </button>
                    )
                  })}
                </div>
              )}

              {currentQ.type === 'rating' && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <div className="feedback-rating-grid">
                    {[1, 2, 3, 4, 5].map((val) => {
                      const isSelected = currentAnswer === val
                      return (
                        <button
                          key={val}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleSelectChoice(val)}
                          className="feedback-rating-btn"
                          style={{
                            backgroundColor: isSelected ? '#843497' : '#E2E8F0',
                            color: isSelected ? '#FFFFFF' : '#1E293B',
                            boxShadow: isSelected ? '0 8px 24px rgba(132, 52, 151, 0.3)' : 'none',
                            width: '48px',
                            height: '48px',
                            fontSize: '18px',
                          }}
                        >
                          {val}
                        </button>
                      )
                    })}
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#64748B',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    <Icon icon="mdi:information-outline" width={16} height={16} />
                    <span>{t('feedback.rating_note')}</span>
                  </div>
                </div>
              )}

              {currentQ.type === 'text' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <textarea
                    rows={6}
                    value={currentAnswer || ''}
                    onChange={handleTextChange}
                    placeholder={t(currentQ.placeholderKey)}
                    className="feedback-textarea"
                    style={{ padding: '12px 16px', fontSize: '14px' }}
                  />
                  <div className="feedback-word-counter">
                    <span>{t('feedback.max_words_hint')}</span>
                    <span>{t('feedback.word_count', { count: getWordCount(currentAnswer) })}</span>
                  </div>
                </div>
              )}

              {currentQ.type === 'bugs' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {currentQ.options.map((opt) => {
                      const list = Array.isArray(currentAnswer) ? currentAnswer : []
                      const isChecked = list.includes(opt.value)
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          role="checkbox"
                          aria-checked={isChecked}
                          onClick={() => handleToggleBug(opt.value)}
                          className="feedback-checkbox-btn"
                          style={{
                            backgroundColor: isChecked ? '#F6ECFB' : '#F8FAFC',
                            border: isChecked ? '1.5px solid #843497' : '1.5px solid #E2E8F0',
                            padding: '12px 16px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '14px',
                              fontWeight: 600,
                              color: '#1A1A1A',
                            }}
                          >
                            {t(opt.labelKey)}
                          </span>
                          <div
                            className="feedback-checkbox-box"
                            style={{
                              border: isChecked ? 'none' : '1.5px solid #94A3B8',
                              backgroundColor: isChecked ? '#843497' : 'transparent',
                            }}
                          >
                            {isChecked && <Icon icon="mdi:check" width={14} height={14} />}
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={consentGiven}
                    onClick={() => setConsentGiven((c) => !c)}
                    className="feedback-consent-card"
                    style={{ padding: '12px 16px' }}
                  >
                    <div
                      className="feedback-checkbox-box"
                      style={{
                        border: consentGiven ? 'none' : '1.5px solid #94A3B8',
                        backgroundColor: consentGiven ? '#843497' : 'transparent',
                        width: '18px',
                        height: '18px',
                        flexShrink: 0,
                      }}
                    >
                      {consentGiven && <Icon icon="mdi:check" width={14} height={14} />}
                    </div>
                    <span
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.4,
                        color: '#475569',
                        fontWeight: 500,
                      }}
                    >
                      {t('feedback.consent_text')}
                    </span>
                  </button>
                </div>
              )}

              {submitError && <div className="feedback-error-banner">{submitError}</div>}

              {/* Buttons Nav */}
              <div className="feedback-actions-row" style={{ marginTop: '8px' }}>
                <Button
                  variant="outline"
                  disabled={currentIndex === 0}
                  onClick={handlePrev}
                  style={{
                    height: '42px',
                    fontSize: 'var(--text-sm)',
                    gap: '6px',
                    padding: '8px 16px',
                    opacity: currentIndex === 0 ? 0.35 : 1,
                  }}
                >
                  <Icon icon="mdi:arrow-left" width={18} height={18} />
                  <span>{t('feedback.btn_back')}</span>
                </Button>

                {currentIndex < questions.length - 1 ? (
                  <Button
                    variant="solid"
                    active={isCurrentValid()}
                    disabled={!isCurrentValid()}
                    onClick={handleNext}
                    style={{
                      height: '42px',
                      fontSize: 'var(--text-sm)',
                      gap: '6px',
                      padding: '8px 20px',
                    }}
                  >
                    <span>{t('feedback.btn_next')}</span>
                    <Icon icon="mdi:arrow-right" width={18} height={18} />
                  </Button>
                ) : (
                  <Button
                    variant="solid"
                    active={isCurrentValid() && !isSubmitting}
                    disabled={!isCurrentValid() || isSubmitting}
                    onClick={handleSubmit}
                    style={{
                      height: '42px',
                      fontSize: 'var(--text-sm)',
                      gap: '6px',
                      padding: '8px 20px',
                    }}
                  >
                    <span>
                      {isSubmitting ? t('feedback.btn_submitting') : t('feedback.btn_finish')}
                    </span>
                    {!isSubmitting && <Icon icon="mdi:check" width={18} height={18} />}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function FeedbackModal({ isOpen, onClose, runId = null }) {
  if (!isOpen) return null
  return <FeedbackModalContent onClose={onClose} runId={runId} />
}
