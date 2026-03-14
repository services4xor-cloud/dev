/**
 * Tests for payment API routes:
 *   app/api/payments/route.ts         (GET, POST)
 *   app/api/payments/[id]/route.ts    (GET)
 *   app/api/payments/mpesa-callback/route.ts (POST)
 */
import { NextRequest } from 'next/server'

// ---- Mocks (must come before route imports) ----

jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

jest.mock('@/lib/auth', () => ({
  authOptions: {},
}))

jest.mock('@/lib/db', () => ({
  db: {
    payment: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
    },
  },
}))

jest.mock('@/lib/mpesa', () => ({
  stkPush: jest.fn(),
}))

// ---- Imports ----

import { GET as listPayments, POST as createPayment } from '@/app/api/payments/route'
import { GET as getPaymentById } from '@/app/api/payments/[id]/route'
import { POST as mpesaCallback } from '@/app/api/payments/mpesa-callback/route'
import { getServerSession } from 'next-auth'
import { stkPush } from '@/lib/mpesa'

const mockGetServerSession = getServerSession as jest.MockedFunction<typeof getServerSession>
const mockStkPush = stkPush as jest.MockedFunction<typeof stkPush>

function getDb() {
  return require('@/lib/db').db
}

// ---- Helpers ----

function makeSession(overrides: Record<string, unknown> = {}) {
  return {
    user: { id: 'user-1', role: 'EXPLORER', ...overrides },
    expires: '2099-01-01',
  }
}

function makeListRequest(): NextRequest {
  return new NextRequest('http://localhost/api/payments', { method: 'GET' })
}

function makeCreateRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/payments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeGetByIdRequest(id: string): NextRequest {
  return new NextRequest(`http://localhost/api/payments/${id}`, { method: 'GET' })
}

function makeCallbackRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/payments/mpesa-callback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

const mockPayment = {
  id: 'pay-1',
  userId: 'user-1',
  amount: 500,
  currency: 'KES',
  method: 'MPESA',
  status: 'PENDING',
  mpesaReceiptNumber: null,
  stripePaymentId: null,
  description: null,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
}

// ---- GET /api/payments ----

describe('GET /api/payments', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await listPayments()
    expect(res.status).toBe(401)
  })

  test('returns 401 when session has no user id', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { name: 'Alice' },
      expires: '2099-01-01',
    } as unknown as Awaited<ReturnType<typeof getServerSession>>)
    const res = await listPayments()
    expect(res.status).toBe(401)
  })

  test('returns user payments', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().payment.findMany.mockResolvedValue([mockPayment])

    const res = await listPayments()
    expect(res.status).toBe(200)

    const data = await res.json()
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(1)
    expect(data[0].id).toBe('pay-1')

    expect(getDb().payment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: 'user-1' } })
    )
  })
})

// ---- POST /api/payments ----

describe('POST /api/payments', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await createPayment(
      makeCreateRequest({ amount: 100, currency: 'KES', method: 'STRIPE' })
    )
    expect(res.status).toBe(401)
  })

  test('validates amount > 0', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createPayment(
      makeCreateRequest({ amount: 0, currency: 'KES', method: 'STRIPE' })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/amount/)
  })

  test('validates amount <= 1,000,000', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createPayment(
      makeCreateRequest({ amount: 2_000_000, currency: 'KES', method: 'STRIPE' })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/amount/)
  })

  test('validates currency max 3 chars', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createPayment(
      makeCreateRequest({ amount: 100, currency: 'TOOLONG', method: 'STRIPE' })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/currency/)
  })

  test('validates method is a valid PaymentMethod', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const res = await createPayment(
      makeCreateRequest({ amount: 100, currency: 'KES', method: 'INVALID' })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/method/)
  })

  test('creates a STRIPE payment record and returns 201', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().payment.create.mockResolvedValue({ id: 'pay-new', status: 'PENDING' })

    const res = await createPayment(
      makeCreateRequest({ amount: 1000, currency: 'EUR', method: 'STRIPE', description: 'Test' })
    )
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.id).toBe('pay-new')
    expect(body.status).toBe('PENDING')

    expect(getDb().payment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          amount: 1000,
          currency: 'EUR',
          method: 'STRIPE',
          status: 'PENDING',
        }),
      })
    )
  })

  test('creates an MPESA payment and calls stkPush', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().payment.create.mockResolvedValue({ id: 'pay-mpesa', status: 'PENDING' })
    getDb().payment.update.mockResolvedValue({ id: 'pay-mpesa', status: 'PENDING' })
    mockStkPush.mockResolvedValue({ success: true, checkoutRequestId: 'ckReq-abc123' })

    const res = await createPayment(
      makeCreateRequest({
        amount: 500,
        currency: 'KES',
        method: 'MPESA',
        phone: '0712345678',
        description: 'Path fee',
      })
    )
    expect(res.status).toBe(201)
    expect(mockStkPush).toHaveBeenCalledWith(
      expect.objectContaining({ phone: '0712345678', amount: 500 })
    )
  })

  test('returns 400 when MPESA phone is missing', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().payment.create.mockResolvedValue({ id: 'pay-mpesa', status: 'PENDING' })

    const res = await createPayment(
      makeCreateRequest({ amount: 500, currency: 'KES', method: 'MPESA' })
    )
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toMatch(/phone/)
  })

  test('returns 400 for invalid JSON body', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    const req = new NextRequest('http://localhost/api/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    })
    const res = await createPayment(req)
    expect(res.status).toBe(400)
  })
})

