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

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  if (!result || !certCopy) return null

  const primary = CAPI_ROLES[result.primaryRole] || {
    color: '#9333EA',
    name: 'Communicator',
    nameVn: 'Nhà Truyền thông',
    summaryVn: 'Bạn nổi bật ở khả năng truyền đạt ý tưởng và giúp mọi người nhìn thấy ý nghĩa chung.',
  }

  const radarScores = result.phase2 || result.phase1 || {}

  const growthAreaStr = isEn ? (certCopy.growthAreasEn?.[0] || '') : (certCopy.growthAreasVn?.[0] || '')
  const colonIndex = growthAreaStr.indexOf(':')
  const growthHeadline = colonIndex !== -1 ? growthAreaStr.substring(0, colonIndex).trim() : t('report.card_growth')
  const growthDesc = colonIndex !== -1 ? growthAreaStr.substring(colonIndex + 1).trim() : (growthAreaStr || '')

  const primaryQualifications = isEn ? certCopy.primaryQualificationsEn : certCopy.primaryQualifications
  const strengthsHeadline = primaryQualifications?.[0] || (isEn ? 'System Thinking' : 'Tư duy Hệ thống')
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
    boxSizing: 'border-box'
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#F8FAFC',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '110px 24px 40px 24px',
        boxSizing: 'border-box',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}
    >
      {/* MAIN 2-COLUMN ROW (FLEXBOX, CENTRED MAX WIDTH) */}
      <main
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          width: '100%',
          maxWidth: '1200px',
          boxSizing: 'border-box'
        }}
      >
        {/* LEFT COLUMN: Summary Cards & Mascot */}
        <div
          style={{
            flex: 42,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxSizing: 'border-box'
          }}
        >
          {/* Top Mascot + Speech Bubble */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexShrink: 0,
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0)' : 'translateY(15px)',
              transition: 'all 0.5s ease-out'
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
                flex: 1
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0F172A',
                  marginBottom: '2px'
                }}
              >
                {t('report.mascot_title')}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#64748B',
                  lineHeight: '1.4'
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
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '4px 14px',
                display: 'inline-block',
                marginBottom: '4px',
                width: 'fit-content'
              }}
            >
              {t('report.card_strength')}
            </span>
            <h4 style={{ margin: '2px 0 2px 0', fontSize: '17px', fontWeight: 700, color: '#1E293B' }}>
              {strengthsHeadline}
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.4' }}>
              {strengthsDesc}
            </p>
          </div>

          {/* Card 2: Working Style */}
          <div style={getCardStyle('#EFF6FF', '#BFDBFE', 0.2)}>
            <span
              style={{
                backgroundColor: '#3B82F6',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '4px 14px',
                display: 'inline-block',
                marginBottom: '4px',
                width: 'fit-content'
              }}
            >
              {t('report.card_style')}
            </span>
            <h4 style={{ margin: '2px 0 2px 0', fontSize: '17px', fontWeight: 700, color: '#1E293B' }}>
              {isEn ? 'Natural Behaviors' : 'Xu hướng hành vi'}
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.4' }}>
              {isEn ? (certCopy.workingStyleHeadlineEn || certCopy.workingStyleHeadlineVn) : certCopy.workingStyleHeadlineVn}
            </p>
          </div>

          {/* Card 3: Growth Suggestion */}
          <div style={getCardStyle('#F0FDF4', '#BBF7D0', 0.3)}>
            <span
              style={{
                backgroundColor: '#22C55E',
                color: '#FFFFFF',
                fontSize: '12px',
                fontWeight: 700,
                borderRadius: '9999px',
                padding: '4px 14px',
                display: 'inline-block',
                marginBottom: '4px',
                width: 'fit-content'
              }}
            >
              {t('report.card_growth')}
            </span>
            <h4 style={{ margin: '2px 0 2px 0', fontSize: '17px', fontWeight: 700, color: '#1E293B' }}>
              {isEn ? (certCopy.growthHeadlineEn || growthHeadline) : growthHeadline}
            </h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: '1.4' }}>
              {isEn ? (certCopy.areasOfImprovementEn || growthDesc) : growthDesc}
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
              flex: 'none',
              borderRadius: '9999px',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#7E22CE',
              borderColor: '#E9D5FF',
              marginTop: 'auto'
            }}
          >
            ← {t('report.btn_back_to_home')}
          </Button>
        </div>

        {/* RIGHT COLUMN: Certificate Card */}
        <div
          style={{
            flex: 58,
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid #F1F5F9',
            padding: '24px 32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
            boxShadow: '0 10px 30px rgba(147, 51, 234, 0.05)',
            boxSizing: 'border-box',
            opacity: mounted ? 1 : 0,
            transform: mounted ? 'scale(1)' : 'scale(0.97)',
            transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s',
            minHeight: 0,
            overflow: 'hidden'
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
              zIndex: 0
            }}
          />

          {/* Top Pill ID Badge */}
          <div
            style={{
              backgroundColor: '#475569',
              color: '#FFFFFF',
              borderRadius: '9999px',
              padding: '4px 16px',
              fontSize: '11px',
              fontWeight: 600,
              fontFamily: 'monospace',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}
          >
            CAPI-GENE ID: CG-2026-{certId}
          </div>

          {/* Title & Subtitle */}
          <div style={{ textAlign: 'center' }}>
            <h2
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 800,
                color: '#1E1B4B',
                fontFamily: 'var(--font-display, sans-serif)',
                letterSpacing: '-0.5px'
              }}
            >
              {t('report.cert_title')}
            </h2>
            <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: '#64748B' }}>
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
              margin: '12px 0'
            }}
          >
            <h3
              style={{
                margin: '0 0 4px 0',
                fontSize: '24px',
                fontWeight: 800,
                color: '#7E22CE',
                fontFamily: 'var(--font-display, sans-serif)'
              }}
            >
              {isEn ? (primary.name || 'Communicator') : (primary.nameVn || 'Nhà Truyền thông')}
            </h3>
            <p style={{ margin: 0, fontSize: '14px', color: '#6B21A8', lineHeight: '1.4' }}>
              {t(`common.roles.${result.primaryRole}.tagline`) || certCopy.workingStyleHeadlineVn || 'Bạn nổi bật ở khả năng truyền đạt ý tưởng và giúp mọi người nhìn thấy ý nghĩa chung.'}
            </p>
          </div>

          {/* Polygon Radar with Vertex Badges */}
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 0 }}>
            <SummaryRadar scores={radarScores} size={280} />
          </div>

          {/* Bottom Action Buttons Row (Default Sizing, Reused Iconify Icons) */}
          <div style={{ display: 'flex', gap: '16px', width: '100%', marginTop: '12px' }}>
            {/* Primary Button */}
            <Button
              variant="solid"
              active={true}
              onClick={() => navigate('/certificate/details')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Icon icon="mdi:eye-outline" width={20} height={20} />
              <span>{t('report.btn_details')}</span>
            </Button>

            {/* Secondary Button */}
            <Button
              variant="outline"
              onClick={() => navigate('/certificate/details?print=true')}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
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
