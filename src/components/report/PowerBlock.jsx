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
  isHybrid = false,
  primaryRoleKey,
  secondaryRoleKey,
  primaryRoleMeta,
  secondaryRoleMeta,
  primaryRoleData: _primaryRoleData,
  primaryComboData,
  result,
}) {
  const { t } = useTranslation()
  const hybridActive = isHybrid || isSecondary
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

  const lang = isEn ? 'en' : 'vi'
  const primaryName = isEn
    ? primaryRoleMeta?.name ||
      primaryRoleMeta?.name_en ||
      t(`roles.${primaryRoleKey}.name`, { lng: 'en', defaultValue: primaryRoleKey })
    : primaryRoleMeta?.nameVn ||
      primaryRoleMeta?.name_vn ||
      t(`roles.${primaryRoleKey}.name`, { lng: 'vi', defaultValue: primaryRoleKey })

  const secondaryName = isEn
    ? secondaryRoleMeta?.name ||
      secondaryRoleMeta?.name_en ||
      t(`roles.${secondaryRoleKey}.name`, { lng: 'en', defaultValue: secondaryRoleKey })
    : secondaryRoleMeta?.nameVn ||
      secondaryRoleMeta?.name_vn ||
      t(`roles.${secondaryRoleKey}.name`, { lng: 'vi', defaultValue: secondaryRoleKey })

  const primaryTagline = t(`roles.${primaryRoleKey}.tagline`, { lng: lang, defaultValue: '' })
  const primarySubtitle = t(`roles.${primaryRoleKey}.subtitle`, {
    lng: lang,
    defaultValue: primaryTagline,
  })

  const comboName = hybridActive
    ? isEn
      ? primaryComboData?.profile_name_en || `${primaryName} + ${secondaryName}`
      : primaryComboData?.profile_name || `${primaryName} + ${secondaryName}`
    : primaryName

  const comboSubtitle = primaryComboData?.headline || primarySubtitle

  const bannerTitle = hybridActive ? (
    <span style={{ color: 'var(--color-primary)', fontWeight: 800 }}>{comboName}</span>
  ) : (
    <Trans
      i18nKey="report.primary_title_template"
      values={{ name: primaryName, tagline: primaryTagline }}
      components={{
        highlight: <span style={{ color: 'var(--color-primary)', fontWeight: 800 }} />,
      }}
    />
  )

  const bannerSubtitle = hybridActive ? comboSubtitle : primarySubtitle

  // Master Plan: Radar & Rankings strictly use Final Score
  const scores = result?.final || result?.phase2 || {}
  const rankedRoles = ROLE_KEYS.map((k) => ({
    key: k,
    score: Math.round(scores[k] || 0),
  })).sort((a, b) => b.score - a.score)

  // Full role catalogs from i18n
  const primaryCatalog = t(`roles.${primaryRoleKey}`, { returnObjects: true, lng: lang }) || {}
  const secondaryCatalog = t(`roles.${secondaryRoleKey}`, { returnObjects: true, lng: lang }) || {}

  const naturalBehaviors = Array.isArray(primaryCatalog.natural_behaviors)
    ? primaryCatalog.natural_behaviors
    : parseBullets(primaryCatalog.natural_behaviors)

  const selfRecognition = Array.isArray(primaryCatalog.self_recognition)
    ? primaryCatalog.self_recognition
    : parseBullets(primaryCatalog.parent_empathy)

  const strengths = Array.isArray(primaryCatalog.strengths)
    ? primaryCatalog.strengths
    : parseBullets(primaryCatalog.strengths)

  const watchouts = Array.isArray(primaryCatalog.watchouts)
    ? primaryCatalog.watchouts
    : parseBullets(primaryCatalog.watchouts)

  const secondaryStrengths = Array.isArray(secondaryCatalog.strengths)
    ? secondaryCatalog.strengths
    : parseBullets(secondaryCatalog.strengths)

  const coreDescription = hybridActive
    ? primaryComboData?.portrait || primaryCatalog.core_description || ''
    : primaryCatalog.core_description || ''

  const environmentText = hybridActive
    ? primaryComboData?.best_environment || primaryCatalog.best_environment || ''
    : primaryCatalog.best_environment || primaryCatalog.best_fit_for || ''

  return (
    <section className="report-section print-card power-block-section">
      {/* 1. Top Banner (Hero Card) */}
      <div
        className="power-block-banner"
        style={{
          backgroundColor: hybridActive ? 'var(--surface-lavender)' : primaryRoleConfig.bg,
          borderColor: hybridActive ? 'var(--border-purple)' : `${primaryRoleConfig.color}33`,
          boxShadow: hybridActive
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
                backgroundColor: hybridActive ? 'var(--surface-light)' : '#FFFFFF',
                color: hybridActive ? 'var(--color-primary)' : primaryRoleConfig.color,
                border: hybridActive
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
                icon={hybridActive ? 'mdi:transit-connection-variant' : primaryRoleConfig.icon}
                width={13}
                height={13}
              />
              <span>
                {hybridActive
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
            {hybridActive ? (
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
          <SummaryRadar scores={scores} size={isMobile ? 200 : 250} />
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: 48,
                      height: 5,
                      borderRadius: 9999,
                      backgroundColor: isTop1
                        ? 'rgba(255, 255, 255, 0.25)'
                        : 'var(--border-light)',
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

      {/* 3. Core Description Callout */}
      {coreDescription && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: isMobile ? '16px' : '20px 24px',
            fontSize: 'var(--text-sm)',
            lineHeight: 1.65,
            color: 'var(--ink-secondary)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
          }}
        >
          <strong style={{ color: 'var(--ink-dark)', display: 'block', marginBottom: '6px' }}>
            {hybridActive
              ? isEn
                ? 'Combination Portrait'
                : 'Chân dung kết hợp'
              : isEn
                ? 'Core Archetype Focus'
                : 'Đặc trưng cốt lõi trong Công nghệ & Robotics'}
          </strong>
          {coreDescription}
        </div>
      )}

      {/* 4. Full 4 Content Cards Grid (Strengths, Watchouts, Behaviors, Self-Recognition) */}
      <div
        className="power-block-cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: '20px',
        }}
      >
        {/* Card 1: Natural Behaviors */}
        <div
          className="power-block-subcard"
          style={{
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: isMobile ? '20px 16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon icon="mdi:compass-outline" color="var(--color-primary)" width={20} height={20} />
            <h4
              style={{
                margin: 0,
                fontSize: 'var(--text-md)',
                fontWeight: 800,
                color: 'var(--ink-dark)',
              }}
            >
              {t('report.card_behaviors_title', 'Hành vi tự nhiên khi tiếp cận vấn đề')}
            </h4>
          </div>

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
            {naturalBehaviors.map((b, idx) => (
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

        {/* Card 2: Self-Recognition */}
        <div
          className="power-block-subcard"
          style={{
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: isMobile ? '20px 16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon
              icon="mdi:account-search-outline"
              color="var(--color-primary)"
              width={20}
              height={20}
            />
            <h4
              style={{
                margin: 0,
                fontSize: 'var(--text-md)',
                fontWeight: 800,
                color: 'var(--ink-dark)',
              }}
            >
              {t('report.card_recognition_title', 'Dấu hiệu nhận biết ở bản thân')}
            </h4>
          </div>

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
            {(hybridActive && primaryComboData?.parent_empathy
              ? parseBullets(primaryComboData.parent_empathy)
              : selfRecognition
            ).map((b, idx) => (
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

        {/* Card 3: Key Standout Strengths (All 6) */}
        <div
          className="power-block-subcard"
          style={{
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: isMobile ? '20px 16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon icon="mdi:star-four-points" color="#D97706" width={20} height={20} />
            <h4
              style={{
                margin: 0,
                fontSize: 'var(--text-md)',
                fontWeight: 800,
                color: 'var(--ink-dark)',
              }}
            >
              {hybridActive
                ? isEn
                  ? `Strengths of ${primaryName}`
                  : `Điểm mạnh của ${primaryName}`
                : t('report.card_strengths_title', 'Điểm mạnh nổi bật của bạn')}
            </h4>
          </div>

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
            {strengths.map((b, idx) => (
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
                    color: '#D97706',
                    fontWeight: 700,
                  }}
                >
                  ✓
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* Card 4: Watchouts & Blindspots (All 5) */}
        <div
          className="power-block-subcard"
          style={{
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-light)',
            borderRadius: '16px',
            padding: isMobile ? '20px 16px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon icon="mdi:alert-circle-outline" color="#E11D48" width={20} height={20} />
            <h4
              style={{
                margin: 0,
                fontSize: 'var(--text-md)',
                fontWeight: 800,
                color: 'var(--ink-dark)',
              }}
            >
              {hybridActive
                ? isEn
                  ? `Complementary Strengths of ${secondaryName}`
                  : `Điểm mạnh bổ trợ của ${secondaryName}`
                : t('report.card_watchouts_title', 'Điểm cần lưu ý & Điểm mù')}
            </h4>
          </div>

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
            {(hybridActive ? secondaryStrengths : watchouts).map((b, idx) => (
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
                    color: hybridActive ? '#0284C7' : '#E11D48',
                    fontWeight: 700,
                  }}
                >
                  {hybridActive ? '✓' : '!'}
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 5. Suitable Environment Footer Row */}
      {environmentText && (
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
              {t('report.suitable_environment', 'Môi trường phù hợp: ')}{' '}
            </strong>
            <span style={{ fontWeight: 600 }}>{environmentText}</span>
          </div>
        </div>
      )}
    </section>
  )
}
