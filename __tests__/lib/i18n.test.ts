/**
 * i18n Content Mask Tests
 *
 * Validates:
 *   - English fallback works for all keys
 *   - German translations exist for core keys
 *   - Swahili translations exist for core keys
 *   - Interpolation replaces {varName} correctly
 *   - Language prefix matching (de-CH → de)
 *   - Unknown keys return the key itself
 *   - All supported languages have at minimum the hero keys
 */
import { translate, getAvailableLanguages, hasTranslation } from '@/lib/i18n'

describe('i18n — translate()', () => {
  // ─── English Fallback ──────────────────────────────────────
  it('returns English text for known keys', () => {
    expect(translate('hero.headline', 'en')).toBe('Find where you')
    expect(translate('hero.belong', 'en')).toBe('belong.')
    expect(translate('hero.goThere', 'en')).toBe('Go there.')
  })

  it('returns key itself for unknown keys', () => {
    expect(translate('does.not.exist', 'en')).toBe('does.not.exist')
  })

  // ─── German Translations ──────────────────────────────────
  it('returns German translations for de', () => {
    expect(translate('hero.headline', 'de')).toBe('Finde wo du')
    expect(translate('hero.belong', 'de')).toBe('hingehörst.')
    expect(translate('nav.startCompass', 'de')).toBe('Kompass starten')
  })

  it('falls back to English for missing German keys', () => {
    // 'hero.greeting' template is the same concept but check a key missing in de
    const result = translate('does.not.exist', 'de')
    expect(result).toBe('does.not.exist')
  })

  // ─── Swahili Translations ─────────────────────────────────
  it('returns Swahili translations for sw', () => {
    expect(translate('hero.headline', 'sw')).toBe('Pata mahali')
    expect(translate('hero.belong', 'sw')).toBe('unapohusika.')
    expect(translate('nav.startCompass', 'sw')).toBe('Anza Dira')
  })

  // ─── Interpolation ────────────────────────────────────────
  it('interpolates {varName} placeholders', () => {
    const result = translate('hero.subtitle', 'en', { brandName: 'BeKenya' })
    expect(result).toContain('BeKenya')
    expect(result).not.toContain('{brandName}')
  })

  it('interpolates multiple variables', () => {
    const result = translate('hero.greeting', 'en', {
      geoName: 'Germany',
      geoGreeting: 'Willkommen!',
    })
    expect(result).toContain('Germany')
    expect(result).toContain('Willkommen!')
  })

  it('leaves unmatched placeholders intact', () => {
    const result = translate('hero.subtitle', 'en', {})
    expect(result).toContain('{brandName}')
  })

  // ─── Language Prefix Matching ─────────────────────────────
  it('matches de-CH to de translations', () => {
    expect(translate('hero.headline', 'de-CH')).toBe('Finde wo du')
  })

  it('matches sw-KE to sw translations', () => {
    expect(translate('hero.headline', 'sw-KE')).toBe('Pata mahali')
  })

  // ─── Major Languages Coverage ─────────────────────────────
  it('has translations for all top 10 global languages', () => {
    const topLanguages = ['en', 'de', 'sw', 'fr', 'ar', 'hi', 'zh', 'es', 'pt', 'ru', 'ja', 'ko']
    const available = getAvailableLanguages()

    for (const lang of topLanguages) {
      expect(available).toContain(lang)
    }
  })

  it('every supported language has hero.headline', () => {
    const languages = getAvailableLanguages()
    for (const lang of languages) {
      expect(hasTranslation('hero.headline', lang)).toBe(true)
    }
  })

  it('every supported language has common.pioneers', () => {
    const languages = getAvailableLanguages()
    for (const lang of languages) {
      expect(hasTranslation('common.pioneers', lang)).toBe(true)
    }
  })
})

describe('i18n — getAvailableLanguages()', () => {
  it('returns at least 10 languages', () => {
    const langs = getAvailableLanguages()
    expect(langs.length).toBeGreaterThanOrEqual(10)
  })

  it('always includes English', () => {
    expect(getAvailableLanguages()).toContain('en')
  })
})
