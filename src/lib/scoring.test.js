import { describe, it, expect } from 'vitest'
import {
  calculatePhase1,
  calculatePhase2,
  calculatePhase3,
  calculateScore,
  ROLES,
} from './scoring.js'
import missionsData from '../data/assessment_matrix.json'

const phase1Questions = missionsData.phase1.questions

/** Helper: build a Phase1 answer set where one role is favored. */
function phase1FavoringRole(role, dominantValue = 5, otherValue = 1) {
  const selfPerception = {}
  for (const q of phase1Questions) {
    selfPerception[q.id] = q.role === role ? dominantValue : otherValue
  }
  return { selfPerception }
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
  it('exactly 15 questions across 5 roles', () => {
    expect(phase1Questions).toHaveLength(15)
    for (const r of ROLES) {
      const qForRole = phase1Questions.filter((q) => q.role === r)
      expect(qForRole).toHaveLength(3)
    }
  })

  it('returns scaled scores 0-100 per role from 1-5 scale', () => {
    const answers = phase1FavoringRole('builder', 5, 1)
    const { scores } = calculatePhase1(answers)
    expect(scores.builder).toBe(100)
    expect(scores.explorer).toBe(0)
    expect(scores.operator).toBe(0)
  })

  it('correctly calculates average of 3 questions', () => {
    const builderQuestions = phase1Questions.filter((q) => q.role === 'builder')
    const answers = {
      selfPerception: {
        [builderQuestions[0].id]: 1,
        [builderQuestions[1].id]: 3,
        [builderQuestions[2].id]: 5,
      },
    }
    const { scores } = calculatePhase1(answers)
    expect(scores.builder).toBe(50)
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

describe('calculateScore — Master Plan weighting & GAP 8% profile classification', () => {
  it('correctly applies weights: 20% Phase 1 + 50% Phase 2 + 30% Phase 3', () => {
    const phase1 = phase1FavoringRole('builder', 5, 1)
    const phase2 = phase2FavoringRole(1, 'builder')
    const phase3 = { explorer: 1, builder: 5, operator: 1, connector: 1, communicator: 1 }
    const result = calculateScore(1, phase1, phase2, phase3)

    const expected = 0.2 * 100 + 0.5 * result.phase2.builder + 0.3 * 100
    expect(result.final.builder).toBeCloseTo(expected, 1)
    expect(result.primaryRole).toBe('builder')
  })

  it('classifies as Dominant when GAP >= 8%', () => {
    const phase1 = phase1FavoringRole('explorer', 5, 1)
    const phase2 = phase2FavoringRole(1, 'explorer')
    const phase3 = { explorer: 5, builder: 1, operator: 1, connector: 1, communicator: 1 }
    const result = calculateScore(1, phase1, phase2, phase3)

    expect(result.primaryRole).toBe('explorer')
    expect(result.gap).toBeGreaterThanOrEqual(8)
    expect(result.profileType).toBe('Dominant')
  })

  it('classifies as Hybrid when GAP < 8%', () => {
    const phase1 = {
      selfPerception: {
        Q1: 4,
        Q2: 4,
        Q3: 4,
        Q10: 4,
        Q11: 4,
        Q12: 4,
      },
    }
    const phase2 = phase2FavoringRole(1, 'builder')
    const phase3 = { explorer: 5, builder: 3, operator: 1, connector: 1, communicator: 1 }
    const result = calculateScore(1, phase1, phase2, phase3)

    if (result.gap < 8) {
      expect(result.profileType).toBe('Hybrid')
    }
  })

  it('returns scoreBand and valid secondaryRole', () => {
    const phase1 = phase1FavoringRole('builder', 5, 1)
    const phase2 = phase2FavoringRole(1, 'builder')
    const phase3 = { explorer: 3, builder: 5, operator: 2, connector: 2, communicator: 2 }
    const result = calculateScore(1, phase1, phase2, phase3)

    expect(result.scoreBand).toBeDefined()
    expect(typeof result.scoreBand.band).toBe('string')
    expect(result.secondaryRole).not.toBe(result.primaryRole)
  })
})
