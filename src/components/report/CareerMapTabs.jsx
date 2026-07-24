import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

const STANDARD_DOMAINS = [
  'Tech & Robotics',
  'Business & Product',
  'Education & Media',
  'Creative & Arts',
]

const ROLE_MAP_STYLES = {
  explorer: {
    borderTopColor: '#A855F7',
    badgeBg: '#F3E8FF',
    badgeColor: '#A855F7',
    tagBg: '#F3E8FF',
    tagColor: '#A855F7',
    icon: 'mdi:magnify',
  },
  builder: {
    borderTopColor: '#06B6D4',
    badgeBg: '#ECFEFF',
    badgeColor: '#0891B2',
    tagBg: '#ECFEFF',
    tagColor: '#0891B2',
    icon: 'mdi:sitemap-outline',
  },
  operator: {
    borderTopColor: '#3B82F6',
    badgeBg: '#EFF6FF',
    badgeColor: '#2563EB',
    tagBg: '#EFF6FF',
    tagColor: '#2563EB',
    icon: 'mdi:cog-outline',
  },
  connector: {
    borderTopColor: '#10B981',
    badgeBg: '#ECFDF5',
    badgeColor: '#059669',
    tagBg: '#ECFDF5',
    tagColor: '#059669',
    icon: 'mdi:transit-connection-variant',
  },
  communicator: {
    borderTopColor: '#F59E0B',
    badgeBg: '#FEF3C7',
    badgeColor: '#D97706',
    tagBg: '#FEF3C7',
    tagColor: '#D97706',
    icon: 'mdi:megaphone-outline',
  },
}

