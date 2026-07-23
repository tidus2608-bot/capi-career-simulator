import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase.js'
import { topRole, PHASE1_QUESTIONS } from '../data.js'
import { calculateScore, buildCertificateCopy } from '../lib/scoring.js'

const WizardContext = createContext(null)

const SAVE_TIMEOUT_MS = 10_000

function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = window.localStorage.getItem(key)
      if (saved !== null) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e)
    }
    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e)
    }
  }, [key, state])

  return [state, setState]
}

export function WizardProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // Persistent States
  const [scanIntroActive, setScanIntroActive] = useLocalStorageState('scanIntroActive', true)
  const [phase1Answers, setPhase1Answers] = useLocalStorageState('phase1Answers', {
    selfPerception: {},
    confidence: {},
  })
  const [phase1TopRole, setPhase1TopRole] = useLocalStorageState('phase1TopRole', null)
  const [selectedTheme, setSelectedTheme] = useLocalStorageState('selectedTheme', null)
  const [selectedMission, setSelectedMission] = useLocalStorageState('selectedMission', null)
  const [phase2Answers, setPhase2Answers] = useLocalStorageState('phase2Answers', {})
  const [phase3Answers, setPhase3Answers] = useLocalStorageState('phase3Answers', {})

  // Computed results & progress
  const [scoringResult, setScoringResult] = useLocalStorageState('scoringResult', null)
  const [certCopy, setCertCopy] = useLocalStorageState('certCopy', null)
  const [startedAt, setStartedAt] = useLocalStorageState('startedAt', null)
  const [savedRunId, setSavedRunId] = useLocalStorageState('savedRunId', null)

  // Exact question indexes
  const [scanIndex, setScanIndex] = useLocalStorageState('scanIndex', 0)
  const [missionPlayIndex, setMissionPlayIndex] = useLocalStorageState('missionPlayIndex', 0)
  const [reflectIndex, setReflectIndex] = useLocalStorageState('reflectIndex', 0)
  const [scanQuestions, setScanQuestions] = useLocalStorageState('scanQuestions', null)

  // Transient Save status
  const [saveStatus, setSaveStatus] = useState('idle') // 'idle' | 'saving' | 'success' | 'error' | 'skipped'
  const [saveError, setSaveError] = useState(null)

  // ── Auth ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const onScanDone = (answers) => {
    setPhase1Answers(answers)
    const spScores = {}
    for (const [qId, val] of Object.entries(answers.selfPerception)) {
      const q = PHASE1_QUESTIONS.find((q) => q.id === qId)
      if (q) spScores[q.role] = (spScores[q.role] || 0) + val
    }
    setPhase1TopRole(topRole(spScores))
  }

  const onReflectDone = (answers) => {
    setPhase3Answers(answers)
    const result = calculateScore(selectedMission, phase1Answers, phase2Answers, answers)
    const cert = buildCertificateCopy(result)
    setScoringResult(result)
    setCertCopy(cert)
    saveRun(result, answers)
  }

  const buildRunRow = (result, p3Answers) => ({
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

  const saveRun = async (result, p3Answers) => {
    if (!user) {
      setSaveStatus('skipped')
      return
    }
    setSaveStatus('saving')
    setSaveError(null)

    const ctrl = new AbortController()
    const timeoutId = setTimeout(() => ctrl.abort(), SAVE_TIMEOUT_MS)

    try {
      const row = buildRunRow(result, p3Answers)
      const existingId = savedRunId

      const query = existingId
        ? supabase.from('runs').update(row).eq('id', existingId).select('id').single()
        : supabase.from('runs').insert(row).select('id').single()

      const { data, error } = await query.abortSignal(ctrl.signal)
      clearTimeout(timeoutId)

      if (error) throw error
      if (data?.id) setSavedRunId(data.id)
      setSaveStatus('success')
    } catch (err) {
      clearTimeout(timeoutId)
      console.warn('Run save failed', err)
      setSaveError(err?.message || 'Lưu thất bại')
      setSaveStatus('error')
    }
  }

  const retrySave = () => {
    if (scoringResult) saveRun(scoringResult, phase3Answers)
  }

  const onRestart = () => {
    setScanIntroActive(true)
    setPhase1Answers({ selfPerception: {}, confidence: {} })
    setPhase1TopRole(null)
    setSelectedTheme(null)
    setSelectedMission(null)
    setPhase2Answers({})
    setPhase3Answers({})
    setScoringResult(null)
    setCertCopy(null)
    setStartedAt(null)
    setSavedRunId(null)
    setScanIndex(0)
    setMissionPlayIndex(0)
    setReflectIndex(0)
    setScanQuestions(null)
    setSaveStatus('idle')
    setSaveError(null)
  }

  return (
    <WizardContext.Provider
      value={{
        user,
        session,
        authLoading,
        scanIntroActive,
        setScanIntroActive,
        phase1Answers,
        setPhase1Answers,
        phase1TopRole,
        selectedTheme,
        setSelectedTheme,
        selectedMission,
        setSelectedMission,
        phase2Answers,
        setPhase2Answers,
        phase3Answers,
        setPhase3Answers,
        scoringResult,
        certCopy,
        startedAt,
        setStartedAt,
        scanIndex,
        setScanIndex,
        missionPlayIndex,
        setMissionPlayIndex,
        reflectIndex,
        setReflectIndex,
        scanQuestions,
        setScanQuestions,
        saveStatus,
        saveError,
        onScanDone,
        onReflectDone,
        retrySave,
        onRestart,
      }}
    >
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  const context = useContext(WizardContext)
  if (!context) {
    throw new Error('useWizard must be used within WizardProvider')
  }
  return context
}
