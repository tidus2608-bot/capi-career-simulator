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
    path !== '/history' &&
    !isCompare &&
    path !== '/feedback' &&
    !path.startsWith('/certificate')

  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleHomeClick = () => {
    capiAudio.sfx('click')
    if (isInProgress) {
      setShowConfirmModal(true)
    } else {
      onRestart()
      navigate('/')
    }
  }

  if (isHome || isSummary || isDetails) {
    return (
      <header className="intro-navbar no-print">
        <div className="intro-navbar-title">
          <span className="intro-navbar-brand--full">Capi Career Path Simulator</span>
          <span className="intro-navbar-brand--short">Capi Career</span>
        </div>
        <div
          className="intro-navbar-controls"
          style={{ display: 'flex', gap: 8, alignItems: 'center' }}
        >
          {isSummary || isDetails ? (
            <>
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
            </>
          ) : (
            <>
              <AdminAuthNav
                supabase={supabase}
                session={session}
                onHistory={user ? () => navigate('/history') : null}
              />
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
            </>
          )}
        </div>
      </header>
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
