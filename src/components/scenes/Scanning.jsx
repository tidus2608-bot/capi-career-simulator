import { useState, useEffect } from 'react'
import Capi from '../Capi.jsx'
import { Typed } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_ROLES, PHASE1_QUESTIONS, CONFIDENCE_CHECKS, LIKERT_AGREE } from '../../data.js'
import SceneShell from './SceneShell.jsx'
import LikertSlider from './LikertSlider.jsx'

export default function ScanningScene({ onComplete }) {
  useEffect(() => {
    capiAudio.pad([130.8, 196, 261.6, 392], 'cold')
  }, [])

  const total = PHASE1_QUESTIONS.length + CONFIDENCE_CHECKS.length
  const [idx, setIdx] = useState(0)
  const [selfPerception, setSelfPerception] = useState({})
  const [confidence, setConfidence] = useState({})
  const [showIntro, setShowIntro] = useState(true)

  const isConfidencePhase = idx >= PHASE1_QUESTIONS.length
  const currentQ = isConfidencePhase
    ? CONFIDENCE_CHECKS[idx - PHASE1_QUESTIONS.length]
    : PHASE1_QUESTIONS[idx]
  const currentValue = isConfidencePhase
    ? (confidence[currentQ.id] ?? 3)
    : (selfPerception[currentQ.id] ?? 3)

  const setCurrentValue = (v) => {
    if (isConfidencePhase) setConfidence((prev) => ({ ...prev, [currentQ.id]: v }))
    else setSelfPerception((prev) => ({ ...prev, [currentQ.id]: v }))
  }

  const next = () => {
    capiAudio.sfx('click')
    if (!isConfidencePhase && selfPerception[currentQ.id] === undefined) setCurrentValue(3)
    if (isConfidencePhase && confidence[currentQ.id] === undefined) setCurrentValue(3)
    if (idx + 1 >= total) {
      capiAudio.sfx('scan')
      const spFull = {}
      for (const q of PHASE1_QUESTIONS) spFull[q.id] = selfPerception[q.id] ?? 3
      const cfFull = {}
      for (const c of CONFIDENCE_CHECKS) cfFull[c.id] = confidence[c.id] ?? 3
      onComplete({ selfPerception: spFull, confidence: cfFull })
    } else {
      setIdx((i) => i + 1)
    }
  }

  if (showIntro) {
    return (
      <SceneShell light>
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 24 }}>
          <div className="glass fade-up" style={{ maxWidth: 600, padding: '32px 36px' }}>
            <div className="mono" style={{ color: '#843497', marginBottom: 20 }}>
              PHASE 1 · CAPI-SCAN
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, marginBottom: 24, alignItems: 'end' }}>
              <Capi outfit="lab" pose="talk" size={110} />
              <div className="dialogue">
                <div className="mono" style={{ color: '#843497', marginBottom: 8 }}>CAPI</div>
                <div style={{ fontSize: 15, lineHeight: 1.65, color: '#1a1a2e' }}>
                  "Chào mừng bạn đến với Viện Nghiên cứu Capi! Trước khi bước vào các cổng mô
                  phỏng thực tế ảo, hãy để mình quét sơ bộ hệ thống tư duy của bạn nhé."
                </div>
              </div>
            </div>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24, lineHeight: 1.65 }}>
              Bạn sẽ trả lời{' '}
              <strong style={{ color: '#1a1a2e' }}>15 câu hỏi</strong> trên thang điểm 1–5. Hãy
              chọn theo những gì bạn <em style={{ fontStyle: 'normal', color: '#843497', fontWeight: 600 }}>thực sự</em> thường
              làm, không phải những gì bạn nghĩ là "nên chọn".
            </p>
            <button className="btn btn-primary" onClick={() => setShowIntro(false)}>
              Bắt đầu quét →
            </button>
          </div>
        </div>
      </SceneShell>
    )
  }

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
          <div className="mono" style={{ color: isConfidencePhase ? '#f59e0b' : '#843497' }}>
            {isConfidencePhase ? 'Kiểm tra độ tin cậy' : 'Capi-Scan'}
            &nbsp;·&nbsp;{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <div className="progress" style={{ flex: 1, maxWidth: 280 }}>
            <i style={{ width: `${((idx + 1) / total) * 100}%` }} />
          </div>
          {!isConfidencePhase && (
            <span className="pill">{CAPI_ROLES[currentQ.role]?.nameVn || currentQ.role}</span>
          )}
        </div>

        {/* Capi + question */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 20, alignItems: 'end', alignSelf: 'end' }}
          className="fade-up"
        >
          <Capi outfit="lab" pose="talk" size={120} />
          <div className="dialogue">
            <div className="mono" style={{ color: '#843497', marginBottom: 8 }}>CAPI</div>
            <div key={idx} style={{ fontSize: 18, lineHeight: 1.5, fontFamily: 'var(--font-display)', color: '#1a1a2e' }}>
              <Typed text={currentQ.text_vn} speed={15} />
            </div>
          </div>
        </div>

        {/* Likert + Next */}
        <div className="glass fade-up" style={{ padding: '22px 28px', animationDelay: '0.1s' }}>
          <LikertSlider labels={LIKERT_AGREE} value={currentValue} onChange={setCurrentValue} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-primary" onClick={next}>
              {idx + 1 >= total ? 'Hoàn thành →' : 'Tiếp theo →'}
            </button>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
