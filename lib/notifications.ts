import { db } from '@/lib/db'

type NotificationType = 'MESSAGE' | 'MATCH' | 'REVIEW' | 'PAYMENT' | 'SYSTEM'

interface CreateNotificationInput {
  userId: string
  type: NotificationType
  title: string
  body?: string
  link?: string
}

/** Create a notification for a user. Silently fails if DB errors. */
export async function notify(input: CreateNotificationInput): Promise<void> {
  try {
    await db.notification.create({ data: input })
  } catch {
    // Non-critical — log but don't throw
    console.error('[notify] Failed to create notification:', input)
  }
}

/** Create notifications for multiple users. */
export async function notifyMany(
  userIds: string[],
  data: Omit<CreateNotificationInput, 'userId'>
): Promise<void> {
  if (userIds.length === 0) return
  try {
    await db.notification.createMany({
      data: userIds.map((userId) => ({ ...data, userId })),
    })
  } catch {
    console.error('[notifyMany] Failed:', data)
  }
}
