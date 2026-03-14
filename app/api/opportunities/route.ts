import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { getUserNode } from '@/lib/graph'

// ─── GET /api/opportunities ───────────────────────────────────
// Returns all active EXPERIENCE nodes with OFFERS edges (who's offering)

export async function GET() {
  const experiences = await db.node.findMany({
    where: { type: 'EXPERIENCE', active: true },
    include: {
      inEdges: {
        where: { relation: 'OFFERS' },
        include: { from: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  const result = experiences.map((node) => {
    const hostEdge = node.inEdges[0] ?? null
    return {
      id: node.id,
      label: node.label,
      icon: node.icon ?? '💼',
      properties: node.properties,
      host: hostEdge ? { label: hostEdge.from.label, icon: hostEdge.from.icon ?? '🏢' } : null,
    }
  })

  return NextResponse.json(result)
}

// ─── POST /api/opportunities ──────────────────────────────────
// Create a new EXPERIENCE node + OFFERS edge. Requires HOST or ADMIN role.

const MAX_TITLE = 120
const MAX_DESC = 1000
const MAX_LOCATION = 120
const MAX_SECTOR = 80
const MAX_ICON = 10

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80)
}

export async function POST(req: NextRequest) {
  // Auth check
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const role = (session.user as { role?: string }).role
  if (role !== 'HOST' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: HOST or ADMIN role required' }, { status: 403 })
  }

  // Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, description, location, sector, icon } = body as {
    title?: unknown
    description?: unknown
    location?: unknown
    sector?: unknown
    icon?: unknown
  }

  // Validate required fields
  if (typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 })
  }
  if (typeof description !== 'string' || !description.trim()) {
    return NextResponse.json({ error: 'description is required' }, { status: 400 })
  }
  if (typeof location !== 'string' || !location.trim()) {
    return NextResponse.json({ error: 'location is required' }, { status: 400 })
  }
  if (typeof sector !== 'string' || !sector.trim()) {
    return NextResponse.json({ error: 'sector is required' }, { status: 400 })
  }

  const safeTitle = title.trim().slice(0, MAX_TITLE)
  const safeDesc = description.trim().slice(0, MAX_DESC)
  const safeLocation = location.trim().slice(0, MAX_LOCATION)
  const safeSector = sector.trim().slice(0, MAX_SECTOR)
  const safeIcon = typeof icon === 'string' && icon.trim() ? icon.trim().slice(0, MAX_ICON) : '💼'

  // Generate a unique code from the slugified title
  const baseCode = slugify(safeTitle) || 'experience'
  const suffix = Date.now().toString(36)
  const code = `${baseCode}-${suffix}`

  // Get the user's Node
  const userId = (session.user as { id?: string }).id
  if (!userId) {
    return NextResponse.json({ error: 'User ID not found in session' }, { status: 401 })
  }

  const userNode = await getUserNode(userId)
  if (!userNode) {
    return NextResponse.json(
      { error: 'User node not found. Please complete your profile.' },
      { status: 400 }
    )
  }

  // Create the EXPERIENCE node
  const experienceNode = await db.node.create({
    data: {
      type: 'EXPERIENCE',
      code,
      label: safeTitle,
      icon: safeIcon,
      properties: {
        description: safeDesc,
        location: safeLocation,
        sector: safeSector,
      },
    },
  })

  // Create OFFERS edge from user's node to the experience node
  await db.edge.create({
    data: {
      fromId: userNode.id,
      toId: experienceNode.id,
      relation: 'OFFERS',
    },
  })

  return NextResponse.json(
    {
      id: experienceNode.id,
      label: experienceNode.label,
      icon: experienceNode.icon,
      properties: experienceNode.properties,
      host: { label: userNode.label, icon: userNode.icon ?? '🏢' },
    },
    { status: 201 }
  )
}
