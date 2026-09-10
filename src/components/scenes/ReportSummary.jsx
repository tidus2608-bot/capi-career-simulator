import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import SummaryRadar from '../SummaryRadar.jsx'
import Capi from '../Capi.jsx'
import Button from '../Button.jsx'
import { capiAudio } from '../../audio.js'
import { getRoleConfig } from '../../data.js'

export default function ReportSummary() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { result, certCopy, certId } = useOutletContext()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768,
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!result || !certCopy) return null

  const primaryRoleKey = result.primaryRole
  const primaryRoleConfig = getRoleConfig(primaryRoleKey)

  const radarScores = result.phase2 || result.phase1 || {}

  const lowestRoleKey = certCopy.lowestRoles?.[0] || 'operator'
  const lowestRoleConfig = getRoleConfig(lowestRoleKey)
  const growthHeadline = t(`roles.${lowestRoleKey}.name`)
  const growthQualifications =
    t(`roles.${lowestRoleKey}.qualifications`, { returnObjects: true }) || []
  const growthDesc = Array.isArray(growthQualifications) ? growthQualifications[0] || '' : ''

  const qualifications = t(`roles.${primaryRoleKey}.qualifications`, { returnObjects: true }) || []
  const strengthsHeadline =
    Array.isArray(qualifications) && qualifications[0]
      ? qualifications[0]
      : t(`roles.${primaryRoleKey}.name`)
  const strengthsDesc = Array.isArray(qualifications) ? qualifications.slice(1, 4).join(', ') : ''

  const naturalBehaviors =
    t(`roles.${primaryRoleKey}.natural_behaviors`, { returnObjects: true }) || []
  const naturalBehaviorDesc = Array.isArray(naturalBehaviors)
    ? naturalBehaviors.slice(0, 2).join(' ')
    : ''

  return (
    <div className="report-summary-shell">
      {/* Top Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 1200,
          height: 480,
          background:
            'radial-gradient(ellipse 65% 55% at 50% 12%, rgba(132, 52, 151, 0.09) 0%, rgba(2, 132, 199, 0.04) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* MAIN 2-COLUMN ROW (RESPONSIVE FLEXBOX) */}
      <main className="report-summary-main">
        {/* LEFT COLUMN: Summary Cards & Mascot */}
        <div className="report-summary-left">
          {/* Top Mascot + Speech Bubble */}
          <div
            className="report-summary-mascot-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexShrink: 0,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.5s ease-out',
            }}
          >
            <Capi pose="wave" size={90} style={{ flexShrink: 0 }} />

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1.5px solid var(--border-purple)',
                padding: '14px 20px',
                boxShadow: '0 4px 16px -2px rgba(132, 52, 151, 0.06)',
                flex: 1,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 'var(--text-md)',
                  color: 'var(--ink-dark)',
                  marginBottom: '2px',
                }}
              >
                {t('report.mascot_title')}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--ink-secondary)',
                  lineHeight: '1.4',
                }}
              >
                {t('report.mascot_desc')}
              </div>
            </div>
          </div>

          {/* Card 1: Strengths */}
          <div
            className="report-summary-dossier-card"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-15px)',
              transition: 'all 0.4s ease-out 0.1s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span
                style={{
                  backgroundColor: `${primaryRoleConfig.color}15`,
                  color: primaryRoleConfig.color,
                  border: `1px solid ${primaryRoleConfig.color}35`,
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  padding: '3px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  width: 'fit-content',
                }}
              >
                <Icon icon="mdi:star-four-points" width={13} height={13} />
                {t('report.card_strength')}
              </span>
            </div>
            <h4
              style={{
                margin: '0 0 6px 0',
                fontSize: 'var(--text-md)',
                fontWeight: 800,
                color: 'var(--ink-dark)',
              }}
            >
              {strengthsHeadline}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--ink-secondary)',
                lineHeight: '1.5',
              }}
            >
              {strengthsDesc}
            </p>
          </div>

          {/* Card 2: Working Style */}
          <div
            className="report-summary-dossier-card"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-15px)',
              transition: 'all 0.4s ease-out 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span
                style={{
                  backgroundColor: 'var(--surface-lavender)',
                  border: '1px solid var(--border-purple)',
                  color: 'var(--color-primary)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  padding: '3px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  width: 'fit-content',
                }}
              >
                <Icon icon="mdi:compass-outline" width={13} height={13} />
                {t('report.card_style')}
              </span>
            </div>
            <h4
              style={{
                margin: '0 0 6px 0',
                fontSize: 'var(--text-md)',
                fontWeight: 800,
                color: 'var(--ink-dark)',
              }}
            >
              {t('report.natural_behavior_headline')}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--ink-secondary)',
                lineHeight: '1.5',
              }}
            >
              {naturalBehaviorDesc}
            </p>
          </div>

          {/* Card 3: Growth Suggestion */}
          <div
            className="report-summary-dossier-card"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateX(0)' : 'translateX(-15px)',
              transition: 'all 0.4s ease-out 0.3s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <span
                style={{
                  backgroundColor: `${lowestRoleConfig.color}15`,
                  border: `1px solid ${lowestRoleConfig.color}35`,
                  color: lowestRoleConfig.color,
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  borderRadius: '9999px',
                  padding: '3px 12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  width: 'fit-content',
                }}
              >
                <Icon icon="mdi:bullseye-arrow" width={13} height={13} />
                {t('report.card_growth')}
              </span>
            </div>
            <h4
              style={{
                margin: '0 0 6px 0',
                fontSize: 'var(--text-md)',
                fontWeight: 800,
                color: 'var(--ink-dark)',
              }}
            >
              {growthHeadline}
            </h4>
            <p
              style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--ink-secondary)',
                lineHeight: '1.5',
              }}
            >
              {growthDesc}
            </p>
          </div>

          {/* Bottom Button: Test History */}
          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/history')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              fontSize: 'var(--text-sm)',
              marginTop: '4px',
            }}
          >
            <Icon icon="mdi:history" width={18} height={18} />
            <span>{t('report.btn_past_runs_history')}</span>
          </Button>
        </div>

        {/* RIGHT COLUMN: Certificate Card */}
        <div
          className="report-summary-right"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.97)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          {/* Watermark Award Icon Top Right */}
          <Icon
            icon="mdi:award"
            width={160}
            height={160}
            style={{
              color: primaryRoleConfig.color,
              position: 'absolute',
              top: -15,
              right: -15,
              opacity: 0.05,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Top Pill ID Badge */}
          <div
            style={{
              backgroundColor: 'var(--surface-light)',
              border: '1px solid var(--border-purple)',
              color: 'var(--color-primary)',
              borderRadius: '9999px',
              padding: '4px 16px',
              fontSize: 'var(--text-2xs)',
              fontWeight: 700,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              marginBottom: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 8px rgba(132, 52, 151, 0.06)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
              }}
            />
            CAPI-GENE ID: CG-2026-{certId}
          </div>

          {/* Title & Subtitle */}
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                margin: 0,
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                color: 'var(--ink-dark)',
                fontFamily: 'var(--font-display, sans-serif)',
                letterSpacing: '-0.02em',
              }}
            >
              {t('report.cert_title')}
            </h2>
            <p
              style={{
                margin: '3px 0 0 0',
                fontSize: 'var(--text-xs)',
                color: 'var(--ink-secondary)',
              }}
            >
              {t('report.cert_subtitle')}
            </p>
          </div>

          {/* Archetype Honor Spotlight */}
          <div
            style={{
              backgroundColor: primaryRoleConfig.bg,
              border: `1.5px solid ${primaryRoleConfig.color}33`,
              borderRadius: '18px',
              padding: '14px 20px',
              width: '100%',
              boxSizing: 'border-box',
              margin: '12px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              boxShadow: `0 8px 24px -6px ${primaryRoleConfig.color}18`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ textAlign: 'left', flex: 1 }}>
              <div
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: primaryRoleConfig.color,
                  marginBottom: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Icon icon="mdi:crown-outline" width={14} height={14} />
                <span>{t('report.dominant_archetype')}</span>
              </div>
              <h3
                style={{
                  margin: '0 0 2px 0',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: 'var(--ink-dark)',
                  fontFamily: 'var(--font-display, sans-serif)',
                  letterSpacing: '-0.02em',
                }}
              >
                {t(`roles.${result.primaryRole}.name`)}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: '13px',
                  color: 'var(--ink-secondary)',
                  lineHeight: '1.4',
                  fontWeight: 500,
                }}
              >
                {t(`roles.${result.primaryRole}.tagline`)}
              </p>
            </div>

            {/* Emblem Icon with halo */}
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
                boxShadow: `0 4px 14px ${primaryRoleConfig.color}25`,
                flexShrink: 0,
              }}
            >
              <Icon icon={primaryRoleConfig.icon} width={26} height={26} />
            </div>
          </div>

          {/* Polygon Radar with Vertex Badges */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 0,
            }}
          >
            <SummaryRadar scores={radarScores} size={isMobile ? 220 : 280} />
          </div>

          {/* Bottom Action Buttons Row */}
          <div className="report-summary-actions">
            {/* Primary Button */}
            <Button
              variant="solid"
              active={true}
              onClick={() => navigate('/certificate/details')}
              className="report-summary-btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '48px',
                borderRadius: '14px',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
              }}
            >
              <Icon icon="mdi:eye-outline" width={20} height={20} />
              <span>{t('report.btn_details')}</span>
            </Button>

            {/* Secondary Button */}
            <Button
              variant="outline"
              onClick={() => navigate('/certificate/details?print=true')}
              className="report-summary-btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '48px',
                borderRadius: '14px',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
              }}
            >
              <Icon icon="mdi:download-outline" width={20} height={20} />
              <span>{t('report.btn_pdf')}</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
