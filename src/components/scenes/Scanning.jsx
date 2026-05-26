import { useState, useEffect } from 'react'
import Capi from '../Capi.jsx'
import { Typed, SceneArt } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_ROLES, PHASE1_QUESTIONS, CONFIDENCE_CHECKS, LIKERT_AGREE } from '../../data.js'
import SceneShell from './SceneShell.jsx'
import LikertSlider from './LikertSlider.jsx'

export default function ScanningScene({ onComplete }) {
  useEffect(() => {
    capiAudio.pad([130.8, 196, 261.6, 392], 'cold')
  }, [])

  const total = PHASE1_QUESTIONS.length + CONFIDENCE_CHECKS.length // 17
  const [idx, setIdx] = useState(0)
  const [selfPerception, setSelfPerception] = useState({})
  const [confidence, setConfidence] = useState({})

  const isConfidencePhase = idx >= PHASE1_QUESTIONS.length
  const currentQ = isConfidencePhase
    ? CONFIDENCE_CHECKS[idx - PHASE1_QUESTIONS.length]
    : PHASE1_QUESTIONS[idx]
  const currentValue = isConfidencePhase
    ? (confidence[currentQ.id] ?? 3)
    : (selfPerception[currentQ.id] ?? 3)

  const [showIntro, setShowIntro] = useState(true)

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
      <SceneShell bg="lab">
        <SceneArt variant="lab" />
        <div style={{ display: 'grid', placeItems: 'center', height: '100%', padding: 24 }}>
          <div className="glass fade-up" style={{ maxWidth: 640, padding: 30 }}>
            <div className="mono" style={{ color: 'var(--cyan)' }}>
              PHASE 1 &middot;&nbsp; CAPI-SCAN
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: 18,
                margin: '20px 0',
                alignItems: 'end',
              }}
            >
              <Capi outfit="lab" pose="talk" size={120} />
              <div className="dialogue">
                <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 6 }}>
                  CAPI
                </div>
                <div style={{ fontSize: 16, lineHeight: 1.6 }}>
                  &ldquo;Chào mừng bạn đến với Viện Nghiên cứu Capi! Trước khi bước vào các cổng mô
                  phỏng thực tế ảo, hãy để mình quét sơ bộ hệ thống tư duy của bạn nhé.&rdquo;
                </div>
              </div>
            </div>
            <p style={{ color: 'var(--ink-dim)', fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
              Bạn sẽ trả lời <strong style={{ color: 'var(--cyan)' }}>15 câu hỏi</strong> trên
              thang điểm 1&ndash;5. Hãy chọn theo những gì bạn <em>thực sự</em> thường làm, không
              phải những gì bạn nghĩ là &ldquo;nên chọn&rdquo;.
            </p>
            <button className="btn btn-primary" onClick={() => setShowIntro(false)}>
              BẮT ĐẦU QUÉT →
            </button>
          </div>
        </div>
      </SceneShell>
    )
  }

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
        {/* Header */}
        <div
          className="fade-up"
          style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}
        >
          <div
            className="mono"
            style={{ color: isConfidencePhase ? 'var(--gold)' : 'var(--cyan)' }}
          >
            {isConfidencePhase ? 'KIỂM TRA ĐỘ TIN CẬY' : 'CAPI-SCAN'}
            &nbsp;·&nbsp;{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <div className="progress" style={{ flex: 1, maxWidth: 320 }}>
            <i style={{ width: `${((idx + 1) / total) * 100}%` }} />
          </div>
          {!isConfidencePhase && (
            <span className="pill" style={{ fontSize: 11, color: 'var(--ink-mute)' }}>
              {CAPI_ROLES[currentQ.role]?.nameVn || currentQ.role}
            </span>
          )}
        </div>

        {/* Capi + question */}
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
            <div className="dialogue" style={{ marginBottom: 0 }}>
              <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 6 }}>
                CAPI
              </div>
              <div
                key={idx}
                style={{ fontSize: 19, lineHeight: 1.5, fontFamily: 'var(--font-display)' }}
              >
                <Typed text={currentQ.text_vn} speed={15} />
              </div>
            </div>
          </div>
        </div>

        {/* Likert + Next */}
        <div className="glass fade-up" style={{ padding: '20px 24px', animationDelay: '0.1s' }}>
          <LikertSlider labels={LIKERT_AGREE} value={currentValue} onChange={setCurrentValue} />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
            <button className="btn btn-primary" onClick={next}>
              {idx + 1 >= total ? 'HOÀN THÀNH →' : 'TIẾP THEO →'}
            </button>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
