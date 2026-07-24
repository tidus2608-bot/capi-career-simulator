import React from 'react'

export default function Button({
  children,
  variant = 'solid', // 'solid' | 'outline' | 'ghost' | 'option' | 'icon'
  active = false,
  selected = false,
  disabled = false,
  className = '',
  style,
  ...props
}) {
  let baseClass = ''

  switch (variant) {
    case 'outline':
      baseClass = 'p2-btn-outline'
      break
    case 'ghost':
      baseClass = 'btn btn-ghost'
      break
    case 'option':
      baseClass = `p2-option ${selected ? 'p2-selected' : ''}`
      break
    case 'icon':
      baseClass = 'audio-toggle'
      break
    case 'solid':
    case 'primary':
    default:
      baseClass = `p2-btn-solid ${active ? 'active' : ''}`
      break
  }

  const combinedClassName = `${baseClass} ${className}`.trim()

  return (
    <button className={combinedClassName} disabled={disabled} style={style} {...props}>
      {children}
    </button>
  )
}
