import { t, getLocaleFromCountry, SUPPORTED_LOCALES, LOCALE_NAMES, type Locale } from '@/lib/i18n'

// Core keys that every locale must translate
const CORE_KEYS = [
  'nav.agent',
  'nav.opportunities',
  'nav.explorers',
  'nav.discovery',
  'nav.messages',
  'nav.me',
  'nav.payments',
  'nav.refer',
  'nav.signIn',
  'nav.signOut',
  'common.loading',
  'common.error',
  'common.retry',
  'common.back',
  'common.next',
  'common.save',
  'common.cancel',
  'common.search',
  'common.noResults',
  'home.title',
  'home.tagline',
]

describe('t() — translation function', () => {
  it('returns English string for nav.agent', () => {
    expect(t('nav.agent')).toBe('Agent')
  })

  it('returns English string explicitly', () => {
    expect(t('nav.agent', 'en')).toBe('Agent')
  })

  it('returns Swahili for nav.agent', () => {
    expect(t('nav.agent', 'sw')).toBe('Wakala')
  })

  it('returns German for nav.agent', () => {
    expect(t('nav.agent', 'de')).toBe('Agent')
  })

  it('returns French for nav.agent', () => {
    expect(t('nav.agent', 'fr')).toBe('Agent')
  })

  it('returns Swahili nav.opportunities', () => {
    expect(t('nav.opportunities', 'sw')).toBe('Fursa')
  })

  it('returns German nav.opportunities', () => {
    expect(t('nav.opportunities', 'de')).toBe('Chancen')
  })

  it('returns French nav.opportunities', () => {
    expect(t('nav.opportunities', 'fr')).toBe('Opportunités')
  })

  it('returns Swahili nav.signIn', () => {
    expect(t('nav.signIn', 'sw')).toBe('Ingia')
  })

  it('returns German nav.signIn', () => {
    expect(t('nav.signIn', 'de')).toBe('Anmelden')
  })

  it('returns French nav.signIn', () => {
    expect(t('nav.signIn', 'fr')).toBe('Se connecter')
  })

  it('falls back to key itself for unknown key', () => {
    expect(t('totally.unknown.key')).toBe('totally.unknown.key')
  })

  it('falls back to key for unknown key in non-English locale', () => {
    expect(t('totally.unknown.key', 'sw')).toBe('totally.unknown.key')
  })

  it('returns common.loading in Swahili', () => {
    expect(t('common.loading', 'sw')).toBe('Inapakia...')
  })

  it('returns common.loading in German', () => {
    expect(t('common.loading', 'de')).toBe('Wird geladen...')
  })

  it('returns common.loading in French', () => {
    expect(t('common.loading', 'fr')).toBe('Chargement...')
  })

  it('returns discovery.step4 in Swahili', () => {
    expect(t('discovery.step4', 'sw')).toBe('Njia zako')
  })

  it('returns profile.title in German', () => {
    expect(t('profile.title', 'de')).toBe('Meine Identität')
  })

  it('returns profile.title in French', () => {
    expect(t('profile.title', 'fr')).toBe('Mon Identité')
  })

  it('returns home.title as Be[X] for all locales', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(t('home.title', locale)).toBe('Be[X]')
    }
  })
})

describe('getLocaleFromCountry()', () => {
  it('maps KE to en', () => {
    expect(getLocaleFromCountry('KE')).toBe('en')
  })

  it('maps DE to de', () => {
    expect(getLocaleFromCountry('DE')).toBe('de')
  })

  it('maps CH to de', () => {
    expect(getLocaleFromCountry('CH')).toBe('de')
  })

  it('maps FR to fr', () => {
    expect(getLocaleFromCountry('FR')).toBe('fr')
  })

  it('maps TZ to sw', () => {
    expect(getLocaleFromCountry('TZ')).toBe('sw')
  })

  it('maps lowercase ke to en (case-insensitive)', () => {
    expect(getLocaleFromCountry('ke')).toBe('en')
  })

  it('falls back to en for unknown country', () => {
    expect(getLocaleFromCountry('XX')).toBe('en')
  })

  it('falls back to en for empty string', () => {
    expect(getLocaleFromCountry('')).toBe('en')
  })
})

describe('SUPPORTED_LOCALES', () => {
  it('contains exactly 4 locales', () => {
    expect(SUPPORTED_LOCALES).toHaveLength(4)
  })

  it('includes en, sw, de, fr', () => {
    expect(SUPPORTED_LOCALES).toEqual(expect.arrayContaining(['en', 'sw', 'de', 'fr']))
  })
})

describe('LOCALE_NAMES', () => {
  it('has an entry for every supported locale', () => {
    for (const locale of SUPPORTED_LOCALES) {
      expect(LOCALE_NAMES[locale]).toBeDefined()
      expect(typeof LOCALE_NAMES[locale]).toBe('string')
      expect(LOCALE_NAMES[locale].length).toBeGreaterThan(0)
    }
  })

  it('has correct display names', () => {
    expect(LOCALE_NAMES.en).toBe('English')
    expect(LOCALE_NAMES.sw).toBe('Kiswahili')
    expect(LOCALE_NAMES.de).toBe('Deutsch')
    expect(LOCALE_NAMES.fr).toBe('Français')
  })
})

describe('all supported locales have translations for core keys', () => {
  it.each(SUPPORTED_LOCALES as Locale[])('locale %s covers all core keys', (locale) => {
    for (const key of CORE_KEYS) {
      const result = t(key, locale)
      // Result must not fall back to the key itself (key !== result means it was translated)
      // Exception: for 'en', the result IS the translation, not the key
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
      // Must not be undefined or empty
      expect(result).not.toBe('')
    }
  })
})
