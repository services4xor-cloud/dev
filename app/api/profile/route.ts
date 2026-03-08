import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const profileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(9).max(20).optional(),
  bio: z.string().max(500).optional(),
  jobTitle: z.string().max(100).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  skills: z.array(z.string()).max(30).optional(),
})

// GET /api/profile — get current user's profile
export async function GET(_req: NextRequest) {
  try {
    // TODO: getServerSession(authOptions) + prisma.user.findUnique
    return NextResponse.json({ success: true, data: null })
  } catch (err) {
    console.error('GET /api/profile error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch profile' }, { status: 500 })
  }
}

// PATCH /api/profile — update current user's profile
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = profileSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    // TODO: session check + prisma.user.update

    return NextResponse.json({
      success: true,
      data: { ...parsed.data, updatedAt: new Date().toISOString() },
    })
  } catch (err) {
    console.error('PATCH /api/profile error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}
