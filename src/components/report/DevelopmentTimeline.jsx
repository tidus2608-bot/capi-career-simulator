import React from 'react'
import { useTranslation } from 'react-i18next'
import { CAPI_ROLES } from '../../data.js'

export default function DevelopmentTimeline({
  isEn,
  primaryActivities = [],
  missingRoleMeta = {},
  missingPieceData = {},
  primarySkills = [],
}) {
  const { t } = useTranslation()

  const missingRoleName = isEn
    ? missingRoleMeta?.name ||
      missingRoleMeta?.name_en ||
      (missingRoleMeta?.key ? CAPI_ROLES[missingRoleMeta.key]?.name : '') ||
      ''
    : missingRoleMeta?.nameVn ||
      missingRoleMeta?.name_vn ||
      (missingRoleMeta?.key ? CAPI_ROLES[missingRoleMeta.key]?.nameVn : '') ||
      ''

  const missingActivitiesList = Array.isArray(missingPieceData?.activities)
    ? missingPieceData.activities
    : typeof missingPieceData?.activities_to_train === 'string'
      ? missingPieceData.activities_to_train
          .split(/(?<=[.!?])\s+/)
          .map((s) => s.trim())
          .filter(Boolean)
      : []

  return (
    <section className="report-section print-card dev-timeline-section">
      {/* Header Row with Horizontal Accent Line */}
      <div className="dev-timeline-header-row">
        <h3 className="dev-timeline-heading">{t('report.dev_path_title')}</h3>
        <div className="dev-timeline-header-line" />
      </div>

      <div className="dev-timeline-staircase-wrapper">
        {/* Connecting Dashed Curves Overlay (SVG for Desktop & Print) */}
        <svg
          className="dev-timeline-dashed-curves"
          viewBox="0 0 900 440"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Curve 1: Step 1 top -> Arches up -> drops into Step 2 top */}
          <path d="M 180 28 C 300 -25, 450 -15, 450 78" className="dev-timeline-dash-path" />
          {/* Curve 2: Step 2 bottom -> Loops down & right -> leads to Step 3 */}
          <path d="M 450 388 C 475 450, 620 460, 740 375" className="dev-timeline-dash-path" />
        </svg>

        {/* 3 Stepped Cards */}
        <div className="dev-timeline-staircase-grid">
          {/* Step 1: Activities to Try */}
          <div className="dev-timeline-step-card dev-timeline-step-1">
            <div className="dev-timeline-step-header">
              <div className="dev-timeline-step-num dev-timeline-step-num--1">1</div>
              <h4 className="dev-timeline-step-title dev-timeline-step-title--1">
                {t('report.dev_step1_try')}
              </h4>
            </div>

            <div className="dev-timeline-step-body">
              <ul className="dev-timeline-clean-list">
                {primaryActivities.slice(0, 4).map((act, i) => (
                  <li key={i} className="dev-timeline-clean-item">
                    <span className="dev-timeline-bullet dev-timeline-bullet--purple">✦</span>
                    <span className="dev-timeline-item-text">{act.activity_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile connector between Step 1 and Step 2 */}
          <div className="dev-timeline-mobile-connector" aria-hidden="true">
            <div className="dev-timeline-mobile-connector-line" />
          </div>

          {/* Step 2: Areas to Strengthen */}
          <div className="dev-timeline-step-card dev-timeline-step-2">
            <div className="dev-timeline-step-header">
              <div className="dev-timeline-step-num dev-timeline-step-num--2">2</div>
              <h4 className="dev-timeline-step-title dev-timeline-step-title--2">
                {t('report.dev_step2_balance')}
              </h4>
            </div>

            <div className="dev-timeline-step-body">
              {missingRoleName && (
                <div className="dev-timeline-role-pill">
                  <span className="dev-timeline-role-pill-dot">◈</span>
                  <span>{missingRoleName}</span>
                </div>
              )}

              <ul className="dev-timeline-clean-list">
                {missingActivitiesList.length > 0 ? (
                  missingActivitiesList.map((act, i) => (
                    <li key={i} className="dev-timeline-clean-item">
                      <span className="dev-timeline-bullet dev-timeline-bullet--pink">•</span>
                      <span className="dev-timeline-item-text">{act}</span>
                    </li>
                  ))
                ) : (
                  <li className="dev-timeline-clean-item">
                    <span className="dev-timeline-bullet dev-timeline-bullet--pink">•</span>
                    <span className="dev-timeline-item-text">
                      {missingPieceData?.copy || t('report.dev_balance_with')}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Mobile connector between Step 2 and Step 3 */}
          <div className="dev-timeline-mobile-connector" aria-hidden="true">
            <div className="dev-timeline-mobile-connector-line" />
          </div>

          {/* Step 3: Recommended Skills */}
          <div className="dev-timeline-step-card dev-timeline-step-3">
            <div className="dev-timeline-step-header">
              <div className="dev-timeline-step-num dev-timeline-step-num--3">3</div>
              <h4 className="dev-timeline-step-title dev-timeline-step-title--3">
                {t('report.dev_step3_skills')}
              </h4>
            </div>

            <div className="dev-timeline-step-body">
              <ul className="dev-timeline-clean-list">
                {primarySkills.map((sk, i) => (
                  <li key={i} className="dev-timeline-clean-item dev-timeline-skill-item">
                    <div className="dev-timeline-skill-name-wrap">
                      <span className="dev-timeline-bullet dev-timeline-bullet--cyan">✦</span>
                      <span className="dev-timeline-item-text">{sk.name}</span>
                    </div>
                    {sk.level && (
                      <span
                        className={`dev-timeline-level-badge ${
                          sk.level === 'beginner'
                            ? 'dev-timeline-level-badge--basic'
                            : 'dev-timeline-level-badge--intermediate'
                        }`}
                      >
                        {sk.level === 'beginner'
                          ? t('report.levels.basic')
                          : t('report.levels.intermediate')}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
