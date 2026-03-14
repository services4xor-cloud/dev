import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { stkPush } from '@/lib/mpesa'
import { PaymentMethod } from '@prisma/client'

const VALID_METHODS = Object.values(PaymentMethod) as string[]

function getSessionUserId(session: Awaited<ReturnType<typeof getServerSession>>): string | null {
  if (!session) return null
  const u = (session as { user?: { id?: string } }).user
  if (!u) return null
  return u.id ?? null
}

/**
 * GET /api/payments
 * List the authenticated Pioneer's payment history.
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  const userId = getSessionUserId(session)
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const payments = await db.payment.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(payments)
}

/**
 * POST /api/payments
 * Initiate a payment. Supports MPESA (STK push) and STRIPE (record-only for now).
 *
 * Body: { amount, currency, method, description, phone? }
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const userId = getSessionUserId(session)
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: {
    amount?: unknown
    currency?: unknown
    method?: unknown
    description?: unknown
    phone?: unknown
  }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { amount, currency, method, description, phone } = body

  // --- Validation ---
  if (typeof amount !== 'number' || amount <= 0 || amount > 1_000_000) {
    return NextResponse.json(
      { error: 'amount must be a number between 1 and 1,000,000' },
      { status: 400 }
    )
  }

  if (typeof currency !== 'string' || currency.length === 0 || currency.length > 3) {
    return NextResponse.json({ error: 'currency must be a 1–3 character string' }, { status: 400 })
  }

  if (typeof method !== 'string' || !VALID_METHODS.includes(method)) {
    return NextResponse.json(
      { error: `method must be one of: ${VALID_METHODS.join(', ')}` },
      { status: 400 }
    )
  }

  const paymentMethod = method as PaymentMethod
  const descriptionStr = typeof description === 'string' ? description : undefined

  // --- Create PENDING payment record ---
  const payment = await db.payment.create({
    data: {
      userId,
      amount: Math.round(amount),
      currency: currency.toUpperCase(),
      method: paymentMethod,
      status: 'PENDING',
      description: descriptionStr,
    },
  })

  // --- Method-specific processing ---
  if (paymentMethod === 'MPESA') {
    const phoneStr = typeof phone === 'string' ? phone : ''
    if (!phoneStr) {
      return NextResponse.json({ error: 'phone is required for MPESA payments' }, { status: 400 })
    }

    try {
      const result = await stkPush({
        phone: phoneStr,
        amount,
        reference: payment.id,
        description: descriptionStr ?? 'BeNetwork payment',
      })

      if (result.checkoutRequestId) {
        // Store the checkout request ID so the callback can match it
        await db.payment.update({
          where: { id: payment.id },
          data: {
            description: `${descriptionStr ?? ''} | ckReq:${result.checkoutRequestId}`.trim(),
          },
        })
      }
    } catch {
      // STK push failed — mark payment as FAILED so it doesn't stay PENDING forever
      await db.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      })
      return NextResponse.json(
        { error: 'Payment initiation failed. Please try again.' },
        { status: 502 }
      )
    }
  }

  // STRIPE: record created, full integration added when keys are available
  // Other methods: record created, no additional action

  return NextResponse.json({ id: payment.id, status: payment.status }, { status: 201 })
}
