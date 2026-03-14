import { NextRequest, NextResponse } from 'next/server'
import { getNodeWithEdges } from '@/lib/graph'

interface RouteContext {
  params: Promise<{ code: string }>
}

export async function GET(_req: NextRequest, context: RouteContext) {
  const { code } = await context.params
  const upperCode = code.toUpperCase()

  const node = await getNodeWithEdges('COUNTRY', upperCode)
  if (!node) {
    return NextResponse.json(null, { status: 404 })
  }

  const languages = node.outEdges
    .filter((e) => e.relation === 'OFFICIAL_LANG')
    .map((e) => e.to.label)

  const currencies = node.outEdges
    .filter((e) => e.relation === 'COUNTRY_CURRENCY')
    .map((e) => e.to.label)

  const properties = node.properties as Record<string, unknown> | null

  return NextResponse.json({
    label: node.label,
    icon: node.icon,
    languages,
    currencies,
    region: properties?.region ?? null,
  })
}
