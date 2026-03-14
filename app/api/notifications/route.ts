import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const MAX_LIMIT = 50
const DEFAULT_LIMIT = 20

// GET /api/notifications — list notifications + unread count
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = req.nextUrl
  const rawLimit = parseInt(searchParams.get('limit') ?? String(DEFAULT_LIMIT), 10)
  const limit = isNaN(rawLimit) ? DEFAULT_LIMIT : Math.min(Math.max(1, rawLimit), MAX_LIMIT)
  const cursor = searchParams.get('cursor') ?? undefined

  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
    }),
    db.notification.count({ where: { userId, read: false } }),
  ])

  return NextResponse.json({
    notifications,
    unreadCount,
    nextCursor: notifications.length === limit ? notifications[notifications.length - 1]?.id : null,
  })
}

// PATCH /api/notifications — mark notifications as read
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { ids?: string[]; all?: boolean }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (body.all) {
    // Mark all unread notifications as read
    await db.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    })
  } else if (Array.isArray(body.ids) && body.ids.length > 0) {
    // Mark specific notifications as read (only own)
    const safeIds = body.ids.filter((id) => typeof id === 'string').slice(0, 100)
    await db.notification.updateMany({
      where: { id: { in: safeIds }, userId },
      data: { read: true },
    })
  } else {
    return NextResponse.json({ error: 'Provide ids array or all: true' }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