// ---- GET /api/payments/[id] ----

describe('GET /api/payments/[id]', () => {
  beforeEach(() => jest.clearAllMocks())

  test('returns 401 without session', async () => {
    mockGetServerSession.mockResolvedValue(null)
    const res = await getPaymentById(makeGetByIdRequest('pay-1'), { params: { id: 'pay-1' } })
    expect(res.status).toBe(401)
  })

  test('returns 404 when payment does not exist', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().payment.findUnique.mockResolvedValue(null)

    const res = await getPaymentById(makeGetByIdRequest('pay-missing'), {
      params: { id: 'pay-missing' },
    })
    expect(res.status).toBe(404)
  })

  test('returns 403 for non-owner', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'user-other' }) as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().payment.findUnique.mockResolvedValue({ ...mockPayment, userId: 'user-1' })

    const res = await getPaymentById(makeGetByIdRequest('pay-1'), { params: { id: 'pay-1' } })
    expect(res.status).toBe(403)
  })

  test('returns payment for owner', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession() as unknown as Awaited<ReturnType<typeof getServerSession>>
    )
    getDb().payment.findUnique.mockResolvedValue(mockPayment)

    const res = await getPaymentById(makeGetByIdRequest('pay-1'), { params: { id: 'pay-1' } })
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.id).toBe('pay-1')
  })

  test('returns payment for ADMIN accessing another users payment', async () => {
    mockGetServerSession.mockResolvedValue(
      makeSession({ id: 'admin-1', role: 'ADMIN' }) as unknown as Awaited<
        ReturnType<typeof getServerSession>
      >
    )
    getDb().payment.findUnique.mockResolvedValue({ ...mockPayment, userId: 'user-1' })

    const res = await getPaymentById(makeGetByIdRequest('pay-1'), { params: { id: 'pay-1' } })
    expect(res.status).toBe(200)
  })
})

// ---- POST /api/payments/mpesa-callback ----

describe('POST /api/payments/mpesa-callback', () => {
  beforeEach(() => jest.clearAllMocks())

  const successPayload = {
    Body: {
      stkCallback: {
        MerchantRequestID: 'mreq-1',
        CheckoutRequestID: 'ckReq-abc123',
        ResultCode: 0,
        ResultDesc: 'The service request is processed successfully.',
        CallbackMetadata: {
          Item: [
            { Name: 'MpesaReceiptNumber', Value: 'LHG31AA5TX' },
            { Name: 'TransactionDate', Value: 20260101123000 },
            { Name: 'PhoneNumber', Value: 254712345678 },
          ],
        },
      },
    },
  }

  const failPayload = {
    Body: {
      stkCallback: {
        MerchantRequestID: 'mreq-2',
        CheckoutRequestID: 'ckReq-fail',
        ResultCode: 1032,
        ResultDesc: 'Request cancelled by user',
      },
    },
  }

  test('returns 400 for invalid JSON', async () => {
    const req = new NextRequest('http://localhost/api/payments/mpesa-callback', {
      method: 'POST',
      body: 'bad',
    })
    const res = await mpesaCallback(req)
    expect(res.status).toBe(400)
  })

  test('returns 400 when stkCallback is missing', async () => {
    const res = await mpesaCallback(makeCallbackRequest({ Body: {} }))
    expect(res.status).toBe(400)
  })

  test('returns 200 even when no matching payment found', async () => {
    getDb().payment.findFirst.mockResolvedValue(null)
    const res = await mpesaCallback(makeCallbackRequest(successPayload))
    expect(res.status).toBe(200)
  })

  test('marks payment as SUCCESS on ResultCode 0', async () => {
    const pendingPayment = {
      ...mockPayment,
      description: 'Path fee | ckReq:ckReq-abc123',
    }
    getDb().payment.findFirst.mockResolvedValue(pendingPayment)
    getDb().payment.update.mockResolvedValue({ ...pendingPayment, status: 'SUCCESS' })

    const res = await mpesaCallback(makeCallbackRequest(successPayload))
    expect(res.status).toBe(200)

    expect(getDb().payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'pay-1' },
        data: expect.objectContaining({
          status: 'SUCCESS',
          mpesaReceiptNumber: 'LHG31AA5TX',
        }),
      })
    )
  })

  test('marks payment as FAILED on non-zero ResultCode', async () => {
    const pendingPayment = {
      ...mockPayment,
      description: 'Path fee | ckReq:ckReq-fail',
    }
    getDb().payment.findFirst.mockResolvedValue(pendingPayment)
    getDb().payment.update.mockResolvedValue({ ...pendingPayment, status: 'FAILED' })

    const res = await mpesaCallback(makeCallbackRequest(failPayload))
    expect(res.status).toBe(200)

    expect(getDb().payment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'FAILED' }),
      })
    )
  })
})
