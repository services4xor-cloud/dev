jest.mock('@/lib/db', () => ({
  db: {
    user: { findUnique: jest.fn(), update: jest.fn() },
    node: { findUnique: jest.fn(), findMany: jest.fn() },
    payment: { findMany: jest.fn(), aggregate: jest.fn() },
  },
}))

import { userService, nodeService, paymentService } from '@/services/prisma-services'

function getDb() {
  return require('@/lib/db').db
}

describe('userService', () => {
  beforeEach(() => jest.clearAllMocks())

  test('findById returns user', async () => {
    const db = getDb()
    db.user.findUnique.mockResolvedValue({
      id: 'u1',
      name: 'Test',
      email: 'test@test.com',
      role: 'EXPLORER',
    })
    const result = await userService.findById('u1')
    expect(result).toEqual({ id: 'u1', name: 'Test', email: 'test@test.com', role: 'EXPLORER' })
  })

  test('findById returns null for missing user', async () => {
    const db = getDb()
    db.user.findUnique.mockResolvedValue(null)
    const result = await userService.findById('missing')
    expect(result).toBeNull()
  })

  test('updateRole calls prisma update', async () => {
    const db = getDb()
    db.user.update.mockResolvedValue({})
    await userService.updateRole('u1', 'HOST')
    expect(db.user.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'u1' },
      })
    )
  })
})

describe('nodeService', () => {
  beforeEach(() => jest.clearAllMocks())

  test('findByTypeAndCode returns node', async () => {
    const db = getDb()
    const mockNode = { id: 'n1', type: 'COUNTRY', code: 'KE', label: 'Kenya', icon: '🇰🇪' }
    db.node.findUnique.mockResolvedValue(mockNode)
    const result = await nodeService.findByTypeAndCode('COUNTRY', 'KE')
    expect(result).toEqual(mockNode)
  })

  test('listByType returns nodes', async () => {
    const db = getDb()
    db.node.findMany.mockResolvedValue([
      { id: 'n1', type: 'LANGUAGE', code: 'en', label: 'English', icon: null },
    ])
    const result = await nodeService.listByType('LANGUAGE')
    expect(result).toHaveLength(1)
  })
})

describe('paymentService', () => {
  beforeEach(() => jest.clearAllMocks())

  test('sumSuccessful returns sum', async () => {
    const db = getDb()
    db.payment.aggregate.mockResolvedValue({ _sum: { amount: 5000 } })
    const result = await paymentService.sumSuccessful('u1')
    expect(result).toBe(5000)
  })

  test('sumSuccessful returns 0 when no payments', async () => {
    const db = getDb()
    db.payment.aggregate.mockResolvedValue({ _sum: { amount: null } })
    const result = await paymentService.sumSuccessful('u1')
    expect(result).toBe(0)
  })
})
