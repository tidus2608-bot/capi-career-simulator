import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../../audio.js'
import SceneShell from './SceneShell.jsx'
import missionsData from '../../data/missions.json'

export default function CapiGeneInfoScene({ onBack, onStart }) {
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const [activeIdx, setActiveIdx] = useState(0)

  const roles = missionsData.roles
  const activeRole = roles[activeIdx]

  const handlePrev = () => {
    capiAudio.sfx('click')
    setActiveIdx((prev) => (prev === 0 ? roles.length - 1 : prev - 1))
  }

  const handleNext = () => {
    capiAudio.sfx('click')
    setActiveIdx((prev) => (prev === roles.length - 1 ? 0 : prev + 1))
  }

  return (
    <SceneShell light className="no-scroll-shell">
      <div
        className="p2-new-layout"
        style={{
          padding: 'clamp(16px, 2.5vh, 28px) 24px clamp(12px, 2vh, 24px)',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <h2 className="p2-new-header" style={{ marginBottom: 12 }}>
          {t('common.capi_gene_info_title')}
        </h2>

        <div className="role-carousel-wrapper" style={{ marginBottom: 12 }}>
          <button
            className="role-carousel-btn"
            onClick={handlePrev}
            style={{
              background: 'rgba(0,0,0,0.05)',
              color: '#1a1a2e',
              borderColor: 'rgba(0,0,0,0.1)',
            }}
          >
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

          <div className="info-carousel-container">
            {roles.map((r, idx) => {
              let cardClass = 'hidden'
              if (idx === activeIdx) cardClass = 'active'
              else if (idx === (activeIdx - 1 + roles.length) % roles.length) cardClass = 'prev'
              else if (idx === (activeIdx + 1) % roles.length) cardClass = 'next'

              return (
                <div
                  key={r.key}
                  className={`info-carousel-card ${cardClass}`}
                  role="button"
                  tabIndex={idx === activeIdx ? 0 : -1}
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
                  <div className="info-carousel-card-gradient" />
                  <div className="info-carousel-card-info">
                    <div className="info-carousel-card-title">{isEn ? r.name_en : r.name_vn}</div>
                    <div className="info-carousel-card-tagline">
                      {t(`common.roles.${r.key}.tagline`)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <button
            className="role-carousel-btn"
            onClick={handleNext}
            style={{
              background: 'rgba(0,0,0,0.05)',
              color: '#1a1a2e',
              borderColor: 'rgba(0,0,0,0.1)',
            }}
          >
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

        {/* Permanent details box below the active card */}
        <div className="p2-info-details-box">
          <div className="p2-info-details-col">
            <div className="p2-info-details-header">
              <div
                className="p2-info-details-icon-wrapper"
                style={{ background: '#e0e7ff', color: '#4f46e5' }}
              >
                {/* Chat bubble icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              {t('common.role_description')}
            </div>
            <p className="p2-info-details-text">
              {isEn ? activeRole.short_description_en : activeRole.short_description_vn}
            </p>
          </div>

          <div className="p2-info-details-col">
            <div className="p2-info-details-header">
              <div
                className="p2-info-details-icon-wrapper"
                style={{ background: '#fee2e2', color: '#ef4444' }}
              >
                {/* Star icon */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              {t('common.role_characteristics')}
            </div>
            <ul className="p2-info-details-list">
              {(isEn ? activeRole.qualifications_en : activeRole.qualifications_vn)
                .slice(0, 4)
                .map((q, idx) => (
                  <li key={idx}>{q}</li>
                ))}
            </ul>
          </div>
        </div>

        <div className="p2-new-actions" style={{ width: '100%', maxWidth: 960 }}>
          <button
            className="p2-btn-outline"
            onClick={() => {
              capiAudio.sfx('click')
              onBack()
            }}
          >
            {t('common.back_btn')}
          </button>
          <button
            className="p2-btn-solid active"
            onClick={() => {
              capiAudio.sfx('confirm')
              onStart()
            }}
          >
            {t('intro.btn_scan_gene')}
          </button>
        </div>
      </div>
    </SceneShell>
  )
}
