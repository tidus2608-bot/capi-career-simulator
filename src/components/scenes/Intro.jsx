import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { capiAudio } from '../../audio.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import { supabase } from '../../lib/supabase.js'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import Modal from '../Modal.jsx'
import { ROLE_KEYS } from '../../data.js'

const ROLE_ACCENT_COLORS = {
  explorer: 'var(--role-explorer)',
  builder: 'var(--role-builder)',
  operator: 'var(--role-operator)',
  connector: 'var(--role-connector)',
  communicator: 'var(--role-communicator)',
}

export default function IntroScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setStartedAt, setScanIntroActive, onRestart, user } = useWizard()
  const [activeGeneKey, setActiveGeneKey] = useState('operator')
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleStart = useCallback(() => {
    capiAudio.sfx('confirm')
    if (typeof onRestart === 'function') {
      onRestart()
    }
    if (typeof setStartedAt === 'function') {
      setStartedAt(new Date().toISOString())
    }
    if (typeof setScanIntroActive === 'function') {
      setScanIntroActive(true)
    }
    navigate('/scan')
  }, [navigate, onRestart, setScanIntroActive, setStartedAt])

  const handleStartTest = useCallback(() => {
    if (!user) {
      capiAudio.sfx('click')
      setShowLoginModal(true)
      return
    }
    handleStart()
  }, [user, handleStart])

  const handleModalLogin = useCallback(async () => {
    capiAudio.sfx('confirm')
    setShowLoginModal(false)
    const redirectTo = window.location.origin + '/scan'
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo },
      })
      if (error) {
        console.error('OAuth login error:', error)
      }
    } catch (err) {
      console.error('OAuth login exception:', err)
    }
  }, [])

  const handleModalContinueGuest = useCallback(() => {
    capiAudio.sfx('confirm')
    setShowLoginModal(false)
    handleStart()
  }, [handleStart])

  const handleScrollToPerspectives = useCallback(() => {
    capiAudio.sfx('click')
    const el = document.getElementById('perspectives')
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSelectGene = useCallback((key) => {
    if (!key || !ROLE_KEYS.includes(key)) return
    capiAudio.sfx('click')
    setActiveGeneKey(key)
  }, [])

  return (
    <SceneShell className="intro-landing-shell">
      <div className="intro-landing-container">
        {/* ============================================================ */}
        {/* SECTION 1: HERO                                              */}
        {/* ============================================================ */}
        <section id="hero" className="intro-hero-section">
          <div className="intro-hero-content-wrapper">
            <div className="intro-hero-text-block fade-up">
              <div className="intro-hero-badge">{t('intro.hero_badge')}</div>

              <h1 className="intro-hero-heading">
                <span>{t('intro.hero_title_1')}</span>
                <br />
                <span>{t('intro.hero_title_2')}</span>
                <br />
                <span>{t('intro.hero_title_3')}</span>
              </h1>

              <p className="intro-hero-description">{t('intro.hero_blurb')}</p>

              <div className="intro-hero-actions">
                <Button
                  variant="solid"
                  active
                  className="intro-hero-cta-start"
                  onClick={handleStartTest}
                >
                  <span>{t('intro.hero_btn_explore')}</span>
                  <Icon icon="mdi:arrow-right" width={20} height={20} />
                </Button>

                <Button
                  variant="outline"
                  className="intro-hero-cta-more"
                  onClick={handleScrollToPerspectives}
                >
                  <span>{t('intro.hero_btn_learn_more')}</span>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 2: THREE PERSPECTIVES                                */}
        {/* ============================================================ */}
        <section id="perspectives" className="intro-perspectives-section">
          <div className="intro-perspectives-inner">
            <div className="intro-section-header">
              <div className="intro-eyebrow-row">
                <span className="intro-eyebrow-line" />
                <span className="intro-eyebrow">{t('intro.sec2_eyebrow')}</span>
              </div>
              <h2 className="intro-section-title">{t('intro.sec2_title')}</h2>
              <p className="intro-section-subtitle">{t('intro.sec2_subtitle')}</p>
            </div>

            <div className="intro-perspectives-grid">
              {/* Card 1: I Think */}
              <div className="perspective-card-wrapper">
                <div className="perspective-ghost-num">{t('intro.card1_num')}</div>
                <div className="perspective-card perspective-card--light">
                  <div className="perspective-pill-row">
                    <span className="perspective-pill-badge">{t('intro.card1_pill_phase')}</span>
                    <span className="perspective-pill-type">{t('intro.card1_pill_type')}</span>
                  </div>
                  <h3 className="perspective-card-title">{t('intro.card1_title')}</h3>
                  <div className="perspective-card-label">{t('intro.card1_label')}</div>
                  <div className="perspective-quote-bar">{t('intro.card1_quote')}</div>
                  <p className="perspective-card-desc">{t('intro.card1_desc')}</p>
                </div>
              </div>

              {/* Card 2: I Do (Active Highlight) */}
              <div className="perspective-card-wrapper perspective-card-wrapper--offset-1">
                <div className="perspective-ghost-num">{t('intro.card2_num')}</div>
                <div className="perspective-card perspective-card--highlighted">
                  <div className="perspective-pill-row">
                    <span className="perspective-pill-badge">{t('intro.card2_pill_phase')}</span>
                    <span className="perspective-pill-type perspective-pill-type--light">
                      {t('intro.card2_pill_type')}
                    </span>
                  </div>
                  <h3 className="perspective-card-title perspective-card-title--light">
                    {t('intro.card2_title')}
                  </h3>
                  <div className="perspective-card-label perspective-card-label--light">
                    {t('intro.card2_label')}
                  </div>
                  <div className="perspective-quote-bar perspective-quote-bar--light">
                    {t('intro.card2_quote')}
                  </div>
                  <div className="perspective-card-divider" />
                  <p className="perspective-card-desc perspective-card-desc--light">
                    {t('intro.card2_desc')}
                  </p>
                </div>
              </div>

              {/* Card 3: I Reflect */}
              <div className="perspective-card-wrapper perspective-card-wrapper--offset-2">
                <div className="perspective-ghost-num">{t('intro.card3_num')}</div>
                <div className="perspective-card perspective-card--light">
                  <div className="perspective-pill-row">
                    <span className="perspective-pill-badge">{t('intro.card3_pill_phase')}</span>
                    <span className="perspective-pill-type">{t('intro.card3_pill_type')}</span>
                  </div>
                  <h3 className="perspective-card-title">{t('intro.card3_title')}</h3>
                  <div className="perspective-card-label">{t('intro.card3_label')}</div>
                  <div className="perspective-quote-bar">{t('intro.card3_quote')}</div>
                  <p className="perspective-card-desc">{t('intro.card3_desc')}</p>
                </div>
              </div>
            </div>

            <div className="intro-perspectives-callout">
              <h4 className="intro-perspectives-callout-title">{t('intro.sec2_callout_title')}</h4>
              <p className="intro-perspectives-callout-desc">{t('intro.sec2_callout_desc')}</p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: MEET THE CAPI GENES                              */}
        {/* ============================================================ */}
        <section id="genes" className="intro-genes-section">
          <div className="intro-genes-inner">
            <div className="intro-section-header intro-section-header--dark">
              <div className="intro-eyebrow-wrapper">
                <span className="intro-eyebrow-accent-bar" />
                <span className="intro-eyebrow">{t('intro.sec3_eyebrow')}</span>
              </div>
              <h2 className="intro-section-title intro-section-title--dark">
                {t('intro.sec3_title')}
              </h2>
              <p className="intro-section-subtitle intro-section-subtitle--dark">
                {t('intro.sec3_subtitle')}
              </p>
            </div>

            <div className="intro-genes-deck" role="tablist">
              {ROLE_KEYS.map((key, idx) => {
                const isActive = key === activeGeneKey
                const roleNum = String(idx + 1).padStart(2, '0')
                const accentColor = ROLE_ACCENT_COLORS[key] || '#843497'

                return (
                  <div
                    key={key}
                    role="tab"
                    tabIndex={0}
                    aria-selected={isActive}
                    className={`intro-gene-card ${isActive ? 'intro-gene-card--active' : ''}`}
                    onClick={() => handleSelectGene(key)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleSelectGene(key)
                      }
                    }}
                    style={{
                      '--gene-accent': accentColor,
                    }}
                  >
                    <div
                      className="intro-gene-accent-line"
                      style={{ backgroundColor: accentColor }}
                    />

                    {/* Background illustration preloaded & always mounted */}
                    <img
                      src={`/illos/bg-${key}.webp`}
                      alt=""
                      className="intro-gene-bg"
                      loading="eager"
                      onError={(e) => {
                        if (!e?.currentTarget) return
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="intro-gene-overlay" />

                    <div className="intro-gene-body">
                      <div className="intro-gene-num">{roleNum}</div>
                      <div className="intro-gene-content">
                        <h3 className="intro-gene-title">{t(`roles.${key}.name`)}</h3>
                        {isActive && (
                          <div className="intro-gene-tagline fade-in">
                            {t(`roles.${key}.tagline`)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="intro-genes-callout">
              <h4 className="intro-genes-callout-title">{t('intro.sec3_callout_title')}</h4>
              <p className="intro-genes-callout-desc">{t('intro.sec3_callout_desc')}</p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: READY TO EXPLORE                                 */}
        {/* ============================================================ */}
        <section id="ready" className="intro-ready-section">
          <div className="intro-ready-grid">
            <div className="intro-ready-left">
              <div className="intro-eyebrow-row">
                <span className="intro-eyebrow-line" />
                <span className="intro-eyebrow">{t('intro.sec4_eyebrow')}</span>
              </div>
              <h2 className="intro-ready-title">{t('intro.sec4_title')}</h2>

              <div className="intro-ready-steps">
                <div className="intro-ready-step">
                  <span className="intro-ready-step-num">{t('intro.sec4_step1_num')}</span>
                  <div className="intro-ready-step-text">
                    <h4 className="intro-ready-step-title">{t('intro.sec4_step1_title')}</h4>
                    <p className="intro-ready-step-desc">{t('intro.sec4_step1_desc')}</p>
                  </div>
                </div>

                <div className="intro-ready-step">
                  <span className="intro-ready-step-num">{t('intro.sec4_step2_num')}</span>
                  <div className="intro-ready-step-text">
                    <h4 className="intro-ready-step-title">{t('intro.sec4_step2_title')}</h4>
                    <p className="intro-ready-step-desc">{t('intro.sec4_step2_desc')}</p>
                  </div>
                </div>

                <div className="intro-ready-step">
                  <span className="intro-ready-step-num">{t('intro.sec4_step3_num')}</span>
                  <div className="intro-ready-step-text">
                    <h4 className="intro-ready-step-title">{t('intro.sec4_step3_title')}</h4>
                    <p className="intro-ready-step-desc">{t('intro.sec4_step3_desc')}</p>
                  </div>
                </div>
              </div>

              <div className="intro-ready-note">{t('intro.sec4_note')}</div>

              <Button variant="solid" active className="intro-ready-cta" onClick={handleStartTest}>
                <span>{t('intro.sec4_btn_start')}</span>
              </Button>
            </div>

            <div className="intro-ready-right">
              <div className="intro-ready-image-wrapper">
                <img
                  src="/illos/bg-intro-ready.webp"
                  alt=""
                  className="intro-ready-img"
                  onError={(e) => {
                    if (!e?.currentTarget) return
                    e.currentTarget.style.display = 'none'
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FOOTER & CREDITS                                             */}
        {/* ============================================================ */}
        <footer className="intro-footer">
          <div className="intro-footer-content">
            <span>© {new Date().getFullYear()} Capi Career Path Simulator</span>
            <button
              type="button"
              className="intro-footer-credits-link"
              onClick={() => {
                capiAudio.sfx('click')
                navigate('/credits')
              }}
            >
              <Icon icon="mdi:account-group-outline" width={16} height={16} />
              <span>{t('common.credits', 'Đội ngũ phát triển')}</span>
            </button>
          </div>
        </footer>
      </div>

      {/* Unauthenticated Login Prompt Modal */}
      <Modal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        title={t('intro.login_modal_title', 'Lưu kết quả trải nghiệm')}
        description={t(
          'intro.login_modal_desc',
          'Đăng nhập để lưu kết quả bài test và xem lại bất cứ lúc nào nhé!',
        )}
        icon="mdi:account-circle-outline"
        confirmText={t('intro.login_modal_login_btn', 'Đăng nhập ngay')}
        onConfirm={handleModalLogin}
        cancelText={t('intro.login_modal_continue_btn', 'Tiếp tục làm test')}
        onCancel={handleModalContinueGuest}
      />
    </SceneShell>
  )
}
