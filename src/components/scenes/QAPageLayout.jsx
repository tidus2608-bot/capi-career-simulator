import React, { useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import QASection from '../QASection.jsx'
import CapiImage from '../CapiImage.jsx'
import SceneShell from './SceneShell.jsx'

export default function QAPageLayout({
  imageSrc,
  fallbackImageSrc,
  idx,
  total,
  chapterBadge,
  questionText,
  options,
  selectedValue,
  onSelect,
  onBack,
  onNext,
  canGoNext = false,
  backText,
  nextText,
  coverImage = false,
  autoAdvance = true,
  autoAdvanceDelay = 280,
}) {
  const { t } = useTranslation()
  const timerRef = useRef(null)
  const onNextRef = useRef(onNext)
  const onBackRef = useRef(onBack)

  useEffect(() => {
    onNextRef.current = onNext
  }, [onNext])

  useEffect(() => {
    onBackRef.current = onBack
  }, [onBack])

  // Clear timer when question index changes or on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [idx])

  // Reset scroll to top on question transition for mobile reading UX
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [idx])

  const handleNext = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    onNextRef.current?.()
  }, [])

  const handleBack = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    onBackRef.current?.()
  }, [])

  const handleSelect = useCallback(
    (val) => {
      onSelect(val)
      if (autoAdvance) {
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        timerRef.current = setTimeout(() => {
          timerRef.current = null
          onNextRef.current?.()
        }, autoAdvanceDelay)
      }
    },
    [onSelect, autoAdvance, autoAdvanceDelay],
  )

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target?.isContentEditable
      ) {
        return
      }

      if (e.key === 'ArrowLeft') {
        if (idx > 0) {
          e.preventDefault()
          handleBack()
        }
        return
      }

      if (e.key === 'ArrowRight') {
        if (canGoNext) {
          e.preventDefault()
          handleNext()
        }
        return
      }

      if (e.key === 'Enter') {
        if (canGoNext || (selectedValue !== null && selectedValue !== undefined)) {
          e.preventDefault()
          handleNext()
        }
        return
      }

      // Digit keys 1-9
      const num = parseInt(e.key, 10)
      if (!isNaN(num) && num >= 1 && num <= 9) {
        const matchByValue = options.find((opt) => opt.value === num)
        const matchByHotkey = options.find((opt) => String(opt.hotkey) === e.key)
        const matchByIndex = options[num - 1]
        const targetOpt = matchByValue || matchByHotkey || matchByIndex
        if (targetOpt) {
          e.preventDefault()
          const val =
            targetOpt.value !== undefined
              ? targetOpt.value
              : targetOpt.label !== undefined
                ? targetOpt.label
                : targetOpt
          handleSelect(val)
          return
        }
      }

      // Character keys A-Z
      if (e.key.length === 1 && ((e.key >= 'a' && e.key <= 'z') || (e.key >= 'A' && e.key <= 'Z'))) {
        const upper = e.key.toUpperCase()
        const match = options.find((opt) => opt.label === upper || opt.hotkey === upper)
        if (match) {
          e.preventDefault()
          const val =
            match.value !== undefined
              ? match.value
              : match.label !== undefined
                ? match.label
                : match
          handleSelect(val)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [options, selectedValue, canGoNext, idx, handleBack, handleNext, handleSelect])

  return (
    <SceneShell light>
      <div className="p2-new-layout qa-page-layout">
        {/* Dynamic Split Layout */}
        <div className="p1-split-layout">
          <div
            className={`p1-left-illustration ${coverImage ? 'p1-left-illustration--cover' : ''}`}
          >
            <CapiImage
              src={imageSrc}
              fallbackSrc={fallbackImageSrc}
              alt=""
              theme="light"
              priority
              style={
                coverImage
                  ? { maxHeight: 'calc(100dvh - 124px)', width: 'auto' }
                  : { height: '100%' }
              }
            />
          </div>

          <div className="p1-right-content">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'clamp(14px, 2vh, 20px)',
                width: '100%',
              }}
            >
              {/* Unified Header & Stepper */}
              <div className="qa-top-nav-bar">
                <div className="qa-top-bar">
                  {chapterBadge && (
                    <div className="qa-top-bar-left">
                      <span className="p2-chapter-badge">{chapterBadge}</span>
                    </div>
                  )}

                  <div className="qa-stepper">
                    {idx > 0 && (
                      <button
                        type="button"
                        className="qa-stepper-btn qa-stepper-btn--back"
                        onClick={handleBack}
                        aria-label={backText || t('common.back_btn') || 'Quay lại'}
                        title="Câu trước (←)"
                      >
                        <Icon icon="mdi:chevron-left" width={18} height={18} />
                      </button>
                    )}

                    <span className="qa-stepper-count">
                      <span className="qa-stepper-current">{String(idx + 1).padStart(2, '0')}</span>
                      <span className="qa-stepper-sep">/</span>
                      <span className="qa-stepper-total">{String(total).padStart(2, '0')}</span>
                    </span>

                    {canGoNext && (
                      <button
                        type="button"
                        className="qa-stepper-btn qa-stepper-btn--next"
                        onClick={handleNext}
                        aria-label={nextText || t('common.next_btn') || 'Tiếp theo'}
                        title="Câu tiếp theo (→)"
                      >
                        <Icon icon="mdi:chevron-right" width={18} height={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className="qa-progress-line"
                  role="progressbar"
                  aria-valuenow={total > 0 ? Math.round(((idx + 1) / total) * 100) : 0}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="qa-progress-fill"
                    style={{
                      width: `${total > 0 ? Math.round(((idx + 1) / total) * 100) : 0}%`,
                    }}
                  />
                </div>
              </div>

              <QASection
                key={idx}
                questionText={questionText}
                options={options}
                selectedValue={selectedValue}
                onSelect={handleSelect}
              />
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
