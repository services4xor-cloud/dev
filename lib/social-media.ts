// lib/social-media.ts
// Social media automation layer for Be[Country] platform
// Each country gets the platforms most used there
// User provides API keys (see TODO_HUMAN.md)
// Automates: job/path posts, safari packages, charity updates, event announcements

export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'whatsapp_business'
  | 'twitter_x'
  | 'linkedin'
  | 'youtube'
  | 'telegram'
  | 'snapchat'

export interface SocialConfig {
  platform: SocialPlatform
  displayName: string
  icon: string
  primaryCountries: string[] // ISO2 codes where this platform dominates
  contentTypes: ('image' | 'video' | 'story' | 'reel' | 'text' | 'document')[]
  bestFor: string[] // what content works best
  apiEnvVars: string[] // env var names needed (add to .env.local)
  apiDocs: string
  automationCapabilities: string[]
}

export const SOCIAL_CONFIGS: Record<SocialPlatform, SocialConfig> = {
  instagram: {
    platform: 'instagram',
    displayName: 'Instagram',
    icon: '📸',
    primaryCountries: ['KE', 'DE', 'US', 'GB', 'NG', 'ZA', 'AE', 'IN'],
    contentTypes: ['image', 'video', 'story', 'reel'],
    bestFor: [
      'Safari photos',
      'Fashion shoots',
      'Venue highlights',
      'Success stories',
      'Charity moments',
    ],
    apiEnvVars: [
      'INSTAGRAM_ACCESS_TOKEN',
      'INSTAGRAM_BUSINESS_ACCOUNT_ID',
      'FACEBOOK_APP_ID',
      'FACEBOOK_APP_SECRET',
    ],
    apiDocs: 'https://developers.facebook.com/docs/instagram-api',
    automationCapabilities: [
      'Auto-post safari packages with images',
      'Auto-post new paths (opportunities)',
      'Story for new pioneer success',
      'Reel for charity events',
    ],
  },
  tiktok: {
    platform: 'tiktok',
    displayName: 'TikTok',
    icon: '🎵',
    primaryCountries: ['KE', 'US', 'GB', 'DE', 'NG', 'ZA', 'IN', 'AE'],
    contentTypes: ['video', 'story'],
    bestFor: [
      'Safari action videos',
      'Day-in-the-life of pioneers',
      'Wildlife moments',
      'Cultural content',
      'Before/after success stories',
    ],
    apiEnvVars: ['TIKTOK_ACCESS_TOKEN', 'TIKTOK_CLIENT_KEY', 'TIKTOK_CLIENT_SECRET'],
    apiDocs: 'https://developers.tiktok.com/',
    automationCapabilities: [
      'Clip compilations of safari packages',
      'Behind-the-scenes content',
      'Trend-based challenge posts',
    ],
  },
  whatsapp_business: {
    platform: 'whatsapp_business',
    displayName: 'WhatsApp Business',
    icon: '💬',
    primaryCountries: ['KE', 'NG', 'GH', 'ZA', 'IN', 'DE', 'GB', 'AE', 'TZ', 'UG'],
    contentTypes: ['text', 'document', 'image'],
    bestFor: [
      'Direct pioneer notifications',
      'Booking confirmations',
      'New path alerts',
      'Safari package promotions',
      'Payment receipts',
    ],
    apiEnvVars: [
      'WHATSAPP_ACCESS_TOKEN',
      'WHATSAPP_PHONE_NUMBER_ID',
      'WHATSAPP_BUSINESS_ACCOUNT_ID',
    ],
    apiDocs: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    automationCapabilities: [
      'Auto-notify pioneers of new matching paths',
      'Booking confirmation messages',
      'Payment receipts',
      'Weekly opportunity digest',
      'Safari package enquiries',
    ],
  },
  facebook: {
    platform: 'facebook',
    displayName: 'Facebook',
    icon: '👥',
    primaryCountries: ['KE', 'NG', 'GH', 'ZA', 'TZ', 'UG', 'IN', 'PH'],
    contentTypes: ['image', 'video', 'text'],
    bestFor: [
      'Community groups',
      'Events',
      'Package promotions',
      'Long-form success stories',
      'Charity updates',
    ],
    apiEnvVars: [
      'FACEBOOK_PAGE_ACCESS_TOKEN',
      'FACEBOOK_PAGE_ID',
      'FACEBOOK_APP_ID',
      'FACEBOOK_APP_SECRET',
    ],
    apiDocs: 'https://developers.facebook.com/docs/pages-api',
    automationCapabilities: [
      'Post new safari packages to page',
      'Share charity milestones',
      'Event creation for webinars/meetups',
      'Auto-respond to common enquiries',
    ],
  },
  twitter_x: {
    platform: 'twitter_x',
    displayName: 'Twitter / X',
    icon: '🐦',
    primaryCountries: ['KE', 'NG', 'ZA', 'US', 'GB', 'DE'],
    contentTypes: ['text', 'image'],
    bestFor: [
      'Platform updates',
      'Pioneer success stories',
      'Industry news',
      'Trending opportunities',
      'Charity milestones',
    ],
    apiEnvVars: [
      'TWITTER_API_KEY',
      'TWITTER_API_SECRET',
      'TWITTER_ACCESS_TOKEN',
      'TWITTER_ACCESS_TOKEN_SECRET',
    ],
    apiDocs: 'https://developer.twitter.com/en/docs/twitter-api',
    automationCapabilities: [
      'Auto-tweet new featured paths',
      'Milestone announcements',
      'Trending sector reports',
    ],
  },
  linkedin: {
    platform: 'linkedin',
    displayName: 'LinkedIn',
    icon: '💼',
    primaryCountries: ['DE', 'US', 'GB', 'CA', 'AE', 'KE', 'NG', 'ZA'],
    contentTypes: ['text', 'image', 'document', 'video'],
    bestFor: [
      'Professional path announcements',
      'Anchor (employer) stories',
      'Industry insights',
      'Career milestones',
      'Partnership announcements',
    ],
    apiEnvVars: ['LINKEDIN_ACCESS_TOKEN', 'LINKEDIN_ORGANIZATION_ID'],
    apiDocs: 'https://docs.microsoft.com/en-us/linkedin/marketing/',
    automationCapabilities: [
      'Post professional paths to company page',
      'Share pioneer success stories',
      'Publish anchor (employer) spotlights',
    ],
  },
  youtube: {
    platform: 'youtube',
    displayName: 'YouTube',
    icon: '▶️',
    primaryCountries: ['KE', 'NG', 'ZA', 'DE', 'US', 'GB', 'IN'],
    contentTypes: ['video'],
    bestFor: [
      'Safari documentary content',
      'Pioneer journey vlogs',
      'Charity project documentation',
      'Destination guides',
      'Cultural content',
    ],
    apiEnvVars: [
      'YOUTUBE_API_KEY',
      'YOUTUBE_CHANNEL_ID',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
    ],
    apiDocs: 'https://developers.google.com/youtube/v3',
    automationCapabilities: [
      'Upload safari package highlight reels',
      'Charity project documentation',
      'Destination guides',
    ],
  },
  telegram: {
    platform: 'telegram',
    displayName: 'Telegram',
    icon: '✈️',
    primaryCountries: ['KE', 'NG', 'DE', 'IN', 'UG', 'TZ'],
    contentTypes: ['text', 'image', 'document'],
    bestFor: [
      'Channel broadcasts',
      'Opportunity digests',
      'Community groups',
      'Document sharing',
    ],
    apiEnvVars: ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHANNEL_ID'],
    apiDocs: 'https://core.telegram.org/bots/api',
    automationCapabilities: [
      'Daily opportunity digest channel',
      'New path alerts',
      'Charity updates',
      'Safari availability broadcasts',
    ],
  },
  snapchat: {
    platform: 'snapchat',
    displayName: 'Snapchat',
    icon: '👻',
    primaryCountries: ['US', 'GB', 'DE', 'AE', 'SA'],
    contentTypes: ['image', 'video', 'story'],
    bestFor: ['Youth audience', 'Quick safari moments', 'Destination teasers'],
    apiEnvVars: ['SNAPCHAT_ACCESS_TOKEN', 'SNAPCHAT_AD_ACCOUNT_ID'],
    apiDocs: 'https://marketingapi.snapchat.com/docs/',
    automationCapabilities: [
      'Story updates for safari packages',
      'Youth-targeted opportunity content',
    ],
  },
}

