import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'

export default function FeedbackInvitationModal({ isOpen, onClose, onAccept }) {
  const { t } = useTranslation()

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        zIndex: 1000,
        animation: 'fadeIn 0.25s ease-out both',
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
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '28px 24px 24px',
          boxShadow: '0 20px 48px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          border: '1px solid #E5E7EB',
          fontFamily: "'Quicksand', 'Plus Jakarta Sans', sans-serif",
          animation: 'fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) both',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <h2
            id="feedback-modal-title"
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 700,
              color: '#1A1A1A',
              lineHeight: 1.3,
            }}
          >
            {t('feedback.modal_header')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('common.cancel')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '8px',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F3F4F6'
              e.currentTarget.style.color = '#111827'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#6B7280'
            }}
          >
            <Icon icon="mdi:close" width={24} height={24} />
          </button>
        </div>

        {/* Content Body */}
        <p
          style={{
            margin: 0,
            fontSize: '16px',
            lineHeight: 1.6,
            color: '#4B5563',
            fontWeight: 500,
          }}
        >
          {t('feedback.modal_content')}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginTop: '8px',
          }}
        >
          <button
            type="button"
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '10px',
              border: '1.5px solid #843497',
              backgroundColor: '#FFFFFF',
              color: '#843497',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#FBF5FD'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF'
            }}
          >
            {t('feedback.modal_btn_no')}
          </button>

          <button
            type="button"
            onClick={onAccept}
            style={{
              flex: 1,
              padding: '12px 18px',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: '#843497',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.18s ease',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(132, 52, 151, 0.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#6B2A7A'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#843497'
            }}
          >
            {t('feedback.modal_btn_survey')}
          </button>
        </div>
      </div>
    </div>
  )
}
