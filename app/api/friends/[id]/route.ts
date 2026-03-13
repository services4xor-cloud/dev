import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * PATCH /api/friends/[id] — Accept or reject a friend request
 *
 * Body: { action: 'accept' | 'reject' }
 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const body = await req.json()
    const action = body.action as string

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'action must be accept or reject' }, { status: 400 })
    }

    // Find the friendship — user must be the recipient
    const friendship = await db.friendship.findFirst({
      where: {
        id: params.id,
        toId: session.user.id,
        status: 'PENDING',
      },
    })

    if (!friendship) {
      return NextResponse.json({ error: 'Friend request not found' }, { status: 404 })
    }

    if (action === 'accept') {
      const updated = await db.friendship.update({
        where: { id: friendship.id },
        data: { status: 'ACCEPTED' },
      })

      // Award XP to both users for making a friend
      try {
        const { XP_ACTIONS } = await import('@/lib/xp')
        const actionDef = XP_ACTIONS.ADD_FRIEND
        const userIds = [session.user.id, friendship.fromId]
        await Promise.all(
          userIds.map((uid) =>
            db.$transaction([
              db.xPEvent.create({
                data: { userId: uid, action: 'ADD_FRIEND', points: actionDef.points },
              }),
              db.profile.upsert({
                where: { userId: uid },
                update: { totalXP: { increment: actionDef.points } },
                create: { userId: uid, totalXP: actionDef.points },
              }),
            ])
          )
        )
      } catch {
        // XP award is non-critical
      }

      return NextResponse.json({ friendship: updated })
    } else {
      await db.friendship.delete({ where: { id: friendship.id } })
      return NextResponse.json({ success: true })
    }
  } catch (err) {
    logger.error('PATCH /api/friends/[id] failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to update friend request' }, { status: 500 })
  }
}

/**
 * DELETE /api/friends/[id] — Remove a friend
 */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    // Find friendship — user must be a participant
    const friendship = await db.friendship.findFirst({
      where: {
        id: params.id,
        OR: [{ fromId: session.user.id }, { toId: session.user.id }],
      },
    })

    if (!friendship) {
      return NextResponse.json({ error: 'Friendship not found' }, { status: 404 })
    }

    await db.friendship.delete({ where: { id: friendship.id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    logger.error('DELETE /api/friends/[id] failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to remove friend' }, { status: 500 })
  }
}
