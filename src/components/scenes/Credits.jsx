import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { capiAudio } from '../../audio.js'
import SceneShell from './SceneShell.jsx'

const CREDITS_TEAMS = [
  {
    id: 1,
    team: 'PRODUCT & LOGIC TEAM',
    desc: 'Đội ngũ định hình tầm nhìn, giữ vững bánh lái và kết nối mọi mảnh ghép của MVP.',
    roles: [
      {
        roleName: 'Product Lead',
        members: ['Joy Vũ'],
      },
      {
        roleName: 'Product Support',
        members: ['Đạt Ngô'],
      },
      {
        roleName: 'Proposal Specialist',
        members: ['Huy Nguyễn'],
      },
    ],
  },
  {
    id: 2,
    team: 'DOMAIN ADVISORS',
    desc: 'Những bộ óc bảo chứng cho tính thực tế, đưa insight ngành nghề chuẩn xác vào bài test.',
    roles: [
      {
        roleName: 'Subject Matter Experts',
        members: [
          'Career Coach Lưu Thị Quyên (Chứng nhận bởi NCDA Hoa Kỳ)',
          'Th.S Nguyễn Ngọc Thanh Huy',
        ],
      },
    ],
  },
  {
    id: 3,
    team: 'ASSESSMENT DESIGN TEAM',
    desc: 'Bộ não phía sau hệ thống: Thiết kế câu hỏi, chấm điểm và định hình lộ trình năng lực.',
    roles: [
      {
        roleName: 'Assessment Designers',
        members: ['Chí Tuấn', 'Joy Vũ'],
      },
    ],
  },
  {
    id: 4,
    team: 'GAME EXPERIENCE TEAM',
    desc: 'Thiết kế cơ chế gameplay, tương tác và trải nghiệm tương tác mô phỏng lôi cuốn.',
    roles: [
      {
        roleName: 'Game Designers',
        members: ['Như Đỗ', 'Tô Minh', 'Lê Quý An', 'Tiên Nguyễn'],
      },
    ],
  },
  {
    id: 5,
    team: 'STORY & WORLDBUILDING TEAM',
    desc: 'Thổi hồn vào thế giới Robotics qua từng đoạn đối thoại và tình huống kịch tính.',
    roles: [
      {
        roleName: 'Narrative Designers',
        members: ['Tô Minh', 'Như Đỗ', 'Lê Quý An'],
      },
    ],
  },
  {
    id: 6,
    team: 'EXPERIENCE DESIGN TEAM',
    desc: 'Chăm chút từng đường nét visual, typography và trải nghiệm giao diện người dùng.',
    roles: [
      {
        roleName: 'UX/UI Designers',
        members: ['Quang Tuấn', 'Jun Lê', 'Nguyễn Thanh Trúc', 'Trần Ngọc Hải Yến', 'Tô Minh'],
      },
    ],
  },
  {
    id: 7,
    team: 'GAME ENGINEERING TEAM',
    desc: 'Hiện thực hóa toàn bộ logic, hiệu năng mượt mà và nền tảng công nghệ của trò chơi.',
    roles: [
      {
        roleName: 'Game Developers',
        members: [
          'Trung Trần',
          'Đào Quang Trung',
          'Vũ Tùng Minh',
          'Nguyễn Minh Thái',
          'Thành Trần',
        ],
      },
    ],
  },
  {
    id: 8,
    team: 'PLAYTEST & QUALITY TEAM',
    desc: 'Bảo đảm chất lượng, cân bằng gameplay và tối ưu từng trải nghiệm người chơi.',
    roles: [
      {
        roleName: 'QA / Playtest Leads',
        members: ['Tô Minh', 'Tiên Nguyễn'],
      },
    ],
  },
  {
    id: 9,
    team: 'PROJECT CREW',
    desc: 'Đồng hành, hỗ trợ điều phối và bảo đảm tiến độ toàn dự án.',
    roles: [
      {
        roleName: 'Project Supporter',
        members: ['Huy Nguyễn'],
      },
    ],
  },
]

