import { ILLUSTRATIONS } from './library.jsx'

/**
 * 16:9 panel wrapper for a scene illustration. Renders nothing if `keyId`
 * isn't in the library — caller decides what to render in that case.
 */
export default function QIllo({ keyId, accent = '#00e5ff' }) {
  const Comp = ILLUSTRATIONS[keyId]
  if (!Comp) return null
  return (
    <svg
      viewBox="0 0 320 180"
      className="qillo"
      preserveAspectRatio="xMidYMid slice"
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        borderRadius: 12,
        border: '1px solid var(--line)',
        overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.04)',
      }}
    >
      <Comp accent={accent} />
    </svg>
  )
}
