import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from './Button.jsx'

function Fallback({ message }) {
  const { t } = useTranslation()
  return (
    <div className="error-boundary-shell">
      <div className="error-boundary-card">
        <div className="mono error-boundary-fault">{t('error_boundary.system_fault')}</div>
        <h1 className="error-boundary-title">{t('error_boundary.title')}</h1>
        <p className="error-boundary-body">{t('error_boundary.body')}</p>
        {message && <pre className="error-boundary-pre">{message}</pre>}
        <div className="error-boundary-actions">
          <Button
            variant="solid"
            active
            onClick={() => window.location.reload()}
            className="error-boundary-btn"
          >
            {t('error_boundary.btn_restart', 'Khởi động lại')}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              try {
                localStorage.clear()
              } catch (e) {
                console.warn(e)
              }
              window.location.href = '/'
            }}
            className="error-boundary-btn error-boundary-btn--outline"
          >
            {t('error_boundary.btn_reset_cache', 'Xóa bộ nhớ đệm & Bắt đầu lại')}
          </Button>
        </div>
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
