/**
 * Capi Career Path Simulator — Scoring Engine v2 (JS port of scoring.ts)
 */
import missionsData from '../data/missions.json'

const ROLES = ['explorer', 'builder', 'operator', 'connector', 'communicator']
const FINAL_WEIGHTS = missionsData.weighted_final.weights
const HIDDEN_REALITY_GAP_MIN = 15
const EMERGING_LEARNING_GAP_MIN = 15

function emptyScores() {
  return { explorer: 0, builder: 0, operator: 0, connector: 0, communicator: 0 }
}

export function getMission(missionId) {
  const m = missionsData.missions.find(m => m.id === missionId)
  if (!m) throw new Error(`Mission ${missionId} not found`)
  return m
}

// ─── Phase 1 ────────────────────────────────────────────────────────────────

export function calculatePhase1(answers) {
  const phase1Questions = missionsData.phase1.questions
  const byRole = { explorer: [], builder: [], operator: [], connector: [], communicator: [] }

  for (const q of phase1Questions) {
    const ans = answers.selfPerception[q.id]
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

  const confAnswers = Object.values(answers.confidence)
  let confidenceFactor = 1.0
  if (confAnswers.length > 0) {
    const confAvg = confAnswers.reduce((a, b) => a + b, 0) / confAnswers.length
    if (confAvg < 3) confidenceFactor = 0.7
    else if (confAvg < 4) confidenceFactor = 0.9
    else confidenceFactor = 1.0
  }

  const scores = emptyScores()
  for (const role of ROLES) scores[role] = scaled[role] * confidenceFactor

  return { scores, confidenceFactor }
}

// ─── Phase 2 ────────────────────────────────────────────────────────────────

function scoreOption(option) {
  const s = emptyScores()
  s[option.primary_role] += 2
  if (option.secondary_role) s[option.secondary_role] += 1
  return s
}

export function calculateMaxScores(mission) {
  const max = emptyScores()
  for (const q of mission.questions) {
    const optionScores = q.options.map(scoreOption)
    for (const role of ROLES) {
      const best = Math.max(...optionScores.map(s => s[role]))
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
    const opt = q.options.find(o => o.label === ans)
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
  const { scores: p1, confidenceFactor } = calculatePhase1(phase1Answers)
  const p2 = calculatePhase2(missionId, phase2Answers)
  const p3 = calculatePhase3(phase3Answers)

  const final = emptyScores()
  for (const role of ROLES) {
    final[role] = FINAL_WEIGHTS.phase1 * p1[role] + FINAL_WEIGHTS.phase2 * p2[role] + FINAL_WEIGHTS.phase3 * p3[role]
  }

  const realityGap = emptyScores()
  const learningGap = emptyScores()
  for (const role of ROLES) {
    realityGap[role] = p2[role] - p1[role]
    learningGap[role] = p3[role] - p1[role]
  }

  const rankedByBehavior = [...ROLES].sort((a, b) => p2[b] - p2[a])
  const primaryRole = rankedByBehavior[0]

  const rankedByFinal = [...ROLES].sort((a, b) => final[b] - final[a])
  const secondaryRole = rankedByFinal[0] === primaryRole ? rankedByFinal[1] : rankedByFinal[0]

  const primaryRealityGap = realityGap[primaryRole]
  const primaryLearningGap = learningGap[primaryRole]

  let profileType
  if (primaryRealityGap >= HIDDEN_REALITY_GAP_MIN) profileType = 'Hidden'
  else if (primaryLearningGap >= EMERGING_LEARNING_GAP_MIN) profileType = 'Emerging'
  else profileType = 'Aligned'

  const primaryFinal = final[primaryRole]
  const scoreBand = missionsData.score_bands.find(b => primaryFinal >= b.min && primaryFinal <= b.max) ?? missionsData.score_bands[0]

  return { phase1: p1, phase2: p2, phase3: p3, final, realityGap, learningGap, primaryRole, secondaryRole, confidenceFactor, profileType, scoreBand }
}

// ─── Certificate copy ───────────────────────────────────────────────────────

function getRoleData(key) {
  return missionsData.roles.find(r => r.key === key)
}

function round1(n) { return Math.round(n * 10) / 10 }

function profileNarrative(type, role) {
  if (type === 'Hidden') return `Bạn không nghĩ mình là ${role.name_vn}, nhưng hành vi của bạn cho thấy điều ngược lại. Đây là một sức mạnh tiềm ẩn cần được khám phá thêm.`
  if (type === 'Emerging') return `Sau khi trải nghiệm, bạn đã nhận ra mình phù hợp với vai trò ${role.name_vn} hơn so với suy nghĩ ban đầu. Một góc nhìn mới đang hình thành.`
  return `Cả ba phase đều cho thấy bạn là một ${role.name_vn}. Bạn hiểu rõ bản thân và đang đi đúng hướng.`
}

function realityGrowthNarrative(result, primary) {
  const topSelfRole = [...ROLES].sort((a, b) => result.phase1[b] - result.phase1[a])[0]
  const topSelf = getRoleData(topSelfRole)
  if (topSelfRole === result.primaryRole) {
    return `Bạn nghĩ mình là một ${primary.name_vn}, và hành vi thực tế cũng xác nhận điều đó. Sự nhất quán giữa nhận thức và hành động là một thế mạnh quan trọng.`
  }
  return `Bạn nghĩ mình là một ${topSelf.name_vn}, nhưng thực chất bạn lại phù hợp hơn với vai trò ${primary.name_vn}. Đây không phải là sự mâu thuẫn — đây là cơ hội để hiểu rõ hơn về bản thân.`
}

export function buildCertificateCopy(result) {
  const primary = getRoleData(result.primaryRole)
  const secondary = getRoleData(result.secondaryRole)

  const lowestRoles = [...ROLES].sort((a, b) => result.final[a] - result.final[b]).slice(0, 2)

  const workingStyleHeadlineVn = `Bạn có xu hướng ${primary.phrase_bank_vn[0]} và ${primary.phrase_bank_vn[1]}, kết hợp với khả năng ${secondary.phrase_bank_vn[0]}.`

  const profileTypeLabelVn = `${result.profileType} ${primary.name_vn}`
  const profileTypeNarrativeVn = profileNarrative(result.profileType, primary)
  const realityGrowthInsightVn = realityGrowthNarrative(result, primary)

  const primaryInterpretationVn = `${primary.name_vn} (${primary.name_en}): ${primary.short_description_vn}`
  const secondaryInterpretationVn = `${secondary.name_vn} (${secondary.name_en}): ${secondary.short_description_vn}`

  const fullScoreBreakdown = ROLES.map(role => {
    const rd = getRoleData(role)
    return {
      role,
      roleVn: rd.name_vn,
      selfPerception: round1(result.phase1[role]),
      actualBehavior: round1(result.phase2[role]),
      reflection: round1(result.phase3[role]),
      final: round1(result.final[role]),
    }
  })

  const growthAreasVn = []
  for (const lowRoleKey of lowestRoles) {
    const lowRole = getRoleData(lowRoleKey)
    if (lowRole.qualifications_vn.length > 0) {
      growthAreasVn.push(`Phát triển kỹ năng ${lowRole.name_vn}: ${lowRole.qualifications_vn[0]}.`)
    }
  }

  return {
    workingStyleHeadlineVn,
    superpowerVn: {
      roleVn: primary.name_vn,
      roleEn: primary.name_en,
      tagline: primary.tagline_vn,
      score: round1(result.phase2[result.primaryRole]),
      bandLabel: result.scoreBand.label_vn,
    },
    secondaryPowerVn: {
      roleVn: secondary.name_vn,
      roleEn: secondary.name_en,
      tagline: secondary.tagline_vn,
      score: round1(result.final[result.secondaryRole]),
    },
    profileTypeLabelVn,
    profileTypeNarrativeVn,
    realityGrowthInsightVn,
    primaryInterpretationVn,
    secondaryInterpretationVn,
    fullScoreBreakdown,
    growthAreasVn,
    primaryQualifications: primary.qualifications_vn,
    primaryCareers: primary.careers_vn,
    primaryMajors: primary.majors_vn,
    secondaryQualifications: secondary.qualifications_vn,
    secondaryCareers: secondary.careers_vn,
    secondaryMajors: secondary.majors_vn,
  }
}

// Export raw data helpers
export { ROLES, missionsData }
