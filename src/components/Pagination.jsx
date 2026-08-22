import React from 'react'
import { Icon } from '@iconify/react'

/**
 * Shared Pagination component.
 */
export default function Pagination({ current = 1, total = 1, onChange, className = '' }) {
  if (total <= 1) return null

  const validCurrent = Math.min(Math.max(1, current), total)

  return (
    <div
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
      role="navigation"
      aria-label="Pagination"
    >
      {/* First Page */}
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={validCurrent === 1}
        aria-label="First page"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: '#475569',
          color: '#FFFFFF',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: validCurrent === 1 ? 'not-allowed' : 'pointer',
          opacity: validCurrent === 1 ? 0.35 : 1,
          transition: 'all 0.15s ease',
        }}
      >
        <Icon icon="mdi:chevron-double-left" width={18} height={18} />
      </button>

      {/* Prev Page */}
      <button
        type="button"
        onClick={() => onChange(Math.max(1, validCurrent - 1))}
        disabled={validCurrent === 1}
        aria-label="Previous page"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: '#475569',
          color: '#FFFFFF',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: validCurrent === 1 ? 'not-allowed' : 'pointer',
          opacity: validCurrent === 1 ? 0.35 : 1,
          transition: 'all 0.15s ease',
        }}
      >
        <Icon icon="mdi:chevron-left" width={18} height={18} />
      </button>

      {/* Page Numbers */}
      {Array.from({ length: total }, (_, i) => i + 1).map((pageNum) => {
        const isActive = validCurrent === pageNum
        return (
          <button
            key={pageNum}
            type="button"
            onClick={() => onChange(pageNum)}
            aria-current={isActive ? 'page' : undefined}
            style={{
              minWidth: 32,
              height: 32,
              padding: '0 4px',
              fontSize: 14,
              fontWeight: isActive ? 800 : 500,
              color: isActive ? '#843497' : '#64748B',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 6,
            }}
          >
            {String(pageNum).padStart(2, '0')}
          </button>
        )
      })}

      {/* Next Page */}
      <button
        type="button"
        onClick={() => onChange(Math.min(total, validCurrent + 1))}
        disabled={validCurrent === total}
        aria-label="Next page"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: '#843497',
          color: '#FFFFFF',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: validCurrent === total ? 'not-allowed' : 'pointer',
          opacity: validCurrent === total ? 0.35 : 1,
          transition: 'all 0.15s ease',
        }}
      >
        <Icon icon="mdi:chevron-right" width={18} height={18} />
      </button>

      {/* Last Page */}
      <button
        type="button"
        onClick={() => onChange(total)}
        disabled={validCurrent === total}
        aria-label="Last page"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: '#843497',
          color: '#FFFFFF',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: validCurrent === total ? 'not-allowed' : 'pointer',
          opacity: validCurrent === total ? 0.35 : 1,
          transition: 'all 0.15s ease',
        }}
      >
        <Icon icon="mdi:chevron-double-right" width={18} height={18} />
      </button>
    </div>
  )
}
