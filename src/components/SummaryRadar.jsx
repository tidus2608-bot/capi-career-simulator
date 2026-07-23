import React from 'react'
import { useTranslation } from 'react-i18next'
import { CAPI_ROLES } from '../data.js'

const ROLES_CONFIG = [
  { key: 'communicator', color: '#EAB308' }, // Top (0 deg)
  { key: 'connector', color: '#F97316' },    // Top-Right (72 deg)
  { key: 'operator', color: '#3B82F6' },      // Bottom-Right (144 deg)
  { key: 'builder', color: '#EF4444' },        // Bottom-Left (216 deg)
  { key: 'explorer', color: '#22C55E' },      // Top-Left (288 deg)
]

export default function SummaryRadar({ scores, size = 260 }) {
  const { i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 45

  // Map values to 0-100 scale
  const getScore = (key) => {
    const raw = scores?.[key] || 0
    return Math.max(10, Math.min(100, raw))
  }

  // Polygon points
  const points = ROLES_CONFIG.map((rc, i) => {
    const angle = -Math.PI / 2 + (i / ROLES_CONFIG.length) * Math.PI * 2
    const dist = (getScore(rc.key) / 100) * r
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist]
  })

  const shapeStr = points.map((p) => p.join(',')).join(' ')

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#E9D5FF" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Background Grid Rings */}
        {[0.4, 0.7, 1].map((scale, idx) => (
          <polygon
            key={idx}
            points={ROLES_CONFIG.map((_, i) => {
              const a = -Math.PI / 2 + (i / ROLES_CONFIG.length) * Math.PI * 2
              return [cx + Math.cos(a) * r * scale, cy + Math.sin(a) * r * scale].join(',')
            }).join(' ')}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="1.5"
          />
        ))}

        {/* Grid Axis Lines */}
        {ROLES_CONFIG.map((_, i) => {
          const a = -Math.PI / 2 + (i / ROLES_CONFIG.length) * Math.PI * 2
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={cx + Math.cos(a) * r}
              y2={cy + Math.sin(a) * r}
              stroke="#F1F5F9"
              strokeWidth="1.5"
            />
          )
        })}

        {/* Filled Score Polygon */}
        <polygon
          points={shapeStr}
          fill="url(#radarFill)"
          stroke="#A855F7"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Dots on Vertices */}
        {points.map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="4.5"
            fill="#9333EA"
            stroke="#FFFFFF"
            strokeWidth="2"
          />
        ))}
      </svg>

      {/* Vertex Badges Overlay */}
      {ROLES_CONFIG.map((rc, i) => {
        const angle = -Math.PI / 2 + (i / ROLES_CONFIG.length) * Math.PI * 2
        // Position badge slightly outside max radius
        const bx = cx + Math.cos(angle) * (r + 26)
        const by = cy + Math.sin(angle) * (r + 26)
        const scoreVal = Math.round(getScore(rc.key))

        return (
          <div
            key={rc.key}
            style={{
              position: 'absolute',
              left: `${bx}px`,
              top: `${by}px`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: rc.color,
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '3px 10px',
              fontSize: '11px',
              fontWeight: 700,
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 10
            }}
          >
            <span>{scoreVal}%</span>
            <span>{isEn ? (CAPI_ROLES[rc.key]?.name || rc.key) : (CAPI_ROLES[rc.key]?.nameVn || rc.key)}</span>
          </div>
        )
      })}
    </div>
  )
}
