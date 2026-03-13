import { NextRequest, NextResponse } from 'next/server'
import { buildWhatsAppPayload } from '@/lib/whatsapp-templates'
import { logger } from '@/lib/logger'

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
  const item = items.find((i) => i.Name === name)
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
    logger.debug('WhatsApp credentials not configured — skipping notification', { phoneNumber })
    return
  }

  // Format phone for WhatsApp: 2547XXXXXXXX → +2547XXXXXXXX
  const waPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`

  const payload = buildWhatsAppPayload(waPhone, 'safari_booking_confirmation', 'en_US', [
    'Your Safari Booking', // {{1}} package name
    new Date().toLocaleDateString('en', { dateStyle: 'full' }), // {{2}} date
    '1', // {{3}} guests — real value would come from booking DB lookup
    'Confirm with guide', // {{4}} meeting point — TODO: from booking record
    `KES ${Number(details.amount).toLocaleString('en-US')}`, // {{5}} total paid
    bookingRef, // {{6}} booking ref
  ])

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${waToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.text()
      logger.error('WhatsApp send failed', { error: err })
    } else {
      logger.info('WhatsApp booking confirmation sent', { phone: waPhone })
    }
  } catch (err) {
    logger.error('WhatsApp network error', { error: String(err) })
  }
}

/** Mark payment as confirmed in the database */
async function confirmBooking(details: PaymentDetails): Promise<void> {
  if (!process.env.DATABASE_URL) {
    logger.debug('Skipping DB write (DATABASE_URL not set)', {
      checkoutRequestId: details.checkoutRequestId,
      receipt: details.mpesaReceiptNumber,
      amount: details.amount,
    })
    return
  }

  try {
    const { db } = await import('@/lib/db')
    await db.payment.updateMany({
      where: { checkoutRequestId: details.checkoutRequestId },
      data: {
        status: 'SUCCESS',
        mpesaReceiptNumber: details.mpesaReceiptNumber,
        updatedAt: new Date(),
      },
    })
    logger.info('Payment confirmed in DB', {
      checkoutRequestId: details.checkoutRequestId,
      receipt: details.mpesaReceiptNumber,
    })
  } catch (err) {
    logger.error('Failed to confirm payment in DB', { error: String(err) })
  }
}

/** Mark payment as failed in the database */
async function failBooking(checkoutRequestId: string, reason: string): Promise<void> {
  if (!process.env.DATABASE_URL) {
    logger.debug('Skipping DB write (DATABASE_URL not set)', { checkoutRequestId, reason })
    return
  }

  try {
    const { db } = await import('@/lib/db')
    await db.payment.updateMany({
      where: { checkoutRequestId },
      data: { status: 'FAILED' as const, updatedAt: new Date() },
    })
    logger.info('Payment marked failed in DB', { checkoutRequestId, reason })
  } catch (err) {
    logger.error('Failed to update payment status in DB', { error: String(err) })
  }
}

/** Notify Pioneer of payment failure via WhatsApp if configured */
async function notifyPaymentFailure(
  phoneNumber: string,
  checkoutRequestId: string,
  reason: string
): Promise<void> {
  const waToken = process.env.WHATSAPP_CLOUD_API_TOKEN
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!waToken || !phoneNumberId || !phoneNumber) {
    logger.debug('Payment failure notification skipped (WhatsApp not configured or no phone)', {
      checkoutRequestId,
      reason,
    })
    return
  }

  const waPhone = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`
  try {
    const payload = buildWhatsAppPayload(waPhone, 'payment_failure', 'en_US', [reason])
    await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${waToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    logger.info('Payment failure notification sent', { phone: waPhone })
  } catch (err) {
    logger.error('Failed to send payment failure notification', { error: String(err) })
  }
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
      logger.warn('M-Pesa callback malformed — missing Body.stkCallback')
      // Still return 200 to prevent Safaricom retry loops
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { CheckoutRequestID, MerchantRequestID, ResultCode, ResultDesc, CallbackMetadata } =
      callback

    logger.info('M-Pesa callback received', { CheckoutRequestID, ResultCode })

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

      logger.info('M-Pesa payment confirmed', {
        receipt: details.mpesaReceiptNumber,
        amount: details.amount,
      })

      // 1. Mark booking confirmed in DB
      await confirmBooking(details)

      // 2. Send WhatsApp booking confirmation (uses safari_booking_confirmation template)
      const bookingRef = `BKN-${details.mpesaReceiptNumber || CheckoutRequestID.slice(-8)}`
      if (details.phoneNumber) {
        await sendWhatsAppConfirmation(details.phoneNumber, details, bookingRef)
      }
    } else {
      // ── PAYMENT FAILED / CANCELLED ──────────────────────────────────────
      logger.warn('M-Pesa payment failed', { ResultCode, ResultDesc })

      await failBooking(CheckoutRequestID, ResultDesc)

      // Notify user if we have their phone number (not always in failed callbacks)
      // In practice, phone comes from your booking DB lookup by CheckoutRequestID
      await notifyPaymentFailure('', CheckoutRequestID, ResultDesc)
    }

    // Always return 200 — Safaricom retries on any non-200 response
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (err) {
    logger.error('M-Pesa callback unhandled error', { error: String(err) })
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