// Get platforms relevant for a given country, sorted by position in primaryCountries
export function getPlatformsForCountry(countryCode: string): SocialConfig[] {
  return Object.values(SOCIAL_CONFIGS)
    .filter(c => c.primaryCountries.includes(countryCode))
    .sort((a, b) => {
      const aIdx = a.primaryCountries.indexOf(countryCode)
      const bIdx = b.primaryCountries.indexOf(countryCode)
      return aIdx - bIdx
    })
}

// Collect the distinct env var names required to operate a set of platforms
export function getRequiredEnvVars(platforms: SocialPlatform[]): string[] {
  const vars = new Set<string>()
  platforms.forEach(p => SOCIAL_CONFIGS[p].apiEnvVars.forEach(v => vars.add(v)))
  return Array.from(vars).sort()
}

// ──────────────────────────────────────────────
// Post types
// ──────────────────────────────────────────────

export type PostType =
  | 'new_path'
  | 'safari_package'
  | 'pioneer_success'
  | 'charity_update'
  | 'anchor_spotlight'
  | 'seasonal_promotion'

export type PostStatus = 'draft' | 'scheduled' | 'posted' | 'failed'

export interface SocialPost {
  id: string
  type: PostType
  title: string
  body: string
  imageUrl?: string
  link?: string
  platforms: SocialPlatform[]
  scheduledFor?: Date
  status: PostStatus
  countryCode: string
  createdAt: Date
  updatedAt: Date
  /** Per-platform delivery result — populated after posting */
  results?: Partial<Record<SocialPlatform, { success: boolean; postId?: string; error?: string }>>
}

