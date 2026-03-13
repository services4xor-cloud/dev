/**
 * Needs Definition & Matching System
 *
 * Allows Pioneers/Anchors to express "I need X" and matches those needs
 * against agent personas and Pioneer profiles using semantic skill matching.
 *
 * "I need a software developer who speaks German" matches an agent whose
 * craft includes "Softwareentwicklung" and languages include "de".
 *
 * Uses: resolveSkillId + areSkillsEquivalent from semantic-skills.ts
 */

import { resolveSkillId, areSkillsEquivalent } from './semantic-skills'
import type { AgentPersona } from './agents'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Need {
  id: string
  creatorId: string
  skills: string[] // skill labels in any language — resolved via semantic matching
  languages?: string[] // ISO 639-1 codes the person must speak
  country?: string // preferred country (ISO)
  isRemote?: boolean // remote work acceptable
  description: string
  urgency: 'low' | 'medium' | 'high'
  status: 'open' | 'matched' | 'fulfilled' | 'closed'
  createdAt: string
}

export interface NeedMatch {
  need: Need
  matchedProfile: {
    id: string
    name: string
    score: number
    matchReasons: string[]
  }
}

/** Matchable profile shape — works for both AgentPersona and Pioneer profiles */
export interface MatchableProfile {
  id: string
  name: string
  craft: string[]
  languages: string[]
  country: string
  reach?: string[]
}

// ─── Need Categories ────────────────────────────────────────────────────────

export const NEED_CATEGORIES = [
  {
    id: 'tech',
    icon: '💻',
    labels: { en: 'Technology', de: 'Technologie', fr: 'Technologie', sw: 'Teknolojia' } as Record<
      string,
      string
    >,
  },
  {
    id: 'business',
    icon: '💼',
    labels: { en: 'Business', de: 'Wirtschaft', fr: 'Affaires', sw: 'Biashara' } as Record<
      string,
      string
    >,
  },
  {
    id: 'creative',
    icon: '🎨',
    labels: { en: 'Creative', de: 'Kreativ', fr: 'Créatif', sw: 'Ubunifu' } as Record<
      string,
      string
    >,
  },
  {
    id: 'trades',
    icon: '🔧',
    labels: { en: 'Trades', de: 'Handwerk', fr: 'Métiers', sw: 'Ufundi' } as Record<string, string>,
  },
  {
    id: 'health',
    icon: '🏥',
    labels: { en: 'Healthcare', de: 'Gesundheit', fr: 'Santé', sw: 'Afya' } as Record<
      string,
      string
    >,
  },
  {
    id: 'education',
    icon: '📚',
    labels: { en: 'Education', de: 'Bildung', fr: 'Éducation', sw: 'Elimu' } as Record<
      string,
      string
    >,
  },
  {
    id: 'service',
    icon: '🤝',
    labels: { en: 'Services', de: 'Dienstleistungen', fr: 'Services', sw: 'Huduma' } as Record<
      string,
      string
    >,
  },
  {
    id: 'nature',
    icon: '🌿',
    labels: {
      en: 'Agriculture & Nature',
      de: 'Landwirtschaft & Natur',
      fr: 'Agriculture & Nature',
      sw: 'Kilimo & Mazingira',
    } as Record<string, string>,
  },
] as const

export type NeedCategoryId = (typeof NEED_CATEGORIES)[number]['id']

// ─── Helpers ────────────────────────────────────────────────────────────────

function lower(s: string): string {
  return s.toLowerCase().trim()
}

/** Count how many skills in `need` are semantically matched by `profile` */
function countSkillMatches(
  needSkills: string[],
  profileCrafts: string[]
): { count: number; matched: string[] } {
  const matched: string[] = []
  for (const needed of needSkills) {
    for (const craft of profileCrafts) {
      if (areSkillsEquivalent(needed, craft)) {
        matched.push(craft)
        break
      }
      // Fallback: check canonical ID match directly
      const nId = resolveSkillId(needed)
      const cId = resolveSkillId(craft)
      if (nId && cId && nId === cId) {
        matched.push(craft)
        break
      }
    }
  }
  return { count: matched.length, matched }
}

