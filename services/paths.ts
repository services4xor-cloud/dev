/**
 * Path Service — DB-first with mock fallback
 *
 * When DATABASE_URL is set, queries Neon PostgreSQL via Prisma.
 * Otherwise, returns mock data for development.
 */

import { db } from '@/lib/db'
import { hasDatabase } from './db'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PathListItem {
  id: string
  title: string
  company: string
  location: string
  country: string
  sector: string | null
  salaryMin: number | null
  salaryMax: number | null
  currency: string
  skills: string[]
  status: string
  tier: string
  pathType: string
  isRemote: boolean
  description: string
  createdAt: Date | string
  expiresAt: Date | string
  anchorId: string
  anchorName?: string
  _count?: { chapters: number }
}

export interface PathFilters {
  country?: string
  status?: string
  sector?: string
  q?: string
  anchorId?: string
  page?: number
  limit?: number
}

// ─── Prisma implementation ──────────────────────────────────────────────────

async function listFromDB(
  filters: PathFilters = {}
): Promise<{ paths: PathListItem[]; total: number }> {
  const { country, status = 'OPEN', sector, q, anchorId, page = 1, limit = 20 } = filters

  const where = {
    ...(status && { status: status as 'OPEN' | 'PAUSED' | 'DRAFT' | 'EXPIRED' | 'FILLED' }),
    ...(country && { country }),
    ...(sector && { sector }),
    ...(anchorId && { anchorId }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' as const } },
        { description: { contains: q, mode: 'insensitive' as const } },
        { company: { contains: q, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [paths, total] = await Promise.all([
    db.path.findMany({
      where,
      orderBy: [{ tier: 'desc' }, { createdAt: 'desc' }],
      skip: (page - 1) * limit,
      take: limit,
      include: {
        anchor: { select: { name: true } },
        _count: { select: { chapters: true } },
      },
    }),
    db.path.count({ where }),
  ])

  return {
    paths: paths.map((p) => ({
      ...p,
      anchorName: p.anchor.name ?? p.company,
      pathType: p.pathType,
    })),
    total,
  }
}

async function getByIdFromDB(id: string) {
  return db.path.findUnique({
    where: { id },
    include: {
      anchor: { select: { name: true, email: true, country: true, avatarUrl: true } },
      _count: { select: { chapters: true, savedBy: true } },
    },
  })
}

async function createInDB(data: {
  title: string
  company: string
  description: string
  location: string
  country: string
  anchorId: string
  sector?: string
  salaryMin?: number
  salaryMax?: number
  currency?: string
  skills?: string[]
  isRemote?: boolean
  pathType?: 'FULL_PATH' | 'PART_PATH' | 'SEASONAL' | 'CONTRACT' | 'REMOTE'
  tier?: 'BASIC' | 'FEATURED' | 'PREMIUM'
}) {
  return db.path.create({
    data: {
      ...data,
      skills: data.skills ?? [],
      currency: data.currency ?? 'KES',
      pathType: data.pathType ?? 'FULL_PATH',
      tier: data.tier ?? 'BASIC',
      status: 'OPEN',
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    },
  })
}

// ─── Mock fallback ──────────────────────────────────────────────────────────

const MOCK_PATHS: PathListItem[] = [
  {
    id: 'path_mock_1',
    title: 'Senior Wildlife Guide — Big Five',
    company: 'Ol Pejeta Conservancy',
    sector: 'safari',
    pathType: 'FULL_PATH',
    location: 'Laikipia, Kenya',
    country: 'KE',
    isRemote: false,
    description: 'Lead immersive Big Five safari experiences for guests at Ol Pejeta Conservancy.',
    skills: ['Big Five tracking', 'Bush safety', 'FGASA', 'Swahili', 'First aid'],
    salaryMin: 80000,
    salaryMax: 140000,
    currency: 'KES',
    anchorId: 'anchor_olpejeta',
    anchorName: 'Ol Pejeta Conservancy',
    status: 'OPEN',
    tier: 'FEATURED',
    createdAt: '2026-03-05T08:00:00Z',
    expiresAt: '2026-05-04T08:00:00Z',
    _count: { chapters: 14 },
  },
  {
    id: 'path_mock_2',
    title: 'Full-Stack Developer — BeNetwork',
    company: 'BeNetwork HQ',
    sector: 'tech',
    pathType: 'FULL_PATH',
    location: 'Nairobi, Kenya',
    country: 'KE',
    isRemote: true,
    description: 'Build the infrastructure for the next 10 countries in the BeNetwork ecosystem.',
    skills: ['TypeScript', 'Next.js', 'Prisma', 'PostgreSQL', 'React'],
    salaryMin: 200000,
    salaryMax: 350000,
    currency: 'KES',
    anchorId: 'anchor_bekenya',
    anchorName: 'BeNetwork HQ',
    status: 'OPEN',
    tier: 'PREMIUM',
    createdAt: '2026-03-06T12:00:00Z',
    expiresAt: '2026-05-05T12:00:00Z',
    _count: { chapters: 31 },
  },
  {
    id: 'path_mock_3',
    title: 'Cloud Platform Engineer',
    company: 'Berlin Digital GmbH',
    sector: 'tech',
    pathType: 'FULL_PATH',
    location: 'Berlin, Germany',
    country: 'DE',
    isRemote: false,
    description: 'Join our cloud platform team building enterprise solutions for European markets.',
    skills: ['ERP Systems', 'TypeScript', 'Cloud Architecture', 'German B2'],
    salaryMin: 65000,
    salaryMax: 85000,
    currency: 'EUR',
    anchorId: 'anchor_berlin_digital',
    anchorName: 'Berlin Digital GmbH',
    status: 'OPEN',
    tier: 'FEATURED',
    createdAt: '2026-03-04T10:00:00Z',
    expiresAt: '2026-05-03T10:00:00Z',
    _count: { chapters: 8 },
  },
  {
    id: 'path_mock_4',
    title: 'Pharma Research Associate',
    company: 'Basel Pharma SA',
    sector: 'healthcare',
    pathType: 'FULL_PATH',
    location: 'Basel, Switzerland',
    country: 'CH',
    isRemote: false,
    description:
      'Research associate in immunology division working on next-generation therapeutics.',
    skills: ['Immunology', 'Lab Techniques', 'Data Analysis', 'German B1'],
    salaryMin: 75000,
    salaryMax: 95000,
    currency: 'CHF',
    anchorId: 'anchor_basel_pharma',
    anchorName: 'Basel Pharma SA',
    status: 'OPEN',
    tier: 'PREMIUM',
    createdAt: '2026-03-03T09:00:00Z',
    expiresAt: '2026-05-02T09:00:00Z',
    _count: { chapters: 5 },
  },
]

function listFromMock(filters: PathFilters = {}): { paths: PathListItem[]; total: number } {
  let results = [...MOCK_PATHS]

  if (filters.country) results = results.filter((p) => p.country === filters.country)
  if (filters.status) results = results.filter((p) => p.status === filters.status!.toUpperCase())
  if (filters.sector) results = results.filter((p) => p.sector === filters.sector)
  if (filters.anchorId) results = results.filter((p) => p.anchorId === filters.anchorId)
  if (filters.q) {
    const q = filters.q.toLowerCase()
    results = results.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.anchorName ?? '').toLowerCase().includes(q)
    )
  }

  const page = filters.page ?? 1
  const limit = filters.limit ?? 20
  const paginated = results.slice((page - 1) * limit, page * limit)

  return { paths: paginated, total: results.length }
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const pathService = {
  async list(filters?: PathFilters) {
    if (hasDatabase) {
      try {
        return await listFromDB(filters)
      } catch (err) {
        console.warn(
          '[pathService.list] DB unreachable, falling back to mock:',
          (err as Error).message
        )
        return listFromMock(filters)
      }
    }
    return listFromMock(filters)
  },

  async getById(id: string) {
    if (hasDatabase) {
      try {
        return await getByIdFromDB(id)
      } catch (err) {
        console.warn(
          '[pathService.getById] DB unreachable, falling back to mock:',
          (err as Error).message
        )
        return MOCK_PATHS.find((p) => p.id === id) ?? null
      }
    }
    return MOCK_PATHS.find((p) => p.id === id) ?? null
  },

  async create(data: Parameters<typeof createInDB>[0]) {
    if (!hasDatabase) {
      return {
        id: `path_${Date.now()}`,
        ...data,
        skills: data.skills ?? [],
        currency: data.currency ?? 'KES',
        pathType: data.pathType ?? 'FULL_PATH',
        tier: data.tier ?? 'BASIC',
        status: 'OPEN' as const,
        isRemote: data.isRemote ?? false,
        expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    }
    return createInDB(data)
  },
}
