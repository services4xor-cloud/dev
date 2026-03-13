import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import { XP_ACTIONS, type XPAction, getXPLevel } from '@/lib/xp'

/**
 * GET /api/xp — Get current XP state
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
      select: { totalXP: true },
    })

    const totalXP = profile?.totalXP ?? 0
    const xpState = getXPLevel(totalXP)

    // Recent awards (last 10)
    const recentAwards = await db.xPEvent.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: { action: true, points: true, createdAt: true },
    })

    return NextResponse.json({ ...xpState, recentAwards })
  } catch (err) {
    logger.error('GET /api/xp failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to load XP' }, { status: 500 })
  }
}

const awardSchema = z.object({
  action: z.string().min(1),
})

/**
 * POST /api/xp — Award XP for an action
 *
 * Server-validated: checks one-time actions, daily limits.
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = awardSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'action is required' }, { status: 400 })
    }

    const actionKey = parsed.data.action as XPAction
    const actionDef = XP_ACTIONS[actionKey]
    if (!actionDef) {
      return NextResponse.json({ error: 'Unknown XP action' }, { status: 400 })
    }

    // Check one-time actions
    if (actionDef.oneTime) {
      const existing = await db.xPEvent.findFirst({
        where: { userId: session.user.id, action: actionKey },
      })
      if (existing) {
        return NextResponse.json({ awarded: false, reason: 'Already earned' })
      }
    }

    // Check daily limits
    if ('maxPerDay' in actionDef && actionDef.maxPerDay) {
      const startOfDay = new Date()
      startOfDay.setHours(0, 0, 0, 0)

      const todayCount = await db.xPEvent.count({
        where: {
          userId: session.user.id,
          action: actionKey,
          createdAt: { gte: startOfDay },
        },
      })

      if (todayCount >= actionDef.maxPerDay) {
        return NextResponse.json({ awarded: false, reason: 'Daily limit reached' })
      }
    }

    // Award XP
    const [event] = await db.$transaction([
      db.xPEvent.create({
        data: {
          userId: session.user.id,
          action: actionKey,
          points: actionDef.points,
        },
      }),
      db.profile.upsert({
        where: { userId: session.user.id },
        update: { totalXP: { increment: actionDef.points } },
        create: { userId: session.user.id, totalXP: actionDef.points },
      }),
    ])

    // Get updated XP state
    const profile = await db.profile.findUnique({
      where: { userId: session.user.id },
      select: { totalXP: true },
    })

    const xpState = getXPLevel(profile?.totalXP ?? actionDef.points)

    // Check for level-up
    const prevXP = (profile?.totalXP ?? actionDef.points) - actionDef.points
    const prevLevel = getXPLevel(prevXP)
    const leveledUp = xpState.level > prevLevel.level

    return NextResponse.json(
      {
        awarded: true,
        points: actionDef.points,
        label: actionDef.label,
        leveledUp,
        ...xpState,
      },
      { status: 201 }
    )
  } catch (err) {
    logger.error('POST /api/xp failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to award XP' }, { status: 500 })
  }
}
