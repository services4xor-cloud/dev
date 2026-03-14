/**
 * Tests for lib/graph.ts — the graph query engine
 */
import { getNode, filterCountries } from '@/lib/graph'

jest.mock('@/lib/db', () => ({
  db: {
    node: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    edge: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}))

describe('Graph queries', () => {
  beforeEach(() => jest.clearAllMocks())

  test('getNode returns node by type+code', async () => {
    const { db } = require('@/lib/db')
    db.node.findUnique.mockResolvedValue({
      id: '1',
      type: 'COUNTRY',
      code: 'KE',
      label: 'Kenya',
    })

    const node = await getNode('COUNTRY', 'KE')
    expect(node?.code).toBe('KE')
    expect(db.node.findUnique).toHaveBeenCalledWith({
      where: { type_code: { type: 'COUNTRY', code: 'KE' } },
    })
  })

  test('getNode returns null for non-existent node', async () => {
    const { db } = require('@/lib/db')
    db.node.findUnique.mockResolvedValue(null)

    const node = await getNode('COUNTRY', 'XX')
    expect(node).toBeNull()
  })

  test('filterCountries with no filters returns all countries', async () => {
    const { db } = require('@/lib/db')
    db.node.findMany.mockResolvedValue([
      { id: '1', type: 'COUNTRY', code: 'KE' },
      { id: '2', type: 'COUNTRY', code: 'DE' },
    ])

    const countries = await filterCountries([])
    expect(countries).toHaveLength(2)
    expect(db.node.findMany).toHaveBeenCalledWith({
      where: { type: 'COUNTRY', active: true },
    })
  })
})
