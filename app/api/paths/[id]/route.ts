import { NextRequest, NextResponse } from 'next/server'
import { pathService } from '@/services'
import { logger } from '@/lib/logger'

// GET /api/paths/[id] — fetch a single path by ID
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const path = await pathService.getById(id)

    if (!path) {
      return NextResponse.json({ success: false, error: 'Path not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, path })
  } catch (err) {
    logger.error('GET /api/paths/[id] failed', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to fetch path' }, { status: 500 })
  }
}
