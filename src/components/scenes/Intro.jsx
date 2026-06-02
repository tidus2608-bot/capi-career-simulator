import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Capi from '../Capi.jsx'
import { capiAudio } from '../../audio.js'
import SceneShell from './SceneShell.jsx'

export default function IntroScene({ onStart, user, authLoading, supabase }) {
  const [signingIn, setSigningIn] = useState(false)
  const { t } = useTranslation()

  const signIn = async () => {
    setSigningIn(true)
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      })
    } catch {
      setSigningIn(false)
    }
  }

  return (
    <SceneShell light>
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100%', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 680 }} className="fade-up">

          <div className="mono" style={{ color: '#843497', marginBottom: 16 }}>
            {t('intro.tagline')}
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px,5.5vw,62px)',
              fontWeight: 800,
              lineHeight: 1.08,
              margin: '0 0 8px',
              letterSpacing: '-0.02em',
              color: '#1a1a2e',
            }}
          >
            {t('intro.title_prefix')}{' '}
            <span style={{ color: '#843497' }}>{t('intro.title_highlight')}</span>{' '}
            {t('intro.title_suffix')}
          </h1>

          <div
            className="mono"
            style={{ color: '#9ca3af', letterSpacing: '0.18em', fontSize: 12, marginBottom: 36 }}
          >
            {t('intro.subtitle')}
          </div>

          {/* Capi avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 28px', position: 'relative' }}>
            <div style={{ position: 'relative', width: 200, height: 200 }}>
              <div className="pulse-ring" />
              <div className="pulse-ring d1" />
              <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
                <Capi outfit="lab" pose="idle" size={170} />
              </div>
            </div>
          </div>

          <p style={{ fontSize: 16, lineHeight: 1.65, color: '#6b7280', maxWidth: 580, margin: '0 auto 28px' }}>
            <Trans
              i18nKey="intro.blurb"
              components={{ em: <em style={{ color: '#843497', fontStyle: 'normal', fontWeight: 600 }} /> }}
            />
          </p>

          {authLoading ? (
            <div className="mono" style={{ color: '#9ca3af', marginBottom: 16 }}>
              {t('intro.auth_loading')}
            </div>
          ) : user ? (
            <div>
              <div style={{ color: '#16a34a', fontSize: 14, marginBottom: 16, fontWeight: 500 }}>
                ✓{' '}
                {t('intro.auth_signed_in', {
                  name: user.user_metadata?.full_name || user.email,
                })}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => { capiAudio.sfx('confirm'); onStart() }}
              >
                {t('intro.btn_start')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={signIn} disabled={signingIn}>
                {signingIn ? t('intro.btn_signin_pending') : t('intro.btn_signin')}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => { capiAudio.sfx('confirm'); onStart() }}
              >
                {t('intro.btn_play_guest')}
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: 32,
              display: 'flex',
              gap: 10,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {['feature_phase1', 'feature_mission', 'feature_roles', 'feature_cert'].map((key) => (
              <span key={key} className="pill">{t(`intro.${key}`)}</span>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
