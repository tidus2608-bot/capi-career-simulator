import { useState, useEffect, useMemo } from 'react'
import { DualRadar, SceneArt } from '../UI.jsx'
import { capiAudio } from '../../audio.js'
import { CAPI_ROLES } from '../../data.js'
import SceneShell from './SceneShell.jsx'

const PROFILE_COLOR = {
  Hidden: 'var(--magenta)',
  Aligned: 'var(--green)',
  Emerging: 'var(--gold)',
}

const SECTION_STYLE = {
  marginBottom: 32,
  paddingBottom: 24,
  borderBottom: '1px solid var(--line)',
}

function SaveStatusBanner({ saveStatus, saveError, onRetrySave }) {
  if (!saveStatus || saveStatus === 'idle') return null

  const tone =
    saveStatus === 'error'
      ? { border: 'var(--magenta)', bg: 'rgba(255,45,122,0.08)', color: 'var(--magenta)' }
      : saveStatus === 'success'
        ? { border: 'var(--green)', bg: 'rgba(61,220,132,0.06)', color: 'var(--green)' }
        : { border: 'var(--line)', bg: 'rgba(255,255,255,0.02)', color: 'var(--ink-dim)' }

  return (
    <div
      style={{
        marginTop: 28,
        padding: '10px 14px',
        borderRadius: 8,
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        border: '1px solid',
        borderColor: tone.border,
        background: tone.bg,
        color: tone.color,
      }}
    >
      {saveStatus === 'saving' && <span>⏳ Đang lưu kết quả vào tài khoản...</span>}
      {saveStatus === 'success' && (
        <span>✓ Đã lưu kết quả vào tài khoản. Bạn có thể xem lại trong &ldquo;Lịch sử&rdquo;.</span>
      )}
      {saveStatus === 'skipped' && (
        <span style={{ color: 'var(--ink-dim)' }}>
          Bạn chưa đăng nhập &mdash; kết quả này sẽ không được lưu lại.
        </span>
      )}
      {saveStatus === 'error' && (
        <>
          <span style={{ flex: 1 }}>
            Không lưu được kết quả{saveError ? `: ${saveError}` : '.'}
          </span>
          {onRetrySave && (
            <button
              className="btn btn-ghost"
              style={{
                padding: '6px 12px',
                fontSize: 12,
                color: 'var(--magenta)',
                borderColor: 'var(--magenta)',
              }}
              onClick={onRetrySave}
            >
              Thử lại
            </button>
          )}
        </>
      )}
    </div>
  )
}

