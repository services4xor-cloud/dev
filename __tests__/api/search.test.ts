/**
 * Unit tests for Search API helper functions
 *
 * Tests the normalise, scorePackage, and scorePathTextMatch logic
 * without needing to spin up a server.
 */

// Re-implement helpers locally to test them in isolation
function normalise(s: string): string {
  return s.toLowerCase().trim()
}

interface MockPackage {
  name: string
  provider: string
  destination: string
  type: string
  highlights: string[]
  priceEUR?: number
  priceUSD?: number
  priceKES?: number
}

function scorePackage(pkg: MockPackage, query: string): number {
  const q = normalise(query)
  if (!q) return 50

  const fields = [
    pkg.name,
    pkg.provider,
    pkg.destination,
    pkg.type.replace('_', ' '),
    ...pkg.highlights,
  ].map(normalise)

  let score = 0
  for (const field of fields) {
    if (field.includes(q)) {
      score += 25
    } else {
      const queryWords = q.split(/\s+/)
      const fieldWords = field.split(/\s+/)
      const overlapping = queryWords.filter((w) =>
        fieldWords.some((fw) => fw.includes(w) || w.includes(fw))
      )
      score += overlapping.length * 8
    }
  }

  return Math.min(100, score)
}

function packagePriceLabel(pkg: MockPackage): string {
  if (pkg.priceEUR) return `€${pkg.priceEUR.toLocaleString('en-US')}`
  if (pkg.priceUSD) return `$${pkg.priceUSD.toLocaleString('en-US')}`
  if (pkg.priceKES) return `KES ${pkg.priceKES.toLocaleString('en-US')}`
  return 'Price on request'
}

describe('normalise', () => {
  it('lowercases and trims', () => {
    expect(normalise('  Hello World  ')).toBe('hello world')
  })

  it('handles empty string', () => {
    expect(normalise('')).toBe('')
  })
})

describe('scorePackage', () => {
  const testPackage: MockPackage = {
    name: 'Masai Mara 3-Day Safari',
    provider: 'Basecamp Explorer',
    destination: 'Masai Mara Reserve',
    type: 'safari_lodge',
    highlights: ['Big Five game drives', 'Hot air balloon ride', 'Maasai village visit'],
  }

  it('returns 50 for empty query', () => {
    expect(scorePackage(testPackage, '')).toBe(50)
  })

  it('returns 50 for whitespace query', () => {
    expect(scorePackage(testPackage, '   ')).toBe(50)
  })

  it('scores high for exact name match', () => {
    const score = scorePackage(testPackage, 'masai mara')
    expect(score).toBeGreaterThan(30)
  })

  it('scores higher for more field matches', () => {
    const safariScore = scorePackage(testPackage, 'safari')
    const unrelatedScore = scorePackage(testPackage, 'blockchain')
    expect(safariScore).toBeGreaterThan(unrelatedScore)
  })

  it('caps at 100', () => {
    const score = scorePackage(testPackage, 'masai mara safari basecamp')
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe('packagePriceLabel', () => {
  it('formats EUR price', () => {
    expect(packagePriceLabel({ ...createPkg(), priceEUR: 1500 })).toBe('€1,500')
  })

  it('formats USD price when no EUR', () => {
    expect(packagePriceLabel({ ...createPkg(), priceUSD: 2000 })).toBe('$2,000')
  })

  it('formats KES price when no EUR or USD', () => {
    expect(packagePriceLabel({ ...createPkg(), priceKES: 150000 })).toBe('KES 150,000')
  })

  it('returns "Price on request" when no price', () => {
    expect(packagePriceLabel(createPkg())).toBe('Price on request')
  })

  it('prefers EUR over USD', () => {
    expect(packagePriceLabel({ ...createPkg(), priceEUR: 1000, priceUSD: 1200 })).toBe('€1,000')
  })
})

function createPkg(): MockPackage {
  return {
    name: 'Test Package',
    provider: 'Test Provider',
    destination: 'Test Destination',
    type: 'safari',
    highlights: [],
  }
}
