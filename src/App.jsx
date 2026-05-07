import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { capiAudio } from './audio.js'
import { topRole } from './data.js'
import { calculateScore, buildCertificateCopy } from './lib/scoring.js'
import {
  IntroScene,
  ScanningScene,
  RoleRevealScene,
  ThemeScene,
  MissionPickScene,
  MissionPlayScene,
  ReflectionScene,
  CertificateScene,
  HistoryScene,
  Transition,
} from './components/Scenes.jsx'

// ─── Supabase ──────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://lnuzsduemmavoqenhqhz.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxudXpzZHVlbW1hdm9xZW5ocWh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1OTM3OTcsImV4cCI6MjA5MzE2OTc5N30.OM7jZQt7ce_g5_VuhYqwDZqJaojKXObTjvOJf8jUaQ0'
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

// ─── Tweaks panel ─────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = { fullPlay: true }

// ─── Main App ─────────────────────────────────────────────────────────────
export default function App() {
  const [stage, setStage] = useState('intro')
  const [user, setUser] = useState(null)

  // Phase answers
  const [phase1Answers, setPhase1Answers] = useState({ selfPerception: {}, confidence: {} })
  const [phase1TopRole, setPhase1TopRole] = useState(null)
  const [selectedTheme, setSelectedTheme] = useState(null)
  const [selectedMission, setSelectedMission] = useState(null)  // numeric ID
  const [phase2Answers, setPhase2Answers] = useState({})        // { questionId: 'A'|'B'|'C' }
  const [phase3Answers, setPhase3Answers] = useState({})        // { roleKey: 1..5 }

  // Computed results
  const [scoringResult, setScoringResult] = useState(null)
  const [certCopy, setCertCopy] = useState(null)
  const [startedAt, setStartedAt] = useState(null)

  // UI
  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS)
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const [muted, setMuted] = useState(capiAudio.muted)

  // ── Auth ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Dev keyboard shortcut ──
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '.') { e.preventDefault(); setTweaksOpen(o => !o) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toggleMute = () => { const m = capiAudio.toggle(); setMuted(m) }

  // ── Stage transitions ──
  const startScan = () => { setStartedAt(new Date().toISOString()); setStage('scan') }

  const onScanDone = (answers) => {
    setPhase1Answers(answers)
    // Derive preliminary top role for narrative (from self-perception scores)
    const spScores = {}
    for (const [qId, val] of Object.entries(answers.selfPerception)) {
      const q = (window.__p1qs || []).find(q => q.id === qId)
      if (q) spScores[q.role] = (spScores[q.role] || 0) + val
    }
    setPhase1TopRole(topRole(spScores))
    setStage('role-reveal')
  }

  const onRoleContinue = () => setStage('theme')
  const onThemePick = (themeId) => { setSelectedTheme(themeId); setStage('mission-pick') }
  const onMissionPick = (missionId) => { setSelectedMission(missionId); setStage('mission-play') }

  const onMissionComplete = (answers) => {
    setPhase2Answers(answers)
    setStage('reflect')
  }

  const onReflectDone = (answers) => {
    setPhase3Answers(answers)
    // Compute final score
    const result = calculateScore(selectedMission, phase1Answers, phase2Answers, answers)
    const cert = buildCertificateCopy(result)
    setScoringResult(result)
    setCertCopy(cert)
    // Save to Supabase (fire and forget)
    saveRun(result, answers)
    setStage('certificate')
  }

  const saveRun = async (result, p3Answers) => {
    if (!user) return
    try {
      await supabase.from('runs').insert({
        user_id: user.id,
        display_name: user.user_metadata?.full_name ?? user.email ?? null,
        theme: selectedTheme,
        mission_id: selectedMission,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        phase1_answers: phase1Answers,
        phase2_answers: phase2Answers,
        phase3_answers: p3Answers,
        scores: {
          phase1: result.phase1,
          phase2: result.phase2,
          phase3: result.phase3,
          final: result.final,
          reality_gap: result.realityGap,
          learning_gap: result.learningGap,
        },
        confidence_factor: result.confidenceFactor,
        primary_role: result.primaryRole,
        secondary_role: result.secondaryRole,
        profile_type: result.profileType,
      })
    } catch (e) {
      console.warn('Run save failed', e)
    }
  }

  const onRestart = () => {
    setStage('intro')
    setPhase1Answers({ selfPerception: {}, confidence: {} })
    setPhase1TopRole(null)
    setSelectedTheme(null)
    setSelectedMission(null)
    setPhase2Answers({})
    setPhase3Answers({})
    setScoringResult(null)
    setCertCopy(null)
    setStartedAt(null)
  }

  // ── Render ──
  let content
  if (stage === 'intro')         content = <IntroScene onStart={startScan} user={user} supabase={supabase} />
  else if (stage === 'scan')     content = <ScanningScene onComplete={onScanDone} />
  else if (stage === 'role-reveal') content = <RoleRevealScene role={phase1TopRole} onContinue={onRoleContinue} />
  else if (stage === 'theme')    content = <ThemeScene onPick={onThemePick} />
  else if (stage === 'mission-pick') content = <MissionPickScene themeId={selectedTheme} onPick={onMissionPick} onBack={() => setStage('theme')} />
  else if (stage === 'mission-play') content = <MissionPlayScene missionId={selectedMission} onComplete={onMissionComplete} />
  else if (stage === 'reflect')  content = <ReflectionScene onComplete={onReflectDone} />
  else if (stage === 'certificate') content = (
    <CertificateScene
      result={scoringResult}
      certCopy={certCopy}
      onRestart={onRestart}
      onHistory={user ? () => setStage('history') : null}
    />
  )
  else if (stage === 'history')  content = <HistoryScene user={user} supabase={supabase} onBack={() => setStage('certificate')} />

  return (
    <>
      <Transition k={stage + selectedMission + selectedTheme}>{content}</Transition>

      {/* Audio toggle */}
      <button className="audio-toggle" title={muted ? 'Bật âm thanh' : 'Tắt âm thanh'} onClick={toggleMute}>
        {muted
          ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
          : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a9 9 0 0 1 0 14"/></svg>
        }
      </button>

      {/* Dev tweaks panel */}
      <div className={`glass tweaks ${tweaksOpen ? 'open' : ''}`}>
        <h4>Tweaks · Capi-Gene</h4>
        <label>Chế độ chơi đầy đủ (20 câu / mission)</label>
        <div className="seg">
          <button className={tweaks.fullPlay ? 'active' : ''} onClick={() => setTweaks(t => ({ ...t, fullPlay: true }))}>Full (20)</button>
          <button className={!tweaks.fullPlay ? 'active' : ''} onClick={() => setTweaks(t => ({ ...t, fullPlay: false }))}>Quick (5)</button>
        </div>
        <label>Bỏ qua phase</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button className="btn btn-ghost" style={{ padding: '8px 10px', fontSize: 12 }}
            onClick={() => { setPhase1Answers({ selfPerception: { Q1:4,Q2:4,Q3:4,Q10:3,Q11:3,Q12:3,Q19:2,Q20:2,Q21:2,Q28:3,Q29:3,Q30:3,Q37:2,Q38:2,Q39:2 }, confidence: { C1:4, C2:4 } }); setPhase1TopRole('builder'); setStage('theme') }}>→ Theme</button>
          <button className="btn btn-ghost" style={{ padding: '8px 10px', fontSize: 12 }}
            onClick={() => { const ph1 = { selfPerception:{Q1:4,Q2:4,Q3:4,Q10:3,Q11:3,Q12:3,Q19:2,Q20:2,Q21:2,Q28:3,Q29:3,Q30:3,Q37:2,Q38:2,Q39:2}, confidence:{C1:4,C2:4} }; const ph2 = {1:'B',2:'B',3:'B',4:'A',5:'A',6:'B',7:'C',8:'A',9:'B',10:'C',11:'A',12:'B',13:'C',14:'A',15:'B',16:'C',17:'A',18:'B',19:'C',20:'A'}; setPhase1Answers(ph1); setPhase2Answers(ph2); setSelectedMission(1); setSelectedTheme('ark-capi'); setPhase1TopRole('builder'); setStage('reflect') }}>→ Reflect</button>
          <button className="btn btn-ghost" style={{ padding: '8px 10px', fontSize: 12 }}
            onClick={() => { const ph1={selfPerception:{Q1:4,Q2:4,Q3:4,Q10:3,Q11:3,Q12:3,Q19:2,Q20:2,Q21:2,Q28:3,Q29:3,Q30:3,Q37:2,Q38:2,Q39:2},confidence:{C1:4,C2:4}}; const ph2={1:'B',2:'B',3:'B',4:'A',5:'A',6:'B',7:'C',8:'A',9:'B',10:'C',11:'A',12:'B',13:'C',14:'A',15:'B',16:'C',17:'A',18:'B',19:'C',20:'A'}; const ph3={explorer:3,builder:5,operator:2,connector:3,communicator:2}; const r=calculateScore(1,ph1,ph2,ph3); const c=buildCertificateCopy(r); setPhase1Answers(ph1);setPhase2Answers(ph2);setPhase3Answers(ph3);setSelectedMission(1);setSelectedTheme('ark-capi');setScoringResult(r);setCertCopy(c);setStage('certificate') }}>→ Cert</button>
          <button className="btn btn-ghost" style={{ padding: '8px 10px', fontSize: 12 }} onClick={onRestart}>Restart</button>
        </div>
      </div>
    </>
  )
}
