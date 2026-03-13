import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { logger } from '@/lib/logger'
import type { PaymentMethod, PaymentStatus } from '@prisma/client'

// ─── Plug registry (method string → PaymentMethod enum) ────────────────────

const METHOD_TO_ENUM: Record<string, PaymentMethod> = {
  mpesa: 'MPESA',
  stripe: 'STRIPE',
  sepa: 'SEPA',
  flutterwave: 'FLUTTERWAVE',
}

const PLUG_STATUS_TO_DB: Record<string, PaymentStatus> = {
  pending: 'PENDING',
  processing: 'PENDING',
  completed: 'SUCCESS',
  failed: 'FAILED',
  refunded: 'REFUNDED',
}

// ─── Lazy-import payment plugs to avoid pulling client code into the route ──

async function getPlug(method: string) {
  const { getPaymentPlug, getPaymentPlugs } = await import('@/lib/payments')

  // Find by plug id across all known plugs
  const countryCode = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase()
  const plugs = getPaymentPlugs(countryCode)
  const plug = plugs.find((p) => p.id === method)

  if (plug) return plug

  // Fallback: try getting the primary plug for the country
  const primary = getPaymentPlug(countryCode)
  if (primary.id === method) return primary

  return null
}

// ─── Validation schemas ─────────────────────────────────────────────────────

const initiatePaymentSchema = z.object({
  amount: z.number().int().positive('Amount must be a positive integer'),
  currency: z.string().min(3).max(3, 'Currency must be a 3-letter ISO code'),
  method: z.enum(['mpesa', 'stripe', 'sepa', 'flutterwave']),
  payerIdentifier: z.string().min(1, 'Payer identifier is required'),
  pathId: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(500),
})

// ─── POST /api/payments — Initiate a payment ───────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Login required to make a payment' },
        { status: 401 }
      )
    }

    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
    }

    const parsed = initiatePaymentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message },
        { status: 400 }
      )
    }

    const { amount, currency, method, payerIdentifier, pathId, description } = parsed.data

    // Validate pathId exists if provided
    if (pathId) {
      const path = await db.path.findUnique({ where: { id: pathId }, select: { id: true } })
      if (!path) {
        return NextResponse.json({ success: false, error: 'Path not found' }, { status: 404 })
      }
    }

    // Look up the payment plug by method
    const plug = await getPlug(method)
    if (!plug) {
      return NextResponse.json(
        { success: false, error: `Payment method '${method}' is not available` },
        { status: 400 }
      )
    }

    // Initiate payment via plug
    const reference = `payment-${session.user.id}-${Date.now()}`
    const result = await plug.initiate({
      amount,
      currency,
      description,
      reference,
      payerIdentifier,
      metadata: {
        userId: session.user.id,
        ...(pathId ? { pathId } : {}),
      },
    })

    // Map plug result to DB enum values
    const dbMethod = METHOD_TO_ENUM[method] ?? 'STRIPE'
    const dbStatus = PLUG_STATUS_TO_DB[result.status] ?? 'PENDING'

    // Store payment record in DB
    const payment = await db.payment.create({
      data: {
        userId: session.user.id,
        pathId: pathId ?? null,
        amount,
        currency,
        method: dbMethod,
        status: dbStatus,
        // Store provider transaction IDs in the appropriate field
        ...(method === 'mpesa'
          ? { checkoutRequestId: result.transactionId }
          : method === 'stripe'
            ? { stripePaymentId: result.transactionId }
            : {}),
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          paymentId: payment.id,
          transactionId: result.transactionId,
          status: result.status,
          message: result.message,
          provider: result.provider,
          amount: result.amount,
          currency: result.currency,
        },
      },
      { status: 201 }
    )
  } catch (err) {
    logger.error('POST /api/payments failed', { error: String(err) })
    return NextResponse.json(
      { success: false, error: 'Payment initiation failed' },
      { status: 500 }
    )
  }
}

// ─── GET /api/payments — List payments for current user ─────────────────────

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Login required' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')?.toUpperCase() as PaymentStatus | undefined
    const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const where: Record<string, unknown> = { userId: session.user.id }
    if (status && ['PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'].includes(status)) {
      where.status = status
    }

    const [payments, total] = await Promise.all([
      db.payment.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          path: { select: { id: true, title: true } },
        },
      }),
      db.payment.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: payments,
      total,
      limit,
      offset,
    })
  } catch (err) {
    logger.error('GET /api/payments failed', { error: String(err) })
    return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 })
  }
}
