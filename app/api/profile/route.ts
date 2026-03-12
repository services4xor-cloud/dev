import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(9).max(20).optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
  headline: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  country: z.string().length(2).optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  upworkUrl: z.string().url().optional().or(z.literal('')),
  fiverrUrl: z.string().url().optional().or(z.literal('')),
  videoUrl: z.string().url().optional().or(z.literal('')),
  resumeUrl: z.string().url().optional().or(z.literal('')),
  skills: z.array(z.string()).max(30).optional(),
  experience: z.number().int().min(0).max(50).optional(),
  pioneerType: z
    .enum(['explorer', 'professional', 'artisan', 'guardian', 'creator', 'healer'])
    .optional(),
  // Identity dimensions
  language: z.string().max(10).optional(),
  languages: z.array(z.string()).max(20).optional(),
  interests: z.array(z.string()).max(20).optional(),
  reach: z.array(z.string()).max(10).optional(),
  faith: z.array(z.string()).max(5).optional(),
  culture: z.string().max(100).optional().or(z.literal('')),
  crafts: z.array(z.string()).max(30).optional(),
  priorities: z.record(z.enum(['high', 'medium', 'low'])).optional(),
})

/** Generate a unique Pioneer ID like "BE-KE-7X3M" */
function generatePioneerId(country: string): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // No I/O/0/1 for clarity
  let code = ''
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return `BE-${country.toUpperCase()}-${code}`
}

// GET /api/profile — get current user's profile + identity dimensions
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        pioneerId: true,
        name: true,
        email: true,
        phone: true,
        country: true,
        avatarUrl: true,
        image: true,
        role: true,
        profile: {
          select: {
            headline: true,
            bio: true,
            pioneerType: true,
            skills: true,
            experience: true,
            location: true,
            city: true,
            linkedinUrl: true,
            upworkUrl: true,
            fiverrUrl: true,
            videoUrl: true,
            resumeUrl: true,
            isPublic: true,
            language: true,
            languages: true,
            interests: true,
            reach: true,
            faith: true,
            culture: true,
            crafts: true,
            priorities: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Auto-generate pioneerId if missing
    if (!user.pioneerId) {
      let pioneerId = generatePioneerId(user.country)
      for (let i = 0; i < 3; i++) {
        try {
          await db.user.update({ where: { id: user.id }, data: { pioneerId } })
          user.pioneerId = pioneerId
          break
        } catch {
          pioneerId = generatePioneerId(user.country)
        }
      }
    }

    return NextResponse.json({ success: true, data: user })
  } catch (err) {
    logger.error('GET /api/profile failed', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PATCH /api/profile — update current user's profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Split: user-level vs profile-level fields
    const userFields: Record<string, unknown> = {}
    if (data.name !== undefined) userFields.name = data.name
    if (data.phone !== undefined) userFields.phone = data.phone || null
    if (data.country !== undefined) userFields.country = data.country

    const profileFields: Record<string, unknown> = {}
    if (data.bio !== undefined) profileFields.bio = data.bio || null
    if (data.headline !== undefined) profileFields.headline = data.headline || null
    if (data.city !== undefined) profileFields.city = data.city || null
    if (data.linkedin !== undefined) profileFields.linkedinUrl = data.linkedin || null
    if (data.upworkUrl !== undefined) profileFields.upworkUrl = data.upworkUrl || null
    if (data.fiverrUrl !== undefined) profileFields.fiverrUrl = data.fiverrUrl || null
    if (data.videoUrl !== undefined) profileFields.videoUrl = data.videoUrl || null
    if (data.resumeUrl !== undefined) profileFields.resumeUrl = data.resumeUrl || null
    if (data.experience !== undefined) profileFields.experience = data.experience
    if (data.pioneerType !== undefined) profileFields.pioneerType = data.pioneerType || null
    if (data.skills !== undefined) profileFields.skills = data.skills
    if (data.language !== undefined) profileFields.language = data.language
    if (data.languages !== undefined) profileFields.languages = data.languages
    if (data.interests !== undefined) profileFields.interests = data.interests
    if (data.reach !== undefined) profileFields.reach = data.reach
    if (data.faith !== undefined) profileFields.faith = data.faith
    if (data.culture !== undefined) profileFields.culture = data.culture || null
    if (data.crafts !== undefined) profileFields.crafts = data.crafts
    if (data.priorities !== undefined) profileFields.priorities = data.priorities

    // Update user-level fields
    if (Object.keys(userFields).length > 0) {
      await db.user.update({ where: { id: session.user.id }, data: userFields })
    }

    // Upsert profile (create if not exists)
    if (Object.keys(profileFields).length > 0) {
      await db.profile.upsert({
        where: { userId: session.user.id },
        create: { userId: session.user.id, ...profileFields },
        update: profileFields,
      })
    }

    // Return updated data
    const updated = await db.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        pioneerId: true,
        name: true,
        country: true,
        profile: {
          select: {
            headline: true,
            bio: true,
            pioneerType: true,
            experience: true,
            linkedinUrl: true,
            upworkUrl: true,
            fiverrUrl: true,
            videoUrl: true,
            language: true,
            languages: true,
            interests: true,
            reach: true,
            faith: true,
            culture: true,
            crafts: true,
            priorities: true,
            city: true,
            skills: true,
          },
        },
      },
    })

    return NextResponse.json({ success: true, data: updated })
  } catch (err) {
    logger.error('PATCH /api/profile failed', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}
