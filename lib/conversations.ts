import { db } from '@/lib/db'

/**
 * Store a direct message from one user to another, reusing their existing
 * conversation or starting one. A transaction keeps two concurrent first
 * messages from creating two conversations.
 */
export async function sendDirectMessage(senderId: string, recipientId: string, content: string) {
  const now = new Date()
  return db.$transaction(async (tx) => {
    const existing = await tx.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { id: senderId } } },
          { participants: { some: { id: recipientId } } },
        ],
      },
      select: { id: true },
    })

    const conversationId =
      existing?.id ??
      (
        await tx.conversation.create({
          data: {
            participants: { connect: [{ id: senderId }, { id: recipientId }] },
            lastMessageAt: now,
          },
          select: { id: true },
        })
      ).id

    const message = await tx.message.create({
      data: { conversationId, senderId, content },
    })
    await tx.conversation.update({ where: { id: conversationId }, data: { lastMessageAt: now } })

    return { conversationId, message }
  })
}
