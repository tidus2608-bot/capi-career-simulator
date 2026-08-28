import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { capiAudio } from '../audio.js'
import LanguageSwitch from './LanguageSwitch.jsx'
import Button from './Button.jsx'
import AdminAuthNav from './AdminAuthNav.jsx'
import Modal from './Modal.jsx'
import { useWizard } from '../contexts/WizardContext.jsx'
import { supabase } from '../lib/supabase.js'

export default function HeaderControls({ muted, toggleMute }) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, session, onRestart } = useWizard()
  const path = location.pathname

  const isHome = path === '/'
  const isSummary = path === '/certificate/summary'
  const isDetails = path === '/certificate/details'
  const isCompare = path === '/history/compare' || path === '/compare'

  const audioIcon = (
    <Icon icon={muted ? 'mdi:volume-off' : 'mdi:volume-high'} width={20} height={20} />
  )

  const TRANSLATED_PATHS = new Set([
    '/',
    '/capi-gene-info',
    '/credits',
    '/scan',
    '/role-reveal',
    '/theme',
    '/mission-pick',
    '/mission-play',
    '/reflect',
    '/certificate',
    '/certificate/loading',
    '/certificate/summary',
    '/certificate/details',
    '/history',
    '/history/compare',
    '/compare',
    '/feedback',
  ])

  const showLanguage = TRANSLATED_PATHS.has(path)
  const showHome = !isHome && path !== '/certificate/loading'

  const isInProgress =
    path !== '/' &&
    path !== '/capi-gene-info' &&
    path !== '/credits' &&
    path !== '/history' &&
    !isCompare &&
    path !== '/feedback' &&
    !path.startsWith('/certificate')

  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleHomeClick = () => {
    capiAudio.sfx('click')
    if (isInProgress) {
      setShowConfirmModal(true)
    } else {
      onRestart()
      navigate('/')
    }
  }

  const handleMobileLogin = async () => {
    if (!supabase) return
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
    } catch (err) {
      console.error('OAuth error:', err)
    }
  }

  if (isHome || isSummary || isDetails) {
    return (
      <>
        <header className="intro-navbar no-print">
          <div className="intro-navbar-title">
            <span className="intro-navbar-brand--full">Capi Career Path Simulator</span>
            <span className="intro-navbar-brand--short">Capi Career</span>
          </div>

          {isSummary || isDetails ? (
            <div
              className="intro-navbar-controls"
              style={{ display: 'flex', gap: 8, alignItems: 'center' }}
            >
              <LanguageSwitch />
              <Button
                variant="icon"
                style={{
                  position: 'static',
                  width: 44,
                  height: 44,
                  border: 'none',
                  background: '#f3f4f6',
                  color: '#1a1a2e',
                }}
                title={muted ? t('common.audio_on') : t('common.audio_off')}
                aria-label={muted ? t('common.audio_on') : t('common.audio_off')}
                aria-pressed={muted}
                onClick={toggleMute}
              >
                {audioIcon}
              </Button>
              <Button
                variant="outline"
                className="header-circle-btn"
                onClick={handleHomeClick}
                title={t('common.back_to_home')}
              >
                <Icon icon="mdi:home-outline" width={20} height={20} />
              </Button>
            </div>
          ) : (
            <>
              {/* Desktop Controls (hidden on mobile) */}
              <div className="desktop-nav-controls">
                <button
                  type="button"
                  className="intro-nav-link"
                  onClick={() => {
                    capiAudio.sfx('click')
                    navigate('/credits')
                  }}
                  title={t('common.credits', 'Đội ngũ phát triển')}
                >
                  <Icon icon="mdi:account-group-outline" width={18} height={18} />
                  <span>{t('common.credits_short', 'Credits')}</span>
                </button>
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
                <AdminAuthNav
                  supabase={supabase}
                  session={session}
                  onHistory={user ? () => navigate('/history') : null}
                />
              </div>

              {/* Mobile Controls (hidden on desktop): Audio + Hamburger Button */}
              <div className="mobile-nav-controls">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={muted ? t('common.audio_on') : t('common.audio_off')}
                  title={muted ? t('common.audio_on') : t('common.audio_off')}
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#F1F5F9',
                    color: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <Icon
                    icon={muted ? 'mdi:volume-off' : 'mdi:volume-high'}
                    width={18}
                    height={18}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    capiAudio.sfx('click')
                    setMobileMenuOpen(true)
                  }}
                  aria-label="Menu"
                  title="Menu"
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    color: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                  }}
                >
                  <Icon icon="mdi:menu" width={20} height={20} />
                </button>
              </div>
            </>
          )}
        </header>

        {/* Mobile Hamburger Drawer Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              padding: '12px 14px',
              animation: 'fadeIn 0.15s ease-out',
            }}
          >
            {/* Click outside to dismiss */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'transparent',
                border: 'none',
                cursor: 'default',
              }}
            />

            <div
              className="glass"
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              style={{
                position: 'relative',
                zIndex: 1,
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: '18px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              {/* Drawer Top Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      backgroundColor: 'rgba(132, 52, 151, 0.1)',
                      color: '#843497',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon icon="mdi:compass-outline" width={18} height={18} />
                  </div>
                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: '#0F172A',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    Capi Career
                  </span>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={t('common.close', 'Đóng')}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748B',
                    cursor: 'pointer',
                  }}
                >
                  <Icon icon="mdi:close" width={18} height={18} />
                </button>
              </div>

              {/* User Account / Login Box */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 14,
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #F1F5F9',
                }}
              >
                {session?.user || user ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          backgroundColor: '#843497',
                          color: '#FFFFFF',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: 13,
                        }}
                      >
                        {(session?.user?.user_metadata?.full_name ||
                          session?.user?.email ||
                          'U')[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13.5,
                            fontWeight: 700,
                            color: '#0F172A',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {session?.user?.user_metadata?.full_name || session?.user?.email}
                        </div>
                        <div
                          style={{
                            fontSize: 11.5,
                            color: '#64748B',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {session?.user?.email}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                      <Button
                        variant="outline"
                        style={{
                          flex: 1,
                          height: 36,
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius: 8,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                        onClick={() => {
                          setMobileMenuOpen(false)
                          navigate('/history')
                        }}
                      >
                        <Icon icon="mdi:history" width={16} height={16} />
                        <span>{t('common.history', 'Lịch sử')}</span>
                      </Button>
                      <a
                        href="/api/auth/logout?returnTo=%2F"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0 12px',
                          height: 36,
                          fontSize: 12,
                          fontWeight: 600,
                          borderRadius: 8,
                          color: '#DC2626',
                          backgroundColor: '#FEF2F2',
                          textDecoration: 'none',
                        }}
                      >
                        <Icon icon="mdi:logout" width={16} height={16} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={handleMobileLogin}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      padding: '10px 14px',
                      borderRadius: 10,
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      color: '#1E293B',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <Icon icon="mdi:google" width={18} height={18} />
                    <span>{t('common.admin_login', 'Đăng nhập Google')}</span>
                  </button>
                )}
              </div>

              {/* Navigation Menu Links */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/capi-gene-info')
                  }}
                  style={{
                    padding: '11px 14px',
                    borderRadius: 10,
                    backgroundColor: '#F8FAFC',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: '#1E293B',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Icon icon="mdi:dna" width={18} height={18} color="#843497" />
                  <span>{t('common.capi_gene_info_title', '5 Mảnh Ghép Capi-Gene')}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false)
                    navigate('/credits')
                  }}
                  style={{
                    padding: '11px 14px',
                    borderRadius: 10,
                    backgroundColor: '#F8FAFC',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: '#1E293B',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Icon icon="mdi:account-group-outline" width={18} height={18} color="#843497" />
                  <span>{t('credits.title', 'Đội ngũ & Thông tin Dự án')}</span>
                </button>
              </div>

              {/* Language Switcher in Drawer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: 10,
                  borderTop: '1px solid #F1F5F9',
                }}
              >
                <span style={{ fontSize: 12.5, fontWeight: 600, color: '#64748B' }}>
                  {t('common.language', 'Ngôn ngữ')}:
                </span>
                <LanguageSwitch />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  return (
    <>
      {/* Top-Left Controls */}
      <div
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 100,
          display: 'flex',
          gap: 12,
          alignItems: 'center',
        }}
      >
        {isCompare && (
          <Button
            variant="outline"
            className="header-circle-btn"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/history')
            }}
            title={t('common.back_to_history', 'Quay lại lịch sử')}
            aria-label={t('common.back_to_history', 'Quay lại lịch sử')}
          >
            <Icon icon="mdi:arrow-left" width={20} height={20} />
          </Button>
        )}
        {showHome && (
          <Button
            variant="outline"
            className="header-circle-btn"
            onClick={handleHomeClick}
            title={t('common.back_to_home')}
          >
            <Icon icon="mdi:home-outline" width={20} height={20} />
          </Button>
        )}
        {showLanguage && <LanguageSwitch />}
      </div>

      {/* Top-Right Audio Toggle */}
      <Button
        variant="icon"
        title={muted ? t('common.audio_on') : t('common.audio_off')}
        aria-label={muted ? t('common.audio_on') : t('common.audio_off')}
        aria-pressed={muted}
        onClick={toggleMute}
      >
        {audioIcon}
      </Button>

      {/* Confirmation Exit Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => {
          capiAudio.sfx('click')
          setShowConfirmModal(false)
        }}
        title={t('confirm_exit.title')}
        description={t('confirm_exit.message')}
        icon="mdi:alert-circle-outline"
        cancelText={t('confirm_exit.cancel_btn')}
        confirmText={t('confirm_exit.confirm_btn')}
        confirmVariant="danger"
        onConfirm={() => {
          capiAudio.sfx('click')
          setShowConfirmModal(false)
          onRestart()
          navigate('/')
        }}
      />
    </>
  )
}
