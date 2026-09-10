// Capi Career Path Simulator — UI data layer
// Role display config (colors/icons; canonical data lives in missions.json)

import missionsData from './data/assessment_matrix.json'

export const CAPI_ROLES = {
  explorer: {
    key: 'explorer',
    name: 'Explorer',
    nameVn: 'Nhà Khám Phá',
    color: '#7C3AED',
    bg: '#F5F3FF',
    icon: 'mdi:compass-outline',
  },
  builder: {
    key: 'builder',
    name: 'Builder',
    nameVn: 'Nhà Kiến Tạo',
    color: '#0284C7',
    bg: '#F0F9FF',
    icon: 'mdi:hammer-wrench',
  },
  operator: {
    key: 'operator',
    name: 'Operator',
    nameVn: 'Nhà Vận Hành',
    color: '#D97706',
    bg: '#FFFBEB',
    icon: 'mdi:cog-outline',
  },
  connector: {
    key: 'connector',
    name: 'Connector',
    nameVn: 'Người Kết Nối',
    color: '#16A34A',
    bg: '#F0FDF4',
    icon: 'mdi:account-group-outline',
  },
  communicator: {
    key: 'communicator',
    name: 'Communicator',
    nameVn: 'Người Truyền Đạt',
    color: '#E11D48',
    bg: '#FFF1F2',
    icon: 'mdi:bullhorn-outline',
  },
}

export function getRoleConfig(roleKey) {
  const key = (roleKey || '').toLowerCase()
  return (
    CAPI_ROLES[key] || {
      key: key || 'explorer',
      name: roleKey || 'Explorer',
      nameVn: roleKey || 'Nhà Khám Phá',
      color: '#843497',
      bg: '#F5F3FF',
      icon: 'mdi:compass-outline',
    }
  )
}

const CAPI_LAYERS = {
  problem_discovery: {
    key: 'problem_discovery',
    nameVn: 'Khám phá vấn đề',
    nameEn: 'Problem Discovery',
    color: '#1D4ED8',
    bg: '#EFF6FF',
    border: '#DBEAFE',
  },
  team_work: {
    key: 'team_work',
    nameVn: 'Làm việc nhóm',
    nameEn: 'Teamwork',
    color: '#15803D',
    bg: '#F0FDF4',
    border: '#DCFCE7',
  },
  teamwork: {
    key: 'team_work',
    nameVn: 'Làm việc nhóm',
    nameEn: 'Teamwork',
    color: '#15803D',
    bg: '#F0FDF4',
    border: '#DCFCE7',
  },
  challenge: {
    key: 'challenge',
    nameVn: 'Đối mặt thử thách',
    nameEn: 'Challenge',
    color: '#7E22CE',
    bg: '#FAF5FF',
    border: '#F3E8FF',
  },
  impact: {
    key: 'impact',
    nameVn: 'Tạo tác động',
    nameEn: 'Impact',
    color: '#BE185D',
    bg: '#FDF2F8',
    border: '#FCE7F3',
  },
  unexpected: {
    key: 'unexpected',
    nameVn: 'Thử thách bất ngờ',
    nameEn: 'Unexpected Challenge',
    color: '#C2410C',
    bg: '#FFF7ED',
    border: '#FFEDD5',
  },
  ideation: {
    key: 'ideation',
    nameVn: 'Đưa ra ý tưởng',
    nameEn: 'Ideation',
    color: '#7E22CE',
    bg: '#FAF5FF',
    border: '#F3E8FF',
  },
  execution: {
    key: 'execution',
    nameVn: 'Thực thi nhiệm vụ',
    nameEn: 'Execution',
    color: '#15803D',
    bg: '#F0FDF4',
    border: '#DCFCE7',
  },
  reflection: {
    key: 'reflection',
    nameVn: 'Phản chiếu & Đúc kết',
    nameEn: 'Reflection',
    color: '#BE185D',
    bg: '#FDF2F8',
    border: '#FCE7F3',
  },
}

export function getLayerConfig(layerKey) {
  const rawKey = (layerKey || '').toLowerCase()
  const key = rawKey.replace(/[- ]/g, '_')
  return (
    CAPI_LAYERS[key] ||
    CAPI_LAYERS[rawKey] || {
      key: rawKey,
      nameVn: layerKey,
      nameEn: layerKey,
      color: '#475569',
      bg: '#F1F5F9',
      border: '#E2E8F0',
    }
  )
}

export const ROLE_KEYS = ['explorer', 'builder', 'operator', 'connector', 'communicator']

export const CAPI_THEMES = {
  'ark-capi': {
    id: 'ark-capi',
    name: 'Chiến dịch Ark-Capi',
    displayName: 'CHIẾN DỊCH ARK-CAPI: MẬT MÃ HÀNH TINH MỚI',
    subtitle: 'Mật mã Hành tinh mới',
    blurb:
      'Năm 20xx. Trái Đất cạn tài nguyên. Bạn vận hành con tàu Ark-Capi khổng lồ để tìm "Hành tinh Vĩnh Cửu".',
    mood: 'Kịch tính • Trách nhiệm • Giải cứu thế giới',
    moodTags: [
      { label: 'Phiêu lưu', color: '#D7EFD4', textColor: '#2a6a1a' },
      { label: 'Giải đố', color: '#D7EFD4', textColor: '#2a6a1a' },
    ],
    accent: '#00e5ff',
    missionIds: [1, 2, 6],
  },
  techno: {
    id: 'techno',
    name: 'Thực tập sinh S4V',
    displayName: 'THỰC TẬP SINH S4V',
    subtitle: 'Một ngày trong lĩnh vực STEAM',
    blurb:
      'Bạn là thực tập sinh tại tập đoàn S4V, trực tiếp xử lý các dự án Smart Home, Kho vận tự hành và mạng lưới Drone.',
    mood: 'Chuyên nghiệp • Thực tế • Áp lực thăng tiến',
    moodTags: [
      { label: 'Chuyên nghiệp', color: '#CED5F5', textColor: '#1a2a8a' },
      { label: 'Thăng tiến', color: '#FCEFD2', textColor: '#8a5a00' },
    ],
    accent: '#ff2d7a',
    missionIds: [3, 4, 5],
  },
}

export const MISSION_ICONS = {
  1: { bg: '#D7EFD4', color: '#60C255', emoji: '♻️' },
  2: { bg: '#F7D2D2', color: '#E14D4D', emoji: '🏥' },
  3: { bg: '#D7EFD4', color: '#60C255', emoji: '🏠' },
  4: { bg: '#FCEFD2', color: '#F3C04B', emoji: '📦' },
  5: { bg: '#CED5F5', color: '#0C33FA', emoji: '🚁' },
  6: { bg: '#CED5F5', color: '#0C33FA', emoji: '🤖' },
}

// Numeric ID → mission object from missions.json
export const CAPI_MISSIONS = Object.fromEntries(missionsData.missions.map((m) => [m.id, m]))

// Phase 1 Likert questions (15)
export const PHASE1_QUESTIONS = missionsData.phase1.questions

// Phase 3 reflection questions (1 per role)
export const PHASE3_QUESTIONS = missionsData.phase3.questions

// Top role from a { role: number } object
export function topRole(scores) {
  if (!scores || !Object.keys(scores).length) return null
  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}
