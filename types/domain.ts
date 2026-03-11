/**
 * Be[Network] Domain Types — Single source of truth
 *
 * These types define the core business model using BeNetwork vocabulary.
 * All UI components and services consume these types.
 * Backend implementations (Prisma, API) map to/from these.
 */

import type { PioneerType } from '@/lib/vocabulary'

// ─── Enums ───────────────────────────────────────────────────────────────────

export type UserRole = 'PIONEER' | 'ANCHOR' | 'ADMIN'

export type PathType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'REMOTE' | 'INTERNSHIP'
export type PathStatus = 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'FILLED'
export type PathTier = 'BASIC' | 'FEATURED' | 'PREMIUM'

export type ChapterStatus = 'PENDING' | 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'PLACED'

export type PaymentMethod = 'MPESA' | 'STRIPE' | 'FLUTTERWAVE' | 'PAYPAL'
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED'

export type VentureType = 'deep_sea_fishing' | 'wildlife_safari' | 'eco_lodge' | 'cultural'

export type FilterCategory = 'all' | 'professional' | 'explorer' | 'creative' | 'community'

// ─── Core Domain Models ──────────────────────────────────────────────────────

/** Pioneer — a person seeking paths/experiences */
export interface Pioneer {
  id: string
  name: string
  email: string
  phone?: string
  role: 'PIONEER'
  avatarUrl?: string
  country: string
  createdAt: string
}

/** PioneerProfile — extended Pioneer data for matching + display */
export interface PioneerProfile {
  id: string
  name: string
  pioneerType: PioneerType
  fromCountry: string
  toCountries: string[]
  skills: string[]
  headline: string
  bio?: string
  phone?: string
  yearsExperience?: number
  profileComplete: number // 0-100
  referralCode?: string
  joinedDate: string
  route?: string
  routeStrength?: string
}

/** Anchor — an organization offering Paths */
export interface Anchor {
  id: string
  name: string
  country: string
  openPaths: number
  totalChapters: number
  verified: boolean
  logoUrl?: string
}

/** Path — what Anchors post for Pioneers to discover */
export interface Path {
  id: string
  title: string
  anchorName: string
  description?: string
  location: string
  category: string
  isRemote: boolean
  pathType: PathType
  salaryMin?: number
  salaryMax?: number
  salary?: string // formatted display string
  currency: string
  skills: string[]
  tags?: string[]
  country: string
  status: PathStatus
  tier: PathTier
  icon?: string
  isFeatured: boolean
  pioneersNeeded?: number
  posted: string
  expiresAt?: string
  createdAt: string
  // Matching engine fields
  requiredSkills: string[]
  preferredCountries: string[]
  experienceYears?: number
  pioneerTypes: PioneerType[]
}

/** PathListItem — lightweight Path for list views */
export interface PathListItem {
  id: string
  title: string
  anchorName: string
  location: string
  /** ISO country code (KE, DE, CH, GB, etc.) — for identity-driven filtering */
  country?: string
  category: FilterCategory
  salary: string
  posted: string
  icon: string
  tags: string[]
  isRemote: boolean
  isFeatured: boolean
  pioneersNeeded?: number
}

/** Chapter — Pioneer engaging with a Path */
export interface Chapter {
  id: string
  pioneerId: string
  pathId: string
  pathTitle: string
  anchorName: string
  coverLetter?: string
  status: ChapterStatus
  matchScore: number
  openedAt: string
}

/** Payment — financial transaction */
export interface Payment {
  id: string
  userId: string
  amount: number
  currency: string
  method: PaymentMethod
  status: PaymentStatus
  mpesaReceiptNumber?: string
  checkoutRequestId?: string
  stripePaymentId?: string
  createdAt: string
}

// ─── Matching Types ──────────────────────────────────────────────────────────

export interface MatchResult {
  pathId: string
  score: number
  reasons: string[]
  gaps: string[]
  isDirectRoute: boolean
  routeStrength: 'direct' | 'partner' | 'emerging'
  recommendationLabel: 'Perfect Match' | 'Strong Match' | 'Good Match' | 'Possible Match'
}

// ─── Admin Types ─────────────────────────────────────────────────────────────

export interface PlatformStats {
  pioneers: number
  anchors: number
  openPaths: number
  chapters: number
  venturesBooked: number
  revenueKES: number
  mpesaPending: number
}

export interface AdminPioneer {
  id: string
  name: string
  type: string
  from: string
  to: string
  skills: number
  chapters: number
  joined: string
  status: 'Active' | 'Incomplete'
}

export interface AdminPath {
  id: string
  title: string
  anchor: string
  type: string
  chapters: number
  matchAvg: number
  status: 'Open' | 'Closed' | 'Paused'
  posted: string
}

export interface AdminChapter {
  pioneer: string
  path: string
  anchor: string
  score: number
  status: string
}

// ─── Pricing Types ───────────────────────────────────────────────────────────

export interface PricingPlan {
  name: string
  price: number
  currency: string
  usd: number
  icon: string
  color: string
  description: string
  features: string[]
  cta: string
  popular: boolean
}

export interface PaymentMethodInfo {
  name: string
  flag: string
  desc: string
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export interface PathFilters {
  category?: FilterCategory
  country?: string
  isRemote?: boolean
  pioneerType?: PioneerType
  search?: string
  page?: number
  limit?: number
}

export interface PioneerFilters {
  type?: PioneerType
  status?: 'Active' | 'Incomplete'
  country?: string
  page?: number
  limit?: number
}
