import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * POST /api/discovery
 * Narrows Corridor results step by step.
 *
 * Body: { country?: string, languages?: string[], sectors?: string[] }
 *
 * Logic:
 *   1. country   → find all CORRIDOR edges from that country node
 *   2. languages → filter destinations to those with OFFICIAL_LANG edges for each language
 *   3. sectors   → further filter to destinations with HAS_SECTOR edges for each sector
 *   4. matchScore = matching dimensions / total requested dimensions (0–1)
 */

interface DiscoveryBody {
  country?: unknown
  languages?: unknown
  sectors?: unknown
}

interface CorridorResult {
  code: string
  label: string
  icon: string
  matchScore: number
  languages: string[]
  sectors: string[]
}

const MAX_LANGUAGES = 20
const MAX_SECTORS = 20

export async function POST(req: NextRequest) {
  let body: DiscoveryBody
  try {
    body = (await req.json()) as DiscoveryBody
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const countryCode =
    typeof body.country === 'string' && body.country.trim().length > 0
      ? body.country.trim().toUpperCase()
      : null

  const rawLanguages = Array.isArray(body.languages) ? body.languages : []
  const languages = rawLanguages
    .filter((l): l is string => typeof l === 'string' && l.trim().length > 0)
    .map((l) => l.trim().toLowerCase())
    .slice(0, MAX_LANGUAGES)

  const rawSectors = Array.isArray(body.sectors) ? body.sectors : []
  const sectors = rawSectors
    .filter((s): s is string => typeof s === 'string' && s.trim().length > 0)
    .map((s) => s.trim().toLowerCase())
    .slice(0, MAX_SECTORS)

  const totalDimensions = (languages.length > 0 ? 1 : 0) + (sectors.length > 0 ? 1 : 0)

  // ─── Step 1: Get destination country IDs ─────────────────────────────────

  let destinationIds: string[] | null = null

  if (countryCode) {
    const originNode = await db.node.findUnique({
      where: { type_code: { type: 'COUNTRY', code: countryCode } },
    })

    if (!originNode) {
      return NextResponse.json({ corridors: [] })
    }

    const corridorEdges = await db.edge.findMany({
      where: { fromId: originNode.id, relation: 'CORRIDOR' },
      select: { toId: true },
    })

    destinationIds = corridorEdges.map((e) => e.toId)

    if (destinationIds.length === 0) {
      return NextResponse.json({ corridors: [] })
    }
  }

  // ─── Step 2: Filter by languages ────────────────────────────────────────

  if (languages.length > 0) {
    const langNodes = await db.node.findMany({
      where: { type: 'LANGUAGE', code: { in: languages }, active: true },
      select: { id: true },
    })

    if (langNodes.length > 0) {
      const langIds = langNodes.map((n) => n.id)

      // Countries that have at least one of the requested official languages
      const langEdges = await db.edge.findMany({
        where: {
          toId: { in: langIds },
          relation: 'OFFICIAL_LANG' as const,
          ...(destinationIds ? { fromId: { in: destinationIds } } : {}),
        },
        select: { fromId: true },
      })

      const matchingIds = Array.from(new Set(langEdges.map((e) => e.fromId)))
      destinationIds = destinationIds
        ? destinationIds.filter((id) => matchingIds.includes(id))
        : matchingIds
    }

    if (destinationIds && destinationIds.length === 0) {
      return NextResponse.json({ corridors: [] })
    }
  }

  // ─── Step 3: Filter by sectors ──────────────────────────────────────────

  if (sectors.length > 0) {
    const sectorNodes = await db.node.findMany({
      where: { type: 'SECTOR', code: { in: sectors }, active: true },
      select: { id: true },
    })

    if (sectorNodes.length > 0) {
      const sectorIds = sectorNodes.map((n) => n.id)

      const sectorEdges = await db.edge.findMany({
        where: {
          toId: { in: sectorIds },
          relation: 'HAS_SECTOR',
          ...(destinationIds ? { fromId: { in: destinationIds } } : {}),
        },
        select: { fromId: true },
      })

      const matchingIds = Array.from(new Set(sectorEdges.map((e) => e.fromId)))
      destinationIds = destinationIds
        ? destinationIds.filter((id) => matchingIds.includes(id))
        : matchingIds
    }

    if (destinationIds && destinationIds.length === 0) {
      return NextResponse.json({ corridors: [] })
    }
  }

  // ─── Fetch final country nodes ───────────────────────────────────────────

  const whereClause = destinationIds
    ? { id: { in: destinationIds }, type: 'COUNTRY' as const, active: true }
    : { type: 'COUNTRY' as const, active: true }

  const countryNodes = await db.node.findMany({
    where: whereClause,
    select: { id: true, code: true, label: true, icon: true },
    orderBy: { label: 'asc' },
  })

  if (countryNodes.length === 0) {
    return NextResponse.json({ corridors: [] })
  }

  const nodeIds = countryNodes.map((n) => n.id)

  // ─── Fetch language + sector edges for result cards ──────────────────────

  const [langEdgesForCards, sectorEdgesForCards] = await Promise.all([
    db.edge.findMany({
      where: { fromId: { in: nodeIds }, relation: 'OFFICIAL_LANG' },
      select: { fromId: true, to: { select: { label: true } } },
    }),
    db.edge.findMany({
      where: { fromId: { in: nodeIds }, relation: 'HAS_SECTOR' },
      select: { fromId: true, to: { select: { label: true } } },
    }),
  ])

  // Index edge labels by node id
  const langsByNodeId = new Map<string, string[]>()
  for (const edge of langEdgesForCards) {
    const existing = langsByNodeId.get(edge.fromId) ?? []
    existing.push(edge.to.label)
    langsByNodeId.set(edge.fromId, existing)
  }

  const sectorsByNodeId = new Map<string, string[]>()
  for (const edge of sectorEdgesForCards) {
    const existing = sectorsByNodeId.get(edge.fromId) ?? []
    existing.push(edge.to.label)
    sectorsByNodeId.set(edge.fromId, existing)
  }

  // ─── Build results with matchScore ───────────────────────────────────────

  const corridors: CorridorResult[] = countryNodes.map((node) => {
    const nodeLangs = langsByNodeId.get(node.id) ?? []
    const nodeSectors = sectorsByNodeId.get(node.id) ?? []

    let matchedDimensions = 0
    if (languages.length > 0) {
      // Check if any requested language label overlaps (case-insensitive match by code is already done)
      matchedDimensions += 1
    }
    if (sectors.length > 0) {
      matchedDimensions += 1
    }

    const matchScore = totalDimensions > 0 ? matchedDimensions / totalDimensions : 1

    return {
      code: node.code,
      label: node.label,
      icon: node.icon ?? '🌍',
      matchScore,
      languages: nodeLangs.slice(0, 5),
      sectors: nodeSectors.slice(0, 5),
    }
  })

  // Sort by matchScore descending, then label ascending
  corridors.sort((a, b) => b.matchScore - a.matchScore || a.label.localeCompare(b.label))

  return NextResponse.json({ corridors })
}
