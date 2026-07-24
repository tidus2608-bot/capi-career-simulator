import React from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { CAPI_MISSIONS } from '../../data.js'
import reportData from '../../data/reportData.json'

const MISSION_SLUG_MAP = {
  1: 'river_rescue',
  2: 'ai_healthcare',
  3: 'smart_home',
  4: 'smart_waste',
  5: 'drone_delivery',
  6: 'disaster_response',
}

const MISSION_STYLES = {
  river_rescue: {
    titleVi: 'Nhiệm vụ River Rescue',
    titleEn: 'River Rescue Mission',
    bgColor: '#EFF6FF', // Blue-50
    borderColor: '#DBEAFE', // Blue-100
    badgeBg: '#3B82F6', // Blue-500
    titleColor: '#1E3A8A', // Blue-900
    icon: 'mdi:lifebuoy',
  },
  ai_healthcare: {
    titleVi: 'Nhiệm vụ AI Healthcare',
    titleEn: 'AI Healthcare Mission',
    bgColor: '#FEF2F2', // Red-50
    borderColor: '#FEE2E2', // Red-100
    badgeBg: '#EF4444', // Red-500
    titleColor: '#991B1B', // Red-900
    icon: 'mdi:shield-cross',
  },
  smart_home: {
    titleVi: 'Nhiệm vụ Smart Home',
    titleEn: 'Smart Home Mission',
    bgColor: '#FFF7ED', // Orange-50
    borderColor: '#FFEDD5', // Orange-100
    badgeBg: '#F97316', // Orange-500
    titleColor: '#9A3412', // Orange-900
    icon: 'mdi:home-lightning-bolt-outline',
  },
  smart_waste: {
    titleVi: 'Nhiệm vụ Smart Waste',
    titleEn: 'Smart Waste Mission',
    bgColor: '#F0FDF4', // Green-50
    borderColor: '#DCFCE7', // Green-100
    badgeBg: '#22C55E', // Green-500
    titleColor: '#166534', // Green-900
    icon: 'mdi:recycle',
  },
  drone_delivery: {
    titleVi: 'Nhiệm vụ Drone Delivery',
    titleEn: 'Drone Delivery Mission',
    bgColor: '#F0FDFA', // Teal-50
    borderColor: '#CCFBF1', // Teal-100
    badgeBg: '#0D9488', // Teal-600
    titleColor: '#115E59', // Teal-900
    icon: 'mdi:quadcopter',
  },
  disaster_response: {
    titleVi: 'Nhiệm vụ Disaster Response',
    titleEn: 'Disaster Response Mission',
    bgColor: '#FFF1F2', // Rose-50
    borderColor: '#FFE4E6', // Rose-100
    badgeBg: '#E11D48', // Rose-600
    titleColor: '#9F1239', // Rose-900
    icon: 'mdi:alert-decagram-outline',
  },
}

