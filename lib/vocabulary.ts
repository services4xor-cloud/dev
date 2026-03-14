/**
 * VOCABULARY.ts — Be[X] Human Exchange Network
 *
 * Every term chosen for: universal comprehension, positive connotation,
 * clean translation, distinctive brand identity.
 *
 * NEVER use: job, employer, candidate, application, booking, tour, search
 */

export const VOCAB = {
  // ── Core roles ──
  explorer: { singular: 'Explorer', plural: 'Explorers', verb: 'exploring' },
  host: { singular: 'Host', plural: 'Hosts', verb: 'hosting' },
  agent: { singular: 'Agent', plural: 'Agents', verb: 'connecting' },

  // ── Core objects ──
  opportunity: { singular: 'Opportunity', plural: 'Opportunities', verb: 'offering' },
  exchange: { singular: 'Exchange', plural: 'Exchanges', verb: 'exchanging' },
  experience: { singular: 'Experience', plural: 'Experiences', verb: 'experiencing' },
  discovery: { singular: 'Discovery', plural: 'Discoveries', verb: 'discovering' },

  // ── Places ──
  hub: { singular: 'Hub', plural: 'Hubs', verb: 'connecting' },
  corridor: { singular: 'Corridor', plural: 'Corridors', verb: 'routing' },

  // ── CTAs ──
  network_name: 'The BeNetwork',
  tagline: 'You are here. The world is connected to you.',
  explorer_cta: 'Explore',
  host_cta: 'Create Offering',
  connect_cta: 'Connect',
  discover_cta: 'Tell us who you are',
} as const

export type ExplorerType =
  | 'explorer'
  | 'professional'
  | 'artisan'
  | 'guardian'
  | 'creator'
  | 'healer'

export const EXPLORER_TYPES: Record<
  ExplorerType,
  { label: string; icon: string; description: string; sectors: string[] }
> = {
  explorer: {
    label: 'Explorer',
    icon: '🌿',
    description: 'Safari guides, eco-lodge staff, wildlife rangers, marine',
    sectors: ['Safari & Wildlife', 'Eco-Tourism', 'Marine & Fishing', 'Conservation'],
  },
  professional: {
    label: 'Professional',
    icon: '💼',
    description: 'Finance, tech, consulting, management',
    sectors: ['Technology', 'Finance & Banking', 'Consulting', 'Management'],
  },
  artisan: {
    label: 'Artisan',
    icon: '✨',
    description: 'Fashion, design, craft, beauty',
    sectors: ['Fashion & Design', 'Beauty & Wellness', 'Craft & Art', 'Jewelry'],
  },
  guardian: {
    label: 'Guardian',
    icon: '🛡️',
    description: 'Security, logistics, operations, infrastructure',
    sectors: ['Security', 'Logistics', 'Operations', 'Infrastructure'],
  },
  creator: {
    label: 'Creator',
    icon: '🎬',
    description: 'Media, content, photography, social media',
    sectors: ['Media & Content', 'Photography', 'Music & Entertainment', 'Digital Marketing'],
  },
  healer: {
    label: 'Healer',
    icon: '🌱',
    description: 'Healthcare, education, community, NGO',
    sectors: ['Healthcare', 'Education', 'Community Development', 'NGO & Charity'],
  },
}

export const EXPLORER_TYPE_OPTIONS = Object.entries(EXPLORER_TYPES).map(([key, val]) => ({
  value: key,
  label: `${val.icon} ${val.label}`,
}))
