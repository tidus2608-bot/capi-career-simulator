import React from 'react'
import { Icon } from '@iconify/react'
import Button from '../Button.jsx'

export default function LoginPrompt({ handleLogin, t }) {
  return (
    <div
      className="glass fade-up"
      style={{
        padding: '60px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        borderRadius: 24,
        backgroundColor: 'var(--surface-light)',
        border: '1.5px solid var(--border-light)',
        maxWidth: 500,
        margin: '40px auto 0 auto',
        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          backgroundColor: 'var(--surface-lavender)',
          border: '1px solid var(--border-purple)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-primary)',
          marginBottom: 8,
        }}
      >
        <Icon icon="mdi:lock-outline" width={32} height={32} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h3
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: 'var(--ink-dark)',
            margin: 0,
            fontFamily: 'var(--font-display)',
          }}
        >
          {t('history.login_required_title', 'Yêu cầu đăng nhập')}
        </h3>
        <p
          style={{
            fontSize: 15,
            color: 'var(--ink-secondary)',
            margin: 0,
            lineHeight: 1.5,
            maxWidth: '35ch',
          }}
        >
          {t('history.login_required_desc')}
        </p>
      </div>

      <Button
        variant="solid"
        active
        onClick={handleLogin}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: '12px 24px',
          borderRadius: 12,
          fontWeight: 600,
          fontSize: 15,
          width: '100%',
        }}
      >
        <Icon icon="mdi:google" width={20} height={20} />
        <span>{t('history.btn_login')}</span>
      </Button>
    </div>
  )
}
