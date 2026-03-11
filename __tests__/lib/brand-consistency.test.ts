/**
 * Unit tests for brand name consistency across the platform
 *
 * Every thread brandName must follow the "Be" + identifier pattern
 * with no spaces after "Be". Validates thread data integrity.
 */

import { MOCK_THREADS } from '@/data/mock'

describe('Thread brand name consistency', () => {
  it('every thread brandName starts with "Be"', () => {
    MOCK_THREADS.forEach((thread) => {
      expect(thread.brandName.startsWith('Be')).toBe(true)
    })
  })

  it('no brandName contains a space after "Be"', () => {
    MOCK_THREADS.forEach((thread) => {
      const afterBe = thread.brandName.slice(2)
      expect(afterBe.startsWith(' ')).toBe(false)
    })
  })

  it('GB thread brandName is exactly "BeUK" (not "BeUnited Kingdom")', () => {
    const gbThread = MOCK_THREADS.find((t) => t.slug === 'gb')
    expect(gbThread).toBeDefined()
    expect(gbThread!.brandName).toBe('BeUK')
  })

  it('all thread slugs are lowercase and contain no spaces', () => {
    MOCK_THREADS.forEach((thread) => {
      expect(thread.slug).toBe(thread.slug.toLowerCase())
      expect(thread.slug).not.toContain(' ')
    })
  })

  it('all threads have required fields', () => {
    MOCK_THREADS.forEach((thread) => {
      expect(thread.slug).toBeTruthy()
      expect(thread.name).toBeTruthy()
      expect(thread.brandName).toBeTruthy()
      expect(thread.type).toBeTruthy()
      expect(thread.icon).toBeTruthy()
      expect(thread.tagline).toBeTruthy()
      expect(thread.description).toBeTruthy()
    })
  })

  it('thread member counts are positive numbers', () => {
    MOCK_THREADS.forEach((thread) => {
      expect(typeof thread.memberCount).toBe('number')
      expect(thread.memberCount).toBeGreaterThan(0)
    })
  })

  it('all threads are active', () => {
    MOCK_THREADS.forEach((thread) => {
      expect(thread.active).toBe(true)
    })
  })

  it('at least 80% of related thread references point to existing slugs', () => {
    const allSlugs = new Set(MOCK_THREADS.map((t) => t.slug))
    let totalRefs = 0
    let validRefs = 0
    MOCK_THREADS.forEach((thread) => {
      thread.relatedThreads.forEach((relatedSlug) => {
        totalRefs++
        if (allSlugs.has(relatedSlug)) validRefs++
      })
    })
    // Most related threads should reference existing slugs
    // Some may reference future threads not yet created
    const ratio = validRefs / totalRefs
    expect(ratio).toBeGreaterThanOrEqual(0.8)
  })

  it('parent threads exist for child threads', () => {
    const allSlugs = new Set(MOCK_THREADS.map((t) => t.slug))
    const threadsWithParent = MOCK_THREADS.filter((t) => t.parentThread)
    expect(threadsWithParent.length).toBeGreaterThan(0)
    threadsWithParent.forEach((thread) => {
      expect(allSlugs.has(thread.parentThread!)).toBe(true)
    })
  })
})
