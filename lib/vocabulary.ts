/**
 * VOCABULARY.ts — Be[Network] platform language
 *
 * Global adoption-ready vocabulary. Each term is chosen for:
 *   - Universal comprehension across cultures
 *   - Positive, empowering connotation
 *   - Clean translation into major languages
 *   - Distinctive brand identity (no generic "job" / "employer" terms)
 *
 * Pioneer  = person seeking their path    (de: Pionier, fr: Pionnier, sw: Painia)
 * Anchor   = org offering paths           (de: Anker, fr: Ancre, sw: Nanga)
 * Path     = opportunity / position       (de: Pfad, fr: Chemin, sw: Njia)
 * Chapter  = engagement / application     (de: Kapitel, fr: Chapitre, sw: Sura)
 * Venture  = experience + path combined   (de: Wagnis, fr: Aventure, sw: Ujasiri)
 * Compass  = smart routing system         (de: Kompass, fr: Boussole, sw: Dira)
 * Gate     = country entry point          (de: Tor, fr: Porte, sw: Lango)
 * Route    = country corridor             (de: Route, fr: Route, sw: Njia)
 *
 * NEVER use: job, employer, candidate, application, booking, tour, search
 */

export const VOCAB = {
  pioneer: { singular: 'Pioneer', plural: 'Pioneers', verb: 'pioneering' },
  anchor: { singular: 'Anchor', plural: 'Anchors', verb: 'anchoring' },
  path: { singular: 'Path', plural: 'Paths', verb: 'path opening' },
  chapter: { singular: 'Chapter', plural: 'Chapters', verb: 'opening a chapter' },
  venture: { singular: 'Venture', plural: 'Ventures', verb: 'venturing' },
  gate: { singular: 'Gate', plural: 'Gates', verb: 'entering' },
  route: { singular: 'Route', plural: 'Routes', verb: 'routing' },
  compass: { singular: 'Compass', plural: 'Compasses', verb: 'navigating' },
  anchor_in: 'Connect', // verb for anchors accepting pioneers
  pioneer_join: 'Begin Your Path', // CTA for pioneers
  chapter_open: 'Open This Chapter', // CTA for applying
  network_name: 'The BeNetwork',
  tagline: 'Find where you belong. Go there.',
} as const

export type PioneerType = 'explorer' | 'professional' | 'artisan' | 'guardian' | 'creator' | 'healer'
// explorer = safari/nature guides, wildlife, eco-tourism
// professional = tech, finance, corporate
// artisan = fashion, craft, design
// guardian = security, logistics, ops
// creator = media, content, social
// healer = healthcare, wellness, community

export const PIONEER_TYPES: Record<PioneerType, { label: string; icon: string; description: string; sectors: string[] }> = {
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
