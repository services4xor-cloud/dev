import { NextRequest, NextResponse } from 'next/server'
import { COUNTRIES, CountryConfig, CountryCode } from '@/lib/countries'
import { COUNTRY_ROUTES, getRouteInfo } from '@/lib/compass'
import { MOCK_PATHS, rankPathsForPioneer, PioneerProfile } from '@/lib/matching'
import type { PioneerType } from '@/lib/vocabulary'

// ─── Helper: Detect country from request headers ──────────────────────────────

function detectCountryFromHeaders(req: NextRequest): { country: string; countryName: string } {
  // Cloudflare header (set by Vercel Edge / CF)
  const cfCountry = req.headers.get('cf-ipcountry')
  if (cfCountry && cfCountry !== 'XX' && cfCountry in COUNTRIES) {
    const code = cfCountry as CountryCode
    return { country: code, countryName: COUNTRIES[code].name }
  }

  // X-Vercel-IP-Country (Vercel native geolocation)
  const vercelCountry = req.headers.get('x-vercel-ip-country')
  if (vercelCountry && vercelCountry in COUNTRIES) {
    const code = vercelCountry as CountryCode
    return { country: code, countryName: COUNTRIES[code].name }
  }

  // Fallback: use deployment country (env) or Kenya
  const fallback = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE') as CountryCode
  const fallbackConfig = COUNTRIES[fallback]
  return { country: fallback, countryName: fallbackConfig?.name ?? 'Kenya' }
}

// ─── Helper: Generate warm vibe message ──────────────────────────────────────

function generateVibeMessage(
  from: string,
  to: string,
  type: string | null,
  routeStrength: string,
  topSectors: string[]
): string {
  const fromConfig = COUNTRIES[from as CountryCode]
  const toConfig = COUNTRIES[to as CountryCode]

  const fromName = fromConfig?.name || from
  const toName = toConfig?.name || to

  const sectorHighlight = topSectors.length > 0 ? topSectors[0] : 'your field'

  if (routeStrength === 'direct') {
    if (type === 'explorer') {
      return `The ${fromName}–${toName} route is one of our strongest. ${toName} has real demand for Pioneers with your ${sectorHighlight} background — and we have paths ready for you right now.`
    }
    if (type === 'healer') {
      return `${toName} is actively recruiting healthcare professionals from ${fromName}. This is a well-worn route with strong visa support and competitive salaries — your skills are genuinely needed.`
    }
    if (type === 'professional') {
      return `${fromName} to ${toName} is a thriving tech and finance corridor. Companies in ${toName} specifically look for talent from ${fromName} — your background opens real doors here.`
    }
    if (type === 'creator') {
      return `Creative Pioneers from ${fromName} are making waves in ${toName}. The demand for authentic storytelling and media talent from your region is growing fast.`
    }
    if (type === 'artisan') {
      return `${fromName} artisan talent is in high demand in ${toName}. Handmade, heritage craft and design skills from your region carry a premium that employers recognise.`
    }
    if (type === 'guardian') {
      return `${toName} values the discipline and experience that ${fromName} Guardians bring. Operations and security leadership from your background is well-regarded on this route.`
    }
    return `The ${fromName}–${toName} corridor is active and growing. We have strong matches in ${sectorHighlight} waiting for you.`
  }

  if (routeStrength === 'partner') {
    if (type === 'healer') {
      return `${toName} is expanding its healthcare intake from ${fromName}. The route is growing — early Pioneers on this path are securing great placements.`
    }
    if (type === 'professional') {
      return `${toName} tech companies are increasingly partnering with ${fromName} talent pipelines. This route is gaining momentum — a great time to make your move.`
    }
    return `The ${fromName}–${toName} route is growing. Partner Anchors on this corridor are actively looking for Pioneers like you. Your ${sectorHighlight} skills put you ahead of the pack.`
  }

  // emerging
  return `The ${fromName}–${toName} corridor is emerging — and early movers have an advantage. We are building direct Anchor relationships on this route. Your Compass reading gives you first visibility into what is opening up.`
}

// ─── GET /api/compass ─────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subPath = searchParams.get('detect')

  // ── Sub-route: GET /api/compass?detect=1 ────────────────────────────────────
  if (subPath !== null) {
    const detected = detectCountryFromHeaders(req)
    const code = detected.country as CountryCode
    const config: CountryConfig | null = COUNTRIES[code] ?? null

    return NextResponse.json({
      country: detected.country,
      countryName: detected.countryName,
      config,
    })
  }

  // ── Main route: GET /api/compass?from=KE&to=DE&type=explorer ────────────────
  const fromParam = searchParams.get('from')?.toUpperCase()
  const toParam = searchParams.get('to')?.toUpperCase()
  const typeParam = searchParams.get('type') as PioneerType | null

  if (!fromParam || !toParam) {
    return NextResponse.json({ error: 'Missing required params: from, to' }, { status: 400 })
  }

  const fromCode = fromParam as CountryCode
  const toCode = toParam as CountryCode

  const fromConfig = COUNTRIES[fromCode] ?? null
  const toConfig = COUNTRIES[toCode] ?? null

  // Route info from compass.ts
  const route = getRouteInfo(fromParam, toParam)

  // Build a pioneer profile for ranking (use sensible defaults when type is unknown)
  const pioneerProfile: PioneerProfile = {
    pioneerType: typeParam ?? 'professional',
    fromCountry: fromParam,
    toCountries: [toParam],
    skills: [],
    headline: '',
    yearsExperience: undefined,
  }

  // Rank all MOCK_PATHS for this pioneer — pick top 5 that match the to-country
  const allRanked = rankPathsForPioneer(pioneerProfile, MOCK_PATHS)
  const topPaths = allRanked.slice(0, 5).map((result) => ({
    ...result,
    path: MOCK_PATHS.find((p) => p.id === result.pathId),
  }))

  // Determine route strength for vibe message
  const routeStrength = route?.strength ?? 'emerging'
  const primarySectors = route?.primarySectors ?? []

  const vibeMessage = generateVibeMessage(
    fromParam,
    toParam,
    typeParam,
    routeStrength,
    primarySectors
  )

  return NextResponse.json({
    route: route
      ? {
          key: `${fromParam}-${toParam}`,
          ...route,
        }
      : null,
    fromConfig,
    toConfig,
    topPaths,
    vibeMessage,
  })
}

// ─── GET /api/compass/detect — standalone detect endpoint ─────────────────────
// This is handled above via ?detect param. Kept as alias comment for clarity.

export const dynamic = 'force-dynamic'
