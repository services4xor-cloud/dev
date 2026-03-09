import { NextRequest, NextResponse } from 'next/server'
import { buildWhatsAppPayload } from '@/lib/whatsapp-templates'

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/mpesa/callback
// M-Pesa Daraja STK Push Callback Webhook
//
// Safaricom POSTs payment results here after the user enters their M-Pesa PIN.
// Must be a publicly accessible HTTPS URL.
//
// Dev: use ngrok → ngrok http 3000
//      then set MPESA_CALLBACK_URL=https://<ngrok-id>.ngrok-free.app/api/mpesa/callback
//
// Always respond { ResultCode: 0, ResultDesc: 'Accepted' } — Safaricom retries on non-200.
// ─────────────────────────────────────────────────────────────────────────────

interface MpesaCallbackItem {
  Name: string
  Value: string | number
}

interface MpesaCallbackMetadata {
  Item: MpesaCallbackItem[]
}

interface MpesaStkCallback {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResultCode: number
  ResultDesc: string
  CallbackMetadata?: MpesaCallbackMetadata
}

interface MpesaCallbackBody {
  Body: {
    stkCallback: MpesaStkCallback
  }
}

interface PaymentDetails {
  checkoutRequestId: string
  merchantRequestId: string
  mpesaReceiptNumber: string
  amount: number
  phoneNumber: string
  transactionDate: string
}

/** Extract a named value from M-Pesa CallbackMetadata items */
function getMetaValue(items: MpesaCallbackItem[], name: string): string {
  const item = items.find(i => i.Name === name)
  return item?.Value !== undefined ? String(item.Value) : ''
}

