/**
 * Unit tests for lib/vocabulary.ts — BeNetwork term system
 */

import { VOCAB, PIONEER_TYPES, PATH_CATEGORIES } from '@/lib/vocabulary'
import type { PioneerType } from '@/lib/vocabulary'

describe('VOCAB', () => {
  it('has all core terms defined', () => {
    const requiredTerms = [
      'pioneer',
      'anchor',
      'path',
      'chapter',
      'venture',
      'gate',
      'route',
      'compass',
    ]
    requiredTerms.forEach((term) => {
      expect(VOCAB[term as keyof typeof VOCAB]).toBeDefined()
    })
  })

  it('each core term has singular, plural, and verb forms', () => {
    const coreTerms = [
      'pioneer',
      'anchor',
      'path',
      'chapter',
      'venture',
      'gate',
      'route',
      'compass',
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
    const forbidden = ['job', 'employer', 'candidate', 'application', 'booking', 'tour', 'search']
    forbidden.forEach((word) => {
      // Only check for whole words to avoid false positives
      expect(allValues).not.toContain(`"${word}"`)
    })
  })

  it('has network_name defined', () => {
    expect(VOCAB.network_name).toBe('The BeNetwork')
  })

  it('has tagline defined', () => {
    expect(VOCAB.tagline).toContain('belong')
  })

  it('has CTA strings for pioneers and anchors', () => {
    expect(VOCAB.pioneer_join).toBeTruthy()
    expect(VOCAB.chapter_open).toBeTruthy()
    expect(VOCAB.anchor_in).toBeTruthy()
  })
})

describe('PIONEER_TYPES', () => {
  const expectedTypes: PioneerType[] = [
    'explorer',
    'professional',
    'artisan',
    'guardian',
    'creator',
    'healer',
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

  it('each type has emoji icon', () => {
    expectedTypes.forEach((type) => {
      // Emojis are typically > 1 char in length
      expect(PIONEER_TYPES[type].icon.length).toBeGreaterThan(0)
    })
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

  it('venturetype is one of known types', () => {
    const knownTypes = ['experience', 'professional', 'creative', 'charity']
    PATH_CATEGORIES.forEach((cat) => {
      expect(knownTypes).toContain(cat.venturetype)
    })
  })
})
