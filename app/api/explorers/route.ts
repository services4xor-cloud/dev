import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { EdgeRelation, NodeType } from '@prisma/client'

const MAX_LIMIT = 50
const DEFAULT_LIMIT = 20

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const language = searchParams.get('language')?.trim().slice(0, 10) ?? null
  const sector = searchParams.get('sector')?.trim().slice(0, 50) ?? null
  const country = searchParams.get('country')?.trim().slice(0, 10) ?? null
  const q = searchParams.get('q')?.trim().slice(0, 100) ?? null
  const rawLimit = parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10)
  const limit = isNaN(rawLimit) ? DEFAULT_LIMIT : Math.min(Math.max(1, rawLimit), MAX_LIMIT)

  // Build the where clause for Node (USER nodes with a linked user)
  // We filter via edge sub-queries using Prisma's relational filters
  const userNodes = await db.node.findMany({
    where: {
      type: NodeType.USER,
      userId: { not: null },
      user: q ? { name: { contains: q, mode: 'insensitive' } } : undefined,
      // Filter by SPEAKS → LANGUAGE node with matching code
      ...(language
        ? {
            outEdges: {
              some: {
                relation: EdgeRelation.SPEAKS,
                to: { type: NodeType.LANGUAGE, code: language },
              },
            },
          }
        : {}),
      // Filter by WORKS_IN → SECTOR node with matching code
      ...(sector
        ? {
            outEdges: {
              some: {
                relation: EdgeRelation.WORKS_IN,
                to: { type: NodeType.SECTOR, code: sector },
              },
            },
          }
        : {}),
      // Filter by LOCATED_IN → COUNTRY node with matching code
      ...(country
        ? {
            outEdges: {
              some: {
                relation: EdgeRelation.LOCATED_IN,
                to: { type: NodeType.COUNTRY, code: country },
              },
            },
          }
        : {}),
    },
    include: {
      user: { select: { id: true, name: true, image: true, country: true } },
      outEdges: {
        where: {
          relation: {
            in: [
              EdgeRelation.SPEAKS,
              EdgeRelation.WORKS_IN,
              EdgeRelation.LOCATED_IN,
              EdgeRelation.HAS_SKILL,
            ],
          },
        },
        include: { to: { select: { label: true, type: true } } },
      },
    },
    take: limit,
  })

  const explorers = userNodes
    .filter((n) => n.user !== null)
    .map((n) => {
      const speaks: string[] = []
      const worksIn: string[] = []
      const locatedIn: string[] = []
      const skills: string[] = []

      for (const edge of n.outEdges) {
        switch (edge.relation) {
          case EdgeRelation.SPEAKS:
            speaks.push(edge.to.label)
            break
          case EdgeRelation.WORKS_IN:
            worksIn.push(edge.to.label)
            break
          case EdgeRelation.LOCATED_IN:
            locatedIn.push(edge.to.label)
            break
          case EdgeRelation.HAS_SKILL:
            skills.push(edge.to.label)
            break
        }
      }

      return {
        id: n.user!.id,
        name: n.user!.name ?? 'Explorer',
        image: n.user!.image,
        country: n.user!.country,
        edges: { speaks, worksIn, locatedIn, skills },
      }
    })

  return NextResponse.json({ explorers })
}
