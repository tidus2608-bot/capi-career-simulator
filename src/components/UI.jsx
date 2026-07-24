import React, { useState, useEffect, useRef } from 'react'
import { Icon } from '@iconify/react'
import { CAPI_ROLES } from '../data.js'


export const Typed = ({ text, speed = 22, onDone = () => {}, className = '' }) => {
  const [state, setState] = useState({ text, pos: 0, done: false })
  const onDoneRef = useRef(onDone)
  useEffect(() => {
    onDoneRef.current = onDone
  })

  // Reset position when text prop changes (derived-state pattern, runs before paint)
  if (state.text !== text) {
    setState({ text, pos: 0, done: false })
  }

  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        if (s.text !== text) return s
        const pos = s.pos + 1
        if (pos >= text.length) {
          clearInterval(id)
          onDoneRef.current()
          return { ...s, pos, done: true }
        }
        return { ...s, pos }
      })
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])

  return (
    <span className={`typed ${state.done ? 'done' : ''} ${className}`}>
      {text.slice(0, state.pos)}
    </span>
  )
}


const ROLE_MDI_ICONS = {
  explorer: 'mdi:compass-outline',
  builder: 'mdi:hammer-wrench',
  operator: 'mdi:cog-outline',
  connector: 'mdi:sitemap-outline',
  communicator: 'mdi:bullhorn-outline',
}

export const RoleIcon = ({ role, size = 28, color }) => {
  const c = color || CAPI_ROLES[role?.toLowerCase()]?.color || '#00e5ff'
  const key = role ? role.toLowerCase() : 'explorer'
  const iconName = ROLE_MDI_ICONS[key] || 'mdi:compass-outline'

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        filter: `drop-shadow(0 0 6px ${c}88)`,
      }}
    >
      <Icon icon={iconName} width={size} height={size} color={c} />
    </div>
  )
}
