import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(9).max(20).optional(),
  bio: z.string().max(500).optional(),
  headline: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  skills: z.array(z.string()).max(30).optional(),
})

// GET /api/profile — get current user's profile
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }

    // TODO: prisma.user.findUnique({ where: { id: session.user.id } })
    return NextResponse.json({ success: true, data: null })
  } catch (err) {
    console.error('GET /api/profile error:', err)
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

    // TODO: prisma.user.update({ where: { id: session.user.id }, data: parsed.data })

    return NextResponse.json({
      success: true,
      data: { ...parsed.data, updatedAt: new Date().toISOString() },
    })
  } catch (err) {
    console.error('PATCH /api/profile error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}
