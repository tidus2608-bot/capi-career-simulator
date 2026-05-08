import { useState, useEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import Capi from '../Capi.jsx'
import { capiAudio } from '../../audio.js'
import SceneShell from './SceneShell.jsx'

export default function IntroScene({ onStart, user, authLoading, supabase }) {
  const [signingIn, setSigningIn] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    capiAudio.pad([110, 164.8, 220, 329.6], 'cold')
  }, [])

  const signIn = async () => {
    setSigningIn(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  return (
    <SceneShell>
      <div style={{ display: 'grid', placeItems: 'center', height: '100%', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 780 }} className="fade-up">
          <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 18 }}>
            {t('intro.tagline')}
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px,6vw,68px)',
              fontWeight: 700,
              lineHeight: 1.05,
              margin: '0 0 10px',
              letterSpacing: '-0.02em',
            }}
          >
            {t('intro.title_prefix')}{' '}
            <span
              style={{
                background: 'linear-gradient(90deg,#00e5ff,#ff2d7a)',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {t('intro.title_highlight')}
            </span>{' '}
            {t('intro.title_suffix')}
          </h1>
          <div
            className="mono"
            style={{
              color: 'var(--ink-dim)',
              letterSpacing: '0.2em',
              fontSize: 13,
              marginBottom: 40,
            }}
          >
            {t('intro.subtitle')}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              margin: '20px 0 32px',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative', width: 220, height: 220 }}>
              <div className="pulse-ring" />
              <div className="pulse-ring d1" />
              <div className="pulse-ring d2" />
              <div
                style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}
              >
                <Capi outfit="lab" pose="idle" size={180} />
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'var(--ink-dim)',
              maxWidth: 620,
              margin: '0 auto 32px',
            }}
          >
            <Trans
              i18nKey="intro.blurb"
              components={{ em: <em style={{ color: 'var(--cyan)', fontStyle: 'normal' }} /> }}
            />
          </p>

          {authLoading ? (
            <div className="mono" style={{ color: 'var(--ink-mute)', marginBottom: 16 }}>
              {t('intro.auth_loading')}
            </div>
          ) : user ? (
            <div>
              <div className="mono" style={{ color: 'var(--green)', marginBottom: 16 }}>
                ✓{' '}
                {t('intro.auth_signed_in', {
                  name: user.user_metadata?.full_name || user.email,
                })}
              </div>
              <button
                className="btn btn-primary"
                onClick={() => {
                  capiAudio.sfx('confirm')
                  onStart()
                }}
              >
                {t('intro.btn_start')}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={signIn} disabled={signingIn}>
                {signingIn ? t('intro.btn_signin_pending') : t('intro.btn_signin')}
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => {
                  capiAudio.sfx('confirm')
                  onStart()
                }}
              >
                {t('intro.btn_play_guest')}
              </button>
            </div>
          )}

          <div
            style={{
              marginTop: 36,
              display: 'flex',
              gap: 18,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {['feature_phase1', 'feature_mission', 'feature_roles', 'feature_cert'].map((key) => (
              <span key={key} className="pill">
                {t(`intro.${key}`)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
