/**
 * AI Agent — Claude-powered, dimension-aware Life Advisor
 *
 * Builds deep personas from ALL selected dimensions:
 * countries (enriched), languages, sectors, currencies, faiths,
 * plus manual ✦ selections. The agent truly breathes your identity.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AgentDimensions } from '@/types/domain'
import { buildAgentContext } from '@/lib/graph'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Enriched node shape returned by buildAgentContext.
 */
interface EnrichedNode {
  type: string
  code: string
  label: string
  properties?: Record<string, unknown> | null
  connections?: { relation: string; target: string; targetType: string }[]
  enriched?: {
    topSectors?: string[]
    topFaiths?: string[]
    visa?: string
    payment?: string[]
    currency?: string
    region?: string
    corridorStrength?: string
    languages?: { code: string; name: string; nativeName?: string }[]
    nativeName?: string
    digitalReach?: string
    countriesCount?: number
    topCountries?: string[]
  }
}

/** Enriched context from the frontend — all selected dimensions */
interface EnrichedContext {
  countries?: string[]
  allValues?: Record<string, string[]>
  customChips?: { dimension: string; label: string }[]
}

/**
 * Build a system prompt for the AI Life Advisor.
 * Uses ALL selected dimensions — countries, overlaps, manual picks.
 * The more the Explorer selects, the deeper the agent understands them.
 */
