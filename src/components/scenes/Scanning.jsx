import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { capiAudio } from '../../audio.js'
import { PHASE1_QUESTIONS, CONFIDENCE_CHECKS } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import QASection from '../QASection.jsx'

export default function ScanningScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    onScanDone,
    scanIntroActive,
    setScanIntroActive,
    scanIndex: idx,
    setScanIndex: setIdx,
    scanQuestions,
    setScanQuestions,
    phase1Answers,
    setPhase1Answers,
  } = useWizard()

  useEffect(() => {
    capiAudio.pad([130.8, 196, 261.6, 392], 'cold')
  }, [])

  // Generate questions if not present
  useEffect(() => {
    if (!scanQuestions) {
      const roles = ['explorer', 'builder', 'operator', 'connector', 'communicator']
      const chosen = []
      for (const r of roles) {
        const qForRole = PHASE1_QUESTIONS.filter((q) => q.role === r)
        const shuffled = [...qForRole].sort(() => Math.random() - 0.5)
        chosen.push(...shuffled.slice(0, 3))
      }
      const finalShuffled = chosen.sort(() => Math.random() - 0.5)
      setScanQuestions(finalShuffled)
    }
  }, [scanQuestions, setScanQuestions])

  const selectedQuestions = scanQuestions || []
  const total = selectedQuestions.length ? selectedQuestions.length + CONFIDENCE_CHECKS.length : 0

  const showIntro = scanIntroActive
  const setShowIntro = setScanIntroActive

  if (!selectedQuestions.length) {
    return (
      <SceneShell light>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%' }}>
          <div className="mono" style={{ color: '#9ca3af' }}>
            {t('common.loading')}
          </div>
        </div>
      </SceneShell>
    )
  }

  const isConfidencePhase = idx >= selectedQuestions.length
  const currentQ = isConfidencePhase
    ? CONFIDENCE_CHECKS[idx - selectedQuestions.length]
    : selectedQuestions[idx]

  const currentValue = isConfidencePhase
    ? phase1Answers.confidence?.[currentQ?.id]
    : phase1Answers.selfPerception?.[currentQ?.id]

  const handleSelectOption = (v) => {
    capiAudio.sfx('click')
    if (isConfidencePhase) {
      setPhase1Answers((prev) => ({
        ...prev,
        confidence: { ...prev.confidence, [currentQ.id]: v },
      }))
    } else {
      setPhase1Answers((prev) => ({
        ...prev,
        selfPerception: { ...prev.selfPerception, [currentQ.id]: v },
      }))
    }
  }

  const next = () => {
    capiAudio.sfx('click')
    if (idx + 1 >= total) {
      capiAudio.sfx('scan')
      const spFull = {}
      for (const q of selectedQuestions) spFull[q.id] = phase1Answers.selfPerception[q.id] ?? 3
      const cfFull = {}
      for (const c of CONFIDENCE_CHECKS) cfFull[c.id] = phase1Answers.confidence[c.id] ?? 3
      onScanDone({ selfPerception: spFull, confidence: cfFull })
      navigate('/role-reveal')
    } else {
      setIdx(idx + 1)
    }
  }

  const back = () => {
    capiAudio.sfx('click')
    if (idx > 0) {
      setIdx(idx - 1)
    } else {
      setShowIntro(true)
    }
  }

  if (showIntro) {
    return (
      <SceneShell light>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 24 }}>
          <div
            className="glass fade-up"
            style={{ maxWidth: 600, padding: '32px 36px', textAlign: 'center' }}
          >
            <div className="mono" style={{ color: '#843497', marginBottom: 20 }}>
              {t('intro.scan_intro_title')}
            </div>
            <p
              style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, lineHeight: 1.65 }}
              dangerouslySetInnerHTML={{ __html: t('intro.scan_intro_blurb') }}
            />
            <div style={{ display: 'flex', gap: 16, width: '100%' }}>
              <Button
                variant="outline"
                onClick={() => {
                  capiAudio.sfx('click')
                  navigate('/')
                }}
              >
                {t('common.back_btn')}
              </Button>
              <Button
                variant="solid"
                active
                onClick={() => {
                  capiAudio.sfx('click')
                  setShowIntro(false)
                }}
              >
                {t('intro.scan_intro_btn')}
              </Button>
            </div>
          </div>
        </div>
      </SceneShell>
    )
  }

  const imgPath = '/illos/capi-phase1.png'

  return (
    <SceneShell light className="no-scroll-shell">
      <div
        className="p2-new-layout"
        style={{
          height: '100%',
          padding: 'clamp(20px, 3.5vh, 40px) 48px clamp(16px, 2.5vh, 32px)',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          maxWidth: '1200px',
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
            <QASection
              key={idx}
              questionText={t(`questions.${currentQ.id}`)}
              options={[1, 2, 3, 4, 5].map((val) => ({
                value: val,
                text: t(`likert.${val}`),
              }))}
              selectedValue={currentValue}
              onSelect={handleSelectOption}
            />

            <div className="p2-new-actions" style={{ width: '100%' }}>
              <Button variant="outline" onClick={back}>
                {t('common.back_btn')}
              </Button>
              <Button
                variant="solid"
                active={currentValue !== undefined && currentValue !== null}
                disabled={currentValue === undefined || currentValue === null}
                onClick={next}
              >
                {idx + 1 >= total
                  ? t('common.finish_btn') || 'Hoàn thành →'
                  : t('common.continue_btn') || 'Tiếp tục →'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
