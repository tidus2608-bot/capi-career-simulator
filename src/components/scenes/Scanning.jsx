import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { capiAudio } from '../../audio.js'
import { PHASE1_QUESTIONS } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import QAPageLayout from './QAPageLayout.jsx'

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

  const answersRef = useRef(phase1Answers)
  useEffect(() => {
    answersRef.current = phase1Answers
  }, [phase1Answers])

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
  const total = selectedQuestions.length

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

  const currentQ = selectedQuestions[idx]
  const currentValue = phase1Answers.selfPerception?.[currentQ?.id]

  const handleSelectOption = (v) => {
    capiAudio.sfx('click')
    setPhase1Answers((prev) => {
      const updated = {
        ...prev,
        selfPerception: { ...prev.selfPerception, [currentQ.id]: v },
      }
      answersRef.current = updated
      return updated
    })
  }

  const next = () => {
    capiAudio.sfx('click')
    if (idx + 1 >= total) {
      capiAudio.sfx('scan')
      const currentSP = answersRef.current?.selfPerception || {}
      const spFull = {}
      for (const q of selectedQuestions) spFull[q.id] = currentSP[q.id] ?? 3
      onScanDone({ selfPerception: spFull })
      navigate('/role-reveal')
    } else {
      setIdx((prev) => prev + 1)
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
            className="scanning-intro-card fade-up"
            style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.06)',
              maxWidth: 580,
              width: '100%',
              padding: '36px 40px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="mono"
              style={{ color: '#843497', fontWeight: 700, fontSize: 'var(--text-sm)' }}
            >
              {t('intro.scan_intro_title')}
            </div>
            <p
              style={{
                color: '#475569',
                fontSize: 'var(--text-base)',
                lineHeight: 1.65,
                margin: 0,
              }}
              dangerouslySetInnerHTML={{ __html: t('intro.scan_intro_blurb') }}
            />
            <div className="scanning-intro-actions">
              <Button
                variant="outline"
                onClick={() => {
                  capiAudio.sfx('click')
                  navigate('/')
                }}
                className="scanning-intro-btn-back"
                style={{
                  height: 48,
                  borderRadius: 12,
                  fontSize: 'var(--text-base)',
                  fontWeight: 600,
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
                className="scanning-intro-btn-start"
                style={{
                  height: 48,
                  borderRadius: 12,
                  fontSize: 'var(--text-base)',
                  fontWeight: 700,
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

  const imgPath = '/illos/capi-phase1.webp'

  const currentSP = phase1Answers?.selfPerception || {}
  const answeredIndices = selectedQuestions
    .map((item, i) => (currentSP[item.id] !== undefined ? i : -1))
    .filter((i) => i !== -1)
  const maxAnsweredIdx = answeredIndices.length > 0 ? Math.max(...answeredIndices) : -1
  const maxNavigableIdx = Math.min(total - 1, maxAnsweredIdx + 1)
  const canGoNext = idx < maxNavigableIdx

  return (
    <QAPageLayout
      imageSrc={imgPath}
      idx={idx}
      total={total}
      questionText={t(`questions.${currentQ.id}`)}
      options={[5, 4, 3, 2, 1].map((val) => ({
        value: val,
        hotkey: String(val),
        text: t(`likert.${val}`),
      }))}
      selectedValue={currentValue}
      onSelect={handleSelectOption}
      onBack={back}
      onNext={next}
      canGoNext={canGoNext}
    />
  )
}
