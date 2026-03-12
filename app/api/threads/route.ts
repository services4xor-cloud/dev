import { NextRequest, NextResponse } from 'next/server'
import { threadService } from '@/services'
import { logger } from '@/lib/logger'

/**
 * GET /api/threads — List identity threads
 *
 * Query params:
 *   type    — COUNTRY, TRIBE, LANGUAGE, INTEREST, SCIENCE, LOCATION
 *   country — ISO2 code (e.g. KE) to filter threads relevant to a country
 *   parent  — parent thread slug to get children (e.g. "ke" to get Kenyan tribes)
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const type = searchParams.get('type') || undefined
  const country = searchParams.get('country') || undefined
  const parentSlug = searchParams.get('parent') || undefined

  try {
    const threads = await threadService.list({
      type,
      country,
      parentSlug,
      active: true,
    })

    return NextResponse.json({
      success: true,
      threads,
      total: threads.length,
    })
  } catch (err) {
    logger.error('GET /api/threads failed', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to fetch threads' }, { status: 500 })
  }
}

export const dynamic = 'force-dynamic'
