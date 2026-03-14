import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// Always dynamic — reads from DB at request time
export const dynamic = 'force-dynamic'

/**
 * GET /api/discovery/options
 * Returns all active COUNTRY, LANGUAGE, and SECTOR nodes for Discovery wizard dropdowns.
 */
export async function GET() {
  const [countries, languages, sectors] = await Promise.all([
    db.node.findMany({
      where: { type: 'COUNTRY', active: true },
      select: { code: true, label: true, icon: true },
      orderBy: { label: 'asc' },
    }),
    db.node.findMany({
      where: { type: 'LANGUAGE', active: true },
      select: { code: true, label: true, icon: true },
      orderBy: { label: 'asc' },
    }),
    db.node.findMany({
      where: { type: 'SECTOR', active: true },
      select: { code: true, label: true, icon: true },
      orderBy: { label: 'asc' },
    }),
  ])

  return NextResponse.json({
    countries: countries.map((c) => ({ code: c.code, label: c.label, icon: c.icon ?? '🌍' })),
    languages: languages.map((l) => ({ code: l.code, label: l.label, icon: l.icon ?? '💬' })),
    sectors: sectors.map((s) => ({ code: s.code, label: s.label, icon: s.icon ?? '⚙️' })),
  })
}
