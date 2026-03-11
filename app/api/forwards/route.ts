/**
 * Forward API — Agent forwarding system
 *
 * POST /api/forwards — Create a new forward (agent sends path to worker)
 * GET  /api/forwards?agentId=xxx — List forwards for an agent with status counts
 *
 * Forward lifecycle: SENT → CLICKED → SIGNED_UP → APPLIED → PLACED
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// ─── Types ────────────────────────────────────────────────────────────────────

type ForwardStatus = 'SENT' | 'CLICKED' | 'SIGNED_UP' | 'APPLIED' | 'PLACED' | 'EXPIRED'
type ForwardChannel = 'WHATSAPP' | 'SMS' | 'EMAIL' | 'IN_PERSON' | 'SOCIAL_MEDIA'

interface Forward {
  id: string
  agentId: string
  pathId: string
  workerName: string | null
  workerPhone: string | null
  workerEmail: string | null
  channel: ForwardChannel
  trackingCode: string
  status: ForwardStatus
  clickedAt: string | null
  signedUpAt: string | null
  placedAt: string | null
  commission: number | null
  createdAt: string
}

// ─── Tracking code generator ──────────────────────────────────────────────────

function generateTrackingCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < 12; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

// ─── In-memory store (mock — replaced by Prisma when DB is connected) ─────────

const forwards: Forward[] = [
  {
    id: 'f1',
    agentId: 'agent-dk-001',
    pathId: 'd1',
    workerName: 'Jane Kamau',
    workerPhone: '+254712345678',
    workerEmail: null,
    channel: 'WHATSAPP',
    trackingCode: 'trk_JK2024A1B2',
    status: 'PLACED',
    clickedAt: '2026-02-16T10:00:00Z',
    signedUpAt: '2026-02-17T14:00:00Z',
    placedAt: '2026-03-01T09:00:00Z',
    commission: 15000,
    createdAt: '2026-02-15T08:00:00Z',
  },
  {
    id: 'f2',
    agentId: 'agent-dk-001',
    pathId: 'd2',
    workerName: 'Mike Odhiambo',
    workerPhone: '+254723456789',
    workerEmail: null,
    channel: 'WHATSAPP',
    trackingCode: 'trk_MO2024C3D4',
    status: 'APPLIED',
    clickedAt: '2026-03-02T08:00:00Z',
    signedUpAt: '2026-03-02T12:00:00Z',
    placedAt: null,
    commission: null,
    createdAt: '2026-03-01T10:00:00Z',
  },
]

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const createForwardSchema = z.object({
  agentId: z.string().min(1, 'agentId is required').max(200),
  pathId: z.string().min(1, 'pathId is required').max(200),
  workerName: z.string().max(200).optional(),
  workerPhone: z.string().max(20).optional(),
  workerEmail: z.string().email().max(320).optional(),
  channel: z.enum(['WHATSAPP', 'SMS', 'EMAIL', 'IN_PERSON', 'SOCIAL_MEDIA']).default('WHATSAPP'),
})

// ─── POST /api/forwards ───────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Auth check — agents must be logged in
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = createForwardSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 }
    )
  }

  try {
    const { agentId, pathId, workerName, workerPhone, workerEmail, channel } = parsed.data

    // Generate unique tracking code
    const trackingCode = `trk_${generateTrackingCode()}`

    // Create forward record
    const forward: Forward = {
      id: `f${Date.now()}`,
      agentId,
      pathId,
      workerName: workerName || null,
      workerPhone: workerPhone || null,
      workerEmail: workerEmail || null,
      channel: channel || 'WHATSAPP',
      trackingCode,
      status: 'SENT',
      clickedAt: null,
      signedUpAt: null,
      placedAt: null,
      commission: null,
      createdAt: new Date().toISOString(),
    }

    // Store (in-memory mock — Prisma create when DB connected)
    forwards.push(forward)

    // Build tracking link
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bekenya.com'
    const trackingLink = `${baseUrl}/ventures/${pathId}?ref=${trackingCode}`

    return NextResponse.json(
      {
        success: true,
        forward: {
          id: forward.id,
          trackingCode: forward.trackingCode,
          trackingLink,
          status: forward.status,
          createdAt: forward.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    console.error('POST /api/forwards error:', err)
    return NextResponse.json({ error: 'Failed to create forward' }, { status: 500 })
  }
}

// ─── GET /api/forwards?agentId=xxx ────────────────────────────────────────────

export async function GET(request: NextRequest) {
  // Auth check — agents must be logged in
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Login required' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agentId')

  if (!agentId) {
    return NextResponse.json({ error: 'agentId query parameter is required' }, { status: 400 })
  }

  // Filter forwards for this agent
  const agentForwards = forwards.filter((f) => f.agentId === agentId)

  // Compute status counts
  const statusCounts: Record<ForwardStatus, number> = {
    SENT: 0,
    CLICKED: 0,
    SIGNED_UP: 0,
    APPLIED: 0,
    PLACED: 0,
    EXPIRED: 0,
  }

  for (const f of agentForwards) {
    statusCounts[f.status]++
  }

  // Total commission earned
  const totalCommission = agentForwards.reduce((sum, f) => sum + (f.commission || 0), 0)

  return NextResponse.json({
    forwards: agentForwards,
    statusCounts,
    totalForwards: agentForwards.length,
    totalCommission,
  })
}
