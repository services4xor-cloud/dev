/**
 * Unit tests for lib/xp.ts — XP engine and quest system
 *
 * Tests getXPLevel calculations and quest system functions:
 * getQuestsForLevel, getQuestsByCategory, getNextQuest.
 */

import {
  getXPLevel,
  getQuestsForLevel,
  getQuestsByCategory,
  getNextQuest,
  QUESTS,
  XP_LEVELS,
  XP_ACTIONS,
} from '@/lib/xp'

// ── XP Level Calculations ────────────────────────────────────────────

describe('getXPLevel', () => {
  it('returns level 1 for 0 XP', () => {
    const state = getXPLevel(0)
    expect(state.level).toBe(1)
    expect(state.levelName).toBe('Newcomer')
  })

  it('returns level 2 for 100 XP', () => {
    const state = getXPLevel(100)
    expect(state.level).toBe(2)
    expect(state.levelName).toBe('Explorer')
  })

  it('returns level 7 for max XP', () => {
    const state = getXPLevel(2500)
    expect(state.level).toBe(7)
    expect(state.levelName).toBe('Legend')
  })

  it('calculates progress to next level correctly', () => {
    const state = getXPLevel(50) // halfway between 0 and 100
    expect(state.progressToNext).toBeCloseTo(0.5)
  })

  it('caps progress at 1 for max level', () => {
    const state = getXPLevel(5000)
    expect(state.progressToNext).toBe(1)
  })

  it('tracks totalXP accurately', () => {
    const state = getXPLevel(350)
    expect(state.totalXP).toBe(350)
    expect(state.level).toBe(3)
  })
})

// ── Quest System ─────────────────────────────────────────────────────

describe('getQuestsForLevel', () => {
  it('returns onboarding + level-1 quests for level 1', () => {
    const quests = getQuestsForLevel(1)
    expect(quests.length).toBeGreaterThan(0)
    quests.forEach((q) => expect(q.unlockLevel).toBeLessThanOrEqual(1))
    // Should include onboarding quests
    expect(quests.some((q) => q.category === 'onboarding')).toBe(true)
  })

  it('includes exploration quests at level 1 (those with unlockLevel 1)', () => {
    const quests = getQuestsForLevel(1)
    const explorationAtLevel1 = QUESTS.filter(
      (q) => q.category === 'exploration' && q.unlockLevel <= 1
    )
    explorationAtLevel1.forEach((eq) => {
      expect(quests.some((q) => q.id === eq.id)).toBe(true)
    })
  })

  it('includes growth quests at level 3', () => {
    const quests = getQuestsForLevel(3)
    expect(quests.some((q) => q.category === 'growth')).toBe(true)
  })

  it('returns more quests at higher levels', () => {
    const level1 = getQuestsForLevel(1)
    const level3 = getQuestsForLevel(3)
    expect(level3.length).toBeGreaterThanOrEqual(level1.length)
  })

  it('returns all quests at max level', () => {
    const maxLevel = XP_LEVELS[XP_LEVELS.length - 1].level
    const quests = getQuestsForLevel(maxLevel)
    expect(quests.length).toBe(QUESTS.length)
  })
})

describe('getQuestsByCategory', () => {
  it('returns 4 onboarding quests', () => {
    const onboarding = getQuestsByCategory('onboarding')
    expect(onboarding.length).toBe(4)
    onboarding.forEach((q) => expect(q.category).toBe('onboarding'))
  })

  it('returns exploration quests', () => {
    const exploration = getQuestsByCategory('exploration')
    expect(exploration.length).toBeGreaterThan(0)
    exploration.forEach((q) => expect(q.category).toBe('exploration'))
  })

  it('returns connection quests', () => {
    const connection = getQuestsByCategory('connection')
    expect(connection.length).toBeGreaterThan(0)
    connection.forEach((q) => expect(q.category).toBe('connection'))
  })

  it('returns growth quests', () => {
    const growth = getQuestsByCategory('growth')
    expect(growth.length).toBeGreaterThan(0)
    growth.forEach((q) => expect(q.category).toBe('growth'))
  })

  it('returns quests sorted by order', () => {
    const onboarding = getQuestsByCategory('onboarding')
    for (let i = 1; i < onboarding.length; i++) {
      expect(onboarding[i - 1].order).toBeLessThanOrEqual(onboarding[i].order)
    }
  })
})

describe('getNextQuest', () => {
  it('returns first onboarding quest when no quests completed', () => {
    const next = getNextQuest(1, [])
    expect(next).not.toBeNull()
    expect(next!.id).toBe('complete-identity')
    expect(next!.category).toBe('onboarding')
  })

  it('returns next quest when first is completed', () => {
    const next = getNextQuest(1, ['complete-identity'])
    expect(next).not.toBeNull()
    expect(next!.id).toBe('complete-discovery')
  })

  it('skips to exploration after all onboarding quests done', () => {
    const onboardingIds = getQuestsByCategory('onboarding').map((q) => q.id)
    const next = getNextQuest(2, onboardingIds)
    expect(next).not.toBeNull()
    // Should be an exploration quest (first non-onboarding available)
    expect(['exploration', 'connection', 'growth']).toContain(next!.category)
  })

  it('returns null when all quests are complete', () => {
    const allQuestIds = QUESTS.map((q) => q.id)
    const next = getNextQuest(7, allQuestIds)
    expect(next).toBeNull()
  })

  it('respects level restriction — does not suggest locked quests', () => {
    // Level 1 pioneer should not get level 2+ quests
    const level1Quests = getQuestsForLevel(1)
    const level1Ids = level1Quests.map((q) => q.id)
    // Complete all level-1 quests
    const next = getNextQuest(1, level1Ids)
    // Should be null since all available quests at level 1 are done
    expect(next).toBeNull()
  })

  it('prioritizes categories: onboarding > exploration > connection > growth', () => {
    // At level 3 with nothing completed, should still start with onboarding
    const next = getNextQuest(3, [])
    expect(next).not.toBeNull()
    expect(next!.category).toBe('onboarding')
  })
})
