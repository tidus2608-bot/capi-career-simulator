import { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import SceneShell from './SceneShell.jsx'
import missionsData from '../../data/missions.json'

export default function IntroScene({ onStart }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const [showModal, setShowModal] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)

  const roles = missionsData.roles

  const handlePrev = () => {
    capiAudio.sfx('click')
    setActiveIdx((prev) => (prev === 0 ? roles.length - 1 : prev - 1))
  }

  const handleNext = () => {
    capiAudio.sfx('click')
    setActiveIdx((prev) => (prev === roles.length - 1 ? 0 : prev + 1))
  }

  return (
    <SceneShell>
      <img
        src="/illos/sx4-intro.webp"
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
          inset: 0,
          background:
            'linear-gradient(to right, rgba(10, 16, 48, 0.9) 0%, rgba(10, 16, 48, 0.4) 45%, transparent 100%)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '120px 48px 48px',
          maxWidth: 600,
        }}
      >
        <div
          style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
          className="fade-up"
        >
          <div
            style={{
              background: '#843497',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: 8,
              display: 'inline-block',
              fontSize: 12,
              fontWeight: 600,
              alignSelf: 'flex-start',
              marginBottom: 24,
              letterSpacing: '0.05em',
              opacity: 0.9,
            }}
          >
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
              onClick={() => {
                capiAudio.sfx('confirm')
                onStart()
              }}
            >
              {t('intro.btn_scan_gene')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              className="btn"
              style={{
                background: '#fff',
                color: '#1a1a2e',
                padding: '14px 24px',
                fontSize: 16,
                borderRadius: 12,
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                opacity: 0.9,
              }}
              onClick={() => {
                capiAudio.sfx('click')
                setShowModal(true)
              }}
            >
              {t('intro.btn_what_is_gene')}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8 }}>
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: '#e2e8f0',
            fontSize: 13,
            opacity: 0.8,
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            style={{ flexShrink: 0 }}
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          {t('intro.footer_hint')}
        </div>
      </div>

      {showModal &&
        createPortal(
          <div className="role-modal-overlay">
            <h2 className="role-modal-title">{t('common.role_modal_title')}</h2>

            <div className="role-carousel-wrapper">
              <button className="role-carousel-btn" onClick={handlePrev}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>

              <div className="role-carousel-container">
                {roles.map((r, idx) => {
                  let cardClass = 'hidden'
                  if (idx === activeIdx) cardClass = 'active'
                  else if (idx === (activeIdx - 1 + roles.length) % roles.length) cardClass = 'prev'
                  else if (idx === (activeIdx + 1) % roles.length) cardClass = 'next'

                  return (
                    <div
                      key={r.key}
                      className={`role-carousel-card ${cardClass}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => {
                        if (cardClass === 'prev') handlePrev()
                        if (cardClass === 'next') handleNext()
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          if (cardClass === 'prev') handlePrev()
                          if (cardClass === 'next') handleNext()
                        }
                      }}
                    >
                      <img className="bg" src={`/illos/capi-gen-${r.key}.jpg`} alt="" />
                      <div className="role-carousel-card-gradient" />

                      <div className="role-carousel-card-info">
                        <div className="role-carousel-card-title">
                          {isEn ? r.name_en : r.name_vn}
                        </div>
                        <div className="role-carousel-card-tagline">
                          {t(`common.roles.${r.key}.tagline`)}
                        </div>
                      </div>

                      <div className="role-carousel-card-hover">
                        <div className="role-carousel-hover-title">
                          {isEn ? r.name_en : r.name_vn}
                        </div>
                        <div className="role-carousel-hover-tagline">
                          {t(`common.roles.${r.key}.tagline`)}
                        </div>
                        <div className="role-carousel-hover-body">
                          <div className="role-carousel-hover-col">
                            <h4>{t('common.role_description')}</h4>
                            <p>{isEn ? r.short_description_en : r.short_description_vn}</p>
                          </div>
                          <div className="role-carousel-hover-col">
                            <h4>{t('common.role_characteristics')}</h4>
                            <ul>
                              {(isEn ? r.qualifications_en : r.qualifications_vn)
                                .slice(0, 3)
                                .map((q, qidx) => (
                                  <li key={qidx}>{q}</li>
                                ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <button className="role-carousel-btn" onClick={handleNext}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            <div className="role-carousel-dots">
              {roles.map((_, idx) => (
                <div
                  key={idx}
                  className={`role-carousel-dot ${idx === activeIdx ? 'active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    capiAudio.sfx('click')
                    setActiveIdx(idx)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      capiAudio.sfx('click')
                      setActiveIdx(idx)
                    }
                  }}
                />
              ))}
            </div>

            <div className="role-modal-actions">
              <button
                className="p2-btn-outline"
                onClick={() => {
                  capiAudio.sfx('click')
                  setShowModal(false)
                }}
              >
                {t('common.back_btn')}
              </button>
              <button
                className="p2-btn-solid active"
                onClick={() => {
                  capiAudio.sfx('confirm')
                  setShowModal(false)
                  onStart()
                }}
              >
                {t('intro.btn_scan_gene')}
              </button>
            </div>
          </div>,
          document.body,
        )}
    </SceneShell>
  )
}
