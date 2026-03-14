import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  const threads = await db.thread.findMany({
    where: type
      ? {
          node: { type: type as 'COUNTRY' | 'LANGUAGE' | 'FAITH' | 'SECTOR' | 'CULTURE' | 'SKILL' },
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    include: {
      node: {
        select: { id: true, type: true, code: true, label: true, icon: true },
      },
      _count: { select: { posts: true } },
    },
  })

  return NextResponse.json({ threads })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const user = session.user as { id: string; role: string }
  if (user.role !== 'HOST' && user.role !== 'ADMIN') {
    return new Response('Forbidden', { status: 403 })
  }

  let body: { nodeId: string; title: string; description?: string }
  try {
    body = (await request.json()) as { nodeId: string; title: string; description?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { nodeId, title, description } = body

  if (!nodeId || typeof nodeId !== 'string') {
    return NextResponse.json({ error: 'nodeId is required' }, { status: 400 })
  }

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }

  const node = await db.node.findUnique({ where: { id: nodeId } })
  if (!node) {
    return NextResponse.json({ error: 'Node not found' }, { status: 404 })
  }

  const thread = await db.thread.create({
    data: {
      nodeId,
      title: title.trim(),
      description: description?.trim() ?? null,
    },
    include: {
      node: {
        select: { id: true, type: true, code: true, label: true, icon: true },
      },
    },
  })

  return NextResponse.json(thread, { status: 201 })
}
