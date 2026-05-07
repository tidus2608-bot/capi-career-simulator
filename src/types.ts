// Capi Career Path Simulator — domain types
// Source of truth for the v2 spec data flow.

export type Role = 'explorer' | 'builder' | 'operator' | 'connector' | 'communicator'

export const ROLES: readonly Role[] = [
  'explorer',
  'builder',
  'operator',
  'connector',
  'communicator',
]

export type RoleScores = Record<Role, number>

export type ThemeId = 'ark-capi' | 'techno'

export type MissionId = 1 | 2 | 3 | 4 | 5 | 6

export type ProfileType = 'Hidden' | 'Aligned' | 'Emerging'

export type LikertValue = 1 | 2 | 3 | 4 | 5
export type OptionLabel = 'A' | 'B' | 'C'

export interface Phase1Answers {
  selfPerception: Record<string, LikertValue>
  confidence: Record<string, LikertValue>
}

export type Phase2Answers = Record<number, OptionLabel>

export type Phase3Answers = Partial<Record<Role, LikertValue>>

export interface ScoreBand {
  label_vn: string
  min: number
  max: number
}

export interface ScoringResult {
  phase1: RoleScores
  phase2: RoleScores
  phase3: RoleScores
  final: RoleScores
  realityGap: RoleScores
  learningGap: RoleScores
  primaryRole: Role
  secondaryRole: Role
  confidenceFactor: number
  profileType: ProfileType
  scoreBand: ScoreBand
}

export interface CertificateCopy {
  workingStyleHeadlineVn: string
  superpowerVn: {
    roleVn: string
    roleEn: string
    tagline: string
    score: number
    bandLabel: string
  }
  secondaryPowerVn: {
    roleVn: string
    roleEn: string
    tagline: string
    score: number
  }
  profileTypeLabelVn: string
  profileTypeNarrativeVn: string
  realityGrowthInsightVn: string
  primaryInterpretationVn: string
  secondaryInterpretationVn: string
  fullScoreBreakdown: Array<{
    role: Role
    roleVn: string
    selfPerception: number
    actualBehavior: number
    reflection: number
    final: number
  }>
  growthAreasVn: string[]
  primaryQualifications: string[]
  primaryCareers: string[]
  primaryMajors: string[]
  secondaryQualifications: string[]
  secondaryCareers: string[]
  secondaryMajors: string[]
}

export type SaveStatus = 'idle' | 'saving' | 'success' | 'error' | 'skipped'

/** Row shape inserted into Supabase `runs` table. */
export interface RunRow {
  id?: string
  user_id: string
  display_name: string | null
  theme: ThemeId | null
  mission_id: MissionId | null
  started_at: string | null
  completed_at: string
  phase1_answers: Phase1Answers
  phase2_answers: Phase2Answers
  phase3_answers: Phase3Answers
  scores: {
    phase1: RoleScores
    phase2: RoleScores
    phase3: RoleScores
    final: RoleScores
    reality_gap: RoleScores
    learning_gap: RoleScores
  }
  confidence_factor: number
  primary_role: Role
  secondary_role: Role
  profile_type: ProfileType
  created_at?: string
}
