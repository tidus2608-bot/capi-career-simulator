import { useState, useEffect } from 'react'
import Capi from '../Capi.jsx'
import { Typed, SceneArt } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_MISSIONS, MISSION_BG } from '../../data.js'
import SceneShell from './SceneShell.jsx'

const MISSION_PADS = {
  1: [98, 146.8, 196, 293.7],
  2: [110, 164.8, 220, 329.6],
  6: [73.4, 110, 146.8, 196],
  3: [130.8, 196, 261.6, 392],
  4: [98, 146.8, 196, 293.7],
  5: [110, 174.6, 220, 329.6],
}

export default function MissionPlayScene({ missionId, onComplete }) {
  const m = CAPI_MISSIONS[missionId]
  const bg = MISSION_BG[missionId] || 'lab'
  const qs = m.questions

  const [innerStage, setInnerStage] = useState('intro')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    capiAudio.pad(MISSION_PADS[missionId] || [110, 164.8, 220])
  }, [missionId])

  const q = qs[idx]

  const pick = (opt) => {
    if (picked !== null) return
    setPicked(opt.label)
    capiAudio.sfx('click')
    setTimeout(() => {
      const newAnswers = { ...answers, [q.id]: opt.label }
      setAnswers(newAnswers)
      if (idx + 1 >= qs.length) {
        setInnerStage('ending')
      } else {
        setIdx((i) => i + 1)
        setPicked(null)
      }
    }, 480)
  }

  if (innerStage === 'intro') {
    return (
      <SceneShell bg={bg}>
        <SceneArt variant={bg} />
        <div style={{ display: 'grid', placeItems: 'center', height: '100%', padding: 24 }}>
          <div className="glass fade-up" style={{ maxWidth: 640, padding: 30, textAlign: 'center' }}>
            <div className="mono" style={{ color: 'var(--cyan)' }}>
              NHIỆM VỤ · 20 CÂU HỎI
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 34, margin: '8px 0 4px' }}>
              {m.name_vn}
            </h2>
            <div style={{ display: 'grid', placeItems: 'center', margin: '10px 0 18px' }}>
              <Capi outfit="lab" pose="talk" size={140} />
            </div>
            <div className="dialogue" style={{ textAlign: 'left', marginBottom: 22 }}>
              <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 6 }}>
                CAPI
              </div>
              <div style={{ fontSize: 15, lineHeight: 1.55 }}>&ldquo;{qs[0]?.context_vn}&rdquo;</div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                capiAudio.sfx('whoosh')
                setInnerStage('q')
              }}
            >
              BẮT ĐẦU NHIỆM VỤ
            </button>
          </div>
        </div>
      </SceneShell>
    )
  }

  if (innerStage === 'ending') {
    return (
      <SceneShell bg={bg}>
        <SceneArt variant={bg} />
        <div style={{ display: 'grid', placeItems: 'center', height: '100%', padding: 24 }}>
          <div className="glass fade-up" style={{ maxWidth: 640, padding: 34, textAlign: 'center' }}>
            <div className="mono" style={{ color: 'var(--green)' }}>
              MISSION COMPLETE ✓
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, margin: '8px 0 4px' }}>
              Nhiệm vụ hoàn thành!
            </h2>
            <div style={{ display: 'grid', placeItems: 'center', margin: '14px 0 22px' }}>
              <Capi outfit="lab" pose="cheer" size={130} />
            </div>
            <p style={{ color: 'var(--ink-dim)', marginBottom: 26 }}>
              Bạn đã trả lời {qs.length} câu hỏi. Capi-Gene đang tổng hợp dữ liệu hành vi của bạn...
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                capiAudio.sfx('success')
                onComplete(answers)
              }}
            >
              ĐI ĐẾN PHẢN CHIẾU →
            </button>
          </div>
        </div>
      </SceneShell>
    )
  }

  return (
    <SceneShell bg={bg}>
      <SceneArt variant={bg} />
      <div
        style={{
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr auto',
          height: '100%',
          padding: '24px 20px',
          gap: 14,
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          className="fade-up"
          style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}
        >
          <span className="pill" style={{ color: 'var(--cyan)', borderColor: 'var(--cyan)' }}>
            {q.chapter_vn}
          </span>
          <div className="mono" style={{ marginLeft: 'auto' }}>
            {String(idx + 1).padStart(2, '0')} / {String(qs.length).padStart(2, '0')}
          </div>
          <div className="progress" style={{ flex: '0 0 180px' }}>
            <i style={{ width: `${((idx + 1) / qs.length) * 100}%` }} />
          </div>
        </div>

        {/* Context bar */}
        {q.context_vn && (
          <div
            className="mono"
            style={{
              fontSize: 12,
              color: 'var(--ink-mute)',
              borderLeft: '2px solid var(--line)',
              paddingLeft: 10,
            }}
          >
            BỐI CẢNH · {q.context_vn}
          </div>
        )}

        {/* Capi dialogue */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 18,
            alignItems: 'end',
            alignSelf: 'end',
          }}
          className="fade-up"
        >
          <div style={{ display: 'grid', placeItems: 'center' }}>
            <Capi outfit="lab" pose="talk" size={120} />
          </div>
          <div className="dialogue">
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 6 }}>
              CAPI
            </div>
            <div
              key={idx}
              style={{ fontSize: 17, lineHeight: 1.5, fontFamily: 'var(--font-display)' }}
            >
              <Typed text={q.capi_dialogue_vn?.replace(/^[""]|[""]$/g, '')} speed={14} />
            </div>
          </div>
        </div>

        {/* Options */}
        <div
          key={idx}
          style={{
            display: 'grid',
            gap: 10,
            gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          }}
        >
          {q.options.map((opt) => (
            <button
              key={opt.label}
              className={`option-card fade-up ${picked === opt.label ? 'picked' : ''}`}
              style={{ animationDelay: `${0.04 + ['A', 'B', 'C'].indexOf(opt.label) * 0.06}s` }}
              onClick={() => pick(opt)}
            >
              <span className="key">{opt.label}</span>
              <span>{opt.text_vn}</span>
            </button>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}
