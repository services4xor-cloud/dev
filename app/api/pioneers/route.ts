import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

/**
 * GET /api/pioneers — Search/list pioneers with public profiles
 *
 * Query params:
 *   ?country=KE — filter by country
 *   ?language=en — filter by spoken language
 *   ?interest=tech — filter by interest
 *   ?q=john — search by name
 *   ?limit=20 — max results (default 20)
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 })
    }

    const url = new URL(req.url)
    const country = url.searchParams.get('country')
    const language = url.searchParams.get('language')
    const interest = url.searchParams.get('interest')
    const search = url.searchParams.get('q')
    const limit = Math.min(parseInt(url.searchParams.get('limit') ?? '20'), 50)

    // Build where clause (dynamic filter construction requires flexible typing)
    const where: any = {
      // eslint-disable-line
      id: { not: session.user.id }, // Exclude self
      profile: {
        isPublic: true,
      },
    }

    if (country) {
      where.country = country
    }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (language) {
      where.profile = {
        ...where.profile,
        languages: { has: language },
      }
    }

    if (interest) {
      where.profile = {
        ...where.profile,
        interests: { has: interest },
      }
    }

    const pioneers = await db.user.findMany({
      where,
      take: limit,
      select: {
        id: true,
        name: true,
        image: true,
        avatarUrl: true,
        country: true,
        pioneerId: true,
        profile: {
          select: {
            headline: true,
            languages: true,
            interests: true,
            crafts: true,
            pioneerType: true,
            city: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ pioneers })
  } catch (err) {
    logger.error('GET /api/pioneers failed', { error: String(err) })
    return NextResponse.json({ error: 'Failed to search pioneers' }, { status: 500 })
  }
}