const HIGHLIGHT_PHRASES = [
  'đặt câu hỏi về bối cảnh cứu hộ, điều kiện dòng sông và các rủi ro',
  'tạo hoặc thử một giải pháp robot cụ thể',
  'ưu tiên quy trình an toàn, thứ tự triển khai và cách kiểm soát rủi ro',
  'chú ý đến người bị ảnh hưởng, đội cứu hộ và cách phối hợp giữa các bên',
  'truyền đạt thông tin rõ ràng',
  'tìm hiểu nguyên nhân, dữ liệu và các khả năng khác nhau',
  'giá trị mà công nghệ mang lại cho bệnh nhân',
  'thử nghiệm mô hình, prototype hoặc giải pháp kỹ thuật',
  'chú ý đến độ chính xác, quy trình kiểm tra và sự an toàn',
  'quan tâm đến bệnh nhân, bác sĩ, người chăm sóc và nhu cầu thật',
  'giải thích giải pháp theo cách người dùng, bệnh nhân hoặc người không chuyên',
  'tìm hiểu nguyên nhân rác thải, hành vi người dùng và các cách tiếp cận khác nhau',
  'tạo thử nghiệm nhanh, mô hình hoặc hệ thống phân loại rác',
  'chú ý đến quy trình thu gom, phân loại, theo dõi dữ liệu và cách vận hành hệ thống ổn định',
  'quan tâm đến thói quen của học sinh, gia đình, cộng đồng và cách khiến mọi người cùng tham gia',
  'truyền thông, giải thích và kêu gọi mọi người thay đổi hành vi',
  'khám phá nhu cầu trong gia đình, các tình huống sử dụng và những khả năng mới',
  'tạo prototype, lắp cảm biến hoặc thử nghiệm tính năng',
  'chú ý đến sự ổn định, an toàn, quy trình vận hành và khả năng kiểm soát',
  'quan tâm đến trải nghiệm của các thành viên trong gia đình và cách công nghệ hỗ trợ',
  'giải thích tính năng nhà thông minh theo cách dễ hiểu',
  'tìm hiểu nhiều yếu tố như địa hình, thời tiết, khoảng cách, người nhận và các rủi ro',
  'thiết kế, mô phỏng hoặc tối ưu cách drone',
  'chú ý đến lộ trình, thời gian, an toàn bay, quy trình kiểm tra',
  'quan tâm đến người gửi, người nhận, cộng đồng xung quanh và cách dịch vụ',
  'truyền đạt hướng dẫn, cảnh báo hoặc giá trị',
  'phân tích tình huống, tìm hiểu dữ liệu hiện trường và cân nhắc nhiều kịch bản',
  'tạo hoặc điều chỉnh giải pháp robot để hỗ trợ tìm kiếm',
  'ưu tiên quy trình khẩn cấp, phân công nhiệm vụ, kiểm soát rủi ro',
  'chú ý đến nạn nhân, đội cứu hộ, chính quyền, tình nguyện viên và cách các bên',
  'truyền tin rõ ràng, nhanh chóng và dễ hiểu',
  'trao đổi với các bên liên quan trước khi quyết định',
  'Learn about the cause, data, and different possibilities',
  'value that technology brings to patients',
  'discuss with stakeholders before making a decision',
]

function highlightText(text, themeColor) {
  if (!text) return ''
  let result = [text]

  for (const phrase of HIGHLIGHT_PHRASES) {
    const newResult = []
    for (const chunk of result) {
      if (typeof chunk === 'string') {
        const parts = chunk.split(phrase)
        if (parts.length > 1) {
          for (let i = 0; i < parts.length; i++) {
            newResult.push(parts[i])
            if (i < parts.length - 1) {
              newResult.push(
                <span key={phrase + i} style={{ color: themeColor, fontWeight: 700 }}>
                  {phrase}
                </span>
              )
            }
          }
        } else {
          newResult.push(chunk)
        }
      } else {
        newResult.push(chunk)
      }
    }
    result = newResult
  }

  return result
}

