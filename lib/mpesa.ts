/**
 * M-Pesa Daraja v2 STK Push client — sandbox mode.
 *
 * Uses Safaricom sandbox endpoints. Set env vars to enable:
 *   MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE,
 *   MPESA_PASSKEY, MPESA_CALLBACK_URL
 *
 * If any env var is missing, operations return { success: false } rather than crashing.
 */

const SANDBOX_BASE = 'https://sandbox.safaricom.co.ke'

function isConfigured(): boolean {
  return !!(
    process.env.MPESA_CONSUMER_KEY &&
    process.env.MPESA_CONSUMER_SECRET &&
    process.env.MPESA_SHORTCODE &&
    process.env.MPESA_PASSKEY &&
    process.env.MPESA_CALLBACK_URL
  )
}

/**
 * Fetch OAuth access token from Safaricom sandbox.
 */
export async function getAccessToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY!
  const secret = process.env.MPESA_CONSUMER_SECRET!
  const credentials = Buffer.from(`${key}:${secret}`).toString('base64')

  const res = await fetch(`${SANDBOX_BASE}/oauth/v1/generate?grant_type=client_credentials`, {
    method: 'GET',
    headers: { Authorization: `Basic ${credentials}` },
  })

  if (!res.ok) {
    throw new Error(`M-Pesa token fetch failed: ${res.status} ${res.statusText}`)
  }

  const data = (await res.json()) as { access_token: string }
  return data.access_token
}

export interface StkPushParams {
  phone: string
  amount: number
  reference: string
  description: string
}

export interface StkPushResult {
  success: boolean
  checkoutRequestId?: string
  merchantRequestId?: string
  error?: string
}

/**
 * Initiate M-Pesa STK Push (sandbox).
 * Returns checkout request ID on success for later status polling / callback matching.
 */
export async function stkPush(params: StkPushParams): Promise<StkPushResult> {
  if (!isConfigured()) {
    console.warn('[mpesa] M-Pesa env vars not configured — skipping STK push')
    return { success: false, error: 'M-Pesa not configured' }
  }

  const { phone, amount, reference, description } = params
  const shortcode = process.env.MPESA_SHORTCODE!
  const passkey = process.env.MPESA_PASSKEY!
  const callbackUrl = process.env.MPESA_CALLBACK_URL!

  const timestamp = new Date()
    .toISOString()
    .replace(/[^0-9]/g, '')
    .slice(0, 14)

  const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64')

  // Normalise phone: strip leading 0 or +, ensure 254 prefix
  const normalised = phone.replace(/^\+/, '').replace(/^0/, '254').replace(/\D/g, '')

  try {
    const token = await getAccessToken()

    const body = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: normalised,
      PartyB: shortcode,
      PhoneNumber: normalised,
      CallBackURL: callbackUrl,
      AccountReference: reference.slice(0, 12),
      TransactionDesc: description.slice(0, 13),
    }

    const res = await fetch(`${SANDBOX_BASE}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = (await res.json()) as {
      ResponseCode?: string
      CheckoutRequestID?: string
      MerchantRequestID?: string
      errorCode?: string
      errorMessage?: string
    }

    if (data.ResponseCode === '0' && data.CheckoutRequestID) {
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
      }
    }

    const errMsg = data.errorMessage ?? `ResponseCode: ${data.ResponseCode}`
    console.error('[mpesa] STK push failed:', errMsg)
    return { success: false, error: errMsg }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown M-Pesa error'
    console.error('[mpesa] STK push error:', message)
    return { success: false, error: message }
  }
}
