import { useEffect, useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import SummaryRadar from '../SummaryRadar.jsx'
import Capi from '../Capi.jsx'
import Button from '../Button.jsx'
import { CAPI_ROLES } from '../../data.js'
import { capiAudio } from '../../audio.js'

export default function ReportSummary() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const { result, certCopy, certId } = useOutletContext()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth <= 768,
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!result || !certCopy) return null

  const primary = CAPI_ROLES[result.primaryRole] || {
    color: '#9333EA',
    name: 'Communicator',
    nameVn: 'Nhà Truyền thông',
    summaryVn:
      'Bạn nổi bật ở khả năng truyền đạt ý tưởng và giúp mọi người nhìn thấy ý nghĩa chung.',
  }

  const radarScores = result.phase2 || result.phase1 || {}

  const growthAreaStr = isEn ? certCopy.growthAreasEn?.[0] || '' : certCopy.growthAreasVn?.[0] || ''
  const colonIndex = growthAreaStr.indexOf(':')
  const growthHeadline =
    colonIndex !== -1 ? growthAreaStr.substring(0, colonIndex).trim() : t('report.card_growth')
  const growthDesc =
    colonIndex !== -1 ? growthAreaStr.substring(colonIndex + 1).trim() : growthAreaStr || ''

  const primaryQualifications = isEn
    ? certCopy.primaryQualificationsEn
    : certCopy.primaryQualifications
  const strengthsHeadline =
    primaryQualifications?.[0] || (isEn ? 'System Thinking' : 'Tư duy Hệ thống')
  const strengthsDesc = isEn
    ? `You possess strong qualifications in ${primary.name.toLowerCase()}, including: ${(primaryQualifications || []).slice(1, 4).join(', ')}.`
    : `Bạn sở hữu thế mạnh vượt trội về ${primary.nameVn.toLowerCase()}, nổi bật là: ${(primaryQualifications || []).slice(1, 4).join(', ')}.`

  // Common card style generator
  const getCardStyle = (bgColor, borderColor, delay) => ({
    backgroundColor: bgColor,
    border: `1px solid ${borderColor}`,
    borderRadius: '16px',
    padding: '16px 20px',
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateX(0)' : 'translateX(-15px)',
    transition: 'all 0.4s ease-out',
    transitionDelay: `${delay}s`,
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  })

  return (
    <div className="report-summary-shell">
      {/* MAIN 2-COLUMN ROW (RESPONSIVE FLEXBOX) */}
      <main className="report-summary-main">
        {/* LEFT COLUMN: Summary Cards & Mascot */}
        <div className="report-summary-left">
          {/* Top Mascot + Speech Bubble */}
          <div
            className="report-summary-mascot-row"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexShrink: 0,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.5s ease-out',
            }}
          >
            <Capi pose="wave" size={90} style={{ flexShrink: 0 }} />

            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                borderLeft: '4px solid #C084FC',
                padding: '14px 20px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                borderTop: '1px solid #F1F5F9',
                borderRight: '1px solid #F1F5F9',
                borderBottom: '1px solid #F1F5F9',
                flex: 1,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 'var(--text-md)',
                  color: '#0F172A',
                  marginBottom: '2px',
                }}
              >
                {t('report.mascot_title')}
              </div>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: '#64748B',
                  lineHeight: '1.4',
                }}
              >
                {t('report.mascot_desc')}
              </div>
            </div>
          </div>

          {/* Card 1: Strengths */}
          <div style={getCardStyle('#FFFBEE', '#FDE68A', 0.1)}>
            <span
              style={{
                backgroundColor: '#F59E0B',
                color: '#FFFFFF',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '4px 14px',
                display: 'inline-block',
                marginBottom: '4px',
                width: 'fit-content',
              }}
            >
              {t('report.card_strength')}
            </span>
            <h4
              style={{
                margin: '2px 0 2px 0',
                fontSize: 'var(--text-md)',
                fontWeight: 700,
                color: '#1E293B',
              }}
            >
              {strengthsHeadline}
            </h4>
            <p
              style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#475569', lineHeight: '1.4' }}
            >
              {strengthsDesc}
            </p>
          </div>

          {/* Card 2: Working Style */}
          <div style={getCardStyle('#EFF6FF', '#BFDBFE', 0.2)}>
            <span
              style={{
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '4px 14px',
                display: 'inline-block',
                marginBottom: '4px',
                width: 'fit-content',
              }}
            >
              {t('report.card_style')}
            </span>
            <h4
              style={{
                margin: '2px 0 2px 0',
                fontSize: 'var(--text-md)',
                fontWeight: 700,
                color: '#1E293B',
              }}
            >
              {isEn ? 'Natural Behaviors' : 'Xu hướng hành vi'}
            </h4>
            <p
              style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#475569', lineHeight: '1.4' }}
            >
              {isEn
                ? certCopy.workingStyleHeadlineEn || certCopy.workingStyleHeadlineVn
                : certCopy.workingStyleHeadlineVn}
            </p>
          </div>

          {/* Card 3: Growth Suggestion */}
          <div style={getCardStyle('#F0FDF4', '#BBF7D0', 0.3)}>
            <span
              style={{
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '4px 14px',
                display: 'inline-block',
                marginBottom: '4px',
                width: 'fit-content',
              }}
            >
              {t('report.card_growth')}
            </span>
            <h4
              style={{
                margin: '2px 0 2px 0',
                fontSize: 'var(--text-md)',
                fontWeight: 700,
                color: '#1E293B',
              }}
            >
              {isEn ? certCopy.growthHeadlineEn || growthHeadline : growthHeadline}
            </h4>
            <p
              style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#475569', lineHeight: '1.4' }}
            >
              {isEn ? certCopy.areasOfImprovementEn || growthDesc : growthDesc}
            </p>
          </div>

          {/* Bottom Button: Back to Home */}
          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/')
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              height: '44px',
              borderRadius: '12px',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              border: '1.5px solid #843497',
              backgroundColor: '#FFFFFF',
              color: '#843497',
              marginTop: '4px',
            }}
          >
            ← {t('report.btn_back_to_home')}
          </Button>
        </div>

        {/* RIGHT COLUMN: Certificate Card */}
        <div
          className="report-summary-right"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.97)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
          }}
        >
          {/* Watermark Award Icon Top Right */}
          <Icon
            icon="mdi:award"
            width={160}
            height={160}
            color="#7E22CE"
            style={{
              position: 'absolute',
              top: -15,
              right: -15,
              opacity: 0.08,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* Top Pill ID Badge */}
          <div
            style={{
              backgroundColor: '#475569',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '4px 16px',
              fontSize: 'var(--text-2xs)',
              fontWeight: 600,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}
          >
            CAPI-GENE ID: CG-2026-{certId}
          </div>

          {/* Title & Subtitle */}
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                margin: 0,
                fontSize: 'var(--text-2xl)',
                fontWeight: 800,
                color: '#1E1B4B',
                fontFamily: 'var(--font-display, sans-serif)',
                letterSpacing: '-0.5px',
              }}
            >
              {t('report.cert_title')}
            </h2>
            <p style={{ margin: '3px 0 0 0', fontSize: 'var(--text-xs)', color: '#64748B' }}>
              {t('report.cert_subtitle')}
            </p>
          </div>

          {/* Primary Role Box */}
          <div
            style={{
              backgroundColor: '#F5F3FF',
              border: '1px solid #DDD6FE',
              borderRadius: '16px',
              padding: '14px 20px',
              width: '100%',
              textAlign: 'center',
              boxSizing: 'border-box',
              margin: '12px 0',
            }}
          >
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: 'var(--text-xl)',
                fontWeight: 800,
                color: '#7E22CE',
                fontFamily: 'var(--font-display, sans-serif)',
              }}
            >
              {isEn ? primary.name || 'Communicator' : primary.nameVn || 'Nhà Truyền thông'}
            </h3>
            <p
              style={{ margin: 0, fontSize: 'var(--text-sm)', color: '#6B21A8', lineHeight: '1.4' }}
            >
              {t(`common.roles.${result.primaryRole}.tagline`) ||
                certCopy.workingStyleHeadlineVn ||
                'Bạn nổi bật ở khả năng truyền đạt ý tưởng và giúp mọi người nhìn thấy ý nghĩa chung.'}
            </p>
          </div>

          {/* Polygon Radar with Vertex Badges */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 0,
            }}
          >
            <SummaryRadar scores={radarScores} size={isMobile ? 220 : 280} />
          </div>

          {/* Bottom Action Buttons Row */}
          <div className="report-summary-actions">
            {/* Primary Button */}
            <Button
              variant="solid"
              active={true}
              onClick={() => navigate('/certificate/details')}
              className="report-summary-btn-primary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '48px',
                borderRadius: '14px',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
              }}
            >
              <Icon icon="mdi:eye-outline" width={20} height={20} />
              <span>{t('report.btn_details')}</span>
            </Button>

            {/* Secondary Button */}
            <Button
              variant="outline"
              onClick={() => navigate('/certificate/details?print=true')}
              className="report-summary-btn-secondary"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '48px',
                borderRadius: '14px',
                fontSize: 'var(--text-base)',
                fontWeight: 600,
              }}
            >
              <Icon icon="mdi:download-outline" width={20} height={20} />
              <span>{t('report.btn_pdf')}</span>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
