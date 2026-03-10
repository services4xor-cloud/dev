/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { generatePathPostCopy, type SocialPlatform } from '@/lib/social-media'

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const pioneerTypeSchema = z.enum([
  'explorer',
  'professional',
  'artisan',
  'guardian',
  'creator',
  'healer',
])

const pathCategorySchema = z.enum([
  'safari',
  'marine',
  'tech',
  'finance',
  'fashion',
  'media',
  'health',
  'education',
  'charity',
  'ecotourism',
  'hospitality',
  'logistics',
])

const createPathSchema = z.object({
  // Basics (Step 1)
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  category: pathCategorySchema,
  pathType: z.enum(['Full Path', 'Part Path', 'Seasonal Path']).default('Full Path'),
  location: z.string().min(2, 'Location is required').max(120),
  isRemote: z.boolean().default(false),

  // Description & Requirements (Step 2)
  description: z.string().min(50, 'Description must be at least 50 characters'),
  requirements: z.array(z.string().min(2).max(200)).max(20).default([]),

  // Skills (Step 3)
  skills: z.array(z.string().min(1).max(60)).min(1, 'At least 1 skill required').max(30),

  // Pioneer Targeting (Step 4)
  targetPioneerTypes: z.array(pioneerTypeSchema).max(6).default([]),
  preferredOriginCountries: z.array(z.string().length(2)).max(20).default([]),

  // Compensation (Step 5)
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  currency: z.string().length(3).default('KES'),
  paymentMethods: z
    .array(z.enum(['mpesa', 'stripe', 'flutterwave', 'paypal', 'bank']))
    .min(1)
    .default(['mpesa']),

  // Anchor context (resolved server-side from session in production)
  anchorId: z.string().optional(),
  anchorName: z.string().optional(),
  country: z.string().default('Kenya'),
})

export type CreatePathInput = z.infer<typeof createPathSchema>

// ─── GET /api/paths ───────────────────────────────────────────────────────────
// Query params:
//   type        — pathType filter ("Full Path", "Part Path", "Seasonal Path")
//   category    — category id (safari, tech, ...)
//   location    — text search on location
//   remoteOk    — "true" to include remote paths
//   pioneerType — filter by which pioneer types the path targets
//   fromCountry — ISO2 preferred origin country
//   toCountry   — country where the path is based (= anchor country)
//   q           — free-text search across title + description
//   page        — 1-indexed page number (default: 1)
//   limit       — results per page, max 50 (default: 20)
//   anchorId    — filter paths by a specific anchor (org)
//   status      — "open" | "paused" | "closed" (default: open)

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const type = searchParams.get('type') || ''
  const category = searchParams.get('category') || ''
  const location = searchParams.get('location') || ''
  const remoteOk = searchParams.get('remoteOk') === 'true'
  const pioneerType = searchParams.get('pioneerType') || ''
  const fromCountry = searchParams.get('fromCountry') || ''
  const toCountry = searchParams.get('toCountry') || ''
  const q = searchParams.get('q') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const anchorId = searchParams.get('anchorId') || ''
  const status = searchParams.get('status') || 'open'

  try {
    // TODO: Replace with real Prisma query when DB is connected.
    //
    // const where: Prisma.PathWhereInput = {
    //   status: status || 'open',
    //   ...(type && { pathType: type }),
    //   ...(category && { category }),
    //   ...(remoteOk && { isRemote: true }),
    //   ...(anchorId && { anchorId }),
    //   ...(location && { location: { contains: location, mode: 'insensitive' } }),
    //   ...(pioneerType && { targetPioneerTypes: { has: pioneerType } }),
    //   ...(fromCountry && { preferredOriginCountries: { has: fromCountry } }),
    //   ...(toCountry && { country: toCountry }),
    //   ...(q && {
    //     OR: [
    //       { title: { contains: q, mode: 'insensitive' } },
    //       { description: { contains: q, mode: 'insensitive' } },
    //       { anchorName: { contains: q, mode: 'insensitive' } },
    //     ],
    //   }),
    // }
    //
    // const [paths, total] = await Promise.all([
    //   prisma.path.findMany({
    //     where,
    //     orderBy: [{ tier: 'desc' }, { createdAt: 'desc' }],
    //     skip: (page - 1) * limit,
    //     take: limit,
    //     include: { anchor: { select: { name: true, logo: true, country: true } } },
    //   }),
    //   prisma.path.count({ where }),
    // ])
    //
    // TODO: If pioneer profile provided in request headers/JWT, compute matchScores:
    // const matchScores = pioneerProfileId
    //   ? await computeMatchScores(paths, pioneerProfileId)
    //   : undefined

    // Mock response — returns mock paths shaped like the real schema
    const mockPaths = buildMockPaths({
      type,
      category,
      location,
      remoteOk,
      pioneerType,
      fromCountry,
      toCountry,
      q,
      status,
      anchorId,
    })

    const total = mockPaths.length
    const paginated = mockPaths.slice((page - 1) * limit, page * limit)

    return NextResponse.json({
      success: true,
      paths: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        type,
        category,
        location,
        remoteOk,
        pioneerType,
        fromCountry,
        toCountry,
        q,
        status,
        anchorId,
      },
    })
  } catch (err) {
    console.error('GET /api/paths error:', err)
    return NextResponse.json({ success: false, error: 'Failed to fetch paths' }, { status: 500 })
  }
}

