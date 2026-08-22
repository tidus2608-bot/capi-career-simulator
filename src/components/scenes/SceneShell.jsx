export default function SceneShell({ children, className = '', light = false }) {
  if (light) {
    return (
      <div
        className={`fade-in ${className}`}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#F5F6FA',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehaviorY: 'contain',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F5F6FA', overflow: 'hidden' }}>
      <div
        className={`fade-in ${className}`}
        style={{
          position: 'relative',
          zIndex: 5,
          height: '100%',
          width: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  )
}
