import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const applySchema = z.object({
  jobId: z.string().min(1),
  coverLetter: z.string().max(2000).optional(),
})

// POST /api/applications — apply to a job
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = applySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    // TODO: get session
    // const session = await getServerSession(authOptions)
    // if (!session) return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })

    // TODO: check for duplicate application
    // const existing = await prisma.application.findFirst({ where: { jobId: parsed.data.jobId, applicantId: session.user.id } })
    // if (existing) return NextResponse.json({ success: false, error: 'Already applied' }, { status: 409 })

    // TODO: create application
    // const application = await prisma.application.create({ data: { ...parsed.data, applicantId: session.user.id, status: 'PENDING' } })

    return NextResponse.json({
      success: true,
      data: {
        id: `app_${Date.now()}`,
        ...parsed.data,
        status: 'PENDING',
        appliedAt: new Date().toISOString(),
      },
    }, { status: 201 })
  } catch (err) {
    console.error('POST /api/applications error:', err)
    return NextResponse.json({ success: false, error: 'Failed to submit application' }, { status: 500 })
  }
}

// GET /api/applications — list applications for current user
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const role = searchParams.get('role') // 'applicant' | 'employer'

  try {
    // TODO: session + Prisma query

    return NextResponse.json({ success: true, data: [], total: 0 })
  } catch (err) {
    console.error('GET /api/applications error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 })
  }
}
