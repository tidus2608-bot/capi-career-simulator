/**
 * Library of 30 mission-question scene illustrations.
 *
 * Each entry is a render function `(props: { accent: string }) => <g>…</g>`
 * meant to be wrapped by <QIllo /> which provides the outer 320×180 SVG.
 * Ported from the Claude Design prototype.
 */
import TinyCapi, { I_LINE, I_CAPI } from './TinyCapi.jsx'
import Twinkles from './Twinkles.jsx'

export const ILLUSTRATIONS = {
  /* ── RIVER / SMART WASTE (m1) ─────────────────────────────────────────── */
  'river-recon': () => (
    <g>
      <rect width="320" height="180" fill="#0a1830" />
      <Twinkles seed={1} count={20} color="#7cb8ff" />
      <path
        d="M 0 100 Q 60 70 120 100 Q 180 80 240 95 Q 300 80 320 95 L 320 180 L 0 180 Z"
        fill="#1a2a52"
      />
      <path d="M 0 130 Q 80 105 160 125 Q 240 110 320 130 L 320 180 L 0 180 Z" fill="#102040" />
      <circle cx="260" cy="40" r="14" fill="#f0e8c8" opacity="0.9" />
      <circle cx="266" cy="36" r="10" fill="#0a1830" />
      <path d="M 0 150 L 320 150 L 320 180 L 0 180 Z" fill="#2a4080" />
      <path d="M 0 158 Q 80 156 160 160 Q 240 156 320 160 L 320 168 L 0 168 Z" fill="#3d5aa8" />
      <ellipse cx="60" cy="160" rx="8" ry="3" fill="#e8e8e8" stroke={I_LINE} strokeWidth="1" />
      <rect
        x="100"
        y="156"
        width="10"
        height="6"
        rx="1"
        fill="#ff6060"
        stroke={I_LINE}
        strokeWidth="1"
      />
      <ellipse cx="180" cy="162" rx="9" ry="3" fill="#7ce0ff" stroke={I_LINE} strokeWidth="1" />
      <rect
        x="220"
        y="158"
        width="14"
        height="5"
        rx="1"
        fill="#fff"
        stroke={I_LINE}
        strokeWidth="1"
      />
      <ellipse cx="270" cy="164" rx="6" ry="2.5" fill="#ffb060" stroke={I_LINE} strokeWidth="1" />
      <TinyCapi x={70} y={120} scale={1} outfit="eco" />
      <rect
        x="60"
        y="113"
        width="6"
        height="6"
        rx="1"
        fill="#1a2a3a"
        stroke={I_LINE}
        strokeWidth="1"
      />
      <rect
        x="74"
        y="113"
        width="6"
        height="6"
        rx="1"
        fill="#1a2a3a"
        stroke={I_LINE}
        strokeWidth="1"
      />
      <line x1="66" y1="116" x2="74" y2="116" stroke={I_LINE} strokeWidth="1.2" />
      <g opacity="0.9">
        <ellipse cx="240" cy="105" rx="18" ry="6" fill="#ff4040" />
        <ellipse cx="240" cy="105" rx="14" ry="3" fill="#ff8060">
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite" />
        </ellipse>
      </g>
    </g>
  ),

  'river-build': ({ accent = '#3ddc84' }) => (
    <g>
      <rect width="320" height="180" fill="#11142a" />
      <Twinkles seed={2} count={14} color={accent} />
      <rect x="0" y="130" width="320" height="50" fill="#3a2a1a" />
      <rect x="0" y="125" width="320" height="8" fill="#5a3e22" stroke={I_LINE} strokeWidth="1.5" />
      <g>
        <circle cx="60" cy="115" r="12" fill="#9aa6b8" stroke={I_LINE} strokeWidth="1.5" />
        <circle cx="60" cy="115" r="4" fill="#3a4658" />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <rect
            key={a}
            x="58"
            y="100"
            width="4"
            height="5"
            fill="#9aa6b8"
            stroke={I_LINE}
            strokeWidth="1"
            transform={`rotate(${a} 60 115)`}
          />
        ))}
        <rect
          x="100"
          y="108"
          width="22"
          height="14"
          rx="3"
          fill={accent}
          stroke={I_LINE}
          strokeWidth="1.5"
        />
        <path
          d="M 122 112 L 132 108 M 122 118 L 132 122"
          stroke={I_LINE}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <rect
          x="200"
          y="106"
          width="40"
          height="22"
          rx="2"
          fill="#0f4030"
          stroke={I_LINE}
          strokeWidth="1.5"
        />
        <circle cx="208" cy="114" r="1.5" fill={accent} />
        <circle cx="216" cy="114" r="1.5" fill="#ffd060" />
        <circle cx="224" cy="114" r="1.5" fill={accent} />
        <line x1="208" y1="120" x2="232" y2="120" stroke={accent} strokeWidth="0.6" />
        <line x1="208" y1="124" x2="228" y2="124" stroke={accent} strokeWidth="0.6" />
        <rect
          x="252"
          y="100"
          width="50"
          height="28"
          fill="#dfe8ff"
          stroke={I_LINE}
          strokeWidth="1.5"
        />
        <line x1="258" y1="108" x2="296" y2="108" stroke="#3a6abf" strokeWidth="0.6" />
        <line x1="258" y1="114" x2="290" y2="114" stroke="#3a6abf" strokeWidth="0.6" />
        <rect
          x="262"
          y="118"
          width="14"
          height="8"
          fill="none"
          stroke="#3a6abf"
          strokeWidth="0.8"
        />
      </g>
      <TinyCapi x={160} y={90} scale={1.1} outfit="eco" />
      <rect
        x="178"
        y="100"
        width="3"
        height="14"
        fill="#9aa6b8"
        stroke={I_LINE}
        strokeWidth="0.8"
      />
      <rect
        x="174"
        y="98"
        width="11"
        height="5"
        rx="1"
        fill="#9aa6b8"
        stroke={I_LINE}
        strokeWidth="0.8"
      />
      <line x1="160" y1="0" x2="160" y2="28" stroke={I_LINE} strokeWidth="1" />
      <circle cx="160" cy="32" r="6" fill="#ffe890" stroke={I_LINE} strokeWidth="1" />
      <ellipse cx="160" cy="42" rx="22" ry="14" fill="#ffe890" opacity="0.18" />
    </g>
  ),

  'river-storm': () => (
    <g>
      <rect width="320" height="180" fill="#0a1430" />
      {Array.from({ length: 30 }).map((_, i) => (
        <line
          key={i}
          x1={(i * 11) % 320}
          y1={(i * 17) % 80}
          x2={((i * 11) % 320) - 4}
          y2={((i * 17) % 80) + 12}
          stroke="#7cb8ff"
          strokeWidth="1"
          opacity="0.7"
        >
          <animate
            attributeName="y1"
            values={`${(i * 17) % 80};${((i * 17) % 80) + 80}`}
            dur={`${0.6 + (i % 5) * 0.1}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="y2"
            values={`${((i * 17) % 80) + 12};${((i * 17) % 80) + 92}`}
            dur={`${0.6 + (i % 5) * 0.1}s`}
            repeatCount="indefinite"
          />
        </line>
      ))}
      <path
        d="M 240 0 L 230 30 L 245 30 L 232 70"
        stroke="#ffe890"
        strokeWidth="2"
        fill="none"
        opacity="0.6"
      >
        <animate attributeName="opacity" values="0;1;0;0;0" dur="3s" repeatCount="indefinite" />
      </path>
      <path
        d="M 0 110 Q 40 100 80 115 T 160 110 T 240 115 T 320 108 L 320 180 L 0 180 Z"
        fill="#1a3070"
      />
      <path
        d="M 0 130 Q 40 122 80 135 T 160 128 T 240 134 T 320 126 L 320 180 L 0 180 Z"
        fill="#2a4080"
      />
      <path
        d="M 0 150 Q 40 144 80 152 T 160 148 T 240 152 T 320 146 L 320 180 L 0 180 Z"
        fill="#3d5aa8"
      />
      <path d="M 60 116 Q 70 110 80 116" stroke="#9accff" strokeWidth="1.4" fill="none" />
      <path d="M 200 130 Q 210 124 220 130" stroke="#9accff" strokeWidth="1.4" fill="none" />
      <g>
        <rect
          x="142"
          y="100"
          width="36"
          height="26"
          rx="4"
          fill="#3a5070"
          stroke={I_LINE}
          strokeWidth="1.5"
        />
        <rect x="148" y="106" width="10" height="8" rx="1" fill="#3ddc84" />
        <rect x="162" y="106" width="10" height="8" rx="1" fill="#ffd060" />
        <rect x="155" y="118" width="10" height="6" fill="#1a2030" />
        <line x1="160" y1="100" x2="160" y2="92" stroke={I_LINE} strokeWidth="1.2" />
        <circle cx="160" cy="90" r="3" fill="#ff4040" />
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0; 4 -3; -3 2; 0 0"
          dur="1.4s"
          repeatCount="indefinite"
        />
      </g>
      <TinyCapi x={50} y={140} scale={0.85} outfit="eco" mood="worry" />
    </g>
  ),

  'river-scale': ({ accent = '#3ddc84' }) => (
    <g>
      <rect width="320" height="180" fill="#0c2030" />
      <rect x="0" y="0" width="320" height="180" fill="#0c2030" />
      <Twinkles seed={3} count={10} color={accent} />
      <path
        d="M 30 40 Q 60 30 90 50 Q 100 80 70 90 Q 40 80 30 40 Z"
        fill="#1a3050"
        stroke={accent}
        strokeWidth="1.4"
        strokeDasharray="3 2"
      />
      <path
        d="M 130 50 Q 170 40 200 60 Q 210 100 170 110 Q 130 100 130 50 Z"
        fill="#1a3050"
        stroke={accent}
        strokeWidth="1.4"
        strokeDasharray="3 2"
      />
      <path
        d="M 240 70 Q 280 60 300 90 Q 300 130 260 130 Q 230 110 240 70 Z"
        fill="#1a3050"
        stroke={accent}
        strokeWidth="1.4"
        strokeDasharray="3 2"
      />
      <rect
        x="55"
        y="55"
        width="14"
        height="14"
        rx="2"
        fill={accent}
        stroke={I_LINE}
        strokeWidth="1"
      />
      <circle cx="62" cy="62" r="2" fill="#fff" />
      <text x="62" y="84" fontSize="8" fill={accent} textAnchor="middle" fontFamily="monospace">
        DONE ✓
      </text>
      <rect
        x="160"
        y="68"
        width="14"
        height="14"
        rx="2"
        fill="#666"
        stroke={I_LINE}
        strokeWidth="1"
        opacity="0.5"
      />
      <text x="167" y="100" fontSize="8" fill="#aaa" textAnchor="middle" fontFamily="monospace">
        ?
      </text>
      <rect
        x="265"
        y="92"
        width="14"
        height="14"
        rx="2"
        fill="#666"
        stroke={I_LINE}
        strokeWidth="1"
        opacity="0.5"
      />
      <text x="272" y="124" fontSize="8" fill="#aaa" textAnchor="middle" fontFamily="monospace">
        ?
      </text>
      <path
        d="M 75 75 Q 120 60 160 80"
        stroke={accent}
        strokeWidth="1.2"
        strokeDasharray="2 3"
        fill="none"
      />
      <path
        d="M 175 90 Q 220 100 260 105"
        stroke={accent}
        strokeWidth="1.2"
        strokeDasharray="2 3"
        fill="none"
      />
      <TinyCapi x={50} y={148} scale={0.9} outfit="eco" />
      <line
        x1="65"
        y1="130"
        x2="100"
        y2="80"
        stroke={accent}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </g>
  ),

  'river-fail': () => (
    <g>
      <rect width="320" height="180" fill="#0a1428" />
      {Array.from({ length: 24 }).map((_, i) => (
        <line
          key={i}
          x1={(i * 13) % 320}
          y1={(i * 23) % 70}
          x2={((i * 13) % 320) - 5}
          y2={((i * 23) % 70) + 14}
          stroke="#7cb8ff"
          strokeWidth="1.2"
          opacity="0.6"
        />
      ))}
      <path d="M 0 90 Q 80 80 160 100 T 320 95 L 320 180 L 0 180 Z" fill="#0d2554" />
      <path d="M 0 120 Q 60 110 130 125 T 240 120 T 320 130 L 320 180 L 0 180 Z" fill="#1f3978" />
      <path d="M 0 150 Q 80 140 160 155 T 320 148 L 320 180 L 0 180 Z" fill="#3458a8" />
      <g>
        <rect
          x="142"
          y="100"
          width="36"
          height="28"
          rx="4"
          fill="#3a3038"
          stroke={I_LINE}
          strokeWidth="1.5"
        />
        <rect x="148" y="108" width="24" height="6" rx="1" fill="#1a0f12" />
        <text
          x="160"
          y="113"
          fontSize="6"
          fill="#ff5566"
          textAnchor="middle"
          fontFamily="monospace"
          fontWeight="bold"
        >
          ERROR
        </text>
        <rect x="148" y="118" width="10" height="6" fill="#ff4040">
          <animate attributeName="opacity" values="0.3;1;0.3" dur="0.6s" repeatCount="indefinite" />
        </rect>
        <rect x="162" y="118" width="10" height="6" fill="#1a2030" />
      </g>
      <g>
        <line x1="160" y1="100" x2="160" y2="86" stroke="#ffe890" strokeWidth="1.5" />
        <circle cx="160" cy="86" r="3" fill="#ffe890">
          <animate attributeName="r" values="2;5;2" dur="0.4s" repeatCount="indefinite" />
        </circle>
      </g>
      <TinyCapi x={60} y={142} scale={0.9} outfit="eco" mood="ohh" />
      <text
        x="60"
        y="100"
        fontSize="14"
        fill="#ff8060"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="bold"
      >
        !?
      </text>
    </g>
  ),

  /* ── HOSPITAL (m2) ────────────────────────────────────────────────────── */
  'hospital-recon': ({ accent = '#ff80c8' }) => (
    <g>
      <rect width="320" height="180" fill="#1a0f30" />
      <path d="M 0 110 L 320 110 L 320 180 L 0 180 Z" fill="#2a1a42" />
      <path d="M 80 110 L 240 110 L 280 180 L 40 180 Z" fill="#3a2858" opacity="0.6" />
      <rect x="20" y="60" width="30" height="50" fill="#4a2860" stroke={I_LINE} strokeWidth="1.5" />
      <rect
        x="270"
        y="60"
        width="30"
        height="50"
        fill="#4a2860"
        stroke={I_LINE}
        strokeWidth="1.5"
      />
      <text x="35" y="55" fontSize="8" fill={accent} textAnchor="middle" fontFamily="monospace">
        A03
      </text>
      <text x="285" y="55" fontSize="8" fill={accent} textAnchor="middle" fontFamily="monospace">
        A05
      </text>
      <rect
        x="100"
        y="14"
        width="120"
        height="14"
        rx="3"
        fill="#1a0820"
        stroke={accent}
        strokeWidth="1.2"
      />
      <rect x="102" y="16" width="14" height="10" rx="2" fill={accent}>
        <animate attributeName="opacity" values="0.6;1;0.6" dur="1.4s" repeatCount="indefinite" />
      </rect>
      <text
        x="160"
        y="44"
        fontSize="8"
        fill={accent}
        textAnchor="middle"
        fontFamily="monospace"
        letterSpacing="1.5"
      >
        HAPPY 0%
      </text>
      <rect x="140" y="118" width="24" height="20" fill="#fff" stroke={I_LINE} strokeWidth="1.2" />
      <rect x="148" y="112" width="24" height="20" fill="#fff" stroke={I_LINE} strokeWidth="1.2" />
      <rect x="156" y="106" width="24" height="20" fill="#fff" stroke={I_LINE} strokeWidth="1.2" />
      <line x1="148" y1="122" x2="170" y2="122" stroke="#888" strokeWidth="0.6" />
      <line x1="148" y1="126" x2="166" y2="126" stroke="#888" strokeWidth="0.6" />
      <TinyCapi x={70} y={140} scale={0.9} outfit="medic" mood="worry" />
      <path
        d="M 78 110 Q 80 116 78 118 Q 76 116 78 110 Z"
        fill="#7cb8ff"
        stroke={I_LINE}
        strokeWidth="0.6"
      />
      <g transform="translate(220 140)">
        <circle cx="0" cy="0" r="6" fill="#d9a77a" stroke={I_LINE} strokeWidth="1" />
        <rect
          x="-6"
          y="6"
          width="12"
          height="14"
          rx="3"
          fill="#a8a8c8"
          stroke={I_LINE}
          strokeWidth="1"
        />
        <path d="M -2 -1 Q 0 1 2 -1" stroke={I_LINE} strokeWidth="0.8" fill="none" />
      </g>
      <g transform="translate(244 140)">
        <circle cx="0" cy="0" r="6" fill="#c0926a" stroke={I_LINE} strokeWidth="1" />
        <rect
          x="-6"
          y="6"
          width="12"
          height="14"
          rx="3"
          fill="#a8a8c8"
          stroke={I_LINE}
          strokeWidth="1"
        />
        <path d="M -2 -1 Q 0 1 2 -1" stroke={I_LINE} strokeWidth="0.8" fill="none" />
      </g>
    </g>
  ),

  'hospital-build': ({ accent = '#ff80c8' }) => (
    <g>
      <rect width="320" height="180" fill="#0a1438" />
      <Twinkles seed={4} count={16} color="#7cd0ff" />
      <rect
        x="60"
        y="20"
        width="200"
        height="80"
        rx="6"
        fill="#0a2050"
        stroke={accent}
        strokeWidth="1.6"
      />
      <rect x="68" y="28" width="184" height="64" fill="#031328" />
      {[10, 20, 40, 30, 60, 45, 28, 50, 38, 22].map((h, i) => (
        <rect
          key={i}
          x={80 + i * 16}
          y={88 - h}
          width="10"
          height={h}
          fill="#7cd0ff"
          opacity={0.6 + (i % 3) * 0.15}
        />
      ))}
      <path
        d="M 76 60 L 120 60 L 130 40 L 140 80 L 150 60 L 252 60"
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
      />
      <text x="248" y="36" fontSize="7" fill={accent} fontFamily="monospace">
        AI · CAPI-MD
      </text>
      <rect x="0" y="120" width="320" height="60" fill="#1a2540" />
      <rect x="0" y="118" width="320" height="4" fill="#2a3858" />
      <rect
        x="180"
        y="124"
        width="40"
        height="28"
        rx="3"
        fill="#0a1428"
        stroke={I_LINE}
        strokeWidth="1.4"
      />
      <rect x="184" y="128" width="32" height="20" fill={accent} opacity="0.3" />
      <line x1="186" y1="134" x2="214" y2="134" stroke={accent} strokeWidth="0.6" />
      <line x1="186" y1="138" x2="208" y2="138" stroke={accent} strokeWidth="0.6" />
      <line x1="186" y1="142" x2="212" y2="142" stroke={accent} strokeWidth="0.6" />
      <rect
        x="240"
        y="128"
        width="14"
        height="18"
        rx="1"
        fill="#fff"
        stroke={I_LINE}
        strokeWidth="1.2"
      />
      <ellipse cx="247" cy="128" rx="7" ry="2" fill="#5a3a20" />
      <path d="M 245 122 Q 247 116 245 112" stroke="#aaa" strokeWidth="0.8" fill="none" />
      <TinyCapi x={100} y={146} scale={1} outfit="medic" />
    </g>
  ),

  'hospital-ux': ({ accent = '#ff80c8' }) => (
    <g>
      <rect width="320" height="180" fill="#15102e" />
      <rect x="0" y="130" width="320" height="50" fill="#2a1f44" />
      <rect
        x="60"
        y="34"
        width="180"
        height="100"
        rx="4"
        fill="#1a1430"
        stroke={I_LINE}
        strokeWidth="1.6"
      />
      <rect x="68" y="42" width="164" height="84" fill="#0a0820" />
      {[44, 52, 60, 68, 76, 84, 92, 100, 108].map((y, i) => (
        <line
          key={i}
          x1={70 + (i % 3) * 4}
          y1={y}
          x2={228 - (i % 3) * 4}
          y2={y}
          stroke="#bbb"
          strokeWidth="0.6"
          opacity="0.5"
        />
      ))}
      <rect x="76" y="50" width="40" height="18" fill="#3a3050" stroke="#888" strokeWidth="0.6" />
      <rect x="118" y="50" width="40" height="18" fill="#3a3050" stroke="#888" strokeWidth="0.6" />
      <rect x="160" y="50" width="40" height="18" fill="#3a3050" stroke="#888" strokeWidth="0.6" />
      <rect x="76" y="72" width="148" height="48" fill="#1a1530" stroke="#666" strokeWidth="0.6" />
      <rect x="80" y="78" width="50" height="8" fill="#444" />
      <rect x="80" y="90" width="60" height="8" fill="#444" />
      <rect x="80" y="102" width="40" height="8" fill="#444" />
      <g transform="translate(190 24)">
        <circle r="14" fill="#fff" stroke={I_LINE} strokeWidth="1.4" />
        <text x="0" y="4" fontSize="14" textAnchor="middle" fill={I_LINE} fontWeight="bold">
          ???
        </text>
      </g>
      <g transform="translate(254 130) scale(1.15)">
        <ellipse
          cx="0"
          cy="-8"
          rx="14"
          ry="14"
          fill={I_CAPI.fur}
          stroke={I_LINE}
          strokeWidth="1.4"
        />
        <circle cx="-10" cy="-22" r="4" fill={I_CAPI.fur} stroke={I_LINE} strokeWidth="1.2" />
        <circle cx="10" cy="-22" r="4" fill={I_CAPI.fur} stroke={I_LINE} strokeWidth="1.2" />
        <ellipse cx="-4" cy="-10" rx="1.4" ry="1.8" fill={I_LINE} />
        <ellipse cx="4" cy="-10" rx="1.4" ry="1.8" fill={I_LINE} />
        <path d="M -2 -3 Q 0 -5 2 -3" stroke={I_LINE} strokeWidth="1" fill="none" />
        <path
          d="M -14 4 L -14 26 L 14 26 L 14 4 Z"
          fill="#f6f7ff"
          stroke={I_LINE}
          strokeWidth="1.4"
        />
        <line x1="0" y1="4" x2="0" y2="26" stroke={accent} strokeWidth="0.6" />
      </g>
    </g>
  ),

  'hospital-deploy': ({ accent = '#ff80c8' }) => (
    <g>
      <rect width="320" height="180" fill="#1a0f30" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${20 + i * 100} 30)`}>
          <rect width="80" height="100" rx="4" fill="#2a1a42" stroke={accent} strokeWidth="1.4" />
          <rect x="6" y="6" width="68" height="20" fill="#3a2858" />
          <text x="40" y="20" fontSize="8" fill={accent} textAnchor="middle" fontFamily="monospace">
            WARD {String.fromCharCode(65 + i)}
          </text>
          <rect
            x="16"
            y="36"
            width="48"
            height="14"
            rx="3"
            fill="#fff"
            stroke={I_LINE}
            strokeWidth="1"
          />
          <rect x="16" y="50" width="6" height="4" fill={I_LINE} />
          <rect x="58" y="50" width="6" height="4" fill={I_LINE} />
          <path
            d="M 40 78 L 32 70 Q 28 64 34 62 Q 40 62 40 68 Q 40 62 46 62 Q 52 64 48 70 Z"
            fill={i === 0 ? accent : '#664060'}
            stroke={I_LINE}
            strokeWidth="1"
          />
          {i === 0 && (
            <text x="40" y="94" fontSize="9" fill={accent} textAnchor="middle">
              {'♡ 100%'}
            </text>
          )}
          {i > 0 && (
            <text x="40" y="94" fontSize="9" fill="#888" textAnchor="middle">
              — %
            </text>
          )}
        </g>
      ))}
      <TinyCapi x={160} y={148} scale={0.9} outfit="medic" />
      <path
        d="M 160 148 Q 80 145 70 130"
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
        strokeDasharray="2 2"
      />
      <path
        d="M 160 148 Q 240 145 250 130"
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
        strokeDasharray="2 2"
      />
    </g>
  ),

  'hospital-overload': () => (
    <g>
      <rect width="320" height="180" fill="#1a0820" />
      <rect width="320" height="180" fill="#ff3050" opacity="0.08">
        <animate
          attributeName="opacity"
          values="0.05;0.18;0.05"
          dur="0.8s"
          repeatCount="indefinite"
        />
      </rect>
      <rect
        x="40"
        y="20"
        width="240"
        height="100"
        rx="6"
        fill="#0a0820"
        stroke="#ff3050"
        strokeWidth="2"
      />
      <rect x="48" y="28" width="224" height="84" fill="#1a0820" />
      <text
        x="160"
        y="60"
        fontSize="20"
        fill="#ff5566"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="3"
      >
        OVERLOAD
      </text>
      <text x="160" y="80" fontSize="9" fill="#ffd060" textAnchor="middle" fontFamily="monospace">
        HAPPY ↓ 22%
      </text>
      <path d="M 160 88 L 152 102 L 168 102 Z" fill="#ffd060" stroke={I_LINE} strokeWidth="1" />
      <text x="160" y="100" fontSize="10" fill="#1a0a00" textAnchor="middle" fontWeight="bold">
        !
      </text>
      <polyline
        points="56,108 80,90 100,98 130,84 160,96 190,82 220,100 250,108 270,108"
        stroke="#ff5566"
        strokeWidth="1.4"
        fill="none"
      />
      <rect x="0" y="130" width="320" height="50" fill="#2a1530" />
      <path
        d="M 30 140 Q 80 160 130 145 Q 180 130 230 150 Q 280 165 310 150"
        stroke="#666"
        strokeWidth="1.4"
        fill="none"
      />
      <path
        d="M 50 150 Q 100 130 150 155 Q 200 175 250 145"
        stroke="#888"
        strokeWidth="1.4"
        fill="none"
      />
      <TinyCapi x={70} y={150} scale={0.9} outfit="medic" mood="ohh" />
      <text x="70" y="115" fontSize="14" fill="#ff5566" textAnchor="middle" fontWeight="bold">
        !?
      </text>
    </g>
  ),

  /* ── RESCUE (m6) ──────────────────────────────────────────────────────── */
  'rescue-recon': ({ accent = '#ff8060' }) => (
    <g>
      <rect width="320" height="180" fill="#1a0a14" />
      <rect width="320" height="180" fill="#ff3030" opacity="0.06">
        <animate
          attributeName="opacity"
          values="0.03;0.16;0.03"
          dur="1.2s"
          repeatCount="indefinite"
        />
      </rect>
      <path
        d="M 0 130 L 40 110 L 80 125 L 120 100 L 160 130 L 200 105 L 240 130 L 280 110 L 320 130 L 320 180 L 0 180 Z"
        fill="#3a2018"
        stroke={I_LINE}
        strokeWidth="1.4"
      />
      <path d="M 0 150 L 320 150 L 320 180 L 0 180 Z" fill="#2a1410" />
      <rect
        x="60"
        y="118"
        width="80"
        height="6"
        fill="#5a3818"
        stroke={I_LINE}
        strokeWidth="1"
        transform="rotate(-12 100 121)"
      />
      <rect
        x="180"
        y="120"
        width="80"
        height="6"
        fill="#5a3818"
        stroke={I_LINE}
        strokeWidth="1"
        transform="rotate(8 220 123)"
      />
      <rect
        x="220"
        y="30"
        width="80"
        height="50"
        rx="3"
        fill="#0a0820"
        stroke={accent}
        strokeWidth="1.4"
      />
      <text x="226" y="42" fontSize="6" fill={accent} fontFamily="monospace">
        SENSORS
      </text>
      <line x1="226" y1="48" x2="294" y2="48" stroke={accent} strokeWidth="0.6" />
      <polyline
        points="226,68 240,58 256,72 270,52 290,68"
        stroke={accent}
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="290" cy="68" r="2.5" fill={accent}>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="40" r="6" fill="#ff3030">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.7s" repeatCount="indefinite" />
      </circle>
      <circle cx="160" cy="36" r="6" fill="#ffd060">
        <animate attributeName="opacity" values="0.3;1;0.3" dur="0.9s" repeatCount="indefinite" />
      </circle>
      <TinyCapi x={90} y={144} scale={0.95} outfit="rescue" />
      <path d="M 76 122 L 50 110 L 50 134 Z" fill="#ffe890" opacity="0.3" />
    </g>
  ),

  'rescue-meeting': ({ accent = '#ff8060' }) => (
    <g>
      <rect width="320" height="180" fill="#150a0a" />
      <ellipse
        cx="160"
        cy="130"
        rx="120"
        ry="32"
        fill="#3a2018"
        stroke={I_LINE}
        strokeWidth="1.6"
      />
      <ellipse cx="160" cy="125" rx="115" ry="28" fill="#5a3220" />
      <rect
        x="100"
        y="110"
        width="60"
        height="34"
        fill="#dfe8ff"
        stroke={I_LINE}
        strokeWidth="1.2"
        transform="rotate(-6 130 127)"
      />
      <line
        x1="106"
        y1="116"
        x2="156"
        y2="116"
        stroke="#3a6abf"
        strokeWidth="0.4"
        transform="rotate(-6 130 127)"
      />
      <rect
        x="170"
        y="108"
        width="50"
        height="32"
        fill="#dfe8ff"
        stroke={I_LINE}
        strokeWidth="1.2"
        transform="rotate(8 195 124)"
      />
      <circle
        cx="195"
        cy="120"
        r="6"
        fill="none"
        stroke="#3a6abf"
        strokeWidth="0.6"
        transform="rotate(8 195 124)"
      />
      <rect
        x="100"
        y="14"
        width="120"
        height="60"
        rx="3"
        fill="#0a0820"
        stroke={accent}
        strokeWidth="1.4"
      />
      <text x="160" y="32" fontSize="8" fill={accent} textAnchor="middle" fontFamily="monospace">
        DISASTER MAP
      </text>
      <path
        d="M 110 52 L 160 36 L 210 50 L 200 66 L 130 64 Z"
        fill="none"
        stroke={accent}
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      <circle cx="160" cy="56" r="2" fill="#ff3030">
        <animate attributeName="r" values="2;5;2" dur="1.2s" repeatCount="indefinite" />
      </circle>
      <TinyCapi x={50} y={148} scale={0.7} outfit="rescue" flip />
      <TinyCapi x={160} y={156} scale={0.75} outfit="rescue" />
      <TinyCapi x={270} y={148} scale={0.7} outfit="rescue" />
      <g transform="translate(160 100)">
        <rect
          x="-30"
          y="-10"
          width="60"
          height="16"
          rx="3"
          fill="#fff"
          stroke={I_LINE}
          strokeWidth="1.2"
        />
        <path d="M -4 6 L 0 10 L 4 6 Z" fill="#fff" stroke={I_LINE} strokeWidth="1.2" />
        <text x="0" y="2" textAnchor="middle" fontSize="8" fill={I_LINE} fontFamily="monospace">
          PLAN?
        </text>
      </g>
    </g>
  ),

  'rescue-smoke': ({ accent = '#ff8060' }) => (
    <g>
      <rect width="320" height="180" fill="#0f0808" />
      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={40 + i * 60}
          cy={50 + (i % 2) * 20}
          r={28 + (i % 3) * 6}
          fill="#3a3030"
          opacity="0.55"
        >
          <animate
            attributeName="cx"
            values={`${40 + i * 60};${50 + i * 60};${40 + i * 60}`}
            dur={`${5 + i}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      {Array.from({ length: 14 }).map((_, i) => (
        <circle
          key={i}
          cx={20 + i * 22}
          cy={140 - ((i * 7) % 60)}
          r="1.5"
          fill={i % 2 ? '#ffd060' : '#ff5040'}
        >
          <animate
            attributeName="cy"
            values={`${140 - ((i * 7) % 60)};${30}`}
            dur={`${3 + (i % 4)}s`}
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0"
            dur={`${3 + (i % 4)}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
      <rect x="0" y="140" width="320" height="40" fill="#2a1410" />
      <g transform="translate(180 130)">
        <rect
          x="-20"
          y="-30"
          width="40"
          height="30"
          rx="4"
          fill={accent}
          stroke={I_LINE}
          strokeWidth="1.6"
        />
        <rect x="-14" y="-24" width="12" height="10" rx="1" fill="#fff" />
        <rect x="2" y="-24" width="12" height="10" rx="1" fill="#fff" />
        <circle cx="-8" cy="-19" r="2" fill={I_LINE} />
        <circle cx="8" cy="-19" r="2" fill={I_LINE} />
        <rect x="-14" y="-8" width="28" height="6" fill={I_LINE} />
        <rect
          x="-22"
          y="0"
          width="44"
          height="10"
          rx="3"
          fill="#1a1010"
          stroke={I_LINE}
          strokeWidth="1"
        />
        <rect x="14" y="-26" width="24" height="4" fill="#666" stroke={I_LINE} strokeWidth="1" />
        <circle cx="38" cy="-24" r="3" fill={accent} stroke={I_LINE} strokeWidth="1" />
      </g>
      <g transform="translate(80 140)">
        <ellipse cx="0" cy="-4" rx="6" ry="6" fill="#d9a77a" stroke={I_LINE} strokeWidth="1.2" />
        <rect
          x="-7"
          y="0"
          width="14"
          height="14"
          rx="3"
          fill="#5a3878"
          stroke={I_LINE}
          strokeWidth="1"
        />
        <ellipse cx="-2.5" cy="-4" rx="1" ry="1.4" fill={I_LINE} />
        <ellipse cx="2.5" cy="-4" rx="1" ry="1.4" fill={I_LINE} />
        <ellipse cx="0" cy="-1" rx="1.6" ry="1" fill={I_LINE} />
        <path
          d="M -8 -8 Q -7 -4 -8 -2 Q -9 -4 -8 -8 Z"
          fill="#7cb8ff"
          stroke={I_LINE}
          strokeWidth="0.5"
        />
      </g>
    </g>
  ),

  'rescue-fail': () => (
    <g>
      <rect width="320" height="180" fill="#1a0a08" />
      <rect width="320" height="180" fill="#ff5040" opacity="0.1" />
      <rect
        x="20"
        y="20"
        width="280"
        height="100"
        rx="4"
        fill="#0a0808"
        stroke="#ff5040"
        strokeWidth="1.6"
      />
      <rect x="28" y="28" width="264" height="84" fill="#1a0808" />
      <text x="40" y="48" fontSize="9" fill="#ff8060" fontFamily="monospace">
        TEMP
      </text>
      <rect
        x="40"
        y="54"
        width="100"
        height="14"
        rx="3"
        fill="#1a0808"
        stroke="#ff8060"
        strokeWidth="1"
      />
      <rect x="42" y="56" width="92" height="10" fill="#ff5040" />
      <text x="148" y="64" fontSize="10" fill="#ff5040" fontFamily="monospace" fontWeight="bold">
        CRITICAL
      </text>
      <text x="40" y="84" fontSize="8" fill="#ffd060" fontFamily="monospace">
        ROBOT-04 · STOPPED
      </text>
      <text x="40" y="98" fontSize="8" fill="#ff5040" fontFamily="monospace">
        SIGNAL LOST · 00:42
      </text>
      <g transform="translate(250 60)">
        <circle r="22" fill="none" stroke="#ff5040" strokeWidth="1.4" />
        <line x1="0" y1="0" x2="0" y2="-16" stroke="#ff5040" strokeWidth="1.6" />
        <line x1="0" y1="0" x2="10" y2="6" stroke="#ff5040" strokeWidth="1.2" />
        <text x="0" y="36" fontSize="8" fill="#ff5040" textAnchor="middle" fontFamily="monospace">
          00:42
        </text>
      </g>
      <rect x="0" y="130" width="320" height="50" fill="#2a1812" />
      <TinyCapi x={70} y={148} scale={0.9} outfit="rescue" mood="worry" />
      <TinyCapi x={250} y={148} scale={0.9} outfit="rescue" mood="ohh" flip />
    </g>
  ),

  'rescue-countdown': ({ accent = '#ff8060' }) => (
    <g>
      <rect width="320" height="180" fill="#0a0810" />
      <circle cx="160" cy="90" r="110" fill="url(#rscX)" />
      <defs>
        <radialGradient id="rscX">
          <stop offset="0%" stopColor="#ff5040" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>
      <text
        x="160"
        y="80"
        fontSize="56"
        fill="#ff5040"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="bold"
        letterSpacing="2"
      >
        00:09
        <animate attributeName="opacity" values="1;0.4;1" dur="0.8s" repeatCount="indefinite" />
      </text>
      <text
        x="160"
        y="100"
        fontSize="9"
        fill="#ffd060"
        textAnchor="middle"
        fontFamily="monospace"
        letterSpacing="3"
      >
        FINAL DECISION
      </text>
      {[60, 110, 160, 210, 260].map((x, i) => (
        <g key={i} transform={`translate(${x} 134)`}>
          <rect
            x="-10"
            y="-10"
            width="20"
            height="20"
            rx="3"
            fill={i === 2 ? '#ff5040' : accent}
            stroke={I_LINE}
            strokeWidth="1"
          />
          <rect x="-6" y="-6" width="12" height="6" fill={I_LINE} />
          <circle cx="-2" cy="-3" r="1" fill={i === 2 ? '#ffd060' : '#fff'} />
          <circle cx="2" cy="-3" r="1" fill={i === 2 ? '#ffd060' : '#fff'} />
          {i === 2 && (
            <text x="0" y="-16" fontSize="10" fill="#ff5040" textAnchor="middle" fontWeight="bold">
              !
            </text>
          )}
        </g>
      ))}
      <TinyCapi x={160} y={166} scale={0.7} outfit="rescue" mood="ohh" />
    </g>
  ),

  /* ── SMART HOME (m3) ──────────────────────────────────────────────────── */
  'home-recon': ({ accent = '#b46cff' }) => (
    <g>
      <rect width="320" height="180" fill="#1a1230" />
      <rect
        x="40"
        y="40"
        width="240"
        height="120"
        fill="#2a1f48"
        stroke={I_LINE}
        strokeWidth="1.6"
      />
      <path d="M 40 40 L 160 10 L 280 40 Z" fill="#3a2660" stroke={I_LINE} strokeWidth="1.6" />
      <line x1="160" y1="40" x2="160" y2="160" stroke={I_LINE} strokeWidth="1.4" />
      <line x1="40" y1="100" x2="280" y2="100" stroke={I_LINE} strokeWidth="1.4" />
      <rect x="60" y="76" width="40" height="20" fill="#5a4a78" stroke={I_LINE} strokeWidth="1" />
      <rect x="110" y="80" width="20" height="16" fill="#5a4a78" stroke={I_LINE} strokeWidth="1" />
      <rect
        x="110"
        y="60"
        width="40"
        height="14"
        rx="1"
        fill="#0a0820"
        stroke={I_LINE}
        strokeWidth="1"
      />
      <rect x="114" y="63" width="32" height="8" fill={accent} opacity="0.5" />
      <rect x="180" y="76" width="80" height="14" fill="#5a4a78" stroke={I_LINE} strokeWidth="1" />
      <rect x="184" y="60" width="14" height="14" fill="#aaa" stroke={I_LINE} strokeWidth="1" />
      <rect x="200" y="60" width="14" height="14" fill="#aaa" stroke={I_LINE} strokeWidth="1" />
      <rect
        x="56"
        y="124"
        width="60"
        height="20"
        rx="2"
        fill="#fff"
        stroke={I_LINE}
        strokeWidth="1.2"
      />
      <rect x="56" y="124" width="20" height="20" fill="#dde" stroke={I_LINE} strokeWidth="1" />
      <circle cx="220" cy="134" r="10" fill="#7cd0ff" stroke={I_LINE} strokeWidth="1.2" />
      <rect x="240" y="124" width="14" height="20" fill="#aaa" stroke={I_LINE} strokeWidth="1" />
      <g transform="translate(82 92)">
        <circle cx="0" cy="0" r="3" fill="#d9a77a" stroke={I_LINE} strokeWidth="0.6" />
        <rect
          x="-3"
          y="3"
          width="6"
          height="6"
          rx="1"
          fill="#a880d0"
          stroke={I_LINE}
          strokeWidth="0.6"
        />
      </g>
      <g transform="translate(120 90)">
        <circle cx="0" cy="0" r="3" fill="#c0926a" stroke={I_LINE} strokeWidth="0.6" />
        <rect
          x="-3"
          y="3"
          width="6"
          height="6"
          rx="1"
          fill="#80c0d0"
          stroke={I_LINE}
          strokeWidth="0.6"
        />
      </g>
      <g transform="translate(220 88)">
        <circle cx="0" cy="0" r="3" fill="#a87850" stroke={I_LINE} strokeWidth="0.6" />
        <rect
          x="-3"
          y="3"
          width="6"
          height="6"
          rx="1"
          fill="#d09080"
          stroke={I_LINE}
          strokeWidth="0.6"
        />
      </g>
      <TinyCapi x={300} y={150} scale={0.7} outfit="intern" flip />
      <rect x="296" y="138" width="10" height="12" fill="#fff" stroke={I_LINE} strokeWidth="0.6" />
      <circle cx="80" cy="76" r="2" fill={accent}>
        <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="56" r="2" fill={accent}>
        <animate attributeName="r" values="2;5;2" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="240" cy="100" r="2" fill={accent}>
        <animate attributeName="r" values="2;5;2" dur="1.7s" repeatCount="indefinite" />
      </circle>
    </g>
  ),

  'home-meeting': () => (
    <g>
      <rect width="320" height="180" fill="#161028" />
      <rect
        x="20"
        y="20"
        width="200"
        height="120"
        rx="3"
        fill="#fff"
        stroke={I_LINE}
        strokeWidth="1.6"
      />
      <rect x="20" y="20" width="200" height="14" fill="#e0d8e8" stroke={I_LINE} strokeWidth="1" />
      <rect
        x="34"
        y="44"
        width="30"
        height="22"
        fill="#ffd060"
        stroke={I_LINE}
        strokeWidth="0.6"
        transform="rotate(-3 49 55)"
      />
      <rect
        x="74"
        y="48"
        width="30"
        height="22"
        fill="#7cd0ff"
        stroke={I_LINE}
        strokeWidth="0.6"
        transform="rotate(2 89 59)"
      />
      <rect
        x="114"
        y="44"
        width="30"
        height="22"
        fill="#ff80c0"
        stroke={I_LINE}
        strokeWidth="0.6"
        transform="rotate(-1 129 55)"
      />
      <rect
        x="154"
        y="50"
        width="30"
        height="22"
        fill="#80e0a0"
        stroke={I_LINE}
        strokeWidth="0.6"
        transform="rotate(4 169 61)"
      />
      <path d="M 50 78 Q 70 90 90 80" stroke={I_LINE} strokeWidth="1" fill="none" />
      <path d="M 100 80 L 130 90" stroke={I_LINE} strokeWidth="1" fill="none" />
      <text x="60" y="118" fontSize="10" fill={I_LINE} fontFamily="monospace">
        USER FLOW?
      </text>
      <rect x="0" y="150" width="320" height="30" fill="#2a1f44" />
      <rect x="0" y="146" width="320" height="6" fill="#3a2858" />
      <TinyCapi x={250} y={152} scale={0.75} outfit="intern" />
      <TinyCapi x={290} y={156} scale={0.65} outfit="intern" flip />
    </g>
  ),

  'home-elder': () => (
    <g>
      <rect width="320" height="180" fill="#1a1230" />
      <g transform="translate(180 100)">
        <rect
          x="-30"
          y="-50"
          width="60"
          height="100"
          rx="8"
          fill="#1a0a30"
          stroke={I_LINE}
          strokeWidth="1.6"
        />
        <rect x="-25" y="-42" width="50" height="80" rx="2" fill="#0a0820" />
        <rect
          x="-22"
          y="-38"
          width="22"
          height="14"
          fill="#3a2c50"
          stroke="#666"
          strokeWidth="0.4"
        />
        <rect x="2" y="-38" width="22" height="14" fill="#3a2c50" stroke="#666" strokeWidth="0.4" />
        <rect x="-22" y="-22" width="46" height="10" fill="#666" />
        <rect x="-22" y="-8" width="46" height="10" fill="#666" />
        <rect x="-22" y="6" width="46" height="10" fill="#666" />
        <rect
          x="-22"
          y="20"
          width="22"
          height="14"
          fill="#3a2c50"
          stroke="#666"
          strokeWidth="0.4"
        />
        <rect x="2" y="20" width="22" height="14" fill="#3a2c50" stroke="#666" strokeWidth="0.4" />
      </g>
      <g transform="translate(80 90)">
        <ellipse cx="0" cy="0" rx="32" ry="34" fill="#c8a890" stroke={I_LINE} strokeWidth="1.6" />
        <path
          d="M -18 -28 Q -16 -36 -10 -36"
          stroke="#cfd2d8"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 14 -28 Q 16 -36 20 -36"
          stroke="#cfd2d8"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="-9" cy="-2" r="6" fill="none" stroke={I_LINE} strokeWidth="1.4" />
        <circle cx="9" cy="-2" r="6" fill="none" stroke={I_LINE} strokeWidth="1.4" />
        <line x1="-3" y1="-2" x2="3" y2="-2" stroke={I_LINE} strokeWidth="1.4" />
        <circle cx="-9" cy="-2" r="1.4" fill={I_LINE} />
        <circle cx="9" cy="-2" r="1.4" fill={I_LINE} />
        <path d="M -4 12 Q 0 8 4 12" stroke={I_LINE} strokeWidth="1.4" fill="none" />
        <path
          d="M -10 -50 Q -6 -56 -2 -50 T 6 -50"
          stroke="#ffd060"
          strokeWidth="1.4"
          fill="none"
        />
        <path d="M 6 -56 Q 8 -62 12 -56 T 20 -56" stroke="#ffd060" strokeWidth="1.4" fill="none" />
      </g>
      <TinyCapi x={250} y={148} scale={0.85} outfit="intern" />
    </g>
  ),

  'home-demo': () => (
    <g>
      <rect width="320" height="180" fill="#181028" />
      <rect x="0" y="120" width="320" height="60" fill="#2a1f44" />
      <rect x="0" y="116" width="320" height="6" fill="#3a2858" />
      <rect
        x="80"
        y="20"
        width="160"
        height="80"
        rx="4"
        fill="#0a0820"
        stroke={I_LINE}
        strokeWidth="1.6"
      />
      <rect x="86" y="26" width="148" height="68" fill="#1a0820" />
      <text
        x="160"
        y="64"
        fontSize="14"
        fill="#ff5566"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="bold"
      >
        SYSTEM ERROR
      </text>
      <rect x="86" y="74" width="40" height="8" fill="#ff5566" opacity="0.6">
        <animate attributeName="opacity" values="0.3;0.9;0.3" dur="0.4s" repeatCount="indefinite" />
      </rect>
      <rect x="160" y="40" width="60" height="6" fill="#7cd0ff" opacity="0.6">
        <animate attributeName="x" values="160;100;160" dur="0.4s" repeatCount="indefinite" />
      </rect>
      <rect
        x="50"
        y="130"
        width="220"
        height="30"
        rx="6"
        fill="#5a4a78"
        stroke={I_LINE}
        strokeWidth="1.4"
      />
      <g transform="translate(90 134)">
        <circle cx="0" cy="0" r="6" fill="#d9a77a" stroke={I_LINE} strokeWidth="1" />
        <path d="M -2 1 Q 0 -1 2 1" stroke={I_LINE} strokeWidth="0.8" fill="none" />
        <ellipse cx="-2" cy="-1" rx="0.8" ry="1" fill={I_LINE} />
        <ellipse cx="2" cy="-1" rx="0.8" ry="1" fill={I_LINE} />
      </g>
      <g transform="translate(160 134)">
        <circle cx="0" cy="0" r="7" fill="#c0926a" stroke={I_LINE} strokeWidth="1" />
        <path d="M -3 2 Q 0 -1 3 2" stroke={I_LINE} strokeWidth="0.8" fill="none" />
        <ellipse cx="-2.5" cy="-1.5" rx="0.8" ry="1" fill={I_LINE} />
        <ellipse cx="2.5" cy="-1.5" rx="0.8" ry="1" fill={I_LINE} />
      </g>
      <g transform="translate(220 134)">
        <circle cx="0" cy="0" r="6" fill="#a87850" stroke={I_LINE} strokeWidth="1" />
        <path d="M -2 2 Q 0 -1 2 2" stroke={I_LINE} strokeWidth="0.8" fill="none" />
        <ellipse cx="-2" cy="-1" rx="0.8" ry="1" fill={I_LINE} />
        <ellipse cx="2" cy="-1" rx="0.8" ry="1" fill={I_LINE} />
      </g>
      <TinyCapi x={290} y={152} scale={0.7} outfit="intern" mood="ohh" flip />
      <path
        d="M 282 132 Q 280 138 282 140 Q 284 138 282 132 Z"
        fill="#7cb8ff"
        stroke={I_LINE}
        strokeWidth="0.6"
      />
    </g>
  ),

  'home-overload': ({ accent = '#b46cff' }) => (
    <g>
      <rect width="320" height="180" fill="#180a30" />
      <rect
        x="20"
        y="20"
        width="280"
        height="100"
        rx="4"
        fill="#0a0820"
        stroke={accent}
        strokeWidth="1.6"
      />
      <text x="32" y="40" fontSize="8" fill={accent} fontFamily="monospace">
        CPU
      </text>
      <rect
        x="60"
        y="32"
        width="220"
        height="10"
        rx="2"
        fill="#1a0820"
        stroke="#666"
        strokeWidth="0.6"
      />
      <rect x="60" y="32" width="200" height="10" rx="2" fill="#ff5566">
        <animate
          attributeName="width"
          values="180;210;195;215"
          dur="1.6s"
          repeatCount="indefinite"
        />
      </rect>
      <text x="32" y="58" fontSize="8" fill={accent} fontFamily="monospace">
        MEM
      </text>
      <rect
        x="60"
        y="50"
        width="220"
        height="10"
        rx="2"
        fill="#1a0820"
        stroke="#666"
        strokeWidth="0.6"
      />
      <rect x="60" y="50" width="190" height="10" rx="2" fill="#ffd060" />
      <text x="32" y="76" fontSize="8" fill={accent} fontFamily="monospace">
        NET
      </text>
      <rect
        x="60"
        y="68"
        width="220"
        height="10"
        rx="2"
        fill="#1a0820"
        stroke="#666"
        strokeWidth="0.6"
      />
      <rect x="60" y="68" width="170" height="10" rx="2" fill={accent} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i} transform={`translate(${40 + (i % 3) * 80} ${92})`}>
          <rect width="50" height="20" rx="3" fill="#2a1844" stroke={accent} strokeWidth="0.8" />
          <circle cx="8" cy="10" r="3" fill={i % 2 ? '#ff5566' : accent}>
            <animate
              attributeName="opacity"
              values="0.4;1;0.4"
              dur={`${1 + (i % 3) * 0.3}s`}
              repeatCount="indefinite"
            />
          </circle>
          <text x="30" y="13" fontSize="6" fill="#ccc" fontFamily="monospace">
            D-{i}
          </text>
        </g>
      ))}
      <rect x="0" y="130" width="320" height="50" fill="#2a1844" />
      <TinyCapi x={70} y={148} scale={0.85} outfit="intern" mood="worry" />
    </g>
  ),

  /* ── WAREHOUSE (m4) ───────────────────────────────────────────────────── */
  'warehouse-recon': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#0a1232" />
      <rect x="0" y="130" width="320" height="50" fill="#162042" />
      <rect x="0" y="126" width="320" height="6" fill="#1f2c54" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${30 + i * 70} 30)`}>
          <rect width="50" height="100" fill="#2a3258" stroke={I_LINE} strokeWidth="1.4" />
          {[0, 1, 2, 3].map((j) => (
            <line
              key={j}
              x1="0"
              y1={20 + j * 20}
              x2="50"
              y2={20 + j * 20}
              stroke={I_LINE}
              strokeWidth="1"
            />
          ))}
          {[0, 1, 2].map((j) => (
            <rect
              key={j}
              x={4 + (j % 2) * 24}
              y={4 + j * 20}
              width="20"
              height="14"
              rx="1"
              fill={['#ff8060', '#ffd060', '#80e0a0', '#7cd0ff'][(i + j) % 4]}
              stroke={I_LINE}
              strokeWidth="0.6"
            />
          ))}
        </g>
      ))}
      <g transform="translate(160 142)">
        <rect
          x="-22"
          y="-10"
          width="44"
          height="14"
          rx="2"
          fill="#3a4878"
          stroke={I_LINE}
          strokeWidth="1.4"
        />
        <rect x="-18" y="-18" width="36" height="8" fill={accent} stroke={I_LINE} strokeWidth="1" />
        <circle cx="-14" cy="6" r="4" fill={I_LINE} />
        <circle cx="14" cy="6" r="4" fill={I_LINE} />
        <circle cx="0" cy="-14" r="2" fill={accent}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1s" repeatCount="indefinite" />
        </circle>
        <line
          x1="22"
          y1="-4"
          x2="34"
          y2="-4"
          stroke={accent}
          strokeWidth="1"
          strokeDasharray="2 2"
        />
      </g>
      <rect x="0" y="158" width="320" height="6" fill="#666" stroke={I_LINE} strokeWidth="1" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={20 + i * 50} y="156" width="6" height="2" fill={I_LINE}>
          <animate
            attributeName="x"
            values={`${20 + i * 50};${320 + i * 50}`}
            dur="6s"
            repeatCount="indefinite"
          />
        </rect>
      ))}
      <TinyCapi x={290} y={148} scale={0.75} outfit="intern" flip />
    </g>
  ),

  'warehouse-build': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#0e1538" />
      <rect
        x="20"
        y="20"
        width="280"
        height="120"
        rx="4"
        fill="#fff"
        stroke={I_LINE}
        strokeWidth="1.6"
      />
      <rect x="20" y="20" width="280" height="14" fill="#3a4878" />
      <text
        x="160"
        y="30"
        fontSize="8"
        fill="#fff"
        textAnchor="middle"
        fontFamily="monospace"
        letterSpacing="2"
      >
        WAREHOUSE LAYOUT
      </text>
      {Array.from({ length: 14 }).map((_, i) => (
        <line
          key={`h${i}`}
          x1="20"
          y1={40 + i * 8}
          x2="300"
          y2={40 + i * 8}
          stroke="#cfd6e8"
          strokeWidth="0.4"
        />
      ))}
      {Array.from({ length: 36 }).map((_, i) => (
        <line
          key={`v${i}`}
          x1={20 + i * 8}
          y1="34"
          x2={20 + i * 8}
          y2="140"
          stroke="#cfd6e8"
          strokeWidth="0.4"
        />
      ))}
      {[40, 80, 120, 160, 200, 240].map((x, i) => (
        <rect
          key={i}
          x={x}
          y="50"
          width="20"
          height="60"
          fill="#a8b8d8"
          stroke={I_LINE}
          strokeWidth="1"
        />
      ))}
      <path
        d="M 30 130 L 65 130 L 65 100 L 105 100 L 105 60 L 175 60 L 175 130 L 250 130"
        stroke={accent}
        strokeWidth="2"
        fill="none"
        strokeDasharray="3 3"
      />
      <circle cx="30" cy="130" r="3" fill="#3ddc84" stroke={I_LINE} strokeWidth="0.6" />
      <circle cx="250" cy="130" r="3" fill="#ff5566" stroke={I_LINE} strokeWidth="0.6" />
      <text x="34" y="145" fontSize="6" fill="#3a4878" fontFamily="monospace">
        START
      </text>
      <text x="234" y="145" fontSize="6" fill="#3a4878" fontFamily="monospace">
        END
      </text>
      <rect x="0" y="146" width="320" height="34" fill="#1f2c54" />
      <TinyCapi x={70} y={166} scale={0.7} outfit="intern" />
      <TinyCapi x={250} y={170} scale={0.7} outfit="intern" flip />
    </g>
  ),

  'warehouse-debate': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#0e1538" />
      <g transform="translate(50 30)">
        <rect width="100" height="110" rx="4" fill="#1a2244" stroke={accent} strokeWidth="1.6" />
        <text
          x="50"
          y="20"
          fontSize="9"
          fill={accent}
          textAnchor="middle"
          fontFamily="monospace"
          letterSpacing="2"
        >
          PLAN A
        </text>
        <line x1="6" y1="26" x2="94" y2="26" stroke={accent} strokeWidth="0.6" />
        <rect
          x="20"
          y="36"
          width="60"
          height="40"
          rx="2"
          fill="#2a3258"
          stroke="#aaa"
          strokeWidth="0.6"
        />
        <circle cx="50" cy="56" r="6" fill={accent} />
        {[0, 60, 120, 180, 240, 300].map((a) => (
          <line
            key={a}
            x1="50"
            y1="56"
            x2={50 + Math.cos((a * Math.PI) / 180) * 14}
            y2={56 + Math.sin((a * Math.PI) / 180) * 14}
            stroke="#aaa"
            strokeWidth="0.8"
          />
        ))}
        <text x="50" y="92" fontSize="7" fill="#ddd" textAnchor="middle">
          CENTRAL
        </text>
      </g>
      <g transform="translate(170 30)">
        <rect width="100" height="110" rx="4" fill="#1a2244" stroke="#ffd060" strokeWidth="1.6" />
        <text
          x="50"
          y="20"
          fontSize="9"
          fill="#ffd060"
          textAnchor="middle"
          fontFamily="monospace"
          letterSpacing="2"
        >
          PLAN B
        </text>
        <line x1="6" y1="26" x2="94" y2="26" stroke="#ffd060" strokeWidth="0.6" />
        <rect
          x="20"
          y="36"
          width="60"
          height="40"
          rx="2"
          fill="#2a3258"
          stroke="#aaa"
          strokeWidth="0.6"
        />
        {[
          [28, 44],
          [50, 40],
          [72, 48],
          [34, 60],
          [56, 56],
          [70, 64],
        ].map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#ffd060" />
        ))}
        <line x1="28" y1="44" x2="50" y2="40" stroke="#aaa" strokeWidth="0.6" />
        <line x1="50" y1="40" x2="72" y2="48" stroke="#aaa" strokeWidth="0.6" />
        <line x1="34" y1="60" x2="56" y2="56" stroke="#aaa" strokeWidth="0.6" />
        <line x1="56" y1="56" x2="70" y2="64" stroke="#aaa" strokeWidth="0.6" />
        <line x1="50" y1="40" x2="56" y2="56" stroke="#aaa" strokeWidth="0.6" />
        <text x="50" y="92" fontSize="7" fill="#ddd" textAnchor="middle">
          MESH
        </text>
      </g>
      <text
        x="160"
        y="92"
        fontSize="20"
        fill="#fff"
        textAnchor="middle"
        fontFamily="monospace"
        fontWeight="bold"
      >
        vs
      </text>
      <rect x="0" y="148" width="320" height="32" fill="#1f2c54" />
      <TinyCapi x={70} y={168} scale={0.7} outfit="intern" />
      <TinyCapi x={250} y={168} scale={0.7} outfit="intern" flip />
    </g>
  ),

  'warehouse-collide': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#0e1538" />
      <rect x="0" y="100" width="320" height="80" fill="#1c2548" />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1={(i + 1) * 40}
          y1="100"
          x2={(i + 1) * 40}
          y2="180"
          stroke="#2a3258"
          strokeWidth="0.6"
        />
      ))}
      <line x1="0" y1="140" x2="320" y2="140" stroke="#2a3258" strokeWidth="0.6" />
      <g transform="translate(140 130)">
        <rect
          x="-14"
          y="-10"
          width="28"
          height="20"
          rx="3"
          fill={accent}
          stroke={I_LINE}
          strokeWidth="1.4"
        />
        <rect x="-10" y="-6" width="20" height="6" fill={I_LINE} />
      </g>
      <g transform="translate(174 134)">
        <rect
          x="-14"
          y="-10"
          width="28"
          height="20"
          rx="3"
          fill="#ffd060"
          stroke={I_LINE}
          strokeWidth="1.4"
        />
        <rect x="-10" y="-6" width="20" height="6" fill={I_LINE} />
      </g>
      <g transform="translate(160 130)">
        <path
          d="M -10 -10 L 10 10 M -10 10 L 10 -10 M 0 -14 L 0 14 M -14 0 L 14 0"
          stroke="#ff5566"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <animate attributeName="opacity" values="0.6;1;0.6" dur="0.4s" repeatCount="indefinite" />
        </path>
      </g>
      <g transform="translate(160 60)">
        <path d="M 0 -14 L 14 14 L -14 14 Z" fill="#ffd060" stroke={I_LINE} strokeWidth="1.6" />
        <text x="0" y="10" fontSize="14" fill="#1a0a00" textAnchor="middle" fontWeight="bold">
          !
        </text>
      </g>
      <rect
        x="40"
        y="116"
        width="20"
        height="14"
        rx="2"
        fill="#aaa"
        stroke={I_LINE}
        strokeWidth="1"
        opacity="0.6"
      />
      <rect
        x="260"
        y="146"
        width="20"
        height="14"
        rx="2"
        fill="#aaa"
        stroke={I_LINE}
        strokeWidth="1"
        opacity="0.6"
      />
    </g>
  ),

  'warehouse-people': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#0e1538" />
      <rect x="0" y="130" width="320" height="50" fill="#1c2548" />
      <rect x="0" y="126" width="320" height="6" fill="#2a3258" />
      <g transform="translate(80 110)">
        <ellipse
          cx="0"
          cy="-2"
          rx="22"
          ry="22"
          fill={I_CAPI.fur}
          stroke={I_LINE}
          strokeWidth="1.6"
        />
        <circle cx="-12" cy="-18" r="4" fill={I_CAPI.fur} stroke={I_LINE} strokeWidth="1.2" />
        <circle cx="12" cy="-18" r="4" fill={I_CAPI.fur} stroke={I_LINE} strokeWidth="1.2" />
        <ellipse cx="-5" cy="-4" rx="1.4" ry="2" fill={I_LINE} />
        <ellipse cx="5" cy="-4" rx="1.4" ry="2" fill={I_LINE} />
        <path d="M -3 6 Q 0 4 3 6" stroke={I_LINE} strokeWidth="1" fill="none" />
        <path
          d="M -22 14 L -22 36 L 22 36 L 22 14 Z"
          fill="#ffd060"
          stroke={I_LINE}
          strokeWidth="1.4"
        />
        <line x1="-12" y1="14" x2="-12" y2="36" stroke="#fff" strokeWidth="1" />
        <line x1="12" y1="14" x2="12" y2="36" stroke="#fff" strokeWidth="1" />
        <path
          d="M -16 -18 Q -14 -14 -16 -12 Q -18 -14 -16 -18 Z"
          fill="#7cb8ff"
          stroke={I_LINE}
          strokeWidth="0.6"
        />
      </g>
      <g transform="translate(140 70)">
        <rect
          x="0"
          y="0"
          width="120"
          height="40"
          rx="4"
          fill="#fff"
          stroke={I_LINE}
          strokeWidth="1.4"
        />
        <path d="M 4 32 L -4 42 L 16 36 Z" fill="#fff" stroke={I_LINE} strokeWidth="1.4" />
        <text x="60" y="18" fontSize="9" fill={I_LINE} textAnchor="middle" fontFamily="monospace">
          Mất việc?
        </text>
        <text x="60" y="32" fontSize="9" fill={I_LINE} textAnchor="middle" fontFamily="monospace">
          Robot thay tôi?
        </text>
      </g>
      <g transform="translate(260 120)">
        <rect
          x="-22"
          y="-30"
          width="44"
          height="40"
          rx="3"
          fill={accent}
          stroke={I_LINE}
          strokeWidth="1.6"
        />
        <rect x="-16" y="-22" width="32" height="10" rx="1" fill={I_LINE} />
        <circle cx="-8" cy="-17" r="2" fill="#fff" />
        <circle cx="8" cy="-17" r="2" fill="#fff" />
        <rect x="-14" y="-6" width="28" height="6" fill={I_LINE} />
      </g>
      <TinyCapi x={170} y={156} scale={0.75} outfit="intern" />
    </g>
  ),

  /* ── DRONE (m5) ───────────────────────────────────────────────────────── */
  'drone-recon': () => (
    <g>
      <rect width="320" height="180" fill="#0a1830" />
      <rect
        x="20"
        y="20"
        width="280"
        height="140"
        fill="#dfe8ff"
        stroke={I_LINE}
        strokeWidth="1.6"
      />
      <path
        d="M 30 60 Q 80 40 130 60 Q 180 80 220 60 Q 260 40 290 70 L 290 140 Q 260 130 220 140 Q 180 150 140 138 Q 90 130 30 140 Z"
        fill="#9fbf7f"
        stroke="#3a5a3a"
        strokeWidth="1.2"
      />
      <path
        d="M 30 110 Q 80 100 140 115 Q 200 130 290 110"
        stroke="#7cb8ff"
        strokeWidth="3"
        fill="none"
      />
      <path
        d="M 60 30 L 80 80 L 130 100 L 200 110 L 250 80"
        stroke="#fff"
        strokeWidth="1"
        strokeDasharray="2 2"
        fill="none"
      />
      {[
        [60, 60],
        [180, 50],
        [240, 130],
        [100, 130],
      ].map((p, i) => (
        <g key={i} transform={`translate(${p[0]} ${p[1]})`}>
          <path
            d="M 0 0 L -5 -10 Q 0 -16 5 -10 Z"
            fill="#ff5566"
            stroke={I_LINE}
            strokeWidth="0.8"
          />
          <circle cx="0" cy="-10" r="2" fill="#fff" />
        </g>
      ))}
      <g transform="translate(286 36)">
        <circle r="10" fill="#fff" stroke={I_LINE} strokeWidth="1" />
        <path d="M 0 -8 L 4 0 L 0 8 L -4 0 Z" fill="#3a5a3a" />
        <text x="0" y="-12" fontSize="6" fill={I_LINE} textAnchor="middle">
          N
        </text>
      </g>
      <TinyCapi x={290} y={150} scale={0.7} outfit="intern" flip />
    </g>
  ),

  'drone-build': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#0a1830" />
      <Twinkles seed={5} count={14} color={accent} />
      <rect x="0" y="120" width="320" height="60" fill="#1c2548" />
      <rect x="0" y="116" width="320" height="6" fill="#2a3258" />
      <g transform="translate(160 80)">
        <line x1="-50" y1="-30" x2="-20" y2="0" stroke={I_LINE} strokeWidth="3" />
        <line x1="50" y1="-30" x2="20" y2="0" stroke={I_LINE} strokeWidth="3" />
        <line x1="-50" y1="30" x2="-20" y2="0" stroke={I_LINE} strokeWidth="3" />
        <line x1="50" y1="30" x2="20" y2="0" stroke={I_LINE} strokeWidth="3" />
        {[
          [-50, -30],
          [50, -30],
          [-50, 30],
          [50, 30],
        ].map(([px, py], i) => (
          <g key={i} transform={`translate(${px} ${py})`}>
            <ellipse cx="0" cy="0" rx="14" ry="2.5" fill="#aaa" stroke={I_LINE} strokeWidth="0.8">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="0.4s"
                repeatCount="indefinite"
              />
            </ellipse>
            <circle cx="0" cy="0" r="3" fill="#666" stroke={I_LINE} strokeWidth="0.8" />
          </g>
        ))}
        <rect
          x="-20"
          y="-10"
          width="40"
          height="20"
          rx="4"
          fill={accent}
          stroke={I_LINE}
          strokeWidth="1.6"
        />
        <circle cx="0" cy="0" r="6" fill="#0a0820" stroke={I_LINE} strokeWidth="1" />
        <circle cx="0" cy="0" r="3" fill="#fff" />
        <rect
          x="-10"
          y="14"
          width="20"
          height="14"
          rx="2"
          fill="#a87850"
          stroke={I_LINE}
          strokeWidth="1.2"
        />
        <line x1="-10" y1="20" x2="10" y2="20" stroke={I_LINE} strokeWidth="0.8" />
        <line x1="0" y1="14" x2="0" y2="28" stroke={I_LINE} strokeWidth="0.8" />
      </g>
      <rect
        x="40"
        y="138"
        width="20"
        height="20"
        rx="3"
        fill="#aaa"
        stroke={I_LINE}
        strokeWidth="1"
      />
      <circle cx="60" cy="160" r="6" fill="#666" stroke={I_LINE} strokeWidth="1" />
      <rect
        x="240"
        y="142"
        width="36"
        height="14"
        rx="2"
        fill="#0f4030"
        stroke={I_LINE}
        strokeWidth="1"
      />
      <circle cx="248" cy="149" r="1.5" fill={accent} />
      <circle cx="256" cy="149" r="1.5" fill="#ffd060" />
      <TinyCapi x={90} y={158} scale={0.85} outfit="intern" />
    </g>
  ),

  'drone-wind': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#1a2042" />
      <ellipse cx="60" cy="40" rx="30" ry="10" fill="#3a4878" />
      <ellipse cx="220" cy="30" rx="40" ry="12" fill="#3a4878" />
      {[40, 70, 100, 130, 160].map((y) => (
        <path
          key={y}
          d={`M 0 ${y} Q 80 ${y - 10} 160 ${y} T 320 ${y - 6}`}
          stroke="#dde6ff"
          strokeWidth="1.4"
          fill="none"
          opacity="0.6"
        >
          <animate
            attributeName="d"
            values={`M 0 ${y} Q 80 ${y - 10} 160 ${y} T 320 ${y - 6};M 0 ${y} Q 80 ${y - 4} 160 ${
              y - 8
            } T 320 ${y};M 0 ${y} Q 80 ${y - 10} 160 ${y} T 320 ${y - 6}`}
            dur="2s"
            repeatCount="indefinite"
          />
        </path>
      ))}
      <g transform="translate(180 90) rotate(15)">
        <line x1="-30" y1="-18" x2="-12" y2="0" stroke={I_LINE} strokeWidth="2.4" />
        <line x1="30" y1="-18" x2="12" y2="0" stroke={I_LINE} strokeWidth="2.4" />
        <line x1="-30" y1="18" x2="-12" y2="0" stroke={I_LINE} strokeWidth="2.4" />
        <line x1="30" y1="18" x2="12" y2="0" stroke={I_LINE} strokeWidth="2.4" />
        {[
          [-30, -18],
          [30, -18],
          [-30, 18],
          [30, 18],
        ].map(([px, py], i) => (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx="10"
            ry="2"
            fill="#aaa"
            stroke={I_LINE}
            strokeWidth="0.6"
          />
        ))}
        <rect
          x="-12"
          y="-6"
          width="24"
          height="12"
          rx="3"
          fill={accent}
          stroke={I_LINE}
          strokeWidth="1.4"
        />
      </g>
      <g transform="translate(60 90)">
        <line x1="0" y1="0" x2="40" y2="0" stroke="#ff5566" strokeWidth="2" />
        <path d="M 40 0 L 32 -6 L 32 6 Z" fill="#ff5566" />
        <text x="20" y="-8" fontSize="8" fill="#ff5566" textAnchor="middle" fontFamily="monospace">
          WIND
        </text>
      </g>
      <path d="M 0 150 Q 80 140 160 150 T 320 145 L 320 180 L 0 180 Z" fill="#3a5a3a" />
    </g>
  ),

  'drone-privacy': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#0a1830" />
      <path
        d="M 0 140 L 30 120 L 80 140 L 130 110 L 180 140 L 240 120 L 290 140 L 320 130 L 320 180 L 0 180 Z"
        fill="#3a3050"
        stroke={I_LINE}
        strokeWidth="1.2"
      />
      <rect x="60" y="124" width="40" height="16" fill="#5a4a6a" stroke={I_LINE} strokeWidth="1" />
      <rect x="160" y="124" width="40" height="16" fill="#5a4a6a" stroke={I_LINE} strokeWidth="1" />
      <rect x="0" y="160" width="320" height="20" fill="#2a1f44" />
      <g transform="translate(160 60)">
        <line x1="-18" y1="-10" x2="-6" y2="0" stroke={I_LINE} strokeWidth="2" />
        <line x1="18" y1="-10" x2="6" y2="0" stroke={I_LINE} strokeWidth="2" />
        <line x1="-18" y1="10" x2="-6" y2="0" stroke={I_LINE} strokeWidth="2" />
        <line x1="18" y1="10" x2="6" y2="0" stroke={I_LINE} strokeWidth="2" />
        <ellipse cx="-18" cy="-10" rx="8" ry="1.5" fill="#aaa" stroke={I_LINE} strokeWidth="0.6" />
        <ellipse cx="18" cy="-10" rx="8" ry="1.5" fill="#aaa" stroke={I_LINE} strokeWidth="0.6" />
        <ellipse cx="-18" cy="10" rx="8" ry="1.5" fill="#aaa" stroke={I_LINE} strokeWidth="0.6" />
        <ellipse cx="18" cy="10" rx="8" ry="1.5" fill="#aaa" stroke={I_LINE} strokeWidth="0.6" />
        <rect
          x="-6"
          y="-4"
          width="12"
          height="8"
          rx="2"
          fill={accent}
          stroke={I_LINE}
          strokeWidth="1"
        />
        <circle cx="0" cy="0" r="2" fill="#ff5566" />
        <path d="M -20 -16 Q -16 -22 -10 -22" stroke="#ffd060" strokeWidth="1.2" fill="none" />
        <path d="M 20 -16 Q 16 -22 10 -22" stroke="#ffd060" strokeWidth="1.2" fill="none" />
      </g>
      <g transform="translate(70 154)">
        <ellipse cx="0" cy="-4" rx="6" ry="6" fill="#d9a77a" stroke={I_LINE} strokeWidth="1" />
        <rect
          x="-6"
          y="2"
          width="12"
          height="14"
          rx="2"
          fill="#5a3878"
          stroke={I_LINE}
          strokeWidth="1"
        />
        <ellipse cx="-2" cy="-4" rx="0.8" ry="1.2" fill={I_LINE} />
        <ellipse cx="2" cy="-4" rx="0.8" ry="1.2" fill={I_LINE} />
        <path d="M -2 -1 Q 0 -3 2 -1" stroke={I_LINE} strokeWidth="0.8" fill="none" />
      </g>
      <g transform="translate(240 150)">
        <ellipse cx="0" cy="-4" rx="6" ry="6" fill="#c0926a" stroke={I_LINE} strokeWidth="1" />
        <rect
          x="-6"
          y="2"
          width="12"
          height="18"
          rx="2"
          fill="#a83878"
          stroke={I_LINE}
          strokeWidth="1"
        />
        <ellipse cx="-2" cy="-4" rx="0.8" ry="1.2" fill={I_LINE} />
        <ellipse cx="2" cy="-4" rx="0.8" ry="1.2" fill={I_LINE} />
        <path d="M -2 -1 Q 0 -3 2 -1" stroke={I_LINE} strokeWidth="0.8" fill="none" />
      </g>
      <g transform="translate(40 100)">
        <circle r="12" fill="#fff" stroke={I_LINE} strokeWidth="1.4" />
        <text x="0" y="5" fontSize="14" fill="#ff5566" textAnchor="middle" fontWeight="bold">
          ?!
        </text>
      </g>
    </g>
  ),

  'drone-storm': ({ accent = '#00e5ff' }) => (
    <g>
      <rect width="320" height="180" fill="#0a0e22" />
      <ellipse cx="60" cy="40" rx="40" ry="14" fill="#1a1828" />
      <ellipse cx="160" cy="34" rx="60" ry="18" fill="#0f0e20" />
      <ellipse cx="260" cy="44" rx="40" ry="14" fill="#1a1828" />
      <path d="M 100 50 L 90 70 L 105 70 L 95 100" stroke="#ffe890" strokeWidth="2" fill="none">
        <animate attributeName="opacity" values="0;1;0;0;1;0" dur="2.5s" repeatCount="indefinite" />
      </path>
      <path d="M 220 50 L 215 64 L 226 64 L 220 82" stroke="#ffe890" strokeWidth="1.8" fill="none">
        <animate
          attributeName="opacity"
          values="0;0;1;0;0"
          dur="2.5s"
          repeatCount="indefinite"
          begin="1s"
        />
      </path>
      {Array.from({ length: 30 }).map((_, i) => (
        <line
          key={i}
          x1={(i * 11) % 320}
          y1={((i * 17) % 80) + 60}
          x2={((i * 11) % 320) - 4}
          y2={((i * 17) % 80) + 72}
          stroke="#7cb8ff"
          strokeWidth="1"
          opacity="0.7"
        />
      ))}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = 30 + (i % 6) * 50
        const y = 90 + Math.floor(i / 6) * 24
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(0.55)`}>
            <line x1="-12" y1="-8" x2="-4" y2="0" stroke={I_LINE} strokeWidth="2" />
            <line x1="12" y1="-8" x2="4" y2="0" stroke={I_LINE} strokeWidth="2" />
            <ellipse
              cx="-12"
              cy="-8"
              rx="6"
              ry="1.2"
              fill="#aaa"
              stroke={I_LINE}
              strokeWidth="0.6"
            />
            <ellipse
              cx="12"
              cy="-8"
              rx="6"
              ry="1.2"
              fill="#aaa"
              stroke={I_LINE}
              strokeWidth="0.6"
            />
            <rect
              x="-4"
              y="-3"
              width="8"
              height="6"
              rx="1.5"
              fill={i === 0 ? '#ff5566' : accent}
              stroke={I_LINE}
              strokeWidth="0.8"
            />
          </g>
        )
      })}
      <rect
        x="0"
        y="146"
        width="320"
        height="34"
        fill="#150a25"
        stroke="#ff5566"
        strokeWidth="1.4"
      />
      <text x="10" y="160" fontSize="8" fill="#ff5566" fontFamily="monospace">
        STORM ALERT · 12 DRONES IN AIR
      </text>
      <text x="10" y="174" fontSize="8" fill="#ffd060" fontFamily="monospace">
        RECALL ALL · ETA 03:21
      </text>
    </g>
  ),
}
