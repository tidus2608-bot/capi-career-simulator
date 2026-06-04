import { useState, useEffect } from 'react'
import Capi from '../Capi.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_MISSIONS } from '../../data.js'

const ILLO_EXT = {
  'm1-q15': 'png', 'm1-q16': 'png', 'm1-q17': 'png', 'm1-q18': 'png', 'm1-q19': 'png',
}

const MISSION_PADS = {
  1: [98, 146.8, 196, 293.7],
  2: [110, 164.8, 220, 329.6],
  6: [73.4, 110, 146.8, 196],
  3: [130.8, 196, 261.6, 392],
  4: [98, 146.8, 196, 293.7],
  5: [110, 174.6, 220, 329.6],
}

const MISSION_STARTS = {
  1: '/illos/mission-1-start.webp',
  2: '/illos/mission-2-start.svg',
  3: '/illos/mission-3-start.svg',
  4: '/illos/mission-4-start.webp',
  5: '/illos/mission-5-start.svg',
  6: '/illos/mission-6-start.svg',
}

const MISSION_ENDS = {
  1: '/illos/mission-1-end.webp',
  2: '/illos/mission-2-end.svg',
  3: '/illos/mission-3-end.svg',
  4: '/illos/mission-4-end.svg',
  5: '/illos/mission-5-end.webp',
  6: '/illos/mission-6-end.svg',
}

export default function MissionPlayScene({ missionId, onComplete, onBack }) {
  const m = CAPI_MISSIONS[missionId]
  const qs = m.questions

  const [stage, setStage] = useState(MISSION_STARTS[missionId] ? 'intro' : 'q')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})
  const [picked, setPicked] = useState(null)

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
      setIdx((i) => i + 1)
      setPicked(null)
    }
  }

  const goBack = () => {
    if (idx === 0) {
      onBack?.()
      return
    }
    const prevQ = qs[idx - 1]
    setIdx((i) => i - 1)
    setPicked(answers[prevQ.id] ?? null)
  }

  if (stage === 'intro') {
    return (
      <div className="p2-shell">
        <img
          src={MISSION_STARTS[missionId]}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 60, gap: 16 }}>
          <button
            className="p2-btn"
            style={{ maxWidth: 320 }}
            onClick={() => {
              capiAudio.sfx('click')
              setStage('q')
            }}
          >
            BẮT ĐẦU NHIỆM VỤ →
          </button>
          <button
            className="p2-nav-back"
            style={{ background: 'rgba(0,0,0,0.3)', color: '#fff', border: 'none' }}
            onClick={() => onBack?.()}
          >
            ← Quay lại
          </button>
        </div>
      </div>
    )
  }

  if (stage === 'ending') {
    const endingImg = MISSION_ENDS[missionId]
      ?? ([1, 2, 6].includes(missionId) ? '/illos/ending-ark.webp' : '/illos/ending-intern.webp')
    return (
      <div className="p2-shell">
        <img
          src={endingImg}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        <div className="p2-ending" style={{ position: 'relative', zIndex: 1 }}>
          <Capi outfit="lab" pose="cheer" size={130} />
          <div
            className="mono"
            style={{ color: '#843497', fontSize: 12, letterSpacing: '0.15em' }}
          >
            NHIỆM VỤ HOÀN THÀNH ✓
          </div>
          <h2>{m.name_vn}</h2>
          <p style={{ color: '#6b7280', fontSize: 15, lineHeight: 1.6, maxWidth: 440, margin: 0 }}>
            Bạn đã trả lời {qs.length} câu hỏi. Capi-Gene đang tổng hợp dữ liệu hành vi của bạn...
          </p>
          <button
            className="p2-btn"
            style={{ maxWidth: 300 }}
            onClick={() => {
              capiAudio.sfx('success')
              onComplete(answers)
            }}
          >
            Đi đến phản chiếu →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p2-q-shell">
      {/* Left panel: illustration + context */}
      <div className="p2-q-left" key={`illo-${idx}`}>
        <img
          src={illoSrc}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
        {q.chapter_vn && <div className="p2-chapter-pill">{q.chapter_vn}</div>}
        {q.context_vn && (
          <div
            style={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              zIndex: 3,
              background: 'rgba(0,0,0,0.45)',
              color: 'rgba(255,255,255,0.9)',
              fontSize: 11,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '0.05em',
              lineHeight: 1.5,
              padding: '7px 12px',
              borderRadius: 8,
            }}
          >
            {q.context_vn}
          </div>
        )}
      </div>

      {/* Right panel: question + options + nav */}
      <div className="p2-q-right">
        <div className="p2-q-header">
          <span className="p2-q-header-label">Câu hỏi {idx + 1} / {qs.length}</span>
          <span className="p2-q-header-progress">{progress}% Hoàn thiện</span>
        </div>
        <div className="p2-q-progress-bar">
          <div className="p2-q-progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="p2-q-text" key={`q-${idx}`}>
          {q.capi_dialogue_vn?.replace(/^[""]|[""]$/g, '')}
        </div>

        <div className="p2-options">
          {q.options.map((opt) => (
            <button
              key={opt.label}
              className={`p2-option${picked === opt.label ? ' p2-selected' : ''}`}
              onClick={() => selectOption(opt)}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: picked === opt.label ? '#843497' : '#f3f4f6',
                  color: picked === opt.label ? '#fff' : '#6b7280',
                  fontSize: 11,
                  fontWeight: 700,
                  marginRight: 10,
                  flexShrink: 0,
                }}
              >
                {opt.label}
              </span>
              {opt.text_vn}
            </button>
          ))}
        </div>

        <div className="p2-q-nav">
          <button className="p2-nav-back" onClick={goBack}>
            ← Quay lại
          </button>
          <button className="p2-nav-next" disabled={picked === null} onClick={goNext}>
            Tiếp tục →
          </button>
        </div>
      </div>
    </div>
  )
}
