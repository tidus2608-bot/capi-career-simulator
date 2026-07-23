import { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import SceneShell from './SceneShell.jsx'
import LanguageSwitch from '../LanguageSwitch.jsx'
import { CAPI_ROLES } from '../../data.js'

const SECTION_STYLE = {
  paddingBottom: 40,
  paddingTop: 24,
  borderBottom: '1px solid #e5e7eb',
}

const PROFILE_COLOR = {
  Hidden: '#e11d48',
  Aligned: '#16a34a',
  Emerging: '#d97706',
}

export default function ReportDetails() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const { result, certCopy } = useOutletContext()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('print') === 'true') {
      const timer = setTimeout(() => {
        window.print()
        navigate('/certificate/details', { replace: true })
      }, 600)
      return () => clearTimeout(timer)
    }
  }, [navigate])

  if (!result || !certCopy) return null

  const primary = CAPI_ROLES[result.primaryRole] || { nameVn: 'Nhà Khám Phá', name: 'Explorer' }
  const secondary = CAPI_ROLES[result.secondaryRole] || { nameVn: 'Kỹ Sư Chế Tạo', name: 'Builder' }
  const profileColor = PROFILE_COLOR[result.profileType] || '#843497'

  const growthAreaStr = certCopy.growthAreasVn?.[0] || ''
  const colonIndex = growthAreaStr.indexOf(':')
  const growthHeadline = colonIndex !== -1 ? growthAreaStr.substring(0, colonIndex).trim() : t('report.card_growth')
  const growthDesc = colonIndex !== -1 ? growthAreaStr.substring(colonIndex + 1).trim() : (growthAreaStr || '')

  return (
    <SceneShell light>
      {/* STICKY BACK HEADER */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #f3f4f6',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <button 
          onClick={() => navigate('/certificate/summary')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'none',
            border: 'none',
            color: '#4b5563',
            fontSize: 16,
            fontWeight: 600,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 8,
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
        >
          <span>←</span> {t('report.details_back')}
        </button>

        <LanguageSwitch />
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div className="mono" style={{ color: '#843497', letterSpacing: 4, marginBottom: 16 }}>CAPI-GENE REPORT</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, color: '#1a1a2e' }}>
            {t('report.details_title')} <br/> <span style={{ color: '#843497' }}>{isEn ? primary.name : primary.nameVn}</span>
          </h1>
        </div>

        {/* 2. WORKING STYLE */}
        <div style={SECTION_STYLE}>
          <div className="mono" style={{ color: '#843497', marginBottom: 16 }}>2 · {t('report.card_style').toUpperCase()}</div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: '#1a1a2e', marginBottom: 16 }}>
            {isEn ? (certCopy.workingStyleHeadlineEn || certCopy.workingStyleHeadlineVn) : certCopy.workingStyleHeadlineVn}
          </h3>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#4b5563' }}>
            {isEn ? (certCopy.workingStyleEn || certCopy.workingStyleVn) : certCopy.workingStyleVn}
          </p>
        </div>

        {/* 3 & 4. STRENGTHS & GROWTH */}
        <div style={{ ...SECTION_STYLE, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          <div>
            <div className="mono" style={{ color: '#843497', marginBottom: 16 }}>3 · {t('report.details_strength')}</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1a1a2e', marginBottom: 12 }}>
              {isEn ? (certCopy.strengthsHeadlineEn || certCopy.strengthsHeadlineVn) : certCopy.strengthsHeadlineVn}
            </h4>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4b5563' }}>
              {isEn ? (certCopy.strengthsEn || certCopy.strengthsVn) : certCopy.strengthsVn}
            </p>
          </div>
          <div>
            <div className="mono" style={{ color: '#843497', marginBottom: 16 }}>4 · {t('report.details_growth')}</div>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: '#1a1a2e', marginBottom: 12 }}>
              {isEn ? (certCopy.growthHeadlineEn || growthHeadline) : growthHeadline}
            </h4>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: '#4b5563' }}>
              {isEn ? (certCopy.areasOfImprovementEn || growthDesc) : growthDesc}
            </p>
          </div>
        </div>

        {/* 5. PROFILE ALIGNMENT */}
        <div style={{ ...SECTION_STYLE, background: '#f9fafb', padding: 32, borderRadius: 16, margin: '24px 0', border: '1px solid #e5e7eb' }}>
          <div className="mono" style={{ color: '#843497', marginBottom: 16 }}>5 · {t('report.details_compatibility')}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ padding: '6px 12px', background: profileColor, color: 'white', borderRadius: 20, fontSize: 14, fontWeight: 600 }}>
              {result.profileType} Profile
            </div>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#374151', marginBottom: 12 }}>
            {isEn ? (certCopy.profileTypeNarrativeEn || certCopy.profileTypeNarrativeVn) : certCopy.profileTypeNarrativeVn}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: '#374151', fontStyle: 'italic' }}>
            {isEn ? (certCopy.realityGrowthInsightEn || certCopy.realityGrowthInsightVn) : certCopy.realityGrowthInsightVn}
          </p>
        </div>

        {/* 6. CAREER PATHS */}
        <div style={SECTION_STYLE}>
          <div className="mono" style={{ color: '#843497', marginBottom: 24 }}>6 · {t('report.details_career')}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {((isEn ? certCopy.primaryCareersEn : certCopy.primaryCareers) || []).map((c, i) => (
              <div key={`prim-${i}`} style={{ padding: 20, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#111827', marginBottom: 8 }}>{c}</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  {isEn ? `Primary role: ${primary.name}` : `Định hướng cốt lõi: ${primary.nameVn}`}
                </div>
              </div>
            ))}
            {((isEn ? certCopy.secondaryCareersEn : certCopy.secondaryCareers) || []).map((c, i) => (
              <div key={`sec-${i}`} style={{ padding: 20, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 16, color: '#111827', marginBottom: 8 }}>{c}</div>
                <div style={{ fontSize: 14, color: '#6b7280' }}>
                  {isEn ? `Secondary role: ${secondary.name}` : `Định hướng bổ trợ: ${secondary.nameVn}`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 7. NUANCE */}
        {certCopy.nuanceVn && (
          <div style={{ paddingBottom: 60, paddingTop: 24 }}>
            <div className="mono" style={{ color: '#843497', marginBottom: 16 }}>7 · {t('report.details_nuance')}</div>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#4b5563', fontStyle: 'italic', borderLeft: '4px solid #843497', paddingLeft: 16 }}>
              {isEn ? (certCopy.nuanceEn || certCopy.nuanceVn) : certCopy.nuanceVn}
            </p>
          </div>
        )}

      </div>
    </SceneShell>
  )
}
