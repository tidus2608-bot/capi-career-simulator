import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { getRoleConfig } from '../../data.js'
import { useWizard } from '../../contexts/WizardContext.jsx'
import { supabase } from '../../lib/supabase.js'
import SceneShell from './SceneShell.jsx'
import Button from '../Button.jsx'
import Pagination from '../Pagination.jsx'
import Modal from '../Modal.jsx'
import AnswersModal from '../history/AnswersModal.jsx'
import HistoryCard from '../history/HistoryCard.jsx'
import LoginPrompt from '../history/LoginPrompt.jsx'
import { useResponsiveItemsPerPage } from '../history/useResponsiveItemsPerPage.js'

export default function HistoryScene() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, loadRun } = useWizard()
  const itemsPerPage = useResponsiveItemsPerPage()
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modals & filters for History list
  const [selectedRunForAnswers, setSelectedRunForAnswers] = useState(null)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)

  // Compare selection state
  const [selectedCompareRunIds, setSelectedCompareRunIds] = useState([])
  const [showMaxLimitModal, setShowMaxLimitModal] = useState(false)

  useEffect(() => {
    if (!user) return undefined
    let cancelled = false
    supabase
      .from('runs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60)
      .then(({ data, error: err }) => {
        if (cancelled) return
        if (err) setError(err.message || t('history.load_error'))
        else setRuns(data || [])
        setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user, t])

  const handleOpenReport = useCallback(
    (runData) => {
      if (!runData.scores?.final) return
      loadRun(runData)
      navigate('/certificate/summary')
    },
    [loadRun, navigate],
  )

  const handleOpenAnswers = useCallback((runData) => {
    setSelectedRunForAnswers(runData)
  }, [])

  const handleLogin = async () => {
    const redirectTo =
      window.location.origin +
      window.location.pathname +
      window.location.search +
      window.location.hash

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        },
      })
      if (error) {
        console.error('OAuth login error:', error)
      }
    } catch (err) {
      console.error('OAuth login exception:', err)
    }
  }

  // Summary Metrics
  const totalExperiences = runs.length
  const { dominantRoleKey, roleCounts } = useMemo(() => {
    const counts = { builder: 0, explorer: 0, operator: 0, connector: 0, communicator: 0 }
    if (!runs.length) return { dominantRoleKey: 'connector', roleCounts: counts }
    for (const r of runs) {
      const rk = (r.primary_role || '').toLowerCase()
      if (counts[rk] !== undefined) counts[rk] += 1
      else counts[rk] = 1
    }
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
    return { dominantRoleKey: sorted[0]?.[0] || 'connector', roleCounts: counts }
  }, [runs])

  const dominantRoleConfig = getRoleConfig(dominantRoleKey)

  // Filtered & Sorted runs
  const filteredRuns = useMemo(() => {
    let list = [...runs]
    if (selectedRoleFilter !== 'all') {
      list = list.filter((r) => (r.primary_role || '').toLowerCase() === selectedRoleFilter)
    }

    if (sortOrder === 'oldest') {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortOrder === 'score') {
      list.sort((a, b) => {
        const scoreA = a.scores?.final?.[a.primary_role] || 0
        const scoreB = b.scores?.final?.[b.primary_role] || 0
        return scoreB - scoreA
      })
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    return list
  }, [runs, selectedRoleFilter, sortOrder])

  // Pagination for History List
  const totalPages = Math.ceil(filteredRuns.length / itemsPerPage) || 1
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages)

  const paginatedRuns = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage
    return filteredRuns.slice(start, start + itemsPerPage)
  }, [filteredRuns, validCurrentPage, itemsPerPage])

  const historyFromCount = paginatedRuns.length > 0 ? (validCurrentPage - 1) * itemsPerPage + 1 : 0
  const historyToCount =
    paginatedRuns.length > 0 ? (validCurrentPage - 1) * itemsPerPage + paginatedRuns.length : 0

  const handleToggleCompareRun = useCallback((runId) => {
    setSelectedCompareRunIds((prev) => {
      if (prev.includes(runId)) {
        return prev.filter((id) => id !== runId)
      }
      if (prev.length >= 2) {
        setShowMaxLimitModal(true)
        return prev
      }
      return [...prev, runId]
    })
  }, [])

  const handleNavigateCompare = useCallback(() => {
    if (selectedCompareRunIds.length !== 2) return
    const run1 = runs.find((r) => r.id === selectedCompareRunIds[0])
    const run2 = runs.find((r) => r.id === selectedCompareRunIds[1])
    navigate(
      `/history/compare?run1=${encodeURIComponent(selectedCompareRunIds[0])}&run2=${encodeURIComponent(selectedCompareRunIds[1])}`,
      {
        state: { run1, run2 },
      },
    )
  }, [selectedCompareRunIds, runs, navigate])

  return (
    <SceneShell light>
      {/* Ambient Lighting Background */}
      <div
        aria-hidden="true"
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

      <div className="history-page-shell">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            color: 'var(--ink-muted)',
            marginBottom: -8,
          }}
        >
          <button
            onClick={() => navigate('/certificate/summary')}
            style={{
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              transition: 'color 150ms ease',
            }}
          >
            {t('history.breadcrumb_report')}
          </button>
          <span>/</span>
          <button
            onClick={() => navigate('/certificate/details')}
            style={{
              color: 'var(--ink-secondary)',
              cursor: 'pointer',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: 'inherit',
              transition: 'color 150ms ease',
            }}
          >
            {t('history.breadcrumb_detail')}
          </button>
          <span>/</span>
          <span style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
            {t('history.breadcrumb_history')}
          </span>
        </nav>

        {/* Integrated Page Header */}
        <div className="fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: 'var(--ink-main)',
              margin: 0,
              letterSpacing: '-0.02em',
              fontFamily: 'var(--font-display)',
            }}
          >
            {t('history.title')}
          </h1>
          <p
            style={{
              fontSize: 14.5,
              color: 'var(--ink-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            {t('history.desc')}
          </p>
        </div>

        {!user ? (
          <LoginPrompt handleLogin={handleLogin} t={t} />
        ) : loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
            <div
              className="mono"
              style={{ color: 'var(--ink-muted)', fontSize: 14, textAlign: 'center' }}
            >
              <Icon
                icon="mdi:loading"
                width={28}
                height={28}
                className="spin"
                style={{
                  margin: '0 auto 12px auto',
                  display: 'block',
                  color: 'var(--color-primary)',
                }}
              />
              {t('common.loading', 'Đang tải...')}
            </div>
          </div>
        ) : error ? (
          <div
            className="glass"
            style={{
              padding: '40px 30px',
              textAlign: 'center',
              color: 'var(--color-danger, #E11D48)',
              borderColor: 'rgba(225, 29, 72, 0.2)',
              backgroundColor: 'rgba(225, 29, 72, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              borderRadius: 20,
            }}
          >
            <Icon icon="mdi:alert-circle-outline" width={48} height={48} style={{ opacity: 0.8 }} />
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {t('history.load_error', { error })}
            </div>
          </div>
        ) : (
          <>
            {/* Section 1: Bento Dossier Overview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 12,
                }}
              >
                <h2
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: 'var(--ink-main)',
                    margin: 0,
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {t('history.overview_title', 'Tổng quan')}
                </h2>
              </div>

              <div className="bento-dossier-grid fade-up">
                {/* Bento Card 1: Dominant Role Hero Spotlight */}
                <div
                  className="bento-dossier-card bento-hero-card"
                  style={{
                    backgroundImage: `radial-gradient(circle at 92% 12%, ${dominantRoleConfig.color}15 0%, transparent 55%)`,
                  }}
                >
                  <div className="bento-hero-header">
                    <span className="bento-tag" style={{ color: dominantRoleConfig.color }}>
                      <Icon icon="mdi:crown-outline" width={16} />
                      {t('history.dominant_archetype', 'Hình mẫu chủ đạo')}
                    </span>
                    <span className="bento-role-pct">
                      {Math.round(
                        ((roleCounts[dominantRoleKey] || 0) / (totalExperiences || 1)) * 100,
                      )}
                      % {t('history.frequency', 'tổng số lượt')}
                    </span>
                  </div>

                  <div className="bento-hero-body">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3
                        className="bento-hero-role-title"
                        style={{ color: dominantRoleConfig.color }}
                      >
                        {t(`roles.${dominantRoleKey}.name`, dominantRoleConfig.name)}
                      </h3>
                      <p className="bento-hero-role-desc">
                        {dominantRoleConfig.nameVn} •{' '}
                        {t('history.top_role_sub', 'Role xuất hiện nhiều nhất qua các bài làm.')}
                      </p>
                    </div>

                    <div
                      className="bento-hero-icon-emblem"
                      style={{
                        backgroundColor: dominantRoleConfig.bg,
                        color: dominantRoleConfig.color,
                        border: `1.5px solid ${dominantRoleConfig.color}35`,
                        boxShadow: `0 8px 24px -4px ${dominantRoleConfig.color}25`,
                      }}
                    >
                      <Icon icon={dominantRoleConfig.icon} width={34} height={34} />
                    </div>
                  </div>

                  {/* Archetype Distribution Strip */}
                  <div className="bento-role-distribution">
                    {['builder', 'explorer', 'operator', 'connector', 'communicator'].map(
                      (roleKey) => {
                        const count = roleCounts[roleKey] || 0
                        const rc = getRoleConfig(roleKey)
                        return (
                          <div
                            key={roleKey}
                            className="bento-role-pill"
                            style={{
                              borderColor:
                                roleKey === dominantRoleKey ? rc.color : 'var(--border-light)',
                              backgroundColor:
                                roleKey === dominantRoleKey ? rc.bg : 'var(--surface-light)',
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: rc.color,
                                flexShrink: 0,
                              }}
                            />
                            <span style={{ fontWeight: 700, color: rc.color }}>
                              {t(`roles.${roleKey}.name`, rc.name)}
                            </span>
                            <span style={{ color: 'var(--ink-muted)', fontSize: 11 }}>{count}</span>
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>

                {/* Bento Card 2: Quest Progress & Metrics */}
                <div className="bento-dossier-card bento-stats-card">
                  <div className="bento-stats-header">
                    <span className="bento-tag">
                      <Icon icon="mdi:compass-rose" width={16} />
                      {t('history.quest_progress', 'Hành trình khám phá')}
                    </span>
                    <span className="bento-level-badge">
                      Level {Math.max(1, Math.floor(totalExperiences / 2))}
                    </span>
                  </div>

                  <div className="bento-stats-main">
                    <div className="bento-stat-number-wrapper">
                      <span className="bento-stat-huge-number">{totalExperiences}</span>
                      <span className="bento-stat-unit">{t('history.runs_unit', 'lượt làm')}</span>
                    </div>
                    <p className="bento-stat-subtext">
                      {t(
                        'history.total_runs_sub',
                        'Số lần đã hoàn thành bài mô phỏng nghề nghiệp.',
                      )}
                    </p>
                  </div>

                  <div className="bento-stats-footer">
                    <div className="bento-stat-footer-item">
                      <Icon
                        icon="mdi:clock-check-outline"
                        width={18}
                        style={{ color: 'var(--color-primary)' }}
                      />
                      <span>
                        {filteredRuns.length} {t('history.filtered_count', 'lượt hiển thị')}
                      </span>
                    </div>
                    <div className="bento-stat-footer-item">
                      <Icon
                        icon="mdi:shield-check-outline"
                        width={18}
                        style={{ color: 'var(--color-success, #059669)' }}
                      />
                      <span>{t('history.authenticated_data', 'Dữ liệu đã đồng bộ')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: History List & Controls ("Lịch sử làm bài") */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 8 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      color: 'var(--ink-main)',
                      margin: 0,
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {t('history.list_title', 'Lịch sử làm bài')}
                  </h2>
                  <div
                    className="history-compare-hint"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      margin: '8px 0 0 0',
                      padding: '6px 14px',
                      borderRadius: 9999,
                      backgroundColor: 'var(--surface-lavender)',
                      border: '1px solid var(--border-purple)',
                      color: 'var(--color-primary)',
                      fontSize: 13,
                      fontWeight: 600,
                      boxShadow: '0 2px 6px rgba(132, 52, 151, 0.08)',
                      width: 'fit-content',
                    }}
                  >
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-primary)',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 0 6px rgba(132, 52, 151, 0.3)',
                      }}
                    >
                      <Icon icon="mdi:lightbulb-on" width={13} height={13} />
                    </div>
                    <span>
                      {t(
                        'history.compare_hint',
                        'Mẹo: Nhấn vào thẻ để chọn và so sánh 2 lượt làm bài với nhau.',
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setFilterOpen((o) => !o)}
                  aria-label={t('history.filter_by_role', 'Lọc danh sách')}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    border: '1px solid var(--border-light)',
                    backgroundColor: filterOpen
                      ? 'var(--surface-lavender)'
                      : 'var(--surface-light)',
                    color: filterOpen ? 'var(--color-primary)' : 'var(--ink-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    transition:
                      'background-color 150ms ease, color 150ms ease, border-color 150ms ease',
                  }}
                >
                  <Icon icon="mdi:tune" width={20} height={20} />
                </button>
              </div>

              {/* Filter Row */}
              {filterOpen && (
                <div
                  className="fade-up"
                  style={{
                    padding: '16px 20px',
                    borderRadius: 16,
                    backgroundColor: 'var(--surface-light)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-secondary)' }}>
                      {t('history.filter_by_role', 'Vai trò')}:
                    </span>
                    {['all', 'explorer', 'builder', 'operator', 'connector', 'communicator'].map(
                      (role) => (
                        <button
                          key={role}
                          className={`filter-chip ${selectedRoleFilter === role ? 'active' : ''}`}
                          onClick={() => {
                            setSelectedRoleFilter(role)
                            setCurrentPage(1)
                          }}
                        >
                          {role === 'all' ? t('history.filter_all') : t(`roles.${role}.name`, role)}
                        </button>
                      ),
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-secondary)' }}>
                      {t('history.sort_label')}
                    </span>
                    {[
                      { key: 'newest', label: t('history.sort_newest') },
                      { key: 'oldest', label: t('history.sort_oldest') },
                      { key: 'score', label: t('history.sort_score') },
                    ].map((s) => (
                      <button
                        key={s.key}
                        className={`filter-chip ${sortOrder === s.key ? 'active' : ''}`}
                        onClick={() => setSortOrder(s.key)}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Grid of Simulation Cards */}
              {filteredRuns.length === 0 ? (
                <div
                  className="glass"
                  style={{
                    padding: '60px 30px',
                    textAlign: 'center',
                    color: 'var(--ink-secondary)',
                    backgroundColor: 'var(--surface-light)',
                    borderColor: 'var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 16,
                    borderRadius: 20,
                  }}
                >
                  <Icon
                    icon="mdi:text-box-search-outline"
                    width={48}
                    height={48}
                    style={{ opacity: 0.4 }}
                  />
                  <div style={{ fontSize: 16, fontWeight: 500 }}>
                    {t('history.empty', 'Chưa có lần chạy nào phù hợp.')}
                  </div>
                </div>
              ) : (
                <div
                  className="history-cards-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                    gap: 20,
                  }}
                >
                  {paginatedRuns.map((r) => (
                    <HistoryCard
                      key={r.id}
                      run={r}
                      isSelected={selectedCompareRunIds.includes(r.id)}
                      onToggleCompare={handleToggleCompareRun}
                      onOpenAnswers={handleOpenAnswers}
                      onOpenReport={handleOpenReport}
                      t={t}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {filteredRuns.length > 0 && (
                <div
                  className="history-pagination-wrapper"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 20,
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <div
                    className="history-pagination-info"
                    style={{ fontSize: 14, color: 'var(--ink-secondary)' }}
                  >
                    {t('history.showing_results', {
                      from: historyFromCount,
                      to: historyToCount,
                      total: filteredRuns.length,
                    })}
                  </div>

                  <Pagination
                    current={validCurrentPage}
                    total={totalPages}
                    onChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating Compare Action Bar (Centered Light Frosted Glass) */}
      {selectedCompareRunIds.length > 0 && (
        <div className="floating-compare-bar">
          <div className="compare-info-group">
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: 13,
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(132, 52, 151, 0.35)',
              }}
            >
              {selectedCompareRunIds.length}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                className="compare-info-title"
                style={{
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: 'var(--ink-main)',
                  fontFamily: 'var(--font-display)',
                  whiteSpace: 'nowrap',
                }}
              >
                {t('history.selected_runs_count', {
                  count: selectedCompareRunIds.length,
                  total: 2,
                })}
              </span>
              <span
                className="compare-info-subtext"
                style={{
                  fontSize: 11.5,
                  color:
                    selectedCompareRunIds.length === 2
                      ? 'var(--color-primary)'
                      : 'var(--ink-secondary)',
                  fontWeight: selectedCompareRunIds.length === 2 ? 600 : 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {selectedCompareRunIds.length === 2
                  ? t('history.ready_to_compare', 'Sẵn sàng đối chiếu')
                  : t('history.pick_one_more', 'Chọn thêm 1 lượt nữa')}
              </span>
            </div>
          </div>

          <div className="compare-actions-group">
            <button
              onClick={() => setSelectedCompareRunIds([])}
              className="compare-cancel-btn"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ink-secondary)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 10px',
                borderRadius: 8,
                whiteSpace: 'nowrap',
                transition: 'color 150ms ease, background-color 150ms ease',
              }}
            >
              {t('common.cancel', 'Hủy')}
            </button>

            <Button
              variant="solid"
              active={selectedCompareRunIds.length === 2}
              disabled={selectedCompareRunIds.length !== 2}
              onClick={handleNavigateCompare}
              className="compare-submit-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 18px',
                borderRadius: 9999,
                fontWeight: 700,
                fontSize: 13,
                whiteSpace: 'nowrap',
              }}
            >
              <Icon icon="mdi:compare-horizontal" width={16} height={16} />
              <span className="compare-btn-label-desktop">
                {t('history.btn_compare', 'So sánh kết quả')}
              </span>
              <span className="compare-btn-label-mobile">
                {t('history.btn_compare_short', 'So sánh')}
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Answers Detail Modal */}
      {selectedRunForAnswers && (
        <AnswersModal
          run={selectedRunForAnswers}
          onClose={() => setSelectedRunForAnswers(null)}
          onViewReport={handleOpenReport}
          t={t}
        />
      )}

      {/* Limit Modal Alert when trying to select 3rd run */}
      <Modal
        isOpen={showMaxLimitModal}
        onClose={() => setShowMaxLimitModal(false)}
        title={t('history.max_selection_warning_title', 'Giới hạn lượt so sánh')}
        description={t(
          'history.max_selection_warning_desc',
          'Chỉ được phép chọn tối đa 2 lượt làm test.',
        )}
        icon="mdi:alert-circle-outline"
        confirmText={t('common.understood', 'Đã hiểu')}
        onConfirm={() => setShowMaxLimitModal(false)}
      />
    </SceneShell>
  )
}
