/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { chapterService } from '@/services'
import { sendEmail } from '@/lib/email'

const openChapterSchema = z.object({
  pathId: z.string().min(1),
  coverLetter: z.string().max(2000).optional(),
})

// POST /api/chapters — Pioneer opens a Chapter on a Path
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Login required to open a Chapter' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const parsed = openChapterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    const chapter = await chapterService.create({
      pathId: parsed.data.pathId,
      pioneerId: session.user.id,
      coverLetter: parsed.data.coverLetter,
    })

    // Email the Pioneer that their Chapter was opened (fire-and-forget)
    void sendEmail(session.user.email!, 'chapter_opened', {
      name: session.user.name || 'Pioneer',
      pathId: parsed.data.pathId,
    }).catch((err) => console.error('Chapter opened email error:', err))

    return NextResponse.json({ success: true, data: chapter }, { status: 201 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to open Chapter'
    const status = message.includes('already opened') ? 409 : 500
    console.error('POST /api/chapters error:', err)
    return NextResponse.json({ success: false, error: message }, { status })
  }
}

// GET /api/chapters — list Chapters for current user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role')

  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }

    let chapters: Awaited<ReturnType<typeof chapterService.listByPioneer>>
    if (role === 'anchor') {
      // For anchors, we'd list chapters on their paths
      // For now, return empty — will expand when anchor dashboard is wired
      chapters = []
    } else {
      chapters = await chapterService.listByPioneer(session.user.id)
    }

    return NextResponse.json({ success: true, data: chapters, total: chapters.length })
  } catch (err) {
    console.error('GET /api/chapters error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch Chapters' }, { status: 500 })
  }
}