export async function buildPersonaPrompt(
  dimensions: AgentDimensions,
  enrichedContext?: EnrichedContext
): Promise<string> {
  const context = await buildAgentContext(
    Object.fromEntries(Object.entries(dimensions).filter(([, v]) => v))
  )

  const countries = enrichedContext?.countries ?? []
  const allValues = enrichedContext?.allValues ?? {}
  const customChips = enrichedContext?.customChips ?? []
  const isMultiCountry = countries.length >= 2
  const isSingleCountry = countries.length === 1

  // ─── Build the system prompt ─────────────────────────────────────────────

  const parts: string[] = []

  // ── Core identity ──
  parts.push(`You are a Be[X] Life Advisor — a wise, warm, deeply perceptive guide who helps people navigate life across borders, cultures, and possibilities.

You are NOT a generic chatbot. You are shaped by THIS specific Explorer's identity — the countries they've selected, the languages they speak, the sectors they work in, the faith they hold, the currency they earn in. Every answer you give must reflect THEIR world.

You think in corridors — the real paths people walk between countries, between languages, between economic zones. You see opportunities where dimensions overlap.`)

  // ── What the Explorer selected ──
  parts.push("\n---\n## This Explorer's Identity\n")

  if (isMultiCountry) {
    parts.push(`**Corridor:** ${countries.join(' → ')} (${countries.length} countries selected)`)
    parts.push(
      `This Explorer is exploring the connection between these countries. Think about what bridges them — shared languages, economic ties, migration corridors, cultural exchange, faith communities that span borders.`
    )
  } else if (isSingleCountry) {
    parts.push(`**Home base:** ${countries[0]}`)
    parts.push(
      `This Explorer is rooted in ${countries[0]}. Understand this country deeply — its economy, culture, opportunities, challenges, and how it connects to the world.`
    )
  }

  // All dimension values the Explorer has active
  if (allValues.currency?.length) {
    parts.push(`\n**Currencies:** ${allValues.currency.join(', ')}`)
    if (allValues.currency.length >= 2) {
      parts.push(
        `  → Multiple currencies = cross-border economic life. Think remittances, exchange rates, dual-income strategies, fintech bridges.`
      )
    }
  }
  if (allValues.language?.length) {
    parts.push(`\n**Languages:** ${allValues.language.join(', ')}`)
    if (allValues.language.length >= 2) {
      parts.push(
        `  → Multilingual = bridge person. They can operate in multiple worlds. This is a superpower — help them leverage it.`
      )
    }
  }
  if (allValues.sector?.length) {
    parts.push(`\n**Sectors:** ${allValues.sector.join(', ')}`)
    if (allValues.sector.length >= 2) {
      parts.push(
        `  → Cross-sector = versatile. Help them see intersections — e.g. "Agriculture + Technology" = AgriTech opportunities.`
      )
    }
  }
  if (allValues.faith?.length) {
    parts.push(`\n**Faith:** ${allValues.faith.join(', ')}`)
    parts.push(
      `  → Respect this deeply. Faith shapes community, trust networks, calendar, values. Never dismiss or generalize.`
    )
  }

  // Manual ✦ selections — these are INTENTIONAL choices
  if (customChips.length > 0) {
    parts.push(`\n**Manually selected (✦ = intentional, personal interest):**`)
    for (const chip of customChips) {
      parts.push(`  ✦ ${chip.label} (${chip.dimension})`)
    }
    parts.push(
      `These were hand-picked by the Explorer — they signal strong personal interest. Prioritize these in your suggestions.`
    )
  }

  // ── Enriched graph data (deep country knowledge) ──
  if (context.length > 0) {
    parts.push('\n---\n## Deep Knowledge (from graph)\n')
    for (const raw of context) {
      const node = raw as unknown as EnrichedNode
      parts.push(`### ${node.type}: ${node.label} (${node.code})`)

      if (node.enriched) {
        const e = node.enriched
        if (e.topSectors?.length) parts.push(`  Key sectors: ${e.topSectors.join(', ')}`)
        if (e.topFaiths?.length) parts.push(`  Faiths: ${e.topFaiths.join(', ')}`)
        if (e.visa) parts.push(`  Visa access: ${e.visa}`)
        if (e.payment?.length) parts.push(`  Payment methods: ${e.payment.join(', ')}`)
        if (e.currency) parts.push(`  Currency: ${e.currency}`)
        if (e.corridorStrength) parts.push(`  Corridor strength: ${e.corridorStrength}`)
        if (e.languages?.length) {
          parts.push(
            `  Languages: ${e.languages.map((l) => `${l.name}${l.nativeName ? ` (${l.nativeName})` : ''}`).join(', ')}`
          )
        }
        if (e.nativeName) parts.push(`  Native name: ${e.nativeName}`)
        if (e.countriesCount) parts.push(`  Spoken in ${e.countriesCount} countries`)
      }

      if (node.connections?.length) {
        const grouped = new Map<string, string[]>()
        for (const c of node.connections) {
          const arr = grouped.get(c.relation) ?? []
          arr.push(c.target)
          grouped.set(c.relation, arr)
        }
        for (const [relation, targets] of Array.from(grouped.entries())) {
          parts.push(`  ${relation}: ${targets.join(', ')}`)
        }
      }
    }
  }

  // ── Behavioral DNA ──
  parts.push(`
---
## How You Behave

**Language:** Respond in the Explorer's language dimension. If they selected Swahili, respond in Swahili. If German, respond in German. If multiple languages, default to the first but switch naturally if they write in another.

**Tone:** Warm, real, direct. You're a trusted advisor who has lived in these corridors. Not corporate. Not generic. You speak from experience.

**Depth over breadth:** Give 1-2 deep, actionable insights rather than 5 shallow ones. If they ask about jobs in Germany, don't list generic advice — tell them about the specific sector they selected, the visa path from their country, the language requirements.

**See the overlaps:** When dimensions intersect (e.g. Swahili + Technology + Kenya→Germany), that's where magic happens. Name the specific opportunity: "The Kenyan tech scene's mobile-first expertise is exactly what German companies need for their Africa expansion."

**Be honest:** If a corridor is hard (strict visa, few opportunities), say so — then show the path through. Never sugarcoat, never despair.

**Identity matters:** The Explorer's faith, language, culture — these aren't decorations. They're the lens through which they see opportunity. A Muslim software engineer looking at Germany has different needs than a Christian nurse looking at the UK. Honor that specificity.

**Vocabulary:** Use Be[X] terms naturally — Explorer (the person), Host (employer/org), Opportunity (job/experience), Exchange (application), Discovery (search/match), Corridor (country route), Hub (dashboard).

**Brevity:** Respect their time. Be concise — less words, more value. No filler, no preamble.

**Truth:** Never fabricate statistics, visa rules, or salary data. If you don't know, say "I'd need to verify that" and suggest where to check.`)

  return parts.join('\n')
}

/**
 * Chat with an AI agent persona. Returns full response.
 */
export async function chatWithAgent(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
) {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

/**
 * Stream chat with agent (for real-time UI).
 */
export function streamChatWithAgent(
  systemPrompt: string,
  messages: { role: 'user' | 'assistant'; content: string }[]
) {
  return anthropic.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  })
}
