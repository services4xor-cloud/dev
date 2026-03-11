/**
 * Mock Homepage Data — single source of truth
 *
 * Used by: homepage (app/page.tsx)
 */

export const COUNTRY_GREETINGS: Record<string, { greeting: string; flag: string; name: string }> = {
  KE: { greeting: 'Habari! Ready for your next chapter?', flag: '🇰🇪', name: 'Kenya' },
  DE: { greeting: 'Guten Tag! Ready for your next chapter?', flag: '🇩🇪', name: 'Germany' },
  US: { greeting: 'Hello! Ready for your next chapter?', flag: '🇺🇸', name: 'the USA' },
  NG: { greeting: 'Ẹ káàárọ̀! Ready for your next chapter?', flag: '🇳🇬', name: 'Nigeria' },
  GB: { greeting: 'Good day! Ready for your next chapter?', flag: '🇬🇧', name: 'the UK' },
  AE: { greeting: 'Marhaba! Ready for your next chapter?', flag: '🇦🇪', name: 'UAE' },
  UG: { greeting: 'Wassuwa! Ready for your next chapter?', flag: '🇺🇬', name: 'Uganda' },
  TZ: { greeting: 'Karibu! Ready for your next chapter?', flag: '🇹🇿', name: 'Tanzania' },
  DEFAULT: { greeting: 'Ready for your next chapter?', flag: '🌍', name: 'your country' },
}

export const ROTATING_FLAGS = [
  '🇰🇪',
  '🇩🇪',
  '🇺🇸',
  '🇳🇬',
  '🇬🇧',
  '🇦🇪',
  '🇺🇬',
  '🇹🇿',
  '🇫🇷',
  '🇨🇦',
  '🇦🇺',
  '🇸🇦',
]

export const BENETWORK_PILLARS = [
  {
    icon: '🌿',
    for: 'For Pioneers',
    subtitle: "(That's you, if you're seeking)",
    desc: 'Find your path. Cross a border. Become something remarkable. Your compass is ready.',
    cta: 'Start My Journey',
    href: '/compass',
    gradient: 'from-[#5C0A14] to-[#3a0710]',
    accent: 'text-[#C9A227]',
  },
  {
    icon: '🏢',
    for: 'For Anchors',
    subtitle: '(Organizations that open doors)',
    desc: 'Find real talent. Grow with Africa. Post a Path and watch Pioneers find you.',
    cta: 'Post a Path',
    href: '/anchors/post-path',
    gradient: 'from-[#5C0A14] to-[#3a0710]',
    accent: 'text-[#C9A227]',
  },
  {
    icon: '🦁',
    for: 'For Explorers',
    subtitle: '(Safaris, marine, eco-experiences)',
    desc: "Kenya's wildest ventures — deep sea fishing, Maasai Mara, Tsavo. Book an experience that changes you.",
    cta: 'Browse Ventures',
    href: '/ventures',
    gradient: 'from-[#5C0A14] to-[#3a0710]',
    accent: 'text-[#C9A227]',
  },
]

export const FROM_COUNTRIES = [
  'Kenya',
  'Nigeria',
  'Uganda',
  'Tanzania',
  'South Africa',
  'Ghana',
  'Ethiopia',
  'Germany',
  'UK',
  'USA',
]
export const TO_COUNTRIES = [
  'UAE',
  'UK',
  'Germany',
  'USA',
  'Canada',
  'Kenya',
  'Saudi Arabia',
  'Qatar',
  'Australia',
  'Singapore',
]

export const TESTIMONIALS = [
  {
    name: 'Wanjiru N.',
    flag: '🇰🇪',
    from: 'Nairobi → Maasai Mara',
    type: 'Explorer Pioneer',
    quote:
      'I found my path as an eco-lodge guide through BeKenya. Now I lead safaris for German tourists and earn more than I ever thought possible.',
    avatar: 'WN',
    avatarBg: 'bg-green-600',
  },
  {
    name: 'Baraka O.',
    flag: '🇰🇪',
    from: 'Nairobi → Dubai',
    type: 'Professional Pioneer',
    quote:
      'From Nairobi to Dubai — BeKenya matched me with a hospitality group in 3 weeks. The compass knew exactly where I belonged.',
    avatar: 'BO',
    avatarBg: 'bg-[#5C0A14]',
  },
  {
    name: 'Aisha M.',
    flag: '🇸🇦',
    from: 'NGO Anchor',
    type: 'Healthcare Anchor',
    quote:
      'As an NGO anchor, we found 4 healthcare pioneers in one week. BeKenya understands what real talent looks like.',
    avatar: 'AM',
    avatarBg: 'bg-gray-700',
  },
]

export const BE_COUNTRIES = [
  { flag: '🇰🇪', name: 'BeKenya', status: 'live' as const, href: '/' },
  { flag: '🇩🇪', name: 'BeGermany', status: 'soon' as const, href: '#' },
  { flag: '🇺🇸', name: 'BeAmerica', status: 'soon' as const, href: '#' },
  { flag: '🇳🇬', name: 'BeNigeria', status: 'soon' as const, href: '#' },
  { flag: '🇬🇧', name: 'BeUK', status: 'soon' as const, href: '#' },
  { flag: '🇦🇪', name: 'BeUAE', status: 'soon' as const, href: '#' },
]
