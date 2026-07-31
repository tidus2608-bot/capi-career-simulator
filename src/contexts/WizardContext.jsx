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
  const [pendingRunRow, setPendingRunRow] = useLocalStorageState('pendingRunRow', null)

  // Exact question indexes
  const [scanIndex, setScanIndex] = useLocalStorageState('scanIndex', 0)
  const [missionPlayIndices, setMissionPlayIndices] = useLocalStorageState('missionPlayIndices', {})
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

  // Auto-save pending runs once authenticated
  useEffect(() => {
    if (user && pendingRunRow && saveStatus !== 'saving') {
      saveRun(pendingRunRow)
    }
  }, [user, pendingRunRow])

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

    // Add missionId and theme to the result so they are self-contained
    result.missionId = selectedMission
    result.theme = selectedTheme

    const cert = buildCertificateCopy(result)
    setScoringResult(result)
    setCertCopy(cert)

    const row = {
      theme: selectedTheme,
      mission_id: selectedMission,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      phase1_answers: phase1Answers,
      phase2_answers: phase2Answers,
      phase3_answers: answers,
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
    }

    if (user) {
      saveRun(row)
    } else {
      setPendingRunRow(row)
      setSaveStatus('skipped')
    }

    // Clear all test progress states from localStorage
    setPhase1Answers({ selfPerception: {}, confidence: {} })
    setPhase1TopRole(null)
    setSelectedTheme(null)
    setSelectedMission(null)
    setPhase2Answers({})
    setPhase3Answers({})
    setScanIndex(0)
    setMissionPlayIndices({})
    setReflectIndex(0)
    setScanQuestions(null)
    setStartedAt(null)
    setSavedRunId(null)
  }

  const saveRun = async (row) => {
    if (!user) {
      setSaveStatus('skipped')
      return
    }
    setSaveStatus('saving')
    setSaveError(null)

    const ctrl = new AbortController()
    const timeoutId = setTimeout(() => ctrl.abort(), SAVE_TIMEOUT_MS)

    try {
      const finalRow = {
        ...row,
        user_id: user.id,
        display_name: user.user_metadata?.full_name ?? user.email ?? null,
      }
      const existingId = savedRunId

      const query = existingId
        ? supabase.from('runs').update(finalRow).eq('id', existingId).select('id').single()
        : supabase.from('runs').insert(finalRow).select('id').single()

      const { data, error } = await query.abortSignal(ctrl.signal)
      clearTimeout(timeoutId)

      if (error) throw error
      if (data?.id) setSavedRunId(data.id)
      setSaveStatus('success')
      setPendingRunRow(null)
    } catch (err) {
      clearTimeout(timeoutId)
      console.warn('Run save failed', err)
      setSaveError(err?.message || 'Lưu thất bại')
      setSaveStatus('error')
    }
  }

  const retrySave = () => {
    if (pendingRunRow) {
      saveRun(pendingRunRow)
    } else if (scoringResult) {
      const row = {
        theme: scoringResult.theme,
        mission_id: scoringResult.missionId,
        started_at: startedAt,
        completed_at: new Date().toISOString(),
        phase1_answers: phase1Answers,
        phase2_answers: phase2Answers,
        phase3_answers: phase3Answers,
        scores: {
          phase1: scoringResult.phase1,
          phase2: scoringResult.phase2,
          phase3: scoringResult.phase3,
          final: scoringResult.final,
          reality_gap: scoringResult.realityGap,
          learning_gap: scoringResult.learningGap,
        },
        confidence_factor: scoringResult.confidenceFactor,
        primary_role: scoringResult.primaryRole,
        secondary_role: scoringResult.secondaryRole,
        profile_type: scoringResult.profileType,
      }
      saveRun(row)
    }
  }

  const loadRun = (runData) => {
    const result = {
      phase1: runData.scores?.phase1 || {},
      phase2: runData.scores?.phase2 || {},
      phase3: runData.scores?.phase3 || {},
      final: runData.scores?.final || {},
      realityGap: runData.scores?.reality_gap || {},
      learningGap: runData.scores?.learning_gap || {},
      confidenceFactor: runData.confidence_factor,
      primaryRole: runData.primary_role,
      secondaryRole: runData.secondary_role,
      profileType: runData.profile_type,
      missionId: runData.mission_id,
      theme: runData.theme,
    }
    const cert = buildCertificateCopy(result)
    setScoringResult(result)
    setCertCopy(cert)
    setSavedRunId(runData.id)
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
    setPendingRunRow(null)
    setScanIndex(0)
    setMissionPlayIndices({})
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
        setPhase1TopRole,
        selectedTheme,
        setSelectedTheme,
        selectedMission,
        setSelectedMission,
        phase2Answers,
        setPhase2Answers,
        phase3Answers,
        setPhase3Answers,
        scoringResult,
        setScoringResult,
        certCopy,
        setCertCopy,
        startedAt,
        setStartedAt,
        scanIndex,
        setScanIndex,
        missionPlayIndices,
        setMissionPlayIndices,
        reflectIndex,
        setReflectIndex,
        scanQuestions,
        setScanQuestions,
        saveStatus,
        saveError,
        saveRun,
        setPendingRunRow,
        onScanDone,
        onReflectDone,
        retrySave,
        loadRun,
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
