import {
  sanitizeString,
  validateEmail,
  validateAmount,
  capArray,
  validateCountryCode,
  validateCurrency,
  parseJsonBody,
} from '@/lib/validation'

// ─── sanitizeString ──────────────────────────────────────────────────

describe('sanitizeString()', () => {
  it('trims leading and trailing whitespace', () => {
    expect(sanitizeString('  hello  ')).toBe('hello')
  })

  it('caps string at default 200 characters', () => {
    const long = 'a'.repeat(250)
    const result = sanitizeString(long)
    expect(result).toHaveLength(200)
  })

  it('caps string at custom maxLength', () => {
    expect(sanitizeString('hello world', 5)).toBe('hello')
  })

  it('returns empty string for non-string number', () => {
    expect(sanitizeString(42)).toBe('')
  })

  it('returns empty string for null', () => {
    expect(sanitizeString(null)).toBe('')
  })

  it('returns empty string for undefined', () => {
    expect(sanitizeString(undefined)).toBe('')
  })

  it('returns empty string for object', () => {
    expect(sanitizeString({ key: 'value' })).toBe('')
  })

  it('returns empty string for array', () => {
    expect(sanitizeString(['a', 'b'])).toBe('')
  })

  it('returns empty string for boolean', () => {
    expect(sanitizeString(true)).toBe('')
  })

  it('handles empty string correctly', () => {
    expect(sanitizeString('')).toBe('')
  })

  it('preserves inner whitespace', () => {
    expect(sanitizeString('  hello   world  ')).toBe('hello   world')
  })
})

// ─── validateEmail ───────────────────────────────────────────────────

describe('validateEmail()', () => {
  it('accepts a standard email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('accepts email with subdomain', () => {
    expect(validateEmail('user@mail.example.co.ke')).toBe(true)
  })

  it('accepts email with plus tag', () => {
    expect(validateEmail('user+tag@example.com')).toBe(true)
  })

  it('rejects email without @', () => {
    expect(validateEmail('userexample.com')).toBe(false)
  })

  it('rejects email without domain', () => {
    expect(validateEmail('user@')).toBe(false)
  })

  it('rejects email without TLD', () => {
    expect(validateEmail('user@example')).toBe(false)
  })

  it('rejects email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false)
  })

  it('rejects empty string', () => {
    expect(validateEmail('')).toBe(false)
  })

  it('rejects plain text', () => {
    expect(validateEmail('notanemail')).toBe(false)
  })
})

// ─── validateAmount ──────────────────────────────────────────────────

