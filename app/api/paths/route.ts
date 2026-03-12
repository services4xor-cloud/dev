import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { pathService } from '@/services'
import { generatePathPostCopy, type SocialPlatform } from '@/lib/social-media'
import { COUNTRIES, type CountryCode } from '@/lib/countries'
import { logger } from '@/lib/logger'

// ─── Deployment defaults ─────────────────────────────────────────────────────
const DEPLOY_COUNTRY = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE') as CountryCode
const DEPLOY_CURRENCY = COUNTRIES[DEPLOY_COUNTRY]?.currency ?? 'KES'

// ─── Zod Schemas ──────────────────────────────────────────────────────────────

const createPathSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().min(2, 'Location is required').max(120),
  company: z.string().min(2).max(120).optional(),
  country: z.string().length(2).default(DEPLOY_COUNTRY),
  sector: z.string().max(60).optional(),
  isRemote: z.boolean().default(false),
  skills: z.array(z.string().min(1).max(60)).min(1, 'At least 1 skill required').max(30),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().min(0).optional(),
  currency: z.string().length(3).default(DEPLOY_CURRENCY),
  pathType: z
    .enum(['FULL_PATH', 'PART_PATH', 'SEASONAL', 'CONTRACT', 'REMOTE'])
    .default('FULL_PATH'),
  tier: z.enum(['BASIC', 'FEATURED', 'PREMIUM']).default('BASIC'),
})

export type CreatePathInput = z.infer<typeof createPathSchema>

// ─── GET /api/paths ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const country = searchParams.get('country') || undefined
  const sector = searchParams.get('sector') || undefined
  const q = searchParams.get('q') || undefined
  const anchorId = searchParams.get('anchorId') || undefined
  const status = searchParams.get('status') || 'OPEN'
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')))

  try {
    const { paths, total } = await pathService.list({
      country,
      sector,
      q,
      anchorId,
      status,
      page,
      limit,
    })

    return NextResponse.json({
      success: true,
      paths,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err) {
    logger.error('GET /api/paths failed', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to fetch paths' }, { status: 500 })
  }
}

// ─── POST /api/paths ──────────────────────────────────────────────────────────
// Creates a new Path. Requires authenticated Anchor.

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Auth check — require login. In production, also check ANCHOR role.
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Login required to post a Path' },
        { status: 401 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsed = createPathSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]
      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || 'Validation failed',
          issues: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        },
        { status: 400 }
      )
    }

    const data = parsed.data

    const path = await pathService.create({
      ...data,
      company: data.company || session.user.name || 'Unknown',
      anchorId: session.user.id,
    })

    // Queue social media auto-post (fire-and-forget)
    void queueSocialAutoPost({
      id: 'id' in path ? (path.id as string) : `path_${Date.now()}`,
      title: data.title,
      anchorName: data.company || session.user.name || '',
      location: data.location,
      category: data.sector || '',
      country: data.country,
    }).catch((err: unknown) => logger.error('Social auto-post queue error', { error: String(err) }))

    return NextResponse.json({ success: true, data: path }, { status: 201 })
  } catch (err) {
    logger.error('POST /api/paths failed', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to create path' }, { status: 500 })
  }
}

// ─── Social Auto-Post Queue ───────────────────────────────────────────────────

interface PathRecord {
  id: string
  title: string
  anchorName: string
  location: string
  category: string
  country: string
}

async function queueSocialAutoPost(path: PathRecord): Promise<void> {
  const enabledPlatforms: SocialPlatform[] = ['linkedin', 'twitter_x']
  if (enabledPlatforms.length === 0) return

  const copy = generatePathPostCopy(path.title, path.anchorName, path.location, path.category)

  for (const platform of enabledPlatforms) {
    logger.info('Social auto-post queued', {
      platform,
      pathTitle: path.title,
      preview: copy[platform].slice(0, 60),
    })
  }
}
