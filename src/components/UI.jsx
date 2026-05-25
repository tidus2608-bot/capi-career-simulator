import React, { useState, useEffect, useRef } from 'react'
import { CAPI_ROLES, ROLE_KEYS } from '../data.js'

export const Particles = ({ count = 24, color = "#00e5ff" }) => {
  const [seeds] = useState(() =>
    Array.from({ length: count }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 8,
      dur: 6 + Math.random() * 6,
      size: 2 + Math.random() * 3,
    }))
  )
  return (
    <div className="particles">
      {seeds.map((s, i) => (
        <span
          key={i}
          style={{
            left: `${s.left}%`,
            bottom: "-10px",
            width: s.size,
            height: s.size,
            background: color,
            boxShadow: `0 0 ${s.size * 3}px ${color}`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  )
}

export const Typed = ({ text, speed = 22, onDone = () => {}, className = "" }) => {
  const [state, setState] = useState({ text, pos: 0, done: false })
  const onDoneRef = useRef(onDone)
  useEffect(() => { onDoneRef.current = onDone })

  // Reset position when text prop changes (derived-state pattern, runs before paint)
  if (state.text !== text) {
    setState({ text, pos: 0, done: false })
  }

  useEffect(() => {
    const id = setInterval(() => {
      setState(s => {
        if (s.text !== text) return s
        const pos = s.pos + 1
        if (pos >= text.length) {
          clearInterval(id)
          onDoneRef.current()
          return { ...s, pos, done: true }
        }
        return { ...s, pos }
      })
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return <span className={`typed ${state.done ? "done" : ""} ${className}`}>{text.slice(0, state.pos)}</span>
}

export const Radar = ({ scores, size = 280, color = "#00e5ff" }) => {
  const axes = ["Explorer", "Builder", "Operator", "Connector", "Communicator"]
  const cx = size / 2
  const cy = size / 2
  const r = size / 2 - 40
  const max = Math.max(1, ...axes.map(a => scores[a] || 0))

  const pt = (i, v) => {
    const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
    const dist = (v / max) * r
    return [cx + Math.cos(angle) * dist, cy + Math.sin(angle) * dist]
  }

  const labelPos = (i) => {
    const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
    return [cx + Math.cos(angle) * (r + 22), cy + Math.sin(angle) * (r + 22)]
  }

  const shapePts = axes.map((a, i) => pt(i, scores[a] || 0).join(",")).join(" ")

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <defs>
        <radialGradient id="radar-fill" cx="50%" cy="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map((p, k) => (
        <polygon
          key={k}
          className="radar-grid"
          points={axes.map((_, i) => {
            const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
            return [cx + Math.cos(angle) * r * p, cy + Math.sin(angle) * r * p].join(",")
          }).join(" ")}
        />
      ))}
      {axes.map((_, i) => {
        const angle = -Math.PI / 2 + (i / axes.length) * Math.PI * 2
        return (
          <line key={i} className="radar-axis"
            x1={cx} y1={cy}
            x2={cx + Math.cos(angle) * r} y2={cy + Math.sin(angle) * r}
          />
        )
      })}
      <polygon points={shapePts} className="radar-shape" style={{ fill: "url(#radar-fill)", stroke: color }} />
      {axes.map((a, i) => {
        const [x, y] = pt(i, scores[a] || 0)
        return <circle key={a} cx={x} cy={y} r={4} fill={color} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      })}
      {axes.map((a, i) => {
        const [x, y] = labelPos(i)
        return (
          <text key={a} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="radar-label">
            {a}
          </text>
        )
      })}
    </svg>
  )
}

// ─── Dual-overlay Radar ──────────────────────────────────────────────────
export const DualRadar = ({ scores1, scores2, size = 300, color1 = '#5b9fff', color2 = '#ff6b9d' }) => {
  const axes = ROLE_KEYS
  const cx = size / 2, cy = size / 2, r = size / 2 - 44
  const labelNames = { explorer:'Explorer', builder:'Builder', operator:'Operator', connector:'Connector', communicator:'Communicator' }

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
    <svg width={size} height={size} style={{ display:'block' }}>
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
        <polygon key={k} className="radar-grid"
          points={axes.map((_, i) => { const a=-Math.PI/2+(i/axes.length)*Math.PI*2; return [cx+Math.cos(a)*r*p, cy+Math.sin(a)*r*p].join(',') }).join(' ')}
        />
      ))}
      {/* Axes */}
      {axes.map((_, i) => { const a=-Math.PI/2+(i/axes.length)*Math.PI*2; return <line key={i} className="radar-axis" x1={cx} y1={cy} x2={cx+Math.cos(a)*r} y2={cy+Math.sin(a)*r} /> })}
      {/* Shape 1: self-perception */}
      <polygon points={shapeStr(scores1)} style={{ fill:'url(#df1)', stroke:color1, strokeWidth:2, opacity:0.85 }} />
      {/* Shape 2: behavior */}
      <polygon points={shapeStr(scores2)} style={{ fill:'url(#df2)', stroke:color2, strokeWidth:2, opacity:0.85 }} />
      {/* Dots shape1 */}
      {axes.map((a, i) => { const [x,y]=pt(i,scores1?.[a]||0); return <circle key={'d1'+a} cx={x} cy={y} r={4} fill={color1} style={{ filter:`drop-shadow(0 0 5px ${color1})` }} /> })}
      {/* Dots shape2 */}
      {axes.map((a, i) => { const [x,y]=pt(i,scores2?.[a]||0); return <circle key={'d2'+a} cx={x} cy={y} r={4} fill={color2} style={{ filter:`drop-shadow(0 0 5px ${color2})` }} /> })}
      {/* Labels */}
      {axes.map((a, i) => { const [x,y]=labelPos(i); return <text key={'l'+a} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="radar-label">{labelNames[a]}</text> })}
    </svg>
  )
}

