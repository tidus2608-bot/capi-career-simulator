import React, { useEffect } from 'react'
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

  useEffect(() => {
    capiAudio.pad([130.8, 196, 261.6, 392])
  }, [])

  const q = PHASE3_QUESTIONS[idx]
  if (!q) return null

  const currentValue = answers[q.role] ?? null

  const handleSelectOption = (v) => {
    capiAudio.sfx('click')
    setAnswers((prev) => ({ ...prev, [q.role]: v }))
  }

  const next = () => {
    capiAudio.sfx('click')
    if (idx + 1 >= PHASE3_QUESTIONS.length) {
      capiAudio.sfx('success')
      const full = {}
      for (const pq of PHASE3_QUESTIONS) {
        full[pq.role] = answers[pq.role] ?? 3
      }
      onReflectDone(full)
      navigate('/certificate')
    } else {
      setIdx(idx + 1)
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

  return (
    <QAPageLayout
      imageSrc={imgPath}
      idx={idx}
      total={PHASE3_QUESTIONS.length}
      questionText={t(`phase3_questions.${q.role}`)}
      options={[5, 4, 3, 2, 1].map((val) => ({
        text: t(`likert_fit.${val}`),
        value: val,
      }))}
      selectedValue={currentValue}
      onSelect={handleSelectOption}
      onBack={back}
      onNext={next}
      nextDisabled={currentValue === null}
      isFinished={idx + 1 >= PHASE3_QUESTIONS.length}
      coverImage
    />
  )
}
