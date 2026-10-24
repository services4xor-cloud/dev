import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getCountryInsights } from '@/lib/country-insights'

interface RouteContext {
  params: Promise<{ code: string }>
}

/**
 * GET /api/country/[code]/insights — live public facts about a country plus Be[X]'s
 * own numbers for it (published offerings, Explorers located there). Public, read-only.
 */
export async function GET(_req: NextRequest, context: RouteContext) {
  const { code: raw } = await context.params
  const code = raw.toUpperCase()
  if (!/^[A-Z]{2}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid country code' }, { status: 400 })
  }

  const [insights, offerings, explorers] = await Promise.all([
    getCountryInsights(code),
    db.node
      .count({
        where: {
          type: 'EXPERIENCE',
          active: true,
          AND: [
            { properties: { path: ['countryCode'], equals: code } },
            { properties: { path: ['status'], equals: 'PUBLISHED' } },
          ],
        },
      })
      .catch(() => 0),
    db.edge
      .count({
        where: {
          relation: 'LOCATED_IN',
          from: { type: 'USER' },
          to: { type: 'COUNTRY', code },
        },
      })
      .catch(() => 0),
  ])
  if (!insights) return NextResponse.json({ error: 'Country not found' }, { status: 404 })

  return NextResponse.json(
    { ...insights, bex: { offerings, explorers } },
    { headers: { 'Cache-Control': 'public, s-maxage=600, stale-while-revalidate=86400' } }
  )
}
