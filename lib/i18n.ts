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

    // Common
    'common.pioneers': 'pioneers',
    'common.active': 'Active',
    'common.home': 'Home',
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

    'common.pioneers': 'Pioniere',
    'common.active': 'Aktiv',
    'common.home': 'Startseite',
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

    'common.pioneers': 'waanzilishi',
    'common.active': 'Hai',
    'common.home': 'Nyumbani',
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

    'common.pioneers': 'pionniers',
    'common.active': 'Actif',
    'common.home': 'Accueil',
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
