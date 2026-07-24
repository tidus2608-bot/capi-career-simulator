import { useEffect, useRef } from 'react'

/* Capi mascot — image-based capybara character */
/* <Capi outfit="lab|astronaut|eco|medic|rescue|intern" pose="idle|talk|cheer|wave" size={180} /> */

const POSE_IMAGE = {
  idle: '/capi/capi-8.webp',
  talk: '/capi/capi-7.webp',
  cheer: '/capi/capi-11.webp',
  wave: '/capi/capi-0.webp',
}

const Capi = ({ pose = 'idle', size = 180, style = {} }) => {
  const imgRef = useRef(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    let rafId = null
    const start = performance.now()
    const animate = (ts) => {
      const t = (ts - start) / 1000
      const offset = Math.sin(t * 2 * Math.PI * 0.35) * 2.5
      el.style.transform = `translateY(${offset}px)`
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const src = POSE_IMAGE[pose] || POSE_IMAGE.idle

  return (
    <img
      ref={imgRef}
      src={src}
      alt="Capi"
      width={size}
      height={size}
      style={{ display: 'block', objectFit: 'contain', transition: 'none', ...style }}
      draggable={false}
    />
  )
}

export default Capi
