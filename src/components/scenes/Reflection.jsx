import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { capiAudio } from '../../audio.js'
import { PHASE3_QUESTIONS, LIKERT_FIT } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import QAPageLayout from './QAPageLayout.jsx'

export default function ReflectionScene() {
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

  const imgPath = `/illos/capi-gen-${q.role}.jpg`

  return (
    <QAPageLayout
      imageSrc={imgPath}
      idx={idx}
      total={PHASE3_QUESTIONS.length}
      questionText={q.text_vn}
      options={[1, 2, 3, 4, 5].map((val) => ({
        value: val,
        text: LIKERT_FIT[val - 1] || `Option ${val}`,
      }))}
      selectedValue={currentValue}
      onSelect={handleSelectOption}
      onBack={back}
      onNext={next}
      nextDisabled={currentValue === null}
      isFinished={idx + 1 >= PHASE3_QUESTIONS.length}
      imageStyle={{
        aspectRatio: '1024 / 1440',
        objectFit: 'cover',
        width: 'auto',
        height: '100%',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    />
  )
}

