/**
 * AI Agent — Claude-powered, dimension-aware Life Advisor
 *
 * Token-efficient prompt: identity data is the payload,
 * behavioral rules are compressed. Every token earns its place.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AgentDimensions } from '@/types/domain'
import { buildAgentContext } from '@/lib/graph'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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

interface EnrichedContext {
  countries?: string[]
  allValues?: Record<string, string[]>
  customChips?: { dimension: string; label: string }[]
}

/**
 * Build system prompt. Optimized: ~40% fewer tokens, 2× more specific.
 * Structure: Role → Identity → Knowledge → Rules (compressed)
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

  const p: string[] = []

  // ── Role: 3 sentences, not a paragraph ──
  p.push(
    `You are this Explorer's personal life advisor on Be[X]. You've lived in their corridors, speak their languages, know their sectors. You anticipate what they need before they ask — like a local who's been through it.`
  )

  // ── Identity: dense, structured ──
  if (isMultiCountry) {
    p.push(`\nCorridor: ${countries.join('→')} — find what bridges these countries.`)
  } else if (countries.length === 1) {
    p.push(`\nHome: ${countries[0]}`)
  }

  // Dimensions as compact key-value lines
  const dims: string[] = []
  if (allValues.currency?.length) dims.push(`Currency: ${allValues.currency.join(', ')}`)
  if (allValues.language?.length) dims.push(`Languages: ${allValues.language.join(', ')}`)
  if (allValues.sector?.length) dims.push(`Sectors: ${allValues.sector.join(', ')}`)
  if (allValues.faith?.length) dims.push(`Faith: ${allValues.faith.join(', ')}`)
  if (dims.length) p.push(dims.join('\n'))

  // ✦ Manual picks — high signal, compact
  if (customChips.length > 0) {
    p.push(
      `Personal interests (✦): ${customChips.map((c) => c.label).join(', ')} — prioritize these.`
    )
  }

  // ── Graph knowledge: only what's useful ──
  if (context.length > 0) {
    p.push('\n## Context')
    for (const raw of context) {
      const node = raw as unknown as EnrichedNode
      const lines: string[] = [`${node.type}: ${node.label}`]

      if (node.enriched) {
        const e = node.enriched
        if (e.topSectors?.length) lines.push(`Sectors: ${e.topSectors.join(', ')}`)
        if (e.topFaiths?.length) lines.push(`Faiths: ${e.topFaiths.join(', ')}`)
        if (e.visa) lines.push(`Visa: ${e.visa}`)
        if (e.payment?.length) lines.push(`Payment: ${e.payment.join(', ')}`)
        if (e.currency) lines.push(`Currency: ${e.currency}`)
        if (e.corridorStrength) lines.push(`Corridor: ${e.corridorStrength}`)
        if (e.languages?.length) {
          lines.push(
            `Lang: ${e.languages.map((l) => `${l.name}${l.nativeName ? ` (${l.nativeName})` : ''}`).join(', ')}`
          )
        }
        if (e.countriesCount) lines.push(`Spoken in ${e.countriesCount} countries`)
      }

      if (node.connections?.length) {
        const grouped = new Map<string, string[]>()
        for (const c of node.connections) {
          const arr = grouped.get(c.relation) ?? []
          arr.push(c.target)
          grouped.set(c.relation, arr)
        }
        for (const [rel, targets] of Array.from(grouped.entries())) {
          lines.push(`${rel}: ${targets.join(', ')}`)
        }
      }

      p.push(lines.join(' | '))
    }
  }

  // ── Rules: compressed, no fluff ──
  p.push(`
## Rules
- Respond in their language dimension. Switch if they switch.
- Talk like someone FROM these countries, not ABOUT them. Use local references, real places, cultural specifics only an insider would know.
- Anticipate: if they selected Agriculture+Technology, proactively mention AgriTech. If KE→DE, mention Blue Card, Fachkräfteeinwanderungsgesetz, M-Pesa→SEPA bridges — before they ask.
- 1-2 deep insights > 5 shallow ones. Be specific: name programs, visa paths, real companies, actual salary ranges where confident.
- Faith and culture shape everything — honor specifics (halal finance, Sunday markets, Ramadan timing) without stereotyping.
- This is orientation — be open, encouraging, show possibilities. But be honest about hard corridors.
- Never fabricate data. Say "I'd verify that" when unsure.
- Be concise. No preamble, no "Great question!", no filler.
- Vocab: Explorer (person), Host (employer), Opportunity (job/experience), Exchange (application), Corridor (country route).`)

  return p.join('\n')
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
