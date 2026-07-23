import React from 'react'
import { useTranslation } from 'react-i18next'
import Button from '../Button.jsx'
import QASection from '../QASection.jsx'
import SceneShell from './SceneShell.jsx'

export default function QAPageLayout({
  imageSrc,
  idx,
  total,
  questionText,
  options,
  selectedValue,
  onSelect,
  onBack,
  onNext,
  backText,
  nextText,
  nextDisabled,
  isFinished,
  imageStyle,
}) {
  const { t } = useTranslation()

  return (
    <SceneShell light className="no-scroll-shell">
      <div
        className="p2-new-layout"
        style={{
          height: '100%',
          padding: 'clamp(20px, 3.5vh, 40px) 48px clamp(16px, 2.5vh, 32px)',
          boxSizing: 'border-box',
          justifyContent: 'space-between',
          maxWidth: '1200px',
        }}
      >
        {/* Dynamic Split Layout */}
        <div className="p1-split-layout">
          <div className="p1-left-illustration">
            <img src={imageSrc} alt="" style={imageStyle} />
          </div>


          <div className="p1-right-content">
            {/* Progress Bar Container */}
            <div className="p1-progress-bar-container">
              <div className="p1-progress-labels">
                <span>
                  {t('common.question_progress', {
                    num: String(idx + 1).padStart(2, '0'),
                    total: String(total).padStart(2, '0'),
                  })}
                </span>
                <span>
                  {t('common.percent_completed', { percent: Math.round((idx / total) * 100) })}
                </span>
              </div>
              <div className="p1-progress-outer">
                <div className="p1-progress-inner" style={{ width: `${(idx / total) * 100}%` }} />
              </div>
            </div>

            <QASection
              key={idx}
              questionText={questionText}
              options={options}
              selectedValue={selectedValue}
              onSelect={onSelect}
            />

            <div className="p2-new-actions" style={{ width: '100%' }}>
              <Button variant="outline" onClick={onBack}>
                {backText || t('common.back_btn') || '← Quay lại'}
              </Button>
              <Button
                variant="solid"
                active={!nextDisabled}
                disabled={nextDisabled}
                onClick={onNext}
              >
                {nextText || (isFinished
                  ? t('common.finish_btn') || 'Hoàn thành →'
                  : t('common.continue_btn') || 'Tiếp tục →')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
