/**
 * Atmospheric stars/sparkles for illustration backgrounds.
 * Deterministic via a simple seeded RNG so layout doesn't shuffle on re-render.
 */
function rng(seed, n) {
  const x = Math.sin(seed * 9301 + n * 49297) * 233280
  return x - Math.floor(x)
}

export default function Twinkles({ seed = 1, count = 12, color = '#00e5ff' }) {
  return (
    <g>
      {Array.from({ length: count }).map((_, i) => {
        const cx = rng(seed, i) * 320
        const cy = rng(seed, i + 100) * 60
        const r = 0.6 + rng(seed, i + 200) * 1.2
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r}
            fill={color}
            opacity={0.5 + rng(seed, i + 300) * 0.4}
          >
            <animate
              attributeName="opacity"
              values="0.2;1;0.2"
              dur={`${2 + rng(seed, i + 400) * 3}s`}
              repeatCount="indefinite"
              begin={`${rng(seed, i + 500) * 2}s`}
            />
          </circle>
        )
      })}
    </g>
  )
}
