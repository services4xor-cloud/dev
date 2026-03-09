import { NextRequest, NextResponse } from 'next/server'
import { initiateStkPush, formatKenyanPhone } from '@/lib/mpesa'
import { z } from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/mpesa/stkpush
// Initiates M-Pesa STK Push for safari bookings or path chapter fees
//
// Body: { phone, amount, packageId?, pathId?, description }
// Sandbox: MPESA_ENVIRONMENT=sandbox, shortcode=174379
// Returns: { success, checkoutRequestId, merchantRequestId, message }
// ─────────────────────────────────────────────────────────────────────────────

const schema = z.object({
  phone: z.string().min(9, 'Phone number too short'),
  amount: z.number().min(1, 'Amount must be at least 1 KES').max(150000, 'M-Pesa daily limit is KES 150,000'),
  packageId: z.string().optional(),
  pathId: z.string().optional(),
  description: z.string().min(1, 'Description is required').max(13, 'Description max 13 chars for M-Pesa'),
})

type StkPushBody = z.infer<typeof schema>

function buildAccountRef(body: StkPushBody): string {
  // M-Pesa AccountReference max 12 chars
  if (body.packageId) return `SAF-${body.packageId}`.slice(0, 12)
  if (body.pathId) return `PATH-${body.pathId}`.slice(0, 12)
  return 'BEKENYA'
}

/** Mock success response for development when credentials are not set */
function mockStkPushResponse(phone: string, amount: number, description: string) {
  const mockCheckoutId = `mock-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const mockMerchantId = `mock-merchant-${Date.now()}`
  console.log(`[DEV MOCK] STK Push → phone=${phone} amount=${amount} description=${description}`)
  return NextResponse.json({
    success: true,
    checkoutRequestId: mockCheckoutId,
    merchantRequestId: mockMerchantId,
    message: '[DEV MODE] STK Push simulated — no real M-Pesa credentials configured. Set MPESA_CONSUMER_KEY + MPESA_CONSUMER_SECRET to enable.',
    mock: true,
  })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0]?.message ?? 'Invalid request body' },
        { status: 400 }
      )
    }

    const { phone, amount, description } = parsed.data

    // Format phone to Safaricom 2547XXXXXXXX format
    let formattedPhone: string
    try {
      formattedPhone = formatKenyanPhone(phone)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid Kenyan phone number. Use format 07XXXXXXXX or +2547XXXXXXXX' },
        { status: 400 }
      )
    }

    const accountRef = buildAccountRef(parsed.data)

    // Return mock response when credentials not configured (development fallback)
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
      return mockStkPushResponse(formattedPhone, amount, description)
    }

    // M-Pesa Daraja API v2 flow:
    // 1. Get OAuth token from /oauth/v1/generate?grant_type=client_credentials
    // 2. Generate password: base64(shortcode + passkey + timestamp)
    // 3. POST to /mpesa/stkpush/v1/processrequest
    const result = await initiateStkPush({
      phoneNumber: formattedPhone,
      amount,
      accountRef,
      description,
    })

    return NextResponse.json({
      success: true,
      checkoutRequestId: result.CheckoutRequestID,
      merchantRequestId: result.MerchantRequestID,
      message: result.CustomerMessage,
      mock: false,
    })
  } catch (err) {
    console.error('[STK Push] Error:', err)
    const message = err instanceof Error ? err.message : 'STK Push failed'
    return NextResponse.json(
      { success: false, error: message },
      { status: 502 }
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/mpesa/stkpush
// Health check — confirms endpoint is live and shows config status
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  const configured = !!(
    process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_BUSINESS_SHORT_CODE &&
    process.env.MPESA_PASSKEY
  )

  return NextResponse.json({
    status: 'ok',
    endpoint: 'POST /api/mpesa/stkpush',
    environment: process.env.MPESA_ENVIRONMENT ?? 'sandbox',
    shortcode: process.env.MPESA_BUSINESS_SHORT_CODE ?? '174379 (sandbox default)',
    configured,
    note: configured
      ? 'M-Pesa STK Push is ready'
      : 'Running in mock mode — set MPESA_CONSUMER_KEY + MPESA_CONSUMER_SECRET for real payments',
  })
}
