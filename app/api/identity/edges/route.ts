import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import type { EdgeRelation, NodeType } from '@prisma/client'

// Allowed user-facing relations and their valid target node types
const RELATION_TARGET_MAP: Record<string, NodeType[]> = {
  SPEAKS: ['LANGUAGE'],
  PRACTICES: ['FAITH'],
  WORKS_IN: ['SECTOR'],
  LOCATED_IN: ['LOCATION', 'COUNTRY'],
  HAS_SKILL: ['SKILL'],
  INTERESTED_IN: ['SECTOR'],
  BELONGS_TO: ['CULTURE'],
}

const ALLOWED_RELATIONS = new Set(Object.keys(RELATION_TARGET_MAP))

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).relation !== 'string' ||
    typeof (body as Record<string, unknown>).targetType !== 'string' ||
    typeof (body as Record<string, unknown>).targetCode !== 'string'
  ) {
    return NextResponse.json(
      { error: 'Body must include relation, targetType, targetCode' },
      { status: 400 }
    )
  }

  const { relation, targetType, targetCode } = body as {
    relation: string
    targetType: string
    targetCode: string
  }

  if (!ALLOWED_RELATIONS.has(relation)) {
    return NextResponse.json(
      { error: `Invalid relation. Allowed: ${Array.from(ALLOWED_RELATIONS).join(', ')}` },
      { status: 400 }
    )
  }

  const validTargetTypes = RELATION_TARGET_MAP[relation]
  if (!validTargetTypes.includes(targetType as NodeType)) {
    return NextResponse.json(
      { error: `Invalid targetType for ${relation}. Allowed: ${validTargetTypes.join(', ')}` },
      { status: 400 }
    )
  }

  const trimmedCode = targetCode.trim()
  if (!trimmedCode) {
    return NextResponse.json({ error: 'targetCode must not be empty' }, { status: 400 })
  }

  // Find the user's node
  const userNode = await db.node.findUnique({ where: { userId } })
  if (!userNode) {
    return NextResponse.json({ error: 'User node not found' }, { status: 404 })
  }

  // Find or create the target node
  const targetNode = await db.node.upsert({
    where: { type_code: { type: targetType as NodeType, code: trimmedCode } },
    create: {
      type: targetType as NodeType,
      code: trimmedCode,
      label: trimmedCode,
    },
    update: {},
  })

  // Upsert the edge (prevents duplicates)
  const edge = await db.edge.upsert({
    where: {
      fromId_toId_relation: {
        fromId: userNode.id,
        toId: targetNode.id,
        relation: relation as EdgeRelation,
      },
    },
    create: {
      fromId: userNode.id,
      toId: targetNode.id,
      relation: relation as EdgeRelation,
    },
    update: {},
    include: { to: true },
  })

  return NextResponse.json(
    {
      id: edge.id,
      relation: edge.relation,
      to: {
        id: edge.to.id,
        type: edge.to.type,
        code: edge.to.code,
        label: edge.to.label,
        icon: edge.to.icon,
      },
    },
    { status: 201 }
  )
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (
    typeof body !== 'object' ||
    body === null ||
    typeof (body as Record<string, unknown>).edgeId !== 'string'
  ) {
    return NextResponse.json({ error: 'Body must include edgeId' }, { status: 400 })
  }

  const { edgeId } = body as { edgeId: string }

  // Find the user's node to verify ownership
  const userNode = await db.node.findUnique({ where: { userId } })
  if (!userNode) {
    return NextResponse.json({ error: 'User node not found' }, { status: 404 })
  }

  // Find edge and verify it belongs to this user's node
  const edge = await db.edge.findUnique({ where: { id: edgeId } })
  if (!edge) {
    return NextResponse.json({ error: 'Edge not found' }, { status: 404 })
  }
  if (edge.fromId !== userNode.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await db.edge.delete({ where: { id: edgeId } })

  return NextResponse.json({ ok: true })
}
