import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { capiAudio } from '../audio.js'
import LanguageSwitch from './LanguageSwitch.jsx'
import Button from './Button.jsx'
import AdminAuthNav from './AdminAuthNav.jsx'
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
  ])

  const showLanguage = TRANSLATED_PATHS.has(path)
  const showHome = !isHome && path !== '/certificate/loading'

  const isInProgress =
    path !== '/' &&
    path !== '/capi-gene-info' &&
    path !== '/history' &&
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

  const handleShare = () => {
    capiAudio.sfx('click')
    if (navigator.share) {
      navigator.share({ title: 'Mật mã Capi-Gene', url: window.location.href })
    }
  }

  const circleButtonStyle = {
    width: 38,
    height: 38,
    borderRadius: '50%',
    padding: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #e5e7eb',
    background: '#fff',
    flexShrink: 0,
  }

  if (isHome || isSummary || isDetails) {
    return (
      <div
        className="no-print"
        style={{
          position: 'fixed',
          top: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 48px)',
          maxWidth: 1200,
          height: 72,
          background: '#fff',
          borderRadius: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px 0 32px',
          zIndex: 100,
          boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: '#1a1a2e',
          }}
        >
          Capi Career Path Simulator
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
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
                style={circleButtonStyle}
                onClick={handleHomeClick}
                title={t('common.back_to_home') || 'Về trang chủ'}
              >
                <Icon icon="mdi:home-outline" width={20} height={20} />
              </Button>
              <Button
                variant="outline"
                style={circleButtonStyle}
                onClick={handleShare}
                title={t('common.share') || 'Chia sẻ'}
              >
                <Icon icon="mdi:share-variant-outline" width={20} height={20} />
              </Button>
              <Button variant="outline" style={circleButtonStyle} title={t('common.save') || 'Lưu'}>
                <Icon icon="mdi:bookmark-outline" width={20} height={20} />
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
      </div>
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
        {showHome && (
          <Button
            variant="outline"
            style={circleButtonStyle}
            onClick={handleHomeClick}
            title={t('common.back_to_home') || 'Về trang chủ'}
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
      {showConfirmModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
          <div
            className="glass fade-up"
            style={{
              width: '100%',
              maxWidth: 440,
              backgroundColor: '#FFFFFF',
              borderRadius: 24,
              padding: '32px 24px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 24,
              boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.15)',
              margin: '0 20px',
            }}
          >
            {/* Warning Icon */}
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: '#FEF2F2',
              color: '#EF4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Icon icon="mdi:alert-circle-outline" width={28} height={28} />
            </div>

            {/* Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <h3 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 700,
                color: '#0F172A',
                margin: 0,
              }}>
                {t('confirm_exit.title', 'Dừng tiến trình?')}
              </h3>
              <p style={{
                fontSize: 15,
                color: '#64748B',
                margin: 0,
                lineHeight: 1.5,
              }}>
                {t('confirm_exit.desc', 'Tiến trình làm bài hiện tại của bạn sẽ bị hủy và không được lưu lại. Bạn có chắc chắn muốn quay về trang chủ?')}
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, width: '100%' }}>
              <Button
                variant="outline"
                onClick={() => {
                  capiAudio.sfx('click')
                  setShowConfirmModal(false)
                }}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  borderColor: '#CBD5E1',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: 14,
                  backgroundColor: '#FFFFFF',
                  width: 'auto',
                  flexGrow: 1,
                }}
              >
                {t('common.cancel', 'Hủy')}
              </Button>
              <Button
                variant="solid"
                active
                onClick={() => {
                  capiAudio.sfx('click')
                  setShowConfirmModal(false)
                  onRestart()
                  navigate('/')
                }}
                style={{
                  flex: 1,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: '#EF4444',
                  color: '#FFFFFF',
                  fontWeight: 600,
                  fontSize: 14,
                  border: 'none',
                }}
              >
                {t('confirm_exit.confirm_btn', 'Dừng chơi')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
