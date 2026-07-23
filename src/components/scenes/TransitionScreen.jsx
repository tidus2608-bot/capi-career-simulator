import React from 'react'
import { capiAudio } from '../../audio.js'

export default function TransitionScreen({ imageSrc, onNext }) {
  const handleClick = () => {
    capiAudio.sfx('click')
    if (onNext) onNext()
  }

  return (
    /* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
    <div
      className="p2-shell"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <img
        src={imageSrc}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
        onError={(e) => {
          e.currentTarget.style.display = 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
          background: 'rgba(10, 16, 48, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '10px 24px',
          borderRadius: '50px',
          color: '#ffffff',
          fontSize: '14px',
          fontFamily: 'var(--font-mono)',
          fontWeight: '600',
          letterSpacing: '0.05em',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), 0 0 16px rgba(132, 52, 151, 0.3)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          animation: 'pulseGlow 2s infinite ease-in-out',
          whiteSpace: 'nowrap',
        }}
      >
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: '#ff6b9d',
            animation: 'blinkIndicator 1s infinite alternate',
          }}
        />
        Nhấp vào bất kỳ đâu để tiếp tục
      </div>
    </div>
  )
}
