export default function Transition({ k, children }) {
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div
        key={k}
        className="fade-in"
        style={{ position: 'absolute', inset: 0, animationDelay: '0.12s' }}
      >
        {children}
      </div>
      <div key={`${k}-flash`} className="scene-flash" aria-hidden="true">
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
