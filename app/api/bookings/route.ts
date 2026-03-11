/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

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

    const body = await req.json()
    const parsed = bookingSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    const data = parsed.data
    const bookingId = `bk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`

    // TODO: Save booking to DB when Booking model exists
    // For now, generate confirmation and send email

    // Send confirmation email (fire-and-forget)
    void sendEmail(session.user.email!, 'safari_booking_confirmation', {
      name: session.user.name || 'Pioneer',
      experienceName: data.experienceName,
      date: data.date,
      guests: String(data.guests),
      totalAmount: String(data.totalAmount),
      currency: data.currency,
      bookingId,
    }).catch((err) => console.error('Booking confirmation email error:', err))

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
    console.error('POST /api/bookings error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create booking' }, { status: 500 })
  }
}
