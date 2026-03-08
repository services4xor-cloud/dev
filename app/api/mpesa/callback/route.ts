import { NextRequest, NextResponse } from 'next/server'

/**
 * Safaricom Daraja Callback Endpoint
 * Safaricom POSTs payment result here after user enters M-Pesa PIN
 *
 * Must be publicly accessible (not localhost) — use ngrok in dev:
 *   ngrok http 3000
 *   Then set MPESA_CALLBACK_URL=https://<ngrok-url>/api/mpesa/callback
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { Body } = body

    const callback = Body?.stkCallback
    if (!callback) {
      return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
    }

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback

    if (ResultCode === 0) {
      // Payment SUCCESSFUL — extract transaction details
      const meta = CallbackMetadata?.Item ?? []
      const getValue = (name: string) => meta.find((i: any) => i.Name === name)?.Value

      const transactionDetails = {
        checkoutRequestId: CheckoutRequestID,
        mpesaReceiptNumber: getValue('MpesaReceiptNumber'),
        amount: getValue('Amount'),
        phoneNumber: getValue('PhoneNumber'),
        transactionDate: getValue('TransactionDate'),
      }

      console.log('✅ M-Pesa payment successful:', transactionDetails)

      // TODO: Save to database and unlock the purchased feature
      // await db.payment.create({ data: transactionDetails })
      // await unlockFeature(transactionDetails)

    } else {
      // Payment FAILED or CANCELLED
      console.log(`❌ M-Pesa payment failed [${ResultCode}]: ${ResultDesc}`)
      // TODO: Update DB record to failed status
    }

    // Always return 200 to Safaricom — they retry on non-200
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  } catch (err) {
    console.error('Callback error:', err)
    return NextResponse.json({ ResultCode: 0, ResultDesc: 'Accepted' })
  }
}
