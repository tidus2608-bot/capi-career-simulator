import React from 'react'
import { useTranslation } from 'react-i18next'
import SummaryRadar from '../SummaryRadar.jsx'
import { CAPI_ROLES } from '../../data.js'

export default function RadarRanking({ isEn, result }) {
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
        gap: '24px',
      }}
    >
      <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
        {t('report.radar_ranking_title')}
      </h3>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '40px',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        {/* Left Column: Radar (Centered) */}
        <div style={{ flex: 1, minWidth: '280px' }}>
          <SummaryRadar scores={result.phase2} size={280} />
        </div>

        {/* Right Column: Ranked Bars */}
        <div
          style={{
            flex: 1.2,
            minWidth: '320px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {Object.keys(CAPI_ROLES)
            .map((k) => ({
              key: k,
              nameEn: t(`roles.${k}.name`, {
                lng: 'en',
                defaultValue: CAPI_ROLES[k]?.name || k,
              }),
              nameVn: t(`roles.${k}.name`, {
                lng: 'vi',
                defaultValue: CAPI_ROLES[k]?.nameVn || k,
              }),
              score: Math.round(result.phase2?.[k] || 0),
            }))
            .sort((a, b) => b.score - a.score)
            .map((role, idx) => {
              const isTop1 = idx === 0
              const isTop2 = idx === 1
              const progressColor = isTop1 ? 'var(--color-primary)' : isTop2 ? '#A855F7' : '#94A3B8'
              const scoreColor = isTop1
                ? 'var(--color-primary)'
                : isTop2
                  ? '#7E22CE'
                  : 'var(--ink-secondary)'
              const nameColor = isTop1 || isTop2 ? 'var(--ink-dark)' : 'var(--ink-secondary)'
              const idxColor = isTop1 ? 'var(--color-primary)' : '#94A3B8'

              return (
                <div key={role.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Ranking Index */}
                  <span
                    style={{ fontSize: '14px', fontWeight: 800, color: idxColor, width: '22px' }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>

                  {/* Role Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '4px',
                        fontSize: '13.5px',
                      }}
                    >
                      <span style={{ fontWeight: 700, color: nameColor }}>
                        {isEn ? role.nameEn : role.nameVn}
                      </span>
                      <span style={{ fontWeight: 800, color: scoreColor }}>{role.score}%</span>
                    </div>

                    {/* Progress track */}
                    <div
                      style={{
                        height: '8px',
                        background: '#F1F5F9',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${role.score}%`,
                          backgroundColor: progressColor,
                          borderRadius: '9999px',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