// ─── POST /api/paths ──────────────────────────────────────────────────────────
// Creates a new Path for an Anchor.
// On success also queues social media auto-posts for enabled platforms.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = createPathSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || 'Validation failed',
          issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    // TODO: Auth check — ensure session is Anchor role
    // const session = await getServerSession(authOptions)
    // if (!session || session.user.role !== 'ANCHOR') {
    //   return NextResponse.json({ success: false, error: 'Unauthorized — Anchors only' }, { status: 401 })
    // }
    // const anchorId = session.user.id
    // const anchorName = session.user.name || ''

    // TODO: persist to Prisma
    // const path = await prisma.path.create({
    //   data: {
    //     ...data,
    //     anchorId,
    //     status: 'open',
    //     expiresAt: addDays(new Date(), 30),
    //   },
    // })

    const mockPath = {
      id: `path_${Date.now()}`,
      ...data,
      anchorId: data.anchorId || `anchor_mock`,
      anchorName: data.anchorName || 'Your Organisation',
      status: 'open',
      chapters: 0,
      views: 0,
      matchScoreAvg: null,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    }

    // Queue social media auto-post (fire-and-forget; errors must not block response)
    void queueSocialAutoPost(mockPath).catch((err: unknown) =>
      console.error('Social auto-post queue error:', err)
    )

    return NextResponse.json({ success: true, data: mockPath }, { status: 201 })
  } catch (err) {
    console.error('POST /api/paths error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create path' }, { status: 500 })
  }
}

// ─── Social Auto-Post Queue ───────────────────────────────────────────────────
// Reads anchor's enabled platforms from settings and enqueues posts.
// In production this would push to a queue (e.g. BullMQ / Inngest).

interface PathRecord {
  id: string
  title: string
  anchorName: string
  location: string
  category: string
  country: string
  [key: string]: unknown
}

async function queueSocialAutoPost(path: PathRecord): Promise<void> {
  // TODO: load anchor's social platform settings from DB
  // const anchorSettings = await prisma.anchorSocialSettings.findUnique({ where: { anchorId: path.anchorId } })
  // const enabledPlatforms = anchorSettings?.enabledPlatforms ?? []

  // Mock: anchor has LinkedIn + Twitter enabled
  const enabledPlatforms: SocialPlatform[] = ['linkedin', 'twitter_x']

  if (enabledPlatforms.length === 0) return

  const copy = generatePathPostCopy(path.title, path.anchorName, path.location, path.category)

  // TODO: for each platform, push a job to the queue with the copy
  // await Promise.all(
  //   enabledPlatforms.map(platform =>
  //     socialQueue.add('post', {
  //       pathId: path.id,
  //       platform,
  //       text: copy[platform],
  //       scheduledFor: new Date(), // post immediately
  //     })
  //   )
  // )

  // Mock log for now
  for (const platform of enabledPlatforms) {
    console.log(
      `[SocialAutoPost] Queued post to ${platform} for path "${path.title}": ${copy[platform].slice(0, 60)}…`
    )
  }
}

