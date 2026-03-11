/**
 * Mock / static data for the Charity (UTAMADUNI) page
 *
 * Extracted from app/charity/page.tsx
 */

export const IMPACT_STATS = [
  { number: '500+', label: 'Youth Trained', icon: '🎓' },
  { number: '12', label: 'Communities Reached', icon: '🌍' },
  { number: '3', label: 'Conservation Areas Supported', icon: '🌿' },
  { number: '20+', label: 'Women Mentored', icon: '👩' },
]

export const PILLARS = [
  {
    icon: '🎓',
    title: 'Education',
    subtitle: 'Skills for a dignified future',
    description:
      'Digital literacy, vocational training, and mentorship programs that give young Kenyans the tools to write their own story. From coding bootcamps to safari guide certification — every skill is a new door.',
    programs: [
      'Digital Literacy Bootcamps',
      'Vocational Certifications',
      'Scholarship Pathways',
      'Mentor Matching',
    ],
    color: 'from-blue-950/30 to-indigo-950/20',
    border: 'border-blue-900/50',
    accent: 'text-blue-400',
    badge: 'bg-blue-900/40 text-blue-300',
  },
  {
    icon: '👩',
    title: "Women's Empowerment",
    subtitle: 'Safe paths, strong futures',
    description:
      'Professional paths, safe opportunities, and community support for women seeking a better life. We work to provide alternatives to unsafe or exploitative work situations through dignity-first programming.',
    programs: [
      'Safe Path Program',
      'Professional Mentorship',
      'Business Skills Training',
      'Community Networks',
    ],
    color: 'from-purple-950/30 to-pink-950/20',
    border: 'border-purple-900/50',
    accent: 'text-purple-400',
    badge: 'bg-purple-900/40 text-purple-300',
  },
  {
    icon: '🌿',
    title: 'Conservation',
    subtitle: 'Protecting what we love',
    description:
      'Eco-tourism ventures that directly fund wildlife conservation. When you book a safari through BeKenya, a portion flows back to UTAMADUNI to support rangers, anti-poaching efforts, and conservation education.',
    programs: [
      'Anti-Poaching Support',
      'Ranger Training',
      'Conservation Education',
      'Eco-Tourism Revenue Sharing',
    ],
    color: 'from-green-950/30 to-emerald-950/20',
    border: 'border-green-900/50',
    accent: 'text-green-400',
    badge: 'bg-green-900/40 text-green-300',
  },
  {
    icon: '🎭',
    title: 'Cultural Preservation',
    subtitle: 'Our heritage, our strength',
    description:
      'Documenting, celebrating, and sharing Kenyan traditions with the world. From Maasai beadwork to Luo music — culture is not just heritage, it is a living economy that feeds communities with pride.',
    programs: [
      'Cultural Documentation',
      'Artisan Marketplaces',
      'Storytelling Archives',
      'Cultural Tourism',
    ],
    color: 'from-[#5C0A14]/30 to-[#5C0A14]/10',
    border: 'border-[#C9A227]/30',
    accent: 'text-[#C9A227]',
    badge: 'bg-[#C9A227]/20 text-[#C9A227]',
  },
]

export const STORIES = [
  {
    name: 'Wanjiru N.',
    location: 'Nairobi, Kenya',
    avatar: '👩🏾',
    title: 'From uncertainty to purpose',
    story:
      "Wanjiru came to UTAMADUNI after losing her office position during a difficult season. Through the Women's Empowerment program, she trained in hospitality management and found her path at a Naivasha eco-lodge. Today she manages a team of 8 and trains new staff.",
    outcome: 'Eco-lodge manager, Naivasha',
    pillar: "Women's Empowerment",
  },
  {
    name: 'Baraka M.',
    location: 'Maasai Mara, Kenya',
    avatar: '👨🏾',
    title: 'The ranger who became a guide',
    story:
      "Baraka grew up near the Mara. UTAMADUNI's Conservation program connected him with a ranger certification course. He now leads sunrise game drives for international Pioneers visiting through BeKenya — and sends remittances to his family every month.",
    outcome: 'Senior Safari Guide, Maasai Mara',
    pillar: 'Conservation',
  },
  {
    name: 'Aisha K.',
    location: 'Lamu, Kenya',
    avatar: '👩🏾',
    title: 'Weaving tradition into livelihood',
    story:
      "Aisha's grandmother taught her the ancient craft of Swahili basket weaving. UTAMADUNI's Cultural Preservation program helped her create an online artisan profile on BeKenya's marketplace. She now ships her baskets to Germany, the UK, and the UAE.",
    outcome: 'Artisan entrepreneur, global marketplace',
    pillar: 'Cultural Preservation',
  },
]

export const PARTNER_TYPES = [
  {
    icon: '🏫',
    label: 'Schools & Children Homes',
    desc: "Feeding programs, education support — incl. Suvia Children's Home",
  },
  {
    icon: '🤝',
    label: 'FessyTours & Local Partners',
    desc: 'Joint safari programs, community feeding initiatives',
  },
  { icon: '🏢', label: 'Corporate Sponsors', desc: 'CSR investment, skills matching' },
  {
    icon: '🌍',
    label: 'International Organizations',
    desc: 'Bilateral programs, grant partnerships',
  },
]

/** Real charity programs operating through BeKenya Family Ltd */
export const ACTIVE_PROGRAMS = [
  {
    id: 'plate-for-african-child',
    name: 'A Plate for African Child',
    partner: 'FessyTours × BeKenya Family',
    location: "Suvia Children's Home, Kenya",
    host: 'Mr. Mwanzia',
    description:
      'Feeding and inspiring children through community engagement — cooking, games, music, and motivational talks.',
    activities: [
      'Cooking with children',
      'Games & competitions',
      'Shared meals',
      'Music & performances',
      'Motivational talks',
    ],
    status: 'active' as const,
  },
]
