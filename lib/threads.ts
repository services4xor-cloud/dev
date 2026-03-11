/**
 * THREADS — Identity-based community architecture
 *
 * Every identity group (country, tribe, language, interest, religion, science)
 * is a "thread" — like a subreddit but for life-routing.
 *
 * Same component renders any thread. Adding a new thread = adding data, not code.
 *
 * Thread types:
 *   country   → BeKenya, BeGermany (geographic identity)
 *   tribe     → BeMaasai, BeKikuyu (cultural identity)
 *   language  → BeSwahili, BeDeutsch (linguistic identity)
 *   interest  → BeTech, BeEcoTourism (professional interest)
 *   religion  → BeMuslim, BeChristian (spiritual identity)
 *   science   → BeMedical, BeEngineering (knowledge domain)
 *   location  → BeNairobi, BeLagos (city/region identity)
 */

// ── Thread Types ─────────────────────────────────────────────────────

export type ThreadType =
  | 'country'
  | 'tribe'
  | 'language'
  | 'interest'
  | 'religion'
  | 'science'
  | 'location'

export interface Thread {
  /** URL slug: 'ke', 'maasai', 'swahili', 'tech' */
  slug: string
  /** Display name: 'Kenya', 'Maasai', 'Swahili', 'Technology' */
  name: string
  /** Brand name: 'BeKenya', 'BeMaasai', 'BeSwahili', 'BeTech' */
  brandName: string
  /** Thread type for categorization and UI */
  type: ThreadType
  /** Emoji or flag */
  icon: string
  /** Short description for the Gate page hero */
  tagline: string
  /** Longer description for SEO and about section */
  description: string
  /** Related thread slugs (for "You might also like") */
  relatedThreads: string[]
  /** Parent thread slug (e.g., 'maasai' → 'ke') */
  parentThread?: string
  /** Countries this thread spans (empty = global) */
  countries: string[]
  /** Number of Pioneers in this thread (mock) */
  memberCount: number
  /** Whether this thread is currently active */
  active: boolean
}

// ── Thread Resolution ────────────────────────────────────────────────

/** Look up a thread by slug from the thread registry */
export function getThread(slug: string, threads: Thread[]): Thread | null {
  return threads.find((t) => t.slug === slug) ?? null
}

/** Get all threads of a specific type */
export function getThreadsByType(type: ThreadType, threads: Thread[]): Thread[] {
  return threads.filter((t) => t.type === type && t.active)
}

/** Get child threads (e.g., all tribes within a country) */
export function getChildThreads(parentSlug: string, threads: Thread[]): Thread[] {
  return threads.filter((t) => t.parentThread === parentSlug && t.active)
}

/** Get related threads for a given thread */
export function getRelatedThreads(slug: string, threads: Thread[]): Thread[] {
  const thread = getThread(slug, threads)
  if (!thread) return []
  return thread.relatedThreads
    .map((rs) => getThread(rs, threads))
    .filter((t): t is Thread => t !== null && t.active)
}

/** Search threads by name (fuzzy) */
export function searchThreads(query: string, threads: Thread[]): Thread[] {
  const q = query.toLowerCase()
  return threads
    .filter(
      (t) =>
        t.active &&
        (t.name.toLowerCase().includes(q) ||
          t.brandName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q))
    )
    .sort((a, b) => b.memberCount - a.memberCount)
}

// ── Experience Journey Stages ────────────────────────────────────────

/**
 * The psychological progression every Pioneer goes through.
 * Each page maps to a stage. The UX ensures smooth forward movement.
 */
export type JourneyStage = 'discover' | 'trust' | 'engage' | 'belong' | 'advocate'

export interface JourneyStageConfig {
  stage: JourneyStage
  label: string
  psychology: string
  uxPattern: string
  pages: string[]
  conversionGoal: string
}

export const JOURNEY_STAGES: JourneyStageConfig[] = [
  {
    stage: 'discover',
    label: 'Discover',
    psychology: 'Curiosity + Identity recognition',
    uxPattern: 'Hero with rotating Be[X] teaser, country gates, visual storytelling',
    pages: ['/', '/be/[slug]', '/offerings'],
    conversionGoal: 'Start Compass or Browse Ventures',
  },
  {
    stage: 'trust',
    label: 'Trust',
    psychology: 'Social proof + Authority + Transparency',
    uxPattern: 'Reviews, UTAMADUNI impact counter, verified badges, real stories',
    pages: ['/about', '/charity', '/pricing', '/privacy'],
    conversionGoal: 'Build confidence to engage',
  },
  {
    stage: 'engage',
    label: 'Engage',
    psychology: 'Purpose-driven action + Personalization',
    uxPattern: 'Compass wizard, personalized routes, smart matching',
    pages: ['/compass', '/ventures', '/experiences/[id]'],
    conversionGoal: 'Complete wizard or open a Chapter',
  },
  {
    stage: 'belong',
    label: 'Belong',
    psychology: 'Community identity + Achievement',
    uxPattern: 'Dashboards, profile, thread communities, progress tracking',
    pages: ['/pioneers/dashboard', '/profile', '/onboarding'],
    conversionGoal: 'Complete profile, join threads',
  },
  {
    stage: 'advocate',
    label: 'Advocate',
    psychology: 'Referral reward + Impact pride',
    uxPattern: 'Refer & Earn, success stories, impact dashboard',
    pages: ['/referral', '/media'],
    conversionGoal: 'Share referral link, post success story',
  },
]
