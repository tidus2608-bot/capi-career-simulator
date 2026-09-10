import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import { capiAudio } from '../../audio.js'
import SceneShell from './SceneShell.jsx'
import { CAPI_ROLES } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import Button from '../Button.jsx'
import FeedbackInvitationModal from './FeedbackInvitationModal.jsx'
import FeedbackModal from './FeedbackModal.jsx'

// Subcomponents
import PowerBlock from '../report/PowerBlock.jsx'
import EvidenceBlock from '../report/EvidenceBlock.jsx'
import DevelopmentTimeline from '../report/DevelopmentTimeline.jsx'
import AccordionSkills from '../report/AccordionSkills.jsx'
import CareerMapTabs from '../report/CareerMapTabs.jsx'

export default function ReportDetails() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const { result, certCopy } = useOutletContext()
  const { selectedMission, savedRunId } = useWizard()
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [showSurveyModal, setShowSurveyModal] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('print') === 'true') {
      const timer = setTimeout(() => {
        window.print()
        navigate('/certificate/details', { replace: true })
      }, 800)
      return () => clearTimeout(timer)
    }

    const storageKey = savedRunId
      ? `capi_feedback_prompted_${savedRunId}`
      : 'capi_feedback_prompted_latest'

    let alreadyPrompted = false
    try {
      alreadyPrompted = !!localStorage.getItem(storageKey)
    } catch (e) {
      console.warn('Failed to access localStorage for feedback prompt:', e)
    }

    if (alreadyPrompted) return

    const scroller = containerRef.current?.closest('.scene-shell')
    if (!scroller) return

    const handleScroll = () => {
      if (
        scroller.scrollTop > 200 &&
        scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 250
      ) {
        setShowFeedbackModal(true)
        scroller.removeEventListener('scroll', handleScroll)
      }
    }

    scroller.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      scroller.removeEventListener('scroll', handleScroll)
    }
  }, [navigate, savedRunId])

  const markPrompted = () => {
    const storageKey = savedRunId
      ? `capi_feedback_prompted_${savedRunId}`
      : 'capi_feedback_prompted_latest'
    try {
      localStorage.setItem(storageKey, 'true')
    } catch (e) {
      void e
    }
  }

  const handleCloseFeedbackModal = () => {
    markPrompted()
    setShowFeedbackModal(false)
  }

  const handleAcceptFeedback = () => {
    markPrompted()
    setShowFeedbackModal(false)
    setShowSurveyModal(true)
  }

  if (!result || !certCopy) return null

  const primaryRoleKey = result.primaryRole
  const secondaryRoleKey = result.secondaryRole

  const primaryRoleMeta = CAPI_ROLES[primaryRoleKey] || {
    nameVn: 'Nhà Khám Phá',
    name: 'Explorer',
    color: '#7c5cff',
  }
  const secondaryRoleMeta = CAPI_ROLES[secondaryRoleKey] || {
    nameVn: 'Kỹ Sư Chế Tạo',
    name: 'Builder',
    color: '#00e5ff',
  }

  // Fetch data from localized i18n catalogs
  const reportCatalog = t('report.data', { returnObjects: true }) || {}
  const primaryRoleData = t(`roles.${primaryRoleKey}`, { returnObjects: true }) || {}

  // Combination profiles
  const primaryComboId = `${primaryRoleKey}_${secondaryRoleKey}`

  const primaryComboData = reportCatalog.combinationbank?.[primaryComboId] || {}

  // Lowest role for Step 2 Missing Piece
  const sortedRoles = Object.keys(CAPI_ROLES).sort(
    (a, b) => (result.phase2?.[a] || 0) - (result.phase2?.[b] || 0),
  )
  const missingRoleKey = sortedRoles[0]
  const missingRoleMeta = CAPI_ROLES[missingRoleKey] || {}

  // Find exact pair for missing piece
  const missingPieceData = (reportCatalog.missingpiece || []).find(
    (mp) => mp.primary_role === primaryRoleKey && mp.missing_role === missingRoleKey,
  )

  // Setup standard Career domains (Block 11)
  const allCareers = (reportCatalog.careermap || []).filter(
    (c) => c.role_id === primaryRoleKey || c.role_id === secondaryRoleKey,
  )

  const handlePrint = () => {
    window.print()
  }

  // Filter activities for Block 8
  const primaryActivities = (reportCatalog.activities || []).filter(
    (act) => act.role_id === primaryRoleKey,
  )

  // Filter resources skills for Step 3
  const primarySkills = (reportCatalog.resources || []).filter(
    (res) => res.role_id === primaryRoleKey && res.resource_type === 'skill',
  )

  return (
    <SceneShell light>
      {/* Top Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: 1200,
          height: 480,
          background:
            'radial-gradient(ellipse 65% 55% at 50% 12%, rgba(132, 52, 151, 0.09) 0%, rgba(2, 132, 199, 0.04) 50%, transparent 80%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Main Report Container */}
      <div
        ref={containerRef}
        className="print-container report-details-container"
        style={{ position: 'relative', zIndex: 1 }}
      >
        {/* Title Block 1 */}
        <div className="report-details-header">
          <div>
            <h1 className="report-details-title">{t('report.details_title_main')}</h1>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '4px',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  boxShadow: '0 0 8px var(--color-primary)',
                }}
              />
              <span
                style={{
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono, monospace)',
                  fontWeight: 700,
                  color: 'var(--color-primary)',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                }}
              >
                CAPI-GENE DECODING REPORT • DEEP ANALYSIS
              </span>
            </div>
          </div>

          <div>
            <Button
              variant="outline"
              className="no-print"
              onClick={handlePrint}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                width: 'auto',
                padding: '8px 18px',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '10px',
              }}
            >
              <Icon icon="mdi:download-outline" width={18} height={18} />
              <span>{t('report.btn_pdf')}</span>
            </Button>
          </div>
        </div>

        {/* BLOCK 2-5: Primary Power Card & Radar Section */}
        <PowerBlock
          isEn={isEn}
          isSecondary={false}
          primaryRoleKey={primaryRoleKey}
          secondaryRoleKey={secondaryRoleKey}
          primaryRoleMeta={primaryRoleMeta}
          secondaryRoleMeta={secondaryRoleMeta}
          primaryRoleData={primaryRoleData}
          primaryComboData={primaryComboData}
          result={result}
        />

        {/* BLOCK 6: Combination Power Card & Radar Section */}
        <PowerBlock
          isEn={isEn}
          isSecondary={true}
          primaryRoleKey={primaryRoleKey}
          secondaryRoleKey={secondaryRoleKey}
          primaryRoleMeta={primaryRoleMeta}
          secondaryRoleMeta={secondaryRoleMeta}
          primaryRoleData={primaryRoleData}
          primaryComboData={primaryComboData}
          result={result}
        />

        {/* BLOCK 7: Evidence from Simulator */}
        <EvidenceBlock
          isEn={isEn}
          result={result}
          selectedMission={selectedMission}
          primaryRoleKey={primaryRoleKey}
          secondaryRoleKey={secondaryRoleKey}
          primaryRoleMeta={primaryRoleMeta}
          secondaryRoleMeta={secondaryRoleMeta}
        />

        {/* BLOCK 8 & 9: Development Path — 3 Columns Staggered Layout */}
        <DevelopmentTimeline
          isEn={isEn}
          primaryActivities={primaryActivities}
          missingRoleMeta={missingRoleMeta}
          missingPieceData={missingPieceData}
          primarySkills={primarySkills}
        />

        {/* BLOCK 10: Accordion levels detail */}
        <AccordionSkills isEn={isEn} primarySkills={primarySkills} />

        {/* BLOCK 11: Career Map */}
        <CareerMapTabs isEn={isEn} allCareers={allCareers} />

        {/* CTA Actions Group */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            gap: '16px',
            width: '100%',
            marginTop: '32px',
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/certificate/summary')
            }}
            style={{
              flex: 1,
              minWidth: '200px',
              height: '48px',
              gap: '8px',
            }}
          >
            <Icon icon="mdi:arrow-left" width={18} height={18} />
            <span>{t('report.btn_back_to_summary')}</span>
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              capiAudio.sfx('click')
              setShowSurveyModal(true)
            }}
            style={{
              flex: 1,
              minWidth: '200px',
              height: '48px',
              gap: '8px',
            }}
          >
            <Icon icon="mdi:comment-quote-outline" width={18} height={18} />
            <span>{t('report.btn_feedback')}</span>
          </Button>

          <Button
            variant="solid"
            active
            onClick={() => {
              capiAudio.sfx('click')
              navigate('/')
            }}
            style={{
              flex: 1,
              minWidth: '200px',
              height: '48px',
              gap: '8px',
            }}
          >
            <Icon icon="mdi:home-outline" width={18} height={18} />
            <span>{t('report.btn_home')}</span>
          </Button>
        </div>
      </div>

      <FeedbackInvitationModal
        isOpen={showFeedbackModal}
        onClose={handleCloseFeedbackModal}
        onAccept={handleAcceptFeedback}
      />

      <FeedbackModal
        isOpen={showSurveyModal}
        onClose={() => setShowSurveyModal(false)}
        runId={savedRunId}
      />
    </SceneShell>
  )
}
