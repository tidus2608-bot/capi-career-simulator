import React, { useEffect } from 'react'
import { Icon } from '@iconify/react'

/**
 * Reusable modal dialog with backdrop, ESC handler, and accessible structure.
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  icon,
  confirmText,
  onConfirm,
  confirmVariant = 'primary', // 'primary' | 'danger'
  confirmDisabled = false,
  cancelText,
  maxWidth = '460px',
  className = '',
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <button
        type="button"
        aria-label="Backdrop"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'transparent',
          border: 'none',
          cursor: 'default',
        }}
      />
      <div
        className={className}
        style={{
          width: '100%',
          maxWidth,
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          padding: '28px 24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {icon && (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: confirmVariant === 'danger' ? '#FEE2E2' : '#F3E8FF',
              color: confirmVariant === 'danger' ? '#EF4444' : '#843497',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            {typeof icon === 'string' ? <Icon icon={icon} width={28} height={28} /> : icon}
          </div>
        )}

        {title && (
          <h3
            id="modal-title"
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#0F172A',
              margin: '0 0 8px 0',
              fontFamily: 'inherit',
            }}
          >
            {title}
          </h3>
        )}

        {description && (
          <p
            style={{
              fontSize: '14px',
              color: '#64748B',
              margin: '0 0 20px 0',
              lineHeight: 1.5,
            }}
          >
            {description}
          </p>
        )}

        {children}

        {(confirmText || cancelText) && (
          <div
            style={{
              display: 'flex',
              gap: '12px',
              width: '100%',
              marginTop: children ? 20 : 0,
            }}
          >
            {cancelText && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {cancelText}
              </button>
            )}

            {confirmText && (
              <button
                type="button"
                disabled={confirmDisabled}
                onClick={onConfirm}
                style={{
                  flex: 1,
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  backgroundColor: confirmVariant === 'danger' ? '#EF4444' : '#843497',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: confirmDisabled ? 'not-allowed' : 'pointer',
                  opacity: confirmDisabled ? 0.5 : 1,
                  transition: 'all 0.15s ease',
                  boxShadow:
                    confirmVariant === 'danger'
                      ? '0 4px 12px rgba(239, 68, 68, 0.25)'
                      : '0 4px 12px rgba(132, 52, 151, 0.25)',
                }}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
