/**
 * Constants for the Post Path wizard
 *
 * Extracted from app/anchors/post-path/page.tsx
 */

export const CURRENCIES = [
  { code: 'KES', label: 'KES — Kenyan Shilling', flag: '🇰🇪' },
  { code: 'USD', label: 'USD — US Dollar', flag: '🇺🇸' },
  { code: 'EUR', label: 'EUR — Euro', flag: '🇪🇺' },
  { code: 'GBP', label: 'GBP — British Pound', flag: '🇬🇧' },
  { code: 'AED', label: 'AED — UAE Dirham', flag: '🇦🇪' },
  { code: 'NGN', label: 'NGN — Nigerian Naira', flag: '🇳🇬' },
  { code: 'ZAR', label: 'ZAR — South African Rand', flag: '🇿🇦' },
]

export const PAYMENT_ACCEPTED = [
  { id: 'mpesa', label: 'M-Pesa', icon: '📱', desc: 'Kenya & East Africa' },
  { id: 'stripe', label: 'Stripe / Card', icon: '💳', desc: 'Global cards' },
  { id: 'flutterwave', label: 'Flutterwave', icon: '🌍', desc: 'African mobile money' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'International' },
  { id: 'bank', label: 'Bank Transfer', icon: '🏦', desc: 'SWIFT / SEPA' },
]

export const SUGGESTED_SKILLS: Record<string, string[]> = {
  safari: [
    'Wildlife guiding',
    'Big Five tracking',
    'FGASA certification',
    'Swahili',
    'Bush safety',
    'Night drives',
    'Birding',
    'Conservation',
    'German language',
    'First aid',
  ],
  marine: [
    'Scuba diving',
    'Snorkelling guide',
    'Marine biology',
    'Boat operations',
    'PADI certification',
    'Fish identification',
  ],
  tech: [
    'JavaScript',
    'Python',
    'React',
    'Node.js',
    'AWS',
    'Data analysis',
    'Product management',
    'DevOps',
    'Mobile development',
  ],
  finance: [
    'Financial analysis',
    'CPA',
    'ACCA',
    'Excel',
    'Risk management',
    'Investment banking',
    'KYC/AML',
  ],
  fashion: [
    'Fashion design',
    'Pattern making',
    'Illustration',
    'Adobe Illustrator',
    'Textile sourcing',
    'Brand management',
  ],
  media: [
    'Video production',
    'Photography',
    'Drone operation',
    'Final Cut Pro',
    'Adobe Suite',
    'Social media',
    'Storytelling',
  ],
  health: [
    'Nursing',
    'Community health',
    'First aid',
    'Health education',
    'Epidemiology',
    'Mental health',
  ],
  education: [
    'Teaching',
    'Curriculum design',
    'English tutoring',
    'TESOL',
    'Special needs',
    'Lesson planning',
  ],
  charity: [
    'Community development',
    'NGO management',
    'Grant writing',
    'Project management',
    'M&E',
  ],
  ecotourism: [
    'Eco-lodge management',
    'Sustainability',
    'Carbon offsetting',
    'Nature guiding',
    'Camp logistics',
  ],
  hospitality: [
    'Hotel management',
    'F&B',
    'Front of house',
    'Revenue management',
    'Customer experience',
  ],
  logistics: [
    'Supply chain',
    'Fleet management',
    'Warehouse',
    'Import/export',
    'Last-mile delivery',
  ],
}

export const POST_PATH_STEPS = [
  { num: 1, label: 'Basics' },
  { num: 2, label: 'Description' },
  { num: 3, label: 'Skills' },
  { num: 4, label: 'Pioneers' },
  { num: 5, label: 'Compensation' },
  { num: 6, label: 'Preview' },
]
