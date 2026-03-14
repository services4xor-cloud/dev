import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return new Response('Unauthorized', { status: 401 })
  const user = session.user as { id: string }

  const prefs = await db.notificationPreference.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {},
  })

  return NextResponse.json(prefs)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return new Response('Unauthorized', { status: 401 })
  const user = session.user as { id: string }

  const body = await req.json()
  const allowed = ['email', 'push', 'messages', 'matches', 'marketing']
  const data: Record<string, boolean> = {}
  for (const key of allowed) {
    if (typeof body[key] === 'boolean') data[key] = body[key]
  }

  const prefs = await db.notificationPreference.upsert({
    where: { userId: user.id },
    create: { userId: user.id, ...data },
    update: data,
  })

  return NextResponse.json(prefs)
}
