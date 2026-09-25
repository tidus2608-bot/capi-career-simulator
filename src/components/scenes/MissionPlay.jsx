import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import { CAPI_MISSIONS } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import TransitionScreen from './TransitionScreen.jsx'
import QAPageLayout from './QAPageLayout.jsx'

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

  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  const [stage, setStage] = useState(() => {
    if (idx > 0) return 'q'
    return 'intro'
  })

  useEffect(() => {
    capiAudio.pad(MISSION_PADS[missionId] || [110, 164.8, 220])
  }, [missionId])

  // Preload upcoming question illustrations
  useEffect(() => {
    if (!qs.length) return
    const preloadUrls = [idx + 1, idx + 2]
      .filter((nextI) => nextI < qs.length)
      .map((nextI) => `/illos/m${missionId}-q${String(nextI + 1).padStart(2, '0')}.webp`)

    for (const url of preloadUrls) {
      const img = new Image()
      img.src = url
    }
  }, [idx, missionId, qs.length])

  const q = qs[idx]
  const picked = q ? (answers[q.id] ?? null) : null
  const illoSrc = `/illos/m${missionId}-q${String(idx + 1).padStart(2, '0')}.webp`

  const answeredIndices = qs
    .map((item, i) => (answers[item.id] !== undefined ? i : -1))
    .filter((i) => i !== -1)
  const maxAnsweredIdx = answeredIndices.length > 0 ? Math.max(...answeredIndices) : -1
  const maxNavigableIdx = Math.min(qs.length - 1, maxAnsweredIdx + 1)
  const canGoNext = idx < maxNavigableIdx

  const selectOption = (opt) => {
    capiAudio.sfx('click')
    const choice = typeof opt === 'string' ? opt : (opt.label || opt.value || opt)
    setAnswers((prev) => {
      const updated = { ...prev, [q.id]: choice }
      answersRef.current = updated
      return updated
    })
  }

  const goNext = () => {
    capiAudio.sfx('confirm')
    if (idx + 1 >= qs.length) {
      setStage('ending')
    } else {
      setIdx((prev) => prev + 1)
    }
  }

  const goBack = () => {
    if (idx === 0) {
      navigate('/mission-pick')
      return
    }
    setIdx((prev) => prev - 1)
  }

  if (stage === 'intro') {
    return (
      <TransitionScreen
        imageSrc={`/illos/mission-${missionId}-start.webp`}
        onNext={() => setStage('q')}
        onBack={() => navigate('/mission-pick')}
      />
    )
  }

  if (stage === 'ending') {
    return (
      <TransitionScreen
        imageSrc={`/illos/mission-${missionId}-end.webp`}
        onNext={() => navigate('/reflect')}
        onBack={() => setStage('q')}
      />
    )
  }

  if (!q) return null

  return (
    <QAPageLayout
      imageSrc={illoSrc}
      fallbackImageSrc={`/illos/m${missionId}-preview.webp`}
      chapterBadge={t(`missions.${missionId}.questions.${q.id}.chapter`, '')}
      idx={idx}
      total={qs.length}
      questionText={t(`missions.${missionId}.questions.${q.id}.dialogue`)}
      options={q.options.map((opt) => ({
        label: opt.label,
        hotkey: opt.label,
        text: t(`missions.${missionId}.questions.${q.id}.options.${opt.label}`),
        ...opt,
      }))}
      selectedValue={picked}
      onSelect={selectOption}
      onBack={goBack}
      onNext={goNext}
      canGoNext={canGoNext}
      backText={t('common.back')}
      coverImage
    />
  )
}
