import React, { useState, useEffect, useMemo } from 'react'

/* Capi mascot — chibi capybara with outfit variants */
/* <Capi outfit="lab|astronaut|eco|medic|rescue|intern" pose="idle|talk|cheer|wave" size={180} /> */

const Capi = ({ outfit = "lab", pose = "idle", size = 180, style = {} }) => {
  const [blink, setBlink] = useState(false)
  const [bob, setBob] = useState(0)
  const uid = useMemo(() => Math.random().toString(36).slice(2, 8), [])

  useEffect(() => {
    const blinkInt = setInterval(() => {
      setBlink(true)
      setTimeout(() => setBlink(false), 140)
    }, 3200 + Math.random() * 1600)
    const bobInt = setInterval(() => {
      setBob(v => (v + 1.2) % 360)
    }, 40)
    return () => {
      clearInterval(blinkInt)
      clearInterval(bobInt)
    }
  }, [])

  const offset = Math.sin((bob * Math.PI) / 180) * 2.5
  const mouthOpen = pose === "talk" && Math.floor(bob / 14) % 2 === 0
  const cheer = pose === "cheer"
  const wave = pose === "wave"

  const line = "#3d2414"
  const furTop = "#e8b88a"
  const furBody = "#d9a77a"
  const furBelly = "#c99368"
  const innerEar = "#b88360"
  const noseCol = "#8a5a3a"

  const outfits = {
    lab:       { coat: "#f4f6ff", trim: "#00e5ff", accent: "#7c5cff", label: "SCIENTIST" },
    astronaut: { coat: "#e6ecff", trim: "#ff2d7a", accent: "#00e5ff", label: "ARK-CAPI" },
    eco:       { coat: "#0f3d2c", trim: "#3ddc84", accent: "#ffb020", label: "ENGINEER" },
    medic:     { coat: "#f6f7ff", trim: "#ff6ba0", accent: "#00e5ff", label: "MEDIC AI" },
    rescue:    { coat: "#3a1a0a", trim: "#ff6040", accent: "#ffb020", label: "RESCUE" },
    intern:    { coat: "#141838", trim: "#00e5ff", accent: "#ff2d7a", label: "TECHNO" },
  }
  const o = outfits[outfit] || outfits.lab

  return (
    <svg
      viewBox="0 0 260 260"
      width={size}
      height={size}
      style={{ display: "block", transform: `translateY(${offset}px)`, transition: "transform 0.1s linear", overflow: "visible", ...style }}
    >
      <defs>
        <linearGradient id={`fur-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={furTop} />
          <stop offset="55%" stopColor={furBody} />
          <stop offset="100%" stopColor={furBelly} />
        </linearGradient>
        <clipPath id={`body-clip-${uid}`}>
          <path d="M 130 36 C 70 36, 38 80, 38 140 C 38 200, 70 230, 130 230 C 190 230, 222 200, 222 140 C 222 80, 190 36, 130 36 Z" />
        </clipPath>
      </defs>

      <ellipse cx="130" cy="236" rx="78" ry="6" fill="#000" opacity="0.22" />

      <g>
        <ellipse cx="94" cy="228" rx="14" ry="7" fill={furBelly} stroke={line} strokeWidth="2.2" />
        <ellipse cx="166" cy="228" rx="14" ry="7" fill={furBelly} stroke={line} strokeWidth="2.2" />
      </g>

      {wave ? (
        <g>
          <path d="M 60 150 Q 36 120 28 86 Q 26 78 34 76 Q 42 74 46 82 Q 58 110 76 140 Z"
                fill={`url(#fur-${uid})`} stroke={line} strokeWidth="2.4" strokeLinejoin="round" />
          <ellipse cx="196" cy="178" rx="16" ry="22" fill={`url(#fur-${uid})`} stroke={line} strokeWidth="2.4" />
        </g>
      ) : cheer ? (
        <g>
          <path d="M 60 150 Q 36 120 28 86 Q 26 78 34 76 Q 42 74 46 82 Q 58 110 76 140 Z"
                fill={`url(#fur-${uid})`} stroke={line} strokeWidth="2.4" strokeLinejoin="round" />
          <path d="M 200 150 Q 224 120 232 86 Q 234 78 226 76 Q 218 74 214 82 Q 202 110 184 140 Z"
                fill={`url(#fur-${uid})`} stroke={line} strokeWidth="2.4" strokeLinejoin="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="64" cy="178" rx="16" ry="22" fill={`url(#fur-${uid})`} stroke={line} strokeWidth="2.4" />
          <ellipse cx="196" cy="178" rx="16" ry="22" fill={`url(#fur-${uid})`} stroke={line} strokeWidth="2.4" />
        </g>
      )}

      <g>
        <ellipse cx="78" cy="52" rx="14" ry="11" fill={furBody} stroke={line} strokeWidth="2.4" />
        <ellipse cx="78" cy="54" rx="7" ry="5" fill={innerEar} />
        <ellipse cx="182" cy="52" rx="14" ry="11" fill={furBody} stroke={line} strokeWidth="2.4" />
        <ellipse cx="182" cy="54" rx="7" ry="5" fill={innerEar} />
      </g>

      <path
        d="M 130 36 C 70 36, 38 80, 38 140 C 38 200, 70 230, 130 230 C 190 230, 222 200, 222 140 C 222 80, 190 36, 130 36 Z"
        fill={`url(#fur-${uid})`}
        stroke={line}
        strokeWidth="3"
      />

      <path
        d="M 70 150 Q 130 220 190 150 Q 188 205 130 222 Q 72 205 70 150 Z"
        fill={furBelly}
        opacity="0.55"
        clipPath={`url(#body-clip-${uid})`}
      />

      <g clipPath={`url(#body-clip-${uid})`}>
        {outfit === "lab" && (
          <g>
            <path d="M 46 158 L 46 232 L 214 232 L 214 158 Q 180 172 130 172 Q 80 172 46 158 Z" fill={o.coat} stroke={line} strokeWidth="2.4" />
            <path d="M 112 156 L 130 182 L 148 156 Z" fill={o.coat} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />
            <rect x="158" y="188" width="28" height="22" rx="2" fill="none" stroke={line} strokeWidth="2" />
            <rect x="167" y="182" width="4" height="14" fill={o.accent} stroke={line} strokeWidth="1.2" />
            <circle cx="130" cy="200" r="2.4" fill={line} />
            <circle cx="130" cy="218" r="2.4" fill={line} />
            <rect x="74" y="188" width="30" height="20" rx="2" fill="#0a1040" stroke={line} strokeWidth="2" />
            <rect x="78" y="192" width="8" height="8" fill={o.trim} />
            <line x1="90" y1="194" x2="100" y2="194" stroke={o.trim} strokeWidth="1.5" />
            <line x1="90" y1="198" x2="98" y2="198" stroke={o.trim} strokeWidth="1" opacity="0.7" />
            <line x1="90" y1="202" x2="100" y2="202" stroke={o.trim} strokeWidth="1" opacity="0.7" />
          </g>
        )}
        {outfit === "astronaut" && (
          <g>
            <path d="M 46 156 L 46 232 L 214 232 L 214 156 Q 180 168 130 168 Q 80 168 46 156 Z" fill={o.coat} stroke={line} strokeWidth="2.4" />
            <rect x="94" y="184" width="72" height="38" rx="4" fill="#0a1040" stroke={line} strokeWidth="2" />
            <circle cx="108" cy="196" r="3.5" fill="#3ddc84">
              <animate attributeName="opacity" values="0.35;1;0.35" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="120" cy="196" r="3.5" fill="#ffb020" opacity="0.8" />
            <circle cx="132" cy="196" r="3.5" fill="#ff2d7a" opacity="0.7" />
            <line x1="104" y1="208" x2="156" y2="208" stroke={o.trim} strokeWidth="1" opacity="0.8" />
            <text x="130" y="218" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={o.trim} fontWeight="bold" letterSpacing="1.5">ARK-01</text>
            <path d="M 88 156 Q 130 172 172 156" fill="none" stroke={o.trim} strokeWidth="2" opacity="0.7" />
          </g>
        )}
        {outfit === "eco" && (
          <g>
            <path d="M 46 156 L 46 232 L 214 232 L 214 156 Q 180 168 130 168 Q 80 168 46 156 Z" fill={o.coat} stroke={line} strokeWidth="2.4" />
            <path d="M 60 158 L 60 232 L 86 232 L 86 164 Z" fill="#ffb020" stroke={line} strokeWidth="2" />
            <path d="M 200 158 L 200 232 L 174 232 L 174 164 Z" fill="#ffb020" stroke={line} strokeWidth="2" />
            <rect x="60" y="196" width="26" height="5" fill="#fff" opacity="0.85" />
            <rect x="174" y="196" width="26" height="5" fill="#fff" opacity="0.85" />
            <circle cx="130" cy="198" r="18" fill="#0f3d2c" stroke={line} strokeWidth="2.2" />
            <path d="M 122 192 L 130 186 L 128 196 M 130 186 L 136 196" stroke={o.trim} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 140 204 L 134 210 L 142 212 M 134 210 L 130 204" stroke={o.trim} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 118 210 L 124 204 L 118 200 M 124 204 L 128 212" stroke={o.trim} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
        {outfit === "medic" && (
          <g>
            <path d="M 46 156 L 46 232 L 214 232 L 214 156 Q 180 168 130 168 Q 80 168 46 156 Z" fill={o.coat} stroke={line} strokeWidth="2.4" />
            <rect x="150" y="184" width="28" height="28" rx="3" fill="#fff" stroke={line} strokeWidth="2" />
            <rect x="161" y="188" width="6" height="20" fill={o.trim} />
            <rect x="154" y="195" width="20" height="6" fill={o.trim} />
            <path d="M 86 156 Q 78 186 90 206 Q 100 220 118 214" stroke={line} strokeWidth="2.6" fill="none" strokeLinecap="round" />
            <circle cx="120" cy="214" r="7" fill={o.trim} stroke={line} strokeWidth="2" />
            <circle cx="120" cy="214" r="3" fill={o.coat} />
          </g>
        )}
        {outfit === "rescue" && (
          <g>
            <path d="M 46 156 L 46 232 L 214 232 L 214 156 Q 180 168 130 168 Q 80 168 46 156 Z" fill={o.coat} stroke={line} strokeWidth="2.4" />
            <rect x="46" y="196" width="168" height="7" fill={o.trim} stroke={line} strokeWidth="1.5" />
            <rect x="46" y="206" width="168" height="4" fill={o.accent} />
            <path d="M 110 170 L 150 170 L 146 208 L 130 218 L 114 208 Z" fill={o.trim} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />
            <text x="130" y="196" textAnchor="middle" fontFamily="monospace" fontSize="11" fill="#2a0a00" fontWeight="bold" letterSpacing="1">SOS</text>
          </g>
        )}
        {outfit === "intern" && (
          <g>
            <path d="M 46 156 L 46 232 L 214 232 L 214 156 Q 180 168 130 168 Q 80 168 46 156 Z" fill={o.coat} stroke={line} strokeWidth="2.4" />
            <path d="M 130 156 L 120 176 L 130 232 L 140 176 Z" fill={o.accent} stroke={line} strokeWidth="2" strokeLinejoin="round" />
            <path d="M 122 172 L 130 180 L 138 172 L 130 164 Z" fill="#fff" opacity="0.3" />
            <rect x="154" y="178" width="36" height="22" rx="2" fill="#0a1040" stroke={line} strokeWidth="2" />
            <text x="172" y="193" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={o.trim} fontWeight="bold" letterSpacing="1.4">TECHNO</text>
            <rect x="158" y="195" width="10" height="3" fill={o.accent} />
          </g>
        )}
      </g>

      <path
        d="M 130 36 C 70 36, 38 80, 38 140 C 38 200, 70 230, 130 230 C 190 230, 222 200, 222 140 C 222 80, 190 36, 130 36 Z"
        fill="none"
        stroke={line}
        strokeWidth="3"
      />

      <ellipse cx="130" cy="128" rx="36" ry="20" fill={furBelly} opacity="0.55" />

      {blink ? (
        <g>
          <path d="M 94 104 Q 102 108 110 104" stroke={line} strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 150 104 Q 158 108 166 104" stroke={line} strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="102" cy="106" rx="5.5" ry="7" fill={line} />
          <circle cx="104" cy="103" r="1.8" fill="#fff" />
          <ellipse cx="158" cy="106" rx="5.5" ry="7" fill={line} />
          <circle cx="160" cy="103" r="1.8" fill="#fff" />
        </g>
      )}

      <ellipse cx="76" cy="134" rx="7" ry="4" fill="#ff9a9a" opacity="0.35" />
      <ellipse cx="184" cy="134" rx="7" ry="4" fill="#ff9a9a" opacity="0.35" />

      <ellipse cx="130" cy="126" rx="3" ry="2" fill={noseCol} opacity="0.55" />

      {mouthOpen ? (
        <g>
          <ellipse cx="130" cy="140" rx="7" ry="5" fill={line} />
          <path d="M 126 138 L 134 138" stroke="#fff8ee" strokeWidth="1.2" />
        </g>
      ) : cheer ? (
        <g>
          <path d="M 118 136 Q 130 148 142 136 Q 142 142 130 144 Q 118 142 118 136 Z" fill={line} />
          <rect x="124" y="136" width="3" height="3" fill="#fff8ee" />
          <rect x="133" y="136" width="3" height="3" fill="#fff8ee" />
        </g>
      ) : wave ? (
        <path d="M 120 136 Q 130 146 140 136" stroke={line} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      ) : (
        <path d="M 122 136 Q 130 142 138 136" stroke={line} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      )}

      {wave && (
        <g stroke={line} strokeWidth="2.2" fill="none" strokeLinecap="round">
          <line x1="16" y1="48" x2="10" y2="56" />
          <line x1="8" y1="40" x2="16" y2="32" />
        </g>
      )}
    </svg>
  )
}

export default Capi
