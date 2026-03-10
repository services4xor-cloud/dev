/**
 * Mock / static data for the Business (BeKenya Family Ltd) page
 *
 * Extracted from app/business/page.tsx
 */

export const DIVISIONS = [
  {
    icon: '🦁',
    name: 'Safari & Experiences',
    description:
      'Wildlife safaris, eco-lodges, cultural tours, and premium destination packages across East Africa. Partner network includes Maasai Mara, Amboseli, and Tsavo conservancies.',
    ventures: [
      'Safari packages',
      'Eco-lodge partnerships',
      'Cultural immersion tours',
      'Airport transfers & ground logistics',
    ],
  },
  {
    icon: '👗',
    name: 'Fashion & Model Line',
    description:
      'Authentic African fashion, model scouting, and creative production. Bridging Kenyan designers with global markets.',
    ventures: [
      'Designer showcase',
      'Model scouting & management',
      'Fashion editorial production',
      'Cultural fashion exports',
    ],
  },
  {
    icon: '🎬',
    name: 'Media Production',
    description:
      'Video content, documentary production, photography, and social media content for partners and internal brands.',
    ventures: [
      'Safari documentary content',
      'Pioneer success stories',
      'Brand photography',
      'Social media content automation',
    ],
  },
  {
    icon: '💻',
    name: 'Digital Services',
    description:
      'The BeNetwork platform, API infrastructure, M-Pesa integrations, and technology services for partners and anchors.',
    ventures: [
      'BeNetwork platform (bekenya.com)',
      'M-Pesa payment infrastructure',
      'Partner API & booking systems',
      'Country config for global expansion',
    ],
  },
  {
    icon: '🤝',
    name: 'UTAMADUNI Charity',
    description:
      'Community development, youth mentorship, and skills training. 10% of all platform revenue directed here. UTAMADUNI means "culture" in Swahili — preserving what matters while building what is needed.',
    ventures: [
      'Youth skills training',
      'Pioneer scholarship fund',
      'Community infrastructure projects',
      'Cultural preservation grants',
    ],
  },
]

export const OPERATING_COUNTRIES = [
  {
    flag: '🇰🇪',
    code: 'KE',
    name: 'Kenya',
    role: 'Headquarters',
    details: 'Registered entity. M-Pesa payments. East Africa operations hub.',
    color: 'bg-green-900/20 border-green-700/30',
    badge: 'bg-green-900/40 text-green-400',
  },
  {
    flag: '🇩🇪',
    code: 'DE',
    name: 'Germany',
    role: 'EU Partner',
    details: 'EU market access. SEPA payments. Anchor partnerships across DACH region.',
    color: 'bg-blue-900/20 border-blue-700/30',
    badge: 'bg-blue-900/40 text-blue-400',
  },
]

export const SHARE_BLOCKS = [
  {
    label: 'Founding Shareholders',
    percent: 80,
    description: 'Core founders and strategic partners. Identities privacy-protected.',
    color: 'bg-[#5C0A14]',
    textColor: 'text-[#C9A227]',
  },
  {
    label: 'Reserved (UTAMADUNI & Growth)',
    percent: 20,
    description: 'Earmarked for charity arm and future expansion rounds.',
    color: 'bg-teal-500',
    textColor: 'text-teal-600',
  },
]
