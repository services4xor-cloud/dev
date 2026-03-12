import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { MARKET_SIGNALS } from '@/lib/market-data'

// ─── Test Helpers ─────────────────────────────────────────────────────────────

function makeProfile(overrides: Partial<DimensionProfile> = {}): DimensionProfile {
  return {
    country: 'KE',
    languages: ['English', 'Swahili'],
    craft: ['software'],
    interests: ['tech'],
    reach: ['can-travel'],
    isHuman: true,
    ...overrides,
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('scoreDimensions', () => {
  it('returns score 0-110', () => {
    const me = makeProfile()
    const them = makeProfile({
      country: 'DE',
      languages: ['German'],
      craft: ['marketing'],
      interests: ['fashion'],
    })
    const result = scoreDimensions(me, them, MARKET_SIGNALS)
    expect(result.total).toBeGreaterThanOrEqual(0)
    expect(result.total).toBeLessThanOrEqual(110)
  })

  it('has all 8 breakdown fields', () => {
    const me = makeProfile()
    const them = makeProfile()
    const result = scoreDimensions(me, them, MARKET_SIGNALS)
    expect(result.breakdown).toHaveProperty('language')
    expect(result.breakdown).toHaveProperty('market')
    expect(result.breakdown).toHaveProperty('craft')
    expect(result.breakdown).toHaveProperty('passion')
    expect(result.breakdown).toHaveProperty('location')
    expect(result.breakdown).toHaveProperty('faith')
    expect(result.breakdown).toHaveProperty('reach')
    expect(result.breakdown).toHaveProperty('culture')
  })

  it('language overlap scores higher than no overlap', () => {
    const me = makeProfile({ languages: ['English', 'Swahili'] })
    const withOverlap = makeProfile({ languages: ['English', 'French'] })
    const noOverlap = makeProfile({ languages: ['German', 'French'] })

    const scoreWith = scoreDimensions(me, withOverlap, MARKET_SIGNALS)
    const scoreWithout = scoreDimensions(me, noOverlap, MARKET_SIGNALS)

    expect(scoreWith.breakdown.language).toBeGreaterThan(scoreWithout.breakdown.language)
  })

  it('complementary craft scores higher than mirror', () => {
    const me = makeProfile({ craft: ['software', 'design'] })
    const mirror = makeProfile({ craft: ['software', 'design'] }) // same crafts
    const complementary = makeProfile({ craft: ['marketing', 'finance', 'sales'] }) // different crafts

    const mirrorScore = scoreDimensions(me, mirror, MARKET_SIGNALS)
    const compScore = scoreDimensions(me, complementary, MARKET_SIGNALS)

    expect(compScore.breakdown.craft).toBeGreaterThan(mirrorScore.breakdown.craft)
  })

  it('human-to-human gets +10 bonus', () => {
    const human = makeProfile({ isHuman: true })
    const bot = makeProfile({ isHuman: false })

    const h2h = scoreDimensions(human, makeProfile({ isHuman: true }), MARKET_SIGNALS)
    const h2b = scoreDimensions(human, bot, MARKET_SIGNALS)

    expect(h2h.humanBonus).toBe(10)
    expect(h2b.humanBonus).toBe(0)
    expect(h2h.total).toBe(h2b.total + 10)
  })

  it('reach compatibility: can-travel + can-host scores high', () => {
    const traveler = makeProfile({ reach: ['can-travel'] })
    const host = makeProfile({ reach: ['can-host'] })
    const noReach = makeProfile({ reach: [] })

    const compatible = scoreDimensions(traveler, host, MARKET_SIGNALS)
    const incompatible = scoreDimensions(traveler, noReach, MARKET_SIGNALS)

    expect(compatible.breakdown.reach).toBeGreaterThan(incompatible.breakdown.reach)
    expect(compatible.breakdown.reach).toBeGreaterThanOrEqual(4)
  })

  it('assigns recommendation label', () => {
    const me = makeProfile({
      languages: ['English', 'Swahili'],
      craft: ['software'],
      interests: ['tech', 'culture', 'education'],
      reach: ['can-travel'],
      faith: 'christian',
      culture: 'Kikuyu',
    })
    const perfectMatch = makeProfile({
      country: 'KE',
      languages: ['English', 'Swahili'],
      craft: ['marketing', 'design', 'sales'],
      interests: ['tech', 'culture', 'education'],
      reach: ['can-host'],
      faith: 'christian',
      culture: 'Kikuyu',
    })

    const result = scoreDimensions(me, perfectMatch, MARKET_SIGNALS)
    expect(['Perfect', 'Strong', 'Good', 'Possible']).toContain(result.label)
  })

  it('returns highlights array', () => {
    const me = makeProfile({ languages: ['English'] })
    const them = makeProfile({ languages: ['English'] })

    const result = scoreDimensions(me, them, MARKET_SIGNALS)
    expect(Array.isArray(result.highlights)).toBe(true)
    expect(result.highlights.length).toBeGreaterThan(0)
  })
})
