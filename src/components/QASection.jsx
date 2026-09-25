import React from 'react'
import Button from './Button.jsx'

export default function QASection({
  questionText,
  options,
  selectedValue,
  onSelect,
  showHotkeys = true,
}) {
  return (
    <>
      <h3 className="p1-question-text">{questionText}</h3>
      <div className="p2-options">
        {options.map((opt, i) => {
          const isSelected =
            selectedValue != null &&
            ((opt.value !== undefined && String(selectedValue) === String(opt.value)) ||
              (opt.label !== undefined && String(selectedValue) === String(opt.label)))
          const hotkeyBadge =
            opt.hotkey || opt.label || (opt.value !== undefined ? opt.value : i + 1)

          return (
            <Button
              key={opt.label || opt.value || i}
              variant="option"
              selected={isSelected}
              onClick={() =>
                onSelect(
                  opt.value !== undefined
                    ? opt.value
                    : opt.label !== undefined
                      ? opt.label
                      : opt,
                )
              }
            >
              {showHotkeys && hotkeyBadge && (
                <span className="p2-option-hotkey" aria-hidden="true">
                  {hotkeyBadge}
                </span>
              )}
              <span className="p2-option-text">{opt.text}</span>
            </Button>
          )
        })}
      </div>
    </>
  )
}
