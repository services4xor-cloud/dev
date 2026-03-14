import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { notify } from '@/lib/notifications'

// GET /api/messages — list user's conversations with last message preview
export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const conversations = await db.conversation.findMany({
    where: { participants: { some: { id: userId } } },
    include: {
      participants: { select: { id: true, name: true, image: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
    orderBy: { lastMessageAt: 'desc' },
  })

  const result = conversations.map((c) => ({
    id: c.id,
    participants: c.participants,
    lastMessage: c.messages[0] ?? null,
    lastMessageAt: c.lastMessageAt,
  }))

  return NextResponse.json(result)
}

// POST /api/messages — send a message (create or find conversation)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { recipientId?: string; content?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { recipientId, content } = body

  if (!recipientId || typeof recipientId !== 'string') {
    return NextResponse.json({ error: 'recipientId is required' }, { status: 400 })
  }
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'content is required' }, { status: 400 })
  }
  if (content.length > 2000) {
    return NextResponse.json({ error: 'content exceeds 2000 characters' }, { status: 400 })
  }
  if (recipientId === userId) {
    return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
  }

  // Verify recipient exists
  const recipient = await db.user.findUnique({ where: { id: recipientId }, select: { id: true } })
  if (!recipient) {
    return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
  }

  // Find existing conversation between the two users
  const existing = await db.conversation.findFirst({
    where: {
      AND: [
        { participants: { some: { id: userId } } },
        { participants: { some: { id: recipientId } } },
      ],
    },
    select: { id: true },
  })

  const now = new Date()

  let conversationId: string
  if (existing) {
    conversationId = existing.id
  } else {
    const conv = await db.conversation.create({
      data: {
        participants: { connect: [{ id: userId }, { id: recipientId }] },
        lastMessageAt: now,
      },
      select: { id: true },
    })
    conversationId = conv.id
  }

  // Create the message
  const message = await db.message.create({
    data: {
      conversationId,
      senderId: userId,
      content: content.trim(),
    },
  })

  // Update lastMessageAt on the conversation
  await db.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: now },
  })

  // Notify the recipient
  const sender = await db.user.findUnique({ where: { id: userId }, select: { name: true } })
  notify({
    userId: recipientId,
    type: 'MESSAGE',
    title: `New message from ${sender?.name ?? 'someone'}`,
    body: content.trim().slice(0, 100),
    link: `/messages`,
  })

  return NextResponse.json({ conversationId, message }, { status: 201 })
}
