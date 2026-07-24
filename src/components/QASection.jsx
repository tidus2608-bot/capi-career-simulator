import React from 'react'
import Button from './Button.jsx'

export default function QASection({ questionText, options, selectedValue, onSelect }) {
  return (
    <>
      <h3 className="p1-question-text">
        {questionText}
      </h3>
      <div className="p2-options">
        {options.map((opt) => {
          const isSelected =
            selectedValue != null &&
            ((opt.value !== undefined && String(selectedValue) === String(opt.value)) ||
              (opt.label !== undefined && String(selectedValue) === String(opt.label)))
          return (
            <Button
              key={opt.label || opt.value}
              variant="option"
              selected={isSelected}
              onClick={() => onSelect(opt.value !== undefined ? opt.value : opt)}
            >
              {opt.text}
            </Button>
          )
        })}
      </div>
    </>
  )
}
