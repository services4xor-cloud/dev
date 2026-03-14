import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { notify } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const targetId = searchParams.get('targetId')

  if (!targetId) {
    return NextResponse.json({ error: 'targetId is required' }, { status: 400 })
  }

  const reviews = await db.review.findMany({
    where: { targetId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      rating: true,
      content: true,
      createdAt: true,
      nodeId: true,
      author: {
        select: { name: true, image: true },
      },
    },
  })

  const totalReviews = reviews.length
  const averageRating =
    totalReviews > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews) * 10) / 10
      : 0

  return NextResponse.json({ reviews, averageRating, totalReviews })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = (await request.json()) as {
    targetId: string
    nodeId?: string
    rating: number
    content: string
  }

  const { targetId, nodeId, rating, content } = body

  if (!targetId || typeof targetId !== 'string') {
    return NextResponse.json({ error: 'targetId is required' }, { status: 400 })
  }

  if (targetId === session.user.id) {
    return NextResponse.json({ error: 'Cannot review yourself' }, { status: 400 })
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
  }

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }

  if (content.trim().length > 500) {
    return NextResponse.json({ error: 'Content must be 500 characters or fewer' }, { status: 400 })
  }

  const review = await db.review.create({
    data: {
      authorId: session.user.id,
      targetId,
      nodeId: nodeId ?? null,
      rating,
      content: content.trim(),
    },
  })

  // Notify the review target
  const author = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  })
  notify({
    userId: targetId,
    type: 'REVIEW',
    title: `${author?.name ?? 'Someone'} left you a ${rating}-star review`,
    body: content.trim().slice(0, 100),
    link: `/me`,
  })

  return NextResponse.json(review, { status: 201 })
}
