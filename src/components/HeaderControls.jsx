import React from 'react'
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
  const { user, session } = useWizard()
  const path = location.pathname

  const isHome = path === '/'
  const isSummary = path === '/certificate/summary'
  const isDetails = path === '/certificate/details'

  const audioIcon = (
    <Icon
      icon={muted ? 'mdi:volume-off' : 'mdi:volume-high'}
      width={20}
      height={20}
    />
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

  const handleHomeClick = () => {
    capiAudio.sfx('click')
    navigate('/')
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
              <Button
                variant="outline"
                style={circleButtonStyle}
                title={t('common.save') || 'Lưu'}
              >
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
    </>
  )
}
