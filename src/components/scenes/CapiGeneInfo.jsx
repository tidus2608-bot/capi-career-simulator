import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { capiAudio } from '../../audio.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import { Icon } from '@iconify/react'
import missionsData from '../../data/missions.json'

export default function CapiGeneInfoScene() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { setStartedAt, setScanIntroActive, onRestart } = useWizard()
  const isEn = i18n.language === 'en'
  const [activeIdx, setActiveIdx] = useState(0)

  const roles = missionsData.roles
  const activeRole = roles[activeIdx]

  const handlePrev = useCallback(() => {
    capiAudio.sfx('click')
    setActiveIdx((prev) => (prev === 0 ? roles.length - 1 : prev - 1))
  }, [roles.length])

  const handleNext = useCallback(() => {
    capiAudio.sfx('click')
    setActiveIdx((prev) => (prev === roles.length - 1 ? 0 : prev + 1))
  }, [roles.length])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleNext, handlePrev])

  return (
    <SceneShell light className="no-scroll-shell">
      <div className="p2-new-layout capi-gene-info-layout">
        <h2 className="p2-new-header">{t('common.capi_gene_info_title')}</h2>

        <div className="role-carousel-wrapper">
          <button
            className="role-carousel-btn role-carousel-btn-prev"
            onClick={handlePrev}
            aria-label="Previous role"
          >
            <Icon icon="mdi:chevron-left" width="28" height="28" />
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
                  <img className="bg" src={`/illos/capi-gen-${r.key}.webp`} alt="" />
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
            className="role-carousel-btn role-carousel-btn-next"
            onClick={handleNext}
            aria-label="Next role"
          >
            <Icon icon="mdi:chevron-right" width="28" height="28" />
          </button>
        </div>

        {/* Carousel Pagination Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, margin: '-8px 0 8px' }}>
          {roles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                capiAudio.sfx('click')
                setActiveIdx(idx)
              }}
              style={{
                width: idx === activeIdx ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: idx === activeIdx ? '#843497' : '#cbd5e1',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'all 0.25s ease',
              }}
              aria-label={`Go to role ${idx + 1}`}
            />
          ))}
        </div>

        {/* Permanent details box below the active card */}
        <div className="p2-info-details-box">
          <div className="p2-info-details-col">
            <div className="p2-info-details-header">
              <div
                className="p2-info-details-icon-wrapper"
                style={{
                  background: '#e0e7ff',
                  color: '#4f46e5',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Chat bubble icon */}
                <Icon icon="mdi:comment-text-outline" width="16" height="16" />
              </div>
              {t('common.role_description')}
            </div>
            <p className="p2-info-details-text" style={{ whiteSpace: 'pre-line', lineHeight: 1.6 }}>
              {isEn ? activeRole.short_description_en : activeRole.short_description_vn}
            </p>
          </div>

          <div className="p2-info-details-col">
            <div className="p2-info-details-header">
              <div
                className="p2-info-details-icon-wrapper"
                style={{
                  background: '#fee2e2',
                  color: '#ef4444',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Star icon */}
                <Icon icon="mdi:star-outline" width="16" height="16" />
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

        <div className="p2-new-actions" style={{ width: '100%', maxWidth: 1100 }}>
          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/')
            }}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 14,
              fontSize: 'var(--text-base)',
              fontWeight: 600,
            }}
          >
            {t('common.back_btn')}
          </Button>
          <Button
            variant="solid"
            active
            onClick={() => {
              capiAudio.sfx('confirm')
              onRestart()
              setStartedAt(new Date().toISOString())
              setScanIntroActive(true)
              navigate('/scan')
            }}
            style={{
              flex: 1.2,
              height: 50,
              borderRadius: 14,
              fontSize: 'var(--text-base)',
              fontWeight: 700,
            }}
          >
            {t('intro.btn_scan_gene')}
          </Button>
        </div>
      </div>
    </SceneShell>
  )
}
