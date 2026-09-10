import React from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { getRoleConfig } from '../../data.js'

const MISSION_SLUG_MAP = {
  1: 'river_rescue',
  2: 'ai_healthcare',
  3: 'smart_home',
  4: 'smart_waste',
  5: 'drone_delivery',
  6: 'disaster_response',
}

const MISSION_ICONS = {
  river_rescue: 'mdi:lifebuoy',
  ai_healthcare: 'mdi:shield-cross',
  smart_home: 'mdi:home-lightning-bolt-outline',
  smart_waste: 'mdi:recycle',
  drone_delivery: 'mdi:quadcopter',
  disaster_response: 'mdi:alert-decagram-outline',
}

export default function EvidenceBlock({
  isEn,
  result,
  selectedMission,
  primaryRoleKey,
  secondaryRoleKey,
}) {
  const { t } = useTranslation()
  const activeMissionSlug =
    MISSION_SLUG_MAP[result?.missionId || selectedMission || 1] || 'river_rescue'

  const missionIcon = MISSION_ICONS[activeMissionSlug] || 'mdi:compass-outline'

  const primaryRoleConfig = getRoleConfig(primaryRoleKey)
  const secondaryRoleConfig = getRoleConfig(secondaryRoleKey)

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

  const primaryEvidenceText = getEvidence(primaryRoleKey, activeMissionSlug)
  const secondaryEvidenceText = getEvidence(secondaryRoleKey, activeMissionSlug)

  return (
    <section className="report-section print-card evidence-section">
      {/* Header Block — Clean Editorial Discipline, Zero Filler Lines */}
      <div style={{ marginBottom: '16px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary)',
              boxShadow: '0 0 6px var(--color-primary)',
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono, monospace)',
              fontWeight: 700,
              color: 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {t('report.evidence_eyebrow')}
          </span>
        </div>
        <h3
          style={{
            margin: '0 0 6px 0',
            fontSize: 'var(--text-xl)',
            fontWeight: 800,
            color: 'var(--ink-dark)',
          }}
        >
          {t('report.evidence_simulation_title')}
        </h3>
        <p
          style={{
            margin: 0,
            fontSize: 'var(--text-sm)',
            color: 'var(--ink-secondary)',
            lineHeight: 1.5,
            maxWidth: '680px',
          }}
        >
          {t('report.evidence_subtitle')}
        </p>
      </div>

      {/* Unified Simulation Dossier — Single Containment Layer, Zero Nested Cards */}
      <div className="evidence-dossier evidence-card">
        {/* Dossier Header Bar */}
        <div className="evidence-dossier-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div className="evidence-mission-icon-box">
              <Icon icon={missionIcon} width={22} height={22} />
            </div>
            <div>
              <div className="evidence-context-eyebrow">{t('report.evidence_mission_context')}</div>
              <h4 className="evidence-mission-title">
                {t(`report.missions.${activeMissionSlug}`, activeMissionSlug)}
              </h4>
            </div>
          </div>

          <span className="evidence-verified-pill">
            <span className="evidence-verified-dot" />
            {t('report.evidence_verified_badge')}
          </span>
        </div>

        {/* Dual-Signal Flat Columns — Editorial Ledger (NO nested cards, NO inner borders, NO inner box shadows) */}
        <div className="evidence-signals-row">
          {/* Signal 01: Primary Core Role Column */}
          <div className="evidence-signal-col evidence-signal-col--primary">
            <div className="evidence-signal-meta">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: primaryRoleConfig.bg,
                  border: `1px solid ${primaryRoleConfig.color}30`,
                  color: primaryRoleConfig.color,
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <Icon icon={primaryRoleConfig.icon} width={15} height={15} />
                <span>{isEn ? primaryRoleConfig.name : primaryRoleConfig.nameVn}</span>
              </span>

              <span className="evidence-signal-badge">{t('report.evidence_primary_role')}</span>
            </div>

            <div className="evidence-signal-body">
              <div className="evidence-tendency-eyebrow">
                {t('report.evidence_observed_action')}
              </div>
              <p className="evidence-tendency-text">{primaryEvidenceText}</p>
            </div>
          </div>

          {/* Signal 02: Secondary Complementary Role Column */}
          <div className="evidence-signal-col evidence-signal-col--secondary">
            <div className="evidence-signal-meta">
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  backgroundColor: secondaryRoleConfig.bg,
                  border: `1px solid ${secondaryRoleConfig.color}30`,
                  color: secondaryRoleConfig.color,
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <Icon icon={secondaryRoleConfig.icon} width={15} height={15} />
                <span>{isEn ? secondaryRoleConfig.name : secondaryRoleConfig.nameVn}</span>
              </span>

              <span className="evidence-signal-badge">{t('report.evidence_secondary_role')}</span>
            </div>

            <div className="evidence-signal-body">
              <div className="evidence-tendency-eyebrow">
                {t('report.evidence_observed_action')}
              </div>
              <p className="evidence-tendency-text">{secondaryEvidenceText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
