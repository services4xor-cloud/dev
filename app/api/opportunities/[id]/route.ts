import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import type { Prisma } from '@prisma/client'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { notify } from '@/lib/notifications'
import {
  OPPORTUNITY_STATUSES,
  parseOpportunityInput,
  readProps,
  toDTO,
  type OpportunityStatus,
} from '@/lib/opportunities'

async function loadForEdit(id: string) {
  return db.node.findUnique({
    where: { id },
    include: {
      inEdges: {
        where: { relation: 'OFFERS' },
        include: { from: { select: { label: true, icon: true, userId: true } } },
        take: 1,
      },
    },
  })
}

// GET /api/opportunities/[id] — one listing. Published ones are public; the
// Host and Admins also see unpublished ones and the private access link.
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const node = await loadForEdit(params.id)
  if (!node || node.type !== 'EXPERIENCE') {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  }
  const host = node.inEdges[0]?.from ?? null
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  const role = (session?.user as { role?: string } | undefined)?.role
  const canEdit = !!userId && (host?.userId === userId || role === 'ADMIN')
  if (!canEdit && readProps(node).status !== 'PUBLISHED') {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  }
  return NextResponse.json({ ...toDTO(node, host, { includeAccess: canEdit }), canEdit })
}

// PATCH /api/opportunities/[id] — the Host edits their listing; Admins can
// edit any listing and change its status (publish / archive).
// Hosts may only archive their own listing, never publish it.
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string } | undefined)?.id
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const node = await loadForEdit(params.id)
  if (!node || node.type !== 'EXPERIENCE') {
    return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
  }
  const host = node.inEdges[0]?.from ?? null
  const isAdmin = role === 'ADMIN'
  if (host?.userId !== userId && !isAdmin) {
    return NextResponse.json({ error: 'Not your opportunity' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = (await req.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = parseOpportunityInput(body, { partial: true })
  if (parsed.error) return NextResponse.json({ error: parsed.error }, { status: 400 })
  const { label, icon, lat, lng, props } = parsed.data!

  const current = readProps(node)
  let status: OpportunityStatus = current.status
  if (body.status !== undefined) {
    const wanted = body.status as OpportunityStatus
    if (!OPPORTUNITY_STATUSES.includes(wanted)) {
      return NextResponse.json({ error: 'Unknown status' }, { status: 400 })
    }
    if (!isAdmin && wanted !== 'ARCHIVED') {
      return NextResponse.json({ error: 'Only an Admin can publish' }, { status: 403 })
    }
    status = wanted
  } else if (!isAdmin && current.status === 'PUBLISHED') {
    // A Host's edit to a live listing goes back to review
    status = 'IN_REVIEW'
  }

  // Empty strings clear optional fields
  const cleared: Record<string, undefined> = {}
  for (const key of [
    'price',
    'capacity',
    'startsOn',
    'endsOn',
    'demoUrl',
    'accessUrl',
    'contactEmail',
  ] as const) {
    if (body[key] === '' || body[key] === null) cleared[key] = undefined
  }
  if (cleared.price !== undefined || 'price' in cleared) {
    cleared.currency = undefined
    cleared.priceUnit = undefined
  }

  const updated = await db.node.update({
    where: { id: node.id },
    data: {
      ...(label ? { label } : {}),
      ...(icon ? { icon } : {}),
      ...(lat !== undefined ? { lat, lng } : {}),
      active: status !== 'ARCHIVED',
      properties: JSON.parse(
        JSON.stringify({ ...current, ...cleared, ...props, status })
      ) as Prisma.InputJsonValue,
    },
  })

  if (isAdmin && status !== current.status && host?.userId && host.userId !== userId) {
    notify({
      userId: host.userId,
      type: 'SYSTEM',
      title:
        status === 'PUBLISHED'
          ? `${updated.label} is now live on the map`
          : `${updated.label} was ${status === 'ARCHIVED' ? 'archived' : 'sent back to review'}`,
      link: '/host',
    }).catch(() => {})
  }

  return NextResponse.json(toDTO(updated, host, { includeAccess: true }))
}
