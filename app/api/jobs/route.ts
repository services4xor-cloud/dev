import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const createJobSchema = z.object({
  title: z.string().min(3).max(100),
  company: z.string().min(2).max(100),
  description: z.string().min(50),
  location: z.string().min(2),
  isRemote: z.boolean().default(false),
  jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'REMOTE', 'INTERNSHIP']),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  currency: z.string().length(3).default('KES'),
  skills: z.array(z.string()).min(1).max(20),
  country: z.string().default('Kenya'),
  tier: z.enum(['BASIC', 'FEATURED', 'PREMIUM']).default('BASIC'),
})

// GET /api/jobs — list jobs with filters
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''
  const jobType = searchParams.get('jobType') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50)

  try {
    // TODO: replace with real Prisma query when DB is connected
    // const jobs = await prisma.job.findMany({
    //   where: {
    //     status: 'ACTIVE',
    //     ...(q && { OR: [{ title: { contains: q, mode: 'insensitive' } }, { company: { contains: q, mode: 'insensitive' } }] }),
    //     ...(jobType && { jobType }),
    //   },
    //   orderBy: [{ tier: 'desc' }, { createdAt: 'desc' }],
    //   skip: (page - 1) * limit,
    //   take: limit,
    // })

    // Mock response for now
    return NextResponse.json({
      success: true,
      data: [],
      total: 0,
      page,
      limit,
      filters: { q, category, location, jobType },
    })
  } catch (err) {
    console.error('GET /api/jobs error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch jobs' }, { status: 500 })
  }
}

// POST /api/jobs — create a job post
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createJobSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    // TODO: auth check — ensure user is logged in and is EMPLOYER
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'EMPLOYER') {
    //   return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    // }

    // TODO: create job in Prisma
    // const job = await prisma.job.create({ data: { ...parsed.data, userId: session.user.id, status: 'DRAFT', expiresAt: addDays(new Date(), 30) } })

    const mockJob = {
      id: `job_${Date.now()}`,
      ...parsed.data,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ success: true, data: mockJob }, { status: 201 })
  } catch (err) {
    console.error('POST /api/jobs error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create job' }, { status: 500 })
  }
}
