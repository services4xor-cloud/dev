/**
 * Identity Chain Tests — Service Layer Data Consistency
 *
 * Validates that mock thread data has the correct format
 * for the full chain: service → API → hook → UI
 */
import { MOCK_THREADS } from '@/data/mock/threads'

describe('Identity Chain — Mock Thread Data', () => {
  it('has at least 30 threads', () => {
    expect(MOCK_THREADS.length).toBeGreaterThanOrEqual(30)
  })

  it('every thread has required fields', () => {
    for (const t of MOCK_THREADS) {
      expect(t.slug).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.brandName).toBeTruthy()
      expect(t.type).toBeTruthy()
      expect(t.icon).toBeTruthy()
      expect(t.tagline).toBeTruthy()
      expect(typeof t.memberCount).toBe('number')
    }
  })

  it('every brandName starts with "Be"', () => {
    for (const t of MOCK_THREADS) {
      expect(t.brandName).toMatch(/^Be/)
    }
  })

  it('type is a valid ThreadType', () => {
    const valid = ['country', 'tribe', 'language', 'interest', 'religion', 'science', 'location']
    for (const t of MOCK_THREADS) {
      expect(valid).toContain(t.type)
    }
  })

  it('countries field is always an array', () => {
    for (const t of MOCK_THREADS) {
      expect(Array.isArray(t.countries)).toBe(true)
    }
  })

  it('has country threads for KE, DE, CH, NG, GB', () => {
    const countrySlugs = MOCK_THREADS.filter((t) => t.type === 'country').map((t) => t.slug)

    expect(countrySlugs).toContain('ke')
    expect(countrySlugs).toContain('de')
    expect(countrySlugs).toContain('ch')
    expect(countrySlugs).toContain('ng')
    expect(countrySlugs).toContain('gb')
  })

  it('has major world language threads', () => {
    const langSlugs = MOCK_THREADS.filter((t) => t.type === 'language').map((t) => t.slug)

    const required = [
      'english',
      'deutsch',
      'swahili',
      'french',
      'spanish',
      'chinese',
      'portuguese',
      'russian',
      'japanese',
      'korean',
    ]
    for (const lang of required) {
      expect(langSlugs).toContain(lang)
    }
  })

  it('tribe threads have parentThread pointing to a valid country', () => {
    const countrySlugs = MOCK_THREADS.filter((t) => t.type === 'country').map((t) => t.slug)

    const tribes = MOCK_THREADS.filter((t) => t.type === 'tribe')
    for (const tribe of tribes) {
      if (tribe.parentThread) {
        expect(countrySlugs).toContain(tribe.parentThread)
      }
    }
  })

  it('location threads have parentThread pointing to a valid country', () => {
    const countrySlugs = MOCK_THREADS.filter((t) => t.type === 'country').map((t) => t.slug)

    const locations = MOCK_THREADS.filter((t) => t.type === 'location')
    for (const loc of locations) {
      if (loc.parentThread) {
        expect(countrySlugs).toContain(loc.parentThread)
      }
    }
  })

  it('relatedThreads references are mostly valid slugs (>80%)', () => {
    const allSlugs = new Set(MOCK_THREADS.map((t) => t.slug))
    let total = 0
    let valid = 0

    for (const t of MOCK_THREADS) {
      for (const ref of t.relatedThreads) {
        total++
        if (allSlugs.has(ref)) valid++
      }
    }

    // Allow some forward-looking references (e.g. 'in', 'ae' for future countries)
    const ratio = total > 0 ? valid / total : 1
    expect(ratio).toBeGreaterThan(0.8)
  })

  it('slug is unique across all threads', () => {
    const slugs = MOCK_THREADS.map((t) => t.slug)
    const unique = new Set(slugs)
    expect(slugs.length).toBe(unique.size)
  })
})
