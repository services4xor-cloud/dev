/**
 * Domain types for Be[X] v2
 * Mirrors Prisma schema + adds frontend-only types
 */

import type { NodeType, EdgeRelation, UserRole, PaymentMethod, PaymentStatus } from '@prisma/client'

export type { NodeType, EdgeRelation, UserRole, PaymentMethod, PaymentStatus }

// ─── Graph types ──────────────────────────────────────────────

export interface GraphNode {
  id: string
  type: NodeType
  code: string
  label: string
  labelKey?: string | null
  icon?: string | null
  lat?: number | null
  lng?: number | null
  properties?: Record<string, unknown> | null
  active: boolean
}

export interface GraphEdge {
  id: string
  fromId: string
  toId: string
  relation: EdgeRelation
  weight?: number | null
  properties?: Record<string, unknown> | null
}

export interface NodeWithEdges extends GraphNode {
  outEdges: (GraphEdge & { to: GraphNode })[]
  inEdges: (GraphEdge & { from: GraphNode })[]
}

// ─── Map types ────────────────────────────────────────────────

export interface DimensionFilter {
  dimension: 'language' | 'faith' | 'sector' | 'currency' | 'culture' | 'timezone'
  nodeCode: string // e.g., "sw", "islam", "tech"
}

export interface MapCountry {
  code: string
  name: string
  lat: number
  lng: number
  matchStrength: number // 0.0–1.0 based on dimension filters
}

// ─── Agent types ──────────────────────────────────────────────

export interface AgentDimensions {
  country?: string
  language?: string
  faith?: string
  sector?: string
  currency?: string
  culture?: string
}

export interface AgentMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

// ─── Identity types ───────────────────────────────────────────

export interface UserIdentity {
  userId: string
  country: string
  language: string
  edges: GraphEdge[]
  node: GraphNode
}
