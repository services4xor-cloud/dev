import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createEdgesBatch } from '@/lib/graph'

const MAX_ITEMS_PER_DIMENSION = 20

function capArray(arr: unknown): string[] {
  if (!Array.isArray(arr)) return []
  return arr.slice(0, MAX_ITEMS_PER_DIMENSION).filter((v): v is string => typeof v === 'string')
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // Get user's node code (email)
  const userCode = session?.user?.email ?? userId

  const languages = capArray(body.languages)
  const faith = capArray(body.faith)
  const crafts = capArray(body.crafts)
  const interests = capArray(body.interests)
  const locations = capArray(body.locations)

  // Batch per dimension — avoids N+1 sequential DB calls while preserving per-dimension counts
  try {
    const [langCount, faithCount, craftCount, interestCount, locationCount] = await Promise.all([
      createEdgesBatch(
        'USER',
        userCode,
        languages.map((l) => ({
          toType: 'LANGUAGE' as const,
          toCode: l,
          relation: 'SPEAKS' as const,
        }))
      ),
      createEdgesBatch(
        'USER',
        userCode,
        faith.map((f) => ({ toType: 'FAITH' as const, toCode: f, relation: 'PRACTICES' as const }))
      ),
      createEdgesBatch(
        'USER',
        userCode,
        crafts.map((c) => ({ toType: 'SKILL' as const, toCode: c, relation: 'HAS_SKILL' as const }))
      ),
      createEdgesBatch(
        'USER',
        userCode,
        interests.map((i) => ({
          toType: 'SECTOR' as const,
          toCode: i.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          relation: 'INTERESTED_IN' as const,
        }))
      ),
      createEdgesBatch(
        'USER',
        userCode,
        locations.map((l) => ({
          toType: 'COUNTRY' as const,
          toCode: l,
          relation: 'LOCATED_IN' as const,
        }))
      ),
    ])

    return NextResponse.json({
      success: true,
      created: {
        languages: langCount,
        faith: faithCount,
        crafts: craftCount,
        interests: interestCount,
        locations: locationCount,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to save dimensions' }, { status: 500 })
  }
}
