import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import SceneShell from './SceneShell.jsx'

export default function IntroScene({ onStart }) {
  const { t } = useTranslation()
  return (
    <SceneShell>
      <img
        src="/illos/sx4-intro.webp"
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
        onError={(e) => { e.currentTarget.style.display = 'none' }}
      />
      <div 
        style={{ 
          position: 'absolute', 
          inset: 0, 
          background: 'linear-gradient(to right, rgba(10, 16, 48, 0.9) 0%, rgba(10, 16, 48, 0.4) 45%, transparent 100%)', 
          zIndex: 0, 
          pointerEvents: 'none' 
        }} 
      />
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '120px 48px 48px', maxWidth: 600 }}>
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }} className="fade-up">
          <div style={{ background: '#843497', color: '#fff', padding: '6px 12px', borderRadius: 8, display: 'inline-block', fontSize: 12, fontWeight: 600, alignSelf: 'flex-start', marginBottom: 24, letterSpacing: '0.05em', opacity: 0.9 }}>
            {t('intro.new_badge')}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: '0 0 24px',
              color: '#fff',
            }}
          >
            {t('intro.new_title')}
          </h1>

          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#e2e8f0', marginBottom: 32 }}>
            {t('intro.new_blurb')}
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              style={{ padding: '14px 24px', fontSize: 16, borderRadius: 12 }}
              onClick={() => { capiAudio.sfx('confirm'); onStart() }}
            >
              {t('intro.btn_scan_gene')} 
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            
            <button
              className="btn"
              style={{ background: '#fff', color: '#1a1a2e', padding: '14px 24px', fontSize: 16, borderRadius: 12, border: 'none', display: 'flex', alignItems: 'center', cursor: 'not-allowed', opacity: 0.9 }}
              disabled
            >
              {t('intro.btn_what_is_gene')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
                <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: 8, color: '#e2e8f0', fontSize: 13, opacity: 0.8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          {t('intro.footer_hint')}
        </div>
      </div>
    </SceneShell>
  )
}
