import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  const { searchParams } = new URL(request.url)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100)
  const offset = parseInt(searchParams.get('offset') ?? '0', 10)

  const thread = await db.thread.findUnique({
    where: { id },
    include: {
      node: {
        select: { id: true, type: true, code: true, label: true, icon: true },
      },
      posts: {
        orderBy: { createdAt: 'asc' },
        skip: offset,
        take: limit,
        include: {
          author: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      _count: { select: { posts: true } },
    },
  })

  if (!thread) {
    return new Response('Thread not found', { status: 404 })
  }

  return NextResponse.json(thread)
}
