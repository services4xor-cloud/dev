import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * GET /api/conversations — List user's conversations
 *
 * Returns conversations with last message and participant info.
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const conversations = await db.conversation.findMany({
      where: {
        participants: { some: { id: session.user.id } },
      },
      include: {
        participants: {
          select: { id: true, name: true, image: true, avatarUrl: true, country: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: {
            id: true,
            content: true,
            senderId: true,
            read: true,
            createdAt: true,
          },
        },
      },
      orderBy: { lastMessageAt: { sort: 'desc', nulls: 'last' } },
    })

    // Format for client: add otherUser, unread count
    const formatted = conversations.map((conv) => {
      const otherParticipants = conv.participants.filter((p) => p.id !== session.user.id)
      const lastMsg = conv.messages[0] ?? null
      return {
        id: conv.id,
        otherParticipants,
        lastMessage: lastMsg
          ? {
              content: lastMsg.content,
              senderId: lastMsg.senderId,
              read: lastMsg.read,
              createdAt: lastMsg.createdAt,
            }
          : null,
        lastMessageAt: conv.lastMessageAt,
        createdAt: conv.createdAt,
      }
    })

    return NextResponse.json({ conversations: formatted })
  } catch (err) {
    logger.error('GET /api/conversations failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to load conversations' }, { status: 500 })
  }
}

const createSchema = z.object({
  userId: z.string().min(1, 'userId required'),
})

/**
 * POST /api/conversations — Create or find a conversation with another user
 *
 * If a 1-on-1 conversation already exists, returns it.
 * Otherwise creates a new one.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { userId } = parsed.data

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
    }

    // Check target user exists
    const targetUser = await db.user.findUnique({ where: { id: userId } })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Find existing 1-on-1 conversation
    const existing = await db.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: session.user.id } } },
          { participants: { some: { id: userId } } },
        ],
      },
      include: {
        participants: {
          select: { id: true, name: true, image: true, avatarUrl: true, country: true },
        },
      },
    })

    if (existing) {
      return NextResponse.json({ conversation: existing })
    }

    // Create new conversation
    const conversation = await db.conversation.create({
      data: {
        participants: {
          connect: [{ id: session.user.id }, { id: userId }],
        },
      },
      include: {
        participants: {
          select: { id: true, name: true, image: true, avatarUrl: true, country: true },
        },
      },
    })

    return NextResponse.json({ conversation }, { status: 201 })
  } catch (err) {
    logger.error('POST /api/conversations failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}
