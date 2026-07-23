import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../Button.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_MISSIONS } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import QASection from '../QASection.jsx'
import SceneShell from './SceneShell.jsx'
import TransitionScreen from './TransitionScreen.jsx'

const ILLO_EXT = {
  'm1-q15': 'png',
  'm1-q16': 'png',
  'm1-q17': 'png',
  'm1-q18': 'png',
  'm1-q19': 'png',
}

const MISSION_PADS = {
  1: [98, 146.8, 196, 293.7],
  2: [110, 164.8, 220, 329.6],
  6: [73.4, 110, 146.8, 196],
  3: [130.8, 196, 261.6, 392],
  4: [98, 146.8, 196, 293.7],
  5: [110, 174.6, 220, 329.6],
}

// Transition images are located under public/illos/

export default function MissionPlayScene() {
  const { t } = useTranslation()
  const {
    selectedMission: missionId,
    phase2Answers: answers,
    setPhase2Answers: setAnswers,
    missionPlayIndices,
    setMissionPlayIndices,
  } = useWizard()
  const idx = missionPlayIndices[missionId] ?? 0
  const setIdx = (newVal) => {
    const nextIdx = typeof newVal === 'function' ? newVal(idx) : newVal
    setMissionPlayIndices((prev) => ({
      ...prev,
      [missionId]: nextIdx,
    }))
  }
  const navigate = useNavigate()
  const m = CAPI_MISSIONS[missionId]
  const qs = m ? m.questions : []

  const [stage, setStage] = useState(() => {
    if (idx > 0) return 'q'
    return 'intro'
  })
  const [picked, setPicked] = useState(() => {
    const currentQ = qs[idx]
    return currentQ ? (answers[currentQ.id] ?? null) : null
  })

  useEffect(() => {
    capiAudio.pad(MISSION_PADS[missionId] || [110, 164.8, 220])
  }, [missionId])

  const q = qs[idx]
  const illoKey = `m${missionId}-q${String(idx + 1).padStart(2, '0')}`
  const illoSrc = `/illos/${illoKey}.${ILLO_EXT[illoKey] || 'webp'}`
  const progress = Math.round((idx / qs.length) * 100)

  const selectOption = (opt) => {
    capiAudio.sfx('click')
    setPicked(opt.label)
  }

  const goNext = () => {
    if (picked === null) return
    const newAnswers = { ...answers, [q.id]: picked }
    setAnswers(newAnswers)
    capiAudio.sfx('confirm')
    if (idx + 1 >= qs.length) {
      setStage('ending')
    } else {
      setIdx(idx + 1)
      const nextQ = qs[idx + 1]
      setPicked(newAnswers[nextQ?.id] ?? null)
    }
  }

  const goBack = () => {
    if (idx === 0) {
      navigate('/mission-pick')
      return
    }
    const prevQ = qs[idx - 1]
    setIdx(idx - 1)
    setPicked(answers[prevQ.id] ?? null)
  }

  if (stage === 'intro') {
    return (
      <TransitionScreen
        imageSrc={`/illos/transition_mission_${missionId}.svg`}
        onNext={() => setStage('q')}
      />
    )
  }

  if (stage === 'ending') {
    return (
      <TransitionScreen
        imageSrc={`/illos/ending_mission_${missionId}.svg`}
        onNext={() => {
          setAnswers(answers)
          navigate('/reflect')
        }}
      />
    )
  }

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
        {/* Split Layout */}
        <div className="p1-split-layout">
          <div className="p1-left-illustration" style={{ position: 'relative', height: '100%' }}>
            <img
              src={illoSrc}
              alt=""
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          </div>

          <div className="p1-right-content">
            {/* Chapter Title at the top of the right column */}
            {q.chapter_vn && (
              <h2 className="p2-new-header" style={{ margin: 0, textTransform: 'none' }}>
                {q.chapter_vn}
              </h2>
            )}

            {/* Progress Bar Container */}
            <div className="p1-progress-bar-container">
              <div className="p1-progress-labels">
                <span>
                  {t('common_extra.question_of', { num: String(idx + 1).padStart(2, '0'), total: String(qs.length).padStart(2, '0') })}
                </span>
                <span>{t('common_extra.completed_pct', { percent: progress })}</span>
              </div>
              <div className="p1-progress-outer">
                <div className="p1-progress-inner" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <QASection
              key={idx}
              questionText={q.capi_dialogue_vn?.replace(/^[""]|[""]$/g, '')}
              options={q.options.map((opt) => ({
                label: opt.label,
                text: opt.text_vn,
                ...opt,
              }))}
              selectedValue={picked}
              onSelect={selectOption}
            />

            <div className="p2-new-actions" style={{ width: '100%' }}>
              <Button variant="outline" onClick={goBack}>
                {t('common.back')}
              </Button>
              <Button
                variant="solid"
                active={picked !== null}
                disabled={picked === null}
                onClick={goNext}
              >
                {t('common.continue_btn')} →
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