export default function CertificateScene({
  result,
  certCopy,
  saveStatus,
  saveError,
  onRetrySave,
  onRestart,
  onHistory,
}) {
  const [flashed, setFlashed] = useState(true)

  // Stable cert ID so it doesn't change on every re-render (was Math.random in render).
  const certId = useMemo(() => Math.floor(Math.random() * 9000 + 1000), [])
  const certDate = useMemo(() => new Date().toISOString().slice(0, 10), [])

  useEffect(() => {
    const t = setTimeout(() => setFlashed(false), 900)
    capiAudio.sfx('success')
    return () => clearTimeout(t)
  }, [])

  if (!result || !certCopy) return null

  const primary = CAPI_ROLES[result.primaryRole] || {
    color: 'var(--cyan)',
    name: 'Explorer',
    nameVn: 'Nhà Khám Phá',
  }
  const secondary = CAPI_ROLES[result.secondaryRole] || {
    color: 'var(--magenta)',
    name: 'Builder',
    nameVn: 'Kỹ Sư Chế Tạo',
  }

  const profileColor = PROFILE_COLOR[result.profileType] || 'var(--cyan)'

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      {flashed && <div className="flash" />}

      <div
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          overflow: 'auto',
          padding: '28px 16px',
        }}
      >
        <div
          className="cert-bg fade-up"
          style={{
            maxWidth: 900,
            width: '100%',
            margin: '0 auto',
            padding: '40px 36px 28px',
            position: 'relative',
          }}
        >
          {/* Header badge */}
          <div style={{ position: 'absolute', top: 18, left: 24, opacity: 0.7 }}>
            <span className="mono" style={{ color: 'var(--cyan)', letterSpacing: '4px' }}>
              CAPI-GENE
            </span>
          </div>
          <div
            className="mono"
            style={{
              position: 'absolute',
              top: 24,
              right: 28,
              color: 'var(--ink-mute)',
              fontSize: 11,
            }}
          >
            CERT #{certId} · {certDate}
          </div>

          <SaveStatusBanner
            saveStatus={saveStatus}
            saveError={saveError}
            onRetrySave={onRetrySave}
          />

          {/* ── S1: Role Radar ── */}
          <div style={{ ...SECTION_STYLE, marginTop: 32, textAlign: 'center' }}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 16 }}>
              1 · ROLE RADAR
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 24,
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              <DualRadar
                scores1={result.phase1}
                scores2={result.phase2}
                size={300}
                color1="#5b9fff"
                color2="#ff6b9d"
              />
              <div style={{ textAlign: 'left', minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#5b9fff',
                      display: 'inline-block',
                    }}
                  />
                  <span className="mono" style={{ fontSize: 12, color: '#5b9fff' }}>
                    Self-Perception (Phase 1)
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#ff6b9d',
                      display: 'inline-block',
                    }}
                  />
                  <span className="mono" style={{ fontSize: 12, color: '#ff6b9d' }}>
                    Actual Behavior (Phase 2)
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ── S2: Working Style ── */}
          <div style={SECTION_STYLE}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 8 }}>
              2 · YOUR WORKING STYLE
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 18,
                lineHeight: 1.5,
                color: 'var(--ink)',
              }}
            >
              {certCopy.workingStyleHeadlineVn}
            </div>
          </div>

          {/* ── S3 & S4 ── */}
          <div style={{ ...SECTION_STYLE, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="glass" style={{ padding: 20, borderColor: primary.color + '55' }}>
              <div className="mono" style={{ color: primary.color, marginBottom: 6 }}>
                3 · YOUR SUPERPOWER
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  margin: '4px 0 2px',
                  color: primary.color,
                }}
              >
                {certCopy.superpowerVn.roleVn}
              </h2>
              <div className="mono" style={{ color: 'var(--ink-mute)', marginBottom: 8 }}>
                {certCopy.superpowerVn.roleEn}
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-dim)', marginBottom: 10 }}>
                {certCopy.superpowerVn.tagline}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <span
                  className="pill"
                  style={{ color: primary.color, borderColor: primary.color + '55' }}
                >
                  {certCopy.superpowerVn.bandLabel}
                </span>
                <span className="pill">{certCopy.superpowerVn.score} / 100</span>
              </div>
            </div>
            <div className="glass" style={{ padding: 20, borderColor: secondary.color + '55' }}>
              <div className="mono" style={{ color: secondary.color, marginBottom: 6 }}>
                4 · SECONDARY POWER
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 28,
                  margin: '4px 0 2px',
                  color: secondary.color,
                }}
              >
                {certCopy.secondaryPowerVn.roleVn}
              </h2>
              <div className="mono" style={{ color: 'var(--ink-mute)', marginBottom: 8 }}>
                {certCopy.secondaryPowerVn.roleEn}
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-dim)', marginBottom: 10 }}>
                {certCopy.secondaryPowerVn.tagline}
              </div>
              <span className="pill">{certCopy.secondaryPowerVn.score} / 100</span>
            </div>
          </div>

          {/* ── S5: Profile Type ── */}
          <div style={{ ...SECTION_STYLE, textAlign: 'center' }}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 10 }}>
              5 · PROFILE TYPE
            </div>
            <div
              style={{
                display: 'inline-block',
                padding: '16px 40px',
                borderRadius: 12,
                border: `2px solid ${profileColor}`,
                background: `${profileColor}15`,
                marginBottom: 16,
              }}
            >
              <div className="mono" style={{ color: profileColor, fontSize: 13, marginBottom: 4 }}>
                {result.profileType.toUpperCase()}
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px,4vw,52px)',
                  margin: 0,
                  color: profileColor,
                  textShadow: `0 0 30px ${profileColor}55`,
                }}
              >
                {certCopy.profileTypeLabelVn}
              </h2>
            </div>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: 'var(--ink-dim)',
                maxWidth: 600,
                margin: '0 auto',
              }}
            >
              {certCopy.profileTypeNarrativeVn}
            </p>
          </div>

          {/* ── S6: Reality & Growth ── */}
          <div style={SECTION_STYLE}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 10 }}>
              6 · REALITY & GROWTH INSIGHT
            </div>
            <div className="dialogue" style={{ margin: 0 }}>
              <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 6 }}>
                CAPI
              </div>
              <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0 }}>
                {certCopy.realityGrowthInsightVn}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 14 }}>
              <span className="pill" style={{ color: '#5b9fff' }}>
                Reality Gap (P2–P1): {Math.round(result.realityGap[result.primaryRole])} pt
              </span>
              <span className="pill" style={{ color: 'var(--gold)' }}>
                Learning Gap (P3–P1): {Math.round(result.learningGap[result.primaryRole])} pt
              </span>
              <span className="pill" style={{ color: 'var(--green)' }}>
                Confidence: {(result.confidenceFactor * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {/* ── S7: Role Interpretation ── */}
          <div style={SECTION_STYLE}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 10 }}>
              7 · ROLE INTERPRETATION
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              <div
                style={{
                  padding: 14,
                  borderLeft: `3px solid ${primary.color}`,
                  background: `${primary.color}0a`,
                  borderRadius: '0 8px 8px 0',
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: 'var(--ink-dim)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {certCopy.primaryInterpretationVn}
                </div>
              </div>
              <div
                style={{
                  padding: 14,
                  borderLeft: `3px solid ${secondary.color}`,
                  background: `${secondary.color}0a`,
                  borderRadius: '0 8px 8px 0',
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: 'var(--ink-dim)',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {certCopy.secondaryInterpretationVn}
                </div>
              </div>
            </div>
          </div>

          {/* ── S8: Score breakdown ── */}
          <div style={SECTION_STYLE}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 12 }}>
              8 · FULL SCORE BREAKDOWN
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: 'left',
                        padding: '8px 10px',
                        borderBottom: '1px solid var(--line)',
                        color: 'var(--ink-dim)',
                      }}
                    >
                      Vai trò
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '8px 10px',
                        borderBottom: '1px solid var(--line)',
                        color: '#5b9fff',
                      }}
                    >
                      P1 Tự nhận
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '8px 10px',
                        borderBottom: '1px solid var(--line)',
                        color: '#ff6b9d',
                      }}
                    >
                      P2 Hành vi
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '8px 10px',
                        borderBottom: '1px solid var(--line)',
                        color: 'var(--gold)',
                      }}
                    >
                      P3 Phản chiếu
                    </th>
                    <th
                      style={{
                        textAlign: 'right',
                        padding: '8px 10px',
                        borderBottom: '1px solid var(--line)',
                        color: 'var(--cyan)',
                      }}
                    >
                      Tổng hợp
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {certCopy.fullScoreBreakdown.map((row) => {
                    const rc = CAPI_ROLES[row.role]?.color || 'var(--ink)'
                    const isPrimary = row.role === result.primaryRole
                    return (
                      <tr
                        key={row.role}
                        style={{ background: isPrimary ? `${rc}10` : 'transparent' }}
                      >
                        <td
                          style={{
                            padding: '8px 10px',
                            color: rc,
                            fontWeight: isPrimary ? 600 : 400,
                          }}
                        >
                          {row.roleVn} {isPrimary ? '★' : ''}
                        </td>
                        <td style={{ textAlign: 'right', padding: '8px 10px', color: '#5b9fff' }}>
                          {row.selfPerception}
                        </td>
                        <td style={{ textAlign: 'right', padding: '8px 10px', color: '#ff6b9d' }}>
                          {row.actualBehavior}
                        </td>
                        <td
                          style={{ textAlign: 'right', padding: '8px 10px', color: 'var(--gold)' }}
                        >
                          {row.reflection}
                        </td>
                        <td
                          style={{
                            textAlign: 'right',
                            padding: '8px 10px',
                            color: 'var(--cyan)',
                            fontWeight: 600,
                          }}
                        >
                          {row.final}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── S9: Growth ── */}
          <div style={SECTION_STYLE}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 10 }}>
              9 · SUGGESTED GROWTH AREAS
            </div>
            <div style={{ display: 'grid', gap: 8 }}>
              {certCopy.growthAreasVn.map((g, i) => (
                <div
                  key={i}
                  style={{
                    padding: '10px 14px',
                    background: 'rgba(255,176,32,0.07)',
                    border: '1px solid rgba(255,176,32,0.2)',
                    borderRadius: 8,
                    fontSize: 14,
                    color: 'var(--ink-dim)',
                  }}
                >
                  💡 {g}
                </div>
              ))}
            </div>
          </div>

          {/* ── S10: Pathways ── */}
          <div style={SECTION_STYLE}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 10 }}>
              10 · CAREER & LEARNING PATHWAYS
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--ink-dim)', marginTop: 0 }}>
              Sự kết hợp của <b style={{ color: primary.color }}>{certCopy.superpowerVn.roleVn}</b>{' '}
              và{' '}
              <b style={{ color: secondary.color }}>{certCopy.secondaryPowerVn.roleVn}</b> tạo nên
              một profil hiếm có: bạn vừa có thể đào sâu vào lĩnh vực kỹ thuật của mình, vừa có khả
              năng hợp tác với các nhóm chức năng khác. Định hướng phù hợp với bạn là những vai trò
              đòi hỏi cả tư duy chuyên sâu lẫn sự linh hoạt.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <div className="mono" style={{ color: primary.color, fontSize: 11, marginBottom: 6 }}>
                  KỸ NĂNG CỐT LÕI
                </div>
                {certCopy.primaryQualifications.slice(0, 3).map((q) => (
                  <div
                    key={q}
                    style={{
                      padding: '6px 10px',
                      background: `${primary.color}0a`,
                      borderRadius: 6,
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    → {q}
                  </div>
                ))}
              </div>
              <div>
                <div
                  className="mono"
                  style={{ color: secondary.color, fontSize: 11, marginBottom: 6 }}
                >
                  KỸ NĂNG BỔ SUNG
                </div>
                {certCopy.secondaryQualifications.slice(0, 3).map((q) => (
                  <div
                    key={q}
                    style={{
                      padding: '6px 10px',
                      background: `${secondary.color}0a`,
                      borderRadius: 6,
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    → {q}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── S11: Careers ── */}
          <div style={SECTION_STYLE}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 10 }}>
              11 · CAREERS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[...certCopy.primaryCareers, ...certCopy.secondaryCareers].map((c, i) => (
                <span
                  key={c + i}
                  className="pill"
                  style={{
                    color: i < certCopy.primaryCareers.length ? primary.color : secondary.color,
                    borderColor:
                      i < certCopy.primaryCareers.length
                        ? `${primary.color}55`
                        : `${secondary.color}55`,
                  }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* ── S12: Majors ── */}
          <div style={{ ...SECTION_STYLE, borderBottom: 'none', marginBottom: 20 }}>
            <div className="mono" style={{ color: 'var(--cyan)', marginBottom: 10 }}>
              12 · MAJORS
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[...certCopy.primaryMajors, ...certCopy.secondaryMajors].map((m, i) => (
                <span key={m + i} className="pill" style={{ fontSize: 12 }}>
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* Footer actions */}
          <div
            style={{
              borderTop: '1px dashed var(--line)',
              paddingTop: 22,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 10,
            }}
          >
            <div className="mono" style={{ color: 'var(--ink-dim)', fontSize: 11 }}>
              VIỆN NGHIÊN CỨU CAPI · CAPI-GENE v2.0
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {onHistory && (
                <button className="btn btn-ghost" onClick={onHistory}>
                  Xem lịch sử
                </button>
              )}
              <button className="btn btn-ghost" onClick={() => window.print()}>
                In / Lưu PDF
              </button>
              <button className="btn btn-primary" onClick={onRestart}>
                LÀM LẠI TỪ ĐẦU
              </button>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}
