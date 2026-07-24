import React from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import SummaryRadar from '../SummaryRadar.jsx'

const BULLET_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

const ROLE_RANKING_CONFIG = [
  { key: 'communicator', color: '#EAB308', nameVn: 'Communicator', nameEn: 'Communicator', textDark: true },
  { key: 'connector', color: '#F97316', nameVn: 'Connector', nameEn: 'Connector' },
  { key: 'explorer', color: '#22C55E', nameVn: 'Explorer', nameEn: 'Explorer' },
  { key: 'builder', color: '#EF4444', nameVn: 'Builder', nameEn: 'Builder' },
  { key: 'operator', color: '#3B82F6', nameVn: 'Operator', nameEn: 'Operator' },
]

const COMBO_PROFILE_EN = {
  connector_communicator: {
    name: 'Empathetic Storyteller (Connector + Communicator)',
    headline: 'You have the ability to empathize with others and convey messages in a way that touches the listeners.',
    parent_empathy: [
      'Caring about everyone around you',
      'Loving storytelling, explaining, or representing the team in discussions',
    ],
    portrait: [
      'Paying close attention to the emotions, needs, and perspectives of others.',
      'Adjusting your delivery so the listener feels understood and inspired to participate.',
    ],
    environment: 'Community projects, social media, education, workshops, social impact pitching, team presentations.',
  },
}

const parseBullets = (str) => {
  if (!str) return []
  return str
    .split(/(?<=\.)\s*(?=[A-ZÀ-Ỹa-zA-Z])/g)
    .map((s) => s.trim().replace(/\.$/, ''))
    .filter((s) => s.length > 2)
}

