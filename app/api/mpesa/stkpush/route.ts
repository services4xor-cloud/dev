import { NextRequest, NextResponse } from 'next/server'
import { initiateStkPush, formatKenyanPhone } from '@/lib/mpesa'
import { z } from 'zod'

const schema = z.object({
  phoneNumber: z.string().min(9),
  amount: z.number().min(1).max(150000), // M-Pesa daily limit KES 150,000
  itemType: z.enum(['job_post', 'premium', 'referral']),
  itemId: z.string(),
})

export async function POST(req: NextRequest) {
  if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
    return NextResponse.json(
      { success: false, error: 'M-Pesa not configured — add MPESA_CONSUMER_KEY + MPESA_CONSUMER_SECRET to env vars' },
      { status: 503 }
    )
  }

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0]?.message }, { status: 400 })
    }
    const { phoneNumber, amount, itemType, itemId } = parsed.data

    const formattedPhone = formatKenyanPhone(phoneNumber)

    const result = await initiateStkPush({
      phoneNumber: formattedPhone,
      amount,
      accountRef: `BKN-${itemType.toUpperCase()}-${itemId}`.slice(0, 12),
      description: getDescription(itemType),
    })

    return NextResponse.json({
      success: true,
      checkoutRequestId: result.CheckoutRequestID,
      message: result.CustomerMessage,
    })
  } catch (err) {
    console.error('STK Push error:', err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Payment failed' },
      { status: 400 }
    )
  }
}

function getDescription(type: string) {
  const descriptions: Record<string, string> = {
    job_post: 'Bekenya Job Posting',
    premium: 'Bekenya Premium Upgrade',
    referral: 'Bekenya Referral Bonus',
  }
  return descriptions[type] ?? 'Bekenya Payment'
}
