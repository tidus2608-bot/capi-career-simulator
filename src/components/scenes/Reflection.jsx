import { useState, useEffect } from 'react'
import Capi from '../Capi.jsx'
import { Typed, SceneArt } from '../UI.jsx'
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

  const roleData = CAPI_ROLES[q.role] || { color: 'var(--cyan)', nameVn: q.role }

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      <div
        className="mission-play-grid"
        style={{
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
          height: '100%',
          padding: '28px 24px',
          gap: 20,
          maxWidth: 1000,
          margin: '0 auto',
        }}
      >
        <div className="fade-up" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="mono" style={{ color: 'var(--gold)' }}>
            PHASE 3 &middot;&nbsp; PHẢN CHIẾU
          </div>
          <div className="progress" style={{ flex: 1, maxWidth: 300 }}>
            <i style={{ width: `${((idx + 1) / PHASE3_QUESTIONS.length) * 100}%` }} />
          </div>
          <div className="mono">
            {idx + 1} / {PHASE3_QUESTIONS.length}
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 22,
            alignItems: 'end',
            alignSelf: 'end',
          }}
          className="fade-up"
        >
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <Capi outfit="lab" pose="talk" size={130} />
          </div>
          <div>
            <div className="mono" style={{ color: roleData.color, marginBottom: 8 }}>
              {roleData.name?.toUpperCase() || q.role.toUpperCase()} · {roleData.nameVn}
            </div>
            <div className="dialogue">
              <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 6 }}>
                CAPI
              </div>
              <div
                key={idx}
                style={{ fontSize: 19, lineHeight: 1.5, fontFamily: 'var(--font-display)' }}
              >
                <Typed text={q.text_vn} speed={16} />
              </div>
            </div>
          </div>
        </div>

        <div className="glass fade-up" style={{ padding: '20px 24px', animationDelay: '0.1s' }}>
          <LikertSlider
            labels={LIKERT_FIT}
            value={current}
            onChange={(v) => setAnswers((a) => ({ ...a, [q.role]: v }))}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-primary" onClick={next}>
              {idx + 1 >= PHASE3_QUESTIONS.length ? 'HOÀN THÀNH →' : 'TIẾP THEO →'}
            </button>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