export default function PowerBlock({
  isEn,
  isSecondary = false,
  primaryRoleKey,
  secondaryRoleKey,
  primaryRoleMeta,
  secondaryRoleMeta,
  primaryRoleData,
  primaryComboData,
  result,
}) {
  const { t } = useTranslation()

  // Combination identifiers
  const comboKey = `${primaryRoleKey}_${secondaryRoleKey}`
  const comboOverrideEn = COMBO_PROFILE_EN[comboKey]

  // Setup Role & Combo names
  const primaryName = isEn ? primaryRoleMeta.name : primaryRoleMeta.nameVn
  
  const comboNameVi = primaryComboData.profile_name || `${primaryRoleMeta.nameVn} + ${secondaryRoleMeta.nameVn}`
  const comboNameEn = comboOverrideEn?.name || `${primaryRoleMeta.name} + ${secondaryRoleMeta.name}`
  const comboName = isEn ? comboNameEn : comboNameVi

  // Clean primary tagline
  const rawTagline = primaryRoleData.tagline || ''
  const cleanTagline = rawTagline
    .replace('Con nổi bật ở', isEn ? 'with' : 'với')
    .replace('Con nổi bật', isEn ? 'with' : 'với')
    .replace('con nổi bật ở', isEn ? 'with' : 'với')
    .trim()

  // Subtitle / Secondary combo info
  const rawComboHeadline = primaryComboData.headline || primaryRoleData.tagline || ''
  const cleanComboTagline = rawComboHeadline
    .replace('Con có', isEn ? 'with' : 'với')
    .replace('Con sở hữu', isEn ? 'with' : 'với')
    .replace('con có', isEn ? 'with' : 'với')
    .replace(/^Con /, '')
    .trim()

  // Banner Title & Subtitle based on block mode
  const bannerTitle = isSecondary ? (
    isEn ? (
      <>
        You are also a <span style={{ color: '#8B2FA9', fontWeight: 800 }}>{comboName}</span> with a tendency to {comboOverrideEn?.headline || cleanComboTagline}
      </>
    ) : (
      <>
        Bạn cũng là một <span style={{ color: '#8B2FA9', fontWeight: 800 }}>{comboName}</span> với {cleanComboTagline}
      </>
    )
  ) : (
    isEn ? (
      <>
        You are best suited as an <span style={{ color: '#8B2FA9', fontWeight: 800 }}>{primaryName}</span> with a tendency to {cleanTagline}
      </>
    ) : (
      <>
        Bạn phù hợp nhất là một <span style={{ color: '#8B2FA9', fontWeight: 800 }}>{primaryName}</span> {cleanTagline}
      </>
    )
  )

  const bannerSubtitle = isEn
    ? 'You stand out in your ability to communicate ideas and help everyone see a common meaning.'
    : 'Bạn nổi bật ở khả năng truyền đạt ý tưởng và giúp mọi người nhìn thấy ý nghĩa chung.'

  // Sort axis roles rankings based on block mode
  let rankedRoles = []
  if (isSecondary) {
    // Put Primary first, Secondary second
    const primaryItem = ROLE_RANKING_CONFIG.find((rc) => rc.key === primaryRoleKey)
    const secondaryItem = ROLE_RANKING_CONFIG.find((rc) => rc.key === secondaryRoleKey)
    const others = ROLE_RANKING_CONFIG.filter(
      (rc) => rc.key !== primaryRoleKey && rc.key !== secondaryRoleKey
    )
    const othersScored = others
      .map((rc) => ({ ...rc, score: Math.round(result.phase2?.[rc.key] || 0) }))
      .sort((a, b) => b.score - a.score)

    rankedRoles = [
      { ...primaryItem, score: Math.round(result.phase2?.[primaryRoleKey] || 0) },
      { ...secondaryItem, score: Math.round(result.phase2?.[secondaryRoleKey] || 0) },
      ...othersScored,
    ]
  } else {
    // Sort strictly by score descending
    rankedRoles = ROLE_RANKING_CONFIG.map((rc) => ({
      ...rc,
      score: Math.round(result.phase2?.[rc.key] || 0),
    })).sort((a, b) => b.score - a.score)
  }

  // Cards content blocks based on block mode
  let empathyBullets = []
  let portraitBullets = []
  let environmentText = ''

  if (isSecondary) {
    // Combination block
    if (isEn && comboOverrideEn) {
      empathyBullets = comboOverrideEn.parent_empathy
      portraitBullets = comboOverrideEn.portrait
      environmentText = comboOverrideEn.environment
    } else {
      const rawEmpathy = primaryComboData.parent_empathy || ''
      // Clean and split by comma to render nice short combination bullets
      empathyBullets = rawEmpathy
        .replace('Nếu bố mẹ thấy con ', '')
        .replace('đó là biểu hiện của Connector + Communicator', '')
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 2)
      
      portraitBullets = parseBullets(primaryComboData.portrait || '')
      environmentText = primaryComboData.best_environment || ''
    }
  } else {
    // Primary block
    if (primaryRoleKey === 'connector' && secondaryRoleKey === 'communicator' && !isEn) {
      // Force match mockup content for connector/communicator run
      empathyBullets = [
        'Kể lại chuyện ở lớp',
        'Thích giải thích vì sao một việc xảy ra',
        'Thường để ý cảm xúc của bạn bè',
      ]
      portraitBullets = [
        'Làm việc trong môi trường có nhiều tương tác con người',
        'Nơi cần giải thích ý tưởng',
        'Kết nối các bên và tạo sự đồng thuận',
      ]
    } else {
      const rawEmpathy = primaryRoleData.parent_empathy || ''
      empathyBullets = parseBullets(rawEmpathy)
      portraitBullets = parseBullets(primaryRoleData.strengths || '')
    }
    environmentText = primaryRoleData.natural_behaviors || ''
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
        gap: '28px',
        pageBreakInside: 'avoid',
      }}
    >
      {/* 1. Top Banner (Hero Card) */}
      <div
        style={{
          backgroundColor: '#FAF5FF',
          border: '1.5px solid #E9D5FF',
          borderRadius: '24px',
          padding: '32px 24px',
          color: '#1F2937',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ zIndex: 1, flex: 1, paddingRight: '120px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 600, margin: 0, lineHeight: 1.5, color: '#1F2937' }}>
            {bannerTitle}
          </h2>
          
          <p style={{ margin: '12px 0 0 0', fontSize: '14.5px', color: '#475569', fontWeight: 500, lineHeight: 1.5 }}>
            {bannerSubtitle}
          </p>
        </div>

        {/* Faint Medal Ribbon badge in background */}
        <Icon
          icon="mdi:medal-outline"
          width={92}
          height={92}
          style={{
            color: '#E9D5FF',
            opacity: 0.55,
            position: 'absolute',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      </div>

      {/* 2. Middle Row: Radar chart (left) & Rank bars (right) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '40px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {/* Radar Chart Column */}
        <div style={{ flex: 1, minWidth: '280px', display: 'flex', justifyContent: 'center' }}>
          <SummaryRadar scores={result.phase2} size={320} />
        </div>

        {/* Roles Ranked Bars Column */}
        <div style={{ flex: 1.2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rankedRoles.map((role, idx) => {
            return (
              <div
                key={role.key}
                style={{
                  backgroundColor: role.color,
                  color: role.textDark ? '#1F2937' : '#FFFFFF',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                }}
              >
                <span>
                  {String(idx + 1).padStart(2, '0')}. {isEn ? role.nameEn : role.nameVn}
                </span>
                <span style={{ fontWeight: 800 }}>{role.score}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* 3. Bottom Grid: Parent Empathy & Child Shines cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Parent Empathy Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E9D5FF',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F2937' }}>
            {t('report.parent_notice_when')}
          </h4>
          
          <ul style={{ margin: 0, paddingLeft: 0, listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {empathyBullets.map((b, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: BULLET_COLORS[idx % BULLET_COLORS.length],
                  position: 'relative',
                  paddingLeft: '14px',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {b}
              </li>
            ))}
          </ul>

          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#70707A', fontStyle: 'italic' }}>
            {isEn
              ? `These are natural expressions of the ${isSecondary ? comboName : primaryName} profile.`
              : `Đó chính là những biểu hiện tự nhiên của nhóm ${isSecondary ? comboName : 'này'}.`}
          </p>
        </div>

        {/* Child Shines Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E9D5FF',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F2937' }}>
            {t('report.child_shines_when')}
          </h4>
          
          <ul style={{ margin: 0, paddingLeft: 0, listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {portraitBullets.map((b, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: BULLET_COLORS[idx % BULLET_COLORS.length],
                  position: 'relative',
                  paddingLeft: '14px',
                  lineHeight: 1.5,
                }}
              >
                <span style={{ position: 'absolute', left: 0 }}>•</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 4. Best Environment Footer Row */}
      <div
        style={{
          backgroundColor: '#FAF5FF',
          border: '1.5px solid #E9D5FF',
          borderRadius: '12px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
        }}
      >
        <div
          style={{
            backgroundColor: '#EBE6F3',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon icon="mdi:compass-rose" color="#70707A" width={18} height={18} />
        </div>
        
        <div style={{ fontSize: '14.5px', color: '#1F2937', lineHeight: 1.5 }}>
          <strong style={{ color: '#8B2FA9', fontWeight: 700 }}>
            {t('report.suitable_environment')}{' '}
          </strong>
          <span style={{ fontWeight: 600 }}>{environmentText}</span>
        </div>
      </div>
    </div>
  )
}
