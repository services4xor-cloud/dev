/**
 * Map Scoring Logic Tests
 *
 * Verifies the ×1 (single-country) vs ×2+ (multi-country) filter differentiation.
 *
 * Rules:
 * - Single country: only isPrimary filters + custom affect the map
 * - Multi-country: only filters shared by ×2+ sources affect the map
 * - Custom/manual filters always affect the map regardless of mode
 * - Priority order: currency > language > sector > faith
 */

// ─── Extracted scoring logic (mirrors page.tsx scoredCountries useMemo) ───

interface TestFilter {
  dimension: string
  nodeCode: string
  countryCodes: string[]
  source: string
  isPrimary?: boolean
}

const DIM_PRIORITY = ['currency', 'language', 'sector', 'faith']

/** Compute which filters should affect the map, given the mode */
function getActiveMapFilters(filters: TestFilter[], enrichedCountries: string[]): TestFilter[] {
  const singleCountry = enrichedCountries.length < 2

  // Compute overlap keys for multi-country
  let overlapKeys: Set<string> | null = null
  if (!singleCountry) {
    const keyToSources = new Map<string, Set<string>>()
    for (const f of filters) {
      if (!f.countryCodes?.length) continue
      const key = `${f.dimension}:${f.nodeCode}`
      const sources = keyToSources.get(key) ?? new Set()
      sources.add(f.source ?? 'custom')
      keyToSources.set(key, sources)
    }
    overlapKeys = new Set<string>()
    for (const [key, sources] of Array.from(keyToSources.entries())) {
      if (sources.size >= 2) overlapKeys.add(key)
    }
  }

  return filters.filter((f) => {
    if (!f.countryCodes?.length) return false
    if (f.source === 'custom') return true
    if (singleCountry) return !!f.isPrimary
    return overlapKeys!.has(`${f.dimension}:${f.nodeCode}`)
  })
}

/** Compute scored countries from active filters */
function computeScores(activeFilters: TestFilter[]) {
  const countMap = new Map<string, { dims: Set<string>; dimCounts: Record<string, number> }>()

  for (const f of activeFilters) {
    for (const code of f.countryCodes) {
      const entry = countMap.get(code) ?? { dims: new Set(), dimCounts: {} }
      entry.dims.add(f.dimension)
      entry.dimCounts[f.dimension] = (entry.dimCounts[f.dimension] || 0) + 1
      countMap.set(code, entry)
    }
  }

  const result: Record<string, { depth: number; dimensions: string[] }> = {}
  for (const [code, entry] of Array.from(countMap.entries())) {
    result[code] = {
      depth: entry.dims.size,
      dimensions: Array.from(entry.dims),
    }
  }
  return result
}

// ─── Test data ───────────────────────────────────────────────────────────────

// Kenya: English (primary), Swahili, KES, Agriculture (primary), Tourism, Christianity (primary), Islam
const KENYA_FILTERS: TestFilter[] = [
  {
    dimension: 'language',
    nodeCode: 'en',
    countryCodes: ['KE', 'US', 'GB', 'AU'],
    source: 'KE',
    isPrimary: true,
  },
  {
    dimension: 'language',
    nodeCode: 'sw',
    countryCodes: ['KE', 'TZ', 'UG'],
    source: 'KE',
    isPrimary: false,
  },
  { dimension: 'currency', nodeCode: 'kes', countryCodes: ['KE'], source: 'KE', isPrimary: true },
  {
    dimension: 'sector',
    nodeCode: 'agriculture-and-food',
    countryCodes: ['KE', 'TZ', 'ET', 'NG'],
    source: 'KE',
    isPrimary: true,
  },
  {
    dimension: 'sector',
    nodeCode: 'tourism-and-hospitality',
    countryCodes: ['KE', 'TZ', 'TH', 'ES'],
    source: 'KE',
    isPrimary: false,
  },
  {
    dimension: 'faith',
    nodeCode: 'christianity',
    countryCodes: ['KE', 'US', 'BR', 'DE', 'PH'],
    source: 'KE',
    isPrimary: true,
  },
  {
    dimension: 'faith',
    nodeCode: 'islam',
    countryCodes: ['KE', 'NG', 'EG', 'TR', 'ID'],
    source: 'KE',
    isPrimary: false,
  },
]

