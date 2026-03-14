import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createEdge } from '@/lib/graph'

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

  // Create edges for each dimension
  const results = { languages: 0, faith: 0, crafts: 0, interests: 0, locations: 0 }

  try {
    for (const lang of languages) {
      const edge = await createEdge('USER', userCode, 'LANGUAGE', lang, 'SPEAKS')
      if (edge) results.languages++
    }

    for (const f of faith) {
      const edge = await createEdge('USER', userCode, 'FAITH', f, 'PRACTICES')
      if (edge) results.faith++
    }

    for (const craft of crafts) {
      const edge = await createEdge('USER', userCode, 'SKILL', craft, 'HAS_SKILL')
      if (edge) results.crafts++
    }

    for (const interest of interests) {
      const code = interest.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      const edge = await createEdge('USER', userCode, 'SECTOR', code, 'INTERESTED_IN')
      if (edge) results.interests++
    }

    for (const location of locations) {
      const edge = await createEdge('USER', userCode, 'COUNTRY', location, 'LOCATED_IN')
      if (edge) results.locations++
    }

    return NextResponse.json({ success: true, created: results })
  } catch {
    return NextResponse.json({ error: 'Failed to save dimensions' }, { status: 500 })
  }
}
