/**
 * Mock / static data for the Fashion (BeKenya Fashion Division) page
 *
 * Extracted from app/fashion/page.tsx
 */

export const FASHION_PATHS = [
  {
    id: 1,
    title: 'Catalog Model for Kenya Tourism Board',
    type: 'Model',
    rate: 'KES 8,000/day',
    description:
      'Represent Kenya in international tourism campaigns. Professional photoshoots in iconic Kenyan landscapes.',
    tags: ['Photoshoot', 'Tourism', 'Commercial'],
    emoji: '👗',
  },
  {
    id: 2,
    title: 'Textile Designer at Nairobi Fashion Week',
    type: 'Designer',
    rate: 'KES 45,000/month',
    description:
      'Sketch to stitch. Design collections featuring authentic African prints for Nairobi Fashion Week showcases.',
    tags: ['Textile', 'African Prints', 'Fashion Week'],
    emoji: '✂️',
  },
  {
    id: 3,
    title: 'Brand Photographer (Remote Possible)',
    type: 'Creative',
    rate: 'KES 60,000/month',
    description:
      'Capture brand stories for fashion houses. Portfolio building, creative direction, remote-friendly.',
    tags: ['Photography', 'Branding', 'Remote'],
    emoji: '📸',
  },
]

export const FASHION_PARTNER_ANCHORS = [
  {
    name: 'Kenya Tourism Board',
    focus: 'International tourism campaigns targeting European and US markets',
    logo: '🇰🇪',
  },
  {
    name: 'Nairobi Fashion Week',
    focus: "East Africa's premier fashion showcase — African designers to global stage",
    logo: '👑',
  },
  {
    name: 'Kitenge Print Co',
    focus: 'Local fabric production using authentic Kenyan and East African prints',
    logo: '🎨',
  },
]

export const FASHION_PROTECTIONS = [
  {
    icon: '📄',
    title: 'Contracts First',
    description: 'All contracts reviewed by Pioneer before any shoot begins. No surprises.',
  },
  {
    icon: '💰',
    title: 'Pioneer Sets Rates',
    description: 'You name your rate. Anchor matches it. No exploitation, no race to the bottom.',
  },
  {
    icon: '🛡️',
    title: 'Chaperone Service',
    description:
      'A BeKenya chaperone available for every shoot. Never alone if you prefer not to be.',
  },
  {
    icon: '✅',
    title: 'All Work Compensated',
    description: 'No unpaid "test" shoots. Every call, every fitting, every shoot is paid work.',
  },
]
