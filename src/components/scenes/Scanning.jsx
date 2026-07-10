import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import { PHASE1_QUESTIONS, CONFIDENCE_CHECKS } from '../../data.js'
import SceneShell from './SceneShell.jsx'

export default function ScanningScene({ onComplete }) {
  const { t } = useTranslation()

  useEffect(() => {
    capiAudio.pad([130.8, 196, 261.6, 392], 'cold')
  }, [])

  // Pick exactly 3 random questions for each role
  const [selectedQuestions] = useState(() => {
    const roles = ['explorer', 'builder', 'operator', 'connector', 'communicator']
    const chosen = []
    for (const r of roles) {
      const qForRole = PHASE1_QUESTIONS.filter((q) => q.role === r)
      const shuffled = [...qForRole].sort(() => Math.random() - 0.5)
      chosen.push(...shuffled.slice(0, 3))
    }
    // Shuffle the final 15 questions so they appear in a random order
    return chosen.sort(() => Math.random() - 0.5)
  })

  const total = selectedQuestions.length + CONFIDENCE_CHECKS.length
  const [idx, setIdx] = useState(0)
  const [selfPerception, setSelfPerception] = useState({})
  const [confidence, setConfidence] = useState({})
  const [showIntro, setShowIntro] = useState(true)
  const [isFinished, setIsFinished] = useState(false)
  const [finalAnswers, setFinalAnswers] = useState(null)

  const isConfidencePhase = idx >= selectedQuestions.length
  const currentQ = isConfidencePhase
    ? CONFIDENCE_CHECKS[idx - selectedQuestions.length]
    : selectedQuestions[idx]

  const currentValue = isConfidencePhase ? confidence[currentQ.id] : selfPerception[currentQ.id]

  const handleSelectOption = (v) => {
    capiAudio.sfx('click')
    if (isConfidencePhase) setConfidence((prev) => ({ ...prev, [currentQ.id]: v }))
    else setSelfPerception((prev) => ({ ...prev, [currentQ.id]: v }))
  }

  const next = () => {
    capiAudio.sfx('click')
    if (idx + 1 >= total) {
      capiAudio.sfx('scan')
      const spFull = {}
      for (const q of selectedQuestions) spFull[q.id] = selfPerception[q.id] ?? 3
      const cfFull = {}
      for (const c of CONFIDENCE_CHECKS) cfFull[c.id] = confidence[c.id] ?? 3
      setFinalAnswers({ selfPerception: spFull, confidence: cfFull })
      setIsFinished(true)
    } else {
      setIdx((i) => i + 1)
    }
  }

  const back = () => {
    capiAudio.sfx('click')
    if (idx > 0) {
      setIdx((i) => i - 1)
    } else {
      setShowIntro(true)
    }
  }

  if (showIntro) {
    return (
      <SceneShell light>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 24 }}>
          <div className="glass fade-up" style={{ maxWidth: 600, padding: '32px 36px' }}>
            <div className="mono" style={{ color: '#843497', marginBottom: 20 }}>
              {t('intro.scan_intro_title')}
            </div>
            <p
              style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, lineHeight: 1.65 }}
              dangerouslySetInnerHTML={{ __html: t('intro.scan_intro_blurb') }}
            />
            <button className="btn btn-primary" onClick={() => setShowIntro(false)}>
              {t('intro.scan_intro_btn')}
            </button>
          </div>
        </div>
      </SceneShell>
    )
  }

  if (isFinished) {
    return (
      <SceneShell light className="no-scroll-shell">
        <img
          src="/illos/capi-transition.svg"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
          onError={(e) => {
            e.currentTarget.style.display = 'none'
          }}
        />
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            minHeight: '100%',
            padding: 24,
            position: 'relative',
            zIndex: 5,
          }}
        >
          <div className="p1-transition-card fade-up">
            <div className="p1-transition-checkmark">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="p1-transition-title">{t('common.phase1_completed')}</h2>
            <button className="p1-transition-btn" onClick={() => onComplete(finalAnswers)}>
              {t('common.continue_btn')}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </SceneShell>
    )
  }

  const imgPath =
    !isConfidencePhase && currentQ.role
      ? `/illos/capi-gen-${currentQ.role}.jpg`
      : '/illos/capi-gen-explorer.jpg'

  return (
    <SceneShell light className="no-scroll-shell">
      <div
        className="p2-new-layout"
        style={{
          height: '100%',
          padding: 'clamp(20px, 3.5vh, 40px) 48px clamp(16px, 2.5vh, 32px)',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          maxWidth: '1000px',
        }}
      >
        {/* Progress Bar Container */}
        <div className="p1-progress-bar-container">
          <div className="p1-progress-labels">
            <span>
              {t('common.question_progress', {
                num: String(idx + 1).padStart(2, '0'),
                total: String(total).padStart(2, '0'),
              })}
            </span>
            <span>
              {t('common.percent_completed', { percent: Math.round((idx / total) * 100) })}
            </span>
          </div>
          <div className="p1-progress-outer">
            <div className="p1-progress-inner" style={{ width: `${(idx / total) * 100}%` }} />
          </div>
        </div>

        {/* Dynamic Split Layout */}
        <div className="p1-split-layout">
          <div className="p1-left-illustration">
            <img src={imgPath} alt="" />
          </div>

          <div className="p1-right-content">
            <h3 className="p1-question-text">{t(`questions.${currentQ.id}`)}</h3>

            <div className="p1-likert-options">
              {[1, 2, 3, 4, 5].map((val) => {
                const isSelected = currentValue === val
                return (
                  <button
                    key={val}
                    className={`p1-likert-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(val)}
                  >
                    {t(`likert.${val}`)}
                  </button>
                )
              })}
            </div>

            <div className="p2-new-actions" style={{ width: '100%' }}>
              <button className="p2-btn-outline" onClick={back}>
                {t('common.back_btn')}
              </button>
              <button
                className={`p2-btn-solid ${currentValue !== undefined && currentValue !== null ? 'active' : ''}`}
                disabled={currentValue === undefined || currentValue === null}
                onClick={next}
              >
                {idx + 1 >= total
                  ? t('common.finish_btn') || 'Hoàn thành →'
                  : t('common.continue_btn') || 'Tiếp tục →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
