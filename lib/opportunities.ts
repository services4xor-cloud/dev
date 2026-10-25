/**
 * Opportunities (products on the map) — single source of truth.
 *
 * An Opportunity is an EXPERIENCE node. Its details live in `properties`,
 * its map position in the node's lat/lng columns. Hosts create them; the
 * ones from non-admin Hosts start IN_REVIEW and appear on the map only after
 * an Admin publishes them. `accessUrl` (e.g. the 4xor Studio login for a
 * booked service) is private: only the Host, Admins and Explorers whose
 * Exchange was accepted ever see it. `contactEmail` is private too unless the
 * Host sets `contactPublic`; contact messages are relayed by email.
 */
import type { Node } from '@prisma/client'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'

export const OPPORTUNITY_KINDS = ['JOURNEY', 'SERVICE', 'AUTOMATION', 'EXPERIENCE'] as const
export type OpportunityKind = (typeof OPPORTUNITY_KINDS)[number]

export const OPPORTUNITY_STATUSES = ['IN_REVIEW', 'PUBLISHED', 'ARCHIVED'] as const
export type OpportunityStatus = (typeof OPPORTUNITY_STATUSES)[number]

export const PRICE_UNITS = ['PERSON', 'MONTH', 'ONCE'] as const
export type PriceUnit = (typeof PRICE_UNITS)[number]

export const KIND_LABELS: Record<OpportunityKind, string> = {
  JOURNEY: 'Journey',
  SERVICE: 'Service',
  AUTOMATION: 'Automation',
  EXPERIENCE: 'Experience',
}

export const KIND_ICONS: Record<OpportunityKind, string> = {
  JOURNEY: '🧭',
  SERVICE: '🛠️',
  AUTOMATION: '⚙️',
  EXPERIENCE: '💼',
}

export const PRICE_UNIT_LABELS: Record<PriceUnit, string> = {
  PERSON: 'per person',
  MONTH: 'per month',
  ONCE: 'one-off',
}

export interface OpportunityProps {
  description?: string
  location?: string
  sector?: string
  kind?: OpportunityKind
  status?: OpportunityStatus
  countryCode?: string
  price?: number
  currency?: string
  priceUnit?: PriceUnit
  startsOn?: string
  endsOn?: string
  capacity?: number
  /** Public demo/info link shown to everyone */
  demoUrl?: string
  /** Private access link revealed after an accepted Exchange */
  accessUrl?: string
  /** Where contact messages go. Private unless `contactPublic` is set. */
  contactEmail?: string
  /** Show contactEmail on the map (business addresses); off by default */
  contactPublic?: boolean
}

/** Public shape returned by the API and used by the map. */
export interface OpportunityDTO {
  id: string
  /** Stable slug, e.g. for anchors on 4xor.com */
  code: string
  label: string
  icon: string
  lat: number | null
  lng: number | null
  properties: Omit<OpportunityProps, 'accessUrl'> & {
    kind: OpportunityKind
    status: OpportunityStatus
  }
  host: { label: string; icon: string; userId?: string | null } | null
  accessUrl?: string
  contactEmail?: string
}

const LIMITS = { title: 120, description: 2000, location: 120, sector: 80, icon: 10, url: 500 }

/** Legacy EXPERIENCE nodes have no status/kind: treat as published experiences. */
export function readProps(node: Pick<Node, 'properties'>): OpportunityProps & {
  kind: OpportunityKind
  status: OpportunityStatus
} {
  const p = (node.properties as OpportunityProps | null) ?? {}
  return {
    ...p,
    kind: OPPORTUNITY_KINDS.includes(p.kind as OpportunityKind)
      ? (p.kind as OpportunityKind)
      : 'EXPERIENCE',
    status: OPPORTUNITY_STATUSES.includes(p.status as OpportunityStatus)
      ? (p.status as OpportunityStatus)
      : 'PUBLISHED',
  }
}

export function toDTO(
  node: Pick<Node, 'id' | 'code' | 'label' | 'icon' | 'lat' | 'lng' | 'properties'>,
  host: { label: string; icon: string | null; userId?: string | null } | null,
  opts: { includeAccess?: boolean } = {}
): OpportunityDTO {
  const { accessUrl, contactEmail, ...props } = readProps(node)
  return {
    id: node.id,
    code: node.code,
    label: node.label,
    icon: node.icon ?? KIND_ICONS[props.kind],
    lat: node.lat,
    lng: node.lng,
    properties: props,
    host: host ? { label: host.label, icon: host.icon ?? '🏢', userId: host.userId } : null,
    ...(opts.includeAccess && accessUrl ? { accessUrl } : {}),
    ...((opts.includeAccess || props.contactPublic) && contactEmail ? { contactEmail } : {}),
  }
}

function str(v: unknown, max: number): string | undefined {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined
}

function httpsUrl(v: unknown): string | undefined | null {
  const s = str(v, LIMITS.url)
  if (!s) return undefined
  try {
    const u = new URL(s)
    return u.protocol === 'https:' ? u.toString() : null
  } catch {
    return null
  }
}

function isoDate(v: unknown): string | undefined | null {
  const s = str(v, 10)
  if (!s) return undefined
  return /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s)) ? s : null
}

export interface ParsedOpportunity {
  label?: string
  icon?: string
  lat?: number | null
  lng?: number | null
  props: Partial<OpportunityProps>
}

