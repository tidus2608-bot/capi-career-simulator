import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { supabase } from '../../lib/supabase.js'

const TOTAL_QUESTIONS = 13
const PROGRESS_PERCENT = Array.from({ length: TOTAL_QUESTIONS }, (_, i) =>
  Math.round((i / (TOTAL_QUESTIONS - 1)) * 100),
)

export default function FeedbackScene() {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [consentGiven, setConsentGiven] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const searchParams = new URLSearchParams(location.search)
  const runId = searchParams.get('run') || null

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

  const getWordCount = (str) => {
    if (!str || typeof str !== 'string') return 0
    return str.trim().split(/\s+/).filter(Boolean).length
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
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
      window.scrollTo({ top: 0, behavior: 'smooth' })
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

  if (isSubmitted) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#FEFEFF',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 24px',
          fontFamily: "'Quicksand', 'Plus Jakarta Sans', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: '640px',
            width: '100%',
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '48px 32px',
            textAlign: 'center',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
            border: '1px solid #E5E7EB',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <img
            src="/images/capi-survey.png"
            alt="Capi Thank You"
            style={{ width: '120px', height: 'auto', objectFit: 'contain' }}
          />

          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 700,
              color: '#1A1A1A',
            }}
          >
            {t('feedback.thank_you_title')}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#4B5563',
              fontWeight: 500,
            }}
          >
            {t('feedback.thank_you_desc')}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              width: '100%',
              marginTop: '12px',
            }}
          >
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '12px',
                border: '1.5px solid #843497',
                backgroundColor: '#FFFFFF',
                color: '#843497',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t('feedback.btn_back_home')}
            </button>
            <button
              type="button"
              onClick={() => window.close()}
              style={{
                flex: 1,
                padding: '14px 20px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: '#843497',
                color: '#FFFFFF',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(132, 52, 151, 0.25)',
              }}
            >
              {t('feedback.btn_close_tab')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FEFEFF',
        padding: '24px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Quicksand', 'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          backgroundColor: '#F2F2F2',
          borderRadius: '100px',
          padding: '16px 36px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          marginBottom: '40px',
          boxSizing: 'border-box',
        }}
      >
        <img
          src="/images/capi-survey.png"
          alt="Capi"
          style={{ width: '64px', height: '60px', objectFit: 'contain', flexShrink: 0 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: 700,
              color: '#1A1A1A',
              lineHeight: 1.3,
            }}
          >
            {t('feedback.header_title')}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: '14px',
              fontWeight: 500,
              color: '#808080',
              lineHeight: 1.3,
            }}
          >
            {t('feedback.header_subtitle')}
          </p>
        </div>
      </div>

      {/* Main Survey Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '800px',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
      >
        {/* Progress Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#1A1A1A',
              }}
            >
              {t('feedback.progress_question', { current: progressNum, total: totalNum })}
            </span>
            <span
              style={{
                fontSize: '18px',
                fontWeight: 600,
                color: '#843497',
              }}
            >
              {t('feedback.progress_percent', { percent })}
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: '100%',
              height: '8px',
              backgroundColor: '#E5E5E5',
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
        <h2
          style={{
            margin: '8px 0 0',
            fontSize: '24px',
            fontWeight: 700,
            color: '#1A1A1A',
            lineHeight: 1.4,
            textAlign: currentQ.type === 'rating' ? 'center' : 'left',
          }}
        >
          {t(currentQ.titleKey)}
        </h2>

        {/* Question Body by Type */}
        {currentQ.type === 'choice' && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {currentQ.options.map((opt) => {
              const isSelected = currentAnswer === opt.value
              return (
                <button
                  key={opt.key}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleSelectChoice(opt.value)}
                    width: '100%',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    backgroundColor: isSelected ? '#F6ECFB' : '#F5F6FA',
                    border: isSelected ? '1.5px solid #843497' : '1.5px solid transparent',
                    color: isSelected ? '#843497' : '#1A1A1A',
                    fontSize: '17px',
                    fontWeight: isSelected ? 700 : 600,
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.18s ease',
                    boxShadow: isSelected ? '0 4px 12px rgba(132, 52, 151, 0.1)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#EAEBF2'
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F5F6FA'
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
              gap: '20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                gap: '16px',
                width: '100%',
                justifyContent: 'center',
              }}
            >
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected = currentAnswer === val
                return (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectChoice(val)}
                    style={{
                      flex: 1,
                      maxWidth: '140px',
                      height: '130px',
                      borderRadius: '20px',
                      backgroundColor: isSelected ? '#843497' : '#E5E5E5',
                      color: isSelected ? '#FFFFFF' : '#1A1A1A',
                      fontSize: '36px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.18s ease',
                      boxShadow: isSelected ? '0 8px 24px rgba(132, 52, 151, 0.3)' : 'none',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#D8D8D8'
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#E5E5E5'
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
                color: '#808080',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <Icon icon="mdi:information-outline" width={18} height={18} />
              <span>{t('feedback.rating_note')}</span>
            </div>
          </div>
        )}

        {currentQ.type === 'text' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <textarea
              rows={8}
              value={currentAnswer || ''}
              onChange={handleTextChange}
              placeholder={t(currentQ.placeholderKey)}
              style={{
                width: '100%',
                padding: '20px',
                borderRadius: '16px',
                backgroundColor: '#F5F6FA',
                border: '1.5px solid #E5E5E5',
                fontSize: '16px',
                fontFamily: 'inherit',
                color: '#1A1A1A',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box',
                lineHeight: 1.5,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#843497'
                e.currentTarget.style.backgroundColor = '#FFFFFF'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E5E5'
                e.currentTarget.style.backgroundColor = '#F5F6FA'
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '13px',
                color: '#808080',
                fontWeight: 500,
              }}
            >
              <span>{t('feedback.max_words_hint')}</span>
              <span>{t('feedback.word_count', { count: getWordCount(currentAnswer) })}</span>
            </div>
          </div>
        )}

        {currentQ.type === 'bugs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '18px 24px',
                      borderRadius: '16px',
                      backgroundColor: isChecked ? '#F6ECFB' : '#F5F6FA',
                      border: isChecked ? '1.5px solid #843497' : '1.5px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      textAlign: 'left',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#1A1A1A',
                      }}
                    >
                      {t(opt.labelKey)}
                    </span>
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: isChecked ? 'none' : '1.5px solid #808080',
                        backgroundColor: isChecked ? '#843497' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#FFFFFF',
                      }}
                    >
                      {isChecked && <Icon icon="mdi:check" width={16} height={16} />}
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
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: '#F9FAFB',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                cursor: 'pointer',
                userSelect: 'none',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: consentGiven ? 'none' : '1.5px solid #808080',
                  backgroundColor: consentGiven ? '#843497' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  flexShrink: 0,
                }}
              >
                {consentGiven && <Icon icon="mdi:check" width={14} height={14} />}
              </div>
              <span
                style={{ fontSize: '13px', lineHeight: 1.4, color: '#4B5563', fontWeight: 500 }}
              >
                {t('feedback.consent_text')}
              </span>
            </button>
          </div>
        )}

        {submitError && (
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              color: '#DC2626',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            {submitError}
          </div>
        )}

        {/* Buttons Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '16px',
          }}
        >
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrev}
            style={{
              flex: 1,
              padding: '14px 24px',
              borderRadius: '12px',
              border: '1.5px solid #843497',
              backgroundColor: '#FFFFFF',
              color: '#843497',
              fontSize: '16px',
              fontWeight: 600,
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              opacity: currentIndex === 0 ? 0.35 : 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.18s ease',
            }}
          >
            <Icon icon="mdi:arrow-left" width={18} height={18} />
            <span>{t('feedback.btn_back')}</span>
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              type="button"
              disabled={!isCurrentValid()}
              onClick={handleNext}
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isCurrentValid() ? '#843497' : '#E5E5E5',
                color: isCurrentValid() ? '#FFFFFF' : '#808080',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isCurrentValid() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.18s ease',
                boxShadow: isCurrentValid() ? '0 4px 12px rgba(132, 52, 151, 0.25)' : 'none',
              }}
            >
              <span>{t('feedback.btn_next')}</span>
              <Icon icon="mdi:arrow-right" width={18} height={18} />
            </button>
          ) : (
            <button
              type="button"
              disabled={!isCurrentValid() || isSubmitting}
              onClick={handleSubmit}
              style={{
                flex: 1,
                padding: '14px 24px',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isCurrentValid() && !isSubmitting ? '#843497' : '#E5E5E5',
                color: isCurrentValid() && !isSubmitting ? '#FFFFFF' : '#808080',
                fontSize: '16px',
                fontWeight: 600,
                cursor: isCurrentValid() && !isSubmitting ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.18s ease',
                boxShadow: isCurrentValid() ? '0 4px 12px rgba(132, 52, 151, 0.25)' : 'none',
              }}
            >
              <span>{isSubmitting ? t('feedback.btn_submitting') : t('feedback.btn_finish')}</span>
              {!isSubmitting && <Icon icon="mdi:check" width={18} height={18} />}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
