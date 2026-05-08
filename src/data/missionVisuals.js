/**
 * Per-mission visual config: palette (for QIllo accent) and chapter→illo
 * mapping. The Claude Design prototype defined 5 illustrations per mission;
 * each illo represents a phase of the narrative arc:
 *   1. recon (scout the problem)
 *   2. build (construct the solution)
 *   3. challenge / mid-mission stress
 *   4. deploy / scale
 *   5. final / overload / countdown
 *
 * Spec-v2 missions (in src/data/missions.json) have 4–5 chapters each. We
 * map illos to chapter ordinal (1st chapter → 1st illo, etc.). Missions with
 * 4 chapters use illos 1–4 only; the 5th illo of those missions stays
 * available for future content.
 */

export const MISSION_VISUALS = {
  // Mission 1 — "Dòng sông Xanh" (Green River / Smart Waste)
  1: {
    palette: ['#0a3a2a', '#3ddc84', '#00e5ff'],
    illos: ['river-recon', 'river-build', 'river-storm', 'river-scale', 'river-fail'],
  },
  // Mission 2 — "Trạm y tế hạnh phúc" (Happy Health Station)
  2: {
    palette: ['#0a1040', '#ff80c8', '#00e5ff'],
    illos: [
      'hospital-recon',
      'hospital-build',
      'hospital-ux',
      'hospital-deploy',
      'hospital-overload',
    ],
  },
  // Mission 3 — Smart Apartment
  3: {
    palette: ['#1a0a3a', '#b46cff', '#00e5ff'],
    illos: ['home-recon', 'home-meeting', 'home-elder', 'home-demo', 'home-overload'],
  },
  // Mission 4 — Self-Operating Warehouse
  4: {
    palette: ['#1a1a3a', '#00e5ff', '#ffb020'],
    illos: [
      'warehouse-recon',
      'warehouse-build',
      'warehouse-debate',
      'warehouse-collide',
      'warehouse-people',
    ],
  },
  // Mission 5 — Drone Delivery Network
  5: {
    palette: ['#0a2a3a', '#00e5ff', '#3ddc84'],
    illos: ['drone-recon', 'drone-build', 'drone-wind', 'drone-privacy', 'drone-storm'],
  },
  // Mission 6 — Rescue Robot
  6: {
    palette: ['#3a0a0a', '#ff6040', '#ffb020'],
    illos: ['rescue-recon', 'rescue-meeting', 'rescue-smoke', 'rescue-fail', 'rescue-countdown'],
  },
}

/**
 * Build a chapter-name → illo-key map for a given mission, by walking the
 * mission's questions in order and assigning each unique chapter to the next
 * illo in sequence.
 *
 * Stable across re-renders: callers should memoize per missionId.
 */
export function buildChapterIlloMap(mission) {
  const visuals = MISSION_VISUALS[mission.id]
  if (!visuals) return {}

  const chapterOrder = []
  for (const q of mission.questions) {
    const ch = q.chapter_vn
    if (ch && !chapterOrder.includes(ch)) chapterOrder.push(ch)
  }

  const map = {}
  for (let i = 0; i < chapterOrder.length && i < visuals.illos.length; i++) {
    map[chapterOrder[i]] = visuals.illos[i]
  }
  return map
}

/** Returns the accent color for a mission's QIllo (the second palette stop). */
export function getMissionAccent(missionId) {
  const v = MISSION_VISUALS[missionId]
  return v ? v.palette[1] : '#00e5ff'
}
