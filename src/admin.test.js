import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('Admin Dashboard XSS Prevention', () => {
  let dom
  let window
  let document

  beforeEach(() => {
    const htmlPath = path.resolve(__dirname, '../public/admin.html')
    const html = fs.readFileSync(htmlPath, 'utf-8')

    dom = new JSDOM(html, {
      runScripts: 'dangerously',
      url: 'http://localhost/admin.html',
      beforeParse(win) {
        win.fetch = vi.fn((url) => {
          const path = String(url)
          if (path.includes('/api/auth/status')) {
            return Promise.resolve({
              status: 200,
              json: async () => ({ authenticated: true, role: 'admin', email: 'admin@example.com' }),
            })
          }
          if (path.includes('/api/admins')) {
            return Promise.resolve({
              status: 200,
              json: async () => ({ ok: true, admins: [] }),
            })
          }
          return Promise.resolve({
            status: 200,
            json: async () => ({
              ok: true,
              stats: {},
              roleDist: [],
              missionDist: [],
              profileDist: [],
              rows: [],
            }),
          })
        })
      },
    })

    window = dom.window
    document = window.document
  })

  it('should safely render malicious data without executing XSS payloads', async () => {
    const maliciousPayload = '"><img src=x onerror=alert(1)>'
    const maliciousData = {
      ok: true,
      stats: { total: 10, avg_confidence_factor: 0.8 },
      roleDist: [{ key: maliciousPayload, count: 5 }],
      missionDist: [{ mission_id: maliciousPayload, count: 5 }],
      profileDist: [{ profile_type: maliciousPayload, count: 5 }],
      rows: [
        {
          primary_role: maliciousPayload,
          secondary_role: maliciousPayload,
          profile_type: maliciousPayload,
          mission_id: maliciousPayload,
          confidence_factor: maliciousPayload,
          display_name: maliciousPayload,
          created_at: maliciousPayload,
          scores: { final: { [maliciousPayload]: 10 } },
        },
      ],
    }

    await vi.waitFor(() => {
      if (typeof window.renderDashboard !== 'function') {
        throw new Error('renderDashboard not ready')
      }
    })

    window.renderDashboard(maliciousData)

    const imgs = document.querySelectorAll('img')
    expect(imgs.length).toBe(0)

    const scripts = document.querySelectorAll('script')
    expect(scripts.length).toBe(1)

    const allElements = document.querySelectorAll('*')
    let hasOnerror = false
    allElements.forEach((el) => {
      if (el.hasAttribute('onerror')) {
        hasOnerror = true
      }
    })
    expect(hasOnerror).toBe(false)

    const roleBars = document.getElementById('role-bars')
    expect(roleBars.textContent).toContain(maliciousPayload)

    const resultsTbody = document.getElementById('results-tbody')
    expect(resultsTbody.textContent).toContain(maliciousPayload)

    expect(document.getElementById('s-total').textContent).toBe('10')
    expect(document.getElementById('s-conf').textContent).toBe('0.80')
  })

  it('should safely render malicious admin data without unsafe HTML interpolation', async () => {
    const maliciousPayload = '"><img src=x onerror=alert(1)>'

    await vi.waitFor(() => {
      if (typeof window.renderAdmins !== 'function') {
        throw new Error('renderAdmins not ready')
      }
    })

    window.renderAdmins([
      {
        email: maliciousPayload,
        created_at: maliciousPayload,
        created_by: maliciousPayload,
      },
    ])

    expect(document.querySelectorAll('img').length).toBe(0)
    expect(document.getElementById('admins-list').textContent).toContain(maliciousPayload)

    let hasOnerror = false
    document.querySelectorAll('*').forEach((el) => {
      if (el.hasAttribute('onerror')) {
        hasOnerror = true
      }
    })
    expect(hasOnerror).toBe(false)
  })
})
