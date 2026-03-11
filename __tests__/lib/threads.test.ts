/**
 * Unit tests for lib/threads.ts — Identity community architecture
 */

import {
  getThread,
  getThreadsByType,
  getChildThreads,
  getRelatedThreads,
  searchThreads,
  JOURNEY_STAGES,
  type Thread,
} from '@/lib/threads'
import { MOCK_THREADS } from '@/data/mock'

describe('getThread', () => {
  it('finds a thread by slug', () => {
    const thread = getThread('ke', MOCK_THREADS)
    expect(thread).not.toBeNull()
    expect(thread!.name).toBe('Kenya')
    expect(thread!.brandName).toBe('BeKenya')
  })

  it('returns null for unknown slug', () => {
    expect(getThread('nonexistent', MOCK_THREADS)).toBeNull()
  })
})

describe('getThreadsByType', () => {
  it('returns all country threads', () => {
    const countries = getThreadsByType('country', MOCK_THREADS)
    expect(countries.length).toBeGreaterThanOrEqual(3)
    countries.forEach((t) => expect(t.type).toBe('country'))
  })

  it('returns all tribe threads', () => {
    const tribes = getThreadsByType('tribe', MOCK_THREADS)
    expect(tribes.length).toBeGreaterThanOrEqual(2)
    tribes.forEach((t) => expect(t.type).toBe('tribe'))
  })

  it('returns all interest threads', () => {
    const interests = getThreadsByType('interest', MOCK_THREADS)
    expect(interests.length).toBeGreaterThanOrEqual(3)
    interests.forEach((t) => expect(t.type).toBe('interest'))
  })

  it('only returns active threads', () => {
    const allThreads: Thread[] = [
      ...MOCK_THREADS,
      {
        slug: 'inactive',
        name: 'Inactive',
        brandName: 'BeInactive',
        type: 'country',
        icon: '❌',
        tagline: '',
        description: '',
        relatedThreads: [],
        countries: [],
        memberCount: 0,
        active: false,
      },
    ]
    const countries = getThreadsByType('country', allThreads)
    expect(countries.every((t) => t.active)).toBe(true)
  })
})

describe('getChildThreads', () => {
  it('returns tribes within Kenya', () => {
    const children = getChildThreads('ke', MOCK_THREADS)
    expect(children.length).toBeGreaterThanOrEqual(2)
    children.forEach((t) => expect(t.parentThread).toBe('ke'))
  })

  it('returns locations within Kenya', () => {
    const allChildren = getChildThreads('ke', MOCK_THREADS)
    const locations = allChildren.filter((t) => t.type === 'location')
    expect(locations.length).toBeGreaterThanOrEqual(1)
  })

  it('returns empty for thread with no children', () => {
    expect(getChildThreads('tech', MOCK_THREADS)).toEqual([])
  })
})

describe('getRelatedThreads', () => {
  it('returns related threads for Kenya', () => {
    const related = getRelatedThreads('ke', MOCK_THREADS)
    expect(related.length).toBeGreaterThan(0)
  })

  it('returns empty for unknown slug', () => {
    expect(getRelatedThreads('nonexistent', MOCK_THREADS)).toEqual([])
  })
})

describe('searchThreads', () => {
  it('finds threads by name', () => {
    const results = searchThreads('Kenya', MOCK_THREADS)
    expect(results.some((t) => t.slug === 'ke')).toBe(true)
  })

  it('finds threads by brand name', () => {
    const results = searchThreads('BeMaasai', MOCK_THREADS)
    expect(results.some((t) => t.slug === 'maasai')).toBe(true)
  })

  it('is case-insensitive', () => {
    const results = searchThreads('technology', MOCK_THREADS)
    expect(results.some((t) => t.slug === 'tech')).toBe(true)
  })

  it('returns results sorted by member count', () => {
    const results = searchThreads('Be', MOCK_THREADS)
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].memberCount).toBeGreaterThanOrEqual(results[i].memberCount)
    }
  })

  it('returns empty for no matches', () => {
    expect(searchThreads('xyznonexistent', MOCK_THREADS)).toEqual([])
  })
})

describe('MOCK_THREADS data integrity', () => {
  it('has at least 15 threads', () => {
    expect(MOCK_THREADS.length).toBeGreaterThanOrEqual(15)
  })

  it('all threads have required fields', () => {
    MOCK_THREADS.forEach((t) => {
      expect(t.slug).toBeTruthy()
      expect(t.name).toBeTruthy()
      expect(t.brandName).toBeTruthy()
      expect(t.type).toBeTruthy()
      expect(t.icon).toBeTruthy()
      expect(t.tagline).toBeTruthy()
      expect(t.description.length).toBeGreaterThan(20)
      expect(typeof t.memberCount).toBe('number')
      expect(typeof t.active).toBe('boolean')
    })
  })

  it('all brandNames start with "Be"', () => {
    MOCK_THREADS.forEach((t) => {
      expect(t.brandName.startsWith('Be')).toBe(true)
    })
  })

  it('all slugs are unique', () => {
    const slugs = MOCK_THREADS.map((t) => t.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })

  it('parent threads reference valid slugs', () => {
    const allSlugs = new Set(MOCK_THREADS.map((t) => t.slug))
    MOCK_THREADS.forEach((t) => {
      if (t.parentThread) {
        expect(allSlugs.has(t.parentThread)).toBe(true)
      }
    })
  })

  it('covers all thread types', () => {
    const types = new Set(MOCK_THREADS.map((t) => t.type))
    expect(types.has('country')).toBe(true)
    expect(types.has('tribe')).toBe(true)
    expect(types.has('language')).toBe(true)
    expect(types.has('interest')).toBe(true)
    expect(types.has('science')).toBe(true)
    expect(types.has('location')).toBe(true)
  })
})

describe('JOURNEY_STAGES', () => {
  it('has 5 stages', () => {
    expect(JOURNEY_STAGES.length).toBe(5)
  })

  it('stages follow the correct order', () => {
    const order = ['discover', 'trust', 'engage', 'belong', 'advocate']
    JOURNEY_STAGES.forEach((s, i) => {
      expect(s.stage).toBe(order[i])
    })
  })

  it('each stage has pages mapped', () => {
    JOURNEY_STAGES.forEach((s) => {
      expect(s.pages.length).toBeGreaterThan(0)
    })
  })

  it('each stage has conversion goal', () => {
    JOURNEY_STAGES.forEach((s) => {
      expect(s.conversionGoal.length).toBeGreaterThan(5)
    })
  })
})
