/**
 * AI Agent — Claude-powered, dimension-aware Route Advisor
 *
 * Builds personas from graph edges enriched with COUNTRY_OPTIONS data.
 * The agent knows: sectors, visa, payments, languages, corridors.
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

/**
 * Build a system prompt for an AI agent based on dimension crossings.
 * Now includes enriched country data (sectors, visa, payments, languages).
 */
export async function buildPersonaPrompt(dimensions: AgentDimensions): Promise<string> {
  const context = await buildAgentContext(
    Object.fromEntries(Object.entries(dimensions).filter(([, v]) => v))
  )

  const parts = [
    `You are a Be[X] Route Advisor — a knowledgeable, warm persona that helps people discover paths, opportunities, and connections across countries and cultures.`,
    '',
    "Your context (the user's identity dimensions):",
  ]

  for (const raw of context) {
    const node = raw as unknown as EnrichedNode
    parts.push(`\n## ${node.type}: ${node.label} (${node.code})`)

    // Show enriched country data
    if (node.enriched) {
      const e = node.enriched
      if (e.topSectors?.length) {
        parts.push(`  Key sectors: ${e.topSectors.join(', ')}`)
      }
      if (e.visa) {
        parts.push(`  Visa (for Kenyan passport): ${e.visa}`)
      }
      if (e.payment?.length) {
        parts.push(`  Common payments: ${e.payment.join(', ')}`)
      }
      if (e.currency) {
        parts.push(`  Currency: ${e.currency}`)
      }
      if (e.corridorStrength) {
        parts.push(`  Corridor strength: ${e.corridorStrength}`)
      }
      if (e.languages?.length) {
        parts.push(
          `  Languages: ${e.languages.map((l) => `${l.name}${l.nativeName ? ` (${l.nativeName})` : ''}`).join(', ')}`
        )
      }
      if (e.nativeName) {
        parts.push(`  Native name: ${e.nativeName}`)
      }
      if (e.countriesCount) {
        parts.push(`  Spoken in ${e.countriesCount} countries`)
      }
    }

    // Show graph connections
    if (node.connections?.length) {
      const grouped = new Map<string, string[]>()
      for (const c of node.connections) {
        const key = c.relation
        if (!grouped.has(key)) grouped.set(key, [])
        grouped.get(key)!.push(c.target)
      }
      for (const [relation, targets] of Array.from(grouped.entries())) {
        parts.push(`  ${relation}: ${targets.join(', ')}`)
      }
    }
  }

  parts.push('')
  parts.push('## Your behavior:')
  parts.push('- Respond in the language specified by the language dimension (or English if none)')
  parts.push('- Be warm, knowledgeable, and culturally aware')
  parts.push(
    '- When discussing routes between countries, reference real sectors, visa requirements, and payment methods from your context'
  )
  parts.push("- Suggest concrete opportunities that match the user's dimensions")
  parts.push('- Be concise — less words, more value')
  parts.push('- Never make up statistics or data')
  parts.push(
    '- Use Be[X] vocabulary: Explorer (user), Host (employer), Opportunity (job/experience), Exchange (interaction), Discovery (search)'
  )

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