/**
 * Validate a create/update body. With `partial`, missing fields are left
 * untouched; otherwise title, description, kind and country are required.
 */
export function parseOpportunityInput(
  body: Record<string, unknown>,
  { partial = false }: { partial?: boolean } = {}
): { data: ParsedOpportunity; error?: undefined } | { data?: undefined; error: string } {
  const out: ParsedOpportunity = { props: {} }

  const title = str(body.title, LIMITS.title)
  if (title) out.label = title
  else if (!partial) return { error: 'title is required' }

  const description = str(body.description, LIMITS.description)
  if (description) out.props.description = description
  else if (!partial) return { error: 'description is required' }

  if (body.kind !== undefined || !partial) {
    if (!OPPORTUNITY_KINDS.includes(body.kind as OpportunityKind)) {
      return { error: `kind must be one of ${OPPORTUNITY_KINDS.join(', ')}` }
    }
    out.props.kind = body.kind as OpportunityKind
  }

  if (body.countryCode !== undefined || !partial) {
    const code = typeof body.countryCode === 'string' ? body.countryCode.toUpperCase() : ''
    const country = COUNTRY_OPTIONS.find((c) => c.code === code)
    if (!country) return { error: 'countryCode must be a known country' }
    out.props.countryCode = country.code
    // Default the map position to the country's capital unless coordinates are given
    if (body.lat === undefined && body.lng === undefined) {
      out.lat = country.lat
      out.lng = country.lng
    }
  }

  if (body.lat !== undefined || body.lng !== undefined) {
    const lat = Number(body.lat)
    const lng = Number(body.lng)
    if (!isFinite(lat) || !isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      return { error: 'lat/lng must be valid coordinates' }
    }
    out.lat = lat
    out.lng = lng
  }

  const location = str(body.location, LIMITS.location)
  if (location) out.props.location = location
  const sector = str(body.sector, LIMITS.sector)
  if (sector) out.props.sector = sector
  const icon = str(body.icon, LIMITS.icon)
  if (icon) out.icon = icon

  if (body.price !== undefined && body.price !== null && body.price !== '') {
    const price = Number(body.price)
    if (!isFinite(price) || price < 0 || price > 1_000_000) {
      return { error: 'price must be a number between 0 and 1,000,000' }
    }
    out.props.price = Math.round(price * 100) / 100
    const currency = typeof body.currency === 'string' ? body.currency.toUpperCase() : 'EUR'
    if (!/^[A-Z]{3}$/.test(currency)) return { error: 'currency must be a 3-letter code' }
    out.props.currency = currency
    const unit = (body.priceUnit as PriceUnit) ?? 'ONCE'
    if (!PRICE_UNITS.includes(unit)) return { error: 'priceUnit must be PERSON, MONTH or ONCE' }
    out.props.priceUnit = unit
  }

  if (body.capacity !== undefined && body.capacity !== null && body.capacity !== '') {
    const capacity = Number(body.capacity)
    if (!Number.isInteger(capacity) || capacity < 1 || capacity > 10_000) {
      return { error: 'capacity must be a whole number from 1 to 10,000' }
    }
    out.props.capacity = capacity
  }

  for (const key of ['startsOn', 'endsOn'] as const) {
    const d = isoDate(body[key])
    if (d === null) return { error: `${key} must be a date (YYYY-MM-DD)` }
    if (d) out.props[key] = d
  }

  for (const key of ['demoUrl', 'accessUrl'] as const) {
    const u = httpsUrl(body[key])
    if (u === null) return { error: `${key} must be an https:// link` }
    if (u) out.props[key] = u
  }

  if (body.contactEmail !== undefined && body.contactEmail !== null && body.contactEmail !== '') {
    const email =
      typeof body.contactEmail === 'string' ? body.contactEmail.trim().toLowerCase() : ''
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { error: 'contactEmail must be a valid email' }
    }
    out.props.contactEmail = email
  }

  if (typeof body.contactPublic === 'boolean') out.props.contactPublic = body.contactPublic

  return { data: out }
}

export function formatPrice(
  p: Pick<OpportunityProps, 'price' | 'currency' | 'priceUnit'>
): string | null {
  if (p.price === undefined) return null
  if (p.price === 0) return 'Free'
  const amount = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: p.currency ?? 'EUR',
    maximumFractionDigits: p.price % 1 === 0 ? 0 : 2,
  }).format(p.price)
  return p.priceUnit && p.priceUnit !== 'ONCE'
    ? `${amount} ${PRICE_UNIT_LABELS[p.priceUnit]}`
    : amount
}

/** Hosts this app serves as the 4XOR company page (default of COMPANY_HOSTS in middleware.ts) */
const COMPANY_PAGE_HOSTS = ['4xor.com', 'www.4xor.com']

/**
 * Where a listing's project link goes. Links to 4xor.com stay inside the app on
 * its /4xor page, so a visitor reaches 4xor Studio from there and can come back
 * to the map; any other link opens in a new tab.
 */
export function projectLink(demoUrl: string): { href: string; internal: boolean } {
  try {
    const url = new URL(demoUrl)
    if (COMPANY_PAGE_HOSTS.includes(url.hostname)) {
      return { href: `/4xor${url.hash}`, internal: true }
    }
  } catch {
    // Not an absolute URL: treat as external text, as before
  }
  return { href: demoUrl, internal: false }
}
