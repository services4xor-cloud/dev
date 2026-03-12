/**
 * Graph Data Engine — builds the network graph for /world
 *
 * Transforms identity + AI agent data into nodes and edges
 * for the SVG network visualization.
 *
 * Person nodes are scored using the 8-dimension scoring engine
 * against deterministic AI agent personas (~700 across 193 countries).
 */

import { MOCK_VENTURE_PATHS, MOCK_THREADS } from '@/data/mock'
import { LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'
import { EXCHANGE_CATEGORIES } from '@/lib/exchange-categories'
import { generateAllAgents, type AgentPersona } from '@/lib/agents'
import { scoreDimensions, type DimensionProfile } from '@/lib/dimension-scoring'
import { getSignalsForRegion } from '@/lib/market-data'

// ─── Types ──────────────────────────────────────────────────────────

export interface GraphNode {
  id: string
  type: 'you' | 'person' | 'opportunity' | 'community'
  label: string
  sublabel: string
  icon: string
  score: number // 0-100 match score
  ring: number // 0=center(you), 1=inner, 2=mid, 3=outer
}

export interface GraphEdge {
  from: string
  to: string
  type: 'language' | 'skill' | 'location'
  strength: number // 0-1
}

interface Identity {
  country: string
  language: string
  languages: string[]
  interests: string[]
  mode: 'explorer' | 'host'
  city?: string
  faith: string[]
  craft?: string[]
  reach?: string[]
  culture?: string
}

// ─── Helpers ────────────────────────────────────────────────────────

function scoreRing(score: number): 1 | 2 | 3 {
  if (score >= 80) return 1
  if (score >= 50) return 2
  return 3
}

/** Cached agents — generated once per session */
let _cachedAgents: AgentPersona[] | null = null
function getCachedAgents(): AgentPersona[] {
  if (!_cachedAgents) _cachedAgents = generateAllAgents()
  return _cachedAgents
}

/** Build a DimensionProfile from the user's identity */
function identityToProfile(identity: Identity): DimensionProfile {
  return {
    country: identity.country,
    city: identity.city,
    languages: identity.languages,
    faith: identity.faith,
    craft: identity.craft ?? [],
    interests: identity.interests,
    reach: identity.reach ?? [],
    culture: identity.culture,
    isHuman: true,
  }
}

/** Build a DimensionProfile from an AI agent */
function agentToProfile(agent: AgentPersona): DimensionProfile {
  return {
    country: agent.country,
    city: agent.city,
    languages: agent.languages,
    faith: agent.faith,
    craft: agent.craft,
    interests: agent.interests,
    reach: agent.reach,
    culture: agent.culture,
    isHuman: false,
  }
}

/** Determine primary edge type from dimension score breakdown */
function primaryEdgeType(breakdown: {
  language: number
  craft: number
  location: number
}): GraphEdge['type'] {
  if (breakdown.language >= breakdown.craft && breakdown.language >= breakdown.location)
    return 'language'
  if (breakdown.craft >= breakdown.location) return 'skill'
  return 'location'
}

/** Score an opportunity node based on interest overlap */
function scoreOpportunity(
  pathCategory: string,
  pathTags: string[],
  userInterests: string[]
): { score: number; edgeType: GraphEdge['type'] } {
  if (userInterests.length === 0) return { score: 35, edgeType: 'skill' }

  // Map path categories to exchange category IDs
  const categoryMap: Record<string, string[]> = {
    professional: ['tech', 'engineering', 'trade'],
    creative: ['fashion', 'media'],
    community: ['community', 'agriculture'],
    explorer: ['safari', 'hospitality'],
  }

  const mappedCategories = categoryMap[pathCategory] ?? []
  const categoryMatch = mappedCategories.some((c) => userInterests.includes(c))

  // Also check tags against interest labels
  const interestLabels = userInterests
    .map((id) => EXCHANGE_CATEGORIES.find((c) => c.id === id)?.label?.toLowerCase() ?? '')
    .filter(Boolean)
  const tagMatch = pathTags.some((tag) =>
    interestLabels.some(
      (label) => label.includes(tag.toLowerCase()) || tag.toLowerCase().includes(label)
    )
  )

  let score = 30
  if (categoryMatch) score += 45
  if (tagMatch) score += 25
  return { score: Math.min(100, score), edgeType: 'skill' }
}

/** Score a community node based on interest + language overlap */
function scoreCommunity(
  thread: { type: string; countries: string[]; slug: string },
  userLangs: string[],
  userInterests: string[],
  userCountry: string
): { score: number; edgeType: GraphEdge['type'] } {
  let score = 25
  let edgeType: GraphEdge['type'] = 'location'

  // Country match
  if (thread.countries.includes(userCountry)) {
    score += 25
    edgeType = 'location'
  }

  // Interest match (thread slug matches a user interest)
  if (userInterests.includes(thread.slug)) {
    score += 35
    edgeType = 'skill'
  }

  // Language thread matching user languages
  if (thread.type === 'language') {
    const langCode =
      thread.slug === 'swahili'
        ? 'sw'
        : thread.slug === 'deutsch'
          ? 'de'
          : thread.slug === 'english'
            ? 'en'
            : thread.slug === 'french'
              ? 'fr'
              : thread.slug === 'arabic'
                ? 'ar'
                : thread.slug === 'hindi'
                  ? 'hi'
                  : null
    if (langCode && userLangs.includes(langCode)) {
      score += 40
      edgeType = 'language'
    }
  }

  return { score: Math.min(100, score), edgeType }
}

// ─── Build Graph ────────────────────────────────────────────────────

export function buildGraph(identity: Identity): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []

  // ── Center node: YOU ──────────────────────────────────────────────
  const youNode: GraphNode = {
    id: 'you',
    type: 'you',
    label: 'YOU',
    sublabel: identity.city || 'Explorer',
    icon: '🌟',
    score: 100,
    ring: 0,
  }
  nodes.push(youNode)

  // ── People nodes from AI agents (scored via 8-dimension engine) ──
  const meProfile = identityToProfile(identity)
  const marketSignals = getSignalsForRegion(identity.country)
  const allAgents = getCachedAgents()

  const personNodes = allAgents
    .map((agent) => {
      const themProfile = agentToProfile(agent)
      const dimScore = scoreDimensions(meProfile, themProfile, marketSignals)
      // Normalize 0-110 → 0-100 for display
      const displayScore = Math.min(100, Math.round((dimScore.total / 110) * 100))
      const edgeType = primaryEdgeType(dimScore.breakdown)
      const typeBadge = agent.type === 'ai' ? '🤖' : '✨'
      return {
        node: {
          id: `person-${agent.id}`,
          type: 'person' as const,
          label: agent.name,
          sublabel: `${typeBadge} ${agent.city}, ${agent.country}`,
          icon: agent.avatar,
          score: displayScore,
          ring: scoreRing(displayScore),
        },
        edgeType,
        score: displayScore,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)

  for (const { node, edgeType, score } of personNodes) {
    nodes.push(node)
    edges.push({
      from: 'you',
      to: node.id,
      type: edgeType,
      strength: score / 100,
    })
  }

  // ── Opportunity nodes from venture paths ──────────────────────────
  const oppNodes = MOCK_VENTURE_PATHS.slice(0, 20)
    .map((p) => {
      const { score, edgeType } = scoreOpportunity(p.category, p.tags, identity.interests)
      return {
        node: {
          id: `opp-${p.id}`,
          type: 'opportunity' as const,
          label: p.title.length > 28 ? p.title.slice(0, 26) + '...' : p.title,
          sublabel: `${p.anchorName} — ${p.location}`,
          icon: p.icon,
          score,
          ring: scoreRing(score),
        },
        edgeType,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)

  for (const { node, edgeType, score } of oppNodes) {
    nodes.push(node)
    edges.push({
      from: 'you',
      to: node.id,
      type: edgeType,
      strength: score / 100,
    })
  }

  // ── Community nodes from threads ──────────────────────────────────
  const communityNodes = MOCK_THREADS.filter((t) => t.active)
    .map((t) => {
      const { score, edgeType } = scoreCommunity(
        t,
        identity.languages,
        identity.interests,
        identity.country
      )
      return {
        node: {
          id: `comm-${t.slug}`,
          type: 'community' as const,
          label: t.brandName,
          sublabel: t.tagline.length > 40 ? t.tagline.slice(0, 38) + '...' : t.tagline,
          icon: t.icon,
          score,
          ring: scoreRing(score),
        },
        edgeType,
        score,
      }
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 7)

  for (const { node, edgeType, score } of communityNodes) {
    nodes.push(node)
    edges.push({
      from: 'you',
      to: node.id,
      type: edgeType,
      strength: score / 100,
    })
  }

  return { nodes, edges }
}
