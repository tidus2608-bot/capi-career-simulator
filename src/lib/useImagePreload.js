import { useEffect } from 'react'

/**
 * Preload an array of image URLs in the background
 */
export function preloadImages(urls) {
  if (typeof window === 'undefined' || !Array.isArray(urls)) return
  for (const url of urls) {
    if (!url) continue
    const img = new Image()
    img.decoding = 'async'
    img.src = url
  }
}

export function useImagePreload(urls) {
  useEffect(() => {
    preloadImages(urls)
  }, [urls])
}
