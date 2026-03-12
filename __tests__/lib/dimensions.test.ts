import {
  FAITH_OPTIONS,
  CRAFT_SUGGESTIONS,
  REACH_OPTIONS,
  CULTURE_SUGGESTIONS,
  getCultureSuggestionsForCountry,
} from '@/lib/dimensions'

describe('dimensions — faith, craft, reach, culture registries', () => {
  describe('FAITH_OPTIONS', () => {
    it('has exactly 8 options', () => {
      expect(FAITH_OPTIONS).toHaveLength(8)
    })

    it('each option has id, label, and icon', () => {
      for (const opt of FAITH_OPTIONS) {
        expect(opt.id).toBeTruthy()
        expect(opt.label).toBeTruthy()
        expect(opt.icon).toBeTruthy()
      }
    })

    it('has unique IDs', () => {
      const ids = FAITH_OPTIONS.map((o) => o.id)
      expect(new Set(ids).size).toBe(ids.length)
    })

    it.each(['islam', 'christianity', 'secular', 'hinduism', 'buddhism'])(
      'includes %s',
      (id) => {
        expect(FAITH_OPTIONS.some((o) => o.id === id)).toBe(true)
      }
    )
  })

  describe('CRAFT_SUGGESTIONS', () => {
    it('has at least 40 entries', () => {
      expect(CRAFT_SUGGESTIONS.length).toBeGreaterThanOrEqual(40)
    })

    it('all entries are unique', () => {
      expect(new Set(CRAFT_SUGGESTIONS).size).toBe(CRAFT_SUGGESTIONS.length)
    })

    it('covers tech domain', () => {
      expect(CRAFT_SUGGESTIONS).toContain('Software Engineering')
      expect(CRAFT_SUGGESTIONS).toContain('Data Science')
    })

    it('covers health domain', () => {
      expect(CRAFT_SUGGESTIONS).toContain('Medicine')
      expect(CRAFT_SUGGESTIONS).toContain('Nursing')
    })

    it('covers creative domain', () => {
      expect(CRAFT_SUGGESTIONS).toContain('Photography')
      expect(CRAFT_SUGGESTIONS).toContain('Graphic Design')
    })

    it('covers trades domain', () => {
      expect(CRAFT_SUGGESTIONS).toContain('Construction')
      expect(CRAFT_SUGGESTIONS).toContain('Welding')
    })
  })

  describe('REACH_OPTIONS', () => {
    it('has exactly 6 options', () => {
      expect(REACH_OPTIONS).toHaveLength(6)
    })

    it('each option has id, label, icon, and description', () => {
      for (const opt of REACH_OPTIONS) {
        expect(opt.id).toBeTruthy()
        expect(opt.label).toBeTruthy()
        expect(opt.icon).toBeTruthy()
        expect(opt.description).toBeTruthy()
      }
    })

    it.each(['can-travel', 'can-host', 'digital-only'])('includes %s', (id) => {
      expect(REACH_OPTIONS.some((o) => o.id === id)).toBe(true)
    })
  })

  describe('getCultureSuggestionsForCountry', () => {
    it('returns non-empty array for KE containing Maasai', () => {
      const result = getCultureSuggestionsForCountry('KE')
      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain('Maasai')
    })

    it('returns non-empty array for NG containing Yoruba', () => {
      const result = getCultureSuggestionsForCountry('NG')
      expect(result.length).toBeGreaterThan(0)
      expect(result).toContain('Yoruba')
    })

    it('returns empty array for unknown country code', () => {
      expect(getCultureSuggestionsForCountry('XX')).toEqual([])
    })

    it('handles lowercase country codes', () => {
      expect(getCultureSuggestionsForCountry('ke')).toContain('Maasai')
    })

    it('covers at least 30 countries', () => {
      expect(Object.keys(CULTURE_SUGGESTIONS).length).toBeGreaterThanOrEqual(30)
    })
  })
})
