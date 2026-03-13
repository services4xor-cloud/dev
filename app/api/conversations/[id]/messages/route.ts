import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * GET /api/conversations/[id]/messages — Fetch messages for a conversation
 *
 * Paginated via ?cursor=messageId&limit=50
 */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const conversationId = params.id

    // Verify user is a participant
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: session.user.id } },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const url = new URL(req.url)
    const cursor = url.searchParams.get('cursor')
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '50'), 100)

    const messages = await db.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit + 1, // +1 to check if there are more
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      include: {
        sender: {
          select: { id: true, name: true, image: true, avatarUrl: true },
        },
      },
    })

    const hasMore = messages.length > limit
    if (hasMore) messages.pop()

    // Mark unread messages from other users as read
    await db.message.updateMany({
      where: {
        conversationId,
        senderId: { not: session.user.id },
        read: false,
      },
      data: { read: true },
    })

    return NextResponse.json({
      messages: messages.reverse(), // Return chronological order
      hasMore,
      nextCursor: hasMore ? messages[0]?.id : null,
    })
  } catch (err) {
    logger.error('GET /api/conversations/[id]/messages failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  }
}

const sendSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty').max(5000),
})

/**
 * POST /api/conversations/[id]/messages — Send a message
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const conversationId = params.id

    // Verify user is a participant
    const conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        participants: { some: { id: session.user.id } },
      },
    })

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
    }

    const body = await req.json()
    const parsed = sendSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const { content } = parsed.data

    // Create message and update conversation's lastMessage in a transaction
    const [message] = await db.$transaction([
      db.message.create({
        data: {
          conversationId,
          senderId: session.user.id,
          content,
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true, avatarUrl: true },
          },
        },
      }),
      db.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessage: content.slice(0, 200),
          lastMessageAt: new Date(),
        },
      }),
    ])

    // Award XP for sending a message (rate-limited server-side)
    try {
      const { XP_ACTIONS } = await import('@/lib/xp')
      const actionDef = XP_ACTIONS.SEND_MESSAGE
      // Check daily limit
      const todayStart = new Date()
      todayStart.setHours(0, 0, 0, 0)
      const todayCount = await db.xPEvent.count({
        where: { userId: session.user.id, action: 'SEND_MESSAGE', createdAt: { gte: todayStart } },
      })
      if (!actionDef.maxPerDay || todayCount < actionDef.maxPerDay) {
        await db.$transaction([
          db.xPEvent.create({
            data: { userId: session.user.id, action: 'SEND_MESSAGE', points: actionDef.points },
          }),
          db.profile.upsert({
            where: { userId: session.user.id },
            update: { totalXP: { increment: actionDef.points } },
            create: { userId: session.user.id, totalXP: actionDef.points },
          }),
        ])
      }
    } catch {
      // XP award is non-critical, don't fail the message send
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (err) {
    logger.error('POST /api/conversations/[id]/messages failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
