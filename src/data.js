// Capi Career Path Simulator — UI data layer
// Role display config (colors/icons; canonical data lives in missions.json)

import missionsData from './data/missions.json'

export const CAPI_ROLES = {
  explorer:     { key: 'explorer',     name: 'Explorer',     nameVn: 'Nhà Khám Phá',        color: '#7c5cff', icon: 'compass' },
  builder:      { key: 'builder',      name: 'Builder',      nameVn: 'Kỹ Sư Chế Tạo',       color: '#00e5ff', icon: 'hammer'  },
  operator:     { key: 'operator',     name: 'Operator',     nameVn: 'Vận Hành Viên',        color: '#ffb020', icon: 'gear'    },
  connector:    { key: 'connector',    name: 'Connector',    nameVn: 'Người Kết Nối',        color: '#3ddc84', icon: 'network' },
  communicator: { key: 'communicator', name: 'Communicator', nameVn: 'Người Truyền Cảm Hứng', color: '#ff2d7a', icon: 'broadcast' },
}

export const ROLE_KEYS = ['explorer', 'builder', 'operator', 'connector', 'communicator']

export const CAPI_THEMES = {
  'ark-capi': {
    id: 'ark-capi',
    name: 'Chiến dịch Ark-Capi',
    subtitle: 'Mật mã Hành tinh mới',
    blurb: 'Năm 20xx. Trái Đất cạn tài nguyên. Bạn vận hành con tàu Ark-Capi khổng lồ để tìm "Hành tinh Vĩnh Cửu".',
    mood: 'Kịch tính • Trách nhiệm • Giải cứu thế giới',
    accent: '#00e5ff',
    missionIds: [1, 2, 6],
  },
  techno: {
    id: 'techno',
    name: 'Thực tập sinh TECHNO',
    subtitle: 'Một ngày trong lĩnh vực STEAM',
    blurb: 'Bạn là thực tập sinh tại tập đoàn TECHNO, trực tiếp xử lý các dự án Smart Home, Kho vận tự hành và mạng lưới Drone.',
    mood: 'Chuyên nghiệp • Thực tế • Áp lực thăng tiến',
    accent: '#ff2d7a',
    missionIds: [3, 4, 5],
  },
}

// Numeric ID → mission object from missions.json
export const CAPI_MISSIONS = Object.fromEntries(
  missionsData.missions.map(m => [m.id, m])
)

// Mission background art variant
export const MISSION_BG = { 1: 'river', 2: 'hospital', 6: 'rescue', 3: 'home', 4: 'warehouse', 5: 'drone' }

// Phase 1 Likert questions (15) + confidence checks (2)
export const PHASE1_QUESTIONS = missionsData.phase1.questions
export const CONFIDENCE_CHECKS = missionsData.phase1.confidence_checks

// Phase 1 Likert labels
export const LIKERT_AGREE = missionsData.phase1.likert_labels_vn

// Phase 3 reflection questions (1 per role)
export const PHASE3_QUESTIONS = missionsData.phase3.questions
export const LIKERT_FIT = missionsData.phase3.likert_labels_vn

// Score band helpers
export function getScoreBand(score) {
  return missionsData.score_bands.find(b => score >= b.min && score <= b.max) ?? missionsData.score_bands[0]
}

// Top role from a { role: number } object
export function topRole(scores) {
  if (!scores || !Object.keys(scores).length) return null
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

// Bump a role by amount (legacy helper kept for compatibility)
export function bumpRole(scores, role, amount = 1) {
  return { ...scores, [role]: (scores[role] || 0) + amount }
}