// Tanzania: Swahili (primary), English, TZS, Agriculture (primary), Tourism, Christianity (primary), Islam
const TANZANIA_FILTERS: TestFilter[] = [
  {
    dimension: 'language',
    nodeCode: 'sw',
    countryCodes: ['KE', 'TZ', 'UG'],
    source: 'TZ',
    isPrimary: true,
  },
  {
    dimension: 'language',
    nodeCode: 'en',
    countryCodes: ['KE', 'US', 'GB', 'AU'],
    source: 'TZ',
    isPrimary: false,
  },
  { dimension: 'currency', nodeCode: 'tzs', countryCodes: ['TZ'], source: 'TZ', isPrimary: true },
  {
    dimension: 'sector',
    nodeCode: 'agriculture-and-food',
    countryCodes: ['KE', 'TZ', 'ET', 'NG'],
    source: 'TZ',
    isPrimary: true,
  },
  {
    dimension: 'sector',
    nodeCode: 'tourism-and-hospitality',
    countryCodes: ['KE', 'TZ', 'TH', 'ES'],
    source: 'TZ',
    isPrimary: false,
  },
  {
    dimension: 'faith',
    nodeCode: 'christianity',
    countryCodes: ['KE', 'US', 'BR', 'DE', 'PH'],
    source: 'TZ',
    isPrimary: true,
  },
  {
    dimension: 'faith',
    nodeCode: 'islam',
    countryCodes: ['KE', 'NG', 'EG', 'TR', 'ID'],
    source: 'TZ',
    isPrimary: false,
  },
]

// Germany: German (primary), English, EUR, Automotive (primary), Tech, Christianity (primary)
const GERMANY_FILTERS: TestFilter[] = [
  {
    dimension: 'language',
    nodeCode: 'de',
    countryCodes: ['DE', 'AT', 'CH'],
    source: 'DE',
    isPrimary: true,
  },
  {
    dimension: 'language',
    nodeCode: 'en',
    countryCodes: ['KE', 'US', 'GB', 'AU'],
    source: 'DE',
    isPrimary: false,
  },
  {
    dimension: 'currency',
    nodeCode: 'eur',
    countryCodes: ['DE', 'FR', 'IT', 'ES', 'NL'],
    source: 'DE',
    isPrimary: true,
  },
  {
    dimension: 'sector',
    nodeCode: 'automotive-and-manufacturing',
    countryCodes: ['DE', 'JP', 'KR', 'US'],
    source: 'DE',
    isPrimary: true,
  },
  {
    dimension: 'sector',
    nodeCode: 'technology-and-it',
    countryCodes: ['US', 'DE', 'IN', 'IL'],
    source: 'DE',
    isPrimary: false,
  },
  {
    dimension: 'faith',
    nodeCode: 'christianity',
    countryCodes: ['KE', 'US', 'BR', 'DE', 'PH'],
    source: 'DE',
    isPrimary: true,
  },
]

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Map Scoring — Dimension Priority', () => {
  test('DIM_PRIORITY order: currency > language > sector > faith', () => {
    expect(DIM_PRIORITY).toEqual(['currency', 'language', 'sector', 'faith'])
  })
})

