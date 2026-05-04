import React, { useState, useEffect, useMemo } from 'react'
import { capiAudio } from './audio.js'
import { topRole } from './data.js'
import {
  IntroScene,
  ScanningScene,
  RoleRevealScene,
  ThemeScene,
  MissionPickScene,
  MissionPlayScene,
  ReflectionScene,
  CertificateScene,
  Transition,
} from './components/Scenes.jsx'

const TWEAK_DEFAULTS = {
  scanQuestions: 15,
  missionQuestions: 5,
  autoAdvance: true,
}

async function submitResults({ finalRole, phase1Role, scanScores, missionScores, reflectionWeight, missionId }) {
  const p3Scores = { Explorer: 0, Builder: 0, Operator: 0, Connector: 0, Communicator: 0 }
  if (phase1Role) p3Scores[phase1Role] = (reflectionWeight || 0) * 2

  const shareHash = btoa(JSON.stringify({
    r: finalRole,
    p1: scanScores,
    p2: missionScores,
    p3: p3Scores,
  }))

  const confidence = reflectionWeight === 1 ? 5 : reflectionWeight === 0.5 ? 3 : reflectionWeight === -1 ? 1 : null

  try {
    await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        finalRole,
        missionId: missionId || '',
        p1Scores: scanScores,
        p2Scores: missionScores,
        p3Scores,
        confidence,
        shareHash,
      }),
    })
  } catch (e) {
    console.warn('Result submission failed', e)
  }
}

export default function App() {
  const [stage, setStage] = useState("intro")
  const [scanScores, setScanScores] = useState({})
  const [phase1Role, setPhase1Role] = useState(null)
  const [themeId, setThemeId] = useState(null)
  const [missionId, setMissionId] = useState(null)
  const [missionScoresTotal, setMissionScoresTotal] = useState({})
  const [reflectionW, setReflectionW] = useState(0)
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS)
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const [muted, setMuted] = useState(capiAudio.muted)

  // Open tweaks with Ctrl/Cmd+.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '.') {
        e.preventDefault()
        setTweaksOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const updateTweak = (k, v) => setTweaks(t => ({ ...t, [k]: v }))

  const toggleMute = () => {
    const m = capiAudio.toggle()
    setMuted(m)
  }

  const startScan = () => setStage("scan")
  const onScanDone = (scores) => {
    setScanScores(scores)
    setPhase1Role(topRole(scores))
    setStage("role-reveal")
  }
  const onRoleContinue = () => setStage("theme")
  const onThemePick = (id) => { setThemeId(id); setStage("mission-pick") }
  const onMissionPick = (id) => { setMissionId(id); setStage("mission-play") }
  const onMissionComplete = (scores, dest) => {
    const next = { ...missionScoresTotal }
    for (const k of Object.keys(scores)) next[k] = (next[k] || 0) + scores[k]
    setMissionScoresTotal(next)
    if (dest === "another") setStage("theme")
    else setStage("reflect")
  }
  const onReflectDone = (w) => { setReflectionW(w); setStage("certificate") }
  const onRestart = () => {
    setStage("intro")
    setScanScores({})
    setPhase1Role(null)
    setThemeId(null)
    setMissionId(null)
    setMissionScoresTotal({})
    setReflectionW(0)
  }

  const combinedMissionScores = useMemo(() => {
    if (!phase1Role) return missionScoresTotal
    const next = { ...missionScoresTotal }
    next[phase1Role] = (next[phase1Role] || 0) + reflectionW * 2
    return next
  }, [missionScoresTotal, phase1Role, reflectionW])

  let content
  if (stage === "intro") content = <IntroScene onStart={startScan} />
  else if (stage === "scan") content = <ScanningScene questionCount={tweaks.scanQuestions} onComplete={onScanDone} />
  else if (stage === "role-reveal") content = <RoleRevealScene role={phase1Role} onContinue={onRoleContinue} />
  else if (stage === "theme") content = <ThemeScene onPick={onThemePick} />
  else if (stage === "mission-pick") content = <MissionPickScene themeId={themeId} onPick={onMissionPick} onBack={() => setStage("theme")} />
  else if (stage === "mission-play") content = <MissionPlayScene missionId={missionId} questionCount={tweaks.missionQuestions} onComplete={onMissionComplete} />
  else if (stage === "reflect") content = <ReflectionScene role={phase1Role} onComplete={onReflectDone} />
  else if (stage === "certificate") content = (
    <CertificateScene
      scanScores={scanScores}
      missionScores={combinedMissionScores}
      reflectionWeight={reflectionW}
      missionId={missionId}
      onRestart={onRestart}
      onSubmit={submitResults}
    />
  )

  return (
    <>
      <Transition k={stage + missionId + themeId}>{content}</Transition>

      <button className="audio-toggle" title={muted ? "Bật âm thanh" : "Tắt âm thanh"} onClick={toggleMute}>
        {muted ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>
        )}
      </button>

      <div className={`glass tweaks ${tweaksOpen ? "open" : ""}`}>
        <h4>Tweaks · Capi-Gene</h4>
        <label>Số câu Phase 1</label>
        <div className="seg">
          {[5, 10, 15].map(n => (
            <button key={n} className={tweaks.scanQuestions === n ? "active" : ""} onClick={() => updateTweak("scanQuestions", n)}>{n}</button>
          ))}
        </div>
        <label>Số câu / Mission</label>
        <div className="seg">
          {[3, 4, 5].map(n => (
            <button key={n} className={tweaks.missionQuestions === n ? "active" : ""} onClick={() => updateTweak("missionQuestions", n)}>{n}</button>
          ))}
        </div>
        <label>Bỏ qua phase</label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          <button className="btn btn-ghost" style={{ padding: "8px 10px", fontSize: 12 }} onClick={() => { setPhase1Role("Explorer"); setScanScores({ Explorer: 8 }); setStage("theme") }}>→ Theme</button>
          <button className="btn btn-ghost" style={{ padding: "8px 10px", fontSize: 12 }} onClick={() => { setPhase1Role("Builder"); setScanScores({ Builder: 8 }); setMissionScoresTotal({ Builder: 4, Explorer: 2 }); setStage("reflect") }}>→ Reflect</button>
          <button className="btn btn-ghost" style={{ padding: "8px 10px", fontSize: 12 }} onClick={() => { setPhase1Role("Builder"); setScanScores({ Builder: 6, Explorer: 4, Operator: 3, Communicator: 2, Connector: 3 }); setMissionScoresTotal({ Builder: 3, Explorer: 1, Operator: 1 }); setStage("certificate") }}>→ Cert</button>
          <button className="btn btn-ghost" style={{ padding: "8px 10px", fontSize: 12 }} onClick={onRestart}>Restart</button>
        </div>
      </div>
    </>
  )
}
