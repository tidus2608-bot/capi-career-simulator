import React, { useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon } from '@iconify/react'
import SceneShell from './SceneShell.jsx'
import { CAPI_ROLES } from '../../data.js'
import reportData from '../../data/reportData.json'
import { useWizard } from '../../contexts/WizardContext.jsx'
import Button from '../Button.jsx'

// Subcomponents
import PowerBlock from '../report/PowerBlock.jsx'
import EvidenceBlock from '../report/EvidenceBlock.jsx'
import DevelopmentTimeline from '../report/DevelopmentTimeline.jsx'
import AccordionSkills from '../report/AccordionSkills.jsx'
import CareerMapTabs from '../report/CareerMapTabs.jsx'

// Color map for role styles
const ROLE_COLORS = {
  explorer: '#7c5cff',
  builder: '#00e5ff',
  operator: '#ffb020',
  connector: '#3ddc84',
  communicator: '#ff2d7a',
}

export default function ReportDetails() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const isEn = i18n.language === 'en'
  const { result, certCopy } = useOutletContext()
  const { selectedMission } = useWizard()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('print') === 'true') {
      const timer = setTimeout(() => {
        window.print()
        navigate('/certificate/details', { replace: true })
      }, 800)
      return () => clearTimeout(timer)
    }
  }, [navigate])

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

  // Fetch data from reportData
  const primaryRoleData = reportData.rolebank?.[primaryRoleKey] || {}

  // Combination profiles
  const primaryComboId = `${primaryRoleKey}_${secondaryRoleKey}`

  const primaryComboData = reportData.combinationbank?.[primaryComboId] || {}

  // Lowest role for Step 2 Missing Piece
  const sortedRoles = Object.keys(ROLE_COLORS).sort(
    (a, b) => (result.phase2?.[a] || 0) - (result.phase2?.[b] || 0),
  )
  const missingRoleKey = sortedRoles[0]
  const missingRoleMeta = CAPI_ROLES[missingRoleKey] || {}

  // Find exact pair for missing piece
  const missingPieceData = (reportData.missingpiece || []).find(
    (mp) => mp.primary_role === primaryRoleKey && mp.missing_role === missingRoleKey,
  )

  // Setup standard Career domains (Block 11)
  const allCareers = (reportData.careermap || []).filter(
    (c) => c.role_id === primaryRoleKey || c.role_id === secondaryRoleKey,
  )

  const handlePrint = () => {
    window.print()
  }

  // Filter activities for Block 8
  const primaryActivities = (reportData.activities || []).filter(
    (act) => act.role_id === primaryRoleKey,
  )

  // Filter resources skills for Step 3
  const primarySkills = (reportData.resources || []).filter(
    (res) => res.role_id === primaryRoleKey && res.resource_type === 'skill',
  )

  return (
    <SceneShell light>
      {/* Global CSS style block for printing & standard page styling overrides */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @media print {
            body {
              background-color: #FFFFFF !important;
              color: #000000 !important;
            }
            .no-print {
              display: none !important;
            }
            .print-container {
              padding: 0 !important;
              max-width: 100% !important;
              margin: 0 !important;
            }
            .print-card {
              box-shadow: none !important;
              border: 1px solid #E2E8F0 !important;
              page-break-inside: avoid;
              margin-bottom: 20px;
            }
            .page-break {
              page-break-before: always;
            }
          }
        `,
        }}
      />
      {/* Main Report Container */}
      <div
        className="print-container"
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '120px 24px 40px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px'
        }}
      >
        {/* Title Block 1 */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottom: '2px solid #E2E8F0',
            paddingBottom: '16px',
          }}
        >
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {t('report.details_title_main')}
            </h1>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#7E22CE',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Capi-Gene Decoding Report
            </span>
          </div>

          <div>
            <Button
              variant="solid"
              className="no-print"
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                width: 'fit-content',
              }}
            >
              <Icon icon="mdi:printer" width={18} height={18} />
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
      </div>
    </SceneShell>
  )
}
