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

    // Hero
    'hero.greeting': "We see you're in {geoName}. {geoGreeting}",
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
  },

  // ─── German (Deutsch) ────────────────────────────────────────
  de: {
    'nav.startCompass': 'Kompass starten',
    'nav.signIn': 'Anmelden',
    'nav.browseThreads': 'Alle Threads durchsuchen →',
    'nav.switchIdentity': 'Klicken um Identität zu wechseln',
    'nav.oneIdentity': 'Eine Plattform, jede Identität',

    'hero.greeting': 'Wir sehen, du bist in {geoName}. {geoGreeting}',
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

    'common.pioneers': 'Pioniere',
    'common.active': 'Aktiv',
    'common.home': 'Startseite',
    'common.back': 'Zurück',
    'common.loading': 'Laden...',
    'common.signIn': 'Anmelden',
    'common.signOut': 'Abmelden',
    'common.anchor': 'Anker',
  },

  // ─── Swahili (Kiswahili) ─────────────────────────────────────
  sw: {
    'nav.startCompass': 'Anza Dira',
    'nav.signIn': 'Ingia',
    'nav.browseThreads': 'Angalia mazungumzo yote →',
    'nav.switchIdentity': 'Bonyeza kubadilisha utambulisho',
    'nav.oneIdentity': 'Jukwaa moja, kila utambulisho',

    'hero.greeting': 'Tunaona uko {geoName}. {geoGreeting}',
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
  },

  // ─── French (Français) ────────────────────────────────────────
  fr: {
    'nav.startCompass': 'Lancer la Boussole',
    'nav.signIn': 'Se connecter',
    'nav.browseThreads': 'Parcourir tous les fils →',
    'nav.switchIdentity': "Cliquez pour changer d'identité",
    'nav.oneIdentity': 'Une plateforme, chaque identité',

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
