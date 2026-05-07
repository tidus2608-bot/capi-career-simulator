import React, { useState, useEffect, useMemo, useRef } from 'react'
import Capi from './Capi.jsx'
import { DualRadar, Typed, Particles, RoleIcon, SceneArt } from './UI.jsx'
import { capiAudio } from '../audio.js'
import {
  CAPI_ROLES, CAPI_THEMES, CAPI_MISSIONS, MISSION_BG,
  PHASE1_QUESTIONS, CONFIDENCE_CHECKS, LIKERT_AGREE,
  PHASE3_QUESTIONS, LIKERT_FIT,
} from '../data.js'

/* ── Common shell ───────────────────────────────────────────────────────── */
const SceneShell = ({ children, className = '', bg = 'default' }) => {
  const bgClass = { default:'',river:'scene-river',hospital:'scene-hospital',rescue:'scene-rescue',home:'scene-home',warehouse:'scene-warehouse',drone:'scene-drone',lab:'scene-lab' }[bg] || ''
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }} className={bgClass}>
      <div className="cosmic-bg" />
      <Particles count={20} />
      <div className="scanline" />
      <div className="hud-frame"><span className="hud-tr" /><span className="hud-bl" /></div>
      <div className={`fade-in ${className}`} style={{ position:'relative', zIndex:5, height:'100%', width:'100%' }}>
        {children}
      </div>
    </div>
  )
}

