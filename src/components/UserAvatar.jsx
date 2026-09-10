import React, { useState } from 'react'
import { Icon } from '@iconify/react'

/**
 * Robust UserAvatar component for OAuth/profile pictures:
 * - Includes referrerPolicy="no-referrer" to prevent tracking-protection/CORS network errors
 * - Automatically falls back to an account icon if the image fails to load
 * - Fully accessible and responsive
 */
export default function UserAvatar({
  src,
  alt = '',
  className = '',
  style = {},
  fallbackClassName = '',
  fallbackStyle = {},
  iconSize = 18,
}) {
  const [error, setError] = useState(false)
  const [prevSrc, setPrevSrc] = useState(src)

  if (prevSrc !== src) {
    setPrevSrc(src)
    setError(false)
  }

  if (src && !error) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        referrerPolicy="no-referrer"
        onError={() => setError(true)}
      />
    )
  }

  return (
    <div className={fallbackClassName} style={fallbackStyle}>
      <Icon icon="mdi:account" width={iconSize} height={iconSize} />
    </div>
  )
}
