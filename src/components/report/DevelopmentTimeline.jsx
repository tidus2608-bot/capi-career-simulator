import React from 'react'
import { useTranslation } from 'react-i18next'

export default function DevelopmentTimeline({
  isEn,
  primaryActivities = [],
  missingRoleMeta = {},
  missingPieceData = {},
  primarySkills = [],
}) {
  const { t } = useTranslation()

  return (
    <section className="report-section print-card dev-timeline-section">
      {/* Header Row with Horizontal Line */}
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
          {t('report.dev_path_title')}
        </h3>
        <div style={{ flex: 1, height: '2px', backgroundColor: '#E9D5FF' }} />
      </div>

      <div className="dev-timeline-grid">
        {/* Background SVG Curve mathematically anchored to 1000x600 grid */}
        <svg
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            overflow: 'visible',
            zIndex: 0,
          }}
          className="dev-timeline-curve no-print"
        >
          {/* Curve 1: From Card 1 top (210, 0) up and into Card 2 top center (500, 80) */}
          <path
            d="M 210 0 C 260 -70, 440 -60, 500 80"
            fill="none"
            stroke="#C084FC"
            strokeWidth="3.5"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
          {/* Curve 2: From Card 2 bottom center (500, 460) down and into Card 3 bottom center (840, 540) */}
          <path
            d="M 500 460 C 500 600, 780 620, 840 540"
            fill="none"
            stroke="#C084FC"
            strokeWidth="3.5"
            strokeDasharray="8 8"
            strokeLinecap="round"
          />
        </svg>

        {/* Column 1 / Step 1 */}
        <div className="dev-timeline-step-card dev-timeline-step-1">
          <div
            style={{
              backgroundColor: '#D8B4FE',
              color: '#FFFFFF',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 'var(--text-lg)',
              marginBottom: '16px',
              flexShrink: 0,
            }}
          >
            1
          </div>

          <h4
            style={{
              margin: '0 0 16px 0',
              fontSize: 'var(--text-md)',
              fontWeight: 800,
              color: '#C084FC',
              flexShrink: 0,
            }}
          >
            {t('report.dev_step1_try')}
          </h4>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: 'var(--text-sm)',
              color: '#334155',
              lineHeight: 1.5,
              fontWeight: 500,
              justifyContent: 'center',
              flex: 1,
            }}
          >
            {primaryActivities.slice(0, 3).map((act, i) => (
              <div key={i}>{act.activity_name}</div>
            ))}
          </div>
        </div>

        {/* Column 2 / Step 2 */}
        <div className="dev-timeline-step-card dev-timeline-step-2">
          <div
            style={{
              backgroundColor: '#D8B4FE',
              color: '#FFFFFF',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 'var(--text-lg)',
              marginBottom: '16px',
              flexShrink: 0,
            }}
          >
            2
          </div>

          <h4
            style={{
              margin: '0 0 10px 0',
              fontSize: 'var(--text-md)',
              fontWeight: 800,
              color: '#C084FC',
              flexShrink: 0,
            }}
          >
            {t('report.dev_step2_balance')}
          </h4>

          <div
            style={{
              fontSize: 'var(--text-base)',
              fontWeight: 700,
              color: '#1E293B',
              marginBottom: '10px',
              flexShrink: 0,
            }}
          >
            {isEn
              ? `${missingRoleMeta.nameVn} (${missingRoleMeta.name})`
              : `${missingRoleMeta.nameVn} (${missingRoleMeta.name})`}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              fontSize: 'var(--text-sm)',
              color: '#334155',
              lineHeight: 1.45,
              fontWeight: 500,
              justifyContent: 'center',
              flex: 1,
            }}
          >
            {missingPieceData?.activities_to_train ? (
              missingPieceData.activities_to_train
                .split('.')
                .map((s) => s.trim())
                .filter(Boolean)
                .map((act, i) => <div key={i}>{act}</div>)
            ) : (
              <div>{missingPieceData?.copy || t('report.dev_balance_with')}</div>
            )}
          </div>
        </div>

        {/* Column 3 / Step 3 */}
        <div className="dev-timeline-step-card dev-timeline-step-3">
          <div
            style={{
              backgroundColor: '#D8B4FE',
              color: '#FFFFFF',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 'var(--text-lg)',
              marginBottom: '16px',
              flexShrink: 0,
            }}
          >
            3
          </div>

          <h4
            style={{
              margin: '0 0 16px 0',
              fontSize: 'var(--text-md)',
              fontWeight: 800,
              color: '#C084FC',
              flexShrink: 0,
            }}
          >
            {t('report.dev_step3_skills')}
          </h4>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              fontSize: 'var(--text-sm)',
              color: '#334155',
              lineHeight: 1.5,
              fontWeight: 500,
              justifyContent: 'center',
              flex: 1,
            }}
          >
            {primarySkills.map((sk, i) => (
              <div key={i}>{sk.name}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
