/**
 * Graph query utilities for Be[X] v2
 *
 * All graph operations go through here. No raw Prisma graph queries elsewhere.
 */

import { db } from '@/lib/db'
import type { EdgeRelation, NodeType } from '@prisma/client'

// ─── Node operations ─────────────────────────────────────────

export async function getNode(type: NodeType, code: string) {
  return db.node.findUnique({
    where: { type_code: { type, code } },
  })
}

export async function getNodeWithEdges(type: NodeType, code: string) {
  return db.node.findUnique({
    where: { type_code: { type, code } },
    include: {
      outEdges: { include: { to: true } },
      inEdges: { include: { from: true } },
    },
  })
}

export async function getUserNode(userId: string) {
  return db.node.findUnique({
    where: { userId },
    include: {
      outEdges: { include: { to: true } },
      inEdges: { include: { from: true } },
    },
  })
}

// ─── Edge operations ─────────────────────────────────────────

export async function createEdge(
  fromType: NodeType,
  fromCode: string,
  toType: NodeType,
  toCode: string,
  relation: EdgeRelation,
  weight?: number,
  properties?: Record<string, unknown>
) {
  const from = await getNode(fromType, fromCode)
  const to = await getNode(toType, toCode)
  if (!from || !to) return null

  return db.edge.upsert({
    where: { fromId_toId_relation: { fromId: from.id, toId: to.id, relation } },
    create: { fromId: from.id, toId: to.id, relation, weight, properties: properties ?? undefined },
    update: { weight, properties: properties ?? undefined },
  })
}

export async function deleteEdge(fromId: string, toId: string, relation: EdgeRelation) {
  return db.edge.deleteMany({
    where: { fromId, toId, relation },
  })
}

export async function getUserEdges(userId: string, relation?: EdgeRelation) {
  const node = await db.node.findUnique({ where: { userId } })
  if (!node) return []

  return db.edge.findMany({
    where: { fromId: node.id, ...(relation ? { relation } : {}) },
    include: { to: true },
  })
}

// ─── Dimension queries (for map) ─────────────────────────────

/**
 * Find all countries connected to a specific dimension node.
 * E.g., "Which countries have Swahili as official language?"
 * → getCountriesByDimension('LANGUAGE', 'sw', 'OFFICIAL_LANG')
 */
export async function getCountriesByDimension(
  dimensionType: NodeType,
  dimensionCode: string,
  relation: EdgeRelation
) {
  const dimensionNode = await getNode(dimensionType, dimensionCode)
  if (!dimensionNode) return []

  // Countries are always "from" in canonical direction
  const edges = await db.edge.findMany({
    where: { toId: dimensionNode.id, relation },
    include: { from: true },
  })

  return edges.filter((e) => e.from.type === 'COUNTRY').map((e) => e.from)
}

/**
 * Intersect multiple dimension filters.
 * Returns countries that match ALL active filters.
 */
export async function filterCountries(
  filters: { dimensionType: NodeType; dimensionCode: string; relation: EdgeRelation }[]
) {
  if (filters.length === 0) {
    return db.node.findMany({ where: { type: 'COUNTRY', active: true } })
  }

  // Get country sets for each filter
  const countrySets = await Promise.all(
    filters.map((f) => getCountriesByDimension(f.dimensionType, f.dimensionCode, f.relation))
  )

  // Intersect: keep only countries present in ALL sets
  const countryIds = countrySets.reduce(
    (intersection, set) => {
      const ids = new Set(set.map((n) => n.id))
      return intersection.filter((id) => ids.has(id))
    },
    countrySets[0]?.map((n) => n.id) ?? []
  )

  return db.node.findMany({
    where: { id: { in: countryIds }, type: 'COUNTRY' },
  })
}

// ─── Subgraph extraction (for AI agent) ──────────────────────

/**
 * Build a subgraph context for an AI agent persona.
 * Given dimensions, returns all connected nodes and their properties.
 */
export async function buildAgentContext(dimensions: Record<string, string>) {
  const nodes: Record<string, unknown>[] = []

  for (const [dimType, code] of Object.entries(dimensions)) {
    const nodeType = dimType.toUpperCase() as NodeType
    const node = await getNodeWithEdges(nodeType, code)
    if (node) {
      nodes.push({
        type: node.type,
        code: node.code,
        label: node.label,
        properties: node.properties,
        connections: node.outEdges.map((e) => ({
          relation: e.relation,
          target: e.to.label,
          targetType: e.to.type,
        })),
      })
    }
  }

  return nodes
}
