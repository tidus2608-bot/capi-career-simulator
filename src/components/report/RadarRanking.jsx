import React from 'react'
import { useTranslation } from 'react-i18next'
import SummaryRadar from '../SummaryRadar.jsx'

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
          <SummaryRadar scores={result.phase2} size={300} />
        </div>

        {/* Right Column: Ranked Bars */}
        <div style={{ flex: 1.2, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { key: 'communicator', color: '#EAB308', nameVn: 'Người Truyền Cảm Hứng', nameEn: 'Communicator' },
            { key: 'connector', color: '#F97316', nameVn: 'Người Kết Nối', nameEn: 'Connector' },
            { key: 'operator', color: '#3B82F6', nameVn: 'Vận Hành Viên', nameEn: 'Operator' },
            { key: 'builder', color: '#00e5ff', nameVn: 'Kỹ Sư Chế Tạo', nameEn: 'Builder' },
            { key: 'explorer', color: '#7c5cff', nameVn: 'Nhà Khám Phá', nameEn: 'Explorer' },
          ]
            .map((rc) => ({ ...rc, score: Math.round(result.phase2?.[rc.key] || 0) }))
            .sort((a, b) => b.score - a.score)
            .map((role, idx) => {
              return (
                <div key={role.key} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {/* Ranking Index */}
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#94A3B8', width: '22px' }}>
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
                      <span style={{ fontWeight: 700, color: '#1E293B' }}>
                        {isEn ? role.nameEn : role.nameVn}
                      </span>
                      <span style={{ fontWeight: 800, color: role.color }}>
                        {role.score}%
                      </span>
                    </div>

                    {/* Progress track */}
                    <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${role.score}%`,
                          backgroundColor: role.color,
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
