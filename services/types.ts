/**
 * Service Interfaces — contracts between UI and backend
 *
 * These interfaces define what the UI needs from the data layer.
 * Current implementation: mock data (services/mock.ts)
 * Future implementation: Prisma + real DB (services/prisma.ts)
 *
 * All methods return Promises to enforce async-ready patterns.
 */

import type {
  Path,
  PathListItem,
  PioneerProfile,
  Anchor,
  Chapter,
  Payment,
  PlatformStats,
  AdminPioneer,
  AdminPath,
  AdminChapter,
  PathFilters,
  PioneerFilters,
  MatchResult,
  PricingPlan,
  PaymentMethodInfo,
} from '@/types/domain'
import type {
  CreatePathRequest,
  OnboardingRequest,
  OpenChapterRequest,
  UpdatePathRequest,
} from '@/types/api'

// ─── Path Service ────────────────────────────────────────────────────────────

export interface IPathService {
  /** List paths with optional filters */
  list(filters?: PathFilters): Promise<PathListItem[]>

  /** Get a single path by ID */
  getById(id: string): Promise<Path | null>

  /** Create a new path (Anchor action) */
  create(data: CreatePathRequest): Promise<Path>

  /** Update an existing path */
  update(id: string, data: UpdatePathRequest): Promise<Path>

  /** Get featured paths */
  getFeatured(): Promise<PathListItem[]>
}

// ─── Pioneer Service ─────────────────────────────────────────────────────────

export interface IPioneerService {
  /** Get pioneer profile by ID */
  getById(id: string): Promise<PioneerProfile | null>

  /** Get current pioneer profile (from session) */
  getCurrent(): Promise<PioneerProfile | null>

  /** Onboard a new pioneer */
  onboard(data: OnboardingRequest): Promise<PioneerProfile>

  /** Update pioneer profile */
  updateProfile(id: string, data: Partial<PioneerProfile>): Promise<PioneerProfile>

  /** Get pioneer's chapters */
  getChapters(pioneerId: string): Promise<Chapter[]>

  /** Get pioneer's saved paths */
  getSavedPaths(pioneerId: string): Promise<Path[]>
}

// ─── Anchor Service ──────────────────────────────────────────────────────────

export interface IAnchorService {
  /** List all anchors */
  list(): Promise<Anchor[]>

  /** Get anchor by ID */
  getById(id: string): Promise<Anchor | null>

  /** Get anchor's posted paths */
  getPaths(anchorId: string): Promise<Path[]>

  /** Verify an anchor (admin action) */
  verify(anchorId: string): Promise<Anchor>
}

// ─── Chapter Service ─────────────────────────────────────────────────────────

export interface IChapterService {
  /** Open a new chapter (Pioneer applies to Path) */
  open(data: OpenChapterRequest): Promise<Chapter>

  /** Get chapter by ID */
  getById(id: string): Promise<Chapter | null>

  /** Update chapter status (Anchor/Admin action) */
  updateStatus(id: string, status: Chapter['status']): Promise<Chapter>

  /** List chapters for a path */
  listByPath(pathId: string): Promise<Chapter[]>

  /** List chapters for a pioneer */
  listByPioneer(pioneerId: string): Promise<Chapter[]>
}

// ─── Compass Service ─────────────────────────────────────────────────────────

export interface ICompassService {
  /** Score and rank paths for a pioneer */
  rankPaths(profile: PioneerProfile, paths?: Path[]): Promise<MatchResult[]>

  /** Get route info between countries */
  getRouteInfo(
    from: string,
    to: string
  ): Promise<{
    strength: 'direct' | 'partner' | 'emerging'
    visaNotes?: string
    paymentMethods: string[]
  }>
}

// ─── Payment Service ─────────────────────────────────────────────────────────

export interface IPaymentService {
  /** Initiate M-Pesa STK Push */
  initiateMpesa(
    phone: string,
    amount: number,
    reference: string
  ): Promise<{
    success: boolean
    checkoutRequestId?: string
    error?: string
  }>

  /** Check payment status */
  getStatus(paymentId: string): Promise<Payment | null>
}

// ─── Admin Service ───────────────────────────────────────────────────────────

export interface IAdminService {
  /** Get platform overview stats */
  getStats(): Promise<PlatformStats>

  /** List all pioneers with filters */
  listPioneers(filters?: PioneerFilters): Promise<AdminPioneer[]>

  /** List all anchors */
  listAnchors(): Promise<Anchor[]>

  /** List all paths */
  listPaths(): Promise<AdminPath[]>

  /** Get recent chapters */
  getRecentChapters(): Promise<AdminChapter[]>
}

// ─── Pricing Service ─────────────────────────────────────────────────────────

export interface IPricingService {
  /** Get all pricing plans */
  getPlans(): Promise<PricingPlan[]>

  /** Get supported payment methods */
  getPaymentMethods(): Promise<PaymentMethodInfo[]>
}

// ─── Static Data Service ─────────────────────────────────────────────────────

export interface IStaticDataService {
  /** Get skills for a given pioneer type */
  getSkillsByType(type: string): Promise<string[]>

  /** Get all available skills grouped by pioneer type */
  getAllSkills(): Promise<Record<string, string[]>>
}
