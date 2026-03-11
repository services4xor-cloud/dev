/**
 * Unit tests for lib/hooks/use-journey.ts — Journey gamification engine
 *
 * Tests the pure data exports (JOURNEY_STAGES) since the hook itself
 * requires React context. Hook behavior tested via Playwright.
 */

import { JOURNEY_STAGES } from '@/lib/hooks/use-journey'
import type { JourneyStage } from '@/lib/hooks/use-journey'

describe('JOURNEY_STAGES', () => {
  it('has exactly 7 stages', () => {
    expect(JOURNEY_STAGES).toHaveLength(7)
  })

  it('stages are in the correct order', () => {
    const stageIds = JOURNEY_STAGES.map((s) => s.id)
    expect(stageIds).toEqual([
      'arrival',
      'discovery',
      'preparation',
      'first_step',
      'connection',
      'momentum',
      'pioneer',
    ])
  })

  it('XP thresholds increase monotonically', () => {
    for (let i = 1; i < JOURNEY_STAGES.length; i++) {
      expect(JOURNEY_STAGES[i].xpRequired).toBeGreaterThan(JOURNEY_STAGES[i - 1].xpRequired)
    }
  })

  it('all stage IDs are unique', () => {
    const ids = JOURNEY_STAGES.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all stage IDs match the JourneyStage type values', () => {
    const validStages: JourneyStage[] = [
      'arrival',
      'discovery',
      'preparation',
      'first_step',
      'connection',
      'momentum',
      'pioneer',
    ]
    JOURNEY_STAGES.forEach((stage) => {
      expect(validStages).toContain(stage.id)
    })
  })

  it('first stage (arrival) requires 0 XP', () => {
    expect(JOURNEY_STAGES[0].id).toBe('arrival')
    expect(JOURNEY_STAGES[0].xpRequired).toBe(0)
  })

  it('last stage (pioneer) requires 1200 XP', () => {
    const lastStage = JOURNEY_STAGES[JOURNEY_STAGES.length - 1]
    expect(lastStage.id).toBe('pioneer')
    expect(lastStage.xpRequired).toBe(1200)
  })

  it('every stage has label, icon, and description', () => {
    JOURNEY_STAGES.forEach((stage) => {
      expect(stage.label).toBeTruthy()
      expect(stage.icon).toBeTruthy()
      expect(stage.description).toBeTruthy()
    })
  })

  it('every stage has a non-negative XP requirement', () => {
    JOURNEY_STAGES.forEach((stage) => {
      expect(stage.xpRequired).toBeGreaterThanOrEqual(0)
    })
  })

  it('stage labels are unique', () => {
    const labels = JOURNEY_STAGES.map((s) => s.label)
    expect(new Set(labels).size).toBe(labels.length)
  })
})
