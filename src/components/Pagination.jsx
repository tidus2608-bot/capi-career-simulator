import React from 'react'
import { Icon } from '@iconify/react'

/**
 * Calculates responsive pagination items with ellipsis when total > 5.
 * Always produces at most 5 items for a compact, mobile-friendly layout.
 */
function getPaginationItems(current, total) {
  if (total <= 5) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  if (current <= 3) {
    return [1, 2, 3, 'ellipsis-end', total]
  }
  if (current >= total - 2) {
    return [1, 'ellipsis-start', total - 2, total - 1, total]
  }
  return [1, 'ellipsis-start', current, 'ellipsis-end', total]
}

/**
 * Shared Pagination component.
 */
export default function Pagination({ current = 1, total = 1, onChange, className = '' }) {
  if (total <= 1) return null

  const validCurrent = Math.min(Math.max(1, current), total)
  const pageItems = getPaginationItems(validCurrent, total)

  return (
    <div
      className={`pagination-container ${className}`.trim()}
      role="navigation"
      aria-label="Pagination"
    >
      {/* First Page */}
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={validCurrent === 1}
        aria-label="First page"
        className="pagination-nav-btn pagination-nav-btn--first"
      >
        <Icon icon="mdi:chevron-double-left" width={18} height={18} />
      </button>

      {/* Prev Page */}
      <button
        type="button"
        onClick={() => onChange(Math.max(1, validCurrent - 1))}
        disabled={validCurrent === 1}
        aria-label="Previous page"
        className="pagination-nav-btn pagination-nav-btn--prev"
      >
        <Icon icon="mdi:chevron-left" width={18} height={18} />
      </button>

      {/* Page Numbers & Ellipses */}
      {pageItems.map((item, idx) => {
        if (typeof item === 'string') {
          return (
            <span
              key={`ellipsis-${item}-${idx}`}
              className="pagination-ellipsis"
              aria-hidden="true"
            >
              …
            </span>
          )
        }

        const isActive = validCurrent === item
        return (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={isActive ? 'page' : undefined}
            className={`pagination-page-btn ${isActive ? 'is-active' : ''}`}
          >
            {String(item).padStart(2, '0')}
          </button>
        )
      })}

      {/* Next Page */}
      <button
        type="button"
        onClick={() => onChange(Math.min(total, validCurrent + 1))}
        disabled={validCurrent === total}
        aria-label="Next page"
        className="pagination-nav-btn pagination-nav-btn--next"
      >
        <Icon icon="mdi:chevron-right" width={18} height={18} />
      </button>

      {/* Last Page */}
      <button
        type="button"
        onClick={() => onChange(total)}
        disabled={validCurrent === total}
        aria-label="Last page"
        className="pagination-nav-btn pagination-nav-btn--last"
      >
        <Icon icon="mdi:chevron-double-right" width={18} height={18} />
      </button>
    </div>
  )
}
