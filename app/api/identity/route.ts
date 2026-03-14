import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getUserNode } from '@/lib/graph'

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
