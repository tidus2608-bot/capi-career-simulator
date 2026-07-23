import { useState } from 'react'
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
  const { setStartedAt, setScanIntroActive } = useWizard()
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
        <h2 className="p2-new-header">
          {t('common.capi_gene_info_title')}
        </h2>

        <div className="role-carousel-wrapper">
          <button
            className="role-carousel-btn"
            onClick={handlePrev}
            style={{
              background: 'rgba(0,0,0,0.05)',
              color: '#1a1a2e',
              borderColor: 'rgba(0,0,0,0.1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon icon="mdi:chevron-left" width="24" height="24" />
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
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon icon="mdi:chevron-right" width="24" height="24" />
          </button>
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
            <p className="p2-info-details-text">
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

        <div className="p2-new-actions" style={{ width: '100%', maxWidth: 960 }}>
          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/')
            }}
          >
            {t('common.back_btn')}
          </Button>
          <Button
            variant="solid"
            active
            onClick={() => {
              capiAudio.sfx('confirm')
              setStartedAt(new Date().toISOString())
              setScanIntroActive(true)
              navigate('/scan')
            }}
          >
            {t('intro.btn_scan_gene')}
          </Button>
        </div>
      </div>
    </SceneShell>
  )
}
