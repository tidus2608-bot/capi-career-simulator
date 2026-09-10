import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'
import { getRoleConfig } from '../../data.js'

const STANDARD_DOMAINS = [
  'Tech & Robotics',
  'Business & Product',
  'Education & Media',
  'Creative & Arts',
]

const ROLE_MAP_STYLES = {
  explorer: { icon: 'mdi:magnify' },
  builder: { icon: 'mdi:sitemap-outline' },
  operator: { icon: 'mdi:cog-outline' },
  connector: { icon: 'mdi:transit-connection-variant' },
  communicator: { icon: 'mdi:megaphone-outline' },
}

const CAREER_STYLE_OVERRIDES = {
  'product marketing specialist': {
    icon: 'mdi:megaphone-outline',
    tags: ['Marketing', 'Business', 'Communication'],
    bullets: ['Storytelling', 'Product Launch'],
    domain: 'Tech & Robotics',
  },
  'developer advocate': {
    icon: 'mdi:sitemap-outline',
    tags: ['Computer Science', 'Communication'],
    bullets: ['Community Support', 'Code & Blog'],
    domain: 'Tech & Robotics',
  },
  'technical writer': {
    icon: 'mdi:file-document-edit-outline',
    tags: ['Marketing', 'Business', 'Communication'],
    bullets: ['Technical Communication', 'Computer Science'],
    domain: 'Tech & Robotics',
  },
  'science communicator': {
    icon: 'mdi:flask-outline',
    tags: ['Education', 'Science Communication'],
    bullets: ['Public Speaking', 'Instructional Design'],
    domain: 'Tech & Robotics',
  },
  'ui/ux designer': {
    icon: 'mdi:brush-outline',
    tags: ['Design', 'Human-Computer Interaction'],
    bullets: ['Visual Design', 'User Research'],
    domain: 'Tech & Robotics',
  },
}

const getMappedDomain = (job) => {
  const titleKey = job.career.toLowerCase().trim()
  const override = CAREER_STYLE_OVERRIDES[titleKey]
  if (override && override.domain) {
    return override.domain
  }

  const d = (job.domain || '').toLowerCase()
  if (
    d.includes('tech') ||
    d.includes('robot') ||
    d.includes('engineering') ||
    d.includes('maker') ||
    d.includes('manufacturing')
  ) {
    return 'Tech & Robotics'
  }
  if (d.includes('business') || d.includes('product') || d.includes('operation')) {
    return 'Business & Product'
  }
  if (
    d.includes('education') ||
    d.includes('media') ||
    d.includes('social') ||
    d.includes('impact')
  ) {
    return 'Education & Media'
  }
  if (d.includes('design') || d.includes('creative') || d.includes('art')) {
    return 'Creative & Arts'
  }
  return 'Tech & Robotics'
}

