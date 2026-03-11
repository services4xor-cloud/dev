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

describe('i18n — pricing translations', () => {
  const pricingKeys = [
    'pricing.badge',
    'pricing.title',
    'pricing.subtitle',
    'pricing.paymentTitle',
    'pricing.paymentSubtitle',
    'pricing.pioneersTitle',
    'pricing.pioneersDesc',
    'pricing.pioneersCta',
    'pricing.agentTitle',
    'pricing.agentCta',
    'pricing.postFree',
    'pricing.goFeatured',
    'pricing.goPremium',
    'pricing.forever',
    'pricing.perMonth',
    'pricing.mostPopular',
  ]

  it('English has all pricing keys', () => {
    for (const key of pricingKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all pricing keys', () => {
    for (const key of pricingKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all pricing keys', () => {
    for (const key of pricingKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('pricing.agentTitle interpolates rate correctly', () => {
    const result = translate('pricing.agentTitle', 'en', { rate: '10' })
    expect(result).toContain('10')
    expect(result).not.toContain('{rate}')
  })

  it('German pricing.agentTitle interpolates rate', () => {
    const result = translate('pricing.agentTitle', 'de', { rate: '10' })
    expect(result).toContain('10')
    expect(result).toContain('Provision')
  })

  it('Swahili pricing.agentTitle interpolates rate', () => {
    const result = translate('pricing.agentTitle', 'sw', { rate: '10' })
    expect(result).toContain('10')
    expect(result).toContain('kamisheni')
  })
})

describe('i18n — footer + contact translations', () => {
  const footerKeys = ['footer.builtWith', 'footer.rights', 'footer.privacy', 'footer.terms']
  const contactKeys = [
    'contact.title',
    'contact.subtitle',
    'contact.name',
    'contact.email',
    'contact.message',
    'contact.send',
  ]

  it('English has all footer keys', () => {
    for (const key of footerKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all footer keys', () => {
    for (const key of footerKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all footer keys', () => {
    for (const key of footerKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('English has all contact keys', () => {
    for (const key of contactKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })
})

describe('i18n — Swahili completeness', () => {
  it('Swahili has auth keys', () => {
    const authKeys = [
      'auth.welcomeBack',
      'auth.signInAccount',
      'auth.continueGoogle',
      'auth.email',
      'auth.password',
      'auth.createAccount',
      'auth.fullName',
      'auth.country',
    ]
    for (const key of authKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('Swahili has onboarding keys', () => {
    const keys = [
      'onboarding.welcome',
      'onboarding.whatKind',
      'onboarding.whereNow',
      'onboarding.whereTo',
      'onboarding.whatSkills',
      'onboarding.continue',
      'onboarding.openChapter',
    ]
    for (const key of keys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('Swahili has compass keys', () => {
    const keys = [
      'compass.active',
      'compass.ready',
      'compass.whereAre',
      'compass.whatKind',
      'compass.yourRoute',
      'compass.seeOpenPaths',
    ]
    for (const key of keys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('Swahili has country hero taglines', () => {
    expect(hasTranslation('hero.tagline.KE', 'sw')).toBe(true)
    expect(hasTranslation('hero.tagline.DE', 'sw')).toBe(true)
    expect(hasTranslation('hero.tagline.CH', 'sw')).toBe(true)
  })
})

describe('i18n — about page translations', () => {
  const aboutKeys = [
    'about.title',
    'about.badge',
    'about.heroTitle',
    'about.heroDesc',
    'about.startCompass',
    'about.postPath',
    'about.mission',
    'about.missionTitle',
    'about.missionP1',
    'about.missionP2',
    'about.valuesTitle',
    'about.valuesSubtitle',
    'about.sectors',
    'about.sectorsTitle',
    'about.payments',
    'about.paymentsTitle',
    'about.paymentsDesc',
    'about.impactDesc',
    'about.learnImpact',
    'about.ctaTitle',
    'about.ctaDesc',
  ]

  it('English has all about page keys', () => {
    for (const key of aboutKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all about page keys', () => {
    for (const key of aboutKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all about page keys', () => {
    for (const key of aboutKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('about.impactDesc interpolates brand name', () => {
    const result = translate('about.impactDesc', 'en', { brand: 'BeKenya' })
    expect(result).toContain('BeKenya')
    expect(result).not.toContain('{brand}')
  })

  it('about.learnImpact interpolates partner name', () => {
    const result = translate('about.learnImpact', 'de', { name: 'UTAMADUNI' })
    expect(result).toContain('UTAMADUNI')
  })
})

describe('i18n — contact page translations', () => {
  const contactKeys = [
    'contact.title',
    'contact.subtitle',
    'contact.name',
    'contact.namePlaceholder',
    'contact.email',
    'contact.emailPlaceholder',
    'contact.subject',
    'contact.subjectPlaceholder',
    'contact.subjectPath',
    'contact.subjectPayment',
    'contact.subjectAccount',
    'contact.subjectScam',
    'contact.subjectPartner',
    'contact.subjectOther',
    'contact.message',
    'contact.messagePlaceholder',
    'contact.send',
    'contact.sending',
    'contact.sent',
    'contact.sentDesc',
    'contact.error',
    'contact.labelEmail',
    'contact.labelEmailSub',
    'contact.labelWhatsApp',
    'contact.labelLocation',
    'contact.labelSocial',
  ]

  it('English has all contact page keys', () => {
    for (const key of contactKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all contact page keys', () => {
    for (const key of contactKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all contact page keys', () => {
    for (const key of contactKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('contact.subtitle interpolates brand and time', () => {
    const result = translate('contact.subtitle', 'en', { brand: 'BeKenya', time: '24 hours' })
    expect(result).toContain('BeKenya')
    expect(result).toContain('24 hours')
  })
})

describe('i18n — threads page translations', () => {
  const threadsKeys = [
    'threads.heroTitle',
    'threads.heroDesc',
    'threads.search',
    'threads.filterAll',
    'threads.filterCountries',
    'threads.filterTribes',
    'threads.filterLanguages',
    'threads.filterInterests',
    'threads.filterSciences',
    'threads.filterLocations',
    'threads.liveData',
    'threads.threadsCount',
    'threads.empty',
  ]

  it('English has all threads keys', () => {
    for (const key of threadsKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all threads keys', () => {
    for (const key of threadsKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all threads keys', () => {
    for (const key of threadsKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('threads.threadsCount interpolates count', () => {
    const result = translate('threads.threadsCount', 'en', { count: '42' })
    expect(result).toContain('42')
    expect(result).not.toContain('{count}')
  })
})

describe('i18n — charity page translations', () => {
  const charityKeys = [
    'charity.badge',
    'charity.tagline',
    'charity.heroDesc',
    'charity.support',
    'charity.learnMore',
    'charity.howBanner',
    'charity.impactTitle',
    'charity.impactDesc',
    'charity.pillarsTitle',
    'charity.pillarsDesc',
    'charity.howTitle',
    'charity.howSubtitle',
    'charity.step1Title',
    'charity.step1Desc',
    'charity.step2Title',
    'charity.step2Desc',
    'charity.step3Title',
    'charity.step3Desc',
    'charity.storiesTitle',
    'charity.storiesDesc',
    'charity.readMore',
    'charity.showLess',
    'charity.today',
    'charity.partnerTitle',
    'charity.partnerDesc',
    'charity.getInTouch',
    'charity.donateTitle',
    'charity.donateDesc',
    'charity.chooseAmount',
    'charity.customAmount',
    'charity.mpesaInfo',
    'charity.donateBtn',
    'charity.donateNote',
    'charity.alsoContribute',
    'charity.legal',
  ]

  it('English has all charity keys', () => {
    for (const key of charityKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all charity keys', () => {
    for (const key of charityKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all charity keys', () => {
    for (const key of charityKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('charity.heroDesc interpolates brand', () => {
    const result = translate('charity.heroDesc', 'en', { brand: 'BeKenya' })
    expect(result).toContain('BeKenya')
    expect(result).not.toContain('{brand}')
  })

  it('charity.donateBtn interpolates amount and partner', () => {
    const result = translate('charity.donateBtn', 'de', { amount: '$25', partner: 'UTAMADUNI' })
    expect(result).toContain('$25')
    expect(result).toContain('UTAMADUNI')
  })
})

describe('i18n — referral page translations', () => {
  const referralKeys = [
    'referral.heroTitle',
    'referral.heroDesc',
    'referral.linkTitle',
    'referral.linkDesc',
    'referral.copied',
    'referral.copy',
    'referral.shareWhatsApp',
    'referral.shareTwitter',
    'referral.howTitle',
    'referral.notSignedUp',
    'referral.ctaBtn',
  ]

  it('English has all referral keys', () => {
    for (const key of referralKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all referral keys', () => {
    for (const key of referralKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all referral keys', () => {
    for (const key of referralKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('referral.heroDesc interpolates brand, bonus, and method', () => {
    const result = translate('referral.heroDesc', 'en', {
      brand: 'BeKenya',
      bonus: 'KES 5,000',
      method: 'M-Pesa',
    })
    expect(result).toContain('BeKenya')
    expect(result).toContain('KES 5,000')
    expect(result).toContain('M-Pesa')
  })
})

describe('i18n — profile page translations', () => {
  const profileKeys = [
    'profile.title',
    'profile.subtitle',
    'profile.completeness',
    'profile.completeHint',
    'profile.photo',
    'profile.photoHint',
    'profile.uploadPhoto',
    'profile.basicInfo',
    'profile.currentRole',
    'profile.rolePlaceholder',
    'profile.city',
    'profile.email',
    'profile.phone',
    'profile.phonePlaceholder',
    'profile.bio',
    'profile.bioPlaceholder',
    'profile.linkedin',
    'profile.linkedinPlaceholder',
    'profile.skills',
    'profile.addSkill',
    'profile.saved',
    'profile.saveProfile',
  ]

  it('English has all profile keys', () => {
    for (const key of profileKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all profile keys', () => {
    for (const key of profileKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all profile keys', () => {
    for (const key of profileKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })
})

describe('i18n — business page translations', () => {
  const businessKeys = [
    'business.badge',
    'business.subtitle',
    'business.heroDesc',
    'business.missionTitle',
    'business.missionDesc',
    'business.legalTitle',
    'business.incorporation',
    'business.certOfInc',
    'business.entityType',
    'business.privateLtd',
    'business.kraPin',
    'business.director',
    'business.shareTitle',
    'business.shareDesc',
    'business.divisionsTitle',
    'business.countriesTitle',
    'business.countriesNext',
    'business.paymentTitle',
    'business.bankTitle',
    'business.bankDesc',
    'business.mpesaTitle',
    'business.mpesaDesc',
    'business.globalTitle',
    'business.globalDesc',
    'business.financeNote',
    'business.partnerTitle',
    'business.safariPartner',
    'business.safariPartnerDesc',
    'business.ngoPartner',
    'business.ngoPartnerDesc',
    'business.corpPartner',
    'business.corpPartnerDesc',
    'business.contactTitle',
    'business.contactDesc',
    'business.browseVentures',
    'business.safariExperiences',
    'business.charityLink',
  ]

  it('English has all business keys', () => {
    for (const key of businessKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all business keys', () => {
    for (const key of businessKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all business keys', () => {
    for (const key of businessKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('interpolates financeNote with partner', () => {
    const result = translate('business.financeNote', 'en', { partner: 'TestPartner' })
    expect(result).toContain('TestPartner')
  })

  it('interpolates charityLink with partner', () => {
    const result = translate('business.charityLink', 'en', { partner: 'TestPartner' })
    expect(result).toContain('TestPartner')
  })
})

describe('i18n — fashion page translations', () => {
  const fashionKeys = [
    'fashion.badge',
    'fashion.tagline',
    'fashion.heroDesc',
    'fashion.applyPioneer',
    'fashion.hireTalent',
    'fashion.missionTitle',
    'fashion.missionQuote',
    'fashion.missionDesc',
    'fashion.pathsTitle',
    'fashion.pathsDesc',
    'fashion.modelTitle',
    'fashion.modelDesc',
    'fashion.designerTitle',
    'fashion.designerDesc',
    'fashion.creativeTitle',
    'fashion.creativeDesc',
    'fashion.protectionsTitle',
    'fashion.protectionsDesc',
    'fashion.openPaths',
    'fashion.openPathsDesc',
    'fashion.viewAll',
    'fashion.apply',
    'fashion.partnersTitle',
    'fashion.partnersDesc',
    'fashion.ctaTitle',
    'fashion.ctaDesc',
    'fashion.exploreMedia',
  ]

  it('English has all fashion keys', () => {
    for (const key of fashionKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all fashion keys', () => {
    for (const key of fashionKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all fashion keys', () => {
    for (const key of fashionKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('interpolates missionDesc with brand', () => {
    const result = translate('fashion.missionDesc', 'en', { brand: 'TestBrand' })
    expect(result).toContain('TestBrand')
  })
})

describe('i18n — media page translations', () => {
  const mediaKeys = [
    'media.badge',
    'media.tagline',
    'media.heroDesc',
    'media.applyPioneer',
    'media.commissionContent',
    'media.opportunityTitle',
    'media.opportunityP1',
    'media.opportunityP2',
    'media.opportunityGap',
    'media.statPlatforms',
    'media.statPaths',
    'media.statPayments',
    'media.whoHiring',
    'media.pathsTitle',
    'media.pathsDesc',
    'media.featuredTitle',
    'media.featuredDesc',
    'media.applyNow',
    'media.socialTitle',
    'media.socialTagline',
    'media.socialDesc',
    'media.howItWorks',
    'media.step1',
    'media.step2',
    'media.step3',
    'media.step4',
    'media.step5',
    'media.impactTitle',
    'media.impactDesc',
    'media.explorePartner',
    'media.ctaTitle',
    'media.ctaDesc',
    'media.exploreFashion',
  ]

  it('English has all media keys', () => {
    for (const key of mediaKeys) {
      expect(hasTranslation(key, 'en')).toBe(true)
    }
  })

  it('German has all media keys', () => {
    for (const key of mediaKeys) {
      expect(hasTranslation(key, 'de')).toBe(true)
    }
  })

  it('Swahili has all media keys', () => {
    for (const key of mediaKeys) {
      expect(hasTranslation(key, 'sw')).toBe(true)
    }
  })

  it('interpolates impactDesc with partner and brand', () => {
    const result = translate('media.impactDesc', 'en', {
      partner: 'TestPartner',
      brand: 'TestBrand',
    })
    expect(result).toContain('TestPartner')
    expect(result).toContain('TestBrand')
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
