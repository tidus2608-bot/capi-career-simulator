import React from 'react'

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
            SYSTEM FAULT
          </div>
          <h1 style={{ fontSize: 32, margin: '0 0 12px', lineHeight: 1.2 }}>Capi gặp sự cố</h1>
          <p style={{ color: '#9aa0b4', lineHeight: 1.6, marginBottom: 24 }}>
            Một lỗi không mong muốn vừa xảy ra. Bạn có thể khởi động lại để tiếp tục — kết quả đã
            lưu trước đó vẫn an toàn trong tài khoản của bạn.
          </p>
          {this.state.error?.message && (
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
              {String(this.state.error.message)}
            </pre>
          )}
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
            style={{ padding: '12px 28px', fontSize: 14 }}
          >
            Khởi động lại
          </button>
        </div>
      </div>
    )
  }
}