describe('Map Scoring — Single Country (×1 mode)', () => {
  test('only isPrimary filters affect the map', () => {
    const active = getActiveMapFilters(KENYA_FILTERS, ['KE'])

    // Should include only the 4 primary filters
    expect(active).toHaveLength(4)
    expect(active.every((f) => f.isPrimary)).toBe(true)
  })

  test('primary filters are: English, KES, Agriculture, Christianity', () => {
    const active = getActiveMapFilters(KENYA_FILTERS, ['KE'])
    const dims = active.map((f) => f.dimension).sort()
    const codes = active.map((f) => f.nodeCode).sort()

    expect(dims).toEqual(['currency', 'faith', 'language', 'sector'])
    expect(codes).toContain('en')
    expect(codes).toContain('kes')
    expect(codes).toContain('agriculture-and-food')
    expect(codes).toContain('christianity')
  })

  test('non-primary filters (Swahili, Tourism, Islam) are excluded', () => {
    const active = getActiveMapFilters(KENYA_FILTERS, ['KE'])
    const codes = active.map((f) => f.nodeCode)

    expect(codes).not.toContain('sw')
    expect(codes).not.toContain('tourism-and-hospitality')
    expect(codes).not.toContain('islam')
  })

  test('custom manual filters always included in single-country mode', () => {
    const customFilter: TestFilter = {
      dimension: 'language',
      nodeCode: 'de',
      countryCodes: ['DE', 'AT', 'CH'],
      source: 'custom',
    }
    const active = getActiveMapFilters([...KENYA_FILTERS, customFilter], ['KE'])

    // 4 primary + 1 custom = 5
    expect(active).toHaveLength(5)
    expect(active.find((f) => f.source === 'custom')).toBeDefined()
  })

  test('map only lights up countries matching primary values', () => {
    const active = getActiveMapFilters(KENYA_FILTERS, ['KE'])
    const scores = computeScores(active)

    // US should light up (English + Christianity = depth 2)
    expect(scores['US']).toBeDefined()
    expect(scores['US'].depth).toBe(2)
    expect(scores['US'].dimensions).toContain('language')
    expect(scores['US'].dimensions).toContain('faith')

    // TZ should light up (Agriculture only from primary = depth 1)
    // Note: Swahili is NOT primary for Kenya, so TZ only gets Agriculture
    expect(scores['TZ']).toBeDefined()
    expect(scores['TZ'].dimensions).toContain('sector')
    // TZ should NOT have language dimension (Swahili was excluded as non-primary)
    expect(scores['TZ'].dimensions).not.toContain('language')
  })
})

