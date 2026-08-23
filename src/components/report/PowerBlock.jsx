import React from 'react'
import { Icon } from '@iconify/react'
import { useTranslation, Trans } from 'react-i18next'
import SummaryRadar from '../SummaryRadar.jsx'
import { CAPI_ROLES } from '../../data.js'

const BULLET_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#06B6D4']

const ROLE_RANKING_CONFIG = [
  { key: 'communicator', color: '#EAB308', textDark: true },
  { key: 'connector', color: '#F97316' },
  { key: 'explorer', color: '#22C55E' },
  { key: 'builder', color: '#EF4444' },
  { key: 'operator', color: '#3B82F6' },
]

const parseBullets = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val.filter(Boolean)
  if (typeof val === 'string') {
    return val
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2)
  }
  return []
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

  // Setup Role & Combo names and taglines via i18n
  const lang = isEn ? 'en' : 'vi'
  const primaryName = isEn
    ? primaryRoleMeta?.name ||
      primaryRoleMeta?.name_en ||
      t(`roles.${primaryRoleKey}.name`, { lng: 'en', defaultValue: primaryRoleKey })
    : primaryRoleMeta?.nameVn ||
      primaryRoleMeta?.name_vn ||
      t(`roles.${primaryRoleKey}.name`, { lng: 'vi', defaultValue: primaryRoleKey })

  const primaryTagline = t(`roles.${primaryRoleKey}.tagline`, { lng: lang, defaultValue: '' })
  const primarySubtitle = t(`roles.${primaryRoleKey}.subtitle`, {
    lng: lang,
    defaultValue: primaryRoleData?.tagline || '',
  })

  const comboName = isSecondary
    ? isEn
      ? primaryComboData?.profile_name_en ||
        `${primaryRoleMeta?.name || primaryRoleKey} + ${secondaryRoleMeta?.name || secondaryRoleKey}`
      : primaryComboData?.profile_name ||
        `${primaryRoleMeta?.nameVn || primaryRoleKey} + ${secondaryRoleMeta?.nameVn || secondaryRoleKey}`
    : primaryName

  const comboTagline = primaryComboData?.headline || primaryTagline
  const comboSubtitle = primaryComboData?.headline || primarySubtitle

  // Declarative banner title with <Trans />
  const bannerTitle = isSecondary ? (
    <Trans
      i18nKey="report.secondary_title_template"
      values={{ name: comboName, tagline: comboTagline }}
      components={{
        highlight: <span style={{ color: '#8B2FA9', fontWeight: 800 }} />,
      }}
    />
  ) : (
    <Trans
      i18nKey="report.primary_title_template"
      values={{ name: primaryName, tagline: primaryTagline }}
      components={{
        highlight: <span style={{ color: '#8B2FA9', fontWeight: 800 }} />,
      }}
    />
  )

  const bannerSubtitle = isSecondary ? comboSubtitle : primarySubtitle

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

  const roleCatalog = t(`roles.${primaryRoleKey}`, { returnObjects: true, lng: lang }) || {}
  const parentEmpathyArray = Array.isArray(roleCatalog.parent_empathy)
    ? roleCatalog.parent_empathy
    : []
  const naturalBehaviorsArray = Array.isArray(roleCatalog.natural_behaviors)
    ? roleCatalog.natural_behaviors
    : []

  if (isSecondary && primaryComboData?.profile_name) {
    empathyBullets = parseBullets(primaryComboData.parent_empathy || '')
    portraitBullets = parseBullets(primaryComboData.portrait || primaryComboData.strengths || '')
    environmentText = primaryComboData.best_environment || primaryComboData.natural_behaviors || ''
  } else {
    empathyBullets =
      parentEmpathyArray.length > 0
        ? parentEmpathyArray
        : parseBullets(primaryRoleData?.parent_empathy || '')
    portraitBullets =
      naturalBehaviorsArray.length > 0
        ? naturalBehaviorsArray
        : parseBullets(primaryRoleData?.natural_behaviors || primaryRoleData?.strengths || '')
    environmentText =
      roleCatalog.best_environment ||
      roleCatalog.best_fit_for ||
      primaryRoleData?.best_environment ||
      ''
  }

  const formattedEnvironmentText = environmentText || ''

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
          <SummaryRadar scores={result.phase2} size={isMobile ? 200 : 250} />
        </div>

        {/* Roles Ranked Bars Column */}
        <div className="power-block-ranks-col">
          {rankedRoles.map((role, idx) => {
            const roleDisplayName = t(`roles.${role.key}.name`, {
              lng: lang,
              defaultValue: isEn
                ? CAPI_ROLES[role.key]?.name || role.key
                : CAPI_ROLES[role.key]?.nameVn || role.key,
            })

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
                  {String(idx + 1).padStart(2, '0')}. {roleDisplayName}
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
          className="power-block-subcard"
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
            {t('report.parent_expressions_note', {
              role: isSecondary ? comboName : primaryName,
            })}
          </p>
        </div>

        {/* Child Shines Card */}
        <div
          className="power-block-subcard"
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
        className="power-block-environment"
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
