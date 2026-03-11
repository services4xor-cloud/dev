/**
 * Thread Service — DB-first with mock fallback
 *
 * Threads are identity-based communities: Be[Country], Be[Tribe], Be[Location].
 * When DB is available, queries Prisma. Otherwise, returns mock data.
 */

import { db } from '@/lib/db'
import { hasDatabase } from './db'
import { MOCK_THREADS } from '@/data/mock/threads'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ThreadItem {
  id?: string
  slug: string
  name: string
  brandName: string
  type: string
  icon: string
  tagline: string
  description?: string
  parentSlug?: string | null
  countries: string[]
  relatedSlugs?: string[]
  memberCount: number
  active: boolean
}

export interface ThreadFilters {
  type?: string
  country?: string
  active?: boolean
  parentSlug?: string
}

// ─── Prisma implementation ──────────────────────────────────────────────────

async function listFromDB(filters: ThreadFilters = {}): Promise<ThreadItem[]> {
  const where = {
    ...(filters.active !== undefined && { active: filters.active }),
    ...(filters.type && {
      type: filters.type as
        | 'COUNTRY'
        | 'TRIBE'
        | 'LANGUAGE'
        | 'INTEREST'
        | 'RELIGION'
        | 'SCIENCE'
        | 'LOCATION',
    }),
    ...(filters.parentSlug && { parentSlug: filters.parentSlug }),
    ...(filters.country && { countries: { has: filters.country } }),
  }

  const threads = await db.thread.findMany({
    where,
    orderBy: [{ type: 'asc' }, { memberCount: 'desc' }],
    include: {
      _count: { select: { memberships: true } },
    },
  })

  return threads.map((t) => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    brandName: t.brandName,
    type: t.type,
    icon: t.icon,
    tagline: t.tagline,
    description: t.description,
    parentSlug: t.parentSlug,
    countries: t.countries,
    relatedSlugs: t.relatedSlugs,
    memberCount: t.memberCount + t._count.memberships,
    active: t.active,
  }))
}

async function getBySlugFromDB(slug: string): Promise<ThreadItem | null> {
  const thread = await db.thread.findUnique({
    where: { slug },
    include: {
      children: {
        where: { active: true },
        orderBy: { memberCount: 'desc' },
      },
      _count: { select: { memberships: true } },
    },
  })

  if (!thread) return null

  return {
    id: thread.id,
    slug: thread.slug,
    name: thread.name,
    brandName: thread.brandName,
    type: thread.type,
    icon: thread.icon,
    tagline: thread.tagline,
    description: thread.description,
    parentSlug: thread.parentSlug,
    countries: thread.countries,
    relatedSlugs: thread.relatedSlugs,
    memberCount: thread.memberCount + thread._count.memberships,
    active: thread.active,
  }
}

// ─── Mock fallback ──────────────────────────────────────────────────────────

function listFromMock(filters: ThreadFilters = {}): ThreadItem[] {
  let results = MOCK_THREADS.filter((t) => t.active)

  if (filters.type) results = results.filter((t) => t.type === filters.type!.toLowerCase())
  if (filters.country) results = results.filter((t) => t.countries?.includes(filters.country!))
  if (filters.parentSlug)
    results = results.filter(
      (t) =>
        'parentThread' in t && (t as { parentThread?: string }).parentThread === filters.parentSlug
    )

  return results.map((t) => ({
    slug: t.slug,
    name: t.name,
    brandName: t.brandName,
    type: t.type,
    icon: t.icon,
    tagline: t.tagline,
    description: t.description,
    parentSlug: 'parentThread' in t ? (t as { parentThread?: string }).parentThread : null,
    countries: t.countries ?? [],
    memberCount: t.memberCount ?? 0,
    active: t.active ?? true,
  }))
}

function getBySlugFromMock(slug: string): ThreadItem | null {
  const thread = MOCK_THREADS.find((t) => t.slug === slug)
  if (!thread) return null

  return {
    slug: thread.slug,
    name: thread.name,
    brandName: thread.brandName,
    type: thread.type,
    icon: thread.icon,
    tagline: thread.tagline,
    description: thread.description,
    parentSlug:
      'parentThread' in thread ? (thread as { parentThread?: string }).parentThread : null,
    countries: thread.countries ?? [],
    memberCount: thread.memberCount ?? 0,
    active: thread.active ?? true,
  }
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const threadService = {
  async list(filters?: ThreadFilters): Promise<ThreadItem[]> {
    if (hasDatabase) return listFromDB(filters)
    return listFromMock(filters)
  },

  async getBySlug(slug: string): Promise<ThreadItem | null> {
    if (hasDatabase) return getBySlugFromDB(slug)
    return getBySlugFromMock(slug)
  },
}