/** Count overlapping languages */
function countLanguageOverlap(
  needed: string[],
  profile: string[]
): { count: number; shared: string[] } {
  const profileSet = new Set(profile.map(lower))
  const shared = needed.filter((l) => profileSet.has(lower(l)))
  return { count: shared.length, shared }
}

// ─── Urgency Weight ─────────────────────────────────────────────────────────

const URGENCY_WEIGHT: Record<Need['urgency'], number> = {
  low: 1.0,
  medium: 1.1,
  high: 1.2,
}

// ─── Scoring ────────────────────────────────────────────────────────────────

/**
 * Score a single profile against a need.
 * Returns 0-100 score and human-readable match reasons.
 */
export function matchNeedToProfile(
  need: Need,
  profile: MatchableProfile
): { score: number; matchReasons: string[] } {
  let score = 0
  const reasons: string[] = []

  // --- Skill matching (0-50 points) ---
  if (need.skills.length > 0) {
    const { count, matched } = countSkillMatches(need.skills, profile.craft)
    const skillRatio = count / need.skills.length
    const skillScore = Math.round(skillRatio * 50)
    score += skillScore
    if (count > 0) {
      reasons.push(
        `${count}/${need.skills.length} skill${count > 1 ? 's' : ''} matched: ${matched.join(', ')}`
      )
    }
  }

  // --- Language matching (0-30 points) ---
  if (need.languages && need.languages.length > 0) {
    const { count, shared } = countLanguageOverlap(need.languages, profile.languages)
    const langRatio = count / need.languages.length
    const langScore = Math.round(langRatio * 30)
    score += langScore
    if (count > 0) {
      reasons.push(`Speaks ${shared.join(', ')}`)
    }
  } else {
    // No language requirement — give baseline points
    score += 15
  }

  // --- Country match (0-15 points) ---
  if (need.country) {
    if (lower(profile.country) === lower(need.country)) {
      score += 15
      reasons.push(`Located in ${need.country.toUpperCase()}`)
    }
  } else {
    // No country requirement — give baseline
    score += 8
  }

  // --- Remote bonus (0-5 points) ---
  if (need.isRemote) {
    const canRemote = profile.reach?.some(
      (r) => lower(r) === 'can-work-remote' || lower(r) === 'remote'
    )
    if (canRemote) {
      score += 5
      reasons.push('Available for remote work')
    }
  }

  // Cap at 100
  return { score: Math.min(100, score), matchReasons: reasons }
}

// ─── Batch Matching ─────────────────────────────────────────────────────────

/**
 * Score all agents against a need. Returns sorted matches (best first).
 * Only returns matches with score > 0.
 *
 * @param need       - The need to match against
 * @param agents     - Agent personas to evaluate
 * @param userLang   - Optional language codes for localizing reasons (unused for now, reserved)
 */
export function matchNeedToAgents(
  need: Need,
  agents: AgentPersona[],
  _userLanguages?: string[]
): NeedMatch[] {
  if (need.status === 'closed' || need.status === 'fulfilled') return []

  const urgencyMult = URGENCY_WEIGHT[need.urgency]

  const matches: NeedMatch[] = agents
    .map((agent) => {
      const profile: MatchableProfile = {
        id: agent.id,
        name: agent.name,
        craft: agent.craft,
        languages: agent.languages,
        country: agent.country,
        reach: agent.reach,
      }

      const { score, matchReasons } = matchNeedToProfile(need, profile)
      const adjustedScore = Math.min(100, Math.round(score * urgencyMult))

      return {
        need,
        matchedProfile: {
          id: agent.id,
          name: agent.name,
          score: adjustedScore,
          matchReasons,
        },
      }
    })
    .filter((m) => m.matchedProfile.score > 0)
    .sort((a, b) => b.matchedProfile.score - a.matchedProfile.score)

  return matches
}
