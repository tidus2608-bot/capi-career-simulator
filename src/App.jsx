import React, { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { capiAudio } from './audio.js'
import { useWizard } from './contexts/WizardContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import HeaderControls from './components/HeaderControls.jsx'
import { Transition } from './components/scenes/index.js'
import { calculateScore, buildCertificateCopy } from './lib/scoring.js'
import { CAPI_MISSIONS } from './data.js'

const TWEAK_DEFAULTS = { fullPlay: true }

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const {
    authLoading,
    setPhase1Answers,
    setPhase1TopRole,
    phase1TopRole,
    setSelectedTheme,
    setSelectedMission,
    setPhase2Answers,
    phase2Answers,
    setPhase3Answers,
    setScoringResult,
    scoringResult,
    setCertCopy,
    onRestart,
    selectedMission,
    selectedTheme,
    startedAt,
  } = useWizard()

  const [tweaks, setTweaks] = useState(TWEAK_DEFAULTS)
  const [tweaksOpen, setTweaksOpen] = useState(false)
  const [muted, setMuted] = useState(capiAudio.muted)

  // Dev keyboard shortcut
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '.') {
        e.preventDefault()
        setTweaksOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Resume AudioContext
  useEffect(() => {
    const resume = () => capiAudio.resume()
    window.addEventListener('pointerdown', resume, { once: true })
    window.addEventListener('keydown', resume, { once: true })
    return () => {
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
    }
  }, [])

  const toggleMute = () => {
    const m = capiAudio.toggle()
    setMuted(m)
  }

  const path = location.pathname
  const hasResumedRef = useRef(false)

  // Initial Hydration Auto-Resume on Mount
  useEffect(() => {
    if (authLoading) return
    if (hasResumedRef.current) return
    hasResumedRef.current = true

    if (path !== '/') return

    if (scoringResult) {
      navigate('/certificate/loading', { replace: true })
    } else if (selectedMission) {
      const m = CAPI_MISSIONS[selectedMission]
      const totalQs = m ? m.questions.length : 0
      const answeredCount = Object.keys(phase2Answers || {}).length
      if (totalQs > 0 && answeredCount >= totalQs) {
        navigate('/reflect', { replace: true })
      } else {
        navigate('/mission-play', { replace: true })
      }
    } else if (selectedTheme) {
      navigate('/mission-pick', { replace: true })
    } else if (phase1TopRole) {
      navigate('/theme', { replace: true })
    } else if (startedAt) {
      navigate('/scan', { replace: true })
    }
  }, [
    authLoading,
    path,
    scoringResult,
    selectedMission,
    phase2Answers,
    selectedTheme,
    phase1TopRole,
    startedAt,
    navigate,
  ])

  // Route Guards
  useEffect(() => {
    if (path === '/' || path === '/capi-gene-info' || path === '/scan') return

    if (path === '/role-reveal' || path === '/theme' || path === '/mission-pick') {
      if (!phase1TopRole) navigate('/', { replace: true })
      return
    }

    if (path === '/mission-play' || path === '/reflect') {
      if (!selectedMission) navigate('/theme', { replace: true })
      return
    }

    if (path.startsWith('/certificate') || path === '/history') {
      if (!scoringResult) navigate('/', { replace: true })
      return
    }
  }, [path, phase1TopRole, selectedMission, scoringResult, navigate])

  const handleRestart = () => {
    onRestart()
    navigate('/')
  }

  return (
    <ErrorBoundary>
      <Transition k={path + selectedMission + selectedTheme}>
        <Outlet />
      </Transition>

      <HeaderControls muted={muted} toggleMute={toggleMute} />

      {/* Dev tweaks panel */}
      <div className={`glass tweaks ${tweaksOpen ? 'open' : ''}`}>
        <h4>Tweaks · Capi-Gene</h4>
        <div className="tweak-label">Chế độ chơi đầy đủ (20 câu / mission)</div>
        <div className="seg">
          <button
            className={tweaks.fullPlay ? 'active' : ''}
            onClick={() => setTweaks((t) => ({ ...t, fullPlay: true }))}
          >
            Full (20)
          </button>
          <button
            className={!tweaks.fullPlay ? 'active' : ''}
            onClick={() => setTweaks((t) => ({ ...t, fullPlay: false }))}
          >
            Quick (5)
          </button>
        </div>
        <div className="tweak-label">Bỏ qua phase</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <button
            className="btn btn-ghost"
            style={{ padding: '8px 10px', fontSize: 12 }}
            onClick={() => {
              setPhase1Answers({
                selfPerception: {
                  Q1: 4,
                  Q2: 4,
                  Q3: 4,
                  Q10: 3,
                  Q11: 3,
                  Q12: 3,
                  Q19: 2,
                  Q20: 2,
                  Q21: 2,
                  Q28: 3,
                  Q29: 3,
                  Q30: 3,
                  Q37: 2,
                  Q38: 2,
                  Q39: 2,
                },
                confidence: { C1: 4, C2: 4 },
              })
              setPhase1TopRole('builder')
              navigate('/theme')
            }}
          >
            → Theme
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: '8px 10px', fontSize: 12 }}
            onClick={() => {
              const ph1 = {
                selfPerception: {
                  Q1: 4,
                  Q2: 4,
                  Q3: 4,
                  Q10: 3,
                  Q11: 3,
                  Q12: 3,
                  Q19: 2,
                  Q20: 2,
                  Q21: 2,
                  Q28: 3,
                  Q29: 3,
                  Q30: 3,
                  Q37: 2,
                  Q38: 2,
                  Q39: 2,
                },
                confidence: { C1: 4, C2: 4 },
              }
              const ph2 = {
                1: 'B',
                2: 'B',
                3: 'B',
                4: 'A',
                5: 'A',
                6: 'B',
                7: 'C',
                8: 'A',
                9: 'B',
                10: 'C',
                11: 'A',
                12: 'B',
                13: 'C',
                14: 'A',
                15: 'B',
                16: 'C',
                17: 'A',
                18: 'B',
                19: 'C',
                20: 'A',
              }
              setPhase1Answers(ph1)
              setPhase2Answers(ph2)
              setSelectedMission(1)
              setSelectedTheme('ark-capi')
              setPhase1TopRole('builder')
              navigate('/reflect')
            }}
          >
            → Reflect
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: '8px 10px', fontSize: 12 }}
            onClick={() => {
              const ph1 = {
                selfPerception: {
                  Q1: 4,
                  Q2: 4,
                  Q3: 4,
                  Q10: 3,
                  Q11: 3,
                  Q12: 3,
                  Q19: 2,
                  Q20: 2,
                  Q21: 2,
                  Q28: 3,
                  Q29: 3,
                  Q30: 3,
                  Q37: 2,
                  Q38: 2,
                  Q39: 2,
                },
                confidence: { C1: 4, C2: 4 },
              }
              const ph2 = {
                1: 'B',
                2: 'B',
                3: 'B',
                4: 'A',
                5: 'A',
                6: 'B',
                7: 'C',
                8: 'A',
                9: 'B',
                10: 'C',
                11: 'A',
                12: 'B',
                13: 'C',
                14: 'A',
                15: 'B',
                16: 'C',
                17: 'A',
                18: 'B',
                19: 'C',
                20: 'A',
              }
              const ph3 = { explorer: 3, builder: 5, operator: 2, connector: 3, communicator: 2 }
              const r = calculateScore(1, ph1, ph2, ph3)
              const c = buildCertificateCopy(r)
              setPhase1Answers(ph1)
              setPhase2Answers(ph2)
              setPhase3Answers(ph3)
              setSelectedMission(1)
              setSelectedTheme('ark-capi')
              setScoringResult(r)
              setCertCopy(c)
              navigate('/certificate')
            }}
          >
            → Cert
          </button>
          <button
            className="btn btn-ghost"
            style={{ padding: '8px 10px', fontSize: 12 }}
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      </div>
    </ErrorBoundary>
  )
}
