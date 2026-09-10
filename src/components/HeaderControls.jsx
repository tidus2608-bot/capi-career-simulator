import React, { useState, useRef, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { capiAudio } from '../audio.js'
import LanguageSwitch from './LanguageSwitch.jsx'
import Button from './Button.jsx'
import Modal from './Modal.jsx'
import { useWizard } from '../contexts/WizardContext.jsx'
import { supabase } from '../lib/supabase.js'

export default function HeaderControls({ muted, toggleMute }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { onRestart, user } = useWizard()
  const path = location.pathname

  const isHome = path === '/'
  const isCompare = path === '/history/compare' || path === '/compare'

  const audioIcon = (
    <Icon icon={muted ? 'mdi:volume-off' : 'mdi:volume-high'} width={20} height={20} />
  )

  const isInProgress =
    path !== '/' &&
    path !== '/credits' &&
    path !== '/history' &&
    !isCompare &&
    !path.startsWith('/certificate')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [pendingNav, setPendingNav] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const accountMenuRef = useRef(null)

  useEffect(() => {
    if (!accountMenuOpen) return undefined

    const closeOnOutsideClick = (e) => {
      if (!accountMenuRef.current?.contains(e.target)) {
        setAccountMenuOpen(false)
      }
    }
    const closeOnEscape = (e) => {
      if (e.key === 'Escape') {
        setAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [accountMenuOpen])

  const handleNavWithConfirm = (targetPath) => {
    capiAudio.sfx('click')
    setMobileMenuOpen(false)
    setAccountMenuOpen(false)

    if (targetPath === '/' && isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (isInProgress) {
      setPendingNav(targetPath)
      setShowConfirmModal(true)
    } else {
      if (targetPath === '/') {
        onRestart()
      }
      navigate(targetPath)
    }
  }

  const handleHomeClick = () => {
    handleNavWithConfirm('/')
  }

  const handleConfirmExit = () => {
    capiAudio.sfx('click')
    setShowConfirmModal(false)
    const dest = pendingNav || '/'
    setPendingNav(null)
    onRestart()
    navigate(dest)
  }

  const handleLogin = async () => {
    capiAudio.sfx('click')
    const redirectTo =
      window.location.origin +
      window.location.pathname +
      window.location.search +
      window.location.hash

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })
      if (error) {
        console.error('OAuth login error:', error)
      }
    } catch (err) {
      console.error('OAuth login exception:', err)
    }
  }

  const handleLogout = async () => {
    capiAudio.sfx('click')
    setAccountMenuOpen(false)
    setMobileMenuOpen(false)
    try {
      if (supabase) {
        await supabase.auth.signOut()
      }
    } catch (err) {
      console.error('OAuth logout exception:', err)
    }
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    t('intro.nav_history')

  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null

  return (
    <>
      <header className="intro-navbar no-print">
        {/* Left Controls: Compare Back Button, Language switch & audio toggle (Desktop only) */}
        <div className="intro-navbar-left desktop-nav-controls">
          {isCompare && (
            <button
              type="button"
              className="intro-nav-circle-btn"
              onClick={() => {
                capiAudio.sfx('click')
                navigate('/history')
              }}
              title={t('common.back_to_history', 'Quay lại lịch sử')}
              aria-label={t('common.back_to_history', 'Quay lại lịch sử')}
            >
              <Icon icon="mdi:arrow-left" width={20} height={20} />
            </button>
          )}
          <LanguageSwitch />
          <button
            type="button"
            className="intro-nav-circle-btn"
            onClick={toggleMute}
            title={muted ? t('common.audio_on') : t('common.audio_off')}
            aria-label={muted ? t('common.audio_on') : t('common.audio_off')}
          >
            {audioIcon}
          </button>
        </div>

        {/* Center Brand: Logo + Title (interactive -> Home) */}
        <div
          className="intro-navbar-brand"
          role="button"
          tabIndex={0}
          onClick={handleHomeClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              handleHomeClick()
            }
          }}
          title={t('common.back_to_home', 'Về trang chủ')}
        >
          <img src="/illos/logo.webp" alt="" className="intro-navbar-logo" />
          <span className="intro-navbar-title">Capi Career</span>
        </div>

        {/* Right Controls: Desktop CTAs */}
        <div className="intro-navbar-right desktop-nav-controls">
          {user ? (
            <div className="intro-nav-user-container" ref={accountMenuRef}>
              <button
                type="button"
                className="intro-nav-user-trigger"
                aria-label={t('common.account_menu_for', { name: displayName })}
                aria-haspopup="menu"
                aria-expanded={accountMenuOpen}
                onClick={() => {
                  capiAudio.sfx('click')
                  setAccountMenuOpen((prev) => !prev)
                }}
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt=""
                    className="intro-nav-user-avatar"
                    onError={(e) => {
                      if (e?.currentTarget) e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="intro-nav-user-avatar-fallback">
                    <Icon icon="mdi:account" width={18} height={18} />
                  </div>
                )}
                <span className="intro-nav-user-name">{displayName}</span>
                <Icon
                  icon="mdi:chevron-down"
                  className={`intro-nav-user-caret ${accountMenuOpen ? 'open' : ''}`}
                  width={16}
                  height={16}
                />
              </button>

              {accountMenuOpen && (
                <div
                  className="intro-nav-dropdown-menu"
                  role="menu"
                  aria-label={t('common.account_menu')}
                >
                  <div className="intro-nav-dropdown-user-info">
                    <span className="intro-nav-dropdown-name">{displayName}</span>
                    {user.email && <span className="intro-nav-dropdown-email">{user.email}</span>}
                  </div>
                  <div className="intro-nav-dropdown-divider" />
                  <button
                    type="button"
                    className="intro-nav-dropdown-item"
                    role="menuitem"
                    onClick={() => {
                      capiAudio.sfx('click')
                      setAccountMenuOpen(false)
                      handleNavWithConfirm('/history')
                    }}
                  >
                    <Icon icon="mdi:history" width={18} height={18} />
                    <span>{t('intro.nav_history')}</span>
                  </button>
                  <button
                    type="button"
                    className="intro-nav-dropdown-item intro-nav-dropdown-item--danger"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <Icon icon="mdi:logout" width={18} height={18} />
                    <span>{t('common.sign_out_short')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button variant="solid" active className="intro-nav-cta-start" onClick={handleLogin}>
              {t('intro.nav_login')}
            </Button>
          )}
        </div>

        {/* Mobile Right Controls: Only Menu toggle */}
        <div className="mobile-nav-controls">
          <button
            type="button"
            className="intro-nav-menu-btn"
            onClick={() => {
              capiAudio.sfx('click')
              setMobileMenuOpen(true)
            }}
            aria-label="Menu"
            title="Menu"
          >
            <Icon icon="mdi:menu" width={22} height={22} />
          </button>
        </div>
      </header>

      {/* Mobile Hamburger Drawer Menu */}
      {mobileMenuOpen && (
        <div className="intro-drawer-backdrop">
          <button
            type="button"
            className="intro-drawer-overlay-btn"
            tabIndex={-1}
            aria-label={t('common.close')}
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="intro-drawer-dialog">
            <div className="intro-drawer-header">
              <div className="intro-drawer-brand">
                <img src="/illos/logo.webp" alt="" className="intro-drawer-logo" />
                <span className="intro-drawer-title">Capi Career</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label={t('common.close')}
                className="intro-drawer-close"
              >
                <Icon icon="mdi:close" width={18} height={18} />
              </button>
            </div>

            {user && (
              <div className="intro-drawer-user-card">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="intro-drawer-avatar" />
                ) : (
                  <div className="intro-drawer-avatar-fallback">
                    <Icon icon="mdi:account" width={20} height={20} />
                  </div>
                )}
                <div className="intro-drawer-user-details">
                  <span className="intro-drawer-user-name">{displayName}</span>
                  {user.email && <span className="intro-drawer-user-email">{user.email}</span>}
                </div>
              </div>
            )}

            <div className="intro-drawer-list">
              {!isHome && (
                <button
                  type="button"
                  className="intro-drawer-item"
                  onClick={() => handleNavWithConfirm('/')}
                >
                  <Icon icon="mdi:home-outline" width={18} height={18} />
                  <span>{t('common.back_to_home', 'Trang chủ')}</span>
                </button>
              )}

              {!user ? (
                <button
                  type="button"
                  className="intro-drawer-item intro-drawer-item--primary"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    handleLogin()
                  }}
                >
                  <Icon icon="mdi:login" width={18} height={18} />
                  <span>{t('intro.nav_login')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="intro-drawer-item"
                  onClick={() => handleNavWithConfirm('/history')}
                >
                  <Icon icon="mdi:history" width={18} height={18} />
                  <span>{t('intro.nav_history')}</span>
                </button>
              )}

              <button
                type="button"
                className="intro-drawer-item"
                onClick={() => {
                  setMobileMenuOpen(false)
                  if (isHome) {
                    document.getElementById('genes')?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    handleNavWithConfirm('/#genes')
                  }
                }}
              >
                <Icon icon="mdi:dna" width={18} height={18} />
                <span>{t('common.capi_gene_info_title', '5 Mảnh Ghép Capi-Gene')}</span>
              </button>

              <button
                type="button"
                className="intro-drawer-item"
                onClick={() => handleNavWithConfirm('/credits')}
              >
                <Icon icon="mdi:account-group-outline" width={18} height={18} />
                <span>{t('common.credits', 'Đội ngũ phát triển')}</span>
              </button>

              {user && (
                <button
                  type="button"
                  className="intro-drawer-item intro-drawer-item--danger"
                  onClick={handleLogout}
                >
                  <Icon icon="mdi:logout" width={18} height={18} />
                  <span>{t('common.sign_out_short')}</span>
                </button>
              )}
            </div>

            <div className="intro-drawer-controls-row">
              <div className="intro-drawer-lang-row">
                <span className="intro-drawer-lang-label">{t('common.language', 'Ngôn ngữ')}</span>
                <LanguageSwitch />
              </div>
              <button
                type="button"
                className="intro-drawer-audio-btn"
                onClick={toggleMute}
                title={muted ? t('common.audio_on') : t('common.audio_off')}
                aria-label={muted ? t('common.audio_on') : t('common.audio_off')}
              >
                {audioIcon}
                <span>{muted ? t('common.audio_on') : t('common.audio_off')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Exit Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          capiAudio.sfx('click')
          setShowConfirmModal(false)
          setPendingNav(null)
        }}
        title={t('confirm_exit.title')}
        description={t('confirm_exit.message')}
        icon="mdi:alert-circle-outline"
        cancelText={t('confirm_exit.cancel_btn')}
        confirmText={t('confirm_exit.confirm_btn')}
        confirmVariant="danger"
        onConfirm={handleConfirmExit}
      />
    </>
  )
}
