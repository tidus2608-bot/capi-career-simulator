/**
 * Tiny chibi capybara — sized to fit inside a 320×180 illustration panel.
 *
 * Props:
 *   x, y          position (defaults 0,0; the parent <g> places it)
 *   scale         uniform scale (default 1)
 *   outfit        'lab' | 'eco' | 'medic' | 'rescue' | 'intern' | 'astronaut' | 'none'
 *   flip          horizontal mirror
 *   mood          'smile' | 'ohh' | 'worry'  (different expression)
 */

export const I_LINE = '#3d2414'
export const I_CAPI = { fur: '#d9a77a', furDk: '#c99368', line: '#3d2414' }

const MOOD_IMAGE = {
  smile: '/capi/capi-4.png',
  ohh:   '/capi/capi-1.png',
  worry: '/capi/capi-2.png',
}

export default function TinyCapi({
  x = 0,
  y = 0,
  scale = 1,
  outfit = 'lab',
  flip = false,
  mood = 'smile',
}) {
  const src = MOOD_IMAGE[mood] || MOOD_IMAGE.smile
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
      <image
        href={src}
        x="-30"
        y="-26"
        width="60"
        height="60"
        preserveAspectRatio="xMidYMax meet"
      />
    </g>
  )
}
