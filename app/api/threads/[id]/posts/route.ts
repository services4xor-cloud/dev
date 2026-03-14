import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const user = session.user as { id: string; role: string }
  const { id: threadId } = params

  let body: { content: string }
  try {
    body = (await request.json()) as { content: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { content } = body

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }

  if (content.trim().length > 5000) {
    return NextResponse.json({ error: 'content must be 5000 characters or fewer' }, { status: 400 })
  }

  const thread = await db.thread.findUnique({ where: { id: threadId } })
  if (!thread) {
    return new Response('Thread not found', { status: 404 })
  }

  const post = await db.threadPost.create({
    data: {
      threadId,
      authorId: user.id,
      content: content.trim(),
    },
    include: {
      author: {
        select: { id: true, name: true, image: true },
      },
    },
  })

  return NextResponse.json(post, { status: 201 })
}