describe('Map Scoring — Multi Country (×2+ mode)', () => {
  test('KE + TZ: only shared dimensions affect map', () => {
    const allFilters = [...KENYA_FILTERS, ...TANZANIA_FILTERS]
    const active = getActiveMapFilters(allFilters, ['KE', 'TZ'])

    // Shared between KE and TZ:
    // - language:en (KE primary, TZ non-primary) → ×2 ✓
    // - language:sw (KE non-primary, TZ primary) → ×2 ✓
    // - sector:agriculture-and-food → ×2 ✓
    // - sector:tourism-and-hospitality → ×2 ✓
    // - faith:christianity → ×2 ✓
    // - faith:islam → ×2 ✓
    // NOT shared: currency:kes (KE only), currency:tzs (TZ only)
    // NOT shared: language:de, sector:automotive (neither has these)

    const nodeCodes = active.map((f) => f.nodeCode)
    expect(nodeCodes).toContain('en')
    expect(nodeCodes).toContain('sw')
    expect(nodeCodes).toContain('agriculture-and-food')
    expect(nodeCodes).toContain('tourism-and-hospitality')
    expect(nodeCodes).toContain('christianity')
    expect(nodeCodes).toContain('islam')

    // Currency NOT shared (KES ≠ TZS)
    expect(nodeCodes).not.toContain('kes')
    expect(nodeCodes).not.toContain('tzs')
  })

  test('KE + DE: English and Christianity are ×2, rest unique', () => {
    const allFilters = [...KENYA_FILTERS, ...GERMANY_FILTERS]
    const active = getActiveMapFilters(allFilters, ['KE', 'DE'])

    const nodeCodes = active.map((f) => f.nodeCode)

    // Shared: English ×2, Christianity ×2
    expect(nodeCodes).toContain('en')
    expect(nodeCodes).toContain('christianity')

    // NOT shared: KES, EUR (different currencies)
    expect(nodeCodes).not.toContain('kes')
    expect(nodeCodes).not.toContain('eur')

    // NOT shared: German (only DE), Swahili (only KE)
    expect(nodeCodes).not.toContain('de')
    expect(nodeCodes).not.toContain('sw')

    // NOT shared: Agriculture (only KE), Automotive (only DE)
    expect(nodeCodes).not.toContain('agriculture-and-food')
    expect(nodeCodes).not.toContain('automotive-and-manufacturing')
  })

  test('KE + TZ + DE: Christianity is ×3, English is ×3', () => {
    const allFilters = [...KENYA_FILTERS, ...TANZANIA_FILTERS, ...GERMANY_FILTERS]
    const active = getActiveMapFilters(allFilters, ['KE', 'TZ', 'DE'])

    // Build multiplier map
    const keyToSources = new Map<string, Set<string>>()
    for (const f of allFilters) {
      const key = `${f.dimension}:${f.nodeCode}`
      const sources = keyToSources.get(key) ?? new Set()
      sources.add(f.source)
      keyToSources.set(key, sources)
    }

    // English: KE + TZ + DE = ×3
    expect(keyToSources.get('language:en')?.size).toBe(3)

    // Christianity: KE + TZ + DE = ×3
    expect(keyToSources.get('faith:christianity')?.size).toBe(3)

    // Swahili: KE + TZ = ×2 (not DE)
    expect(keyToSources.get('language:sw')?.size).toBe(2)

    // Agriculture: KE + TZ = ×2 (not DE)
    expect(keyToSources.get('sector:agriculture-and-food')?.size).toBe(2)

    // German: only DE = ×1 → excluded
    expect(keyToSources.get('language:de')?.size).toBe(1)
    const nodeCodes = active.map((f) => f.nodeCode)
    expect(nodeCodes).not.toContain('de')

    // All ×2+ should be included
    expect(nodeCodes).toContain('en')
    expect(nodeCodes).toContain('sw')
    expect(nodeCodes).toContain('christianity')
    expect(nodeCodes).toContain('agriculture-and-food')
  })

  test('custom filters always included in multi-country mode', () => {
    const customFilter: TestFilter = {
      dimension: 'sector',
      nodeCode: 'fintech',
      countryCodes: ['KE', 'NG', 'ZA'],
      source: 'custom',
    }
    const allFilters = [...KENYA_FILTERS, ...TANZANIA_FILTERS, customFilter]
    const active = getActiveMapFilters(allFilters, ['KE', 'TZ'])

    expect(active.find((f) => f.source === 'custom')).toBeDefined()
    expect(active.find((f) => f.nodeCode === 'fintech')).toBeDefined()
  })

  test('no shared dimensions → only custom filters (if any)', () => {
    // Two countries with completely unique dimensions
    const countryA: TestFilter[] = [
      {
        dimension: 'currency',
        nodeCode: 'aaa',
        countryCodes: ['AA'],
        source: 'AA',
        isPrimary: true,
      },
      {
        dimension: 'language',
        nodeCode: 'lang-a',
        countryCodes: ['AA'],
        source: 'AA',
        isPrimary: true,
      },
    ]
    const countryB: TestFilter[] = [
      {
        dimension: 'currency',
        nodeCode: 'bbb',
        countryCodes: ['BB'],
        source: 'BB',
        isPrimary: true,
      },
      {
        dimension: 'language',
        nodeCode: 'lang-b',
        countryCodes: ['BB'],
        source: 'BB',
        isPrimary: true,
      },
    ]

    const active = getActiveMapFilters([...countryA, ...countryB], ['AA', 'BB'])
    expect(active).toHaveLength(0)
  })
})

describe('Map Scoring — Depth Calculation', () => {
  test('single country: depth reflects how many primary dimensions match', () => {
    const active = getActiveMapFilters(KENYA_FILTERS, ['KE'])
    const scores = computeScores(active)

    // Kenya itself: all 4 primary dimensions
    expect(scores['KE'].depth).toBe(4)

    // NG: Agriculture (sector) only from primary
    expect(scores['NG'].depth).toBe(1)
    expect(scores['NG'].dimensions).toEqual(['sector'])
  })

  test('multi-country depth uses only overlap filters', () => {
    const allFilters = [...KENYA_FILTERS, ...GERMANY_FILTERS]
    const active = getActiveMapFilters(allFilters, ['KE', 'DE'])
    const scores = computeScores(active)

    // US: matched by English (language) + Christianity (faith) = depth 2
    expect(scores['US']).toBeDefined()
    expect(scores['US'].depth).toBe(2)

    // GB: matched by English only = depth 1
    expect(scores['GB']).toBeDefined()
    expect(scores['GB'].depth).toBe(1)
  })
})
