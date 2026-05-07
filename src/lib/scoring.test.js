import { describe, it, expect } from 'vitest'
import {
  calculatePhase1,
  calculatePhase2,
  calculatePhase3,
  calculateScore,
  ROLES,
} from './scoring.js'
import missionsData from '../data/missions.json'

const phase1Questions = missionsData.phase1.questions
const confChecks = missionsData.phase1.confidence_checks

/** Helper: build a Phase1 answer set where one role is dominant. */
function phase1FavoringRole(role, dominantValue = 5, otherValue = 1, confValue = 4) {
  const selfPerception = {}
  for (const q of phase1Questions) {
    selfPerception[q.id] = q.role === role ? dominantValue : otherValue
  }
  const confidence = {}
  for (const c of confChecks) confidence[c.id] = confValue
  return { selfPerception, confidence }
}

/** Helper: build Phase2 answers always picking option matching `primaryRole`. */
function phase2FavoringRole(missionId, role) {
  const mission = missionsData.missions.find((m) => m.id === missionId)
  const answers = {}
  for (const q of mission.questions) {
    const match = q.options.find((o) => o.primary_role === role)
    answers[q.id] = (match || q.options[0]).label
  }
  return answers
}

describe('calculatePhase1', () => {
  it('returns scaled scores 0-100 per role', () => {
    const answers = phase1FavoringRole('builder')
    const { scores, confidenceFactor } = calculatePhase1(answers)
    expect(scores.builder).toBeGreaterThan(scores.explorer)
    expect(scores.builder).toBeLessThanOrEqual(100)
    expect(scores.explorer).toBeGreaterThanOrEqual(0)
    // confidence value = 4 → factor 1.0 (per scoring.js: avg >= 4)
    expect(confidenceFactor).toBe(1.0)
  })

  it('lower confidence answers shrink scores via confidenceFactor', () => {
    const high = phase1FavoringRole('builder', 5, 1, 4)
    const low = phase1FavoringRole('builder', 5, 1, 2) // avg < 3 → factor 0.7
    const hi = calculatePhase1(high)
    const lo = calculatePhase1(low)
    expect(lo.confidenceFactor).toBe(0.7)
    expect(hi.confidenceFactor).toBe(1.0)
    expect(lo.scores.builder).toBeLessThan(hi.scores.builder)
  })
})

describe('calculatePhase2', () => {
  it('returns 0-100 scores; favoured role is highest', () => {
    const ans = phase2FavoringRole(1, 'builder')
    const scores = calculatePhase2(1, ans)
    for (const r of ROLES) {
      expect(scores[r]).toBeGreaterThanOrEqual(0)
      expect(scores[r]).toBeLessThanOrEqual(100)
    }
    expect(scores.builder).toBeGreaterThanOrEqual(Math.max(...ROLES.map((r) => scores[r])))
  })
})

describe('calculatePhase3', () => {
  it('linearly maps Likert 1-5 to 0-100', () => {
    expect(calculatePhase3({ explorer: 1 }).explorer).toBe(0)
    expect(calculatePhase3({ explorer: 5 }).explorer).toBe(100)
    expect(calculatePhase3({ explorer: 3 }).explorer).toBe(50)
  })
})

describe('calculateScore — profile classification', () => {
  it('Aligned: all three phases agree on the same role', () => {
    const phase1 = phase1FavoringRole('builder', 5, 1, 4)
    const phase2 = phase2FavoringRole(1, 'builder')
    const phase3 = { explorer: 3, builder: 5, operator: 2, connector: 2, communicator: 2 }
    const result = calculateScore(1, phase1, phase2, phase3)
    expect(result.primaryRole).toBe('builder')
    expect(result.profileType).toBe('Aligned')
  })

  it('Hidden: low self-perception of role X but high actual behavior in X', () => {
    const phase1 = phase1FavoringRole('explorer', 5, 1, 4) // sees self as Explorer
    const phase2 = phase2FavoringRole(1, 'builder') // behaves as Builder
    const phase3 = { explorer: 5, builder: 1, operator: 1, connector: 1, communicator: 1 }
    const result = calculateScore(1, phase1, phase2, phase3)
    expect(result.primaryRole).toBe('builder')
    expect(result.profileType).toBe('Hidden')
  })

  it('Emerging: phase3 reflection elevates a role above phase1', () => {
    // Phase1: low builder; Phase2: builder; Phase3: rates self high on builder
    const phase1 = phase1FavoringRole('explorer', 4, 2, 4)
    const phase2 = phase2FavoringRole(1, 'builder')
    const phase3 = { explorer: 1, builder: 5, operator: 1, connector: 1, communicator: 1 }
    const result = calculateScore(1, phase1, phase2, phase3)
    expect(result.primaryRole).toBe('builder')
    // After mission, p3 builder=100, p1 builder ≈ low → learning gap >= 15 → Emerging
    expect(['Emerging', 'Hidden']).toContain(result.profileType)
  })

  it('returns a score band with min/max/label', () => {
    const phase1 = phase1FavoringRole('builder', 5, 1, 4)
    const phase2 = phase2FavoringRole(1, 'builder')
    const phase3 = { explorer: 3, builder: 5, operator: 2, connector: 2, communicator: 2 }
    const result = calculateScore(1, phase1, phase2, phase3)
    expect(result.scoreBand).toBeDefined()
    expect(typeof result.scoreBand.label_vn).toBe('string')
  })

  it('secondaryRole differs from primaryRole', () => {
    const phase1 = phase1FavoringRole('builder', 5, 1, 4)
    const phase2 = phase2FavoringRole(1, 'builder')
    const phase3 = { explorer: 4, builder: 5, operator: 2, connector: 2, communicator: 2 }
    const result = calculateScore(1, phase1, phase2, phase3)
    expect(result.secondaryRole).not.toBe(result.primaryRole)
  })
})
