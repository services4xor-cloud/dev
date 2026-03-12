/**
 * Unit tests for lib/vocabulary.ts — BeNetwork term system
 */

import { VOCAB, PIONEER_TYPES, PATH_CATEGORIES } from '@/lib/vocabulary'
import type { PioneerType } from '@/lib/vocabulary'

describe('VOCAB', () => {
  it('has all legacy terms defined', () => {
    const legacyTerms = ['pioneer', 'anchor', 'path', 'chapter', 'venture', 'gate', 'route', 'compass']
    legacyTerms.forEach((term) => {
      expect(VOCAB[term as keyof typeof VOCAB]).toBeDefined()
    })
  })

  it('has all Human Exchange Network terms defined', () => {
    const newTerms = ['explorer', 'host', 'opportunity', 'exchange', 'experience', 'discovery', 'hub', 'corridor']
    newTerms.forEach((term) => {
      expect(VOCAB[term as keyof typeof VOCAB]).toBeDefined()
    })
  })

  it('each core term has singular, plural, and verb forms', () => {
    const coreTerms = [
      'pioneer', 'anchor', 'path', 'chapter', 'venture', 'gate', 'route', 'compass',
      'explorer', 'host', 'opportunity', 'exchange', 'experience', 'discovery', 'hub', 'corridor',
    ] as const
    coreTerms.forEach((term) => {
      const entry = VOCAB[term]
      expect(typeof entry).toBe('object')
      expect((entry as any).singular).toBeTruthy()
      expect((entry as any).plural).toBeTruthy()
      expect((entry as any).verb).toBeTruthy()
    })
  })

  it('never uses forbidden terminology', () => {
    const allValues = JSON.stringify(VOCAB).toLowerCase()
    const forbidden = ['job', 'employer', 'candidate', 'booking', 'tour', 'search']
    forbidden.forEach((word) => {
      expect(allValues).not.toContain(`"${word}"`)
    })
  })

  it('has network_name defined', () => {
    expect(VOCAB.network_name).toBe('The BeNetwork')
  })

  it('has updated tagline', () => {
    expect(VOCAB.tagline).toContain('connected')
  })

  it('has CTA strings', () => {
    expect(VOCAB.pioneer_join).toBeTruthy()
    expect(VOCAB.chapter_open).toBeTruthy()
    expect(VOCAB.anchor_in).toBeTruthy()
    expect(VOCAB.explorer_cta).toBeTruthy()
    expect(VOCAB.host_cta).toBeTruthy()
    expect(VOCAB.connect_cta).toBeTruthy()
    expect(VOCAB.discover_cta).toBeTruthy()
  })
})

describe('PIONEER_TYPES', () => {
  const expectedTypes: PioneerType[] = [
    'explorer', 'professional', 'artisan', 'guardian', 'creator', 'healer',
  ]

  it('has all 6 pioneer types', () => {
    expectedTypes.forEach((type) => {
      expect(PIONEER_TYPES[type]).toBeDefined()
    })
  })

  it('each type has label, icon, description, and sectors', () => {
    expectedTypes.forEach((type) => {
      const entry = PIONEER_TYPES[type]
      expect(entry.label).toBeTruthy()
      expect(entry.icon).toBeTruthy()
      expect(entry.description).toBeTruthy()
      expect(entry.sectors.length).toBeGreaterThan(0)
    })
  })

  it('each type has unique label', () => {
    const labels = expectedTypes.map((t) => PIONEER_TYPES[t].label)
    expect(new Set(labels).size).toBe(labels.length)
  })
})

describe('PATH_CATEGORIES', () => {
  it('has at least 10 categories', () => {
    expect(PATH_CATEGORIES.length).toBeGreaterThanOrEqual(10)
  })

  it('each category has id, label, icon, and venturetype', () => {
    PATH_CATEGORIES.forEach((cat) => {
      expect(cat.id).toBeTruthy()
      expect(cat.label).toBeTruthy()
      expect(cat.icon).toBeTruthy()
      expect(cat.venturetype).toBeTruthy()
    })
  })

  it('all category ids are unique', () => {
    const ids = PATH_CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