export default function CreditsScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleBackHome = () => {
    capiAudio.sfx('click')
    navigate('/')
  }

  return (
    <SceneShell light className="credits-page-shell">
      <div
        style={{
          maxWidth: 860,
          margin: '0 auto',
          padding: 'clamp(84px, 12vh, 120px) 24px 80px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        {/* Navigation Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 'clamp(13px, 1.1vw, 14.5px)',
            color: '#64748B',
            marginBottom: 24,
          }}
        >
          <button
            onClick={handleBackHome}
            style={{
              color: '#64748B',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Icon icon="mdi:home-outline" width={18} height={18} />
            <span>{t('credits.breadcrumb_home', 'Trang chủ')}</span>
          </button>
          <span>/</span>
          <span style={{ color: '#843497', fontWeight: 700 }}>
            {t('credits.breadcrumb_credits', 'Đội ngũ & Bản quyền')}
          </span>
        </nav>

        {/* Hero Title - Scaled Up for Desktop */}
        <div style={{ marginBottom: 'clamp(40px, 5vw, 60px)' }}>
          <h1
            style={{
              fontSize: 'clamp(38px, 4.5vw, 56px)',
              fontWeight: 800,
              color: '#843497',
              margin: 0,
              letterSpacing: '-0.025em',
              fontFamily: 'var(--font-display)',
            }}
          >
            Credit
          </h1>
          <p
            style={{
              fontSize: 'clamp(15px, 1.3vw, 18px)',
              color: '#64748B',
              margin: '10px 0 0 0',
              fontWeight: 500,
            }}
          >
            STEAM for Vietnam • Robotics Career Simulator MVP
          </p>
        </div>

        {/* 9 Department Sections - High-Impact Editorial Typographic Scale */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(44px, 5.5vw, 64px)',
          }}
        >
          {CREDITS_TEAMS.map((dept) => (
            <section
              key={dept.id}
              className="fade-up"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {/* Department Title */}
              <h2
                style={{
                  fontSize: 'clamp(20px, 1.8vw, 24px)',
                  fontWeight: 800,
                  color: '#843497',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  margin: 0,
                  fontFamily: 'var(--font-display)',
                }}
              >
                {dept.team}
              </h2>

              {/* Department Mission One-liner */}
              <p
                style={{
                  fontSize: 'clamp(14.5px, 1.25vw, 17px)',
                  color: '#475569',
                  lineHeight: 1.6,
                  maxWidth: 680,
                  margin: '8px 0 20px 0',
                }}
              >
                {dept.desc}
              </p>

              {/* Roles & Members List */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'clamp(14px, 1.8vw, 20px)',
                  width: '100%',
                  alignItems: 'center',
                }}
              >
                {dept.roles.map((roleGroup, rIdx) => (
                  <div
                    key={rIdx}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 'clamp(13px, 1vw, 14.5px)',
                        fontWeight: 600,
                        color: '#64748B',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {roleGroup.roleName}
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 3,
                      }}
                    >
                      {roleGroup.members.map((member, mIdx) => (
                        <span
                          key={mIdx}
                          style={{
                            fontSize: 'clamp(18px, 1.5vw, 22px)',
                            fontWeight: 700,
                            color: '#843497',
                            lineHeight: 1.55,
                          }}
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* Pure Minimal Footer Copyright */}
        <div
          style={{
            marginTop: 64,
            paddingTop: 24,
            borderTop: '1px solid #E2E8F0',
            width: '100%',
            fontSize: 12.5,
            color: '#94A3B8',
          }}
        >
          {t(
            'credits.footer_copy',
            '© 2026 STEAM for Vietnam (S4V). Tất cả các quyền được bảo lưu.',
          )}
        </div>
      </div>
    </SceneShell>
  )
}
