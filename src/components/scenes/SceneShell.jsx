import { Particles } from '../UI.jsx'

const BG_CLASS = {
  default: '',
  river: 'scene-river',
  hospital: 'scene-hospital',
  rescue: 'scene-rescue',
  home: 'scene-home',
  warehouse: 'scene-warehouse',
  drone: 'scene-drone',
  lab: 'scene-lab',
}

export default function SceneShell({ children, className = '', bg = 'default' }) {
  const bgClass = BG_CLASS[bg] || ''
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }} className={bgClass}>
      <div className="cosmic-bg" />
      <Particles count={20} />
      <div className="scanline" />
      <div className="hud-frame">
        <span className="hud-tr" />
        <span className="hud-bl" />
      </div>
      <div
        className={`fade-in ${className}`}
        style={{ position: 'relative', zIndex: 5, height: '100%', width: '100%', overflowY: 'auto' }}
      >
        {children}
      </div>
    </div>
  )
}
