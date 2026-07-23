import React from 'react'
import { ROLE_KEYS } from '../data.js'

export default function DualRadar({
  scores1,
  scores2,
  size = 300,
  color1 = '#5b9fff',
  color2 = '#ff6b9d',
}) {
  const axes = ROLE_KEYS
  const cx = size / 2,
    cy = size / 2,
    r = size / 2 - 44
  const labelNames = {
    explorer: 'Explorer',
    builder: 'Builder',
    operator: 'Operator',
    connector: 'Connector',
    communicator: 'Communicator',
  }

  const pt = (i, v) => {
    const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
    const dist = (Math.max(0, Math.min(100, v)) / 100) * r
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist]
  }
  const labelPos = (i) => {
    const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
    return [cx + Math.cos(angle) * (r + 26), cy + Math.sin(angle) * (r + 26)]
  }

  const shapeStr = (scores) => axes.map((a, i) => pt(i, scores?.[a] || 0).join(',')).join(' ')

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      overflow="visible"
      style={{ display: 'block', maxWidth: '100%', height: 'auto' }}
    >
      <defs>
        <radialGradient id="df1" cx="50%" cy="50%">
          <stop offset="0%" stopColor={color1} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color1} stopOpacity="0.05" />
        </radialGradient>
        <radialGradient id="df2" cx="50%" cy="50%">
          <stop offset="0%" stopColor={color2} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color2} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {/* Grid rings */}
      {[0.25, 0.5, 0.75, 1].map((p, k) => (
        <polygon
          key={k}
          className="radar-grid"
          points={axes
            .map((_, i) => {
              const a = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
              return [cx + Math.cos(a) * r * p, cy + Math.sin(a) * r * p].join(',')
            })
            .join(' ')}
        />
      ))}
      {/* Axes */}
      {axes.map((_, i) => {
        const a = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
        return (
          <line
            key={i}
            className="radar-axis"
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * r}
            y2={cy + Math.sin(a) * r}
          />
        )
      })}
      {/* Shape 1: self-perception */}
      <polygon
        points={shapeStr(scores1)}
        style={{ fill: 'url(#df1)', stroke: color1, strokeWidth: 2, opacity: 0.85 }}
      />
      {/* Shape 2: behavior */}
      <polygon
        points={shapeStr(scores2)}
        style={{ fill: 'url(#df2)', stroke: color2, strokeWidth: 2, opacity: 0.85 }}
      />
      {/* Dots shape1 */}
      {axes.map((a, i) => {
        const [x, y] = pt(i, scores1?.[a] || 0)
        return (
          <circle
            key={'d1' + a}
            cx={x}
            cy={y}
            r={4}
            fill={color1}
            style={{ filter: `drop-shadow(0 0 5px ${color1})` }}
          />
        )
      })}
      {/* Dots shape2 */}
      {axes.map((a, i) => {
        const [x, y] = pt(i, scores2?.[a] || 0)
        return (
          <circle
            key={'d2' + a}
            cx={x}
            cy={y}
            r={4}
            fill={color2}
            style={{ filter: `drop-shadow(0 0 5px ${color2})` }}
          />
        )
      })}
      {/* Labels */}
      {axes.map((a, i) => {
        const [x, y] = labelPos(i)
        return (
          <text
            key={'l' + a}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="radar-label"
          >
            {labelNames[a]}
          </text>
        )
      })}
    </svg>
  )
}
