import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserNode } from '@/lib/graph'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id

  if (!userId) {
    return NextResponse.json({ node: null, edges: [] })
  }

  const node = await getUserNode(userId)
  if (!node) {
    return NextResponse.json({ node: null, edges: [] })
  }

  return NextResponse.json({
    node: {
      id: node.id,
      type: node.type,
      code: node.code,
      label: node.label,
      icon: node.icon,
      properties: node.properties,
    },
    edges: node.outEdges.map((e) => ({
      id: e.id,
      relation: e.relation,
      to: {
        id: e.to.id,
        type: e.to.type,
        code: e.to.code,
        label: e.to.label,
        icon: e.to.icon,
      },
    })),
  })
}

export async function PATCH(req: NextRequest) {
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
    typeof (body as Record<string, unknown>).name !== 'string'
  ) {
    return NextResponse.json({ error: 'Body must include name' }, { status: 400 })
  }

  const name = ((body as Record<string, unknown>).name as string).trim()

  if (name.length < 1 || name.length > 100) {
    return NextResponse.json({ error: 'Name must be 1–100 characters' }, { status: 400 })
  }

  // Update User.name and the user's Node label in a transaction
  await db.$transaction([
    db.user.update({ where: { id: userId }, data: { name } }),
    db.node.update({ where: { userId }, data: { label: name } }),
  ])

  return NextResponse.json({ ok: true, name })
}
