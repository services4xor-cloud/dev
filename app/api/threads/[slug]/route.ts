import { NextRequest, NextResponse } from 'next/server'
import { threadService } from '@/services'
import { logger } from '@/lib/logger'

/**
 * GET /api/threads/[slug] — Get a single thread by slug
 *
 * Returns thread details including children (for country → tribe hierarchy).
 */
export async function GET(_req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const thread = await threadService.getBySlug(params.slug)

    if (!thread) {
      return NextResponse.json({ success: false, error: 'Thread not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, thread })
  } catch (err) {
    logger.error('GET /api/threads/[slug] failed', { slug: params.slug, error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to fetch thread' }, { status: 500 })
  }
}
