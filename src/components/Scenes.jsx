import React, { useState, useEffect, useMemo } from 'react'
import Capi from './Capi.jsx'
import { Particles, Typed, Radar, RoleIcon, SceneArt } from './UI.jsx'
import { capiAudio } from '../audio.js'
import {
  CAPI_ROLES,
  CAPI_SCANNING,
  CAPI_THEMES,
  CAPI_MISSIONS,
  CAPI_REFLECTION,
  bumpRole,
  topRole,
} from '../data.js'

const SceneShell = ({ children, className = "", bg = "default" }) => {
  const bgClass = {
    default: "",
    river: "scene-river",
    hospital: "scene-hospital",
    rescue: "scene-rescue",
    home: "scene-home",
    warehouse: "scene-warehouse",
    drone: "scene-drone",
    lab: "scene-lab",
  }[bg] || ""
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }} className={`${bgClass}`}>
      <div className="cosmic-bg" />
      <Particles count={20} />
      <div className="scanline" />
      <div className="hud-frame"><span className="hud-tr" /><span className="hud-bl" /></div>
      <div className={`fade-in ${className}`} style={{ position: "relative", zIndex: 5, height: "100%", width: "100%" }}>
        {children}
      </div>
    </div>
  )
}

/* ---------- INTRO ---------- */
export const IntroScene = ({ onStart }) => {
  useEffect(() => {
    capiAudio.pad([110, 164.8, 220, 329.6], "cold")
  }, [])
  return (
    <SceneShell>
      <div style={{ display: "grid", placeItems: "center", height: "100%", padding: 24 }}>
        <div style={{ textAlign: "center", maxWidth: 780 }} className="fade-up">
          <div className="mono" style={{ color: "var(--cyan)", marginBottom: 18 }}>VIỆN NGHIÊN CỨU CAPI  ·  ESTABLISHED 20XX</div>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 6vw, 68px)",
            fontWeight: 700,
            lineHeight: 1.05,
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
            textWrap: "balance",
          }}>
            Hành trình <span style={{ background: "linear-gradient(90deg, #00e5ff, #ff2d7a)", WebkitBackgroundClip: "text", color: "transparent" }}>Điểm chạm</span> Tương lai
          </h1>
          <div style={{ fontFamily: "var(--font-mono)", color: "var(--ink-dim)", letterSpacing: "0.2em", fontSize: 13, marginBottom: 40 }}>
            CAPI CAREER PATH SIMULATOR
          </div>

          <div style={{ display: "flex", justifyContent: "center", margin: "20px 0 32px", position: "relative" }}>
            <div style={{ position: "relative", width: 220, height: 220 }}>
              <div className="pulse-ring" />
              <div className="pulse-ring d1" />
              <div className="pulse-ring d2" />
              <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
                <Capi outfit="lab" pose="idle" size={180} />
              </div>
            </div>
          </div>

          <p style={{ fontSize: 17, lineHeight: 1.6, color: "var(--ink-dim)", maxWidth: 620, margin: "0 auto 32px" }}>
            Capi sẽ quét hệ thống tư duy của bạn, dẫn bạn vào một cổng mô phỏng thực chiến,
            và giải mã <em style={{ color: "var(--cyan)", fontStyle: "normal" }}>Capi-Gene</em> — mật mã nghề nghiệp của bạn.
          </p>

          <button className="btn btn-primary" onClick={() => { capiAudio.sfx("confirm"); onStart() }}>
            BẮT ĐẦU QUÉT
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>

          <div style={{ marginTop: 36, display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
            {["15 câu hỏi", "6 nhiệm vụ mô phỏng", "5 vai trò nghề nghiệp"].map(s => (
              <span key={s} className="pill">{s}</span>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------- SCANNING QUIZ ---------- */
export const ScanningScene = ({ questionCount, onComplete }) => {
  const questions = useMemo(() => CAPI_SCANNING.slice(0, questionCount), [questionCount])
  const [idx, setIdx] = useState(0)
  const [scores, setScores] = useState({})
  const [picked, setPicked] = useState(null)
  const q = questions[idx]

  useEffect(() => {
    capiAudio.pad([130.8, 196, 261.6, 392], "cold")
  }, [])

  const pick = (opt, i) => {
    if (picked !== null) return
    setPicked(i)
    capiAudio.sfx("click")
    setTimeout(() => {
      const ns = bumpRole(scores, opt.role, 1)
      if (idx + 1 >= questions.length) {
        capiAudio.sfx("scan")
        onComplete(ns)
      } else {
        setScores(ns)
        setIdx(idx + 1)
        setPicked(null)
      }
    }, 500)
  }

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr", height: "100%", padding: "32px 28px", alignContent: "space-between", gap: 20, maxWidth: 1000, margin: "0 auto" }}>
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 10 }}>
          <div className="mono">CAPI-SCAN  ·  {String(idx + 1).padStart(2, "0")} / {String(questions.length).padStart(2, "0")}</div>
          <div className="progress" style={{ flex: 1, maxWidth: 320 }}>
            <i style={{ width: `${((idx + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 22, alignItems: "end" }} className="fade-up">
          <div style={{ display: "grid", placeItems: "center" }}>
            <Capi outfit="lab" pose="talk" size={140} />
          </div>
          <div className="dialogue">
            <div className="mono" style={{ color: "var(--cyan)", marginBottom: 6 }}>CAPI</div>
            <div key={idx} style={{ fontSize: 20, lineHeight: 1.45, fontFamily: "var(--font-display)" }}>
              <Typed text={q.q} speed={18} />
            </div>
          </div>
        </div>

        <div key={idx} style={{ display: "grid", gap: 12 }}>
          {q.a.map((opt, i) => (
            <button
              key={i}
              className={`option-card ${picked === i ? "picked" : ""}`}
              style={{ animationDelay: `${0.05 + i * 0.07}s` }}
              onClick={() => pick(opt, i)}
            >
              <span className="key">{String.fromCharCode(65 + i)}</span>
              <span>{opt.text}</span>
            </button>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------- ROLE REVEAL (after scanning) ---------- */
export const RoleRevealScene = ({ role, onContinue }) => {
  const r = CAPI_ROLES[role]
  useEffect(() => { capiAudio.sfx("success") }, [])
  return (
    <SceneShell bg="lab">
      <div style={{ display: "grid", placeItems: "center", height: "100%", padding: 24 }}>
        <div className="glass fade-up" style={{ padding: 36, maxWidth: 640, textAlign: "center" }}>
          <div className="mono" style={{ color: r.color }}>SƠ BỘ  ·  PHASE 1 COMPLETE</div>
          <div style={{ margin: "18px 0", display: "grid", placeItems: "center" }}>
            <RoleIcon role={role} size={88} />
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 44, margin: "0 0 4px", color: r.color, textShadow: `0 0 30px ${r.color}66` }}>{r.name}</h2>
          <div className="mono" style={{ marginBottom: 18 }}>{r.tagline}</div>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-dim)", maxWidth: 480, margin: "0 auto 26px" }}>
            {r.blurb}
          </p>
          <div className="dialogue" style={{ textAlign: "left", margin: "0 auto 22px", maxWidth: 520 }}>
            <div className="mono" style={{ color: "var(--cyan)", marginBottom: 6 }}>CAPI</div>
            <div>Ồ, một <b style={{ color: r.color }}>{r.name}</b> đầy triển vọng! Nhưng lý thuyết là chưa đủ. Hãy chọn một cổng mô phỏng để mình xem bạn tỏa sáng thế nào trong thực tế nhé!</div>
          </div>
          <button className="btn btn-primary" onClick={onContinue}>CHỌN CỔNG MÔ PHỎNG</button>
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------- THEME PICKER ---------- */
export const ThemeScene = ({ onPick }) => {
  return (
    <SceneShell>
      <div style={{ height: "100%", padding: "32px 28px", display: "grid", alignContent: "start", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
        <div className="fade-up" style={{ textAlign: "center" }}>
          <div className="mono" style={{ color: "var(--cyan)" }}>PHASE 2  ·  THE SIMULATION</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 44px)", margin: "8px 0 4px" }}>Chọn một cổng mô phỏng</h2>
          <p style={{ color: "var(--ink-dim)", margin: 0 }}>Hãy chọn 1 trong 2 cổng để "thực chiến" ngay.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 20, marginTop: 20 }}>
          {Object.values(CAPI_THEMES).map((t, i) => (
            <button
              key={t.id}
              className="glass fade-up"
              style={{
                animationDelay: `${0.1 + i * 0.1}s`,
                padding: 28,
                textAlign: "left",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
                borderColor: t.accent + "44",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.transform = "translateY(-4px)" }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = t.accent + "44"; e.currentTarget.style.transform = "none" }}
              onClick={() => { capiAudio.sfx("whoosh"); onPick(t.id) }}
            >
              <div style={{ position: "absolute", inset: 0, opacity: 0.25, pointerEvents: "none" }}>
                <SceneArt variant={t.id === "ark" ? "river" : "home"} />
              </div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <div className="mono" style={{ color: t.accent, marginBottom: 8 }}>CỔNG {i + 1}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "0 0 4px", color: t.accent, textShadow: `0 0 20px ${t.accent}44` }}>{t.name}</h3>
                <div style={{ color: "var(--ink-dim)", fontSize: 14, marginBottom: 14 }}>{t.subtitle}</div>
                <p style={{ fontSize: 15, lineHeight: 1.55, color: "var(--ink)", opacity: 0.88 }}>{t.blurb}</p>
                <div style={{ marginTop: 20, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {t.mood.split(" • ").map(m => <span key={m} className="pill" style={{ borderColor: t.accent + "55", color: t.accent }}>{m}</span>)}
                </div>
                <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span className="mono">{t.missionIds.length} NHIỆM VỤ</span>
                  <span style={{ color: t.accent, fontFamily: "var(--font-display)", fontWeight: 600 }}>BƯỚC VÀO →</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------- MISSION PICKER ---------- */
export const MissionPickScene = ({ themeId, onPick, onBack }) => {
  const theme = CAPI_THEMES[themeId]
  const missions = theme.missionIds.map(id => CAPI_MISSIONS[id])
  const bgMap = { m1: "river", m2: "hospital", m6: "rescue", m3: "home", m4: "warehouse", m5: "drone" }

  return (
    <SceneShell>
      <div style={{ height: "100%", padding: "28px 28px", display: "grid", gridTemplateRows: "auto 1fr", gap: 20, maxWidth: 1240, margin: "0 auto" }}>
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <button className="btn btn-ghost" onClick={onBack} style={{ padding: "8px 14px", fontSize: 13 }}>← Đổi cổng</button>
          <div>
            <div className="mono" style={{ color: theme.accent }}>{theme.name.toUpperCase()}</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "2px 0 0" }}>Chọn nhiệm vụ mô phỏng</h2>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, alignContent: "start" }}>
          {missions.map((m, i) => (
            <button
              key={m.id}
              className="glass fade-up"
              style={{
                animationDelay: `${0.05 + i * 0.08}s`,
                padding: 0,
                textAlign: "left",
                cursor: "pointer",
                overflow: "hidden",
                display: "grid",
                gridTemplateRows: "140px auto",
                transition: "all 0.25s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.borderColor = theme.accent }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.borderColor = "var(--line)" }}
              onClick={() => { capiAudio.sfx("whoosh"); onPick(m.id) }}
            >
              <div style={{ position: "relative", overflow: "hidden", background: "#05081c" }}>
                <SceneArt variant={bgMap[m.id]} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,6,23,0) 0%, rgba(5,6,23,0.8) 100%)" }} />
                <div style={{ position: "absolute", top: 12, left: 14, display: "flex", gap: 6 }}>
                  <span className="pill" style={{ color: theme.accent, borderColor: theme.accent + "66" }}>MISSION {i + 1}</span>
                </div>
              </div>
              <div style={{ padding: 18 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, margin: "0 0 4px" }}>{m.title}</h3>
                <div className="mono" style={{ marginBottom: 10 }}>{m.subtitle}</div>
                <p style={{ fontSize: 13, lineHeight: 1.5, color: "var(--ink-dim)", margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {m.intro.narration}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------- MISSION PLAY ---------- */
export const MissionPlayScene = ({ missionId, questionCount, onComplete }) => {
  const m = CAPI_MISSIONS[missionId]
  const bgMap = { m1: "river", m2: "hospital", m6: "rescue", m3: "home", m4: "warehouse", m5: "drone" }
  const allQs = m.questions
  const qs = useMemo(() => allQs.slice(0, Math.min(questionCount, allQs.length)), [missionId, questionCount])
  const [stage, setStage] = useState("intro")
  const [idx, setIdx] = useState(0)
  const [scores, setScores] = useState({})
  const [picked, setPicked] = useState(null)

  useEffect(() => {
    const pads = {
      m1: [98, 146.8, 196, 293.7],
      m2: [110, 164.8, 220, 329.6],
      m6: [73.4, 110, 146.8, 196],
      m3: [130.8, 196, 261.6, 392],
      m4: [98, 146.8, 196, 293.7],
      m5: [110, 174.6, 220, 329.6],
    }
    capiAudio.pad(pads[missionId] || [110, 164.8, 220])
  }, [missionId])

  const q = qs[idx]
  const outfit = m.outfit

  const pick = (opt, i) => {
    if (picked !== null) return
    setPicked(i)
    capiAudio.sfx("click")
    setTimeout(() => {
      const ns = bumpRole(scores, opt.role, 1)
      setScores(ns)
      if (idx + 1 >= qs.length) {
        setStage("ending")
      } else {
        setIdx(idx + 1)
        setPicked(null)
      }
    }, 480)
  }

  if (stage === "intro") {
    return (
      <SceneShell bg={bgMap[missionId]}>
        <SceneArt variant={bgMap[missionId]} />
        <div style={{ display: "grid", placeItems: "center", height: "100%", padding: 24 }}>
          <div className="glass fade-up" style={{ maxWidth: 640, padding: 30, textAlign: "center" }}>
            <div className="mono" style={{ color: "var(--cyan)" }}>MISSION · {m.subtitle}</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 38, margin: "8px 0 4px" }}>{m.title}</h2>
            <div className="mono" style={{ color: "var(--ink-dim)", marginBottom: 18 }}>{m.intro.scene}</div>
            <div style={{ display: "grid", placeItems: "center", margin: "10px 0 18px" }}>
              <Capi outfit={outfit} pose="talk" size={150} />
            </div>
            <div className="dialogue" style={{ textAlign: "left", marginBottom: 22 }}>
              <div className="mono" style={{ color: "var(--cyan)", marginBottom: 6 }}>CAPI</div>
              <div style={{ fontSize: 16, lineHeight: 1.55 }}>{m.intro.narration}</div>
            </div>
            <button className="btn btn-primary" onClick={() => { capiAudio.sfx("whoosh"); setStage("q") }}>BẮT ĐẦU NHIỆM VỤ</button>
          </div>
        </div>
      </SceneShell>
    )
  }

  if (stage === "ending") {
    return (
      <SceneShell bg={bgMap[missionId]}>
        <SceneArt variant={bgMap[missionId]} />
        <div style={{ display: "grid", placeItems: "center", height: "100%", padding: 24 }}>
          <div className="glass fade-up" style={{ maxWidth: 640, padding: 34, textAlign: "center" }}>
            <div className="mono" style={{ color: "var(--green)" }}>MISSION COMPLETE</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 36, margin: "8px 0 4px" }}>Nhiệm vụ hoàn thành</h2>
            <p style={{ color: "var(--ink-dim)", fontSize: 15, marginBottom: 22 }}>{m.ending}</p>
            <div style={{ display: "grid", placeItems: "center", margin: "10px 0 22px" }}>
              <Capi outfit={outfit} pose="cheer" size={130} />
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 22 }}>
              {Object.entries(scores).sort((a, b) => b[1] - a[1]).map(([r, v]) => (
                <span key={r} className="pill" style={{ color: CAPI_ROLES[r].color, borderColor: CAPI_ROLES[r].color + "66" }}>
                  {r} · {v}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="btn btn-ghost" onClick={() => onComplete(scores, "another")}>Thử nhiệm vụ khác</button>
              <button className="btn btn-primary" onClick={() => { capiAudio.sfx("success"); onComplete(scores, "reflect") }}>Về viện xem kết quả</button>
            </div>
          </div>
        </div>
      </SceneShell>
    )
  }

  return (
    <SceneShell bg={bgMap[missionId]}>
      <SceneArt variant={bgMap[missionId]} />
      <div style={{ display: "grid", gridTemplateRows: "auto 1fr auto", height: "100%", padding: "28px 24px", gap: 18, maxWidth: 1100, margin: "0 auto" }}>
        <div className="fade-up" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span className="pill" style={{ color: "var(--cyan)", borderColor: "var(--cyan)" }}>{q.chapter}</span>
          <div className="mono" style={{ marginLeft: "auto" }}>{String(idx + 1).padStart(2, "0")} / {String(qs.length).padStart(2, "0")}</div>
          <div className="progress" style={{ flex: "0 0 180px" }}>
            <i style={{ width: `${((idx + 1) / qs.length) * 100}%` }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20, alignItems: "end", alignSelf: "end" }} className="fade-up">
          <div style={{ display: "grid", placeItems: "center" }}>
            <Capi outfit={outfit} pose="talk" size={130} />
          </div>
          <div>
            {q.scene && (
              <div className="mono" style={{ marginBottom: 10, color: "var(--ink-dim)" }}>
                SCENE · {q.scene}
              </div>
            )}
            <div className="dialogue">
              <div className="mono" style={{ color: "var(--cyan)", marginBottom: 6 }}>CAPI</div>
              <div key={idx} style={{ fontSize: 18, lineHeight: 1.5, fontFamily: "var(--font-display)" }}>
                <Typed text={q.prompt} speed={18} />
              </div>
            </div>
          </div>
        </div>

        <div key={idx} style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {q.a.map((opt, i) => (
            <button
              key={i}
              className={`option-card fade-up ${picked === i ? "picked" : ""}`}
              style={{ animationDelay: `${0.05 + i * 0.07}s` }}
              onClick={() => pick(opt, i)}
            >
              <span className="key">{String.fromCharCode(65 + i)}</span>
              <span>{opt.t}</span>
            </button>
          ))}
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------- REFLECTION (Phase 3) ---------- */
export const ReflectionScene = ({ role, onComplete }) => {
  const q = CAPI_REFLECTION[role]
  const [picked, setPicked] = useState(null)
  useEffect(() => { capiAudio.pad([130.8, 196, 261.6, 392]) }, [])

  const opts = [
    { t: "Có, rất phù hợp với mình", w: 1.0 },
    { t: "Khá phù hợp", w: 0.5 },
    { t: "Không hẳn — mình thích kiểu khác", w: -1.0 },
  ]

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      <div style={{ display: "grid", placeItems: "center", height: "100%", padding: 24 }}>
        <div className="glass fade-up" style={{ maxWidth: 640, padding: 30 }}>
          <div className="mono" style={{ color: "var(--cyan)" }}>PHASE 3 · REFLECTION</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, margin: "8px 0 18px" }}>Phản chiếu năng lực</h2>

          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 18, alignItems: "end", marginBottom: 18 }}>
            <Capi outfit="lab" pose="talk" size={110} />
            <div className="dialogue">
              <div className="mono" style={{ color: "var(--cyan)", marginBottom: 6 }}>CAPI</div>
              <div style={{ fontSize: 15, marginBottom: 8 }}>
                "Chúc mừng bạn đã hoàn thành thử thách! Trước khi nhận kết quả, mình cùng trò chuyện một chút..."
              </div>
              <div style={{ fontSize: 17, fontFamily: "var(--font-display)", lineHeight: 1.4 }}>
                <Typed text={q} speed={18} />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {opts.map((opt, i) => (
              <button
                key={i}
                className={`option-card fade-up ${picked === i ? "picked" : ""}`}
                style={{ animationDelay: `${0.05 + i * 0.07}s` }}
                onClick={() => {
                  if (picked !== null) return
                  setPicked(i)
                  capiAudio.sfx("click")
                  setTimeout(() => { capiAudio.sfx("confirm"); onComplete(opt.w) }, 500)
                }}
              >
                <span className="key">{String.fromCharCode(65 + i)}</span>
                <span>{opt.t}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------- CERTIFICATE ---------- */
export const CertificateScene = ({ scanScores, missionScores, reflectionWeight, missionId, onRestart, onSubmit }) => {
  const [flashed, setFlashed] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setFlashed(false), 900)
    capiAudio.sfx("success")
    return () => clearTimeout(t)
  }, [])

  const combined = { ...scanScores }
  for (const k of Object.keys(missionScores)) combined[k] = (combined[k] || 0) + (missionScores[k] || 0)

  const phase1Role = topRole(scanScores)
  const finalRole = topRole(combined)
  const r = CAPI_ROLES[finalRole]
  const match = phase1Role === finalRole

  // Submit results once on mount
  useEffect(() => {
    if (onSubmit) onSubmit({ finalRole, phase1Role, scanScores, missionScores, reflectionWeight, missionId })
  }, [])

  return (
    <SceneShell bg="lab">
      <SceneArt variant="lab" />
      {flashed && <div className="flash" />}
      <div style={{ display: "grid", placeItems: "center", height: "100%", padding: "28px 16px", overflow: "auto" }}>
        <div className="cert-bg fade-up" style={{ maxWidth: 860, width: "100%", padding: "36px 36px 28px", position: "relative" }}>
          <svg viewBox="0 0 200 40" width="120" height="24" style={{ position: "absolute", top: 18, left: 18, opacity: 0.6 }}>
            <text x="0" y="28" fontFamily="var(--font-mono)" fontSize="16" fill="var(--cyan)" letterSpacing="4">CAPI-GENE</text>
          </svg>
          <div className="mono" style={{ position: "absolute", top: 24, right: 28, color: "var(--ink-dim)" }}>CERT #{Math.floor(Math.random() * 9000 + 1000)} · {new Date().toISOString().slice(0, 10)}</div>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <div className="mono" style={{ color: r.color }}>{match ? "BẠN LÀ MỘT" : "KHÁM PHÁ MỚI!"}</div>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(42px, 6vw, 72px)", margin: "8px 0 4px", color: r.color, textShadow: `0 0 40px ${r.color}66`, letterSpacing: "-0.02em" }}>
              {r.name.toUpperCase()}
            </h1>
            <div style={{ color: "var(--ink-dim)", fontFamily: "var(--font-display)", fontSize: 18 }}>
              {r.tagline}
            </div>
            {!match && (
              <div className="mono" style={{ marginTop: 14, color: "var(--ink-dim)" }}>
                Khởi đầu: <span style={{ color: CAPI_ROLES[phase1Role].color }}>{phase1Role}</span>
                <span style={{ margin: "0 10px" }}>→</span>
                Tỏa sáng: <span style={{ color: r.color }}>{finalRole}</span>
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginTop: 28, alignItems: "center" }}>
            <div style={{ display: "grid", placeItems: "center" }}>
              <Radar scores={combined} size={300} color={r.color} />
            </div>
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: "var(--ink)", marginTop: 0 }}>{r.blurb}</p>
              <div className="mono" style={{ color: r.color, marginTop: 18 }}>NGHỀ NGHIỆP GỢI Ý</div>
              <ul style={{ paddingLeft: 0, listStyle: "none", margin: "10px 0 0" }}>
                {r.careers.map(c => (
                  <li key={c} style={{ padding: "8px 12px", borderLeft: `2px solid ${r.color}`, background: `${r.color}0e`, marginBottom: 6, borderRadius: "0 8px 8px 0", fontSize: 14 }}>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, borderTop: "1px dashed var(--line)", paddingTop: 22 }}>
            <div className="mono" style={{ color: "var(--ink-dim)" }}>VIỆN NGHIÊN CỨU CAPI · CAPI-GENE v1.0</div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" onClick={() => window.print()}>In / Lưu PDF</button>
              <button className="btn btn-primary" onClick={onRestart}>LÀM LẠI TỪ ĐẦU</button>
            </div>
          </div>
        </div>
      </div>
    </SceneShell>
  )
}

export const Transition = ({ k, children }) => (
  <div key={k} className="fade-in" style={{ position: "absolute", inset: 0 }}>
    {children}
  </div>
)
