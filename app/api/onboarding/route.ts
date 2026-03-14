import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createEdge } from '@/lib/graph'
import type { OnboardingRequest } from '@/types/api'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: OnboardingRequest = await req.json()

  // Get user's node code (email)
  const userCode = session?.user?.email ?? userId

  // Create edges for each dimension
  const results = {
    languages: 0,
    faith: 0,
    crafts: 0,
    interests: 0,
    locations: 0,
  }

  for (const lang of body.languages ?? []) {
    const edge = await createEdge('USER', userCode, 'LANGUAGE', lang, 'SPEAKS')
    if (edge) results.languages++
  }

  for (const faith of body.faith ?? []) {
    const edge = await createEdge('USER', userCode, 'FAITH', faith, 'PRACTICES')
    if (edge) results.faith++
  }

  for (const craft of body.crafts ?? []) {
    const edge = await createEdge('USER', userCode, 'SKILL', craft, 'HAS_SKILL')
    if (edge) results.crafts++
  }

  for (const interest of body.interests ?? []) {
    const code = interest.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    const edge = await createEdge('USER', userCode, 'SECTOR', code, 'INTERESTED_IN')
    if (edge) results.interests++
  }

  for (const location of body.locations ?? []) {
    const edge = await createEdge('USER', userCode, 'COUNTRY', location, 'LOCATED_IN')
    if (edge) results.locations++
  }

  return NextResponse.json({ success: true, created: results })
}
