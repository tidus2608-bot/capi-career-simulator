import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button.jsx'

function Fallback({ message }) {
  const { t } = useTranslation()
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'grid',
        placeItems: 'center',
        padding: 24,
        background: '#0b0b14',
        color: '#e8eaf2',
        fontFamily: 'var(--font-display, sans-serif)',
      }}
    >
      <div style={{ maxWidth: 520, textAlign: 'center' }}>
        <div
          className="mono"
          style={{ color: '#ff2d7a', letterSpacing: '4px', marginBottom: 16, fontSize: 13 }}
        >
          {t('error_boundary.system_fault')}
        </div>
        <h1 style={{ fontSize: 32, margin: '0 0 12px', lineHeight: 1.2 }}>
          {t('error_boundary.title')}
        </h1>
        <p style={{ color: '#9aa0b4', lineHeight: 1.6, marginBottom: 24 }}>
          {t('error_boundary.body')}
        </p>
        {message && (
          <pre
            style={{
              textAlign: 'left',
              background: 'rgba(255,255,255,0.04)',
              padding: 12,
              borderRadius: 8,
              fontSize: 11,
              color: '#9aa0b4',
              overflow: 'auto',
              maxHeight: 160,
              marginBottom: 24,
            }}
          >
            {message}
          </pre>
        )}
        <Button
          variant="solid"
          active
          onClick={() => window.location.reload()}
          style={{ padding: '12px 28px', fontSize: 14 }}
        >
          {t('error_boundary.btn_restart')}
        </Button>
      </div>
    </div>
  )
}

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Capi crashed:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children
    return (
      <Fallback message={this.state.error?.message ? String(this.state.error.message) : null} />
    )
  }
}
