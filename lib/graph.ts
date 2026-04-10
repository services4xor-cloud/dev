/**
 * Graph query utilities for Be[X] v2
 *
 * All graph operations go through here. No raw Prisma graph queries elsewhere.
 */

import { db } from '@/lib/db'
import type { EdgeRelation, NodeType, Prisma } from '@prisma/client'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY, type LanguageCode } from '@/lib/country-selector'

// ─── Node operations ─────────────────────────────────────────

/**
 * Finds a graph node by its type and unique code.
 *
 * @param type - The node type (COUNTRY, LANGUAGE, FAITH, etc.)
 * @param code - The unique code within that type (e.g., "KE", "en", "islam")
 * @returns The matching node, or null if not found
 */
async function getNode(type: NodeType, code: string) {
  return db.node.findUnique({
    where: { type_code: { type, code } },
  })
}

/**
 * Finds a graph node by type and code, including all its incoming and outgoing edges.
 *
 * @param type - The node type (COUNTRY, LANGUAGE, FAITH, etc.)
 * @param code - The unique code within that type
 * @returns The node with populated edge relations, or null if not found
 */
export async function getNodeWithEdges(type: NodeType, code: string) {
  return db.node.findUnique({
    where: { type_code: { type, code } },
    include: {
      outEdges: { include: { to: true } },
      inEdges: { include: { from: true } },
    },
  })
}

/**
 * Retrieves the graph node associated with a platform user, including all edges.
 *
 * @param userId - The platform user ID
 * @returns The user's node with populated edges, or null if the user has no node
 */
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

/**
 * Creates or updates a directed edge between two graph nodes.
 * Uses upsert semantics — safe to call multiple times with the same node pair and relation.
 *
 * @param fromType - Node type of the source node
 * @param fromCode - Code of the source node
 * @param toType - Node type of the target node
 * @param toCode - Code of the target node
 * @param relation - The edge relation type (e.g., OFFICIAL_LANG, SPEAKS, BELONGS_TO)
 * @param weight - Optional numeric weight for scoring or ranking
 * @param properties - Optional arbitrary JSON properties to store on the edge
 * @returns The created or updated edge, or null if either node does not exist
 */
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
    create: {
      fromId: from.id,
      toId: to.id,
      relation,
      weight,
      properties: (properties ?? undefined) as Prisma.InputJsonValue | undefined,
    },
    update: { weight, properties: (properties ?? undefined) as Prisma.InputJsonValue | undefined },
  })
}

/**
 * Batch-create edges from one source node to multiple targets.
 * Single FROM lookup + batched TO lookups + transactional upserts.
 * Reduces N+1 queries from 3N to ~3 total DB round-trips.
 */
export async function createEdgesBatch(
  fromType: NodeType,
  fromCode: string,
  edges: { toType: NodeType; toCode: string; relation: EdgeRelation }[]
): Promise<number> {
  if (edges.length === 0) return 0

  const from = await getNode(fromType, fromCode)
  if (!from) return 0

  // Group targets by type for efficient batch lookup
  const byType = new Map<NodeType, string[]>()
  for (const e of edges) {
    const arr = byType.get(e.toType) ?? []
    arr.push(e.toCode)
    byType.set(e.toType, arr)
  }

  // Batch-fetch all target nodes
  const targetNodes = new Map<string, string>() // "TYPE:code" → node.id
  for (const [type, codes] of Array.from(byType.entries())) {
    const nodes = await db.node.findMany({
      where: { type, code: { in: codes } },
      select: { id: true, type: true, code: true },
    })
    for (const n of nodes) {
      targetNodes.set(`${n.type}:${n.code}`, n.id)
    }
  }

  // Build upsert operations for all valid edges
  const ops = edges
    .map((e) => {
      const toId = targetNodes.get(`${e.toType}:${e.toCode}`)
      if (!toId) return null
      return db.edge.upsert({
        where: { fromId_toId_relation: { fromId: from.id, toId, relation: e.relation } },
        create: { fromId: from.id, toId, relation: e.relation },
        update: {},
      })
    })
    .filter(Boolean) as ReturnType<typeof db.edge.upsert>[]

  if (ops.length === 0) return 0

  const results = await db.$transaction(ops)
  return results.length
}

// ─── Subgraph extraction (for AI agent) ──────────────────────

/**
 * Build a subgraph context for an AI agent persona.
 * Given dimensions, returns all connected nodes with enriched data from COUNTRY_OPTIONS.
 *
 * For COUNTRY nodes, injects: topSectors, visa, payment, languages, currency, region.
 * For LANGUAGE nodes, injects: nativeName, countries where spoken.
 * This gives the AI real-world knowledge to make useful recommendations.
 */
export async function buildAgentContext(dimensions: Record<string, string>) {
  const nodes: Record<string, unknown>[] = []

  for (const [dimType, code] of Object.entries(dimensions)) {
    const nodeType = dimType.toUpperCase() as NodeType
    const node = await getNodeWithEdges(nodeType, code)
    if (!node) continue

    const base = {
      type: node.type,
      code: node.code,
      label: node.label,
      properties: node.properties,
      connections: node.outEdges.map((e) => ({
        relation: e.relation,
        target: e.to.label,
        targetType: e.to.type,
      })),
    }

    // Enrich COUNTRY nodes with COUNTRY_OPTIONS data
    if (node.type === 'COUNTRY') {
      const countryData = COUNTRY_OPTIONS.find((c) => c.code === node.code)
      if (countryData) {
        Object.assign(base, {
          enriched: {
            topSectors: countryData.topSectors,
            visa: countryData.visa,
            payment: countryData.payment,
            currency: countryData.currency,
            region: countryData.region,
            corridorStrength: countryData.corridorStrength,
            topFaiths: countryData.topFaiths,
            languages: countryData.languages.map((lc) => {
              const lang = LANGUAGE_REGISTRY[lc as LanguageCode]
              return lang
                ? { code: lc, name: lang.name, nativeName: lang.nativeName }
                : { code: lc }
            }),
          },
        })
      }
    }

    // Enrich LANGUAGE nodes with registry data
    if (node.type === 'LANGUAGE') {
      const langData = LANGUAGE_REGISTRY[node.code as LanguageCode]
      if (langData) {
        Object.assign(base, {
          enriched: {
            nativeName: langData.nativeName,
            digitalReach: langData.digitalReach,
            countriesCount: langData.countries.length,
            topCountries: langData.countries.slice(0, 6),
          },
        })
      }
    }

    nodes.push(base)
  }

  return nodes
}
