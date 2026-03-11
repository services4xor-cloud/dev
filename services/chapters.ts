/**
 * Chapter Service — DB-first with mock fallback
 *
 * A Chapter is a Pioneer's engagement with a Path (like an application).
 */

import { db } from '@/lib/db'
import { hasDatabase } from './db'

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChapterItem {
  id: string
  pathId: string
  pioneerId: string
  coverLetter?: string | null
  status: string
  openedAt: Date | string
  path?: {
    title: string
    company: string
    location: string
    country: string
  }
  pioneer?: {
    name: string | null
    email: string
    avatarUrl: string | null
  }
}

// ─── Prisma implementation ──────────────────────────────────────────────────

async function createInDB(data: {
  pathId: string
  pioneerId: string
  coverLetter?: string
}): Promise<ChapterItem> {
  // Check for duplicate
  const existing = await db.chapter.findFirst({
    where: { pathId: data.pathId, pioneerId: data.pioneerId },
  })
  if (existing) throw new Error('Chapter already opened on this Path')

  const chapter = await db.chapter.create({
    data: {
      pathId: data.pathId,
      pioneerId: data.pioneerId,
      coverLetter: data.coverLetter,
      status: 'PENDING',
    },
    include: {
      path: { select: { title: true, company: true, location: true, country: true } },
      pioneer: { select: { name: true, email: true, avatarUrl: true } },
    },
  })

  return {
    id: chapter.id,
    pathId: chapter.pathId,
    pioneerId: chapter.pioneerId,
    coverLetter: chapter.coverLetter,
    status: chapter.status,
    openedAt: chapter.openedAt,
    path: chapter.path,
    pioneer: chapter.pioneer,
  }
}

async function listByPioneerFromDB(pioneerId: string): Promise<ChapterItem[]> {
  const chapters = await db.chapter.findMany({
    where: { pioneerId },
    orderBy: { openedAt: 'desc' },
    include: {
      path: { select: { title: true, company: true, location: true, country: true } },
    },
  })

  return chapters.map((c) => ({
    id: c.id,
    pathId: c.pathId,
    pioneerId: c.pioneerId,
    coverLetter: c.coverLetter,
    status: c.status,
    openedAt: c.openedAt,
    path: c.path,
  }))
}

async function listByPathFromDB(pathId: string): Promise<ChapterItem[]> {
  const chapters = await db.chapter.findMany({
    where: { pathId },
    orderBy: { openedAt: 'desc' },
    include: {
      pioneer: { select: { name: true, email: true, avatarUrl: true } },
    },
  })

  return chapters.map((c) => ({
    id: c.id,
    pathId: c.pathId,
    pioneerId: c.pioneerId,
    coverLetter: c.coverLetter,
    status: c.status,
    openedAt: c.openedAt,
    pioneer: c.pioneer,
  }))
}

// ─── Exports ────────────────────────────────────────────────────────────────

export const chapterService = {
  async create(data: { pathId: string; pioneerId: string; coverLetter?: string }) {
    if (!hasDatabase) {
      return {
        id: `ch_${Date.now()}`,
        ...data,
        status: 'PENDING',
        openedAt: new Date().toISOString(),
      }
    }
    return createInDB(data)
  },

  async listByPioneer(pioneerId: string) {
    if (!hasDatabase) return []
    return listByPioneerFromDB(pioneerId)
  },

  async listByPath(pathId: string) {
    if (!hasDatabase) return []
    return listByPathFromDB(pathId)
  },
}
