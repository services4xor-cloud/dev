import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const MAX_SIZE_BYTES = 512 * 1024 // 512 KB max for base64 data URL
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

// POST /api/identity/photo — upload profile photo as base64 data URL
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { photo?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { photo } = body
  if (!photo || typeof photo !== 'string') {
    return NextResponse.json({ error: 'photo is required (base64 data URL)' }, { status: 400 })
  }

  // Validate data URL format
  const match = photo.match(/^data:(image\/\w+);base64,/)
  if (!match) {
    return NextResponse.json({ error: 'Invalid image format. Use a data URL.' }, { status: 400 })
  }

  const mimeType = match[1]
  if (!ALLOWED_TYPES.includes(mimeType)) {
    return NextResponse.json(
      { error: `Unsupported image type. Allowed: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 }
    )
  }

  // Check size (base64 string length is ~1.37x the file size)
  if (photo.length > MAX_SIZE_BYTES * 1.4) {
    return NextResponse.json({ error: 'Image too large. Maximum 512 KB.' }, { status: 400 })
  }

  await db.user.update({
    where: { id: userId },
    data: { image: photo },
  })

  return NextResponse.json({ image: photo })
}

// DELETE /api/identity/photo — remove profile photo
export async function DELETE() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await db.user.update({
    where: { id: userId },
    data: { image: null },
  })

  return NextResponse.json({ image: null })
}