// ──────────────────────────────────────────────
// Copy generator
// ──────────────────────────────────────────────

/**
 * Generate platform-native copy for a venture/path announcement.
 * Each platform has its own tone, length, and hashtag conventions.
 */
export function generatePathPostCopy(
  pathTitle: string,
  anchor: string,
  location: string,
  ventureType: string,
): Record<SocialPlatform, string> {
  const tag = ventureType.replace(/\s+/g, '')
  return {
    instagram: `🌍 New Path Open!\n\n${pathTitle} at ${anchor}, ${location}\n\nReady to begin your chapter?\n\n#BeKenya #PioneerLife #${tag} #AfricaWorks`,
    tiktok: `New path just dropped 🔥 ${pathTitle} — ${anchor} in ${location}. Link in bio to open your chapter! #BeKenya #Pioneer`,
    whatsapp_business: `🌟 *New Path Open on BeNetwork*\n\n*${pathTitle}*\n📍 ${anchor}, ${location}\n\nReady to begin your chapter? Open the app to see full details and start your journey.\n\n_BeKenya — Find where you belong._`,
    facebook: `🌍 A new path just opened on BeNetwork!\n\n${pathTitle} at ${anchor} in ${location}.\n\nAre you a Pioneer ready to take the next step? Click below to open this chapter. 👇`,
    twitter_x: `New path open: ${pathTitle} @ ${anchor}, ${location} 🌍 Open your chapter now → #BeKenya #Pioneer`,
    linkedin: `A new opportunity has opened on the BeNetwork: ${pathTitle} at ${anchor}, ${location}.\n\nIf you're a professional Pioneer looking to begin your next chapter, this is your route. #BeKenya #BeNetwork #CareerPath`,
    youtube: `New Path Feature: ${pathTitle} at ${anchor}, ${location} — watch the anchor story and see if this is your chapter.`,
    telegram: `🌍 New Path: ${pathTitle}\n📍 ${anchor}, ${location}\n\nOpen this chapter on BeNetwork now.`,
    snapchat: `New path 👀 ${pathTitle} — ${location} 🌍`,
  }
}

/**
 * Generate copy for a safari package announcement.
 */
export function generateSafariPostCopy(
  packageTitle: string,
  nights: number,
  priceKes: number,
  location: string,
): Record<SocialPlatform, string> {
  const price = priceKes.toLocaleString('en-US')
  return {
    instagram: `🦁 ${packageTitle}\n\n📍 ${location} · ${nights} nights · KES ${price}\n\nBook now — limited spots!\n\n#BeKenya #Safari #Kenya #WildlifeSafari #AfricaSafari`,
    tiktok: `Safari time 🦒 ${packageTitle} in ${location} — ${nights} nights from KES ${price}. Link in bio! #Safari #Kenya #BeKenya`,
    whatsapp_business: `🦁 *Safari Package Available*\n\n*${packageTitle}*\n📍 ${location}\n🌙 ${nights} nights\n💰 From KES ${price}\n\nReply to enquire or book your spot.`,
    facebook: `🦁 New Safari Package: ${packageTitle}\n\n📍 ${location} · ${nights} nights · From KES ${price}\n\nSpots are limited — click to view the full itinerary and book your adventure! 🌅`,
    twitter_x: `🦁 ${packageTitle} — ${nights} nights in ${location} from KES ${price}. Book your Kenya safari → #BeKenya #Safari`,
    linkedin: `BeKenya is now offering premium safari experiences: ${packageTitle} in ${location}. ${nights} nights from KES ${price}. Ideal for corporate retreats and team incentive trips. #BeKenya #Safari #Kenya`,
    youtube: `${packageTitle} — ${nights}-Night Safari in ${location} | Full Package Tour | BeKenya Experiences`,
    telegram: `🦁 Safari Package: ${packageTitle}\n📍 ${location} · ${nights} nights · KES ${price}\n\nEnquire now on BeKenya.`,
    snapchat: `🦁 ${packageTitle} — ${location} — ${nights} nights — KES ${price}`,
  }
}
