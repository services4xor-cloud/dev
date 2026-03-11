/**
 * Identity Flags — Pioneer identity captured during onboarding
 *
 * Stored in localStorage until DB is connected. Read by Compass,
 * Ventures, and Dashboard to personalize the experience.
 *
 * Flow: Onboarding → save flags → Compass reads ?from=X from flags
 *       → Ventures reads ?type=Y from flags → Dashboard shows profile
 *
 * When DB is live, replace localStorage with API calls.
 */

import type { PioneerType } from '@/lib/vocabulary'

// ─── Shape ───────────────────────────────────────────────────────────────────

export interface IdentityFlags {
  /** Pioneer type (explorer, professional, artisan, etc.) */
  pioneerType: PioneerType
  /** ISO country code where Pioneer is now */
  fromCountry: string
  /** ISO country codes for desired destinations */
  toCountries: string[]
  /** Skills array (used for match scoring) */
  skills: string[]
  /** One-line headline */
  headline: string
  /** Bio (optional) */
  bio: string
  /** WhatsApp phone (optional) */
  phone: string
  /** Timestamp when flags were last updated */
  updatedAt: string
}

const STORAGE_KEY = 'benetwork_identity_flags'

// ─── Write ───────────────────────────────────────────────────────────────────

/** Save identity flags after onboarding (or profile update) */
export function saveIdentityFlags(flags: Omit<IdentityFlags, 'updatedAt'>): void {
  if (typeof window === 'undefined') return
  const data: IdentityFlags = { ...flags, updatedAt: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

// ─── Read ────────────────────────────────────────────────────────────────────

/** Load identity flags. Returns null if onboarding not completed. */
export function loadIdentityFlags(): IdentityFlags | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as IdentityFlags
  } catch {
    return null
  }
}

/** Check if Pioneer has completed onboarding */
export function hasCompletedOnboarding(): boolean {
  return loadIdentityFlags() !== null
}

// ─── URL helpers ─────────────────────────────────────────────────────────────

/** Build Compass URL pre-filled from saved flags */
export function getCompassUrl(): string {
  const flags = loadIdentityFlags()
  if (!flags) return '/compass'
  return `/compass?from=${flags.fromCountry}`
}

/** Build Ventures URL pre-filtered from saved flags */
export function getVenturesUrl(): string {
  const flags = loadIdentityFlags()
  if (!flags) return '/ventures'
  const params = new URLSearchParams()
  if (flags.fromCountry) params.set('from', flags.fromCountry)
  if (flags.toCountries.length > 0) params.set('to', flags.toCountries.join(','))
  if (flags.pioneerType) params.set('type', flags.pioneerType)
  return `/ventures?${params.toString()}`
}

// ─── Clear ───────────────────────────────────────────────────────────────────

/** Clear identity flags (logout / reset) */
export function clearIdentityFlags(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(STORAGE_KEY)
}
