import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/messages/[id] — get messages for a conversation, mark unread as read
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id: conversationId } = params

  // Verify user is a participant
  const conversation = await db.conversation.findFirst({
    where: {
      id: conversationId,
      participants: { some: { id: userId } },
    },
    include: {
      participants: { select: { id: true, name: true, image: true } },
      messages: {
        orderBy: { createdAt: 'asc' },
        include: { sender: { select: { id: true, name: true, image: true } } },
      },
    },
  })

  if (!conversation) {
    return NextResponse.json({ error: 'Conversation not found' }, { status: 404 })
  }

  // Mark unread messages (sent by others) as read
  await db.message.updateMany({
    where: {
      conversationId,
      senderId: { not: userId },
      read: false,
    },
    data: { read: true },
  })

  return NextResponse.json({
    id: conversation.id,
    participants: conversation.participants,
    messages: conversation.messages,
  })
}
