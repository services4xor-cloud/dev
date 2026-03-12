/**
 * VOCABULARY.ts — Be[Network] Human Exchange Network language
 *
 * Global adoption-ready vocabulary. Each term is chosen for:
 *   - Universal comprehension across cultures
 *   - Positive, empowering connotation
 *   - Clean translation into major languages
 *   - Distinctive brand identity (no generic "job" / "employer" terms)
 *
 * Human Exchange Network vocabulary:
 *   Explorer = mode: person seeking connections, opportunities, places
 *   Host     = mode: person offering services, experiences, opportunities
 *   Opportunity = what Hosts create (replaces Path)
 *   Exchange = engagement between two humans (replaces Chapter)
 *   Experience = venture/activity (replaces Venture)
 *   Discovery = onboarding identity builder (replaces Compass)
 *   Hub      = country entry point (replaces Gate)
 *   Corridor = country-to-country connection (replaces Route)
 *
 * Legacy terms (Pioneer, Anchor, Path, etc.) kept for backward compatibility.
 *
 * NEVER use: job, employer, candidate, application, booking, tour, search
 */

export const VOCAB = {
  // ── Legacy (backward compat — will be removed in future cleanup) ──
  pioneer: { singular: 'Pioneer', plural: 'Pioneers', verb: 'pioneering' },
  anchor: { singular: 'Anchor', plural: 'Anchors', verb: 'anchoring' },
  path: { singular: 'Path', plural: 'Paths', verb: 'path opening' },
  chapter: { singular: 'Chapter', plural: 'Chapters', verb: 'opening a chapter' },
  venture: { singular: 'Venture', plural: 'Ventures', verb: 'venturing' },
  gate: { singular: 'Gate', plural: 'Gates', verb: 'entering' },
  route: { singular: 'Route', plural: 'Routes', verb: 'routing' },
  compass: { singular: 'Compass', plural: 'Compasses', verb: 'navigating' },
  anchor_in: 'Connect',
  pioneer_join: 'Begin Your Path',
  chapter_open: 'Open This Chapter',
  // ── Human Exchange Network vocabulary ──
  explorer: { singular: 'Explorer', plural: 'Explorers', verb: 'exploring' },
  host: { singular: 'Host', plural: 'Hosts', verb: 'hosting' },
  opportunity: { singular: 'Opportunity', plural: 'Opportunities', verb: 'offering' },
  exchange: { singular: 'Exchange', plural: 'Exchanges', verb: 'exchanging' },
  experience: { singular: 'Experience', plural: 'Experiences', verb: 'experiencing' },
  discovery: { singular: 'Discovery', plural: 'Discoveries', verb: 'discovering' },
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

export type PioneerType =
  | 'explorer'
  | 'professional'
  | 'artisan'
  | 'guardian'
  | 'creator'
  | 'healer'
// explorer = safari/nature guides, wildlife, eco-tourism
// professional = tech, finance, corporate
// artisan = fashion, craft, design
// guardian = security, logistics, ops
// creator = media, content, social
// healer = healthcare, wellness, community

export const PIONEER_TYPES: Record<
  PioneerType,
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

/** Pre-built select-option list for Pioneer type dropdowns */
export const PIONEER_TYPE_OPTIONS = Object.entries(PIONEER_TYPES).map(([key, val]) => ({
  value: key,
  label: `${val.icon} ${val.label}`,
}))

export const PATH_CATEGORIES = [
  { id: 'safari', label: 'Safari & Wilderness', icon: '🦁', venturetype: 'experience' },
  { id: 'marine', label: 'Marine & Ocean', icon: '🐋', venturetype: 'experience' },
  { id: 'tech', label: 'Technology', icon: '💻', venturetype: 'professional' },
  { id: 'finance', label: 'Finance & Banking', icon: '🏦', venturetype: 'professional' },
  { id: 'fashion', label: 'Fashion & Design', icon: '👗', venturetype: 'creative' },
  { id: 'media', label: 'Media & Content', icon: '🎬', venturetype: 'creative' },
  { id: 'health', label: 'Healthcare', icon: '🌿', venturetype: 'professional' },
  { id: 'education', label: 'Education', icon: '📚', venturetype: 'professional' },
  { id: 'charity', label: 'Community & Charity', icon: '🤝', venturetype: 'charity' },
  { id: 'ecotourism', label: 'Eco-Tourism', icon: '🌍', venturetype: 'experience' },
  { id: 'hospitality', label: 'Hospitality', icon: '🏡', venturetype: 'professional' },
  { id: 'logistics', label: 'Logistics & Supply', icon: '🚛', venturetype: 'professional' },
] as const
