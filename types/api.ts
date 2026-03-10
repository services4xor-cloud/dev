/**
 * API Request/Response Types — contracts for all API routes
 *
 * Each API route should use these types for type-safe request handling
 * and consistent response shapes.
 */

import type {
  Path,
  Chapter,
  PioneerProfile,
  Payment,
  PathFilters,
  PioneerFilters,
  PlatformStats,
} from './domain'
import type { PioneerType } from '@/lib/vocabulary'

// ─── Generic Response Wrappers ───────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  data?: T
  error?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}

// ─── Path API ────────────────────────────────────────────────────────────────

export interface CreatePathRequest {
  title: string
  description: string
  location: string
  category: string
  isRemote: boolean
  salaryMin?: number
  salaryMax?: number
  currency: string
  requiredSkills: string[]
  preferredCountries: string[]
  experienceYears?: number
  pioneerTypes: PioneerType[]
  tier: 'BASIC' | 'FEATURED' | 'PREMIUM'
}

export interface UpdatePathRequest {
  title?: string
  description?: string
  status?: 'ACTIVE' | 'PAUSED' | 'FILLED'
  tier?: 'BASIC' | 'FEATURED' | 'PREMIUM'
}

export type ListPathsResponse = PaginatedResponse<Path>

// ─── Onboarding API ──────────────────────────────────────────────────────────

export interface OnboardingRequest {
  pioneerType: PioneerType
  fromCountry: string
  toCountries: string[]
  skills: string[]
  headline: string
  bio?: string
  phone?: string
}

export type OnboardingResponse = ApiResponse<PioneerProfile>

// ─── Compass API ─────────────────────────────────────────────────────────────

export interface CompassRequest {
  fromCountry: string
  toCountries: string[]
  pioneerType: PioneerType
  skills: string[]
}

export interface CompassResponse {
  paths: Path[]
  scores: Record<string, number>
  vibeMessage: string
}

// ─── Chapter API ─────────────────────────────────────────────────────────────

export interface OpenChapterRequest {
  pathId: string
  pioneerId: string
  coverLetter?: string
}

export interface UpdateChapterRequest {
  status: 'REVIEWED' | 'SHORTLISTED' | 'REJECTED' | 'PLACED'
}

export type ListChaptersResponse = PaginatedResponse<Chapter>

// ─── Payment API ─────────────────────────────────────────────────────────────

export interface MpesaStkPushRequest {
  phone: string
  amount: number
  reference: string
}

export interface MpesaStkPushResponse {
  success: boolean
  checkoutRequestId?: string
  message?: string
  error?: string
}

export interface MpesaCallbackPayload {
  Body: {
    stkCallback: {
      MerchantRequestID: string
      CheckoutRequestID: string
      ResultCode: number
      ResultDesc: string
      CallbackMetadata?: {
        Item: Array<{ Name: string; Value?: string | number }>
      }
    }
  }
}

// ─── Search API ──────────────────────────────────────────────────────────────

export interface SearchRequest {
  query: string
  filters?: PathFilters
}

export interface SearchResponse {
  paths: Path[]
  total: number
  suggestions: string[]
}

// ─── Admin API ───────────────────────────────────────────────────────────────

export interface AdminDashboardResponse {
  stats: PlatformStats
  recentPioneers: PioneerProfile[]
  recentChapters: Chapter[]
}

// ─── Profile API ─────────────────────────────────────────────────────────────

export interface UpdateProfileRequest {
  headline?: string
  bio?: string
  phone?: string
  skills?: string[]
  toCountries?: string[]
}

export type ProfileResponse = ApiResponse<PioneerProfile>
