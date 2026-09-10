import React from 'react'
import { Icon } from '@iconify/react'
import { useTranslation, Trans } from 'react-i18next'
import SummaryRadar from '../SummaryRadar.jsx'
import { CAPI_ROLES, getRoleConfig } from '../../data.js'

const ROLE_KEYS = Object.keys(CAPI_ROLES)

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
  const primaryRoleConfig = getRoleConfig(primaryRoleKey)
  const secondaryRoleConfig = getRoleConfig(secondaryRoleKey)

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
        highlight: <span style={{ color: 'var(--color-primary)', fontWeight: 800 }} />,
      }}
    />
  ) : (
    <Trans
      i18nKey="report.primary_title_template"
      values={{ name: primaryName, tagline: primaryTagline }}
      components={{
        highlight: <span style={{ color: 'var(--color-primary)', fontWeight: 800 }} />,
      }}
    />
  )

  const bannerSubtitle = isSecondary ? comboSubtitle : primarySubtitle

  // Sort axis roles rankings based on block mode
  let rankedRoles = []
  if (isSecondary) {
    // Put Primary first, Secondary second
    const others = ROLE_KEYS.filter((k) => k !== primaryRoleKey && k !== secondaryRoleKey)
    const othersScored = others
      .map((k) => ({ key: k, score: Math.round(result.phase2?.[k] || 0) }))
      .sort((a, b) => b.score - a.score)

    rankedRoles = [
      { key: primaryRoleKey, score: Math.round(result.phase2?.[primaryRoleKey] || 0) },
      { key: secondaryRoleKey, score: Math.round(result.phase2?.[secondaryRoleKey] || 0) },
      ...othersScored,
    ]
  } else {
    // Sort strictly by score descending
    rankedRoles = ROLE_KEYS.map((k) => ({
      key: k,
      score: Math.round(result.phase2?.[k] || 0),
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
      <div
        className="power-block-banner"
        style={{
          backgroundColor: isSecondary ? 'var(--surface-lavender)' : primaryRoleConfig.bg,
          borderColor: isSecondary ? 'var(--border-purple)' : `${primaryRoleConfig.color}33`,
          boxShadow: isSecondary
            ? '0 4px 16px -2px rgba(132, 52, 151, 0.05)'
            : `0 6px 20px -4px ${primaryRoleConfig.color}15`,
        }}
      >
        <div
          className="power-block-banner-text"
          style={{ zIndex: 1, flex: 1, paddingRight: isMobile ? '0' : '16px' }}
        >
          {/* Archetype pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <span
              style={{
                backgroundColor: isSecondary ? 'var(--surface-light)' : '#FFFFFF',
                color: isSecondary ? 'var(--color-primary)' : primaryRoleConfig.color,
                border: isSecondary
                  ? '1px solid var(--border-purple)'
                  : `1px solid ${primaryRoleConfig.color}40`,
                fontSize: '11px',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '3px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              }}
            >
              <Icon
                icon={isSecondary ? 'mdi:transit-connection-variant' : primaryRoleConfig.icon}
                width={13}
                height={13}
              />
              <span>
                {isSecondary
                  ? t('report.combination_archetype', 'Bộ đôi kết hợp')
                  : t('report.dominant_archetype', 'Hình mẫu chủ đạo')}
              </span>
            </span>
          </div>

          <h2
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.4,
              color: 'var(--ink-dark)',
              fontFamily: 'var(--font-display, sans-serif)',
            }}
          >
            {bannerTitle}
          </h2>

          <p
            style={{
              margin: '8px 0 0 0',
              fontSize: 'var(--text-sm)',
              color: 'var(--ink-secondary)',
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            {bannerSubtitle}
          </p>
        </div>

        {/* Archetype Emblem on Right */}
        {!isMobile && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              flexShrink: 0,
              marginLeft: 16,
            }}
          >
            {isSecondary ? (
              <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid ${primaryRoleConfig.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: primaryRoleConfig.color,
                    boxShadow: `0 4px 14px ${primaryRoleConfig.color}20`,
                    zIndex: 1,
                  }}
                >
                  <Icon icon={primaryRoleConfig.icon} width={24} height={24} />
                </div>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '14px',
                    backgroundColor: '#FFFFFF',
                    border: `1.5px solid ${secondaryRoleConfig.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: secondaryRoleConfig.color,
                    boxShadow: `0 4px 14px ${secondaryRoleConfig.color}20`,
                    marginLeft: -14,
                    zIndex: 2,
                  }}
                >
                  <Icon icon={secondaryRoleConfig.icon} width={24} height={24} />
                </div>
              </div>
            ) : (
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '16px',
                  backgroundColor: '#FFFFFF',
                  border: `1.5px solid ${primaryRoleConfig.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: primaryRoleConfig.color,
                  boxShadow: `0 6px 18px ${primaryRoleConfig.color}22`,
                }}
              >
                <Icon icon={primaryRoleConfig.icon} width={28} height={28} />
              </div>
            )}
          </div>
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
            const rc = getRoleConfig(role.key)
            const roleDisplayName = t(`roles.${role.key}.name`, {
              lng: lang,
              defaultValue: isEn
                ? CAPI_ROLES[role.key]?.name || role.key
                : CAPI_ROLES[role.key]?.nameVn || role.key,
            })

            const isTop1 = idx === 0
            const isTop2 = idx === 1

            return (
              <div
                key={role.key}
                className="power-rank-bar"
                style={{
                  backgroundColor: isTop1
                    ? 'var(--color-primary)'
                    : isTop2
                      ? 'var(--surface-lavender)'
                      : 'var(--surface-light)',
                  border: isTop1
                    ? '1.5px solid var(--color-primary)'
                    : isTop2
                      ? '1.5px solid var(--color-primary-border)'
                      : '1.5px solid var(--border-light)',
                  color: isTop1 ? '#FFFFFF' : 'var(--ink-dark)',
                  boxShadow: isTop1
                    ? '0 4px 14px var(--color-primary-shadow)'
                    : '0 2px 6px rgba(0, 0, 0, 0.02)',
                }}
              >
                {/* Left side: Rank index, Role icon with color, Role name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      color: isTop1 ? 'rgba(255, 255, 255, 0.8)' : 'var(--ink-muted)',
                      fontWeight: 800,
                      fontSize: '12px',
                      fontFamily: 'monospace',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}.
                  </span>

                  {/* Micro-accent archetype icon badge */}
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '8px',
                      backgroundColor: isTop1 ? 'rgba(255, 255, 255, 0.2)' : rc.bg,
                      border: isTop1
                        ? '1px solid rgba(255, 255, 255, 0.3)'
                        : `1px solid ${rc.color}35`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isTop1 ? '#FFFFFF' : rc.color,
                      flexShrink: 0,
                    }}
                  >
                    <Icon icon={rc.icon} width={14} height={14} />
                  </div>

                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: '13.5px',
                      color: isTop1
                        ? '#FFFFFF'
                        : isTop2
                          ? 'var(--color-primary)'
                          : 'var(--ink-dark)',
                    }}
                  >
                    {roleDisplayName}
                  </span>
                </div>

                {/* Right side: Micro progress bar & score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 48,
                      height: 5,
                      borderRadius: 9999,
                      backgroundColor: isTop1 ? 'rgba(255, 255, 255, 0.25)' : 'var(--border-light)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${Math.min(role.score, 100)}%`,
                        height: '100%',
                        backgroundColor: isTop1 ? '#FFFFFF' : rc.color,
                        borderRadius: 9999,
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: '13.5px',
                      fontFamily: 'monospace',
                      color: isTop1
                        ? '#FFFFFF'
                        : isTop2
                          ? 'var(--color-primary)'
                          : 'var(--ink-dark)',
                    }}
                  >
                    {role.score}%
                  </span>
                </div>
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
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: isMobile ? '20px 16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: 'var(--text-md)',
              fontWeight: 800,
              color: 'var(--ink-dark)',
            }}
          >
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
                  fontWeight: 500,
                  color: 'var(--ink-secondary)',
                  position: 'relative',
                  paddingLeft: '16px',
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                  }}
                >
                  •
                </span>
                {b}
              </li>
            ))}
          </ul>

          <p
            style={{
              margin: '4px 0 0 0',
              fontSize: 'var(--text-xs)',
              color: 'var(--ink-muted)',
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
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: isMobile ? '20px 16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: 'var(--text-md)',
              fontWeight: 800,
              color: 'var(--ink-dark)',
            }}
          >
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
                  fontWeight: 500,
                  color: 'var(--ink-secondary)',
                  position: 'relative',
                  paddingLeft: '16px',
                  lineHeight: 1.6,
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    left: 0,
                    color: 'var(--color-primary)',
                    fontWeight: 700,
                  }}
                >
                  •
                </span>
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
          backgroundColor: 'var(--surface-lavender)',
          border: '1px solid var(--border-purple)',
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
            backgroundColor: 'var(--color-lavender-0)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon icon="mdi:compass-rose" color="var(--color-primary)" width={18} height={18} />
        </div>

        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--ink-dark)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            {t('report.suitable_environment')}{' '}
          </strong>
          <span style={{ fontWeight: 600 }}>{formattedEnvironmentText}</span>
        </div>
      </div>
    </section>
  )
}
