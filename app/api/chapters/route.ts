import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const openChapterSchema = z.object({
  pathId: z.string().min(1),
  coverLetter: z.string().max(2000).optional(),
})

// POST /api/chapters — Pioneer opens a Chapter on a Path
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = openChapterSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    // TODO: get session
    // const session = await getServerSession(authOptions)
    // if (!session) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })

    // TODO: check for duplicate Chapter
    // const existing = await prisma.chapter.findFirst({ where: { pathId: parsed.data.pathId, pioneerId: session.user.id } })
    // if (existing) return NextResponse.json({ success: false, error: 'Chapter already opened on this Path' }, { status: 409 })

    // TODO: create Chapter
    // const chapter = await prisma.chapter.create({ data: { ...parsed.data, pioneerId: session.user.id, status: 'PENDING' } })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: `ch_${Date.now()}`,
          ...parsed.data,
          status: 'PENDING',
          openedAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('POST /api/chapters error:', err)
    return NextResponse.json({ success: false, error: 'Failed to open Chapter' }, { status: 500 })
  }
}

// GET /api/chapters — list Chapters for current user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') // 'pioneer' | 'anchor'

  try {
    // TODO: session + Prisma query
    // if (role === 'anchor') → list chapters on paths the anchor posted
    // if (role === 'pioneer') → list chapters the pioneer opened

    return NextResponse.json({ success: true, data: [], total: 0 })
  } catch (err) {
    console.error('GET /api/chapters error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch Chapters' }, { status: 500 })
  }
}
