export default function Transition({ k, children }) {
  return (
    <div
      className="scene-transition-wrapper"
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <div
        key={k}
        className="fade-in scene-transition-content"
        style={{
          position: 'absolute',
          inset: 0,
          animationDelay: '0.12s',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
      <div key={`${k}-flash`} className="scene-flash no-print" aria-hidden="true">
        <div className="capi-sprite-clip">
          <img
            src="/illos/capi-transition.webp"
            className="capi-sprite-img"
            alt=""
            draggable="false"
          />
        </div>
      </div>
    </div>
  )
}
