import { describe, it, expect } from 'vitest'
import React from 'react'
import { render, screen } from '@testing-library/react'
import PowerBlock from './PowerBlock.jsx'
import EvidenceBlock from './EvidenceBlock.jsx'
import DevelopmentTimeline from './DevelopmentTimeline.jsx'
import CareerMapTabs from './CareerMapTabs.jsx'
import AccordionSkills from './AccordionSkills.jsx'
import RadarRanking from './RadarRanking.jsx'
import reportData from '../../data/reportData.json'

describe('Report UI Components Suite', () => {
  const sampleResult = {
    primaryRole: 'builder',
    secondaryRole: 'explorer',
    profileType: 'Balanced',
    final: {
      builder: 78,
      explorer: 65,
      operator: 50,
      connector: 45,
      communicator: 40,
    },
    phase1: {
      builder: 80,
      explorer: 60,
      operator: 50,
      connector: 40,
      communicator: 40,
    },
    phase2: {
      builder: 75,
      explorer: 70,
      operator: 50,
      connector: 50,
      communicator: 40,
    },
    phase3: {
      builder: 80,
      explorer: 65,
      operator: 50,
      connector: 45,
      communicator: 40,
    },
    realityGap: {
      builder: 5,
      explorer: -10,
      operator: 0,
      connector: -10,
      communicator: 0,
    },
    confidenceFactor: 4.2,
    missionId: 1,
    theme: 'ark-capi',
  }

  const primaryRoleMeta = {
    key: 'builder',
    name_vn: 'Nhà Kiến Tạo',
    name_en: 'Builder',
    color: '#EF4444',
  }

  const secondaryRoleMeta = {
    key: 'explorer',
    name_vn: 'Nhà Khám Phá',
    name_en: 'Explorer',
    color: '#22C55E',
  }

  const primaryRoleData = reportData.rolebank.builder

  it('renders RadarRanking component without errors', () => {
    const { container } = render(
      <RadarRanking
        result={sampleResult}
        isEn={false}
        primaryRoleMeta={primaryRoleMeta}
        secondaryRoleMeta={secondaryRoleMeta}
      />,
    )
    expect(container.querySelector('.print-card')).toBeInTheDocument()
  })

  it('renders PowerBlock component with primary role details', () => {
    render(
      <PowerBlock
        isEn={false}
        isSecondary={false}
        primaryRoleKey="builder"
        secondaryRoleKey="explorer"
        primaryRoleMeta={primaryRoleMeta}
        secondaryRoleMeta={secondaryRoleMeta}
        primaryRoleData={primaryRoleData}
        primaryComboData={null}
        result={sampleResult}
      />,
    )
    expect(screen.getByText(/Nhà Kiến Tạo/i)).toBeInTheDocument()
  })

  it('renders EvidenceBlock component', () => {
    const { container } = render(
      <EvidenceBlock
        isEn={false}
        result={sampleResult}
        primaryRoleKey="builder"
        secondaryRoleKey="explorer"
        primaryRoleMeta={primaryRoleMeta}
        secondaryRoleMeta={secondaryRoleMeta}
      />,
    )
    expect(container.querySelector('.print-card')).toBeInTheDocument()
  })

  it('renders DevelopmentTimeline component', () => {
    const { container } = render(
      <DevelopmentTimeline isEn={false} primaryRoleKey="builder" secondaryRoleKey="explorer" />,
    )
    expect(container.querySelector('.print-card')).toBeInTheDocument()
  })

  it('renders CareerMapTabs component', () => {
    const { container } = render(
      <CareerMapTabs isEn={false} primaryRoleKey="builder" secondaryRoleKey="explorer" />,
    )
    expect(container.querySelector('.print-card')).toBeInTheDocument()
  })

  it('renders AccordionSkills component', () => {
    const { container } = render(
      <AccordionSkills isEn={false} primaryRoleKey="builder" secondaryRoleKey="explorer" />,
    )
    expect(container.querySelector('.print-card')).toBeInTheDocument()
  })
})
