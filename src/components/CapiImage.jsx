import React, { useState } from 'react'

/**
 * Unified, Zero-CLS Image Component
 * - Preserves aspect-ratio / dimensions to eliminate layout shifts (CLS = 0)
 * - Native lazy-loading & asynchronous decoding by default
 * - Opt-in priority loading for hero/LCP images
 * - Skeleton shimmer placeholder during loading with smooth fade-in
 * - Graceful fallback on load error
 */
export default function CapiImage({
  src,
  alt = '',
  aspectRatio,
  width,
  height,
  className = '',
  imgClassName = '',
  style = {},
  imgStyle = {},
  priority = false,
  fallbackSrc,
  theme = 'dark',
  objectFit = 'cover',
  onLoad,
  onError,
  ...props
}) {
  const [prevSrc, setPrevSrc] = useState(src)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  if (prevSrc !== src) {
    setPrevSrc(src)
    setCurrentSrc(src)
    setLoaded(false)
    setError(false)
  }

  const handleLoad = (e) => {
    setLoaded(true)
    if (onLoad) onLoad(e)
  }

  const handleError = (e) => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc)
      setError(false)
    } else {
      setError(true)
    }
    if (onError) onError(e)
  }

  const containerStyle = {
    ...(aspectRatio ? { aspectRatio } : {}),
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  }

  return (
    <div className={`capi-img-container ${className}`.trim()} style={containerStyle}>
      {!loaded && !error && (
        <div
          className={`capi-img-skeleton ${theme === 'light' ? 'capi-img-skeleton--light' : ''}`}
          aria-hidden="true"
        />
      )}
      {!error ? (
        <img
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={handleLoad}
          onError={handleError}
          className={`capi-img-element ${loaded ? 'capi-img-element--loaded' : 'capi-img-element--loading'} ${imgClassName}`.trim()}
          style={{ objectFit, ...imgStyle }}
          {...props}
        />
      ) : (
        <div
          className="capi-img-fallback"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme === 'light' ? '#f1f5f9' : 'rgba(255, 255, 255, 0.05)',
            color: '#94a3b8',
            fontSize: '12px',
          }}
        >
          {alt || '—'}
        </div>
      )}
    </div>
  )
}
