/**
 * Social Media Tests
 *
 * Validates:
 *   - Platform configs have all required fields
 *   - Country platform lookup returns correct platforms
 *   - Env var collection deduplicates
 *   - Post copy generators produce content for all platforms
 */

import {
  SOCIAL_CONFIGS,
  getPlatformsForCountry,
  getRequiredEnvVars,
  generatePathPostCopy,
  generateSafariPostCopy,
  type SocialPlatform,
} from '@/lib/social-media'

describe('Social Media — SOCIAL_CONFIGS', () => {
  it('exports 9 platform configs', () => {
    expect(Object.keys(SOCIAL_CONFIGS)).toHaveLength(9)
  })

  it('every config has required fields', () => {
    for (const config of Object.values(SOCIAL_CONFIGS)) {
      expect(config.platform).toBeTruthy()
      expect(config.displayName).toBeTruthy()
      expect(config.icon).toBeTruthy()
      expect(config.primaryCountries.length).toBeGreaterThan(0)
      expect(config.contentTypes.length).toBeGreaterThan(0)
      expect(config.bestFor.length).toBeGreaterThan(0)
      expect(config.apiEnvVars.length).toBeGreaterThan(0)
      expect(config.apiDocs).toMatch(/^https?:\/\//)
      expect(config.automationCapabilities.length).toBeGreaterThan(0)
    }
  })
})

describe('Social Media — getPlatformsForCountry', () => {
  it('returns platforms for KE', () => {
    const platforms = getPlatformsForCountry('KE')
    expect(platforms.length).toBeGreaterThan(0)
    const names = platforms.map((p) => p.platform)
    expect(names).toContain('whatsapp_business')
  })

  it('returns empty for unknown country', () => {
    const platforms = getPlatformsForCountry('XX')
    expect(platforms).toHaveLength(0)
  })

  it('sorts by country priority position', () => {
    const platforms = getPlatformsForCountry('KE')
    // KE should appear earlier in primaryCountries for the first results
    for (let i = 1; i < platforms.length; i++) {
      const prevIdx = platforms[i - 1].primaryCountries.indexOf('KE')
      const currIdx = platforms[i].primaryCountries.indexOf('KE')
      expect(currIdx).toBeGreaterThanOrEqual(prevIdx)
    }
  })
})

describe('Social Media — getRequiredEnvVars', () => {
  it('returns deduplicated env vars', () => {
    // instagram + facebook share FACEBOOK_APP_ID/SECRET
    const vars = getRequiredEnvVars(['instagram', 'facebook'])
    expect(vars.length).toBeGreaterThan(0)
    expect(new Set(vars).size).toBe(vars.length) // no dupes
    expect(vars).toContain('FACEBOOK_APP_ID')
  })

  it('returns sorted result', () => {
    const vars = getRequiredEnvVars(['instagram', 'tiktok'])
    const sorted = [...vars].sort()
    expect(vars).toEqual(sorted)
  })
})

describe('Social Media — generatePathPostCopy', () => {
  it('generates copy for all 9 platforms', () => {
    const copy = generatePathPostCopy('Safari Guide', 'Basecamp', 'Nairobi', 'Full Path')
    const platforms = Object.keys(copy) as SocialPlatform[]
    expect(platforms).toHaveLength(9)
    for (const platform of platforms) {
      expect(copy[platform]).toBeTruthy()
      expect(copy[platform].length).toBeGreaterThan(10)
    }
  })

  it('includes path title in all copies', () => {
    const copy = generatePathPostCopy('Data Analyst', 'SAP', 'Berlin', 'Full Path')
    for (const text of Object.values(copy)) {
      expect(text).toContain('Data Analyst')
    }
  })
})

describe('Social Media — generateSafariPostCopy', () => {
  it('generates copy for all 9 platforms', () => {
    const copy = generateSafariPostCopy('Mara Classic', 2, 50000, 'Maasai Mara')
    const platforms = Object.keys(copy) as SocialPlatform[]
    expect(platforms).toHaveLength(9)
  })

  it('includes formatted price', () => {
    const copy = generateSafariPostCopy('Mara Classic', 2, 50000, 'Maasai Mara')
    // At least some platforms should show the price
    expect(copy.instagram).toContain('50,000')
  })
})