// ─── Mock data builder ────────────────────────────────────────────────────────

interface PathFilters {
  type: string
  category: string
  location: string
  remoteOk: boolean
  pioneerType: string
  fromCountry: string
  toCountry: string
  q: string
  status: string
  anchorId: string
}

function buildMockPaths(filters: PathFilters) {
  const allPaths = [
    {
      id: 'path_mock_1',
      title: 'Senior Wildlife Guide — Big Five',
      category: 'safari',
      pathType: 'Full Path',
      location: 'Laikipia, Kenya',
      country: 'KE',
      isRemote: false,
      description:
        'Lead immersive Big Five safari experiences for guests at Ol Pejeta Conservancy. You will track, interpret, and protect while crafting unforgettable encounters.',
      requirements: ['FGASA Level 2+', 'Valid driving licence', 'Swahili proficient'],
      skills: ['Big Five tracking', 'Bush safety', 'FGASA', 'Swahili', 'First aid'],
      targetPioneerTypes: ['explorer'],
      preferredOriginCountries: ['KE', 'ZA', 'TZ'],
      salaryMin: 80000,
      salaryMax: 140000,
      currency: 'KES',
      paymentMethods: ['mpesa', 'bank'],
      anchorId: 'anchor_olpejeta',
      anchorName: 'Ol Pejeta Conservancy',
      status: 'open',
      chapters: 14,
      views: 312,
      matchScoreAvg: 87,
      createdAt: '2026-03-05T08:00:00Z',
      expiresAt: '2026-04-04T08:00:00Z',
    },
    {
      id: 'path_mock_2',
      title: 'Eco-Lodge Operations Manager',
      category: 'ecotourism',
      pathType: 'Full Path',
      location: 'Maasai Mara, Kenya',
      country: 'KE',
      isRemote: false,
      description:
        'Oversee daily operations of a 20-room eco-lodge deep in the Maasai Mara ecosystem. Lead a team of 35 staff, manage inventory, P&L, and guest experience.',
      requirements: ['5+ years lodge management', 'Eco-certification preferred'],
      skills: [
        'Lodge management',
        'P&L ownership',
        'Staff training',
        'Eco-certification',
        'Swahili',
      ],
      targetPioneerTypes: ['professional', 'guardian'],
      preferredOriginCountries: ['KE', 'TZ', 'UG'],
      salaryMin: 150000,
      salaryMax: 250000,
      currency: 'KES',
      paymentMethods: ['mpesa', 'bank'],
      anchorId: 'anchor_serena',
      anchorName: 'Serena Hotels & Lodges',
      status: 'open',
      chapters: 7,
      views: 184,
      matchScoreAvg: 79,
      createdAt: '2026-03-01T10:00:00Z',
      expiresAt: '2026-03-31T10:00:00Z',
    },
    {
      id: 'path_mock_3',
      title: 'Content Creator — Safari Stories',
      category: 'media',
      pathType: 'Part Path',
      location: 'Nairobi / Remote',
      country: 'KE',
      isRemote: true,
      description:
        'Create compelling wildlife content for our digital channels — Instagram Reels, TikTok, and YouTube. We have the animals; you bring the storytelling magic.',
      requirements: ['Portfolio of wildlife/nature content', 'Drone licence preferred'],
      skills: [
        'Wildlife photography',
        'Video production',
        'Instagram reels',
        'Adobe Suite',
        'Drone operation',
      ],
      targetPioneerTypes: ['creator'],
      preferredOriginCountries: ['KE', 'ZA', 'DE', 'GB'],
      salaryMin: 50000,
      salaryMax: 90000,
      currency: 'KES',
      paymentMethods: ['mpesa', 'stripe'],
      anchorId: 'anchor_olpejeta',
      anchorName: 'Ol Pejeta Conservancy',
      status: 'open',
      chapters: 22,
      views: 521,
      matchScoreAvg: 74,
      createdAt: '2026-02-22T09:00:00Z',
      expiresAt: '2026-03-24T09:00:00Z',
    },
    {
      id: 'path_mock_4',
      title: 'Full-Stack Developer — BeNetwork Expansion',
      category: 'tech',
      pathType: 'Full Path',
      location: 'Nairobi, Kenya',
      country: 'KE',
      isRemote: true,
      description:
        'Build the infrastructure for the next 10 countries in the BeNetwork ecosystem. Work with Next.js, Prisma, and M-Pesa APIs to scale a platform used by thousands of Pioneers.',
      requirements: ['3+ years TypeScript experience', 'Familiarity with Next.js App Router'],
      skills: ['TypeScript', 'Next.js', 'Prisma', 'PostgreSQL', 'React', 'REST APIs'],
      targetPioneerTypes: ['professional'],
      preferredOriginCountries: ['KE', 'NG', 'GH', 'IN'],
      salaryMin: 200000,
      salaryMax: 350000,
      currency: 'KES',
      paymentMethods: ['mpesa', 'stripe', 'paypal'],
      anchorId: 'anchor_bekenya',
      anchorName: 'BeNetwork HQ',
      status: 'open',
      chapters: 31,
      views: 867,
      matchScoreAvg: 82,
      createdAt: '2026-03-06T12:00:00Z',
      expiresAt: '2026-04-05T12:00:00Z',
    },
    {
      id: 'path_mock_5',
      title: 'Community Health Liaison',
      category: 'health',
      pathType: 'Full Path',
      location: 'Nanyuki, Kenya',
      country: 'KE',
      isRemote: false,
      description:
        'Bridge healthcare access gaps in conservancy-adjacent communities. Run mobile clinics, train community health workers, and coordinate with county health teams.',
      requirements: ['Diploma in nursing or community health', 'Driving licence'],
      skills: [
        'Community health',
        'Health education',
        'First aid',
        'Swahili',
        'Project management',
      ],
      targetPioneerTypes: ['healer'],
      preferredOriginCountries: ['KE', 'UG', 'TZ', 'ET'],
      salaryMin: 60000,
      salaryMax: 90000,
      currency: 'KES',
      paymentMethods: ['mpesa'],
      anchorId: 'anchor_olpejeta',
      anchorName: 'Ol Pejeta Conservancy',
      status: 'paused',
      chapters: 4,
      views: 97,
      matchScoreAvg: 68,
      createdAt: '2026-02-15T08:00:00Z',
      expiresAt: '2026-03-17T08:00:00Z',
    },
  ]

  return allPaths.filter((p) => {
    if (filters.status && p.status !== filters.status) return false
    if (filters.type && p.pathType !== filters.type) return false
    if (filters.category && p.category !== filters.category) return false
    if (filters.remoteOk && !p.isRemote) return false
    if (filters.anchorId && p.anchorId !== filters.anchorId) return false
    if (filters.location && !p.location.toLowerCase().includes(filters.location.toLowerCase()))
      return false
    if (filters.toCountry && p.country !== filters.toCountry) return false
    if (filters.pioneerType && !p.targetPioneerTypes.includes(filters.pioneerType as never))
      return false
    if (filters.fromCountry && !p.preferredOriginCountries.includes(filters.fromCountry))
      return false
    if (filters.q) {
      const lower = filters.q.toLowerCase()
      if (
        !p.title.toLowerCase().includes(lower) &&
        !p.description.toLowerCase().includes(lower) &&
        !p.anchorName.toLowerCase().includes(lower)
      )
        return false
    }
    return true
  })
}
