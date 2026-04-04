/**
 * Tests for lib/vocabulary.ts — vocabulary consistency
 */
import { VOCAB, EXPLORER_TYPES } from '@/lib/vocabulary'

describe('Vocabulary', () => {
  test('VOCAB has no legacy terms', () => {
    const keys = Object.keys(VOCAB)
    expect(keys).not.toContain('pioneer')
    expect(keys).not.toContain('anchor')
    expect(keys).not.toContain('path')
    expect(keys).not.toContain('chapter')
    expect(keys).not.toContain('venture')
    expect(keys).not.toContain('gate')
    expect(keys).not.toContain('route')
    expect(keys).not.toContain('compass')
  })

  test('VOCAB has all v2 terms', () => {
    expect(VOCAB.explorer.singular).toBe('Explorer')
    expect(VOCAB.host.singular).toBe('Host')
    expect(VOCAB.opportunity.singular).toBe('Opportunity')
    expect(VOCAB.exchange.singular).toBe('Exchange')
    expect(VOCAB.hub.singular).toBe('Hub')
    expect(VOCAB.corridor.singular).toBe('Corridor')
  })

  test('EXPLORER_TYPES has 6 types with sectors', () => {
    expect(Object.keys(EXPLORER_TYPES)).toHaveLength(6)
    for (const type of Object.values(EXPLORER_TYPES)) {
      expect(type.sectors.length).toBeGreaterThan(0)
      expect(type.icon).toBeTruthy()
      expect(type.label).toBeTruthy()
    }
  })
})
