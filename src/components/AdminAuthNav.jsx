import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function isValidReturn(path) {
  if (!path || typeof path !== 'string') return false
  if (path === '/') return true
  if (!path.startsWith('/')) return false
  if (path.startsWith('//')) return false
  if (path.includes('\\')) return false
  for (let i = 0; i < path.length; i++) {
    const code = path.charCodeAt(i)
    if (code < 32 || code === 127) return false
  }
  return true
}

function getSafeReturnPath(path) {
  if (!isValidReturn(path)) return '/'
  try {
    const url = new URL(path, window.location.origin)
    if (url.origin !== window.location.origin) return '/'
    if (!url.pathname.startsWith('/')) return '/'
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return '/'
  }
}

export default function AdminAuthNav({ supabase, session, onHistory }) {
  const { t } = useTranslation()
  const [status, setStatus] = useState({ loading: true, authenticated: false, role: null })
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    const controller = new AbortController()

    const checkStatus = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const isLogout = urlParams.get('logout') === '1'
        const returnTo = urlParams.get('returnTo')

        if (isLogout) {
          if (supabase) {
            await supabase.auth.signOut({ scope: 'local' })
          }
          const safeReturnTo = getSafeReturnPath(returnTo)
          window.location.href = safeReturnTo
          return
        }

        if (session?.access_token) {
          const res = await fetch('/api/auth/session', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            credentials: 'same-origin',
            signal: controller.signal,
          })

          if (res.status === 403) {
            setStatus({ loading: false, authenticated: true, role: 'player' })
            return
          }

          if (!res.ok) throw new Error('Failed to bridge session')

          const data = await res.json()
          setStatus({ loading: false, ...data })

          const safeReturnTo = getSafeReturnPath(returnTo)
          if (data.authenticated && safeReturnTo !== '/') {
            window.location.href = safeReturnTo
            return
          }
        } else {
          const res = await fetch('/api/auth/status', {
            credentials: 'same-origin',
            signal: controller.signal,
          })
          if (!res.ok) throw new Error('Failed to fetch status')
          const data = await res.json()
          setStatus({ loading: false, ...data })
        }
      } catch (err) {
        if (err.name === 'AbortError') return
        setStatus({
          loading: false,
          authenticated: Boolean(session?.user),
          role: session?.user ? 'player' : null,
        })
      }
    }

    checkStatus()

    return () => controller.abort()
  }, [session, supabase])

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!menuRef.current?.contains(event.target) && !triggerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    const closeOnEscape = (event) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      triggerRef.current?.focus()
    }

    document.addEventListener('mousedown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('mousedown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const handleLogin = async () => {
    const redirectTo =
      window.location.origin +
      window.location.pathname +
      window.location.search +
      window.location.hash

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })
      if (error) {
        console.error('OAuth login error:', error)
      }
    } catch (err) {
      console.error('OAuth login exception:', err)
    }
  }

  const displayName =
    session?.user?.user_metadata?.full_name ??
    session?.user?.user_metadata?.name ??
    session?.user?.email ??
    status.email ??
    ''
  const isSignedIn = Boolean(session?.user || status.authenticated)

  const focusMenuItem = (position) => {
    requestAnimationFrame(() => {
      const items = menuRef.current?.querySelectorAll('[role="menuitem"]')
      if (!items?.length) return
      items[position === 'last' ? items.length - 1 : 0].focus()
    })
  }

  const handleTriggerKeyDown = (event) => {
    if (
      event.key !== 'ArrowDown' &&
      event.key !== 'ArrowUp' &&
      event.key !== 'Enter' &&
      event.key !== ' '
    ) {
      return
    }
    event.preventDefault()
    setMenuOpen(true)
    focusMenuItem(event.key === 'ArrowUp' ? 'last' : 'first')
  }

  const handleMenuKeyDown = (event) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
    event.preventDefault()
    const items = [...(menuRef.current?.querySelectorAll('[role="menuitem"]') ?? [])]
    if (!items.length) return
    const currentIndex = items.indexOf(document.activeElement)
    const direction = event.key === 'ArrowDown' ? 1 : -1
    items[(currentIndex + direction + items.length) % items.length]?.focus()
  }

  if (status.loading) {
    return null
  }

  if (isSignedIn) {
    return (
      <div className="admin-auth-nav">
        <button
          ref={triggerRef}
          type="button"
          className="admin-auth-menu-trigger"
          aria-label={t('common.account_menu_for', { name: displayName })}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls="account-menu"
          onClick={() => setMenuOpen((open) => !open)}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="admin-auth-user-name">{displayName}</span>
          <svg className="admin-auth-menu-caret" width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
            <path d="m5 7.5 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
        {menuOpen && (
          <div
            ref={menuRef}
            id="account-menu"
            className="admin-auth-menu"
            role="menu"
            tabIndex={-1}
            aria-label={t('common.account_menu')}
            onKeyDown={handleMenuKeyDown}
          >
            {onHistory && (
              <button
                type="button"
                className="admin-auth-menu-item"
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false)
                  onHistory()
                }}
              >
                {t('common.history')}
              </button>
            )}
            {status.role === 'admin' && (
              <a href="/admin.html" className="admin-auth-menu-item" role="menuitem">
                {t('common.admin_console')}
              </a>
            )}
            <a
              href="/api/auth/logout?returnTo=%2F"
              className="admin-auth-menu-item admin-auth-menu-item--danger"
              role="menuitem"
            >
              {t('common.sign_out')}
            </a>
          </div>
        )}
      </div>
    )
  }

  if (!status.authenticated) {
    return (
      <button
        type="button"
        onClick={handleLogin}
        className="admin-auth-link admin-auth-link--login"
        aria-label={t('common.admin_login')}
        title={t('common.admin_login')}
      >
        <span className="admin-auth-label--full">{t('common.admin_login')}</span>
        <span className="admin-auth-label--short">{t('common.admin_login_short')}</span>
      </button>
    )
  }

  return null
}
