import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

const SKILL_ICONS = {
  'public speaking': 'mdi:account-voice',
  storytelling: 'mdi:book-open-page-variant-outline',
  'canva / google slides': 'mdi:application-outline',
  'science communication': 'mdi:flask-outline',
  'capcut / basic video editing': 'mdi:video-outline',
}

export default function AccordionSkills({ primarySkills = [] }) {
  const { t } = useTranslation()

  // Keep track of expanded state for each accordion card individually, default all to expanded (true)
  const [expandedStates, setExpandedStates] = useState(
    (primarySkills || []).reduce((acc, _, idx) => {
      acc[idx] = true
      return acc
    }, {}),
  )

  const toggleExpand = (idx) => {
    setExpandedStates((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

  return (
    <section className="report-section print-card accordion-section">
      {/* Section Title Header with Purple Rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3
          style={{
            margin: 0,
            fontSize: 'var(--text-xl)',
            fontWeight: 800,
            color: 'var(--color-primary)',
          }}
        >
          {t('report.training_accordion_title')}
        </h3>
        <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--border-purple)' }} />
      </div>

      {/* Accordions in responsive grid layout */}
      <div className="accordion-skills-grid">
        {primarySkills.map((sk, idx) => {
          const key = (sk.name || '').toLowerCase().trim()
          const iconName = SKILL_ICONS[key] || 'mdi:school-outline'
          const skillName = sk.name
          const whyRec = sk.why_recommended
          const skillArea = sk.skill_area

          const isOpen = !!expandedStates[idx]

          // Level styling matching design system
          const isBeginner = sk.level === 'beginner'
          const lvlText = isBeginner
            ? t('report.training_level_beginner')
            : t('report.training_level_intermediate')
          const lvlBg = isBeginner ? 'var(--surface-subtle)' : 'var(--surface-lavender)'
          const lvlBorder = isBeginner
            ? '1px solid var(--border-light)'
            : '1px solid var(--border-purple)'
          const lvlColor = isBeginner ? 'var(--ink-secondary)' : 'var(--color-primary)'

          // Stretch the last item if total items is odd
          const isFullWidth = idx === primarySkills.length - 1 && primarySkills.length % 2 !== 0

          return (
            <div
              key={idx}
              className="accordion-skill-card"
              style={{
                border: '1.5px solid var(--border-purple)',
                borderRadius: '16px',
                overflow: 'hidden',
                gridColumn: isFullWidth ? '1 / span 2' : 'span 1',
                height: 'fit-content',
                backgroundColor: 'var(--surface-light)',
              }}
            >
              {/* Solid Purple Accordion Header Button */}
              <button
                onClick={() => toggleExpand(idx)}
                style={{
                  backgroundColor: 'var(--color-primary)',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  userSelect: 'none',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  color: '#FFFFFF',
                  transition: 'background-color 150ms ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon icon={iconName} width={22} height={22} color="#FFFFFF" />
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 700 }}>{skillName}</span>
                </div>

                <Icon
                  icon={isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'}
                  width={20}
                  height={20}
                  color="#FFFFFF"
                />
              </button>

              {/* Accordion Body Content */}
              {isOpen && (
                <div
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    backgroundColor: 'var(--surface-light)',
                  }}
                >
                  {/* Level row */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: 'var(--ink-dark)',
                      }}
                    >
                      {t('report.training_level_label')}
                    </span>
                    <span
                      style={{
                        backgroundColor: lvlBg,
                        border: lvlBorder,
                        color: lvlColor,
                        fontSize: 'var(--text-xs)',
                        fontWeight: 700,
                        borderRadius: '6px',
                        padding: '4px 12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {lvlText}
                      <Icon icon="mdi:school" width={15} height={15} />
                    </span>
                  </div>

                  {/* Why recommended block */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        fontWeight: 700,
                        color: 'var(--ink-dark)',
                      }}
                    >
                      {t('report.training_why_rec')}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: 'var(--ink-secondary)',
                        lineHeight: 1.5,
                      }}
                    >
                      {whyRec}
                    </span>
                    {skillArea && (
                      <span
                        style={{
                          fontSize: 'var(--text-xs)',
                          color: 'var(--ink-muted)',
                          lineHeight: 1.4,
                          marginTop: '2px',
                        }}
                      >
                        {skillArea}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
