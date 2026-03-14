import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { NodeType, EdgeRelation } from '@prisma/client'

interface DimensionItem {
  code: string
  label: string
}

const USER_EDGE_RELATIONS: EdgeRelation[] = [
  EdgeRelation.SPEAKS,
  EdgeRelation.WORKS_IN,
  EdgeRelation.LOCATED_IN,
  EdgeRelation.HAS_SKILL,
  EdgeRelation.PRACTICES,
  EdgeRelation.BELONGS_TO,
  EdgeRelation.INTERESTED_IN,
]

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const node = await db.node.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true, country: true, createdAt: true } },
      outEdges: {
        where: { relation: { in: USER_EDGE_RELATIONS } },
        include: { to: { select: { code: true, label: true, type: true } } },
      },
    },
  })

  if (!node || node.type !== NodeType.USER || !node.userId || !node.user) {
    return NextResponse.json({ error: 'Explorer not found' }, { status: 404 })
  }

  // Group edges by relation type
  const dimensions: Record<string, DimensionItem[]> = {}

  for (const edge of node.outEdges) {
    const relation = edge.relation as string
    if (!dimensions[relation]) {
      dimensions[relation] = []
    }
    dimensions[relation].push({ code: edge.to.code, label: edge.to.label })
  }

  return NextResponse.json({
    id: node.id,
    userId: node.user.id,
    name: node.user.name ?? 'Explorer',
    image: node.user.image,
    country: node.user.country,
    createdAt: node.user.createdAt.toISOString(),
    dimensions,
  })
}
