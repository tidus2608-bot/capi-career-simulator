import React, { useState } from 'react'
import { Icon } from '@iconify/react'
import { useTranslation } from 'react-i18next'

const SKILL_STYLE_OVERRIDES = {
  'public speaking': {
    nameVi: 'Nói trước công chúng',
    nameEn: 'Public Speaking',
    icon: 'mdi:account-voice',
    whyRecVi: 'Giúp con diễn đạt tự tin, rõ ràng và có cấu trúc.',
    whyRecEn: 'Helps you express yourself confidently, clearly and with structure.',
    skillAreaVi: 'Nghệ thuật kể chuyện (Kể chuyện, cách diễn đạt ngôn từ)',
    skillAreaEn: 'Storytelling (Storytelling, verbal expression)',
  },
  'storytelling': {
    nameVi: 'Nghệ thuật kể chuyện',
    nameEn: 'Storytelling',
    icon: 'mdi:book-open-page-variant-outline',
    whyRecVi: 'Giúp con biến ý tưởng hoặc dữ liệu thành câu chuyện dễ nhớ.',
    whyRecEn: 'Helps you turn ideas or data into memorable stories.',
    skillAreaVi: '',
    skillAreaEn: '',
  },
  'canva / google slides': {
    nameVi: 'Canva & Slides',
    nameEn: 'Canva & Slides',
    icon: 'mdi:application-outline',
    whyRecVi: 'Giúp con truyền đạt ý tưởng trực quan và hấp dẫn hơn.',
    whyRecEn: 'Helps you communicate ideas visually and more attractively.',
    skillAreaVi: '',
    skillAreaEn: '',
  },
  'science communication': {
    nameVi: 'Truyền thông khoa học',
    nameEn: 'Science Communication',
    icon: 'mdi:flask-outline',
    whyRecVi: 'Phù hợp với học sinh thích giải thích robotics, AI hoặc STEM cho người khác',
    whyRecEn: 'Suitable for students who like to explain robotics, AI or STEM to others',
    skillAreaVi: '',
    skillAreaEn: '',
  },
  'capcut / basic video editing': {
    nameVi: 'Dựng video/Capcut',
    nameEn: 'Dựng video/Capcut',
    icon: 'mdi:video-outline',
    whyRecVi: 'Giúp con tạo nội dung giới thiệu sản phẩm hoặc giải thích công nghệ.',
    whyRecEn: 'Helps you create content to introduce products or explain technology.',
    skillAreaVi: '',
    skillAreaEn: '',
  },
}

export default function AccordionSkills({ isEn, primarySkills }) {
  const { t } = useTranslation()

  // Keep track of expanded state for each accordion card individually, default all to expanded (true)
  const [expandedStates, setExpandedStates] = useState(
    primarySkills.reduce((acc, _, idx) => {
      acc[idx] = true
      return acc
    }, {})
  )

  const toggleExpand = (idx) => {
    setExpandedStates((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }))
  }

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
      }}
    >
      {/* Section Title Header with Purple Rule */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#A855F7', whiteSpace: 'nowrap' }}>
          {t('report.training_accordion_title')}
        </h3>
        <div style={{ flex: 1, height: '2px', backgroundColor: '#E9D5FF' }} />
      </div>

      {/* Accordions in 2-column grid layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '20px',
        }}
      >
        {primarySkills.map((sk, idx) => {
          const key = sk.name.toLowerCase().trim()
          const override = SKILL_STYLE_OVERRIDES[key]

          const skillName = override ? (isEn ? override.nameEn : override.nameVi) : sk.name
          const iconName = override ? override.icon : 'mdi:school-outline'
          const whyRec = override
            ? (isEn ? override.whyRecEn : override.whyRecVi)
            : sk.why_recommended
          const skillArea = override
            ? (isEn ? override.skillAreaEn : override.skillAreaVi)
            : sk.skill_area

          const isOpen = !!expandedStates[idx]

          // Level styling matching mockup
          const isBeginner = sk.level === 'beginner'
          const lvlText = isBeginner
            ? (isEn ? 'Beginner' : 'Khởi đầu')
            : (isEn ? 'Intermediate' : 'Trung cấp')
          const lvlBg = isBeginner ? '#48BB78' : '#ECC94B'
          const lvlColor = isBeginner ? '#FFFFFF' : '#1F2937'

          // Stretch the last item if total items is odd
          const isFullWidth = idx === primarySkills.length - 1 && primarySkills.length % 2 !== 0

          return (
            <div
              key={idx}
              style={{
                border: '1.5px solid #E9D5FF',
                borderRadius: '16px',
                overflow: 'hidden',
                gridColumn: isFullWidth ? '1 / span 2' : 'span 1',
                height: 'fit-content',
                backgroundColor: '#FFFFFF',
              }}
            >
              {/* Solid Purple Accordion Header Button */}
              <button
                onClick={() => toggleExpand(idx)}
                style={{
                  backgroundColor: '#8B2FA9',
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
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Icon icon={iconName} width={22} height={22} color="#FFFFFF" />
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>{skillName}</span>
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
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  {/* Level row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937' }}>
                      {isEn ? 'Level:' : 'Cấp độ:'}
                    </span>
                    <span
                      style={{
                        backgroundColor: lvlBg,
                        color: lvlColor,
                        fontSize: '12px',
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
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1F2937', whiteSpace: 'nowrap' }}>
                      {t('report.training_why_rec')}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                        {whyRec}
                      </span>
                      {skillArea && (
                        <span style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.4, marginTop: '2px' }}>
                          {skillArea}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
