/**
 * Identity Flags Tests
 *
 * Validates:
 *   - Save/load round-trip via localStorage mock
 *   - hasCompletedOnboarding detection
 *   - URL builders produce correct paths
 *   - clearIdentityFlags removes data
 */

// Mock localStorage before importing the module
const store: Record<string, string> = {}
const mockLocalStorage = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value
  },
  removeItem: (key: string) => {
    delete store[key]
  },
  clear: () => {
    Object.keys(store).forEach((k) => delete store[k])
  },
  get length() {
    return Object.keys(store).length
  },
  key: (_i: number) => null as string | null,
}

// Set up global window + localStorage for Node environment
Object.defineProperty(global, 'window', {
  value: { localStorage: mockLocalStorage },
  writable: true,
  configurable: true,
})
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
  configurable: true,
})

import {
  saveIdentityFlags,
  loadIdentityFlags,
  hasCompletedOnboarding,
  getCompassUrl,
  getVenturesUrl,
  clearIdentityFlags,
} from '@/lib/identity-flags'

beforeEach(() => {
  mockLocalStorage.clear()
})

const SAMPLE_FLAGS = {
  pioneerType: 'professional' as const,
  fromCountry: 'KE',
  toCountries: ['DE', 'GB'],
  skills: ['JavaScript', 'React'],
  headline: 'Full-stack developer',
  bio: 'Building the future',
  phone: '+254712345678',
}

describe('Identity Flags — save and load', () => {
  it('round-trips flags through localStorage', () => {
    saveIdentityFlags(SAMPLE_FLAGS)
    const loaded = loadIdentityFlags()
    expect(loaded).not.toBeNull()
    expect(loaded!.pioneerType).toBe('professional')
    expect(loaded!.fromCountry).toBe('KE')
    expect(loaded!.toCountries).toEqual(['DE', 'GB'])
    expect(loaded!.skills).toEqual(['JavaScript', 'React'])
  })

  it('adds updatedAt timestamp on save', () => {
    saveIdentityFlags(SAMPLE_FLAGS)
    const loaded = loadIdentityFlags()
    expect(loaded!.updatedAt).toBeTruthy()
    expect(new Date(loaded!.updatedAt).getTime()).not.toBeNaN()
  })

  it('returns null when nothing saved', () => {
    expect(loadIdentityFlags()).toBeNull()
  })
})

describe('Identity Flags — hasCompletedOnboarding', () => {
  it('returns false when no flags saved', () => {
    expect(hasCompletedOnboarding()).toBe(false)
  })

  it('returns true after saving flags', () => {
    saveIdentityFlags(SAMPLE_FLAGS)
    expect(hasCompletedOnboarding()).toBe(true)
  })
})

describe('Identity Flags — URL builders', () => {
  it('getCompassUrl returns /compass when no flags', () => {
    expect(getCompassUrl()).toBe('/compass')
  })

  it('getCompassUrl includes fromCountry when flags exist', () => {
    saveIdentityFlags(SAMPLE_FLAGS)
    expect(getCompassUrl()).toBe('/compass?from=KE')
  })

  it('getVenturesUrl returns /ventures when no flags', () => {
    expect(getVenturesUrl()).toBe('/ventures')
  })

  it('getVenturesUrl includes from, to, and type params', () => {
    saveIdentityFlags(SAMPLE_FLAGS)
    const url = getVenturesUrl()
    expect(url).toContain('from=KE')
    expect(url).toContain('to=DE%2CGB')
    expect(url).toContain('type=professional')
  })
})

describe('Identity Flags — clearIdentityFlags', () => {
  it('removes flags from localStorage', () => {
    saveIdentityFlags(SAMPLE_FLAGS)
    expect(loadIdentityFlags()).not.toBeNull()
    clearIdentityFlags()
    expect(loadIdentityFlags()).toBeNull()
  })

  it('hasCompletedOnboarding returns false after clear', () => {
    saveIdentityFlags(SAMPLE_FLAGS)
    clearIdentityFlags()
    expect(hasCompletedOnboarding()).toBe(false)
  })
})
