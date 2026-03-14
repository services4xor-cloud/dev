import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

/**
 * POST /api/payments/mpesa-callback
 *
 * Public endpoint — called by Safaricom servers after STK push completes.
 * No auth required (Safaricom does not send session tokens).
 *
 * Safaricom callback shape:
 * {
 *   Body: {
 *     stkCallback: {
 *       MerchantRequestID: string
 *       CheckoutRequestID: string
 *       ResultCode: number        // 0 = success
 *       ResultDesc: string
 *       CallbackMetadata?: {
 *         Item: Array<{ Name: string; Value: string | number }>
 *       }
 *     }
 *   }
 * }
 */

interface MpesaCallbackItem {
  Name: string
  Value?: string | number
}

interface MpesaCallback {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string
      CheckoutRequestID?: string
      ResultCode?: number
      ResultDesc?: string
      CallbackMetadata?: {
        Item?: MpesaCallbackItem[]
      }
    }
  }
}

function extractMetadataValue(
  items: MpesaCallbackItem[],
  name: string
): string | number | undefined {
  return items.find((item) => item.Name === name)?.Value
}

export async function POST(req: NextRequest) {
  let payload: MpesaCallback
  try {
    payload = (await req.json()) as MpesaCallback
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const callback = payload?.Body?.stkCallback
  if (!callback) {
    return NextResponse.json({ error: 'Missing stkCallback' }, { status: 400 })
  }

  const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback

  if (!CheckoutRequestID) {
    return NextResponse.json({ error: 'Missing CheckoutRequestID' }, { status: 400 })
  }

  // Find the payment whose description stores the checkout request ID
  // Format: "... | ckReq:<CheckoutRequestID>"
  const payment = await db.payment.findFirst({
    where: {
      description: { contains: `ckReq:${CheckoutRequestID}` },
    },
  })

  if (!payment) {
    // Log but still return 200 to prevent Safaricom from retrying indefinitely
    console.warn('[mpesa-callback] No payment found for CheckoutRequestID:', CheckoutRequestID)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }

  const succeeded = ResultCode === 0

  let mpesaReceiptNumber: string | undefined
  if (succeeded && CallbackMetadata?.Item) {
    const receipt = extractMetadataValue(CallbackMetadata.Item, 'MpesaReceiptNumber')
    if (typeof receipt === 'string') {
      mpesaReceiptNumber = receipt
    }
  }

  await db.payment.update({
    where: { id: payment.id },
    data: {
      status: succeeded ? 'SUCCESS' : 'FAILED',
      ...(mpesaReceiptNumber ? { mpesaReceiptNumber } : {}),
      description: `${payment.description ?? ''} | ${ResultDesc ?? ''}`.trim(),
    },
  })

  // Safaricom expects a 200 with this body to stop retries
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
}