export default function CareerMapTabs({ allCareers = [] }) {
  const [activeDomain, setActiveDomain] = useState('')
  const { t } = useTranslation()

  const currentDomain = activeDomain || STANDARD_DOMAINS[0]

  // Map and clean raw careers data
  const processedCareers = (allCareers || []).map((c) => {
    const key = c.career.toLowerCase().trim()

    // Title & structure mapping to match screenshot overrides
    if (key.includes('science communicator') || key.includes('stem educator')) {
      return {
        ...c,
        career: 'Science Communicator',
        _overrideKey: 'science communicator',
      }
    }
    if (
      key.includes('human-robot interaction') ||
      key.includes('ux researcher') ||
      key.includes('ux designer')
    ) {
      return {
        ...c,
        career: 'UI/UX Designer',
        _overrideKey: 'ui/ux designer',
      }
    }
    return {
      ...c,
      _overrideKey: key,
    }
  })

  // Filter based on mapped domain
  const filteredJobs = processedCareers.filter((job) => {
    return getMappedDomain(job) === currentDomain
  })

  return (
    <section className="report-section print-card career-map-section">
      {/* Header Row with Purple Line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-xl)',
            fontWeight: 800,
            color: 'var(--color-primary)',
            whiteSpace: 'nowrap',
          }}
        >
          {t('report.career_map_title')}
        </h3>
        <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--border-purple)' }} />
      </div>

      {/* Tabs Filter Bar Container */}
      <div
        className="no-print"
        style={{
          backgroundColor: 'var(--surface-lavender)',
          borderRadius: '12px',
          padding: '6px 8px',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          whiteSpace: 'nowrap',
        }}
      >
        {STANDARD_DOMAINS.map((dom) => {
          const isActive = dom === currentDomain
          return (
            <button
              key={dom}
              onClick={() => setActiveDomain(dom)}
              style={{
                background: isActive ? 'var(--color-primary)' : 'transparent',
                border: 'none',
                color: isActive ? '#FFFFFF' : 'var(--ink-secondary)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 700 : 600,
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'background-color 150ms ease, color 150ms ease',
              }}
            >
              {dom}
            </button>
          )
        })}
      </div>

      {/* Tab Domain Header when printing */}
      <div
        style={{
          display: 'none',
          fontSize: 'var(--text-base)',
          fontWeight: 800,
          color: '#0E5E8A',
          borderBottom: '2px solid #0EA5E9',
          paddingBottom: '4px',
        }}
        className="print-block"
      >
        {t('report.career_domain_label')}
        {currentDomain}
      </div>

      {/* Careers Grid */}
      {filteredJobs.length > 0 && (
        <div className="career-map-grid">
          {filteredJobs.map((job, idx) => {
            const styleOverride = CAREER_STYLE_OVERRIDES[job._overrideKey]

            // Extract styles, fallback to default role style
            const defaultStyle = ROLE_MAP_STYLES[job.role_id] || ROLE_MAP_STYLES.explorer
            const theme = styleOverride || defaultStyle

            const tags = Array.isArray(job.tags)
              ? job.tags
              : styleOverride?.tags ||
                (typeof job.suggested_major === 'string'
                  ? job.suggested_major.split(',').map((s) => s.trim())
                  : [])
            const bullets = styleOverride
              ? styleOverride.bullets
              : job.robotics_connection
                ? [job.robotics_connection]
                : []
            const whyFitText = job.why_fit || ''

            // Determine if card spans full width (last item in odd list)
            const isFullWidth = idx === filteredJobs.length - 1 && filteredJobs.length % 2 !== 0

            return (
              <div
                key={idx}
                className="career-map-card"
                style={{
                  border: '1.5px solid var(--border-light)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  backgroundColor: 'var(--surface-light)',
                  gridColumn: isFullWidth ? '1 / span 2' : 'span 1',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.02)',
                }}
              >
                {/* Job Header */}
                {(() => {
                  const roleConfig = getRoleConfig(job.role_id)
                  return (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            backgroundColor: roleConfig.bg,
                            border: `1px solid ${roleConfig.color}30`,
                            color: roleConfig.color,
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon
                            icon={theme.icon || roleConfig.icon || 'mdi:briefcase-outline'}
                            width={22}
                            height={22}
                          />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <h4
                            style={{
                              margin: 0,
                              fontSize: 'var(--text-md)',
                              fontWeight: 800,
                              color: 'var(--ink-dark)',
                            }}
                          >
                            {job.career}
                          </h4>
                        </div>
                      </div>

                      {/* Role Badge Chip */}
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '3px 9px',
                          borderRadius: '6px',
                          backgroundColor: roleConfig.bg,
                          color: roleConfig.color,
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.03em',
                          border: `1px solid ${roleConfig.color}30`,
                          flexShrink: 0,
                        }}
                      >
                        <Icon icon={roleConfig.icon} width={13} height={13} />
                        <span>{roleConfig.name}</span>
                      </span>
                    </div>
                  )
                })()}

                {/* Skill Tag Chips */}
                {tags.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          backgroundColor: '#F1F5F9',
                          color: '#334155',
                          borderRadius: '20px',
                          padding: '3px 10px',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bullets List */}
                {bullets.length > 0 && (
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: 0,
                      listStyleType: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    {bullets.map((b, bIdx) => (
                      <li
                        key={bIdx}
                        style={{
                          fontSize: 'var(--text-sm)',
                          color: 'var(--ink-secondary)',
                          position: 'relative',
                          paddingLeft: '12px',
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ position: 'absolute', left: 0, color: 'var(--ink-muted)' }}>
                          •
                        </span>
                        {b}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Why fit description */}
                <p
                  style={{
                    margin: 0,
                    fontSize: 'var(--text-sm)',
                    color: 'var(--ink-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  <strong style={{ color: 'var(--ink-secondary)' }}>
                    {t('report.career_why_fit')}
                  </strong>
                  {whyFitText}
                </p>

                {/* Robotics connection (only for fallback rows) */}
                {job.robotics_connection && !styleOverride && (
                  <div
                    style={{
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: '8px',
                      fontSize: 'var(--text-xs)',
                      color: '#64748B',
                      lineHeight: 1.4,
                    }}
                  >
                    <strong style={{ color: 'var(--color-primary)' }}>Robotics: </strong>
                    {job.robotics_connection}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
