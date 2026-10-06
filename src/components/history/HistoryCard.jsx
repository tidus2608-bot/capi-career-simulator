import React from 'react'
import { Icon } from '@iconify/react'
import { getRoleConfig } from '../../data.js'
import Button from '../Button.jsx'
import CapiImage from '../CapiImage.jsx'
import { formatDateTime } from '../../lib/format.js'
import { getMissionTitle, getMissionPreviewImg } from './historyUtils.js'

export default function HistoryCard({
  run,
  isSelected,
  onToggleCompare,
  onOpenAnswers,
  onOpenReport,
  t,
}) {
  const roleConfig = getRoleConfig(run.primary_role)
  const title = getMissionTitle(run, t)
  const previewImg = getMissionPreviewImg(run)
  const formattedDate = formatDateTime(run.created_at)

  return (
    <div
      className={`history-grid-card fade-up ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onToggleCompare(run.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onToggleCompare(run.id)
        }
      }}
      style={{
        backgroundColor: isSelected ? 'var(--surface-lavender)' : 'var(--surface-light)',
        borderRadius: 20,
        border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--border-light)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: isSelected
          ? '0 0 0 2px var(--color-primary), 0 12px 28px -6px rgba(132, 52, 151, 0.25)'
          : '0 4px 16px -2px rgba(0, 0, 0, 0.03)',
        transition:
          'transform 200ms cubic-bezier(0.16, 1, 0.3, 1), border-color 150ms ease, box-shadow 150ms ease',
        position: 'relative',
        cursor: 'pointer',
      }}
    >
      {/* Top Image Frame with Compare Toggle Pill */}
      <div
        style={{
          height: 175,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: 'var(--surface-subtle)',
        }}
      >
        <CapiImage
          src={previewImg}
          alt={title}
          fallbackSrc="/illos/m1-preview.webp"
          theme="light"
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* Compare Select Checkbox Indicator (Top-Left) */}
        {isSelected ? (
          <div
            aria-label={t('history.selected_for_compare', 'Đã chọn')}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 24,
              height: 24,
              borderRadius: 6,
              backgroundColor: 'var(--color-primary)',
              border: '2px solid var(--color-primary)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(132, 52, 151, 0.4)',
              transition: 'background-color 150ms ease, border-color 150ms ease',
              userSelect: 'none',
            }}
          >
            <Icon icon="mdi:check-bold" width={15} height={15} />
          </div>
        ) : (
          <div
            aria-label={t('history.select_to_compare', 'Chọn so sánh')}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              width: 24,
              height: 24,
              borderRadius: 6,
              backgroundColor: 'rgba(255, 255, 255, 0.94)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '2px solid var(--border-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
              transition: 'border-color 150ms ease, background-color 150ms ease',
              userSelect: 'none',
            }}
          />
        )}
      </div>

      {/* Card Body */}
      <div
        style={{
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Mission Title */}
          <h3
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--ink-dark)',
              lineHeight: 1.35,
              margin: 0,
              minHeight: '2.7em',
              fontFamily: 'var(--font-display)',
            }}
          >
            {title}
          </h3>

          {/* Date & Time */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: 'var(--ink-muted)',
            }}
          >
            <Icon icon="mdi:clock-outline" width={16} height={16} />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Role Badge Container with Role-Specific Micro-Accents */}
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: `1px solid ${isSelected ? 'var(--border-purple)' : 'var(--border-light)'}`,
              borderRadius: 14,
              padding: '10px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.02)',
              transition: 'border-color 150ms ease',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 14.5,
                  fontWeight: 800,
                  color: roleConfig.color,
                  textTransform: 'capitalize',
                  fontFamily: 'var(--font-display)',
                  letterSpacing: '-0.01em',
                }}
              >
                {t(`roles.${roleConfig.key}.name`, roleConfig.name)}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: 'var(--ink-muted)',
                  fontWeight: 500,
                  marginTop: 1,
                }}
              >
                {t('history.primary_role_badge', 'Vai trò chính')}
              </div>
            </div>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: roleConfig.bg,
                color: roleConfig.color,
                border: `1px solid ${roleConfig.color}25`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 2px 8px -1px ${roleConfig.color}20`,
                flexShrink: 0,
              }}
            >
              <Icon icon={roleConfig.icon} width={20} height={20} />
            </div>
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              marginTop: 2,
            }}
          >
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                onOpenAnswers(run)
              }}
              style={{
                padding: '8px 10px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                gap: 4,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span>{t('history.btn_view_answers', 'Xem câu trả lời')}</span>
              <Icon icon="mdi:arrow-top-right" width={15} height={15} />
            </Button>

            <Button
              variant="solid"
              active
              onClick={(e) => {
                e.stopPropagation()
                onOpenReport(run)
              }}
              style={{
                padding: '8px 10px',
                fontSize: 13,
                fontWeight: 600,
                borderRadius: 10,
                gap: 5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span>{t('history.btn_view_report', 'Xem báo cáo')}</span>
              <Icon icon="mdi:eye-outline" width={16} height={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
