import { CAPI_MISSIONS } from '../../data.js'

export function getMissionTitle(run, t) {
  if (!run) return ''
  if (run.mission_id) {
    const mission = CAPI_MISSIONS[run.mission_id]
    if (mission) return t(`missions.${mission.id}.name`, mission.title)
    return t(`missions.${run.mission_id}.name`, `Mission #${run.mission_id}`)
  }
  if (run.theme) {
    return t(`themes.${run.theme}.displayName`, run.theme)
  }
  return t('history.default_mission_name', 'Chiến dịch khám phá')
}

export function getMissionPreviewImg(run) {
  if (run.mission_id && run.mission_id >= 1 && run.mission_id <= 6) {
    return `/illos/m${run.mission_id}-preview.webp`
  }
  if (run.theme === 'ark-capi') return '/illos/m1-preview.webp'
  if (run.theme === 'techno') return '/illos/m3-preview.webp'
  return '/illos/m1-preview.webp'
}
