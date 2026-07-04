import { useState, useEffect } from 'react'
import Capi from '../Capi.jsx'
import { Typed } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_ROLES, PHASE3_QUESTIONS, LIKERT_FIT } from '../../data.js'
import SceneShell from './SceneShell.jsx'
import LikertSlider from './LikertSlider.jsx'

export default function ReflectionScene({ onComplete }) {
  useEffect(() => {
    capiAudio.pad([130.8, 196, 261.6, 392])
  }, [])

  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})

  const q = PHASE3_QUESTIONS[idx]
  const current = answers[q.role] ?? 3

  const next = () => {
    const newAnswers = { ...answers, [q.role]: current }
    capiAudio.sfx('click')
    if (idx + 1 >= PHASE3_QUESTIONS.length) {
      capiAudio.sfx('success')
      const full = {}
      for (const pq of PHASE3_QUESTIONS) full[pq.role] = newAnswers[pq.role] ?? 3
      onComplete(full)
    } else {
      setAnswers(newAnswers)
      setIdx((i) => i + 1)
    }
  }

  const roleData = CAPI_ROLES[q.role] || { color: '#843497', nameVn: q.role }

  return (
    <SceneShell light>
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          height: '100%',
          padding: '28px 24px',
          gap: 20,
          maxWidth: 860,
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div className="mono" style={{ color: '#843497' }}>
            PHASE 3 · PHẢN CHIẾU
          </div>
          <div className="progress" style={{ flex: 1, maxWidth: 280 }}>
            <i style={{ width: `${((idx + 1) / PHASE3_QUESTIONS.length) * 100}%` }} />
          </div>
          <div className="mono" style={{ color: '#9ca3af' }}>
            {idx + 1} / {PHASE3_QUESTIONS.length}
          </div>
        </div>

        {/* Capi + question */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 20,
            alignItems: 'end',
            alignSelf: 'end',
          }}
          className="fade-up"
        >
          <Capi outfit="lab" pose="talk" size={120} />
          <div className="dialogue">
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
              <div className="mono" style={{ color: '#843497' }}>
                CAPI
              </div>
              <span
                className="pill"
                style={{ color: roleData.color, borderColor: `${roleData.color}44` }}
              >
                {roleData.nameVn}
              </span>
            </div>
            <div
              key={idx}
              style={{
                fontSize: 18,
                lineHeight: 1.5,
                fontFamily: 'var(--font-display)',
                color: '#1a1a2e',
              }}
            >
              <Typed text={q.text_vn} speed={16} />
            </div>
          </div>
        </div>

        {/* Likert + Next */}
        <div className="glass fade-up" style={{ padding: '22px 28px', animationDelay: '0.1s' }}>
          <LikertSlider
            labels={LIKERT_FIT}
            value={current}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.role]: v }))}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-primary" onClick={next}>
              {idx + 1 >= PHASE3_QUESTIONS.length ? 'Hoàn thành →' : 'Tiếp theo →'}
            </button>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
