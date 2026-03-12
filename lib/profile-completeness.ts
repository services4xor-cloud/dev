/**
 * Profile Completeness Engine
 *
 * Computes a completeness score (0-100) from identity dimensions.
 * Each filled dimension earns weight toward the total.
 * Used by JourneyProgress and Me page to guide users toward a complete profile.
 *
 * Self-enrichment principle: A complete profile → better matching → better Exchange results.
 * The system rewards completeness by making matches more relevant.
 */

export interface CompletenessResult {
  /** Overall score 0-100 */
  score: number
  /** Breakdown per dimension */
  dimensions: DimensionStatus[]
  /** Suggested next action */
  nextAction: { dimension: string; label: string; route: string } | null
  /** Matching multiplier based on completeness */
  matchBoost: number
}

export interface DimensionStatus {
  key: string
  label: string
  icon: string
  filled: boolean
  /** Weight toward total score */
  weight: number
  /** Route to fill this dimension */
  route: string
}

interface IdentityInput {
  country: string
  language: string
  languages: string[]
  interests: string[]
  faith: string[]
  craft: string[]
  reach: string[]
  culture?: string
  city?: string
  mode?: 'explorer' | 'host'
}

/**
 * Compute profile completeness from identity dimensions.
 *
 * Weight distribution (total = 100):
 *   Language(s): 15  — primary communication axis
 *   Craft/Skills: 15 — what you can offer
 *   Interests: 12    — what exchanges you seek
 *   Location: 12     — country + city
 *   Reach: 10        — travel/host capacity
 *   Faith: 8         — optional but enriches matching
 *   Culture: 8       — tribal/ethnic identity
 *   Mode: 5          — explorer vs host
 *   Country set: 5   — base identity
 *   Bio/profile: 10  — human context
 */
export function computeCompleteness(
  identity: IdentityInput,
  hasBio: boolean = false,
  hasHeadline: boolean = false
): CompletenessResult {
  const dimensions: DimensionStatus[] = [
    {
      key: 'country',
      label: 'Country',
      icon: '🌍',
      filled: !!identity.country,
      weight: 5,
      route: '/',
    },
    {
      key: 'language',
      label: 'Languages',
      icon: '🗣',
      filled: identity.languages.length > 0,
      weight: 15,
      route: '/me',
    },
    {
      key: 'craft',
      label: 'Craft & Skills',
      icon: '🔧',
      filled: identity.craft.length > 0,
      weight: 15,
      route: '/me',
    },
    {
      key: 'interests',
      label: 'Passions',
      icon: '❤️',
      filled: identity.interests.length > 0,
      weight: 12,
      route: '/me',
    },
    {
      key: 'location',
      label: 'City',
      icon: '📍',
      filled: !!identity.city,
      weight: 12,
      route: '/me',
    },
    {
      key: 'reach',
      label: 'Reach',
      icon: '🌐',
      filled: identity.reach.length > 0,
      weight: 10,
      route: '/me',
    },
    {
      key: 'faith',
      label: 'Faith',
      icon: '🙏',
      filled: identity.faith.length > 0,
      weight: 8,
      route: '/me',
    },
    {
      key: 'culture',
      label: 'Culture',
      icon: '🌿',
      filled: !!identity.culture,
      weight: 8,
      route: '/me',
    },
    {
      key: 'mode',
      label: 'Mode',
      icon: '🧭',
      filled: !!identity.mode,
      weight: 5,
      route: '/me',
    },
    {
      key: 'bio',
      label: 'Bio & Headline',
      icon: '📝',
      filled: hasBio || hasHeadline,
      weight: 10,
      route: '/me',
    },
  ]

  const filledWeight = dimensions.filter((d) => d.filled).reduce((sum, d) => sum + d.weight, 0)
  const totalWeight = dimensions.reduce((sum, d) => sum + d.weight, 0)
  const score = Math.round((filledWeight / totalWeight) * 100)

  // First unfilled dimension as next action
  const nextUnfilled = dimensions.find((d) => !d.filled)
  const nextAction = nextUnfilled
    ? { dimension: nextUnfilled.key, label: nextUnfilled.label, route: nextUnfilled.route }
    : null

  // Matching boost: more complete profiles get better matches
  // 0-30%: 0.6x, 30-60%: 0.8x, 60-80%: 1.0x, 80-100%: 1.2x
  const matchBoost = score >= 80 ? 1.2 : score >= 60 ? 1.0 : score >= 30 ? 0.8 : 0.6

  return { score, dimensions, nextAction, matchBoost }
}

/**
 * Suggest skills/interests to add based on a Path the user engaged with.
 * This is the self-enrichment hook: viewing/applying to a Path
 * can suggest adding relevant dimensions to the user's profile.
 */
export function suggestEnrichmentFromPath(
  pathSectors: string[],
  pathSkills: string[],
  userCrafts: string[],
  userInterests: string[]
): { newCrafts: string[]; newInterests: string[] } {
  // Skills from the path that user doesn't already have
  const newCrafts = pathSkills
    .filter((skill) => !userCrafts.some((c) => c.toLowerCase() === skill.toLowerCase()))
    .slice(0, 3) // Max 3 suggestions

  // Sectors from the path mapped to interests
  const newInterests = pathSectors
    .filter(
      (sector) =>
        !userInterests.some(
          (i) =>
            i.toLowerCase().includes(sector.toLowerCase()) ||
            sector.toLowerCase().includes(i.toLowerCase())
        )
    )
    .slice(0, 2)

  return { newCrafts, newInterests }
}
