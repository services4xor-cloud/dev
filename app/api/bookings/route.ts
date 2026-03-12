import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'
import { logger } from '@/lib/logger'

const bookingSchema = z.object({
  experienceId: z.string().min(1),
  experienceName: z.string().min(1),
  date: z.string().min(1),
  guests: z.number().min(1).max(20).default(1),
  paymentMethod: z.enum(['card', 'mpesa']),
  totalAmount: z.number().min(0),
  currency: z.string().length(3).default('KES'),
})

// POST /api/bookings — Create a booking for an experience
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Login required to book an experience' },
        { status: 401 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    const data = parsed.data
    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

    // Persist booking + payment record if DB is available
    if (process.env.DATABASE_URL) {
      try {
        const { db } = await import('@/lib/db')
        await db.payment.create({
          data: {
            userId: session.user.id,
            amount: data.totalAmount,
            currency: data.currency,
            method: data.paymentMethod === 'mpesa' ? 'MPESA' : 'STRIPE',
            status: data.paymentMethod === 'mpesa' ? 'PENDING' : 'SUCCESS',
          },
        })
        logger.info('Booking payment created', { bookingId, method: data.paymentMethod })
      } catch (err) {
        logger.error('Failed to persist booking payment', { error: String(err) })
      }
    }

    // Send confirmation email (fire-and-forget)
    void sendEmail(session.user.email!, 'safari_booking_confirmation', {
      name: session.user.name || 'Pioneer',
      experienceName: data.experienceName,
      date: data.date,
      guests: String(data.guests),
      totalAmount: String(data.totalAmount),
      currency: data.currency,
      bookingId,
    }).catch((err) => logger.error('Booking confirmation email failed', { error: String(err) }))

    return NextResponse.json(
      {
        success: true,
        data: {
          bookingId,
          experienceId: data.experienceId,
          status: 'confirmed',
          paymentMethod: data.paymentMethod,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    logger.error('POST /api/bookings failed', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 })
  }
}