/** Send WhatsApp booking confirmation via Meta Cloud API */
async function sendWhatsAppConfirmation(
  phoneNumber: string,
  details: PaymentDetails,
  bookingRef: string
): Promise<void> {
  const waToken = process.env.WHATSAPP_CLOUD_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!waToken || !phoneNumberId) {
    console.log('[WhatsApp] Credentials not configured — skipping notification')
    console.log('[WhatsApp] Would send safari_booking_confirmation to:', phoneNumber)
    return
  }

  // Format phone for WhatsApp: 2547XXXXXXXX → +2547XXXXXXXX
  const waPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`

  const payload = buildWhatsAppPayload(
    waPhone,
    'safari_booking_confirmation',
    'en_US',
    [
      'Your Safari Booking', // {{1}} package name
      new Date().toLocaleDateString('en-KE', { dateStyle: 'full' }), // {{2}} date
      '1', // {{3}} guests — real value would come from booking DB lookup
      'Nairobi — confirm with guide', // {{4}} meeting point
      `KES ${Number(details.amount).toLocaleString('en-US')}`, // {{5}} total paid
      bookingRef, // {{6}} booking ref
    ]
  )

  try {
    const res = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${waToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      console.error('[WhatsApp] Send failed:', err)
    } else {
      console.log('[WhatsApp] Booking confirmation sent to:', waPhone)
    }
  } catch (err) {
    console.error('[WhatsApp] Network error:', err)
  }
}

/** Mark booking as confirmed in the database */
async function confirmBooking(details: PaymentDetails): Promise<void> {
  // TODO: Implement once DATABASE_URL is configured
  // Uncomment and adapt:
  //
  // const { db } = await import('@/lib/db')
  // await db.payment.upsert({
  //   where: { checkoutRequestId: details.checkoutRequestId },
  //   create: {
  //     checkoutRequestId: details.checkoutRequestId,
  //     mpesaReceiptNumber: details.mpesaReceiptNumber,
  //     amount: details.amount,
  //     phoneNumber: details.phoneNumber,
  //     transactionDate: details.transactionDate,
  //     status: 'confirmed',
  //   },
  //   update: { status: 'confirmed', mpesaReceiptNumber: details.mpesaReceiptNumber },
  // })
  //
  // Also: unlock the feature tied to this payment
  // await db.booking.updateMany({
  //   where: { checkoutRequestId: details.checkoutRequestId },
  //   data: { status: 'confirmed', paidAt: new Date() },
  // })

  console.log('[DB] Would confirm booking:', {
    checkoutRequestId: details.checkoutRequestId,
    receipt: details.mpesaReceiptNumber,
    amount: details.amount,
  })
}

/** Mark booking as failed in the database */
async function failBooking(checkoutRequestId: string, reason: string): Promise<void> {
  // TODO: Implement once DATABASE_URL is configured
  // await db.payment.updateMany({
  //   where: { checkoutRequestId },
  //   data: { status: 'failed', failureReason: reason },
  // })

  console.log('[DB] Would mark booking failed:', { checkoutRequestId, reason })
}

/** Notify user of payment failure (e.g. user cancelled, insufficient funds) */
async function notifyPaymentFailure(
  phoneNumber: string,
  checkoutRequestId: string,
  reason: string
): Promise<void> {
  // TODO: Send WhatsApp / SMS failure notification
  // For now just log — a real implementation would use a fallback SMS service
  console.log('[Notify] Payment failed for phone:', phoneNumber, 'reason:', reason, 'ref:', checkoutRequestId)
}

// ─────────────────────────────────────────────────────────────────────────────
// POST handler — receives M-Pesa Daraja callback
// ─────────────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: MpesaCallbackBody = await req.json()

    // Validate callback structure
    const callback = body?.Body?.stkCallback
    if (!callback) {
      console.warn('[M-Pesa Callback] Malformed payload — missing Body.stkCallback')
      // Still return 200 to prevent Safaricom retry loops
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { CheckoutRequestID, MerchantRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback

    console.log(`[M-Pesa Callback] CheckoutRequestID=${CheckoutRequestID} ResultCode=${ResultCode}`)

    if (ResultCode === 0) {
      // ── PAYMENT SUCCESSFUL ──────────────────────────────────────────────
      const items = CallbackMetadata?.Item ?? []

      const details: PaymentDetails = {
        checkoutRequestId: CheckoutRequestID,
        merchantRequestId: MerchantRequestID,
        mpesaReceiptNumber: getMetaValue(items, 'MpesaReceiptNumber'),
        amount: Number(getMetaValue(items, 'Amount')),
        phoneNumber: getMetaValue(items, 'PhoneNumber'),
        transactionDate: getMetaValue(items, 'TransactionDate'),
      }

      console.log('[M-Pesa] Payment confirmed:', details)

      // 1. Mark booking confirmed in DB
      await confirmBooking(details)

      // 2. Send WhatsApp booking confirmation (uses safari_booking_confirmation template)
      const bookingRef = `BKN-${details.mpesaReceiptNumber || CheckoutRequestID.slice(-8)}`
      if (details.phoneNumber) {
        await sendWhatsAppConfirmation(details.phoneNumber, details, bookingRef)
      }

    } else {
      // ── PAYMENT FAILED / CANCELLED ──────────────────────────────────────
      console.log(`[M-Pesa] Payment failed [${ResultCode}]: ${ResultDesc}`)

      await failBooking(CheckoutRequestID, ResultDesc)

      // Notify user if we have their phone number (not always in failed callbacks)
      // In practice, phone comes from your booking DB lookup by CheckoutRequestID
      await notifyPaymentFailure('', CheckoutRequestID, ResultDesc)
    }

    // Always return 200 — Safaricom retries on any non-200 response
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })

  } catch (err) {
    console.error('[M-Pesa Callback] Unhandled error:', err)
    // Return 200 even on errors — we never want Safaricom to retry indefinitely
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/mpesa/callback
// Health check — confirms webhook endpoint is publicly reachable
// ─────────────────────────────────────────────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'POST /api/mpesa/callback',
    description: 'Safaricom M-Pesa STK Push callback webhook',
    note: 'This URL must be publicly accessible. Set MPESA_CALLBACK_URL env var to this URL.',
    whatsappConfigured: !!(
      process.env.WHATSAPP_CLOUD_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
    ),
  })
}
