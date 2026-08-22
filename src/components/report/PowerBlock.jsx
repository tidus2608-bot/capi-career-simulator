import React from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import SummaryRadar from '../SummaryRadar.jsx'

const BULLET_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

const ROLE_RANKING_CONFIG = [
  {
    key: 'communicator',
    color: '#EAB308',
    nameVn: 'Communicator',
    nameEn: 'Communicator',
    textDark: true,
  },
  { key: 'connector', color: '#F97316', nameVn: 'Connector', nameEn: 'Connector' },
  { key: 'explorer', color: '#22C55E', nameVn: 'Explorer', nameEn: 'Explorer' },
  { key: 'builder', color: '#EF4444', nameVn: 'Builder', nameEn: 'Builder' },
  { key: 'operator', color: '#3B82F6', nameVn: 'Operator', nameEn: 'Operator' },
]

const COMBO_PROFILE_EN = {
  connector_communicator: {
    name: 'Empathetic Storyteller (Connector + Communicator)',
    headline:
      'You have the ability to empathize with others and convey messages in a way that touches the listeners.',
    parent_empathy: [
      'Caring about everyone around you',
      'Loving storytelling, explaining, or representing the team in discussions',
    ],
    portrait: [
      'Paying close attention to the emotions, needs, and perspectives of others.',
      'Adjusting your delivery so the listener feels understood and inspired to participate.',
    ],
    environment:
      'Community projects, social media, education, workshops, social impact pitching, team presentations.',
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
  const [isMobile, setIsMobile] = React.useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768,
  )

  React.useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Combination identifiers
  const comboKey = `${primaryRoleKey}_${secondaryRoleKey}`
  const comboOverrideEn = COMBO_PROFILE_EN[comboKey]

  // Setup Role & Combo names
  const primaryName = isEn
    ? primaryRoleMeta?.name || primaryRoleMeta?.name_en || primaryRoleKey
    : primaryRoleMeta?.nameVn || primaryRoleMeta?.name_vn || primaryRoleKey

  const comboNameVi =
    primaryComboData?.profile_name ||
    `${primaryRoleMeta?.nameVn || primaryRoleMeta?.name_vn || primaryRoleKey} + ${secondaryRoleMeta?.nameVn || secondaryRoleMeta?.name_vn || secondaryRoleKey}`
  const comboNameEn =
    comboOverrideEn?.name ||
    `${primaryRoleMeta?.name || primaryRoleMeta?.name_en || primaryRoleKey} + ${secondaryRoleMeta?.name || secondaryRoleMeta?.name_en || secondaryRoleKey}`
  const comboName = isEn ? comboNameEn : comboNameVi

  // Clean primary tagline
  const rawTagline = primaryRoleData?.tagline || ''
  const cleanTagline = rawTagline
    .replace('Con nổi bật ở', isEn ? 'with' : 'với')
    .replace('Con nổi bật', isEn ? 'with' : 'với')
    .replace('con nổi bật ở', isEn ? 'with' : 'với')
    .trim()

  // Subtitle / Secondary combo info
  const rawComboHeadline = primaryComboData?.headline || primaryRoleData?.tagline || ''
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
        You are also a <span style={{ color: '#8B2FA9', fontWeight: 800 }}>{comboName}</span> with a
        tendency to {comboOverrideEn?.headline || cleanComboTagline}
      </>
    ) : (
      <>
        Bạn cũng là một <span style={{ color: '#8B2FA9', fontWeight: 800 }}>{comboName}</span> với{' '}
        {cleanComboTagline}
      </>
    )
  ) : isEn ? (
    <>
      You are best suited as an{' '}
      <span style={{ color: '#8B2FA9', fontWeight: 800 }}>{primaryName}</span> with a tendency to{' '}
      {cleanTagline}
    </>
  ) : (
    <>
      Bạn phù hợp nhất là một{' '}
      <span style={{ color: '#8B2FA9', fontWeight: 800 }}>{primaryName}</span> {cleanTagline}
    </>
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
      (rc) => rc.key !== primaryRoleKey && rc.key !== secondaryRoleKey,
    )
    const othersScored = others
      .map((rc) => ({ ...rc, score: Math.round(result.phase2?.[rc.key] || 0) }))
      .sort((a, b) => b.score - a.score)

    rankedRoles = [
      primaryItem && { ...primaryItem, score: Math.round(result.phase2?.[primaryRoleKey] || 0) },
      secondaryItem && {
        ...secondaryItem,
        score: Math.round(result.phase2?.[secondaryRoleKey] || 0),
      },
      ...othersScored,
    ].filter(Boolean)
  } else {
    // Sort strictly by score descending
    rankedRoles = ROLE_RANKING_CONFIG.map((rc) => ({
      ...rc,
      score: Math.round(result.phase2?.[rc.key] || 0),
    })).sort((a, b) => b.score - a.score)
  }

  // 3. Bullets for Parent Empathy & Portrait
  let empathyBullets = []
  let portraitBullets = []
  let environmentText = ''

  if (isSecondary && comboOverrideEn) {
    empathyBullets = comboOverrideEn.parent_empathy || []
    portraitBullets = comboOverrideEn.portrait || []
    environmentText = comboOverrideEn.environment || ''
  } else if (isSecondary && primaryComboData?.profile_name) {
    empathyBullets = parseBullets(primaryComboData.parent_empathy || '')
    portraitBullets = parseBullets(primaryComboData.portrait || primaryComboData.strengths || '')
    environmentText = primaryComboData.best_environment || primaryComboData.natural_behaviors || ''
  } else {
    if (isEn && primaryRoleData.summaryEn) {
      empathyBullets = parseBullets(primaryRoleData.summaryEn)
      portraitBullets = parseBullets(primaryRoleData.strengthsEn || '')
    } else {
      const rawEmpathy = primaryRoleData.parent_empathy || ''
      empathyBullets = parseBullets(rawEmpathy)
      portraitBullets = parseBullets(primaryRoleData.strengths || primaryRoleData.portrait || '')
    }
    environmentText = primaryRoleData.natural_behaviors || primaryRoleData.best_environment || ''
  }

  // Format environment text with space after periods
  const formattedEnvironmentText = (environmentText || '').replace(/\.([A-Za-zÀ-Ỹ])/g, '. $1')

  return (
    <section className="report-section print-card power-block-section">
      {/* 1. Top Banner (Hero Card) */}
      <div className="power-block-banner">
        <div
          className="power-block-banner-text"
          style={{ zIndex: 1, flex: 1, paddingRight: isMobile ? '0' : '120px' }}
        >
          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 700,
              margin: 0,
              lineHeight: 1.4,
              color: '#1F2937',
            }}
          >
            {bannerTitle}
          </h2>

          <p
            style={{
              margin: '10px 0 0 0',
              fontSize: 'var(--text-base)',
              color: '#475569',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {bannerSubtitle}
          </p>
        </div>

        {/* Faint Medal Ribbon badge in background */}
        {!isMobile && (
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
        )}
      </div>

      {/* 2. Middle Row: Radar chart (left) & Rank bars (right) */}
      <div className="power-block-radar-row">
        {/* Radar Chart Column */}
        <div className="power-block-radar-col">
          <SummaryRadar scores={result.phase2} size={isMobile ? 200 : 300} />
        </div>

        {/* Roles Ranked Bars Column */}
        <div className="power-block-ranks-col">
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
                  fontSize: 'var(--text-sm)',
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
      <div
        className="power-block-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '20px',
        }}
      >
        {/* Parent Empathy Card */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: isMobile ? '20px 16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h4 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 800, color: '#1F2937' }}>
            {t('report.parent_notice_when')}
          </h4>

          <ul
            style={{
              margin: 0,
              paddingLeft: 0,
              listStyleType: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {empathyBullets.map((b, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: 'var(--text-sm)',
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

          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: 'var(--text-xs)',
              color: '#64748B',
              fontStyle: 'italic',
            }}
          >
            {isEn
              ? `These are natural expressions of the ${isSecondary ? comboName : primaryName} profile.`
              : `Đó chính là những biểu hiện tự nhiên của nhóm ${isSecondary ? comboName : 'này'}.`}
          </p>
        </div>

        {/* Child Shines Card */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: isMobile ? '20px 16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h4 style={{ margin: 0, fontSize: 'var(--text-md)', fontWeight: 800, color: '#1F2937' }}>
            {t('report.child_shines_when')}
          </h4>

          <ul
            style={{
              margin: 0,
              paddingLeft: 0,
              listStyleType: 'none',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {portraitBullets.map((b, idx) => (
              <li
                key={idx}
                style={{
                  fontSize: 'var(--text-sm)',
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
          border: '1px solid #E9D5FF',
          borderRadius: '14px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginTop: '4px',
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

        <div style={{ fontSize: 'var(--text-sm)', color: '#1F2937', lineHeight: 1.5 }}>
          <strong style={{ color: '#8B2FA9', fontWeight: 700 }}>
            {t('report.suitable_environment')}{' '}
          </strong>
          <span style={{ fontWeight: 600 }}>{formattedEnvironmentText}</span>
        </div>
      </div>
    </section>
  )
}
