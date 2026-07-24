import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import SceneShell from './SceneShell.jsx'

export default function ReportLoading() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [progress, setProgress] = useState(0)
  
  useEffect(() => {
    let timeoutId
    // Staggered progress: 0 -> 24 -> 68 -> 99 -> 100
    const sequence = [
      { p: 24, delay: 500 },
      { p: 68, delay: 1200 },
      { p: 99, delay: 2000 },
      { p: 100, delay: 3000 }
    ]

    sequence.forEach(({ p, delay }) => {
      setTimeout(() => {
        setProgress(p)
        if (p === 100) {
          capiAudio.sfx('success')
          timeoutId = setTimeout(() => {
            navigate('/certificate/summary', { replace: true })
          }, 400) // brief pause before navigate
        }
      }, delay)
    })

    return () => clearTimeout(timeoutId)
  }, [navigate])

  return (
    <SceneShell light>
      <div 
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          padding: 24,
          textAlign: 'center',
          boxSizing: 'border-box',
          overflow: 'hidden',
          background: '#f4f3f6',
        }}
      >
        {/* Extracted ambient background decoration SVG */}
        <img
          src="/illos/ambient-circles.webp"
          alt=""
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 320, height: 320, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="220" height="220" viewBox="0 0 200 200" style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 0 12px rgba(132,52,151,0.5))' }}>
              <polygon points="100,10 190,75 155,180 45,180 10,75" fill="rgba(132, 52, 151, 0.1)" stroke="#843497" strokeWidth="2" />
              <polygon points="100,40 160,85 135,150 65,150 40,85" fill="rgba(132, 52, 151, 0.3)" stroke="#843497" strokeWidth="1" />
            </svg>
          </div>

          <h2 style={{ color: '#843497', marginTop: 40, fontSize: '32px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
            {t('report.loading_title')}
          </h2>
          <p style={{ color: '#6b7280', marginTop: 16, maxWidth: 480, fontSize: '17px', lineHeight: 1.6 }}>
            {t('report.loading_subtitle')}
          </p>

          <div style={{ width: '100%', minWidth: 320, maxWidth: 400, marginTop: 48 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '14px', color: '#843497', fontWeight: 600 }}>
              <span>{t('report.scanning_behavior_data') || 'Đang quét dữ liệu hành vi...'}</span>
              <span>{progress}%</span>
            </div>
            <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div 
                style={{
                  height: '100%',
                  background: '#843497',
                  width: `${progress}%`,
                  transition: 'width 0.4s ease-out'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
