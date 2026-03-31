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
export async function getNode(type: NodeType, code: string) {
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
 * Retrieves all outgoing edges from a user's graph node, optionally filtered by relation type.
 *
 * @param userId - The platform user ID
 * @param relation - Optional edge relation filter (returns all relations if omitted)
 * @returns Array of edges with their target nodes populated, or empty array if the user has no node
 */
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
