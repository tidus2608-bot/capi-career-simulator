import React from 'react'

export default function QASection({ questionText, options, selectedValue, onSelect }) {
  return (
    <>
      <h3 className="p1-question-text" style={{ marginBottom: 20 }}>
        {questionText}
      </h3>
      <div className="p2-options">
        {options.map((opt) => {
          const isSelected = selectedValue === opt.value || selectedValue === opt.label
          return (
            <button
              key={opt.label || opt.value}
              className={`p2-option ${isSelected ? 'p2-selected' : ''}`}
              onClick={() => onSelect(opt.value !== undefined ? opt.value : opt)}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  background: isSelected ? '#843497' : '#f3f4f6',
                  color: isSelected ? '#fff' : '#6b7280',
                  fontSize: 11,
                  fontWeight: 700,
                  marginRight: 10,
                  flexShrink: 0,
                }}
              >
                {opt.label || opt.value}
              </span>
              {opt.text}
            </button>
          )
        })}
      </div>
    </>
  )
}