/* ── Likert slider component ────────────────────────────────────────────── */
const LikertSlider = ({ labels, value, onChange }) => {
  const keys = Object.keys(labels)  // ['1','2','3','4','5']
  return (
    <div style={{ padding: '18px 0 6px' }}>
      <input
        type="range" min="1" max="5" step="1" value={value || 3}
        onChange={e => onChange(Number(e.target.value))}
        className="likert-range"
      />
      <div style={{ display:'flex', justifyContent:'space-between', marginTop: 8 }}>
        {keys.map(k => (
          <span key={k} className="mono" style={{ fontSize:10, color: Number(k) === value ? 'var(--cyan)' : 'var(--ink-mute)', textAlign:'center', flex:1, lineHeight:1.2 }}>
            {k}<br/><span style={{ fontSize:9, display:'block' }}>{labels[k]}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   INTRO SCREEN
══════════════════════════════════════════════════════════════════════════ */
export const IntroScene = ({ onStart, user, supabase }) => {
  const [signingIn, setSigningIn] = useState(false)
  useEffect(() => { capiAudio.pad([110, 164.8, 220, 329.6], 'cold') }, [])

  const signIn = async () => {
    setSigningIn(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <SceneShell>
      <div style={{ display:'grid', placeItems:'center', height:'100%', padding:24 }}>
        <div style={{ textAlign:'center', maxWidth:780 }} className="fade-up">
          <div className="mono" style={{ color:'var(--cyan)', marginBottom:18 }}>VIỆN NGHIÊN CỨU CAPI  ·  ESTABLISHED 20XX</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(36px,6vw,68px)', fontWeight:700, lineHeight:1.05, margin:'0 0 10px', letterSpacing:'-0.02em' }}>
            Hành trình <span style={{ background:'linear-gradient(90deg,#00e5ff,#ff2d7a)', WebkitBackgroundClip:'text', color:'transparent' }}>Điểm chạm</span> Tương lai
          </h1>
          <div className="mono" style={{ color:'var(--ink-dim)', letterSpacing:'0.2em', fontSize:13, marginBottom:40 }}>CAPI CAREER PATH SIMULATOR</div>

          <div style={{ display:'flex', justifyContent:'center', margin:'20px 0 32px', position:'relative' }}>
            <div style={{ position:'relative', width:220, height:220 }}>
              <div className="pulse-ring" /><div className="pulse-ring d1" /><div className="pulse-ring d2" />
              <div style={{ position:'absolute', inset:0, display:'grid', placeItems:'center' }}>
                <Capi outfit="lab" pose="idle" size={180} />
              </div>
            </div>
          </div>

          <p style={{ fontSize:17, lineHeight:1.6, color:'var(--ink-dim)', maxWidth:620, margin:'0 auto 32px' }}>
            Capi sẽ quét hệ thống tư duy của bạn qua 15 câu hỏi, dẫn bạn vào một nhiệm vụ mô phỏng thực chiến 20 câu, và giải mã <em style={{ color:'var(--cyan)', fontStyle:'normal' }}>Capi-Gene</em> — mật mã nghề nghiệp của bạn.
          </p>

          {user ? (
            <div>
              <div className="mono" style={{ color:'var(--green)', marginBottom:16 }}>
                ✓ Đã đăng nhập: {user.user_metadata?.full_name || user.email}
              </div>
              <button className="btn btn-primary" onClick={() => { capiAudio.sfx('confirm'); onStart() }}>
                BẮT ĐẦU QUÉT
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
              <button className="btn btn-primary" onClick={signIn} disabled={signingIn}>
                {signingIn ? 'Đang chuyển hướng...' : '🔑 Đăng nhập Google & Bắt đầu'}
              </button>
              <button className="btn btn-ghost" onClick={() => { capiAudio.sfx('confirm'); onStart() }}>
                Chơi không lưu kết quả
              </button>
            </div>
          )}

          <div style={{ marginTop:36, display:'flex', gap:18, justifyContent:'center', flexWrap:'wrap' }}>
            {['15 câu Phase 1', '20 câu/nhiệm vụ', '5 vai trò nghề nghiệp', 'Chứng chỉ Capi-Gene'].map(s => (
              <span key={s} className="pill">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 1 — SCAN (15 Likert + 2 confidence checks)
══════════════════════════════════════════════════════════════════════════ */
export const ScanningScene = ({ onComplete }) => {
  // Store phase1 questions in a global so App can access role mapping
  useEffect(() => { window.__p1qs = PHASE1_QUESTIONS }, [])
  useEffect(() => { capiAudio.pad([130.8, 196, 261.6, 392], 'cold') }, [])

  const total = PHASE1_QUESTIONS.length + CONFIDENCE_CHECKS.length  // 17
  const [idx, setIdx] = useState(0)
  const [selfPerception, setSelfPerception] = useState({})     // { qId: 1..5 }
  const [confidence, setConfidence] = useState({})             // { cId: 1..5 }
  const [pendingNext, setPendingNext] = useState(false)

  const isConfidencePhase = idx >= PHASE1_QUESTIONS.length
  const currentQ = isConfidencePhase
    ? CONFIDENCE_CHECKS[idx - PHASE1_QUESTIONS.length]
    : PHASE1_QUESTIONS[idx]
  const currentValue = isConfidencePhase
    ? (confidence[currentQ.id] ?? 3)
    : (selfPerception[currentQ.id] ?? 3)

  const [showIntro, setShowIntro] = useState(true)

  const setCurrentValue = (v) => {
    if (isConfidencePhase) setConfidence(prev => ({ ...prev, [currentQ.id]: v }))
    else setSelfPerception(prev => ({ ...prev, [currentQ.id]: v }))
  }

  const next = () => {
    if (pendingNext) return
    capiAudio.sfx('click')
    if (!isConfidencePhase && selfPerception[currentQ.id] === undefined) setCurrentValue(3)
    if (isConfidencePhase && confidence[currentQ.id] === undefined) setCurrentValue(3)

    if (idx + 1 >= total) {
      capiAudio.sfx('scan')
      // Ensure all questions have a value (default 3 if skipped)
      const spFull = {}
      for (const q of PHASE1_QUESTIONS) spFull[q.id] = selfPerception[q.id] ?? 3
      const cfFull = {}
      for (const c of CONFIDENCE_CHECKS) cfFull[c.id] = confidence[c.id] ?? 3
      onComplete({ selfPerception: spFull, confidence: cfFull })
    } else {
      setIdx(i => i + 1)
    }
  }

  if (showIntro) {
    return (
      <SceneShell bg="lab">
        <SceneArt variant="lab" />
        <div style={{ display:'grid', placeItems:'center', height:'100%', padding:24 }}>
          <div className="glass fade-up" style={{ maxWidth:640, padding:30 }}>
            <div className="mono" style={{ color:'var(--cyan)' }}>PHASE 1  ·  CAPI-SCAN</div>
            <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:18, margin:'20px 0', alignItems:'end' }}>
              <Capi outfit="lab" pose="talk" size={120} />
              <div className="dialogue">
                <div className="mono" style={{ color:'var(--cyan)', marginBottom:6 }}>CAPI</div>
                <div style={{ fontSize:16, lineHeight:1.6 }}>
                  "Chào mừng bạn đến với Viện Nghiên cứu Capi! Trước khi bước vào các cổng mô phỏng thực tế ảo, hãy để mình quét sơ bộ hệ thống tư duy của bạn nhé."
                </div>
              </div>
            </div>
            <p style={{ color:'var(--ink-dim)', fontSize:14, marginBottom:22, lineHeight:1.6 }}>
              Bạn sẽ trả lời <strong style={{ color:'var(--cyan)' }}>15 câu hỏi</strong> trên thang điểm 1–5. Hãy chọn theo những gì bạn <em>thực sự</em> thường làm, không phải những gì bạn nghĩ là "nên chọn".
            </p>
            <button className="btn btn-primary" onClick={() => setShowIntro(false)}>BẮT ĐẦU QUÉT →</button>
          </div>
        </div>
      </SceneShell>
    )
  }

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      <div style={{ display:'grid', gridTemplateRows:'auto 1fr auto', height:'100%', padding:'28px 24px', gap:20, maxWidth:1000, margin:'0 auto' }}>

        {/* Header */}
        <div className="fade-up" style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <div className="mono" style={{ color: isConfidencePhase ? 'var(--gold)' : 'var(--cyan)' }}>
            {isConfidencePhase ? 'KIỂM TRA ĐỘ TIN CẬY' : 'CAPI-SCAN'}
            &nbsp;·&nbsp;{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </div>
          <div className="progress" style={{ flex:1, maxWidth:320 }}>
            <i style={{ width:`${((idx + 1) / total) * 100}%` }} />
          </div>
          {!isConfidencePhase && (
            <span className="pill" style={{ fontSize:11, color:'var(--ink-mute)' }}>
              {CAPI_ROLES[currentQ.role]?.nameVn || currentQ.role}
            </span>
          )}
        </div>

        {/* Capi + question */}
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:22, alignItems:'end', alignSelf:'end' }} className="fade-up">
          <div style={{ display:'grid', placeItems:'center' }}>
            <Capi outfit="lab" pose="talk" size={130} />
          </div>
          <div>
            <div className="dialogue" style={{ marginBottom:0 }}>
              <div className="mono" style={{ color:'var(--cyan)', marginBottom:6 }}>CAPI</div>
              <div key={idx} style={{ fontSize:19, lineHeight:1.5, fontFamily:'var(--font-display)' }}>
                <Typed text={currentQ.text_vn} speed={15} />
              </div>
            </div>
          </div>
        </div>

        {/* Likert slider + Next */}
        <div className="glass fade-up" style={{ padding:'20px 24px', animationDelay:'0.1s' }}>
          <LikertSlider
            labels={LIKERT_AGREE}
            value={currentValue}
            onChange={setCurrentValue}
          />
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
            <button className="btn btn-primary" onClick={next}>
              {idx + 1 >= total ? 'HOÀN THÀNH →' : 'TIẾP THEO →'}
            </button>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   ROLE REVEAL (after Phase 1)
══════════════════════════════════════════════════════════════════════════ */
export const RoleRevealScene = ({ role, onContinue }) => {
  const r = role ? (CAPI_ROLES[role] || CAPI_ROLES.explorer) : CAPI_ROLES.explorer
  useEffect(() => { capiAudio.sfx('success') }, [])
  return (
    <SceneShell bg="lab">
      <div style={{ display:'grid', placeItems:'center', height:'100%', padding:24 }}>
        <div className="glass fade-up" style={{ padding:36, maxWidth:640, textAlign:'center' }}>
          <div className="mono" style={{ color:r.color }}>SƠ BỘ  ·  PHASE 1 COMPLETE</div>
          <div style={{ margin:'18px 0', display:'grid', placeItems:'center' }}>
            <RoleIcon role={r.key} size={88} />
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:44, margin:'0 0 4px', color:r.color, textShadow:`0 0 30px ${r.color}66` }}>{r.name}</h2>
          <div className="mono" style={{ marginBottom:18 }}>{r.nameVn}</div>
          <div className="dialogue" style={{ textAlign:'left', margin:'0 auto 22px', maxWidth:520 }}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:6 }}>CAPI</div>
            <div>Ồ, một <b style={{ color:r.color }}>{r.name}</b> đầy triển vọng! Hãy chọn một cổng mô phỏng để mình xem bạn tỏa sáng thế nào trong thực tế nhé!</div>
          </div>
          <div className="mono" style={{ color:'var(--ink-mute)', fontSize:12, marginBottom:20 }}>
            * Đây chỉ là kết quả sơ bộ. Kết quả chính thức sẽ được tính sau khi bạn hoàn thành nhiệm vụ.
          </div>
          <button className="btn btn-primary" onClick={onContinue}>CHỌN CỔNG MÔ PHỎNG</button>
        </div>
      </div>
    </SceneShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   THEME PICKER
══════════════════════════════════════════════════════════════════════════ */
export const ThemeScene = ({ onPick }) => (
  <SceneShell>
    <div style={{ height:'100%', padding:'32px 28px', display:'grid', alignContent:'start', gap:24, maxWidth:1200, margin:'0 auto' }}>
      <div className="fade-up" style={{ textAlign:'center' }}>
        <div className="mono" style={{ color:'var(--cyan)' }}>PHASE 2  ·  THE SIMULATION</div>
        <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(28px,4vw,44px)', margin:'8px 0 4px' }}>Chọn một cổng mô phỏng</h2>
        <p style={{ color:'var(--ink-dim)', margin:0 }}>Hãy chọn 1 trong 2 chủ đề để "thực chiến" ngay.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:20, marginTop:20 }}>
        {Object.values(CAPI_THEMES).map((t, i) => (
          <button key={t.id} className="glass fade-up"
            style={{ animationDelay:`${0.1 + i * 0.1}s`, padding:28, textAlign:'left', cursor:'pointer', position:'relative', overflow:'hidden', borderColor:t.accent + '44', transition:'all 0.25s ease' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = 'translateY(-4px)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = t.accent + '44'; e.currentTarget.style.transform = 'none' }}
            onClick={() => { capiAudio.sfx('whoosh'); onPick(t.id) }}
          >
            <div style={{ position:'absolute', inset:0, opacity:0.25, pointerEvents:'none' }}>
              <SceneArt variant={t.id === 'ark-capi' ? 'river' : 'home'} />
            </div>
            <div style={{ position:'relative', zIndex:1 }}>
              <div className="mono" style={{ color:t.accent, marginBottom:8 }}>CỔNG {i + 1}</div>
              <h3 style={{ fontFamily:'var(--font-display)', fontSize:28, margin:'0 0 4px', color:t.accent }}>{t.name}</h3>
              <div style={{ color:'var(--ink-dim)', fontSize:14, marginBottom:14 }}>{t.subtitle}</div>
              <p style={{ fontSize:15, lineHeight:1.55, color:'var(--ink)', opacity:0.88 }}>{t.blurb}</p>
              <div style={{ marginTop:20, display:'flex', gap:8, flexWrap:'wrap' }}>
                {t.mood.split(' • ').map(m => <span key={m} className="pill" style={{ borderColor:t.accent + '55', color:t.accent }}>{m}</span>)}
              </div>
              <div style={{ marginTop:20, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span className="mono">{t.missionIds.length} NHIỆM VỤ</span>
                <span style={{ color:t.accent, fontFamily:'var(--font-display)', fontWeight:600 }}>BƯỚC VÀO →</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  </SceneShell>
)

/* ══════════════════════════════════════════════════════════════════════════
   MISSION PICKER
══════════════════════════════════════════════════════════════════════════ */
export const MissionPickScene = ({ themeId, onPick, onBack }) => {
  const theme = CAPI_THEMES[themeId]
  const missions = theme.missionIds.map(id => CAPI_MISSIONS[id])

  return (
    <SceneShell>
      <div style={{ height:'100%', padding:'28px 28px', display:'grid', gridTemplateRows:'auto 1fr', gap:20, maxWidth:1240, margin:'0 auto' }}>
        <div className="fade-up" style={{ display:'flex', alignItems:'center', gap:14, flexWrap:'wrap' }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ padding:'8px 14px', fontSize:13 }}>← Đổi cổng</button>
          <div>
            <div className="mono" style={{ color:theme.accent }}>{theme.name.toUpperCase()}</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, margin:'2px 0 0' }}>Chọn nhiệm vụ mô phỏng</h2>
          </div>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:16, alignContent:'start' }}>
          {missions.map((m, i) => (
            <button key={m.id} className="glass fade-up"
              style={{ animationDelay:`${0.05 + i * 0.08}s`, padding:0, textAlign:'left', cursor:'pointer', overflow:'hidden', display:'grid', gridTemplateRows:'140px auto', transition:'all 0.25s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = theme.accent }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--line)' }}
              onClick={() => { capiAudio.sfx('whoosh'); onPick(m.id) }}
            >
              <div style={{ position:'relative', overflow:'hidden', background:'#05081c' }}>
                <SceneArt variant={MISSION_BG[m.id]} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(5,6,23,0) 0%,rgba(5,6,23,0.8) 100%)' }} />
                <div style={{ position:'absolute', top:12, left:14, display:'flex', gap:6 }}>
                  <span className="pill" style={{ color:theme.accent, borderColor:theme.accent + '66' }}>MISSION {i + 1}</span>
                  <span className="pill" style={{ fontSize:10 }}>20 câu</span>
                </div>
              </div>
              <div style={{ padding:18 }}>
                <h3 style={{ fontFamily:'var(--font-display)', fontSize:20, margin:'0 0 4px' }}>{m.name_vn}</h3>
                <p style={{ fontSize:13, lineHeight:1.5, color:'var(--ink-dim)', margin:0, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                  {m.questions[0]?.context_vn || ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 2 — MISSION PLAY (20 A/B/C questions)
══════════════════════════════════════════════════════════════════════════ */
export const MissionPlayScene = ({ missionId, onComplete }) => {
  const m = CAPI_MISSIONS[missionId]
  const bg = MISSION_BG[missionId] || 'lab'
  const qs = m.questions  // all 20

  const [innerStage, setInnerStage] = useState('intro')
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})  // { questionId: 'A'|'B'|'C' }
  const [picked, setPicked] = useState(null)
  const [showChapter, setShowChapter] = useState(true)

  useEffect(() => {
    const pads = { 1:[98,146.8,196,293.7], 2:[110,164.8,220,329.6], 6:[73.4,110,146.8,196], 3:[130.8,196,261.6,392], 4:[98,146.8,196,293.7], 5:[110,174.6,220,329.6] }
    capiAudio.pad(pads[missionId] || [110,164.8,220])
  }, [missionId])

  const q = qs[idx]
  const prevChapter = idx > 0 ? qs[idx - 1].chapter_vn : null
  const chapterChanged = !prevChapter || prevChapter !== q?.chapter_vn

  useEffect(() => {
    if (chapterChanged && idx > 0) { setShowChapter(true); const t = setTimeout(() => setShowChapter(false), 2000); return () => clearTimeout(t) }
  }, [idx])

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
        setIdx(i => i + 1)
        setPicked(null)
      }
    }, 480)
  }

  if (innerStage === 'intro') {
    return (
      <SceneShell bg={bg}>
        <SceneArt variant={bg} />
        <div style={{ display:'grid', placeItems:'center', height:'100%', padding:24 }}>
          <div className="glass fade-up" style={{ maxWidth:640, padding:30, textAlign:'center' }}>
            <div className="mono" style={{ color:'var(--cyan)' }}>NHIỆM VỤ · 20 CÂU HỎI</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:34, margin:'8px 0 4px' }}>{m.name_vn}</h2>
            <div style={{ display:'grid', placeItems:'center', margin:'10px 0 18px' }}>
              <Capi outfit="lab" pose="talk" size={140} />
            </div>
            <div className="dialogue" style={{ textAlign:'left', marginBottom:22 }}>
              <div className="mono" style={{ color:'var(--cyan)', marginBottom:6 }}>CAPI</div>
              <div style={{ fontSize:15, lineHeight:1.55 }}>"{qs[0]?.context_vn}"</div>
            </div>
            <button className="btn btn-primary" onClick={() => { capiAudio.sfx('whoosh'); setInnerStage('q') }}>BẮT ĐẦU NHIỆM VỤ</button>
          </div>
        </div>
      </SceneShell>
    )
  }

  if (innerStage === 'ending') {
    return (
      <SceneShell bg={bg}>
        <SceneArt variant={bg} />
        <div style={{ display:'grid', placeItems:'center', height:'100%', padding:24 }}>
          <div className="glass fade-up" style={{ maxWidth:640, padding:34, textAlign:'center' }}>
            <div className="mono" style={{ color:'var(--green)' }}>MISSION COMPLETE ✓</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:36, margin:'8px 0 4px' }}>Nhiệm vụ hoàn thành!</h2>
            <div style={{ display:'grid', placeItems:'center', margin:'14px 0 22px' }}>
              <Capi outfit="lab" pose="cheer" size={130} />
            </div>
            <p style={{ color:'var(--ink-dim)', marginBottom:26 }}>Bạn đã trả lời {qs.length} câu hỏi. Capi-Gene đang tổng hợp dữ liệu hành vi của bạn...</p>
            <button className="btn btn-primary" onClick={() => { capiAudio.sfx('success'); onComplete(answers) }}>
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
      <div style={{ display:'grid', gridTemplateRows:'auto auto 1fr auto', height:'100%', padding:'24px 20px', gap:14, maxWidth:1100, margin:'0 auto' }}>

        {/* Header */}
        <div className="fade-up" style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <span className="pill" style={{ color:'var(--cyan)', borderColor:'var(--cyan)' }}>{q.chapter_vn}</span>
          <div className="mono" style={{ marginLeft:'auto' }}>{String(idx + 1).padStart(2,'0')} / {String(qs.length).padStart(2,'0')}</div>
          <div className="progress" style={{ flex:'0 0 180px' }}>
            <i style={{ width:`${((idx + 1) / qs.length) * 100}%` }} />
          </div>
        </div>

        {/* Context bar */}
        {q.context_vn && (
          <div className="mono" style={{ fontSize:12, color:'var(--ink-mute)', borderLeft:'2px solid var(--line)', paddingLeft:10 }}>
            BỐI CẢNH · {q.context_vn}
          </div>
        )}

        {/* Capi dialogue */}
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:18, alignItems:'end', alignSelf:'end' }} className="fade-up">
          <div style={{ display:'grid', placeItems:'center' }}>
            <Capi outfit="lab" pose="talk" size={120} />
          </div>
          <div className="dialogue">
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:6 }}>CAPI</div>
            <div key={idx} style={{ fontSize:17, lineHeight:1.5, fontFamily:'var(--font-display)' }}>
              <Typed text={q.capi_dialogue_vn?.replace(/^[""]|[""]$/g,'')} speed={14} />
            </div>
          </div>
        </div>

        {/* Options */}
        <div key={idx} style={{ display:'grid', gap:10, gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))' }}>
          {q.options.map((opt) => (
            <button key={opt.label}
              className={`option-card fade-up ${picked === opt.label ? 'picked' : ''}`}
              style={{ animationDelay:`${0.04 + ['A','B','C'].indexOf(opt.label) * 0.06}s` }}
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

/* ══════════════════════════════════════════════════════════════════════════
   PHASE 3 — REFLECTION (5 per-role Likert questions)
══════════════════════════════════════════════════════════════════════════ */
export const ReflectionScene = ({ onComplete }) => {
  useEffect(() => { capiAudio.pad([130.8, 196, 261.6, 392]) }, [])
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState({})  // { roleKey: 1..5 }

  const q = PHASE3_QUESTIONS[idx]
  const current = answers[q.role] ?? 3

  const next = () => {
    const newAnswers = { ...answers, [q.role]: current }
    capiAudio.sfx('click')
    if (idx + 1 >= PHASE3_QUESTIONS.length) {
      capiAudio.sfx('success')
      // Fill any unanswered with 3
      const full = {}
      for (const pq of PHASE3_QUESTIONS) full[pq.role] = newAnswers[pq.role] ?? 3
      onComplete(full)
    } else {
      setAnswers(newAnswers)
      setIdx(i => i + 1)
    }
  }

  const roleData = CAPI_ROLES[q.role] || { color:'var(--cyan)', nameVn: q.role }

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      <div style={{ display:'grid', gridTemplateRows:'auto 1fr auto', height:'100%', padding:'28px 24px', gap:20, maxWidth:1000, margin:'0 auto' }}>

        {/* Header */}
        <div className="fade-up" style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div className="mono" style={{ color:'var(--gold)' }}>PHASE 3  ·  PHẢN CHIẾU</div>
          <div className="progress" style={{ flex:1, maxWidth:300 }}>
            <i style={{ width:`${((idx + 1) / PHASE3_QUESTIONS.length) * 100}%` }} />
          </div>
          <div className="mono">{idx + 1} / {PHASE3_QUESTIONS.length}</div>
        </div>

        {/* Capi + question */}
        <div style={{ display:'grid', gridTemplateColumns:'auto 1fr', gap:22, alignItems:'end', alignSelf:'end' }} className="fade-up">
          <div style={{ display:'grid', placeItems:'center' }}>
            <Capi outfit="lab" pose="talk" size={130} />
          </div>
          <div>
            <div className="mono" style={{ color:roleData.color, marginBottom:8 }}>
              {roleData.name?.toUpperCase() || q.role.toUpperCase()} · {roleData.nameVn}
            </div>
            <div className="dialogue">
              <div className="mono" style={{ color:'var(--cyan)', marginBottom:6 }}>CAPI</div>
              <div key={idx} style={{ fontSize:19, lineHeight:1.5, fontFamily:'var(--font-display)' }}>
                <Typed text={q.text_vn} speed={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Likert + Next */}
        <div className="glass fade-up" style={{ padding:'20px 24px', animationDelay:'0.1s' }}>
          <LikertSlider
            labels={LIKERT_FIT}
            value={current}
            onChange={v => setAnswers(a => ({ ...a, [q.role]: v }))}
          />
          <div style={{ display:'flex', justifyContent:'flex-end', marginTop:16 }}>
            <button className="btn btn-primary" onClick={next}>
              {idx + 1 >= PHASE3_QUESTIONS.length ? 'HOÀN THÀNH →' : 'TIẾP THEO →'}
            </button>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   CERTIFICATE — 12 sections
══════════════════════════════════════════════════════════════════════════ */
export const CertificateScene = ({ result, certCopy, onRestart, onHistory }) => {
  const [flashed, setFlashed] = useState(true)
  useEffect(() => { const t = setTimeout(() => setFlashed(false), 900); capiAudio.sfx('success'); return () => clearTimeout(t) }, [])

  if (!result || !certCopy) return null

  const primary = CAPI_ROLES[result.primaryRole] || { color:'var(--cyan)', name:'Explorer', nameVn:'Nhà Khám Phá' }
  const secondary = CAPI_ROLES[result.secondaryRole] || { color:'var(--magenta)', name:'Builder', nameVn:'Kỹ Sư Chế Tạo' }

  const profileColor = { Hidden:'var(--magenta)', Aligned:'var(--green)', Emerging:'var(--gold)' }[result.profileType] || 'var(--cyan)'

  const sectionStyle = { marginBottom:32, paddingBottom:24, borderBottom:'1px solid var(--line)' }
  const sectionLabel = { ...{} }

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      {flashed && <div className="flash" />}

      <div style={{ position:'relative', zIndex:10, height:'100%', overflow:'auto', padding:'28px 16px' }}>
        <div className="cert-bg fade-up" style={{ maxWidth:900, width:'100%', margin:'0 auto', padding:'40px 36px 28px', position:'relative' }}>
          {/* Header badge */}
          <div style={{ position:'absolute', top:18, left:24, opacity:0.7 }}>
            <span className="mono" style={{ color:'var(--cyan)', letterSpacing:'4px' }}>CAPI-GENE</span>
          </div>
          <div className="mono" style={{ position:'absolute', top:24, right:28, color:'var(--ink-mute)', fontSize:11 }}>
            CERT #{Math.floor(Math.random() * 9000 + 1000)} · {new Date().toISOString().slice(0,10)}
          </div>

          {/* ── S1: Role Radar ── */}
          <div style={{ ...sectionStyle, marginTop:32, textAlign:'center' }}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:16 }}>1 · ROLE RADAR</div>
            <div style={{ display:'flex', justifyContent:'center', gap:24, flexWrap:'wrap', alignItems:'center' }}>
              <DualRadar
                scores1={result.phase1}
                scores2={result.phase2}
                size={300}
                color1="#5b9fff"
                color2="#ff6b9d"
              />
              <div style={{ textAlign:'left', minWidth:200 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <span style={{ width:12, height:12, borderRadius:'50%', background:'#5b9fff', display:'inline-block' }} />
                  <span className="mono" style={{ fontSize:12, color:'#5b9fff' }}>Self-Perception (Phase 1)</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ width:12, height:12, borderRadius:'50%', background:'#ff6b9d', display:'inline-block' }} />
                  <span className="mono" style={{ fontSize:12, color:'#ff6b9d' }}>Actual Behavior (Phase 2)</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── S2: Working Style ── */}
          <div style={sectionStyle}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:8 }}>2 · YOUR WORKING STYLE</div>
            <div style={{ fontFamily:'var(--font-display)', fontSize:18, lineHeight:1.5, color:'var(--ink)' }}>
              {certCopy.workingStyleHeadlineVn}
            </div>
          </div>

          {/* ── S3 & S4: Superpower + Secondary ── */}
          <div style={{ ...sectionStyle, display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            {/* S3 */}
            <div className="glass" style={{ padding:20, borderColor:primary.color + '55' }}>
              <div className="mono" style={{ color:primary.color, marginBottom:6 }}>3 · YOUR SUPERPOWER</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, margin:'4px 0 2px', color:primary.color }}>{certCopy.superpowerVn.roleVn}</h2>
              <div className="mono" style={{ color:'var(--ink-mute)', marginBottom:8 }}>{certCopy.superpowerVn.roleEn}</div>
              <div style={{ fontSize:14, color:'var(--ink-dim)', marginBottom:10 }}>{certCopy.superpowerVn.tagline}</div>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                <span className="pill" style={{ color:primary.color, borderColor:primary.color + '55' }}>{certCopy.superpowerVn.bandLabel}</span>
                <span className="pill">{certCopy.superpowerVn.score} / 100</span>
              </div>
            </div>
            {/* S4 */}
            <div className="glass" style={{ padding:20, borderColor:secondary.color + '55' }}>
              <div className="mono" style={{ color:secondary.color, marginBottom:6 }}>4 · SECONDARY POWER</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, margin:'4px 0 2px', color:secondary.color }}>{certCopy.secondaryPowerVn.roleVn}</h2>
              <div className="mono" style={{ color:'var(--ink-mute)', marginBottom:8 }}>{certCopy.secondaryPowerVn.roleEn}</div>
              <div style={{ fontSize:14, color:'var(--ink-dim)', marginBottom:10 }}>{certCopy.secondaryPowerVn.tagline}</div>
              <span className="pill">{certCopy.secondaryPowerVn.score} / 100</span>
            </div>
          </div>

          {/* ── S5: Profile Type ── */}
          <div style={{ ...sectionStyle, textAlign:'center' }}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:10 }}>5 · PROFILE TYPE</div>
            <div style={{ display:'inline-block', padding:'16px 40px', borderRadius:12, border:`2px solid ${profileColor}`, background:`${profileColor}15`, marginBottom:16 }}>
              <div className="mono" style={{ color:profileColor, fontSize:13, marginBottom:4 }}>{result.profileType.toUpperCase()}</div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(32px,4vw,52px)', margin:0, color:profileColor, textShadow:`0 0 30px ${profileColor}55` }}>
                {certCopy.profileTypeLabelVn}
              </h2>
            </div>
            <p style={{ fontSize:15, lineHeight:1.7, color:'var(--ink-dim)', maxWidth:600, margin:'0 auto' }}>
              {certCopy.profileTypeNarrativeVn}
            </p>
          </div>

          {/* ── S6: Reality & Growth Insight ── */}
          <div style={sectionStyle}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:10 }}>6 · REALITY & GROWTH INSIGHT</div>
            <div className="dialogue" style={{ margin:0 }}>
              <div className="mono" style={{ color:'var(--cyan)', marginBottom:6 }}>CAPI</div>
              <p style={{ fontSize:15, lineHeight:1.7, margin:0 }}>{certCopy.realityGrowthInsightVn}</p>
            </div>
            {/* Gap pills */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginTop:14 }}>
              <span className="pill" style={{ color:'#5b9fff' }}>Reality Gap (P2–P1): {Math.round(result.realityGap[result.primaryRole])} pt</span>
              <span className="pill" style={{ color:'var(--gold)' }}>Learning Gap (P3–P1): {Math.round(result.learningGap[result.primaryRole])} pt</span>
              <span className="pill" style={{ color:'var(--green)' }}>Confidence: {(result.confidenceFactor * 100).toFixed(0)}%</span>
            </div>
          </div>

          {/* ── S7: Role Interpretation ── */}
          <div style={sectionStyle}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:10 }}>7 · ROLE INTERPRETATION</div>
            <div style={{ display:'grid', gap:12 }}>
              <div style={{ padding:14, borderLeft:`3px solid ${primary.color}`, background:`${primary.color}0a`, borderRadius:'0 8px 8px 0' }}>
                <div style={{ fontSize:13, lineHeight:1.6, color:'var(--ink-dim)', whiteSpace:'pre-line' }}>{certCopy.primaryInterpretationVn}</div>
              </div>
              <div style={{ padding:14, borderLeft:`3px solid ${secondary.color}`, background:`${secondary.color}0a`, borderRadius:'0 8px 8px 0' }}>
                <div style={{ fontSize:13, lineHeight:1.6, color:'var(--ink-dim)', whiteSpace:'pre-line' }}>{certCopy.secondaryInterpretationVn}</div>
              </div>
            </div>
          </div>

          {/* ── S8: Full Score Breakdown ── */}
          <div style={sectionStyle}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:12 }}>8 · FULL SCORE BREAKDOWN</div>
            <div style={{ overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign:'left', padding:'8px 10px', borderBottom:'1px solid var(--line)', color:'var(--ink-dim)' }}>Vai trò</th>
                    <th style={{ textAlign:'right', padding:'8px 10px', borderBottom:'1px solid var(--line)', color:'#5b9fff' }}>P1 Tự nhận</th>
                    <th style={{ textAlign:'right', padding:'8px 10px', borderBottom:'1px solid var(--line)', color:'#ff6b9d' }}>P2 Hành vi</th>
                    <th style={{ textAlign:'right', padding:'8px 10px', borderBottom:'1px solid var(--line)', color:'var(--gold)' }}>P3 Phản chiếu</th>
                    <th style={{ textAlign:'right', padding:'8px 10px', borderBottom:'1px solid var(--line)', color:'var(--cyan)' }}>Tổng hợp</th>
                  </tr>
                </thead>
                <tbody>
                  {certCopy.fullScoreBreakdown.map(row => {
                    const rc = CAPI_ROLES[row.role]?.color || 'var(--ink)'
                    const isPrimary = row.role === result.primaryRole
                    return (
                      <tr key={row.role} style={{ background: isPrimary ? `${rc}10` : 'transparent' }}>
                        <td style={{ padding:'8px 10px', color:rc, fontWeight: isPrimary ? 600 : 400 }}>
                          {row.roleVn} {isPrimary ? '★' : ''}
                        </td>
                        <td style={{ textAlign:'right', padding:'8px 10px', color:'#5b9fff' }}>{row.selfPerception}</td>
                        <td style={{ textAlign:'right', padding:'8px 10px', color:'#ff6b9d' }}>{row.actualBehavior}</td>
                        <td style={{ textAlign:'right', padding:'8px 10px', color:'var(--gold)' }}>{row.reflection}</td>
                        <td style={{ textAlign:'right', padding:'8px 10px', color:'var(--cyan)', fontWeight:600 }}>{row.final}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── S9: Growth Areas ── */}
          <div style={sectionStyle}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:10 }}>9 · SUGGESTED GROWTH AREAS</div>
            <div style={{ display:'grid', gap:8 }}>
              {certCopy.growthAreasVn.map((g, i) => (
                <div key={i} style={{ padding:'10px 14px', background:'rgba(255,176,32,0.07)', border:'1px solid rgba(255,176,32,0.2)', borderRadius:8, fontSize:14, color:'var(--ink-dim)' }}>
                  💡 {g}
                </div>
              ))}
            </div>
          </div>

          {/* ── S10: Career & Learning Pathways ── */}
          <div style={sectionStyle}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:10 }}>10 · CAREER & LEARNING PATHWAYS</div>
            <p style={{ fontSize:14, lineHeight:1.7, color:'var(--ink-dim)', marginTop:0 }}>
              Sự kết hợp của <b style={{ color:primary.color }}>{certCopy.superpowerVn.roleVn}</b> và <b style={{ color:secondary.color }}>{certCopy.secondaryPowerVn.roleVn}</b> tạo nên một profil hiếm có: bạn vừa có thể đào sâu vào lĩnh vực kỹ thuật của mình, vừa có khả năng hợp tác với các nhóm chức năng khác. Định hướng phù hợp với bạn là những vai trò đòi hỏi cả tư duy chuyên sâu lẫn sự linh hoạt.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <div className="mono" style={{ color:primary.color, fontSize:11, marginBottom:6 }}>KỸ NĂNG CỐT LÕI</div>
                {certCopy.primaryQualifications.slice(0,3).map(q => (
                  <div key={q} style={{ padding:'6px 10px', background:`${primary.color}0a`, borderRadius:6, fontSize:13, marginBottom:4 }}>→ {q}</div>
                ))}
              </div>
              <div>
                <div className="mono" style={{ color:secondary.color, fontSize:11, marginBottom:6 }}>KỸ NĂNG BỔ SUNG</div>
                {certCopy.secondaryQualifications.slice(0,3).map(q => (
                  <div key={q} style={{ padding:'6px 10px', background:`${secondary.color}0a`, borderRadius:6, fontSize:13, marginBottom:4 }}>→ {q}</div>
                ))}
              </div>
            </div>
          </div>

          {/* ── S11: Careers ── */}
          <div style={sectionStyle}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:10 }}>11 · CAREERS</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {[...certCopy.primaryCareers, ...certCopy.secondaryCareers].map((c, i) => (
                <span key={c + i} className="pill" style={{ color: i < certCopy.primaryCareers.length ? primary.color : secondary.color, borderColor: i < certCopy.primaryCareers.length ? `${primary.color}55` : `${secondary.color}55` }}>
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* ── S12: Majors ── */}
          <div style={{ ...sectionStyle, borderBottom:'none', marginBottom:20 }}>
            <div className="mono" style={{ color:'var(--cyan)', marginBottom:10 }}>12 · MAJORS</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {[...certCopy.primaryMajors, ...certCopy.secondaryMajors].map((m, i) => (
                <span key={m + i} className="pill" style={{ fontSize:12 }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div style={{ borderTop:'1px dashed var(--line)', paddingTop:22, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
            <div className="mono" style={{ color:'var(--ink-dim)', fontSize:11 }}>VIỆN NGHIÊN CỨU CAPI · CAPI-GENE v2.0</div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              {onHistory && <button className="btn btn-ghost" onClick={onHistory}>Xem lịch sử</button>}
              <button className="btn btn-ghost" onClick={() => window.print()}>In / Lưu PDF</button>
              <button className="btn btn-primary" onClick={onRestart}>LÀM LẠI TỪ ĐẦU</button>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   HISTORY
══════════════════════════════════════════════════════════════════════════ */
export const HistoryScene = ({ user, supabase, onBack }) => {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('runs')
      .select('id,created_at,mission_id,theme,primary_role,secondary_role,profile_type,scores')
      .order('created_at', { ascending:false })
      .limit(20)
      .then(({ data, error }) => {
        if (!error) setRuns(data || [])
        setLoading(false)
      })
  }, [user])

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      <div style={{ height:'100%', overflow:'auto', padding:'28px 24px', maxWidth:900, margin:'0 auto' }}>
        <div className="fade-up" style={{ display:'flex', alignItems:'center', gap:16, marginBottom:28, flexWrap:'wrap' }}>
          <button className="btn btn-ghost" onClick={onBack}>← Quay lại</button>
          <div>
            <div className="mono" style={{ color:'var(--cyan)' }}>LỊCH SỬ CHẠY</div>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:28, margin:'4px 0 0' }}>Các lần chơi trước</h2>
          </div>
        </div>

        {loading ? (
          <div className="mono" style={{ color:'var(--ink-mute)', textAlign:'center', marginTop:60 }}>Đang tải...</div>
        ) : runs.length === 0 ? (
          <div className="glass" style={{ padding:30, textAlign:'center', color:'var(--ink-dim)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📋</div>
            Chưa có lần chạy nào được lưu.
          </div>
        ) : (
          <div style={{ display:'grid', gap:12 }}>
            {runs.map(r => {
              const pr = CAPI_ROLES[r.primary_role] || { color:'var(--cyan)', name:r.primary_role, nameVn:r.primary_role }
              const profileColor = { Hidden:'var(--magenta)', Aligned:'var(--green)', Emerging:'var(--gold)' }[r.profile_type] || 'var(--cyan)'
              const theme = CAPI_THEMES[r.theme]
              return (
                <div key={r.id} className="glass fade-up" style={{ padding:'18px 20px', display:'grid', gridTemplateColumns:'1fr auto', gap:16, alignItems:'center' }}>
                  <div>
                    <div style={{ display:'flex', gap:8, marginBottom:8, flexWrap:'wrap' }}>
                      <span className="pill" style={{ color:pr.color, borderColor:`${pr.color}55` }}>{pr.nameVn}</span>
                      <span className="pill" style={{ color:profileColor }}>{r.profile_type}</span>
                      {theme && <span className="pill" style={{ fontSize:11 }}>{theme.name}</span>}
                    </div>
                    <div className="mono" style={{ color:'var(--ink-mute)', fontSize:11 }}>
                      Mission #{r.mission_id} · {new Date(r.created_at).toLocaleDateString('vi-VN', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                    </div>
                  </div>
                  {r.scores?.final && (
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:24, fontFamily:'var(--font-display)', color:pr.color, fontWeight:700 }}>
                        {Math.round(r.scores.final[r.primary_role])}
                      </div>
                      <div className="mono" style={{ fontSize:10, color:'var(--ink-mute)' }}>Final Score</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </SceneShell>
  )
}

/* ── Transition wrapper ─────────────────────────────────────────────────── */
export const Transition = ({ k, children }) => (
  <div key={k} className="fade-in" style={{ position:'absolute', inset:0 }}>{children}</div>
)
