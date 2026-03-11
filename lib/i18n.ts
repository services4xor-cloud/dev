/**
 * i18n Content Mask — Language-aware UI text
 *
 * Provides translated UI strings based on the active identity language.
 * Works alongside the identity context: when language changes, all UI text updates.
 *
 * Architecture:
 *   - Content dictionary keyed by language code (ISO 639-1)
 *   - English is the fallback for any missing translation
 *   - useTranslation() hook reads identity.language and returns t() function
 *   - Scales by adding language columns, not separate files
 *
 * Usage:
 *   const { t } = useTranslation()
 *   <h1>{t('hero.headline')}</h1>
 *   <p>{t('hero.subtitle', { brandName: 'BeKenya' })}</p>
 */

// ─── Content Dictionary ──────────────────────────────────────────────

type ContentKey = string
type ContentDict = Record<ContentKey, string>

/**
 * All UI content strings, keyed by language code.
 * English ('en') is the master — every key must exist in 'en'.
 * Other languages only need to override what differs.
 */
const CONTENT: Record<string, ContentDict> = {
  // ─── English (master / fallback) ────────────────────────────
  en: {
    // Navigation
    'nav.startCompass': 'Start Compass',
    'nav.signIn': 'Sign In',
    'nav.browseThreads': 'Browse all threads →',
    'nav.switchIdentity': 'Click to switch identity',
    'nav.oneIdentity': 'One platform, every identity',
    'nav.location': 'Location',
    'nav.language': 'Language',
    'nav.nearby': 'Relevant',

    // Hero
    'hero.greeting': "We see you're in {geoName}. {geoGreeting}",
    'hero.readyChapter': 'Ready for your next chapter?',
    'hero.headline': 'Find where you',
    'hero.belong': 'belong.',
    'hero.goThere': 'Go there.',
    'hero.subtitle':
      "{brandName} is not a job board. It's a compass — for Pioneers who want to move, grow, and belong somewhere extraordinary.",
    'hero.startCompass': 'Start My Compass',
    'hero.browseVentures': 'Browse Ventures',
    'hero.pioneersTrust': 'Pioneers active today',
    'hero.everyBooking': '{amount} from every booking',
    'hero.fundsCommunity': 'funds {partner} community work',

    // BeNetwork section
    'network.label': 'The BeNetwork',
    'network.headline': 'Three kinds of people. One network.',
    'network.subtitle':
      'No jargon. No CVs rotting in inboxes. Just Pioneers, Anchors, and Explorers — finding each other.',

    // Compass CTA
    'compass.headline': 'Where do you want to go?',
    'compass.subtitle':
      "Tell us your journey in 3 quick steps. We'll match you with Paths, Anchors, and communities — anywhere in the world.",
    'compass.step1': 'Choose destinations',
    'compass.step2': 'Confirm origin',
    'compass.step3': 'Your Pioneer type',
    'compass.originHint': "We'll start with {country} as your origin",

    // Experiences
    'experiences.label': '{country} Experiences',
    'experiences.headline': '{country} waits for no one. Neither should you.',
    'experiences.subtitle': 'Signature experiences curated by {brandName}.',
    'experiences.book': 'Book This Venture →',

    // Impact partner
    'impact.headline': 'Every venture supports {partner}',
    'impact.contribution': '{amount} from every booking. Automatically. Always.',
    'impact.learnMore': 'Learn about {partner} →',

    // Expansion
    'expansion.headline': '{brandName} is just the beginning.',
    'expansion.subtitle': 'Same mission. Every country. Every community.',
    'expansion.live': 'Live now',
    'expansion.coming': 'Coming soon',
    'expansion.more': 'More coming',
    'expansion.every': 'Every country',

    // Anchors
    'anchors.label': 'For Organizations',
    'anchors.headline': 'Are you an Anchor?',
    'anchors.subtitle':
      'Organizations that open paths for Pioneers. Safari lodges, tech companies, NGOs, hospitals — any Anchor that believes real talent changes everything.',
    'anchors.postPath': 'Post a Path →',
    'anchors.howItWorks': 'See How It Works',

    // Testimonials
    'testimonials.label': 'Pioneer Stories',
    'testimonials.headline': 'Real journeys. Real chapters.',

    // Payments
    'payments.label': 'Pay with what you know',
    'payments.secure': 'All transactions are secure and transparent',

    // Nav sections
    'nav.explore': 'Explore',
    'nav.forAnchors': 'For Anchors',
    'nav.about': 'About',
    'nav.startMyCompass': 'Start My Compass',
    'nav.pioneer': 'Pioneer',

    // Auth
    'auth.welcomeBack': 'Welcome back',
    'auth.signInAccount': 'Sign in to your account',
    'auth.continueGoogle': 'Continue with Google',
    'auth.connectingGoogle': 'Connecting to Google...',
    'auth.orSignInEmail': 'or sign in with email',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.forgotPassword': 'Forgot password?',
    'auth.signingIn': 'Signing in...',
    'auth.newTo': 'New to {brandName}?',
    'auth.createFreeAccount': 'Create free account →',
    'auth.createAccount': 'Create your account',
    'auth.freeForever': 'Free forever. No credit card needed.',
    'auth.iAmA': 'I am a...',
    'auth.findMyPath': 'Find my path',
    'auth.openPathsTalent': 'Open Paths for talent',
    'auth.continueAs': 'Continue as {role} →',
    'auth.back': '← Back',
    'auth.orFillDetails': 'or fill in your details',
    'auth.fullName': 'Full Name',
    'auth.country': 'Country',
    'auth.phoneOptional': 'Phone (M-Pesa) — optional',
    'auth.minChars': 'Min. 8 characters',
    'auth.creatingAccount': 'Creating account...',
    'auth.createAccountFree': 'Create Account — Free',
    'auth.agreePrivacy': 'By signing up you agree to our Privacy Policy',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.signInLink': 'Sign in →',
    'auth.emailExists': 'This email is already registered with a different method.',
    'auth.somethingWrong': 'Something went wrong. Please try again.',
    'auth.errorOAuth': 'Could not start Google sign-in. Please try again.',
    'auth.errorOAuthCallback': 'Google sign-in failed. Try again or use email.',
    'auth.errorCredentials': 'Invalid email or password. Please check and try again.',
    'auth.errorSession': 'Please sign in to continue.',

    // Ventures page
    'ventures.allVentures': 'All Ventures',
    'ventures.explorer': 'Explorer',
    'ventures.professional': 'Professional',
    'ventures.creative': 'Creative',
    'ventures.community': 'Community',
    'ventures.explorerDesc': 'Safaris & eco-tourism',
    'ventures.professionalDesc': 'Tech, finance, healthcare',
    'ventures.creativeDesc': 'Art, media, fashion',
    'ventures.communityDesc': 'NGOs, teaching, volunteering',
    'ventures.curatedForRoute': 'Curated for your route',
    'ventures.openPaths': 'Open Paths.',
    'ventures.realVentures': 'Real Ventures.',
    'ventures.chapterStarts': 'Your Chapter Starts Here.',
    'ventures.showAll': 'Show all ventures',
    'ventures.seeAll': 'See all',
    'ventures.noMatch': 'No Paths match this filter yet',
    'ventures.noMatchHint': 'New paths are added every day. Check back or try another category.',
    'ventures.areYouAnchor': 'Are you an Anchor?',
    'ventures.anchorCta':
      'Post a Path and reach 12,000+ Pioneers across 50+ countries. Local payment rails included.',
    'ventures.postPath': 'Post a Path →',
    'ventures.featured': 'Featured',
    'ventures.remote': 'Remote',
    'ventures.pioneersNeeded': '{count} Pioneer{s} needed',
    'ventures.available': '{count} available',
    'ventures.perPerson': '/ person',
    'ventures.highSeason': 'High Season',
    'ventures.explorerVentures': 'Explorer Ventures',
    'ventures.featuredPaths': 'Featured Paths',
    'ventures.open': '{count} open',

    // Onboarding
    'onboarding.step': 'Step {step} of {total}',
    'onboarding.complete': '% complete',
    'onboarding.welcome': 'Welcome to the BeNetwork, Pioneer!',
    'onboarding.profileReady': "Your profile is ready. We're finding the best Paths for you...",
    'onboarding.takingYou': 'Taking you to your Ventures...',
    'onboarding.network': 'Network',
    'onboarding.whatKind': 'What kind of Pioneer are you?',
    'onboarding.pickOne': 'Pick the one that feels most like you. You can always refine later.',
    'onboarding.whereNow': 'Where are you right now?',
    'onboarding.weThink': "We think you're in {country}. Correct?",
    'onboarding.helpsRoutes': 'This helps us find the best routes for your journey.',
    'onboarding.selectCountry': 'Select your country...',
    'onboarding.other': '🌍 Other',
    'onboarding.calibrated': 'Got it — your profile will be calibrated for {country}.',
    'onboarding.whereTo': 'Where do you want to go?',
    'onboarding.selectDestinations':
      "Select one or more destinations. We'll prioritize Paths in these locations.",
    'onboarding.destinationsSelected': '{count} destination{s} selected',
    'onboarding.whatSkills': 'What skills do you bring?',
    'onboarding.selectSkills': 'Select at least 3 skills. These power your match score.',
    'onboarding.moreNeeded': '{count} more needed to continue',
    'onboarding.skillsSelected': '{count} skills selected — great! Add more for better matches.',
    'onboarding.customSkills': 'Your custom skills',
    'onboarding.addSkill': 'Add your own skill...',
    'onboarding.add': 'Add',
    'onboarding.chapterTitle': 'Tell us your chapter title',
    'onboarding.headlineFirst': 'Your headline is the first thing Anchors see. Make it yours.',
    'onboarding.yourHeadline': 'Your headline *',
    'onboarding.headlinePlaceholder':
      'e.g. Safari Guide with 5 years experience | Swahili & English',
    'onboarding.charLimit': '/ 120 characters',
    'onboarding.whatMakesYou': 'What makes you, you? (optional)',
    'onboarding.shortStory': 'A short story about your journey, your passion, what drives you...',
    'onboarding.whatsapp': 'WhatsApp number',
    'onboarding.whatsappOptional': '(optional — get notified about matches)',
    'onboarding.whatsappHint':
      "Include country code. We'll send WhatsApp alerts for new Path matches.",
    'onboarding.tryAgain': 'Something went wrong — please try again.',
    'onboarding.continue': 'Continue →',
    'onboarding.openChapter': 'Open My First Chapter',
    'onboarding.openingChapter': 'Opening your chapter...',

    // Compass page
    'compass.active': 'Your Compass is active',
    'compass.ready': 'Your Compass is ready.',
    'compass.letsFind': "Let's find your path.",
    'compass.stepOf': 'Step {step} of {total}',
    'compass.whereAre': 'Where are you currently based?',
    'compass.currentlyIn': 'Currently in {name}',
    'compass.autoDetected': 'Auto-detected · tap to change',
    'compass.change': 'Change',
    'compass.locationHint':
      'We use your location to find the strongest routes and payment corridors.',
    'compass.confirmed': 'Confirmed — {name} →',
    'compass.whatKind': 'What kind of Pioneer are you?',
    'compass.yourRoute': 'Your Route',
    'compass.alsoExploring': 'Also exploring:',
    'compass.visaRoute': 'Visa Route',
    'compass.payments': 'Payments',
    'compass.topSectors': 'Top Sectors',
    'compass.navigateDifferent': '← Navigate a different route',
    'compass.stepLabel1': 'Destinations',
    'compass.stepLabel2': 'Your Origin',
    'compass.stepLabel3': 'Pioneer Type',
    'compass.stepLabel4': 'Your Route',
    'compass.seeOpenPaths': 'See Open Paths →',
    'compass.selectPioneerType': 'Select your Pioneer type',
    'compass.back': '← Back',
    'compass.pioneer': 'Pioneer',

    // Country-specific hero
    'hero.tagline.KE': 'Global Paths, Paid via M-Pesa',
    'hero.tagline.DE': 'Your Path to Germany',
    'hero.tagline.CH': 'Your Path to Switzerland',

    // Common
    'common.pioneers': 'pioneers',
    'common.active': 'Active',
    'common.home': 'Home',
    'common.back': 'Back',
    'common.loading': 'Loading...',
    'common.signIn': 'Sign In',
    'common.signOut': 'Sign Out',
    'common.anchor': 'Anchor',

    // Pricing page
    'pricing.badge': 'Pay from anywhere — M-Pesa, SEPA, card, or mobile money',
    'pricing.title': 'Simple, transparent pricing',
    'pricing.subtitle':
      'Pioneers browse and apply for free. Anchors post Paths starting at zero cost. Scale when you need to.',
    'pricing.paymentTitle': 'Pay from anywhere in the world',
    'pricing.paymentSubtitle': 'We accept every major payment method so no one is excluded',
    'pricing.pioneersTitle': 'Pioneers — always free',
    'pricing.pioneersDesc':
      'Creating a profile, opening Chapters, and getting placed is completely free for Pioneers. Always.',
    'pricing.pioneersCta': 'Create Free Profile →',
    'pricing.agentTitle': 'Agents earn {rate}% commission',
    'pricing.agentDesc':
      'Forward Paths to your network via WhatsApp. When a Pioneer gets placed through your referral, you earn {rate}% of the placement fee. No cap on earnings.',
    'pricing.agentCta': 'Become an Agent →',
    'pricing.postFree': 'Post for Free',
    'pricing.goFeatured': 'Go Featured',
    'pricing.goPremium': 'Go Premium',
    'pricing.forever': 'forever',
    'pricing.perMonth': 'per month',
    'pricing.mostPopular': 'MOST POPULAR',

    // About page
    'about.title': 'About BeNetwork',
    'about.badge': 'Identity-first life-routing platform',
    'about.heroTitle': 'Work should be for {accent}everyone.{/accent}',
    'about.heroDesc':
      'BeNetwork reverses colonial economic flows through open trade, fair compensation, and direct country-to-country connections. No intermediaries. No gatekeepers.',
    'about.startCompass': 'Start My Compass',
    'about.postPath': 'Post a Path',
    'about.mission': 'Our Mission',
    'about.missionTitle': 'Reverse the flow. {accent}Build the corridor.{/accent}',
    'about.missionDesc':
      'BeNetwork reverses colonial economic flows. People in the Global South move, work, and thrive on their own terms.',
    'about.missionP1':
      'For centuries, value has flowed one way — out of Africa, out of the Global South, into the hands of intermediaries and gatekeepers. BeNetwork is the corridor in the opposite direction.',
    'about.missionP2':
      'We connect Pioneers directly with Anchors across 50+ countries. Payments flow through M-Pesa, Flutterwave, and local rails — not through foreign banks. Routes are built on real visa corridors, not wishful thinking.',
    'about.howItWorks': 'How It Works',
    'about.values': 'Our Values',
    'about.valuesTitle': 'Values that guide every path',
    'about.valuesSubtitle': 'What We Stand For',
    'about.team': 'Our Team',
    'about.sectors': 'Industries',
    'about.sectorsTitle': 'Paths across every sector',
    'about.payments': 'Payment Rails',
    'about.paymentsTitle': 'Money flows where you do',
    'about.paymentsDesc':
      'We support local payment methods across every corridor — so your income arrives in your hands.',
    'about.impactDesc':
      'Our community arm. Supporting conservation workers, local guides, and cultural educators across East Africa. Every booking through {brand} contributes.',
    'about.learnImpact': 'Learn about {name}',
    'about.ctaTitle': 'Ready to find your path?',
    'about.ctaDesc':
      "Start your Compass. Tell us where you are and where you want to go. We'll build your route.",

    // Contact page
    'contact.title': 'Get in Touch',
    'contact.subtitle': 'Questions about {brand}? We respond within {time} on business days.',
    'contact.name': 'Your Name',
    'contact.namePlaceholder': 'Your name',
    'contact.email': 'Your Email',
    'contact.emailPlaceholder': 'you@example.com',
    'contact.subject': 'Subject',
    'contact.subjectPlaceholder': 'Select a topic...',
    'contact.subjectPath': 'Path posting help',
    'contact.subjectPayment': 'Payment issue',
    'contact.subjectAccount': 'Account problem',
    'contact.subjectScam': 'Report a scam',
    'contact.subjectPartner': 'Partnership inquiry',
    'contact.subjectOther': 'Other',
    'contact.message': 'Your Message',
    'contact.messagePlaceholder': 'Tell us how we can help...',
    'contact.send': 'Send Message',
    'contact.sending': 'Sending...',
    'contact.sent': 'Message sent!',
    'contact.sentDesc': "We'll get back to you within 24 hours.",
    'contact.error': 'Something went wrong. Please try again or email us directly.',
    'contact.labelEmail': 'Email',
    'contact.labelEmailSub': 'General enquiries',
    'contact.labelWhatsApp': 'WhatsApp',
    'contact.labelLocation': 'Location',
    'contact.labelSocial': 'Social',

    // Forgot password
    'forgotPassword.backToSignIn': 'Back to Sign In',
    'forgotPassword.title': 'Reset password',
    'forgotPassword.desc': "Enter your email and we'll send you a reset link.",
    'forgotPassword.emailLabel': 'Email address',
    'forgotPassword.sending': 'Sending…',
    'forgotPassword.sendLink': 'Send reset link',
    'forgotPassword.checkEmail': 'Check your email',
    'forgotPassword.sentDesc':
      "If an account exists for {email}, you'll receive a reset link shortly.",
    'forgotPassword.noAccount': "Don't have an account?",
    'forgotPassword.signUpFree': 'Sign up free',

    // Threads
    'threads.heroTitle': 'Be{accent}[You]{/accent}',
    'threads.heroDesc':
      'Find your people. Every identity — country, tribe, language, interest — has a thread. Join communities that move, work, and thrive together.',
    'threads.search': 'Search threads...',
    'threads.filterAll': 'All',
    'threads.filterCountries': 'Countries',
    'threads.filterTribes': 'Tribes',
    'threads.filterLanguages': 'Languages',
    'threads.filterInterests': 'Interests',
    'threads.filterSciences': 'Sciences',
    'threads.filterLocations': 'Locations',
    'threads.liveData': 'Live data',
    'threads.threadsCount': '{count} threads',
    'threads.empty': 'No threads match your search. Try a different term.',

    // Charity
    'charity.badge': 'Community-Based Organization · Registered in Kenya',
    'charity.tagline': 'Swahili for "Culture & Heritage"',
    'charity.heroDesc':
      'The charitable arm of {brand}. Every path opened on our platform contributes to communities, conservation, and culture across Kenya.',
    'charity.support': 'Support {partner}',
    'charity.learnMore': 'Learn what we do →',
    'charity.howBanner':
      'When you book a Venture or open a Path on {brand}, {accent}a percentage flows to {partner}{/accent} — funding real programs in real communities. No middlemen. Full transparency.',
    'charity.impactTitle': 'Our Impact So Far',
    'charity.impactDesc': 'Aspirational targets for our first programme cycle',
    'charity.pillarsTitle': 'Our Four Pillars',
    'charity.pillarsDesc':
      'Everything we do is built on these foundations — because dignified lives require education, safety, a healthy planet, and cultural pride.',
    'charity.howTitle': 'How It Works',
    'charity.howSubtitle': 'The {brand} circle of dignified work',
    'charity.step1Title': 'Pioneers Book Ventures',
    'charity.step1Desc':
      'Every safari, eco-lodge stay, or professional path opened on {brand} generates value in the ecosystem.',
    'charity.step2Title': 'Portion Goes to {partner}',
    'charity.step2Desc':
      'A transparent percentage of each transaction is allocated to {partner} programs — automatically.',
    'charity.step3Title': 'Communities Thrive',
    'charity.step3Desc':
      "Funds go directly to skills training, conservation support, and women's empowerment in Kenyan communities.",
    'charity.storiesTitle': 'Stories from the Field',
    'charity.storiesDesc': 'Real lives. Real change. Names used with permission.',
    'charity.readMore': 'Read full story →',
    'charity.showLess': 'Show less',
    'charity.today': 'Today',
    'charity.partnerTitle': 'Partner With {partner}',
    'charity.partnerDesc':
      'We welcome partnerships with organisations who share our belief in dignified work, community development, and conservation.',
    'charity.getInTouch': 'Get in Touch →',
    'charity.donateTitle': 'Support {partner}',
    'charity.donateDesc':
      'Every contribution — big or small — builds skills, protects wildlife, and preserves Kenyan culture for generations to come.',
    'charity.chooseAmount': 'Choose amount',
    'charity.customAmount': 'Custom amount',
    'charity.mpesaInfo':
      "Donate via M-Pesa: Paybill {partner} CBO. You'll receive full payment instructions after clicking below.",
    'charity.donateBtn': 'Donate {amount} to {partner}',
    'charity.donateNote':
      'Donations are used directly for community programs. No political affiliations.',
    'charity.alsoContribute':
      'You can also contribute by {link}booking a Venture{/link} on {brand} — a percentage automatically supports {partner}.',
    'charity.legal':
      '{partner} is registered in Kenya as a Community Based Organisation (CBO). Partnered with {company}. All programmes are administered locally with full community involvement and transparent financial reporting.',

    // Referral
    'referral.heroTitle': 'Earn {bonus} per placement',
    'referral.heroDesc':
      'Refer a friend who gets placed through {brand}. We pay you {bonus} via {method} — every time.',
    'referral.linkTitle': 'Your referral link',
    'referral.linkDesc': 'Share this link — every signup counts toward your earnings',
    'referral.copied': 'Copied!',
    'referral.copy': 'Copy',
    'referral.shareWhatsApp': 'Share on WhatsApp',
    'referral.shareTwitter': 'Share on Twitter/X',
    'referral.howTitle': 'How it works',
    'referral.notSignedUp': 'Not signed up yet?',
    'referral.ctaBtn': 'Create Free Account & Start Earning →',

    // Footer
    'footer.builtWith': 'Built with purpose in Nairobi, Berlin, and Zurich',
    'footer.rights': 'All rights reserved',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
  },

  // ─── German (Deutsch) ────────────────────────────────────────
  de: {
    'nav.startCompass': 'Kompass starten',
    'nav.signIn': 'Anmelden',
    'nav.browseThreads': 'Alle Threads durchsuchen →',
    'nav.switchIdentity': 'Klicken um Identität zu wechseln',
    'nav.oneIdentity': 'Eine Plattform, jede Identität',
    'nav.location': 'Standort',
    'nav.language': 'Sprache',
    'nav.nearby': 'Relevant',

    'hero.greeting': 'Wir sehen, du bist in {geoName}. {geoGreeting}',
    'hero.readyChapter': 'Bereit für dein nächstes Kapitel?',
    'hero.headline': 'Finde wo du',
    'hero.belong': 'hingehörst.',
    'hero.goThere': 'Geh dorthin.',
    'hero.subtitle':
      '{brandName} ist keine Jobbörse. Es ist ein Kompass — für Pioniere, die umziehen, wachsen und irgendwo Außergewöhnliches dazugehören wollen.',
    'hero.startCompass': 'Meinen Kompass starten',
    'hero.browseVentures': 'Ventures durchsuchen',
    'hero.pioneersTrust': 'Aktive Pioniere heute',
    'hero.everyBooking': '{amount} von jeder Buchung',
    'hero.fundsCommunity': 'finanziert {partner} Gemeinschaftsarbeit',

    'network.label': 'Das BeNetwork',
    'network.headline': 'Drei Arten von Menschen. Ein Netzwerk.',
    'network.subtitle':
      'Kein Fachjargon. Keine Lebensläufe in Postfächern. Nur Pioniere, Anker und Entdecker — die sich finden.',

    'compass.headline': 'Wohin möchtest du?',
    'compass.subtitle':
      'Erzähl uns deine Reise in 3 schnellen Schritten. Wir finden Wege, Anker und Gemeinschaften — überall auf der Welt.',
    'compass.step1': 'Ziele wählen',
    'compass.step2': 'Herkunft bestätigen',
    'compass.step3': 'Dein Pionier-Typ',
    'compass.originHint': 'Wir beginnen mit {country} als Herkunft',

    'experiences.label': '{country} Erlebnisse',
    'experiences.headline': '{country} wartet auf niemanden. Du auch nicht.',
    'experiences.subtitle': 'Signatur-Erlebnisse kuratiert von {brandName}.',
    'experiences.book': 'Dieses Venture buchen →',

    'impact.headline': 'Jedes Venture unterstützt {partner}',
    'impact.contribution': '{amount} von jeder Buchung. Automatisch. Immer.',
    'impact.learnMore': 'Mehr über {partner} erfahren →',

    'expansion.headline': '{brandName} ist erst der Anfang.',
    'expansion.subtitle': 'Gleiche Mission. Jedes Land. Jede Gemeinschaft.',
    'expansion.live': 'Jetzt live',
    'expansion.coming': 'Kommt bald',
    'expansion.more': 'Mehr kommen',
    'expansion.every': 'Jedes Land',

    'anchors.label': 'Für Organisationen',
    'anchors.headline': 'Bist du ein Anker?',
    'anchors.subtitle':
      'Organisationen, die Wege für Pioniere öffnen. Safari-Lodges, Tech-Unternehmen, NGOs, Krankenhäuser — jeder Anker, der glaubt, dass echtes Talent alles verändert.',
    'anchors.postPath': 'Einen Weg posten →',
    'anchors.howItWorks': 'So funktioniert es',

    'testimonials.label': 'Pionier-Geschichten',
    'testimonials.headline': 'Echte Reisen. Echte Kapitel.',

    'payments.label': 'Bezahle mit dem, was du kennst',
    'payments.secure': 'Alle Transaktionen sind sicher und transparent',

    // Country-specific hero
    'hero.tagline.KE': 'Globale Wege, bezahlt via M-Pesa',
    'hero.tagline.DE': 'Dein Weg nach Deutschland',
    'hero.tagline.CH': 'Dein Weg in die Schweiz',

    // Nav sections
    'nav.explore': 'Entdecken',
    'nav.forAnchors': 'Für Anker',
    'nav.about': 'Über uns',
    'nav.startMyCompass': 'Meinen Kompass starten',
    'nav.pioneer': 'Pionier',

    // Auth
    'auth.welcomeBack': 'Willkommen zurück',
    'auth.signInAccount': 'In dein Konto einloggen',
    'auth.continueGoogle': 'Weiter mit Google',
    'auth.connectingGoogle': 'Verbindung zu Google...',
    'auth.orSignInEmail': 'oder mit E-Mail anmelden',
    'auth.email': 'E-Mail',
    'auth.password': 'Passwort',
    'auth.forgotPassword': 'Passwort vergessen?',
    'auth.signingIn': 'Einloggen...',
    'auth.newTo': 'Neu bei {brandName}?',
    'auth.createFreeAccount': 'Kostenloses Konto erstellen →',
    'auth.createAccount': 'Erstelle dein Konto',
    'auth.freeForever': 'Für immer kostenlos. Keine Kreditkarte nötig.',
    'auth.iAmA': 'Ich bin ein...',
    'auth.findMyPath': 'Meinen Weg finden',
    'auth.openPathsTalent': 'Wege für Talente öffnen',
    'auth.continueAs': 'Weiter als {role} →',
    'auth.back': '← Zurück',
    'auth.orFillDetails': 'oder gib deine Daten ein',
    'auth.fullName': 'Vollständiger Name',
    'auth.country': 'Land',
    'auth.phoneOptional': 'Telefon — optional',
    'auth.minChars': 'Mind. 8 Zeichen',
    'auth.creatingAccount': 'Konto wird erstellt...',
    'auth.createAccountFree': 'Konto erstellen — Kostenlos',
    'auth.agreePrivacy': 'Mit der Registrierung stimmst du unserer Datenschutzrichtlinie zu',
    'auth.alreadyHaveAccount': 'Hast du bereits ein Konto?',
    'auth.signInLink': 'Anmelden →',

    // Ventures
    'ventures.allVentures': 'Alle Ventures',
    'ventures.explorer': 'Entdecker',
    'ventures.professional': 'Professionell',
    'ventures.creative': 'Kreativ',
    'ventures.community': 'Gemeinschaft',
    'ventures.curatedForRoute': 'Für deine Route kuratiert',
    'ventures.openPaths': 'Offene Wege.',
    'ventures.realVentures': 'Echte Ventures.',
    'ventures.chapterStarts': 'Dein Kapitel beginnt hier.',
    'ventures.showAll': 'Alle Ventures anzeigen',
    'ventures.seeAll': 'Alle anzeigen',
    'ventures.noMatch': 'Keine Wege passen zu diesem Filter',
    'ventures.areYouAnchor': 'Bist du ein Anker?',
    'ventures.postPath': 'Einen Weg posten →',
    'ventures.featured': 'Empfohlen',
    'ventures.remote': 'Remote',
    'ventures.perPerson': '/ Person',

    // Onboarding
    'onboarding.welcome': 'Willkommen im BeNetwork, Pionier!',
    'onboarding.whatKind': 'Was für ein Pionier bist du?',
    'onboarding.pickOne': 'Wähle den, der am besten zu dir passt. Du kannst es später ändern.',
    'onboarding.whereNow': 'Wo bist du gerade?',
    'onboarding.whereTo': 'Wohin möchtest du?',
    'onboarding.whatSkills': 'Welche Fähigkeiten bringst du mit?',
    'onboarding.continue': 'Weiter →',
    'onboarding.openChapter': 'Mein erstes Kapitel öffnen',
    'onboarding.add': 'Hinzufügen',

    // Compass
    'compass.active': 'Dein Kompass ist aktiv',
    'compass.ready': 'Dein Kompass ist bereit.',
    'compass.letsFind': 'Lass uns deinen Weg finden.',
    'compass.whereAre': 'Wo bist du gerade?',
    'compass.change': 'Ändern',
    'compass.whatKind': 'Was für ein Pionier bist du?',
    'compass.yourRoute': 'Deine Route',
    'compass.visaRoute': 'Visum-Route',
    'compass.payments': 'Zahlungen',
    'compass.topSectors': 'Top Sektoren',
    'compass.navigateDifferent': '← Eine andere Route navigieren',
    'compass.stepLabel1': 'Ziele',
    'compass.stepLabel2': 'Herkunft',
    'compass.stepLabel3': 'Pionier-Typ',
    'compass.stepLabel4': 'Deine Route',
    'compass.seeOpenPaths': 'Offene Wege ansehen →',
    'compass.selectPioneerType': 'Wähle deinen Pionier-Typ',
    'compass.back': '← Zurück',
    'compass.currentlyIn': 'Aktuell in {name}',
    'compass.autoDetected': 'Automatisch erkannt · tippe zum Ändern',
    'compass.locationHint':
      'Wir nutzen deinen Standort, um die besten Routen und Zahlungskorridore zu finden.',
    'compass.confirmed': 'Bestätigt — {name} →',
    'compass.alsoExploring': 'Erkundet auch:',
    'compass.stepOf': 'Schritt {step} von {total}',
    'compass.pioneer': 'Pionier',

    'common.pioneers': 'Pioniere',
    'common.active': 'Aktiv',
    'common.home': 'Startseite',
    'common.back': 'Zurück',
    'common.loading': 'Laden...',
    'common.signIn': 'Anmelden',
    'common.signOut': 'Abmelden',
    'common.anchor': 'Anker',

    // Pricing page
    'pricing.badge': 'Zahle von überall — M-Pesa, SEPA, Karte oder Mobile Money',
    'pricing.title': 'Einfache, transparente Preise',
    'pricing.subtitle':
      'Pioniere suchen und bewerben sich kostenlos. Anker veröffentlichen Pfade ab null Kosten. Skaliere, wenn du es brauchst.',
    'pricing.paymentTitle': 'Bezahle von überall auf der Welt',
    'pricing.paymentSubtitle':
      'Wir akzeptieren jede gängige Zahlungsmethode — niemand wird ausgeschlossen',
    'pricing.pioneersTitle': 'Pioniere — immer kostenlos',
    'pricing.pioneersDesc':
      'Profil erstellen, Kapitel öffnen und vermittelt werden ist für Pioniere komplett kostenlos. Immer.',
    'pricing.pioneersCta': 'Kostenloses Profil erstellen →',
    'pricing.agentTitle': 'Agenten verdienen {rate}% Provision',
    'pricing.agentDesc':
      'Leite Pfade über WhatsApp an dein Netzwerk weiter. Wenn ein Pionier durch deine Empfehlung vermittelt wird, erhältst du {rate}% der Vermittlungsgebühr. Ohne Obergrenze.',
    'pricing.agentCta': 'Agent werden →',
    'pricing.postFree': 'Kostenlos posten',
    'pricing.goFeatured': 'Featured werden',
    'pricing.goPremium': 'Premium werden',
    'pricing.forever': 'für immer',
    'pricing.perMonth': 'pro Monat',
    'pricing.mostPopular': 'BELIEBTESTE',

    // About
    'about.title': 'Über BeNetwork',
    'about.badge': 'Identitäts-basierte Lebensrouting-Plattform',
    'about.heroTitle': 'Arbeit sollte für {accent}alle{/accent} sein.',
    'about.heroDesc':
      'BeNetwork kehrt koloniale Wirtschaftsströme um — durch offenen Handel, faire Vergütung und direkte Verbindungen zwischen Ländern.',
    'about.startCompass': 'Meinen Kompass starten',
    'about.postPath': 'Einen Pfad posten',
    'about.mission': 'Unsere Mission',
    'about.missionTitle': 'Den Strom umkehren. {accent}Den Korridor bauen.{/accent}',
    'about.missionP1':
      'Seit Jahrhunderten fließt der Wert in eine Richtung — aus Afrika, aus dem Globalen Süden, in die Hände von Vermittlern und Torwächtern. BeNetwork ist der Korridor in die andere Richtung.',
    'about.missionP2':
      'Wir verbinden Pioniere direkt mit Ankern in 50+ Ländern. Zahlungen fließen über M-Pesa, Flutterwave und lokale Kanäle — nicht über ausländische Banken.',
    'about.values': 'Unsere Werte',
    'about.valuesTitle': 'Werte, die jeden Pfad leiten',
    'about.valuesSubtitle': 'Wofür wir stehen',
    'about.sectors': 'Branchen',
    'about.sectorsTitle': 'Pfade in jeder Branche',
    'about.payments': 'Zahlungskanäle',
    'about.paymentsTitle': 'Geld fließt dorthin, wo du bist',
    'about.paymentsDesc':
      'Wir unterstützen lokale Zahlungsmethoden in jedem Korridor — damit dein Einkommen in deinen Händen ankommt.',
    'about.impactDesc':
      'Unser Community-Arm. Unterstützt Naturschützer, lokale Guides und kulturelle Pädagogen in Ostafrika. Jede Buchung über {brand} trägt bei.',
    'about.learnImpact': 'Mehr über {name} erfahren',
    'about.ctaTitle': 'Bereit, deinen Pfad zu finden?',
    'about.ctaDesc':
      'Starte deinen Kompass. Sag uns, wo du bist und wohin du willst. Wir bauen deine Route.',

    // Contact
    'contact.title': 'Kontakt aufnehmen',
    'contact.subtitle': 'Fragen zu {brand}? Wir antworten innerhalb von {time} an Werktagen.',
    'contact.name': 'Dein Name',
    'contact.namePlaceholder': 'Dein Name',
    'contact.email': 'Deine E-Mail',
    'contact.emailPlaceholder': 'du@beispiel.de',
    'contact.subject': 'Betreff',
    'contact.subjectPlaceholder': 'Thema wählen...',
    'contact.subjectPath': 'Hilfe beim Pfad-Posting',
    'contact.subjectPayment': 'Zahlungsproblem',
    'contact.subjectAccount': 'Kontoproblem',
    'contact.subjectScam': 'Betrug melden',
    'contact.subjectPartner': 'Partnerschaftsanfrage',
    'contact.subjectOther': 'Sonstiges',
    'contact.message': 'Deine Nachricht',
    'contact.messagePlaceholder': 'Erzähl uns, wie wir helfen können...',
    'contact.send': 'Nachricht senden',
    'contact.sending': 'Wird gesendet...',
    'contact.sent': 'Nachricht gesendet!',
    'contact.sentDesc': 'Wir melden uns innerhalb von 24 Stunden bei dir.',
    'contact.error': 'Etwas ist schiefgelaufen. Bitte versuche es erneut oder schreibe uns direkt.',
    'contact.labelEmail': 'E-Mail',
    'contact.labelEmailSub': 'Allgemeine Anfragen',
    'contact.labelWhatsApp': 'WhatsApp',
    'contact.labelLocation': 'Standort',
    'contact.labelSocial': 'Soziale Medien',

    // Forgot password
    'forgotPassword.backToSignIn': 'Zurück zur Anmeldung',
    'forgotPassword.title': 'Passwort zurücksetzen',
    'forgotPassword.desc': 'Gib deine E-Mail ein und wir senden dir einen Link zum Zurücksetzen.',
    'forgotPassword.emailLabel': 'E-Mail-Adresse',
    'forgotPassword.sending': 'Wird gesendet…',
    'forgotPassword.sendLink': 'Link senden',
    'forgotPassword.checkEmail': 'Prüfe deine E-Mails',
    'forgotPassword.sentDesc':
      'Falls ein Konto für {email} existiert, erhältst du in Kürze einen Link zum Zurücksetzen.',
    'forgotPassword.noAccount': 'Noch kein Konto?',
    'forgotPassword.signUpFree': 'Kostenlos registrieren',

    // Threads
    'threads.heroTitle': 'Be{accent}[Du]{/accent}',
    'threads.heroDesc':
      'Finde deine Leute. Jede Identität — Land, Stamm, Sprache, Interesse — hat einen Thread. Tritt Gemeinschaften bei, die gemeinsam leben, arbeiten und wachsen.',
    'threads.search': 'Threads durchsuchen...',
    'threads.filterAll': 'Alle',
    'threads.filterCountries': 'Länder',
    'threads.filterTribes': 'Stämme',
    'threads.filterLanguages': 'Sprachen',
    'threads.filterInterests': 'Interessen',
    'threads.filterSciences': 'Wissenschaften',
    'threads.filterLocations': 'Standorte',
    'threads.liveData': 'Live-Daten',
    'threads.threadsCount': '{count} Threads',
    'threads.empty': 'Keine Threads gefunden. Versuche einen anderen Suchbegriff.',

    // Charity
    'charity.badge': 'Gemeinnützige Organisation · Registriert in Kenia',
    'charity.tagline': 'Swahili für „Kultur & Erbe"',
    'charity.heroDesc':
      'Der gemeinnützige Arm von {brand}. Jeder auf unserer Plattform eröffnete Pfad trägt zu Gemeinschaften, Naturschutz und Kultur in Kenia bei.',
    'charity.support': '{partner} unterstützen',
    'charity.learnMore': 'Erfahre mehr →',
    'charity.howBanner':
      'Wenn du ein Abenteuer buchst oder einen Pfad auf {brand} eröffnest, {accent}fließt ein Anteil an {partner}{/accent} — direkt in echte Programme vor Ort. Keine Mittelsmänner. Volle Transparenz.',
    'charity.impactTitle': 'Unsere Wirkung bisher',
    'charity.impactDesc': 'Ambitionierte Ziele für unseren ersten Programmzyklus',
    'charity.pillarsTitle': 'Unsere vier Säulen',
    'charity.pillarsDesc':
      'Alles, was wir tun, basiert auf diesen Grundpfeilern — denn ein würdevolles Leben erfordert Bildung, Sicherheit, einen gesunden Planeten und kulturellen Stolz.',
    'charity.howTitle': 'So funktioniert es',
    'charity.howSubtitle': 'Der {brand}-Kreislauf würdevoller Arbeit',
    'charity.step1Title': 'Pioniere buchen Abenteuer',
    'charity.step1Desc':
      'Jede Safari, jeder Öko-Lodge-Aufenthalt oder berufliche Pfad auf {brand} schafft Wert im Ökosystem.',
    'charity.step2Title': 'Ein Anteil geht an {partner}',
    'charity.step2Desc':
      'Ein transparenter Prozentsatz jeder Transaktion wird automatisch den {partner}-Programmen zugewiesen.',
    'charity.step3Title': 'Gemeinschaften gedeihen',
    'charity.step3Desc':
      'Mittel fließen direkt in Berufsausbildung, Naturschutz und Frauenförderung in kenianischen Gemeinden.',
    'charity.storiesTitle': 'Geschichten aus dem Feld',
    'charity.storiesDesc': 'Echte Leben. Echter Wandel. Namen mit Genehmigung verwendet.',
    'charity.readMore': 'Ganze Geschichte lesen →',
    'charity.showLess': 'Weniger anzeigen',
    'charity.today': 'Heute',
    'charity.partnerTitle': 'Partner von {partner} werden',
    'charity.partnerDesc':
      'Wir begrüßen Partnerschaften mit Organisationen, die unseren Glauben an würdevolle Arbeit, Gemeindeentwicklung und Naturschutz teilen.',
    'charity.getInTouch': 'Kontakt aufnehmen →',
    'charity.donateTitle': '{partner} unterstützen',
    'charity.donateDesc':
      'Jeder Beitrag — groß oder klein — fördert Fähigkeiten, schützt Wildtiere und bewahrt kenianische Kultur für kommende Generationen.',
    'charity.chooseAmount': 'Betrag wählen',
    'charity.customAmount': 'Eigener Betrag',
    'charity.mpesaInfo':
      'Spende via M-Pesa: Paybill {partner} CBO. Du erhältst die vollständigen Zahlungsanweisungen nach dem Klick.',
    'charity.donateBtn': '{amount} an {partner} spenden',
    'charity.donateNote':
      'Spenden werden direkt für Gemeinschaftsprogramme verwendet. Keine politischen Zugehörigkeiten.',
    'charity.alsoContribute':
      'Du kannst auch beitragen, indem du {link}ein Abenteuer buchst{/link} auf {brand} — ein Prozentsatz unterstützt automatisch {partner}.',
    'charity.legal':
      '{partner} ist in Kenia als Community Based Organisation (CBO) registriert. Partnerschaft mit {company}. Alle Programme werden lokal mit voller Beteiligung der Gemeinschaft und transparenter Finanzberichterstattung verwaltet.',

    // Referral
    'referral.heroTitle': '{bonus} pro Vermittlung verdienen',
    'referral.heroDesc':
      'Empfiehl einen Freund, der über {brand} vermittelt wird. Wir zahlen dir {bonus} über {method} — jedes Mal.',
    'referral.linkTitle': 'Dein Empfehlungslink',
    'referral.linkDesc': 'Teile diesen Link — jede Anmeldung zählt für deine Einnahmen',
    'referral.copied': 'Kopiert!',
    'referral.copy': 'Kopieren',
    'referral.shareWhatsApp': 'Auf WhatsApp teilen',
    'referral.shareTwitter': 'Auf Twitter/X teilen',
    'referral.howTitle': 'So funktioniert es',
    'referral.notSignedUp': 'Noch nicht registriert?',
    'referral.ctaBtn': 'Kostenloses Konto erstellen & verdienen →',

    // Footer
    'footer.builtWith': 'Mit Hingabe gebaut in Nairobi, Berlin und Zürich',
    'footer.rights': 'Alle Rechte vorbehalten',
    'footer.privacy': 'Datenschutzrichtlinie',
    'footer.terms': 'Nutzungsbedingungen',
  },

  // ─── Swahili (Kiswahili) ─────────────────────────────────────
  sw: {
    'nav.startCompass': 'Anza Dira',
    'nav.signIn': 'Ingia',
    'nav.browseThreads': 'Angalia mazungumzo yote →',
    'nav.switchIdentity': 'Bonyeza kubadilisha utambulisho',
    'nav.oneIdentity': 'Jukwaa moja, kila utambulisho',
    'nav.location': 'Mahali',
    'nav.language': 'Lugha',
    'nav.nearby': 'Husika',

    'hero.greeting': 'Tunaona uko {geoName}. {geoGreeting}',
    'hero.readyChapter': 'Uko tayari kwa sura yako ijayo?',
    'hero.headline': 'Pata mahali',
    'hero.belong': 'unapohusika.',
    'hero.goThere': 'Nenda huko.',
    'hero.subtitle':
      '{brandName} si bodi ya kazi. Ni dira — kwa Waanzilishi wanaotaka kusonga, kukua, na kuhusika mahali pa kipekee.',
    'hero.startCompass': 'Anza Dira Yangu',
    'hero.browseVentures': 'Vinjari Ventures',
    'hero.pioneersTrust': 'Waanzilishi hai leo',
    'hero.everyBooking': '{amount} kutoka kila uhifadhi',
    'hero.fundsCommunity': 'inafadhili kazi ya jamii ya {partner}',

    'network.label': 'BeNetwork',
    'network.headline': 'Aina tatu za watu. Mtandao mmoja.',
    'network.subtitle':
      'Hakuna lugha ngumu. Hakuna CV zinazochakaa. Waanzilishi, Nanga, na Wavumbuzi tu — wanaopata kila mmoja.',

    'compass.headline': 'Unataka kwenda wapi?',
    'compass.subtitle':
      'Tuambie safari yako kwa hatua 3 za haraka. Tutakupatanisha na Njia, Nanga, na jamii — popote ulimwenguni.',

    'experiences.label': 'Uzoefu wa {country}',
    'experiences.headline': '{country} haingojei mtu. Wewe pia usishindwe.',
    'experiences.subtitle': 'Uzoefu wa kipekee ulioandaliwa na {brandName}.',
    'experiences.book': 'Hifadhi Venture Hii →',

    'expansion.headline': '{brandName} ni mwanzo tu.',
    'expansion.subtitle': 'Misheni ile ile. Kila nchi. Kila jamii.',
    'expansion.live': 'Hai sasa',
    'expansion.coming': 'Inakuja hivi karibuni',

    'anchors.headline': 'Je, wewe ni Nanga?',
    'anchors.postPath': 'Weka Njia →',

    'testimonials.label': 'Hadithi za Waanzilishi',
    'testimonials.headline': 'Safari halisi. Sura halisi.',

    'payments.label': 'Lipa kwa unachokijua',

    // Nav
    'nav.explore': 'Chunguza',
    'nav.forAnchors': 'Kwa Nanga',
    'nav.about': 'Kuhusu',
    'nav.startMyCompass': 'Anza Dira Yangu',
    'nav.pioneer': 'Mwanzilishi',

    // Auth
    'auth.welcomeBack': 'Karibu tena',
    'auth.signInAccount': 'Ingia kwenye akaunti yako',
    'auth.continueGoogle': 'Endelea na Google',
    'auth.orSignInEmail': 'au ingia kwa barua pepe',
    'auth.email': 'Barua pepe',
    'auth.password': 'Nenosiri',
    'auth.createAccount': 'Fungua akaunti yako',
    'auth.freeForever': 'Bure milele. Hakuna kadi ya mkopo.',
    'auth.iAmA': 'Mimi ni...',
    'auth.findMyPath': 'Tafuta njia yangu',
    'auth.openPathsTalent': 'Fungua Njia kwa vipaji',
    'auth.fullName': 'Jina Kamili',
    'auth.country': 'Nchi',

    // Ventures
    'ventures.allVentures': 'Ventures Zote',
    'ventures.openPaths': 'Njia Wazi.',
    'ventures.realVentures': 'Ventures Halisi.',
    'ventures.chapterStarts': 'Sura Yako Inaanza Hapa.',
    'ventures.areYouAnchor': 'Je, wewe ni Nanga?',
    'ventures.postPath': 'Weka Njia →',

    // Onboarding
    'onboarding.welcome': 'Karibu BeNetwork, Mwanzilishi!',
    'onboarding.whatKind': 'Ni mwanzilishi wa aina gani?',
    'onboarding.whereNow': 'Uko wapi sasa?',
    'onboarding.whereTo': 'Unataka kwenda wapi?',
    'onboarding.whatSkills': 'Unaletea ujuzi gani?',
    'onboarding.continue': 'Endelea →',
    'onboarding.openChapter': 'Fungua Sura Yangu ya Kwanza',

    // Compass
    'compass.active': 'Dira yako iko hai',
    'compass.ready': 'Dira yako iko tayari.',
    'compass.whereAre': 'Uko wapi sasa?',
    'compass.whatKind': 'Ni mwanzilishi wa aina gani?',
    'compass.yourRoute': 'Njia Yako',

    'common.pioneers': 'waanzilishi',
    'common.active': 'Hai',
    'common.home': 'Nyumbani',
    'common.back': 'Rudi',
    'common.loading': 'Inapakia...',
    'common.signIn': 'Ingia',
    'common.signOut': 'Toka',
    'common.anchor': 'Nanga',

    // Pricing page
    'pricing.badge': 'Lipa kutoka popote — M-Pesa, SEPA, kadi, au pesa ya simu',
    'pricing.title': 'Bei rahisi na wazi',
    'pricing.subtitle':
      'Waanzilishi wanavinjari na kuomba bure. Nanga waweke Njia kuanzia gharama sifuri. Panua unapohitaji.',
    'pricing.paymentTitle': 'Lipa kutoka popote ulimwenguni',
    'pricing.paymentSubtitle': 'Tunakubali kila njia kuu ya malipo — hakuna mtu anayeachwa nyuma',
    'pricing.pioneersTitle': 'Waanzilishi — bure milele',
    'pricing.pioneersDesc':
      'Kuunda wasifu, kufungua Sura, na kupata nafasi ni bure kabisa kwa Waanzilishi. Daima.',
    'pricing.pioneersCta': 'Unda Wasifu Bure →',
    'pricing.agentTitle': 'Mawakala wanapata {rate}% kamisheni',
    'pricing.agentDesc':
      'Sambaza Njia kwa mtandao wako kupitia WhatsApp. Mwanzilishi anapopata kazi kupitia rufaa yako, unapata {rate}% ya ada ya uwekaji. Hakuna kikomo.',
    'pricing.agentCta': 'Kuwa Wakala →',
    'pricing.postFree': 'Weka Bure',
    'pricing.goFeatured': 'Kuwa Bora',
    'pricing.goPremium': 'Kuwa Premium',
    'pricing.forever': 'milele',
    'pricing.perMonth': 'kwa mwezi',
    'pricing.mostPopular': 'MAARUFU ZAIDI',

    // About
    'about.title': 'Kuhusu BeNetwork',
    'about.badge': 'Jukwaa la kuongoza maisha kwa utambulisho',
    'about.heroTitle': 'Kazi inapaswa kuwa ya {accent}kila mtu.{/accent}',
    'about.heroDesc':
      'BeNetwork inabadilisha mtiririko wa kiuchumi wa kikoloni kupitia biashara huru, malipo ya haki, na uhusiano wa moja kwa moja kati ya nchi.',
    'about.startCompass': 'Anza Dira Yangu',
    'about.postPath': 'Weka Njia',
    'about.mission': 'Misheni Yetu',
    'about.missionTitle': 'Badilisha mtiririko. {accent}Jenga korrido.{/accent}',
    'about.missionP1':
      'Kwa karne nyingi, thamani imekuwa ikitiririka upande mmoja — kutoka Afrika, kutoka Kusini mwa Ulimwengu. BeNetwork ni korrido katika upande wa pili.',
    'about.missionP2':
      'Tunaunganisha Waanzilishi moja kwa moja na Nanga katika nchi 50+. Malipo yanapitia M-Pesa, Flutterwave, na njia za ndani.',
    'about.values': 'Maadili Yetu',
    'about.valuesTitle': 'Maadili yanayoongoza kila njia',
    'about.valuesSubtitle': 'Tunasimamia Nini',
    'about.sectors': 'Sekta',
    'about.sectorsTitle': 'Njia katika kila sekta',
    'about.payments': 'Njia za Malipo',
    'about.paymentsTitle': 'Pesa inafuata mahali ulipo',
    'about.paymentsDesc':
      'Tunaunga mkono njia za malipo za ndani katika kila korrido — ili mapato yako yafike mikononi mwako.',
    'about.impactDesc':
      'Mkono wetu wa jamii. Tunaunga mkono wahifadhi, waongoza wa ndani, na walimu wa kitamaduni kote Afrika Mashariki. Kila uhifadhi kupitia {brand} unachangia.',
    'about.learnImpact': 'Jifunze kuhusu {name}',
    'about.ctaTitle': 'Uko tayari kupata njia yako?',
    'about.ctaDesc':
      'Anza Dira yako. Tuambie uko wapi na unataka kwenda wapi. Tutajenga njia yako.',

    // Contact
    'contact.title': 'Wasiliana Nasi',
    'contact.subtitle': 'Maswali kuhusu {brand}? Tunajibu ndani ya {time} siku za kazi.',
    'contact.name': 'Jina Lako',
    'contact.namePlaceholder': 'Jina lako',
    'contact.email': 'Barua Pepe Yako',
    'contact.emailPlaceholder': 'wewe@mfano.com',
    'contact.subject': 'Mada',
    'contact.subjectPlaceholder': 'Chagua mada...',
    'contact.subjectPath': 'Msaada wa kuweka Njia',
    'contact.subjectPayment': 'Tatizo la malipo',
    'contact.subjectAccount': 'Tatizo la akaunti',
    'contact.subjectScam': 'Ripoti ulaghai',
    'contact.subjectPartner': 'Swali la ushirikiano',
    'contact.subjectOther': 'Nyingine',
    'contact.message': 'Ujumbe Wako',
    'contact.messagePlaceholder': 'Tuambie tunaweza kusaidia vipi...',
    'contact.send': 'Tuma Ujumbe',
    'contact.sending': 'Inatuma...',
    'contact.sent': 'Ujumbe umetumwa!',
    'contact.sentDesc': 'Tutajibu ndani ya masaa 24.',
    'contact.error':
      'Kitu kimekwenda vibaya. Tafadhali jaribu tena au tutumie barua pepe moja kwa moja.',
    'contact.labelEmail': 'Barua Pepe',
    'contact.labelEmailSub': 'Maswali ya jumla',
    'contact.labelWhatsApp': 'WhatsApp',
    'contact.labelLocation': 'Mahali',
    'contact.labelSocial': 'Mitandao ya Kijamii',

    // Forgot password
    'forgotPassword.backToSignIn': 'Rudi kwenye Kuingia',
    'forgotPassword.title': 'Weka upya nenosiri',
    'forgotPassword.desc': 'Ingiza barua pepe yako na tutakutumia kiungo cha kuweka upya.',
    'forgotPassword.emailLabel': 'Anwani ya barua pepe',
    'forgotPassword.sending': 'Inatuma…',
    'forgotPassword.sendLink': 'Tuma kiungo',
    'forgotPassword.checkEmail': 'Angalia barua pepe yako',
    'forgotPassword.sentDesc':
      'Ikiwa akaunti ipo kwa {email}, utapata kiungo cha kuweka upya hivi karibuni.',
    'forgotPassword.noAccount': 'Huna akaunti?',
    'forgotPassword.signUpFree': 'Jisajili bure',

    // Threads
    'threads.heroTitle': 'Be{accent}[Wewe]{/accent}',
    'threads.heroDesc':
      'Pata watu wako. Kila utambulisho — nchi, kabila, lugha, maslahi — una thread. Jiunge na jamii zinazosonga, kufanya kazi, na kustawi pamoja.',
    'threads.search': 'Tafuta threads...',
    'threads.filterAll': 'Zote',
    'threads.filterCountries': 'Nchi',
    'threads.filterTribes': 'Makabila',
    'threads.filterLanguages': 'Lugha',
    'threads.filterInterests': 'Maslahi',
    'threads.filterSciences': 'Sayansi',
    'threads.filterLocations': 'Maeneo',
    'threads.liveData': 'Data halisi',
    'threads.threadsCount': 'Threads {count}',
    'threads.empty': 'Hakuna threads zinazolingana na utafutaji wako. Jaribu neno lingine.',

    // Charity
    'charity.badge': 'Shirika la Jamii · Limesajiliwa Kenya',
    'charity.tagline': 'Kiswahili kwa "Utamaduni na Urithi"',
    'charity.heroDesc':
      'Mkono wa hisani wa {brand}. Kila njia inayofunguliwa kwenye jukwaa letu inachangia jamii, uhifadhi, na utamaduni kote Kenya.',
    'charity.support': 'Unga mkono {partner}',
    'charity.learnMore': 'Jifunze tunachofanya →',
    'charity.howBanner':
      'Unapopiga buking ya Matembezi au kufungua Njia kwenye {brand}, {accent}asilimia inaenda kwa {partner}{/accent} — ikifadhili programu za kweli katika jamii za kweli. Hakuna watu wa kati. Uwazi kamili.',
    'charity.impactTitle': 'Athari Yetu Hadi Sasa',
    'charity.impactDesc': 'Malengo ya kutamani kwa mzunguko wetu wa kwanza wa programu',
    'charity.pillarsTitle': 'Nguzo Zetu Nne',
    'charity.pillarsDesc':
      'Kila tunachofanya kinajengwa juu ya misingi hii — kwa sababu maisha ya heshima yanahitaji elimu, usalama, sayari yenye afya, na kiburi cha kitamaduni.',
    'charity.howTitle': 'Jinsi Inavyofanya Kazi',
    'charity.howSubtitle': 'Mzunguko wa {brand} wa kazi yenye heshima',
    'charity.step1Title': 'Waanzilishi Wanapiga Buking',
    'charity.step1Desc':
      'Kila safari, kukaa kwa eco-lodge, au njia ya kitaalamu iliyofunguliwa kwenye {brand} inaunda thamani katika mfumo.',
    'charity.step2Title': 'Sehemu Inaenda kwa {partner}',
    'charity.step2Desc':
      'Asilimia ya uwazi ya kila shughuli inatolewa kwa programu za {partner} — kiotomatiki.',
    'charity.step3Title': 'Jamii Zinastawi',
    'charity.step3Desc':
      'Fedha zinaenda moja kwa moja kwa mafunzo ya ujuzi, msaada wa uhifadhi, na uwezeshaji wa wanawake katika jamii za Kenya.',
    'charity.storiesTitle': 'Hadithi kutoka Uwandani',
    'charity.storiesDesc': 'Maisha ya kweli. Mabadiliko ya kweli. Majina yametumika kwa ruhusa.',
    'charity.readMore': 'Soma hadithi kamili →',
    'charity.showLess': 'Onyesha kidogo',
    'charity.today': 'Leo',
    'charity.partnerTitle': 'Shirikiana na {partner}',
    'charity.partnerDesc':
      'Tunakaribisha ushirikiano na mashirika yanayoshiriki imani yetu katika kazi yenye heshima, maendeleo ya jamii, na uhifadhi.',
    'charity.getInTouch': 'Wasiliana Nasi →',
    'charity.donateTitle': 'Unga mkono {partner}',
    'charity.donateDesc':
      'Kila mchango — mkubwa au mdogo — unajengea ujuzi, unalinda wanyamapori, na kuhifadhi utamaduni wa Kenya kwa vizazi vijavyo.',
    'charity.chooseAmount': 'Chagua kiasi',
    'charity.customAmount': 'Kiasi maalum',
    'charity.mpesaInfo':
      'Changia kupitia M-Pesa: Paybill {partner} CBO. Utapata maelekezo kamili ya malipo baada ya kubonyeza hapa chini.',
    'charity.donateBtn': 'Changia {amount} kwa {partner}',
    'charity.donateNote':
      'Michango inatumika moja kwa moja kwa programu za jamii. Hakuna uhusiano wa kisiasa.',
    'charity.alsoContribute':
      'Unaweza pia kuchangia kwa {link}kupiga buking ya Matembezi{/link} kwenye {brand} — asilimia inaunga mkono {partner} kiotomatiki.',
    'charity.legal':
      '{partner} imesajiliwa Kenya kama Shirika la Jamii (CBO). Kushirikiana na {company}. Programu zote zinasimamiwa ndani na ushiriki kamili wa jamii na ripoti za kifedha zenye uwazi.',

    // Referral
    'referral.heroTitle': 'Pata {bonus} kwa kila uwekaji',
    'referral.heroDesc':
      'Pendekeza rafiki anayepata nafasi kupitia {brand}. Tunakupa {bonus} kupitia {method} — kila wakati.',
    'referral.linkTitle': 'Kiungo chako cha rufaa',
    'referral.linkDesc': 'Shiriki kiungo hiki — kila usajili unachangia mapato yako',
    'referral.copied': 'Imenakiliwa!',
    'referral.copy': 'Nakili',
    'referral.shareWhatsApp': 'Shiriki kwenye WhatsApp',
    'referral.shareTwitter': 'Shiriki kwenye Twitter/X',
    'referral.howTitle': 'Jinsi inavyofanya kazi',
    'referral.notSignedUp': 'Bado hujasajiliwa?',
    'referral.ctaBtn': 'Fungua Akaunti Bure & Anza Kupata →',

    // Footer
    'footer.builtWith': 'Imejengwa kwa makusudi Nairobi, Berlin, na Zurich',
    'footer.rights': 'Haki zote zimehifadhiwa',
    'footer.privacy': 'Sera ya Faragha',
    'footer.terms': 'Masharti ya Huduma',

    // Auth (completing missing Swahili auth keys)
    'auth.forgotPassword': 'Umesahau nenosiri?',
    'auth.signingIn': 'Inaingia...',
    'auth.newTo': 'Mpya kwa {brandName}?',
    'auth.createFreeAccount': 'Unda akaunti bure →',
    'auth.continueAs': 'Endelea kama {role} →',
    'auth.back': '← Rudi',
    'auth.orFillDetails': 'au jaza maelezo yako',
    'auth.phoneOptional': 'Simu (M-Pesa) — si lazima',
    'auth.minChars': 'Angalau herufi 8',
    'auth.creatingAccount': 'Inaunda akaunti...',
    'auth.createAccountFree': 'Unda Akaunti — Bure',
    'auth.agreePrivacy': 'Kwa kusajiliwa unakubali Sera yetu ya Faragha',
    'auth.alreadyHaveAccount': 'Una akaunti tayari?',
    'auth.signInLink': 'Ingia →',

    // Ventures (completing missing keys)
    'ventures.explorer': 'Mvumbuzi',
    'ventures.professional': 'Mtaalamu',
    'ventures.creative': 'Mbunifu',
    'ventures.community': 'Jamii',
    'ventures.explorerDesc': 'Safari na utalii wa kiikolojia',
    'ventures.professionalDesc': 'Teknolojia, fedha, afya',
    'ventures.creativeDesc': 'Sanaa, vyombo vya habari, mitindo',
    'ventures.communityDesc': 'NGOs, ufundishaji, kujitolea',
    'ventures.curatedForRoute': 'Imeandaliwa kwa njia yako',
    'ventures.showAll': 'Onyesha ventures zote',
    'ventures.seeAll': 'Ona zote',
    'ventures.noMatch': 'Hakuna Njia zinazolingana na chujio hili',
    'ventures.featured': 'Iliyoangaziwa',
    'ventures.remote': 'Kwa mbali',
    'ventures.perPerson': '/ mtu',

    // Onboarding (completing missing keys)
    'onboarding.step': 'Hatua {step} ya {total}',
    'onboarding.complete': '% imekamilika',
    'onboarding.profileReady': 'Wasifu wako uko tayari. Tunapata Njia bora kwako...',
    'onboarding.takingYou': 'Tunakupeleka kwenye Ventures zako...',
    'onboarding.pickOne': 'Chagua inayokufaa zaidi. Unaweza kubadilisha baadaye.',
    'onboarding.weThink': 'Tunafikiri uko {country}. Sahihi?',
    'onboarding.helpsRoutes': 'Hii inatusaidia kupata njia bora za safari yako.',
    'onboarding.selectCountry': 'Chagua nchi yako...',
    'onboarding.other': '🌍 Nyingine',
    'onboarding.calibrated': 'Sawa — wasifu wako utarekebishwa kwa {country}.',
    'onboarding.selectDestinations':
      'Chagua marudio moja au zaidi. Tutaweka kipaumbele Njia katika maeneo haya.',
    'onboarding.selectSkills':
      'Chagua angalau ujuzi 3. Hizi zinaimarisha alama yako ya kulinganisha.',
    'onboarding.chapterTitle': 'Tuambie kichwa cha sura yako',
    'onboarding.headlineFirst': 'Kichwa chako ni kitu cha kwanza Nanga wanaona. Kifanye chako.',
    'onboarding.yourHeadline': 'Kichwa chako *',
    'onboarding.whatMakesYou': 'Nini kinakufanya wewe? (si lazima)',
    'onboarding.whatsapp': 'Nambari ya WhatsApp',
    'onboarding.openingChapter': 'Inafungua sura yako...',

    // Compass (completing missing keys)
    'compass.letsFind': 'Hebu tupate njia yako.',
    'compass.stepOf': 'Hatua {step} ya {total}',
    'compass.currentlyIn': 'Sasa hivi {name}',
    'compass.autoDetected': 'Imegunduliwa moja kwa moja · gonga kubadilisha',
    'compass.change': 'Badilisha',
    'compass.locationHint': 'Tunatumia eneo lako kupata njia na korido bora za malipo.',
    'compass.confirmed': 'Imethibitishwa — {name} →',
    'compass.alsoExploring': 'Pia inachunguza:',
    'compass.visaRoute': 'Njia ya Visa',
    'compass.payments': 'Malipo',
    'compass.topSectors': 'Sekta Bora',
    'compass.navigateDifferent': '← Pitia njia tofauti',
    'compass.stepLabel1': 'Malengo',
    'compass.stepLabel2': 'Asili',
    'compass.stepLabel3': 'Aina ya Mwanzilishi',
    'compass.stepLabel4': 'Njia Yako',
    'compass.seeOpenPaths': 'Ona Njia Wazi →',
    'compass.selectPioneerType': 'Chagua aina yako ya mwanzilishi',
    'compass.back': '← Rudi',
    'compass.pioneer': 'Mwanzilishi',

    // Country hero taglines
    'hero.tagline.KE': 'Njia za Kimataifa, Malipo kupitia M-Pesa',
    'hero.tagline.DE': 'Njia Yako kwenda Ujerumani',
    'hero.tagline.CH': 'Njia Yako kwenda Uswisi',
  },

  // ─── French (Français) ────────────────────────────────────────
  fr: {
    'nav.startCompass': 'Lancer la Boussole',
    'nav.signIn': 'Se connecter',
    'nav.browseThreads': 'Parcourir tous les fils →',
    'nav.switchIdentity': "Cliquez pour changer d'identité",
    'nav.oneIdentity': 'Une plateforme, chaque identité',
    'nav.location': 'Lieu',
    'nav.language': 'Langue',
    'nav.nearby': 'Pertinent',

    'hero.readyChapter': 'Prêt pour votre prochain chapitre?',
    'hero.headline': 'Trouvez où vous',
    'hero.belong': 'appartenez.',
    'hero.goThere': 'Allez-y.',
    'hero.subtitle':
      "{brandName} n'est pas un site d'emploi. C'est une boussole — pour les Pionniers qui veulent bouger, grandir et appartenir à un endroit extraordinaire.",
    'hero.startCompass': 'Lancer Ma Boussole',
    'hero.browseVentures': 'Parcourir les Ventures',

    'compass.headline': 'Où voulez-vous aller?',

    'expansion.headline': "{brandName} n'est que le début.",
    'expansion.subtitle': 'Même mission. Chaque pays. Chaque communauté.',
    'expansion.live': 'En direct',
    'expansion.coming': 'Bientôt disponible',

    'anchors.headline': 'Êtes-vous un Ancre?',

    // Nav
    'nav.explore': 'Explorer',
    'nav.forAnchors': 'Pour les Ancres',
    'nav.about': 'À propos',
    'nav.startMyCompass': 'Lancer Ma Boussole',
    'nav.pioneer': 'Pionnier',

    // Auth
    'auth.welcomeBack': 'Bon retour',
    'auth.signInAccount': 'Connectez-vous à votre compte',
    'auth.continueGoogle': 'Continuer avec Google',
    'auth.orSignInEmail': 'ou connectez-vous par email',
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.createAccount': 'Créez votre compte',
    'auth.freeForever': 'Gratuit pour toujours. Pas de carte de crédit.',
    'auth.iAmA': 'Je suis un...',
    'auth.findMyPath': 'Trouver mon chemin',
    'auth.fullName': 'Nom complet',
    'auth.country': 'Pays',

    // Ventures
    'ventures.allVentures': 'Tous les Ventures',
    'ventures.openPaths': 'Chemins Ouverts.',
    'ventures.realVentures': 'Ventures Réelles.',
    'ventures.chapterStarts': 'Votre Chapitre Commence Ici.',
    'ventures.areYouAnchor': 'Êtes-vous un Ancre?',
    'ventures.postPath': 'Poster un Chemin →',

    // Onboarding
    'onboarding.welcome': 'Bienvenue au BeNetwork, Pionnier!',
    'onboarding.whatKind': 'Quel type de Pionnier êtes-vous?',
    'onboarding.whereNow': 'Où êtes-vous maintenant?',
    'onboarding.whereTo': 'Où voulez-vous aller?',
    'onboarding.whatSkills': 'Quelles compétences apportez-vous?',
    'onboarding.continue': 'Continuer →',
    'onboarding.openChapter': 'Ouvrir Mon Premier Chapitre',

    // Compass
    'compass.ready': 'Votre boussole est prête.',
    'compass.whereAre': 'Où êtes-vous actuellement?',
    'compass.yourRoute': 'Votre Route',

    'common.pioneers': 'pionniers',
    'common.active': 'Actif',
    'common.home': 'Accueil',
    'common.back': 'Retour',
    'common.loading': 'Chargement...',
    'common.signIn': 'Se connecter',
    'common.signOut': 'Se déconnecter',
    'common.anchor': 'Ancre',
  },

  // ─── Arabic (العربية) ──────────────────────────────────────────
  ar: {
    'hero.headline': 'اعثر على المكان الذي',
    'hero.belong': 'تنتمي إليه.',
    'hero.goThere': 'اذهب إلى هناك.',
    'hero.startCompass': 'ابدأ بوصلتي',
    'hero.browseVentures': 'تصفح المغامرات',
    'common.pioneers': 'رواد',
    'common.active': 'نشط',
  },

  // ─── Hindi (हिन्दी) — 600M+ speakers ──────────────────────────
  hi: {
    'hero.headline': 'वह जगह खोजो जहाँ आप',
    'hero.belong': 'संबंध रखते हैं।',
    'hero.goThere': 'वहाँ जाओ।',
    'hero.subtitle':
      '{brandName} नौकरी बोर्ड नहीं है। यह एक कम्पास है — उन अग्रदूतों के लिए जो आगे बढ़ना, बढ़ना और कहीं असाधारण में शामिल होना चाहते हैं।',
    'hero.startCompass': 'मेरा कम्पास शुरू करें',
    'hero.browseVentures': 'वेंचर्स ब्राउज़ करें',
    'nav.startCompass': 'कम्पास शुरू करें',
    'nav.signIn': 'साइन इन करें',
    'compass.headline': 'आप कहाँ जाना चाहते हैं?',
    'expansion.headline': '{brandName} बस शुरुआत है।',
    'common.pioneers': 'अग्रदूत',
    'common.active': 'सक्रिय',
    'common.home': 'होम',
  },

  // ─── Mandarin Chinese (中文) — 1.1B+ speakers ─────────────────
  zh: {
    'hero.headline': '找到你',
    'hero.belong': '归属的地方。',
    'hero.goThere': '去那里。',
    'hero.subtitle':
      '{brandName} 不是招聘网站。它是一个指南针 — 为想要迁移、成长和归属于非凡之地的先驱者。',
    'hero.startCompass': '启动我的指南针',
    'hero.browseVentures': '浏览项目',
    'nav.startCompass': '启动指南针',
    'nav.signIn': '登录',
    'nav.switchIdentity': '点击切换身份',
    'compass.headline': '你想去哪里？',
    'expansion.headline': '{brandName} 只是开始。',
    'expansion.live': '已上线',
    'expansion.coming': '即将推出',
    'common.pioneers': '先驱者',
    'common.active': '活跃',
    'common.home': '首页',
  },

  // ─── Spanish (Español) — 550M+ speakers ──────────────────────
  es: {
    'hero.headline': 'Encuentra dónde',
    'hero.belong': 'perteneces.',
    'hero.goThere': 'Ve allí.',
    'hero.subtitle':
      '{brandName} no es un portal de empleo. Es una brújula — para Pioneros que quieren moverse, crecer y pertenecer a un lugar extraordinario.',
    'hero.startCompass': 'Iniciar Mi Brújula',
    'hero.browseVentures': 'Explorar Ventures',
    'nav.startCompass': 'Iniciar Brújula',
    'nav.signIn': 'Iniciar sesión',
    'nav.switchIdentity': 'Clic para cambiar identidad',
    'compass.headline': '¿A dónde quieres ir?',
    'expansion.headline': '{brandName} es solo el comienzo.',
    'expansion.live': 'En vivo ahora',
    'expansion.coming': 'Próximamente',
    'anchors.headline': '¿Eres un Ancla?',
    'testimonials.headline': 'Viajes reales. Capítulos reales.',
    'common.pioneers': 'pioneros',
    'common.active': 'Activo',
    'common.home': 'Inicio',
  },

  // ─── Portuguese (Português) — 260M+ speakers ─────────────────
  pt: {
    'hero.headline': 'Encontre onde você',
    'hero.belong': 'pertence.',
    'hero.goThere': 'Vá até lá.',
    'hero.subtitle':
      '{brandName} não é um quadro de empregos. É uma bússola — para Pioneiros que querem se mover, crescer e pertencer a um lugar extraordinário.',
    'hero.startCompass': 'Iniciar Minha Bússola',
    'hero.browseVentures': 'Explorar Ventures',
    'nav.startCompass': 'Iniciar Bússola',
    'nav.signIn': 'Entrar',
    'compass.headline': 'Para onde você quer ir?',
    'expansion.headline': '{brandName} é apenas o começo.',
    'expansion.live': 'Ao vivo agora',
    'expansion.coming': 'Em breve',
    'common.pioneers': 'pioneiros',
    'common.active': 'Ativo',
    'common.home': 'Início',
  },

  // ─── Russian (Русский) — 250M+ speakers ──────────────────────
  ru: {
    'hero.headline': 'Найди место, где ты',
    'hero.belong': 'принадлежишь.',
    'hero.goThere': 'Иди туда.',
    'hero.subtitle':
      '{brandName} — это не доска объявлений. Это компас — для Пионеров, которые хотят двигаться, расти и принадлежать чему-то необыкновенному.',
    'hero.startCompass': 'Запустить Мой Компас',
    'hero.browseVentures': 'Обзор Ventures',
    'nav.startCompass': 'Запустить Компас',
    'nav.signIn': 'Войти',
    'compass.headline': 'Куда вы хотите поехать?',
    'expansion.headline': '{brandName} — это только начало.',
    'expansion.live': 'Уже работает',
    'expansion.coming': 'Скоро',
    'common.pioneers': 'пионеры',
    'common.active': 'Активный',
    'common.home': 'Главная',
  },

  // ─── Japanese (日本語) — 125M+ speakers ───────────────────────
  ja: {
    'hero.headline': 'あなたが',
    'hero.belong': '属する場所を見つけよう。',
    'hero.goThere': 'そこへ行こう。',
    'hero.startCompass': 'コンパスを始める',
    'hero.browseVentures': 'ベンチャーを探す',
    'nav.startCompass': 'コンパス開始',
    'nav.signIn': 'サインイン',
    'compass.headline': 'どこに行きたいですか？',
    'expansion.headline': '{brandName} はほんの始まりです。',
    'common.pioneers': 'パイオニア',
    'common.active': 'アクティブ',
    'common.home': 'ホーム',
  },

  // ─── Korean (한국어) — 80M+ speakers ──────────────────────────
  ko: {
    'hero.headline': '당신이',
    'hero.belong': '속할 곳을 찾으세요.',
    'hero.goThere': '그곳으로 가세요.',
    'hero.startCompass': '내 나침반 시작',
    'hero.browseVentures': '벤처 둘러보기',
    'nav.startCompass': '나침반 시작',
    'nav.signIn': '로그인',
    'compass.headline': '어디로 가고 싶으세요?',
    'common.pioneers': '개척자',
    'common.active': '활성',
    'common.home': '홈',
  },

  // ─── Turkish (Türkçe) — 80M+ speakers ────────────────────────
  tr: {
    'hero.headline': 'Ait olduğun yeri',
    'hero.belong': 'bul.',
    'hero.goThere': 'Oraya git.',
    'hero.startCompass': 'Pusulami Başlat',
    'hero.browseVentures': 'Ventures Gözat',
    'nav.startCompass': 'Pusula Başlat',
    'nav.signIn': 'Giriş Yap',
    'compass.headline': 'Nereye gitmek istiyorsun?',
    'common.pioneers': 'öncüler',
    'common.active': 'Aktif',
    'common.home': 'Ana Sayfa',
  },

  // ─── Indonesian/Malay (Bahasa) — 270M+ speakers ──────────────
  id: {
    'hero.headline': 'Temukan tempat Anda',
    'hero.belong': 'berada.',
    'hero.goThere': 'Pergi ke sana.',
    'hero.startCompass': 'Mulai Kompas Saya',
    'hero.browseVentures': 'Jelajahi Ventures',
    'nav.startCompass': 'Mulai Kompas',
    'nav.signIn': 'Masuk',
    'compass.headline': 'Ke mana Anda ingin pergi?',
    'common.pioneers': 'perintis',
    'common.active': 'Aktif',
    'common.home': 'Beranda',
  },
}

// ─── Translation Function ────────────────────────────────────────────

/**
 * Get a translation for a key in a specific language.
 * Falls back to English if the key is missing in the target language.
 * Supports interpolation: {varName} is replaced with the value from vars.
 */
export function translate(key: string, language: string, vars?: Record<string, string>): string {
  // Try exact language first, then language prefix (e.g. 'de-CH' → 'de')
  const langPrefix = language.split('-')[0].toLowerCase()
  const text = CONTENT[language]?.[key] ?? CONTENT[langPrefix]?.[key] ?? CONTENT.en[key] ?? key

  if (!vars) return text

  // Interpolate {varName} placeholders
  return text.replace(/\{(\w+)\}/g, (_, varName) => vars[varName] ?? `{${varName}}`)
}

/**
 * Get all available language codes that have translations
 */
export function getAvailableLanguages(): string[] {
  return Object.keys(CONTENT)
}

/**
 * Check if a language has a specific translation key
 */
export function hasTranslation(key: string, language: string): boolean {
  const langPrefix = language.split('-')[0].toLowerCase()
  return !!(CONTENT[language]?.[key] ?? CONTENT[langPrefix]?.[key])
}
