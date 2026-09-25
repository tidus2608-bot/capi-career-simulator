import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import { PHASE3_QUESTIONS } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import QAPageLayout from './QAPageLayout.jsx'

export default function ReflectionScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    onReflectDone,
    phase3Answers: answers,
    setPhase3Answers: setAnswers,
    reflectIndex: idx,
    setReflectIndex: setIdx,
  } = useWizard()

  const answersRef = useRef(answers)
  useEffect(() => {
    answersRef.current = answers
  }, [answers])

  useEffect(() => {
    capiAudio.pad([130.8, 196, 261.6, 392])
  }, [])

  const q = PHASE3_QUESTIONS[idx]
  if (!q) return null

  const currentValue = answers[q.role] ?? null

  const handleSelectOption = (v) => {
    capiAudio.sfx('click')
    setAnswers((prev) => {
      const updated = { ...prev, [q.role]: v }
      answersRef.current = updated
      return updated
    })
  }

  const next = () => {
    capiAudio.sfx('click')
    if (idx + 1 >= PHASE3_QUESTIONS.length) {
      capiAudio.sfx('success')
      const currentAns = answersRef.current || {}
      const full = {}
      for (const pq of PHASE3_QUESTIONS) {
        full[pq.role] = currentAns[pq.role] ?? 3
      }
      onReflectDone(full)
      navigate('/certificate')
    } else {
      setIdx((prev) => prev + 1)
    }
  }

  const back = () => {
    capiAudio.sfx('click')
    if (idx > 0) {
      setIdx(idx - 1)
    } else {
      navigate('/mission-play')
    }
  }

  const imgPath = `/illos/bg-${q.role}.webp`

  const answeredIndices = PHASE3_QUESTIONS
    .map((item, i) => (answers[item.role] !== undefined ? i : -1))
    .filter((i) => i !== -1)
  const maxAnsweredIdx = answeredIndices.length > 0 ? Math.max(...answeredIndices) : -1
  const maxNavigableIdx = Math.min(PHASE3_QUESTIONS.length - 1, maxAnsweredIdx + 1)
  const canGoNext = idx < maxNavigableIdx

  return (
    <QAPageLayout
      imageSrc={imgPath}
      idx={idx}
      total={PHASE3_QUESTIONS.length}
      questionText={t(`phase3_questions.${q.role}`)}
      options={[5, 4, 3, 2, 1].map((val) => ({
        text: t(`likert_fit.${val}`),
        value: val,
        hotkey: String(val),
      }))}
      selectedValue={currentValue}
      onSelect={handleSelectOption}
      onBack={back}
      onNext={next}
      canGoNext={canGoNext}
      coverImage
    />
  )
}