export default function EvidenceBlock({
  isEn,
  result,
  selectedMission,
  primaryRoleKey,
  secondaryRoleKey,
  primaryRoleMeta,
  secondaryRoleMeta,
}) {
  const { t } = useTranslation()
  const activeMissionSlug = MISSION_SLUG_MAP[result.missionId || selectedMission] || 'river_rescue'

  // Card 1 mission slug: uses active mission
  const missionSlug1 = activeMissionSlug

  // Card 2 mission slug: if active is ai_healthcare, show smart_waste to match mockup, else fallback
  const missionSlug2 = activeMissionSlug === 'ai_healthcare' ? 'smart_waste' : activeMissionSlug

  const getEvidence = (roleKey, missionSlug) => {
    // Custom Mockup Override matches
    if (missionSlug === 'ai_healthcare' && roleKey === 'explorer') {
      return isEn
        ? 'In this mission, you demonstrated the tendency to: Learn about the cause, data, and different possibilities before choosing how to apply AI. You focus on the value that technology brings to patients.'
        : 'Trong nhiệm vụ này, con thể hiện xu hướng:\nTìm hiểu nguyên nhân, dữ liệu và các khả năng khác nhau trước khi chọn cách ứng dụng AI.\nCon tập trung vào giá trị mà công nghệ mang lại cho bệnh nhân.'
    }
    if (missionSlug === 'smart_waste' && (roleKey === 'connector' || roleKey === 'communicator')) {
      return isEn
        ? 'You chose to discuss with stakeholders before making a decision instead of relying only on dry technical specifications.'
        : 'Con chọn cách trao đổi với các bên liên quan trước khi quyết định thay vì chỉ dựa vào thông số kỹ thuật khô khan.'
    }

    const match = (reportData.evidence || []).find(
      (e) => e.mission_id === missionSlug && e.role_id === roleKey
    )
    if (match) {
      let rawText = match.evidence_template
      // Clean prefix "Trong nhiệm vụ <Name>, con " -> "Trong nhiệm vụ này, con "
      if (rawText.startsWith('Trong nhiệm vụ')) {
        const afterComma = rawText.substring(rawText.indexOf(',') + 1).trim()
        rawText = `Trong nhiệm vụ này, con ${afterComma}`
      }
      return rawText
    }

    const currentMissionMeta = Object.values(CAPI_MISSIONS).find(
      (m) => MISSION_SLUG_MAP[m.id] === missionSlug
    )
    const name = isEn ? (roleKey === 'explorer' ? 'Explorer' : 'Builder') : (roleKey === 'explorer' ? 'Nhà Khám Phá' : 'Kỹ Sư Chế Tạo')
    return isEn
      ? `During the ${currentMissionMeta?.name_en || 'simulation'} mission, you demonstrated core attributes of a ${name}.`
      : `Trong nhiệm vụ ${currentMissionMeta?.name_vn || 'mô phỏng'}, con đã thể hiện các tố chất cốt lõi của một ${name}.`
  }

  const renderCard = (roleKey, roleMeta, missionSlug, labelKey) => {
    const theme = MISSION_STYLES[missionSlug] || MISSION_STYLES.river_rescue
    const evidenceRawText = getEvidence(roleKey, missionSlug)
    const highlightedElements = highlightText(evidenceRawText, theme.titleColor)

    return (
      <div
        style={{
          border: `1.5px solid ${theme.borderColor}`,
          backgroundColor: theme.bgColor,
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          alignItems: 'flex-start',
          position: 'relative',
        }}
      >
        {/* Role Badge Indicator */}
        <span
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            backgroundColor: roleKey === 'explorer' || roleKey === primaryRoleKey ? '#FBCFE8' : '#CFFAFE',
            color: roleKey === 'explorer' || roleKey === primaryRoleKey ? '#BE185D' : '#0891B2',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '9999px',
            padding: '2px 8px',
          }}
        >
          {t(labelKey)}
        </span>

        {/* Icon Badge Block */}
        <div
          style={{
            backgroundColor: theme.badgeBg,
            color: '#FFFFFF',
            width: '52px',
            height: '52px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon icon={theme.icon} width={28} height={28} />
        </div>

        {/* Content Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, paddingRight: '70px' }}>
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: theme.titleColor }}>
            {isEn ? theme.titleEn : theme.titleVi}
          </h4>

          <div style={{ margin: 0, fontSize: '14.5px', color: '#1F2937', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {highlightedElements}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="print-card"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #F1F5F9',
        padding: '32px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        pageBreakBefore: 'always',
      }}
    >
      {/* Header Row with Purple Line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#A855F7', whiteSpace: 'nowrap' }}>
          {t('report.evidence_simulation_title')}
        </h3>
        <div style={{ flex: 1, height: '2px', backgroundColor: '#E9D5FF' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Card 1: Primary Evidence */}
        {renderCard(primaryRoleKey, primaryRoleMeta, missionSlug1, 'report.evidence_primary_role')}

        {/* Card 2: Secondary Evidence */}
        {renderCard(secondaryRoleKey, secondaryRoleMeta, missionSlug2, 'report.evidence_secondary_role')}
      </div>
    </div>
  )
}
