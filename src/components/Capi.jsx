import React from 'react'

/* Capi mascot — image-based capybara character */
/* <Capi outfit="lab|astronaut|eco|medic|rescue|intern" pose="idle|talk|cheer|wave" size={180} /> */

const POSE_IMAGE = {
  idle: '/capi/capi-8.webp',
  talk: '/capi/capi-7.webp',
  cheer: '/capi/capi-11.webp',
  wave: '/capi/capi-0.webp',
}

const Capi = ({ pose = 'idle', size = 180, style = {}, className = '' }) => {
  const src = POSE_IMAGE[pose] || POSE_IMAGE.idle

  return (
    <img
      src={src}
      alt="Capi"
      width={size}
      height={size}
      className={`capi-mascot-float ${className}`.trim()}
      style={{ display: 'block', objectFit: 'contain', ...style }}
      draggable={false}
      loading="lazy"
      decoding="async"
    />
  )
}

export default Capi
