import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * GET /api/friends — List user's friends and pending requests
 *
 * Query params:
 *   ?status=ACCEPTED (default) — accepted friends
 *   ?status=PENDING — pending incoming requests
 *   ?pending=true — shorthand for pending incoming requests
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const url = new URL(req.url)
    const status = url.searchParams.get('status') ?? 'ACCEPTED'
    const pendingOnly = url.searchParams.get('pending') === 'true'

    if (pendingOnly || status === 'PENDING') {
      // Incoming pending requests
      const requests = await db.friendship.findMany({
        where: { toId: session.user.id, status: 'PENDING' },
        include: {
          from: {
            select: { id: true, name: true, image: true, avatarUrl: true, country: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({
        friends: requests.map((r) => ({
          friendshipId: r.id,
          user: r.from,
          status: r.status,
          createdAt: r.createdAt,
        })),
      })
    }

    // Accepted friends (from either direction)
    const friendships = await db.friendship.findMany({
      where: {
        OR: [
          { fromId: session.user.id, status: 'ACCEPTED' },
          { toId: session.user.id, status: 'ACCEPTED' },
        ],
      },
      include: {
        from: {
          select: { id: true, name: true, image: true, avatarUrl: true, country: true },
        },
        to: {
          select: { id: true, name: true, image: true, avatarUrl: true, country: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const friends = friendships.map((f) => ({
      friendshipId: f.id,
      user: f.fromId === session.user.id ? f.to : f.from,
      status: f.status,
      createdAt: f.createdAt,
    }))

    return NextResponse.json({ friends })
  } catch (err) {
    logger.error('GET /api/friends failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to load friends' }, { status: 500 })
  }
}

const sendRequestSchema = z.object({
  userId: z.string().min(1, 'userId required'),
})

/**
 * POST /api/friends — Send a friend request
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = sendRequestSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    const { userId } = parsed.data

    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot friend yourself' }, { status: 400 })
    }

    // Check target exists
    const targetUser = await db.user.findUnique({ where: { id: userId } })
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if friendship already exists (in either direction)
    const existing = await db.friendship.findFirst({
      where: {
        OR: [
          { fromId: session.user.id, toId: userId },
          { fromId: userId, toId: session.user.id },
        ],
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Friend request already exists', status: existing.status },
        { status: 409 }
      )
    }

    const friendship = await db.friendship.create({
      data: {
        fromId: session.user.id,
        toId: userId,
        status: 'PENDING',
      },
    })

    return NextResponse.json({ friendship }, { status: 201 })
  } catch (err) {
    logger.error('POST /api/friends failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to send friend request' }, { status: 500 })
  }
}
