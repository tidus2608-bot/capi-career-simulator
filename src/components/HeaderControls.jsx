import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { capiAudio } from '../audio.js'
import LanguageSwitch from './LanguageSwitch.jsx'
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

  const TRANSLATED_PATHS = new Set([
    '/',
    '/capi-gene-info',
    '/scan',
    '/role-reveal',
    '/theme',
    '/mission-pick',
    '/certificate',
    '/history',
  ])

  const showLanguage = TRANSLATED_PATHS.has(path)
  const showHome = !isHome

  const handleHomeClick = () => {
    capiAudio.sfx('click')
    navigate('/')
  }

  const audioIcon = muted ? (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="22" y1="9" x2="16" y2="15" />
      <line x1="16" y1="9" x2="22" y2="15" />
    </svg>
  ) : (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </svg>
  )

  if (isHome) {
    return (
      <div
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
          <AdminAuthNav
            supabase={supabase}
            session={session}
            onHistory={user ? () => navigate('/history') : null}
          />
          <LanguageSwitch />
          <button
            className="audio-toggle"
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
          </button>
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
          <button
            className="p2-btn-outline"
            style={{
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
            }}
            onClick={handleHomeClick}
            title={t('common.back_to_home') || 'Về trang chủ'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </button>
        )}
        {showLanguage && <LanguageSwitch />}
      </div>

      {/* Top-Right Audio Toggle */}
      <button
        className="audio-toggle"
        title={muted ? t('common.audio_on') : t('common.audio_off')}
        aria-label={muted ? t('common.audio_on') : t('common.audio_off')}
        aria-pressed={muted}
        onClick={toggleMute}
      >
        {audioIcon}
      </button>
    </>
  )
}
