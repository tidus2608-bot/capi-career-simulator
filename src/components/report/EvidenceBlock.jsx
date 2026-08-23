import React from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

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
    bgColor: '#EFF6FF', // Blue-50
    borderColor: '#DBEAFE', // Blue-100
    badgeBg: '#3B82F6', // Blue-500
    titleColor: '#1E3A8A', // Blue-900
    icon: 'mdi:lifebuoy',
  },
  ai_healthcare: {
    bgColor: '#FEF2F2', // Red-50
    borderColor: '#FEE2E2', // Red-100
    badgeBg: '#EF4444', // Red-500
    titleColor: '#991B1B', // Red-900
    icon: 'mdi:shield-cross',
  },
  smart_home: {
    bgColor: '#FFF7ED', // Orange-50
    borderColor: '#FFEDD5', // Orange-100
    badgeBg: '#F97316', // Orange-500
    titleColor: '#9A3412', // Orange-900
    icon: 'mdi:home-lightning-bolt-outline',
  },
  smart_waste: {
    bgColor: '#F0FDF4', // Green-50
    borderColor: '#DCFCE7', // Green-100
    badgeBg: '#22C55E', // Green-500
    titleColor: '#166534', // Green-900
    icon: 'mdi:recycle',
  },
  drone_delivery: {
    bgColor: '#F0FDFA', // Teal-50
    borderColor: '#CCFBF1', // Teal-100
    badgeBg: '#0D9488', // Teal-600
    titleColor: '#115E59', // Teal-900
    icon: 'mdi:quadcopter',
  },
  disaster_response: {
    bgColor: '#FFF1F2', // Rose-50
    borderColor: '#FFE4E6', // Rose-100
    badgeBg: '#E11D48', // Rose-600
    titleColor: '#9F1239', // Rose-900
    icon: 'mdi:alert-decagram-outline',
  },
}

export default function EvidenceBlock({
  result,
  selectedMission,
  primaryRoleKey,
  secondaryRoleKey,
  primaryRoleMeta,
  secondaryRoleMeta,
}) {
  const { t } = useTranslation()
  const activeMissionSlug =
    MISSION_SLUG_MAP[result?.missionId || selectedMission || 1] || 'river_rescue'

  // Card 1 mission slug: uses active mission
  const missionSlug1 = activeMissionSlug

  // Card 2 mission slug: if active is ai_healthcare, show smart_waste to match mockup, else fallback
  const missionSlug2 = activeMissionSlug === 'ai_healthcare' ? 'smart_waste' : activeMissionSlug

  const getEvidence = (roleKey, missionSlug) => {
    const evidenceList = t('report.data.evidence', {
      returnObjects: true,
    })
    const match = (Array.isArray(evidenceList) ? evidenceList : []).find(
      (e) => e.mission_id === missionSlug && e.role_id === roleKey,
    )
    if (match?.evidence_template) {
      return match.evidence_template
    }

    const missionName = t(`report.missions.${missionSlug}`, missionSlug)
    const roleName = t(`roles.${roleKey}.name`, roleKey)
    return t('report.evidence_fallback', {
      mission: missionName,
      role: roleName,
    })
  }

  const renderCard = (roleKey, roleMeta, missionSlug, labelKey) => {
    const theme = MISSION_STYLES[missionSlug] || MISSION_STYLES.river_rescue
    const evidenceRawText = getEvidence(roleKey, missionSlug)

    return (
      <div
        className="evidence-card"
        style={{
          border: `1.5px solid ${theme.borderColor}`,
          backgroundColor: theme.bgColor,
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'row',
          gap: '20px',
          alignItems: 'flex-start',
        }}
      >
        {/* Icon Badge Block */}
        <div
          style={{
            backgroundColor: theme.badgeBg,
            color: '#FFFFFF',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <Icon icon={theme.icon} width={26} height={26} />
        </div>

        {/* Content Column */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            flex: 1,
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            <h4
              style={{
                margin: 0,
                fontSize: 'var(--text-lg)',
                fontWeight: 800,
                color: theme.titleColor,
              }}
            >
              {t(`report.missions.${missionSlug}`)}
            </h4>
            <span
              style={{
                backgroundColor:
                  roleKey === 'explorer' || roleKey === primaryRoleKey ? '#FBCFE8' : '#CFFAFE',
                color: roleKey === 'explorer' || roleKey === primaryRoleKey ? '#BE185D' : '#0891B2',
                fontSize: 'var(--text-2xs)',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '2px 8px',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {t(labelKey)}
            </span>
          </div>

          <div
            style={{
              margin: 0,
              fontSize: 'var(--text-base)',
              color: '#1F2937',
              lineHeight: 1.6,
              whiteSpace: 'pre-line',
            }}
          >
            {evidenceRawText}
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="report-section print-card evidence-section">
      {/* Header Row with Purple Line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-xl)',
            fontWeight: 800,
            color: '#A855F7',
            whiteSpace: 'nowrap',
          }}
        >
          {t('report.evidence_simulation_title')}
        </h3>
        <div style={{ flex: 1, height: '2px', backgroundColor: '#E9D5FF' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Card 1: Primary Evidence */}
        {renderCard(primaryRoleKey, primaryRoleMeta, missionSlug1, 'report.evidence_primary_role')}

        {/* Card 2: Secondary Evidence */}
        {renderCard(
          secondaryRoleKey,
          secondaryRoleMeta,
          missionSlug2,
          'report.evidence_secondary_role',
        )}
      </div>
    </section>
  )
}
