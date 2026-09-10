import { describe, it, expect } from 'vitest'
import viCommon from './locales/vi/common.json'
import viGame from './locales/vi/game.json'
import viReport from './locales/vi/report.json'
import viRoles from './locales/vi/roles.json'
import viFeedback from './locales/vi/feedback.json'
import viMissions from './locales/vi/missions.json'

import enCommon from './locales/en/common.json'
import enGame from './locales/en/game.json'
import enReport from './locales/en/report.json'
import enRoles from './locales/en/roles.json'
import enFeedback from './locales/en/feedback.json'
import enMissions from './locales/en/missions.json'
import matrix from '../../data/assessment_matrix.json'

const catalogs = {
  vi: {
    common: viCommon,
    game: viGame,
    report: viReport,
    roles: viRoles,
    feedback: viFeedback,
    missions: viMissions,
  },
  en: {
    common: enCommon,
    game: enGame,
    report: enReport,
    roles: enRoles,
    feedback: enFeedback,
    missions: enMissions,
  },
}

function getLeafKeys(obj, prefix = '') {
  let keys = []
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(getLeafKeys(value, fullKey))
    } else {
      keys.push(fullKey)
    }
  }
  return keys
}

function getValueByPath(obj, path) {
  return path.split('.').reduce((acc, part) => (acc ? acc[part] : undefined), obj)
}

describe('Poka-Yoke i18n Translation Parity Gate', () => {
  const namespaces = ['common', 'game', 'report', 'roles', 'feedback', 'missions']

  namespaces.forEach((ns) => {
    describe(`Namespace: ${ns}`, () => {
      const viCatalog = catalogs.vi[ns]
      const enCatalog = catalogs.en[ns]

      it(`should have 100% key parity between Vietnamese (base) and English for ${ns}`, () => {
        const viKeys = getLeafKeys(viCatalog)
        const missingInEn = []
        const emptyInEn = []

        viKeys.forEach((key) => {
          const enVal = getValueByPath(enCatalog, key)
          if (enVal === undefined) {
            missingInEn.push(key)
          } else if (typeof enVal === 'string' && enVal.trim() === '') {
            emptyInEn.push(key)
          } else if (Array.isArray(enVal) && enVal.length === 0) {
            emptyInEn.push(key)
          }
        })

        expect(
          missingInEn,
          `Missing English keys in ${ns}.json:\n${missingInEn.join('\n')}`,
        ).toEqual([])

        expect(
          emptyInEn,
          `Empty English translations in ${ns}.json:\n${emptyInEn.join('\n')}`,
        ).toEqual([])
      })

      it(`should not have orphaned English keys missing in Vietnamese base for ${ns}`, () => {
        const enKeys = getLeafKeys(enCatalog)
        const missingInVi = []

        enKeys.forEach((key) => {
          const viVal = getValueByPath(viCatalog, key)
          if (viVal === undefined) {
            missingInVi.push(key)
          }
        })

        expect(
          missingInVi,
          `Orphaned English keys missing in Vietnamese ${ns}.json:\n${missingInVi.join('\n')}`,
        ).toEqual([])
      })
    })
  })

  describe('Assessment Matrix <-> i18n Catalog Coverage', () => {
    it('should have translations for all Phase 1 questions in game.json', () => {
      const allPhase1Ids = matrix.phase1.questions.map((q) => q.id)

      allPhase1Ids.forEach((id) => {
        expect(
          viGame.questions[id],
          `Missing Vietnamese translation for Phase 1 question ID: ${id}`,
        ).toBeDefined()
        expect(
          enGame.questions[id],
          `Missing English translation for Phase 1 question ID: ${id}`,
        ).toBeDefined()
      })
    })

    it('should have translations for all 6 missions and question dialogues in missions.json', () => {
      matrix.missions.forEach((m) => {
        expect(
          viMissions.missions[m.id],
          `Missing Vietnamese mission definition for mission ID: ${m.id}`,
        ).toBeDefined()
        expect(
          enMissions.missions[m.id],
          `Missing English mission definition for mission ID: ${m.id}`,
        ).toBeDefined()

        m.questions.forEach((q) => {
          expect(
            viMissions.missions[m.id].questions[q.id]?.dialogue,
            `Missing Vietnamese dialogue for M${m.id} Q${q.id}`,
          ).toBeDefined()
          expect(
            enMissions.missions[m.id].questions[q.id]?.dialogue,
            `Missing English dialogue for M${m.id} Q${q.id}`,
          ).toBeDefined()
        })
      })
    })

    it('should have valid metadata for all themes and missions', () => {
      const themes = ['ark-capi', 'techno']
      themes.forEach((t) => {
        expect(viGame.themes[t]?.displayName).toBeDefined()
        expect(viGame.themes[t]?.subtitle).toBeDefined()
        expect(viGame.themes[t]?.blurb).toBeDefined()

        expect(enGame.themes[t]?.displayName).toBeDefined()
        expect(enGame.themes[t]?.subtitle).toBeDefined()
        expect(enGame.themes[t]?.blurb).toBeDefined()
      })

      for (let id = 1; id <= 6; id++) {
        expect(viMissions.missions[id]?.name).toBeDefined()
        expect(viMissions.missions[id]?.english_name).toBeDefined()
        expect(viMissions.missions[id]?.desc).toBeDefined()
        expect(viMissions.missions[id]?.goals?.length).toBeGreaterThan(0)

        expect(enMissions.missions[id]?.name).toBeDefined()
        expect(enMissions.missions[id]?.english_name).toBeDefined()
        expect(enMissions.missions[id]?.desc).toBeDefined()
        expect(enMissions.missions[id]?.goals?.length).toBeGreaterThan(0)
      }
    })
  })
})
