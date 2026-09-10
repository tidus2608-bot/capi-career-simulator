/**
 * Capi Career Path Simulator — Scoring Engine v2 (JS port of scoring.ts)
 */
import missionsData from '../data/assessment_matrix.json'

const ROLES = ['explorer', 'builder', 'operator', 'connector', 'communicator']
const FINAL_WEIGHTS = missionsData.weighted_final.weights
const _HIDDEN_REALITY_GAP_MIN = 15
const _EMERGING_LEARNING_GAP_MIN = 15

function emptyScores() {
  return { explorer: 0, builder: 0, operator: 0, connector: 0, communicator: 0 }
}

function getMission(missionId) {
  const m = missionsData.missions.find((m) => m.id === missionId)
  if (!m) throw new Error(`Mission ${missionId} not found`)
  return m
}

// ─── Phase 1 ────────────────────────────────────────────────────────────────

export function calculatePhase1(answers) {
  const phase1Questions = missionsData.phase1.questions
  const byRole = { explorer: [], builder: [], operator: [], connector: [], communicator: [] }

  const selfPerception = answers?.selfPerception || answers || {}
  for (const q of phase1Questions) {
    const ans = selfPerception[q.id]
    if (ans !== undefined) byRole[q.role].push(ans)
  }

  const scaled = emptyScores()
  for (const role of ROLES) {
    const arr = byRole[role]
    if (arr.length > 0) {
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length
      scaled[role] = ((avg - 1) / 4) * 100
    }
  }

  return { scores: scaled }
}

// ─── Phase 2 ────────────────────────────────────────────────────────────────

function scoreOption(option) {
  const s = emptyScores()
  s[option.primary_role] += 2
  if (option.secondary_role) s[option.secondary_role] += 1
  return s
}

function calculateMaxScores(mission) {
  const max = emptyScores()
  for (const q of mission.questions) {
    const optionScores = q.options.map(scoreOption)
    for (const role of ROLES) {
      const best = Math.max(...optionScores.map((s) => s[role]))
      max[role] += best * q.weight
    }
  }
  return max
}

export function calculatePhase2(missionId, answers) {
  const mission = getMission(missionId)
  const raw = emptyScores()

  for (const q of mission.questions) {
    const ans = answers[q.id]
    if (!ans) continue
    const opt = q.options.find((o) => o.label === ans)
    if (!opt) continue
    const optScore = scoreOption(opt)
    for (const role of ROLES) raw[role] += optScore[role] * q.weight
  }

  const max = calculateMaxScores(mission)
  const normalized = emptyScores()
  for (const role of ROLES) {
    normalized[role] = max[role] === 0 ? 0 : (raw[role] / max[role]) * 100
  }
  return normalized
}

// ─── Phase 3 ────────────────────────────────────────────────────────────────

export function calculatePhase3(answers) {
  const scores = emptyScores()
  for (const role of ROLES) {
    const ans = answers[role]
    if (ans !== undefined) scores[role] = ((ans - 1) / 4) * 100
  }
  return scores
}

// ─── Final scoring ──────────────────────────────────────────────────────────

export function calculateScore(missionId, phase1Answers, phase2Answers, phase3Answers) {
  const { scores: p1 } = calculatePhase1(phase1Answers)
  const p2 = calculatePhase2(missionId, phase2Answers)
  const p3 = calculatePhase3(phase3Answers)

  const final = emptyScores()
  for (const role of ROLES) {
    final[role] =
      FINAL_WEIGHTS.phase1 * p1[role] +
      FINAL_WEIGHTS.phase2 * p2[role] +
      FINAL_WEIGHTS.phase3 * p3[role]
  }

  const realityGap = emptyScores()
  const learningGap = emptyScores()
  for (const role of ROLES) {
    realityGap[role] = p2[role] - p1[role]
    learningGap[role] = p3[role] - p1[role]
  }

  // Rank strictly by Final Score descending (Master Plan Step 3)
  const rankedByFinal = [...ROLES].sort((a, b) => final[b] - final[a])
  const topRole = rankedByFinal[0]
  const secondRole = rankedByFinal[1]
  const gap = final[topRole] - final[secondRole]

  // Master Plan: gap >= 8% -> Dominant, < 8% -> Hybrid
  const profileType = gap >= 8 ? 'Dominant' : 'Hybrid'

  // Ties detection (Master Plan Step 3)
  const topRoles = rankedByFinal.filter((r) => Math.abs(final[r] - final[topRole]) < 0.001)
  const secondRoles = rankedByFinal.filter(
    (r) => !topRoles.includes(r) && Math.abs(final[r] - final[secondRole]) < 0.001,
  )

  const primaryRole = topRole
  const secondaryRole = secondRole

  const primaryFinal = final[primaryRole]
  const scoreBand =
    missionsData.score_bands.find((b) => primaryFinal >= b.min && primaryFinal <= b.max) ??
    missionsData.score_bands[0]

  return {
    phase1: p1,
    phase2: p2,
    phase3: p3,
    final,
    realityGap,
    learningGap,
    primaryRole,
    secondaryRole,
    topRole,
    secondRole,
    topRoles,
    secondRoles,
    gap: round1(gap),
    profileType,
    scoreBand,
  }
}

// ─── Certificate copy ───────────────────────────────────────────────────────

function round1(n) {
  return Math.round(n * 10) / 10
}

export function buildCertificateCopy(result) {
  const lowestRoles = [...ROLES].sort((a, b) => result.final[a] - result.final[b]).slice(0, 2)

  const fullScoreBreakdown = ROLES.map((role) => ({
    role,
    selfPerception: round1(result.phase1[role]),
    actualBehavior: round1(result.phase2[role]),
    reflection: round1(result.phase3[role]),
    final: round1(result.final[role]),
  }))

  const primaryFinal = result.final[result.primaryRole]
  const scoreBand =
    result.scoreBand ||
    missionsData.score_bands.find((b) => primaryFinal >= b.min && primaryFinal <= b.max) ||
    missionsData.score_bands[0]

  return {
    primaryRole: result.primaryRole,
    secondaryRole: result.secondaryRole,
    lowestRoles,
    scoreBand,
    superpower: {
      role: result.primaryRole,
      score: round1(result.phase2[result.primaryRole]),
      band: scoreBand.band,
    },
    secondaryPower: {
      role: result.secondaryRole,
      score: round1(result.final[result.secondaryRole]),
    },
    profileType: result.profileType,
    fullScoreBreakdown,
  }
}

// Export raw data helpers
export { ROLES }
