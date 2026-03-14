/**
 * API request/response contracts for Be[X] v2
 */

import type { AgentDimensions, DimensionFilter, GraphEdge, GraphNode, MapCountry } from './domain'

// ─── Map API ──────────────────────────────────────────────────

export interface MapFilterRequest {
  filters: DimensionFilter[]
}

export interface MapFilterResponse {
  countries: MapCountry[]
  totalMatches: number
}

// ─── Graph API ────────────────────────────────────────────────

export interface CreateEdgeRequest {
  fromCode: string
  fromType: string
  toCode: string
  toType: string
  relation: string
  weight?: number
  properties?: Record<string, unknown>
}

export interface UserEdgesResponse {
  node: GraphNode
  edges: (GraphEdge & { to: GraphNode })[]
}

// ─── Agent API ────────────────────────────────────────────────

export interface AgentChatRequest {
  dimensions: AgentDimensions
  message: string
  conversationId?: string
}

export interface AgentChatResponse {
  conversationId: string
  response: string // Streamed in practice
}

// ─── Auth API ─────────────────────────────────────────────────

export interface RegisterRequest {
  email: string
  password: string
  name: string
  country: string
  language: string
  role: 'EXPLORER' | 'HOST'
}

// ─── Onboarding API ──────────────────────────────────────────

export interface OnboardingRequest {
  languages: string[] // Language codes
  faith: string[] // Faith IDs
  crafts: string[] // Skill/craft tags
  interests: string[] // Sector codes
  locations: string[] // Country/city codes
  cultures: string[] // Culture IDs
}