export const RoleIcon = ({ role, size = 48, color }) => {
  const roleKey = role?.toLowerCase?.() || role
  const c = color || CAPI_ROLES[roleKey]?.color || CAPI_ROLES[role]?.color || '#00e5ff'
  const common = { stroke: c, strokeWidth: 2, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }
  const icons = {
    Explorer: (
      <>
        <circle cx="12" cy="12" r="9" {...common} />
        <polygon points="12,7 14,12 12,17 10,12" fill={c} stroke="none" />
        <polygon points="7,12 12,10 17,12 12,14" fill={c} opacity="0.4" stroke="none" />
      </>
    ),
    Builder: (
      <>
        <path d="M 7 4 L 7 14 M 5 4 L 9 4" {...common} />
        <rect x="11" y="10" width="8" height="8" {...common} />
        <line x1="7" y1="14" x2="11" y2="14" {...common} />
      </>
    ),
    Operator: (
      <>
        <circle cx="12" cy="12" r="3" {...common} />
        <circle cx="12" cy="12" r="8" {...common} strokeDasharray="2 2" />
        <line x1="12" y1="3" x2="12" y2="5" {...common} />
        <line x1="12" y1="19" x2="12" y2="21" {...common} />
        <line x1="3" y1="12" x2="5" y2="12" {...common} />
        <line x1="19" y1="12" x2="21" y2="12" {...common} />
      </>
    ),
    Connector: (
      <>
        <circle cx="6" cy="6" r="2.5" {...common} />
        <circle cx="18" cy="6" r="2.5" {...common} />
        <circle cx="12" cy="18" r="2.5" {...common} />
        <line x1="8" y1="7" x2="16" y2="7" {...common} />
        <line x1="7" y1="8" x2="11" y2="16" {...common} />
        <line x1="17" y1="8" x2="13" y2="16" {...common} />
      </>
    ),
    Communicator: (
      <>
        <path d="M 5 10 L 5 14 L 10 14 L 16 18 L 16 6 L 10 10 Z" {...common} />
        <path d="M 18 9 Q 20 12 18 15" {...common} />
        <path d="M 19 7 Q 22 12 19 17" {...common} opacity="0.5" />
      </>
    ),
  }
  // Support both 'Explorer' and 'explorer' keys
  const iconKey = role ? (role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()) : role
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ filter: `drop-shadow(0 0 6px ${c}88)` }}>
      {icons[iconKey] || icons[role]}
    </svg>
  )
}

