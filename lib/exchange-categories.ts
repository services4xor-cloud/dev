export interface ExchangeCategory {
  id: string
  label: string
  icon: string
  description: string
  /** i18n key for label */
  i18nKey: string
}

export const EXCHANGE_CATEGORIES: ExchangeCategory[] = [
  {
    id: 'culture',
    label: 'Culture & Language',
    icon: '🌍',
    description: 'Cultural exchange, language teaching, traditions',
    i18nKey: 'category.culture',
  },
  {
    id: 'tech',
    label: 'Technology',
    icon: '💻',
    description: 'Software, hardware, engineering, AI',
    i18nKey: 'category.tech',
  },
  {
    id: 'safari',
    label: 'Safari & Wildlife',
    icon: '🦁',
    description: 'Game drives, conservation, eco-tourism',
    i18nKey: 'category.safari',
  },
  {
    id: 'health',
    label: 'Health & Wellness',
    icon: '❤️',
    description: 'Healthcare, fitness, mental health, nutrition',
    i18nKey: 'category.health',
  },
  {
    id: 'fashion',
    label: 'Art & Fashion',
    icon: '🎨',
    description: 'Design, clothing, craft, beauty',
    i18nKey: 'category.fashion',
  },
  {
    id: 'media',
    label: 'Media & Content',
    icon: '📱',
    description: 'Photography, video, social media, music',
    i18nKey: 'category.media',
  },
  {
    id: 'trade',
    label: 'Trade & Investment',
    icon: '💰',
    description: 'Business, gold, agriculture, import/export',
    i18nKey: 'category.trade',
  },
  {
    id: 'education',
    label: 'Education',
    icon: '📚',
    description: 'Teaching, mentorship, courses, skills training',
    i18nKey: 'category.education',
  },
  {
    id: 'hospitality',
    label: 'Hospitality',
    icon: '🏨',
    description: 'Hotels, restaurants, travel, tourism',
    i18nKey: 'category.hospitality',
  },
  {
    id: 'agriculture',
    label: 'Agriculture',
    icon: '🌿',
    description: 'Farming, livestock, agritech, food',
    i18nKey: 'category.agriculture',
  },
  {
    id: 'engineering',
    label: 'Engineering',
    icon: '🔧',
    description: 'Construction, mechanics, energy, mining',
    i18nKey: 'category.engineering',
  },
  {
    id: 'community',
    label: 'Community',
    icon: '🤝',
    description: 'NGOs, charity, volunteering, social impact',
    i18nKey: 'category.community',
  },
]

/** Get category by ID */
export function getCategoryById(id: string): ExchangeCategory | undefined {
  return EXCHANGE_CATEGORIES.find((c) => c.id === id)
}

/** Get categories by IDs */
export function getCategoriesByIds(ids: string[]): ExchangeCategory[] {
  return EXCHANGE_CATEGORIES.filter((c) => ids.includes(c.id))
}
