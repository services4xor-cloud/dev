/**
 * Service Layer — barrel export
 *
 * Provides DB-first services with mock fallback.
 * When DATABASE_URL is set → queries Neon PostgreSQL via Prisma.
 * When DATABASE_URL is missing → returns mock data for development.
 *
 * Usage:
 *   import { pathService, threadService, chapterService } from '@/services'
 *
 * Architecture:
 *   services/db.ts        → hasDatabase flag
 *   services/paths.ts     → pathService.list(), .getById(), .create()
 *   services/threads.ts   → threadService.list(), .getBySlug()
 *   services/chapters.ts  → chapterService.create(), .listByPioneer()
 *   services/pricing.ts   → pricingService.getPlans(), .formatPlanPrice()
 */

export { hasDatabase } from './db'
export { pathService } from './paths'
export { threadService } from './threads'
export { chapterService } from './chapters'
export { pricingService } from './pricing'

// Re-export types for convenience
export type { PathListItem, PathFilters } from './paths'
export type { ThreadItem, ThreadFilters } from './threads'
export type { ChapterItem } from './chapters'