const CAREER_STYLE_OVERRIDES = {
  'product marketing specialist': {
    borderTopColor: '#F59E0B',
    badgeBg: '#FEF3C7',
    badgeColor: '#D97706',
    tagBg: '#FEF3C7',
    tagColor: '#D97706',
    icon: 'mdi:megaphone-outline',
    tags: ['Marketing', 'Business', 'Communication'],
    bullets: ['Storytelling', 'Product Launch'],
    why_fit_vi: 'Phù hợp vì con cần biến tính năng khô khan của sản phẩm thành câu chuyện giá trị cho người dùng.',
    why_fit_en: 'Suitable because you need to transform dry product features into valuable stories for users.',
    domain: 'Tech & Robotics',
  },
  'developer advocate': {
    borderTopColor: '#06B6D4',
    badgeBg: '#ECFEFF',
    badgeColor: '#0891B2',
    tagBg: '#ECFEFF',
    tagColor: '#0891B2',
    icon: 'mdi:sitemap-outline',
    tags: ['Computer Science', 'Communication'],
    bullets: ['Hỗ trợ cộng đồng', 'Viết code & Blog'],
    why_fit_vi: 'Bạn đóng vai trò cầu nối giữa kỹ sư phần mềm và cộng đồng người dùng. Bạn giúp giải thích các công nghệ phức tạp bằng ngôn ngữ dễ hiểu và thu thập phản hồi.',
    why_fit_en: 'You act as a bridge between software engineers and the user community. You help explain complex technologies in simple terms and gather feedback.',
    domain: 'Tech & Robotics',
  },
  'technical writer': {
    borderTopColor: '#3B82F6',
    badgeBg: '#EFF6FF',
    badgeColor: '#2563EB',
    tagBg: '#EFF6FF',
    tagColor: '#2563EB',
    icon: 'mdi:file-document-edit-outline',
    tags: ['Marketing', 'Business', 'Communication'],
    bullets: ['Technical Communication', 'Computer Science'],
    why_fit_vi: 'Sử dụng khả năng ngôn ngữ của mình để tạo ra các hướng dẫn sử dụng, tài liệu kỹ thuật chuyên nghiệp cho các hệ thống robot hoặc phần mềm phức tạp.',
    why_fit_en: 'Use your language skills to create professional user guides and technical documentation for complex robot systems or software.',
    domain: 'Tech & Robotics',
  },
  'science communicator': {
    borderTopColor: '#B45309',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309',
    tagBg: '#FEF3C7',
    tagColor: '#B45309',
    icon: 'mdi:flask-outline',
    tags: ['Education', 'Science Communication'],
    bullets: ['Public Speaking', 'Instructional Design'],
    why_fit_vi: 'Phù hợp vì con cần giải thích khái niệm khoa học-công nghệ theo cách dễ hiểu và truyền cảm hứng.',
    why_fit_en: 'Suitable because you need to explain science and technology concepts in an easy-to-understand and inspiring way.',
    domain: 'Tech & Robotics',
  },
  'ui/ux designer': {
    borderTopColor: '#10B981',
    badgeBg: '#ECFDF5',
    badgeColor: '#059669',
    tagBg: '#ECFDF5',
    tagColor: '#059669',
    icon: 'mdi:brush-outline',
    tags: ['Design', 'Human-Computer Interaction'],
    bullets: ['Visual Design', 'User Research'],
    why_fit_vi: 'Phù hợp vì con có khả năng thấu cảm cao, giúp thiết kế những giao diện không chỉ đẹp mà còn dễ sử dụng cho mọi người.',
    why_fit_en: 'Suitable because you have high empathy, helping design interfaces that are not only beautiful but also easy to use for everyone.',
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
  if (d.includes('tech') || d.includes('robot') || d.includes('engineering') || d.includes('maker') || d.includes('manufacturing')) {
    return 'Tech & Robotics'
  }
  if (d.includes('business') || d.includes('product') || d.includes('operation')) {
    return 'Business & Product'
  }
  if (d.includes('education') || d.includes('media') || d.includes('social') || d.includes('impact')) {
    return 'Education & Media'
  }
  if (d.includes('design') || d.includes('creative') || d.includes('art')) {
    return 'Creative & Arts'
  }
  return 'Tech & Robotics'
}

export default function CareerMapTabs({ isEn, allCareers }) {
  const [activeDomain, setActiveDomain] = useState('')
  const { t } = useTranslation()

  const currentDomain = activeDomain || STANDARD_DOMAINS[0]

  // Map and clean raw careers data
  const processedCareers = allCareers.map((c) => {
    const key = c.career.toLowerCase().trim()

    // Title & structure mapping to match screenshot overrides
    if (key.includes('science communicator') || key.includes('stem educator')) {
      return {
        ...c,
        career: 'Science Communicator',
        _overrideKey: 'science communicator',
      }
    }
    if (key.includes('human-robot interaction') || key.includes('ux researcher') || key.includes('ux designer')) {
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
    <div
      className="print-card"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '24px',
        border: '1.5px solid #F1F5F9',
        padding: '32px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        pageBreakBefore: 'always',
      }}
    >
      {/* Header Row with Horizontal Line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '24px', fontWeight: 800, color: '#A855F7', whiteSpace: 'nowrap' }}>
          {t('report.career_map_title')}
        </h3>
        <div style={{ flex: 1, height: '2px', backgroundColor: '#E9D5FF' }} />
      </div>

      {/* Tabs Filter Bar Container styled exactly like screenshot */}
      <div
        className="no-print"
        style={{
          backgroundColor: '#FAF5FF',
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
                background: isActive ? '#9333EA' : 'transparent',
                border: 'none',
                color: isActive ? '#FFFFFF' : '#70707A',
                fontSize: '14px',
                fontWeight: isActive ? 700 : 600,
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
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
          fontSize: '16px',
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

      {/* Careers Container wrapped in soft purple background with border */}
      {filteredJobs.length > 0 && (
        <div
          style={{
            backgroundColor: '#FAF5FF',
            border: '2px solid #E9D5FF',
            borderRadius: '24px',
            padding: '24px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px',
            }}
          >
            {filteredJobs.map((job, idx) => {
              const styleOverride = CAREER_STYLE_OVERRIDES[job._overrideKey]

              // Extract styles, fallback to default role style
              const defaultStyle = ROLE_MAP_STYLES[job.role_id] || ROLE_MAP_STYLES.explorer
              const theme = styleOverride || defaultStyle

              const tags = styleOverride ? styleOverride.tags : (job.suggested_major ? job.suggested_major.split(',').map((s) => s.trim()) : [])
              const bullets = styleOverride ? styleOverride.bullets : (job.robotics_connection ? [job.robotics_connection] : [])
              const whyFitText = styleOverride ? (isEn ? styleOverride.why_fit_en : styleOverride.why_fit_vi) : job.why_fit

              // Determine if card spans full width (last item in odd list)
              const isFullWidth = idx === filteredJobs.length - 1 && filteredJobs.length % 2 !== 0

              return (
                <div
                  key={idx}
                  style={{
                    border: '1.5px solid #E2E8F0',
                    borderTop: `4px solid ${theme.borderTopColor}`,
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    backgroundColor: '#FFFFFF',
                    gridColumn: isFullWidth ? '1 / span 2' : 'span 1',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.01)',
                  }}
                >
                  {/* Job Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        backgroundColor: theme.badgeBg,
                        color: theme.badgeColor,
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon icon={theme.icon} width={22} height={22} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1F2937' }}>
                        {job.career}
                      </h4>
                    </div>
                  </div>

                  {/* Skill Tag Chips */}
                  {tags.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          style={{
                            backgroundColor: theme.tagBg,
                            color: theme.tagColor,
                            borderRadius: '20px',
                            padding: '3px 10px',
                            fontSize: '12px',
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
                    <ul style={{ margin: 0, paddingLeft: 0, listStyleType: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {bullets.map((b, bIdx) => (
                        <li
                          key={bIdx}
                          style={{
                            fontSize: '13.5px',
                            color: '#475569',
                            position: 'relative',
                            paddingLeft: '12px',
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ position: 'absolute', left: 0, color: '#94A3B8' }}>•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Why fit description */}
                  <p style={{ margin: 0, fontSize: '13.5px', color: '#475569', lineHeight: 1.5 }}>
                    <strong style={{ color: '#475569' }}>
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
                        fontSize: '12.5px',
                        color: '#64748B',
                        lineHeight: 1.4,
                      }}
                    >
                      <strong style={{ color: theme.badgeColor }}>Robotics: </strong>
                      {job.robotics_connection}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
