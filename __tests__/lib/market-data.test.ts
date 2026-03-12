import {
  MARKET_SIGNALS,
  MarketSignal,
  getSignalsForRegion,
  getSignalsForCraft,
  getMarketScore,
} from '@/lib/market-data'

describe('market-data', () => {
  describe('MARKET_SIGNALS dataset', () => {
    it('has at least 30 signals', () => {
      expect(MARKET_SIGNALS.length).toBeGreaterThanOrEqual(30)
    })

    it('every signal has all required fields', () => {
      const validSignalTypes = ['growing', 'stable', 'emerging', 'urgent']

      for (const signal of MARKET_SIGNALS) {
        expect(signal.id).toBeTruthy()
        expect(signal.sector).toBeTruthy()
        expect(signal.region).toBeTruthy()
        expect(validSignalTypes).toContain(signal.signal)
        expect(signal.title).toBeTruthy()
        expect(signal.description).toBeTruthy()
        expect(signal.demandCrafts.length).toBeGreaterThan(0)
        expect(signal.opportunityScore).toBeGreaterThanOrEqual(0)
        expect(signal.opportunityScore).toBeLessThanOrEqual(100)
      }
    })

    it('all IDs are unique', () => {
      const ids = MARKET_SIGNALS.map((s) => s.id)
      expect(new Set(ids).size).toBe(ids.length)
    })
  })

  describe('getSignalsForRegion', () => {
    it('returns signals for KE (East Africa)', () => {
      const signals = getSignalsForRegion('KE')
      expect(signals.length).toBeGreaterThan(0)
    })

    it('returns signals for NG (West Africa)', () => {
      const signals = getSignalsForRegion('NG')
      expect(signals.length).toBeGreaterThan(0)
    })

    it('returns signals for DE (direct country code match)', () => {
      const signals = getSignalsForRegion('DE')
      expect(signals.length).toBeGreaterThan(0)
      expect(signals.some((s) => s.id === 'eu-de-ke-tech')).toBe(true)
    })

    it('is case-insensitive', () => {
      const upper = getSignalsForRegion('KE')
      const lower = getSignalsForRegion('ke')
      expect(upper.length).toBe(lower.length)
    })
  })

  describe('getSignalsForCraft', () => {
    it('returns signals for Software Engineering', () => {
      const signals = getSignalsForCraft(['Software Engineering'])
      expect(signals.length).toBeGreaterThan(0)
    })

    it('returns signals for partial craft match', () => {
      const signals = getSignalsForCraft(['nursing'])
      expect(signals.length).toBeGreaterThan(0)
    })

    it('returns empty for non-existent craft', () => {
      const signals = getSignalsForCraft(['Underwater Basket Weaving'])
      expect(signals.length).toBe(0)
    })
  })

  describe('getMarketScore', () => {
    it('returns a value between 0 and 20', () => {
      const score = getMarketScore(
        { country: 'KE', craft: ['Software Engineering'], interests: ['tech'] },
        MARKET_SIGNALS
      )
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(20)
    })

    it('Safari Guide in Kenya scores higher than Pottery in Japan', () => {
      const safariKenya = getMarketScore(
        { country: 'KE', craft: ['Safari Guide'], interests: ['safari', 'tourism'] },
        MARKET_SIGNALS
      )
      const potteryJapan = getMarketScore(
        { country: 'JP', craft: ['Pottery'], interests: ['ceramics'] },
        MARKET_SIGNALS
      )
      expect(safariKenya).toBeGreaterThan(potteryJapan)
    })

    it('returns 0 when no signals match the region', () => {
      const score = getMarketScore(
        { country: 'XX', craft: ['anything'], interests: [] },
        MARKET_SIGNALS
      )
      expect(score).toBe(0)
    })

    it('returns 0 for empty signals array', () => {
      const score = getMarketScore(
        { country: 'KE', craft: ['Software Engineering'], interests: ['tech'] },
        []
      )
      expect(score).toBe(0)
    })
  })
})