describe('validateAmount()', () => {
  it('accepts a positive integer', () => {
    const result = validateAmount(100)
    expect(result.valid).toBe(true)
    expect(result.value).toBe(100)
  })

  it('accepts a positive float and rounds it', () => {
    const result = validateAmount(99.7)
    expect(result.valid).toBe(true)
    expect(result.value).toBe(100)
  })

  it('accepts numeric string', () => {
    const result = validateAmount('500')
    expect(result.valid).toBe(true)
    expect(result.value).toBe(500)
  })

  it('accepts the maximum allowed amount', () => {
    const result = validateAmount(1_000_000)
    expect(result.valid).toBe(true)
    expect(result.value).toBe(1_000_000)
  })

  it('rejects zero', () => {
    const result = validateAmount(0)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('rejects negative number', () => {
    const result = validateAmount(-50)
    expect(result.valid).toBe(false)
    expect(result.error).toBeDefined()
  })

  it('rejects amount exceeding 1,000,000', () => {
    const result = validateAmount(1_000_001)
    expect(result.valid).toBe(false)
    expect(result.error).toMatch(/1,000,000/)
  })

  it('rejects NaN', () => {
    const result = validateAmount(NaN)
    expect(result.valid).toBe(false)
  })

  it('rejects Infinity', () => {
    const result = validateAmount(Infinity)
    expect(result.valid).toBe(false)
  })

  it('rejects non-numeric string', () => {
    const result = validateAmount('abc')
    expect(result.valid).toBe(false)
  })

  it('rejects null', () => {
    const result = validateAmount(null)
    expect(result.valid).toBe(false)
  })

  it('rejects undefined', () => {
    const result = validateAmount(undefined)
    expect(result.valid).toBe(false)
  })

  it('returns value: 0 for invalid input', () => {
    expect(validateAmount(-1).value).toBe(0)
    expect(validateAmount('xyz').value).toBe(0)
  })
})

// ─── capArray ────────────────────────────────────────────────────────

describe('capArray()', () => {
  it('returns array unchanged when under the cap', () => {
    expect(capArray([1, 2, 3], 10)).toEqual([1, 2, 3])
  })

  it('caps array to default 20 items', () => {
    const arr = Array.from({ length: 30 }, (_, i) => i)
    const result = capArray(arr)
    expect(result).toHaveLength(20)
  })

  it('caps array to custom maxItems', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(capArray(arr, 3)).toEqual([1, 2, 3])
  })

  it('returns [] for non-array (string)', () => {
    expect(capArray('hello')).toEqual([])
  })

  it('returns [] for non-array (number)', () => {
    expect(capArray(42)).toEqual([])
  })

  it('returns [] for null', () => {
    expect(capArray(null)).toEqual([])
  })

  it('returns [] for undefined', () => {
    expect(capArray(undefined)).toEqual([])
  })

  it('returns [] for object', () => {
    expect(capArray({ a: 1 })).toEqual([])
  })

  it('handles empty array', () => {
    expect(capArray([])).toEqual([])
  })

  it('preserves element types (generic)', () => {
    const result = capArray<string>(['a', 'b', 'c'], 2)
    expect(result).toEqual(['a', 'b'])
  })
})

// ─── validateCountryCode ─────────────────────────────────────────────

describe('validateCountryCode()', () => {
  it('accepts a valid 2-letter code', () => {
    expect(validateCountryCode('KE')).toBe('KE')
  })

  it('accepts a valid 3-letter code', () => {
    expect(validateCountryCode('KEN')).toBe('KEN')
  })

  it('uppercases lowercase input', () => {
    expect(validateCountryCode('de')).toBe('DE')
  })

  it('trims whitespace before validating', () => {
    expect(validateCountryCode('  CH  ')).toBe('CH')
  })

  it('rejects a 1-letter code', () => {
    expect(validateCountryCode('K')).toBeNull()
  })

  it('rejects a 4-letter code', () => {
    expect(validateCountryCode('KENY')).toBeNull()
  })

  it('rejects code with digits', () => {
    expect(validateCountryCode('K3')).toBeNull()
  })

  it('rejects code with special characters', () => {
    expect(validateCountryCode('K-E')).toBeNull()
  })

  it('rejects empty string', () => {
    expect(validateCountryCode('')).toBeNull()
  })

  it('rejects number input', () => {
    expect(validateCountryCode(42)).toBeNull()
  })

  it('rejects null', () => {
    expect(validateCountryCode(null)).toBeNull()
  })

  it('rejects undefined', () => {
    expect(validateCountryCode(undefined)).toBeNull()
  })
})

// ─── validateCurrency ────────────────────────────────────────────────

describe('validateCurrency()', () => {
  it('accepts a 3-letter currency code', () => {
    expect(validateCurrency('KES')).toBe('KES')
  })

  it('accepts a 2-letter code', () => {
    expect(validateCurrency('EU')).toBe('EU')
  })

  it('accepts a 1-character code', () => {
    expect(validateCurrency('$')).toBe('$')
  })

  it('uppercases lowercase input', () => {
    expect(validateCurrency('eur')).toBe('EUR')
  })

  it('trims whitespace', () => {
    expect(validateCurrency(' USD ')).toBe('USD')
  })

  it('rejects empty string', () => {
    expect(validateCurrency('')).toBeNull()
  })

  it('rejects a code longer than 3 characters', () => {
    expect(validateCurrency('EURO')).toBeNull()
  })

  it('rejects number input', () => {
    expect(validateCurrency(123)).toBeNull()
  })

  it('rejects null', () => {
    expect(validateCurrency(null)).toBeNull()
  })

  it('rejects undefined', () => {
    expect(validateCurrency(undefined)).toBeNull()
  })
})

// ─── parseJsonBody ───────────────────────────────────────────────────

describe('parseJsonBody()', () => {
  function makeRequest(body: string, contentType = 'application/json'): Request {
    return new Request('http://localhost/api/test', {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body,
    })
  }

  it('parses valid JSON object', async () => {
    const req = makeRequest(JSON.stringify({ name: 'Alice', age: 30 }))
    const result = await parseJsonBody<{ name: string; age: number }>(req)
    expect(result.data).toEqual({ name: 'Alice', age: 30 })
    expect(result.error).toBeUndefined()
  })

  it('parses valid JSON array', async () => {
    const req = makeRequest(JSON.stringify([1, 2, 3]))
    const result = await parseJsonBody<number[]>(req)
    expect(result.data).toEqual([1, 2, 3])
  })

  it('returns error for invalid JSON', async () => {
    const req = makeRequest('{ not valid json }')
    const result = await parseJsonBody<unknown>(req)
    expect(result.data).toBeNull()
    expect(result.error).toBe('Invalid JSON body')
  })

  it('returns error for empty body', async () => {
    const req = makeRequest('')
    const result = await parseJsonBody<unknown>(req)
    expect(result.data).toBeNull()
    expect(result.error).toBe('Invalid JSON body')
  })

  it('returns error for plain text body', async () => {
    const req = makeRequest('hello world', 'text/plain')
    const result = await parseJsonBody<unknown>(req)
    expect(result.data).toBeNull()
    expect(result.error).toBe('Invalid JSON body')
  })

  it('parses nested JSON object', async () => {
    const payload = { user: { id: '123', roles: ['admin', 'user'] } }
    const req = makeRequest(JSON.stringify(payload))
    const result = await parseJsonBody<typeof payload>(req)
    expect(result.data).toEqual(payload)
  })
})
