import React from 'react'
import { useTranslation } from 'react-i18next'

export default function DevelopmentTimeline({
  isEn,
  primaryActivities,
  missingRoleMeta,
  missingPieceData,
  primarySkills,
}) {
  const { t } = useTranslation()

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
        gap: '32px',
      }}
    >
      {/* Header Row with Horizontal Line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#A855F7', whiteSpace: 'nowrap' }}>
          {t('report.dev_path_title')}
        </h3>
        <div style={{ flex: 1, height: '2px', backgroundColor: '#E9D5FF' }} />
      </div>

      <div
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          minHeight: '560px',
          paddingBottom: '20px',
        }}
      >
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
          className="no-print"
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
        <div
          style={{
            border: '1.5px solid #E9D5FF',
            borderRadius: '20px',
            padding: '32px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            zIndex: 1,
            alignSelf: 'flex-start',
            height: '380px',
            boxSizing: 'border-box',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.04)',
          }}
        >
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
              fontSize: '20px',
              marginBottom: '16px',
              flexShrink: 0,
            }}
          >
            1
          </div>

          <h4 style={{ margin: '0 0 16px 0', fontSize: '19px', fontWeight: 800, color: '#C084FC', flexShrink: 0 }}>
            {t('report.dev_step1_try')}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#334155', lineHeight: 1.5, fontWeight: 500, justifyContent: 'center', flex: 1 }}>
            {primaryActivities.slice(0, 3).map((act, i) => (
              <div key={i}>{act.activity_name}</div>
            ))}
          </div>
        </div>

        {/* Column 2 / Step 2 */}
        <div
          style={{
            border: '1.5px solid #E9D5FF',
            borderRadius: '20px',
            padding: '32px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            zIndex: 1,
            alignSelf: 'flex-start',
            marginTop: '80px',
            height: '380px',
            boxSizing: 'border-box',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.04)',
          }}
        >
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
              fontSize: '20px',
              marginBottom: '16px',
              flexShrink: 0,
            }}
          >
            2
          </div>

          <h4 style={{ margin: '0 0 10px 0', fontSize: '19px', fontWeight: 800, color: '#C084FC', flexShrink: 0 }}>
            {t('report.dev_step2_balance')}
          </h4>

          <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#1E293B', marginBottom: '10px', flexShrink: 0 }}>
            {isEn ? `${missingRoleMeta.nameVn} (${missingRoleMeta.name})` : `${missingRoleMeta.nameVn} (${missingRoleMeta.name})`}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px', color: '#334155', lineHeight: 1.45, fontWeight: 500, justifyContent: 'center', flex: 1 }}>
            {missingPieceData?.activities_to_train ? (
              missingPieceData.activities_to_train.split('.').map((s) => s.trim()).filter(Boolean).map((act, i) => (
                <div key={i}>{act}</div>
              ))
            ) : (
              <div>{missingPieceData?.copy || t('report.dev_balance_with')}</div>
            )}
          </div>
        </div>

        {/* Column 3 / Step 3 */}
        <div
          style={{
            border: '1.5px solid #E9D5FF',
            borderRadius: '20px',
            padding: '32px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            backgroundColor: '#FFFFFF',
            zIndex: 1,
            alignSelf: 'flex-start',
            marginTop: '160px',
            height: '380px',
            boxSizing: 'border-box',
            boxShadow: '0 4px 12px rgba(168, 85, 247, 0.04)',
          }}
        >
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
              fontSize: '20px',
              marginBottom: '16px',
              flexShrink: 0,
            }}
          >
            3
          </div>

          <h4 style={{ margin: '0 0 16px 0', fontSize: '19px', fontWeight: 800, color: '#C084FC', flexShrink: 0 }}>
            {t('report.dev_step3_skills')}
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#334155', lineHeight: 1.5, fontWeight: 500, justifyContent: 'center', flex: 1 }}>
            {primarySkills.map((sk, i) => (
              <div key={i}>{sk.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
