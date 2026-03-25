/** Browser-language greeting — shared across pages */
const GREETINGS: Record<string, string> = {
  en: 'Hello',
  de: 'Hallo',
  fr: 'Bonjour',
  es: 'Hola',
  pt: 'Olá',
  it: 'Ciao',
  nl: 'Hallo',
  pl: 'Cześć',
  ru: 'Привет',
  uk: 'Привіт',
  ja: 'こんにちは',
  ko: '안녕하세요',
  zh: '你好',
  ar: 'مرحبا',
  hi: 'नमस्ते',
  sw: 'Habari',
  tr: 'Merhaba',
  th: 'สวัสดี',
  vi: 'Xin chào',
  id: 'Halo',
  ms: 'Halo',
  ro: 'Bună',
  cs: 'Ahoj',
  hu: 'Szia',
  sv: 'Hej',
  no: 'Hei',
  da: 'Hej',
  fi: 'Hei',
  el: 'Γεια σου',
  he: 'שלום',
  bn: 'হ্যালো',
  ta: 'வணக்கம்',
  te: 'హలో',
  fa: 'سلام',
}

export function getBrowserGreeting(): string {
  if (typeof navigator === 'undefined') return GREETINGS.en
  const lang = navigator.language?.slice(0, 2)?.toLowerCase()
  return GREETINGS[lang] ?? GREETINGS.en
}