export const SceneArt = ({ variant }) => {
  switch (variant) {
    case "river":
      return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <path d="M -50 600 Q 300 540 600 600 T 1250 620 L 1250 820 L -50 820 Z" fill="#0a1f3a" opacity="0.8" />
          <path d="M -50 650 Q 300 590 600 650 T 1250 670" stroke="#3ddc84" strokeWidth="2" fill="none" opacity="0.3" />
          {[120, 280, 420, 640, 780, 920].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${600 + (i % 2) * 20})`}>
              <rect width="14" height="8" rx="1" fill="#6a7a8a" opacity="0.7" />
            </g>
          ))}
          <g transform="translate(900, 160)" opacity="0.5">
            <ellipse cx="100" cy="80" rx="120" ry="40" fill="#1a2048" />
            <circle cx="180" cy="70" r="8" fill="#ff5a5a">
              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </g>
          {[60, 90, 160, 1050, 1120].map((x, i) => (
            <line key={i} x1={x} y1="620" x2={x - 5} y2="580" stroke="#3ddc84" strokeWidth="2" opacity="0.4" />
          ))}
        </svg>
      )
    case "hospital":
      return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <rect x="100" y="200" width="1000" height="500" fill="#120a2a" opacity="0.6" />
          {Array.from({ length: 6 }).map((_, i) => (
            <rect key={i} x={160 + i * 140} y="280" width="100" height="120" fill="none" stroke="#ff6ba0" opacity="0.2" strokeWidth="1" />
          ))}
          <g transform="translate(500, 500)">
            <rect x="0" y="0" width="200" height="24" rx="12" fill="#0a0a20" stroke="#ff6ba0" strokeWidth="1" />
            <rect x="2" y="2" width="120" height="20" rx="10" fill="url(#happy-grad)">
              <animate attributeName="width" values="60;140;100;160;120" dur="8s" repeatCount="indefinite" />
            </rect>
            <defs>
              <linearGradient id="happy-grad">
                <stop offset="0%" stopColor="#ff6ba0" />
                <stop offset="100%" stopColor="#ffb020" />
              </linearGradient>
            </defs>
          </g>
          <text x="500" y="495" fontFamily="monospace" fontSize="11" fill="#ff6ba0" opacity="0.7">HAPPY INDEX</text>
        </svg>
      )
    case "rescue":
      return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <polygon points="0,800 200,600 400,700 600,580 800,680 1000,580 1200,660 1200,800" fill="#2a1008" opacity="0.8" />
          <polygon points="0,800 200,680 450,750 700,680 900,760 1200,700 1200,800" fill="#1a0604" opacity="0.9" />
          {[1, 2, 3].map(i => (
            <circle key={i} cx="900" cy="150" r={20 * i} fill="none" stroke="#ff6040" strokeWidth="2" opacity={0.7 / i}>
              <animate attributeName="r" values={`${20 * i};${40 * i};${20 * i}`} dur="2s" repeatCount="indefinite" />
            </circle>
          ))}
          <ellipse cx="600" cy="500" rx="200" ry="60" fill="#fff" opacity="0.08" />
          <ellipse cx="700" cy="480" rx="150" ry="40" fill="#fff" opacity="0.06" />
        </svg>
      )
    case "home":
      return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <rect x="200" y="200" width="800" height="500" fill="#14082a" opacity="0.7" />
          {[{x:280,y:300,t:"WIFI"},{x:440,y:320,t:"CAM"},{x:600,y:290,t:"LIGHT"},{x:760,y:310,t:"AC"},{x:870,y:400,t:"LOCK"}].map((d, i) => (
            <g key={i}>
              <circle cx={d.x} cy={d.y} r="22" fill="none" stroke="#b46cff" strokeWidth="1.2" opacity="0.7" />
              <circle cx={d.x} cy={d.y} r="6" fill="#b46cff" opacity="0.6">
                <animate attributeName="opacity" values="0.3;0.9;0.3" dur={`${2 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <text x={d.x} y={d.y + 40} textAnchor="middle" fontFamily="monospace" fontSize="10" fill="#b46cff" opacity="0.7">{d.t}</text>
              <line x1={d.x} y1={d.y} x2="600" y2="500" stroke="#b46cff" strokeWidth="0.5" opacity="0.3" strokeDasharray="2 3" />
            </g>
          ))}
          <circle cx="600" cy="500" r="30" fill="none" stroke="#00e5ff" strokeWidth="2" />
          <circle cx="600" cy="500" r="12" fill="#00e5ff" opacity="0.8" />
        </svg>
      )
    case "warehouse":
      return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {[200, 400, 600, 800, 1000].map((x, i) => (
            <g key={i}>
              <rect x={x} y="300" width="80" height="400" fill="#0a1028" stroke="#00e5ff" strokeWidth="1" opacity="0.5" />
              {[340, 400, 460, 520, 580, 640].map((y, j) => (
                <rect key={j} x={x + 8} y={y} width="64" height="20" fill="#ffb020" opacity="0.3" />
              ))}
            </g>
          ))}
          {[{x:150,y:700},{x:350,y:720},{x:550,y:700},{x:750,y:720}].map((r, i) => (
            <g key={i} transform={`translate(${r.x}, ${r.y})`}>
              <rect x="-20" y="-12" width="40" height="24" rx="4" fill="#00e5ff" opacity="0.7" />
              <circle cx="-12" cy="14" r="4" fill="#0a1028" />
              <circle cx="12" cy="14" r="4" fill="#0a1028" />
              <circle cx="0" cy="-4" r="3" fill="#fff">
                <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite" />
              </circle>
            </g>
          ))}
        </svg>
      )
    case "drone":
      return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <polygon points="0,700 100,550 150,600 220,500 300,580 360,520 440,600 520,480 600,560 680,500 760,580 840,540 920,600 1000,520 1080,580 1200,540 1200,800 0,800" fill="#08102a" opacity="0.9" />
          {[{x:200,y:200},{x:480,y:160},{x:700,y:240},{x:960,y:180}].map((d, i) => (
            <g key={i} transform={`translate(${d.x}, ${d.y})`}>
              <line x1="-16" y1="-8" x2="16" y2="8" stroke="#3ddc84" strokeWidth="2" />
              <line x1="16" y1="-8" x2="-16" y2="8" stroke="#3ddc84" strokeWidth="2" />
              <circle cx="-16" cy="-8" r="4" fill="#3ddc84" opacity="0.6" />
              <circle cx="16" cy="-8" r="4" fill="#3ddc84" opacity="0.6" />
              <circle cx="-16" cy="8" r="4" fill="#3ddc84" opacity="0.6" />
              <circle cx="16" cy="8" r="4" fill="#3ddc84" opacity="0.6" />
              <rect x="-4" y="-3" width="8" height="6" fill="#ffb020" />
              <animateTransform attributeName="transform" type="translate" values={`${d.x},${d.y}; ${d.x + 20},${d.y - 10}; ${d.x},${d.y}`} dur={`${3 + i}s`} repeatCount="indefinite" additive="replace" />
            </g>
          ))}
        </svg>
      )
    case "lab":
    default:
      return (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          <rect x="350" y="180" width="500" height="320" rx="8" fill="#0a1030" stroke="#00e5ff" strokeWidth="1.5" opacity="0.7" />
          <rect x="360" y="190" width="480" height="300" fill="#050820" />
          <polyline points="380,380 420,340 460,360 500,300 540,320 580,280 620,340 660,260 700,320 740,300 780,260 820,320"
                    stroke="#00e5ff" strokeWidth="2" fill="none" opacity="0.8">
            <animate attributeName="points"
                     values="380,380 420,340 460,360 500,300 540,320 580,280 620,340 660,260 700,320 740,300 780,260 820,320;
                             380,360 420,300 460,380 500,340 540,280 580,340 620,300 660,320 700,280 740,340 780,300 820,280;
                             380,380 420,340 460,360 500,300 540,320 580,280 620,340 660,260 700,320 740,300 780,260 820,320"
                     dur="3s" repeatCount="indefinite" />
          </polyline>
          {Array.from({ length: 10 }).map((_, i) => (
            <line key={i} x1={360 + i * 48} y1="190" x2={360 + i * 48} y2="490" stroke="#00e5ff" strokeWidth="0.3" opacity="0.3" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={i} x1="360" y1={220 + i * 48} x2="840" y2={220 + i * 48} stroke="#00e5ff" strokeWidth="0.3" opacity="0.3" />
          ))}
        </svg>
      )
  }
}
