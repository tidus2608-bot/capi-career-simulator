/**
 * Tiny chibi capybara — sized to fit inside a 320×180 illustration panel.
 * No outfit complexity, just a coat color overlay when `outfit` is set.
 *
 * Props:
 *   x, y          position (defaults 0,0; the parent <g> places it)
 *   scale         uniform scale (default 1)
 *   outfit        'lab' | 'eco' | 'medic' | 'rescue' | 'intern' | 'astronaut' | 'none'
 *   flip          horizontal mirror
 *   mood          'smile' | 'ohh' | 'worry'  (different mouth shape)
 */

export const I_LINE = '#3d2414'
export const I_CAPI = { fur: '#d9a77a', furDk: '#c99368', line: '#3d2414' }

const OUTFIT_PALETTE = {
  lab: { coat: '#f4f6ff', trim: '#00e5ff' },
  eco: { coat: '#0f3d2c', trim: '#3ddc84' },
  medic: { coat: '#f6f7ff', trim: '#ff6ba0' },
  rescue: { coat: '#e85a3a', trim: '#ffd88a' },
  intern: { coat: '#1a2552', trim: '#00e5ff' },
  astronaut: { coat: '#e6ecff', trim: '#ff2d7a' },
  none: { coat: null, trim: null },
}

export default function TinyCapi({
  x = 0,
  y = 0,
  scale = 1,
  outfit = 'lab',
  flip = false,
  mood = 'smile',
}) {
  const palette = OUTFIT_PALETTE[outfit] || OUTFIT_PALETTE.none
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <ellipse cx="0" cy="34" rx="22" ry="3" fill="#000" opacity="0.25" />
      <circle cx="-14" cy="-22" r="5" fill={I_CAPI.fur} stroke={I_CAPI.line} strokeWidth="1.4" />
      <circle cx="-14" cy="-22" r="2" fill="#e8a8a0" />
      <circle cx="14" cy="-22" r="5" fill={I_CAPI.fur} stroke={I_CAPI.line} strokeWidth="1.4" />
      <circle cx="14" cy="-22" r="2" fill="#e8a8a0" />
      <ellipse
        cx="0"
        cy="6"
        rx="22"
        ry="26"
        fill={I_CAPI.fur}
        stroke={I_CAPI.line}
        strokeWidth="1.6"
      />
      {palette.coat && (
        <>
          <path
            d="M -22 12 Q -22 30 -16 32 L 16 32 Q 22 30 22 12 Z"
            fill={palette.coat}
            stroke={I_CAPI.line}
            strokeWidth="1.4"
          />
          <line x1="0" y1="12" x2="0" y2="32" stroke={palette.trim} strokeWidth="0.8" />
        </>
      )}
      <ellipse cx="0" cy="14" rx="14" ry="9" fill={I_CAPI.furDk} opacity="0.5" />
      <ellipse cx="-7" cy="-2" rx="2" ry="2.6" fill={I_CAPI.line} />
      <circle cx="-6.4" cy="-2.6" r="0.7" fill="#fff" />
      <ellipse cx="7" cy="-2" rx="2" ry="2.6" fill={I_CAPI.line} />
      <circle cx="7.6" cy="-2.6" r="0.7" fill="#fff" />
      {mood === 'smile' && (
        <path
          d="M -2 6 Q 0 8 2 6"
          stroke={I_CAPI.line}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      {mood === 'ohh' && <ellipse cx="0" cy="6.5" rx="1.6" ry="2" fill={I_CAPI.line} />}
      {mood === 'worry' && (
        <path
          d="M -2 7 Q 0 5 2 7"
          stroke={I_CAPI.line}
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      )}
      <circle cx="-13" cy="3" r="2.6" fill="#ff8aa8" opacity="0.5" />
      <circle cx="13" cy="3" r="2.6" fill="#ff8aa8" opacity="0.5" />
      <ellipse cx="-8" cy="32" rx="4" ry="2" fill={I_CAPI.line} />
      <ellipse cx="8" cy="32" rx="4" ry="2" fill={I_CAPI.line} />
    </g>
  )
}
