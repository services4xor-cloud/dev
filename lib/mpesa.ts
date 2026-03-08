/**
 * M-Pesa Daraja API v2 client
 * Handles STK Push (Lipa na M-Pesa Online) for Bekenya.com
 *
 * Docs: https://developer.safaricom.co.ke/docs
 */

const MPESA_BASE_URL =
  process.env.MPESA_ENVIRONMENT === 'production'
    ? 'https://api.safaricom.co.ke'
    : 'https://sandbox.safaricom.co.ke'

/** Get OAuth access token from Safaricom */
export async function getMpesaToken(): Promise<string> {
  const credentials = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64')

  const res = await fetch(`${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
    cache: 'no-store',
  })

  if (!res.ok) throw new Error(`M-Pesa token error: ${res.status}`)
  const data = await res.json()
  return data.access_token
}

export interface StkPushParams {
  phoneNumber: string   // Format: 2547XXXXXXXX (254 country code)
  amount: number        // KES amount (integer)
  accountRef: string    // e.g. 'BEKENYA-JOB-123'
  description: string   // e.g. 'Job Posting Fee'
}

export interface StkPushResponse {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResponseCode: string
  ResponseDescription: string
  CustomerMessage: string
}

/** Initiate M-Pesa STK Push — sends payment prompt to user's phone */
export async function initiateStkPush(params: StkPushParams): Promise<StkPushResponse> {
  const token = await getMpesaToken()
  const timestamp = getTimestamp()
  const password = getPassword(timestamp)

  const body = {
    BusinessShortCode: process.env.MPESA_BUSINESS_SHORT_CODE,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: Math.ceil(params.amount),
    PartyA: params.phoneNumber,
    PartyB: process.env.MPESA_BUSINESS_SHORT_CODE,
    PhoneNumber: params.phoneNumber,
    CallBackURL: process.env.MPESA_CALLBACK_URL,
    AccountReference: params.accountRef,
    TransactionDesc: params.description,
  }

  const res = await fetch(`${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`STK Push failed: ${err}`)
  }

  return res.json()
}

/** Timestamp format required by Safaricom: YYYYMMDDHHmmss */
function getTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-T:.Z]/g, '')
    .slice(0, 14)
}

/** Base64(shortcode + passkey + timestamp) */
function getPassword(timestamp: string): string {
  const raw = `${process.env.MPESA_BUSINESS_SHORT_CODE}${process.env.MPESA_PASSKEY}${timestamp}`
  return Buffer.from(raw).toString('base64')
}

/** Format phone number to Safaricom format (2547XXXXXXXX) */
export function formatKenyanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('0')) return `254${digits.slice(1)}`
  if (digits.startsWith('254')) return digits
  if (digits.startsWith('7') || digits.startsWith('1')) return `254${digits}`
  throw new Error(`Invalid Kenyan phone number: ${phone}`)
}
