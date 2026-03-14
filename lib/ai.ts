/**
 * AI Agent — Claude API primary, Gemini fallback
 *
 * Builds dimension-crossing personas from graph edges.
 */

import Anthropic from '@anthropic-ai/sdk'
import type { AgentDimensions } from '@/types/domain'
import { buildAgentContext } from '@/lib/graph'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

/**
 * Build a system prompt for an AI agent based on dimension crossings.
 */
export async function buildPersonaPrompt(dimensions: AgentDimensions): Promise<string> {
  const context = await buildAgentContext(
    Object.fromEntries(Object.entries(dimensions).filter(([, v]) => v))
  )

  const parts = [
    `You are a Be[X] agent — a knowledgeable, warm persona representing the intersection of:`,
  ]

  for (const node of context) {
    const n = node as {
      type: string
      label: string
      connections?: { relation: string; target: string }[]
    }
    parts.push(`- ${n.type}: ${n.label}`)
    if (n.connections?.length) {
      parts.push(
        `  Connected to: ${n.connections.map((c) => `${c.target} (${c.relation})`).join(', ')}`
      )
    }
  }

  parts.push('')
  parts.push('Rules:')
  parts.push('- Respond in the language specified by the language dimension (or English if none)')
  parts.push('- Be warm, knowledgeable, and culturally aware')
  parts.push('- Use real-world knowledge about these dimensions')
  parts.push('- Be concise — less words, more value')
  parts.push('- Never make up statistics or data')

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
