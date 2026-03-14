/**
 * Tests for lib/graph.ts — the graph query engine
 */
import { getNode, filterCountries, createEdge, getUserEdges, buildAgentContext } from '@/lib/graph'

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

  describe('createEdge', () => {
    test('returns null when from node not found', async () => {
      const { db } = require('@/lib/db')
      db.node.findUnique.mockResolvedValue(null)

      const result = await createEdge('COUNTRY', 'XX', 'LANGUAGE', 'sw', 'OFFICIAL_LANG')
      expect(result).toBeNull()
      expect(db.edge.upsert).not.toHaveBeenCalled()
    })

    test('returns null when to node not found', async () => {
      const { db } = require('@/lib/db')
      // First call (from node) returns a node, second call (to node) returns null
      db.node.findUnique
        .mockResolvedValueOnce({ id: 'node-1', type: 'COUNTRY', code: 'KE', label: 'Kenya' })
        .mockResolvedValueOnce(null)

      const result = await createEdge('COUNTRY', 'KE', 'LANGUAGE', 'xx', 'OFFICIAL_LANG')
      expect(result).toBeNull()
      expect(db.edge.upsert).not.toHaveBeenCalled()
    })

    test('upserts edge when both nodes exist', async () => {
      const { db } = require('@/lib/db')
      const fromNode = { id: 'node-ke', type: 'COUNTRY', code: 'KE', label: 'Kenya' }
      const toNode = { id: 'node-sw', type: 'LANGUAGE', code: 'sw', label: 'Swahili' }
      const upsertedEdge = {
        id: 'edge-1',
        fromId: 'node-ke',
        toId: 'node-sw',
        relation: 'OFFICIAL_LANG',
        weight: 1.0,
      }

      db.node.findUnique.mockResolvedValueOnce(fromNode).mockResolvedValueOnce(toNode)
      db.edge.upsert.mockResolvedValue(upsertedEdge)

      const result = await createEdge('COUNTRY', 'KE', 'LANGUAGE', 'sw', 'OFFICIAL_LANG', 1.0)

      expect(db.edge.upsert).toHaveBeenCalledWith({
        where: {
          fromId_toId_relation: {
            fromId: 'node-ke',
            toId: 'node-sw',
            relation: 'OFFICIAL_LANG',
          },
        },
        create: {
          fromId: 'node-ke',
          toId: 'node-sw',
          relation: 'OFFICIAL_LANG',
          weight: 1.0,
          properties: undefined,
        },
        update: { weight: 1.0, properties: undefined },
      })
      expect(result).toEqual(upsertedEdge)
    })

    test('passes properties when provided', async () => {
      const { db } = require('@/lib/db')
      const fromNode = { id: 'node-ke', type: 'COUNTRY', code: 'KE', label: 'Kenya' }
      const toNode = { id: 'node-sw', type: 'LANGUAGE', code: 'sw', label: 'Swahili' }
      db.node.findUnique.mockResolvedValueOnce(fromNode).mockResolvedValueOnce(toNode)
      db.edge.upsert.mockResolvedValue({ id: 'edge-2', fromId: 'node-ke', toId: 'node-sw' })

      const props = { source: 'official', year: 1963 }
      await createEdge('COUNTRY', 'KE', 'LANGUAGE', 'sw', 'OFFICIAL_LANG', undefined, props)

      expect(db.edge.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          create: expect.objectContaining({ properties: props }),
          update: expect.objectContaining({ properties: props }),
        })
      )
    })
  })

  describe('getUserEdges', () => {
    test('returns empty array when user node not found', async () => {
      const { db } = require('@/lib/db')
      db.node.findUnique.mockResolvedValue(null)

      const result = await getUserEdges('user-unknown')
      expect(result).toEqual([])
      expect(db.edge.findMany).not.toHaveBeenCalled()
    })

    test('returns edges for existing user node', async () => {
      const { db } = require('@/lib/db')
      const userNode = { id: 'node-user-1', type: 'PERSON', code: 'user-1', userId: 'user-1' }
      const edges = [
        {
          id: 'e1',
          fromId: 'node-user-1',
          toId: 'node-ke',
          relation: 'LIVES_IN',
          to: { id: 'node-ke', code: 'KE', label: 'Kenya' },
        },
      ]

      db.node.findUnique.mockResolvedValue(userNode)
      db.edge.findMany.mockResolvedValue(edges)

      const result = await getUserEdges('user-1')

      expect(db.node.findUnique).toHaveBeenCalledWith({ where: { userId: 'user-1' } })
      expect(db.edge.findMany).toHaveBeenCalledWith({
        where: { fromId: 'node-user-1' },
        include: { to: true },
      })
      expect(result).toEqual(edges)
    })

    test('filters by relation when provided', async () => {
      const { db } = require('@/lib/db')
      const userNode = { id: 'node-user-1', type: 'PERSON', code: 'user-1', userId: 'user-1' }
      db.node.findUnique.mockResolvedValue(userNode)
      db.edge.findMany.mockResolvedValue([])

      await getUserEdges('user-1', 'OFFICIAL_LANG')

      expect(db.edge.findMany).toHaveBeenCalledWith({
        where: { fromId: 'node-user-1', relation: 'OFFICIAL_LANG' },
        include: { to: true },
      })
    })
  })

  describe('buildAgentContext', () => {
    test('returns empty array for empty dimensions', async () => {
      const result = await buildAgentContext({})
      expect(result).toEqual([])
    })

    test('returns context shape for matching dimensions', async () => {
      const { db } = require('@/lib/db')
      const nodeWithEdges = {
        id: 'node-ke',
        type: 'COUNTRY',
        code: 'KE',
        label: 'Kenya',
        properties: { population: 55000000 },
        outEdges: [
          {
            id: 'e1',
            relation: 'OFFICIAL_LANG',
            to: { id: 'node-sw', type: 'LANGUAGE', label: 'Swahili' },
          },
        ],
        inEdges: [],
      }

      db.node.findUnique.mockResolvedValue(nodeWithEdges)

      const result = await buildAgentContext({ country: 'KE' })

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        type: 'COUNTRY',
        code: 'KE',
        label: 'Kenya',
        properties: { population: 55000000 },
        connections: [{ relation: 'OFFICIAL_LANG', target: 'Swahili', targetType: 'LANGUAGE' }],
      })
    })

    test('skips dimensions with no matching node', async () => {
      const { db } = require('@/lib/db')
      // First dimension found, second not found
      db.node.findUnique
        .mockResolvedValueOnce({
          id: 'node-ke',
          type: 'COUNTRY',
          code: 'KE',
          label: 'Kenya',
          properties: null,
          outEdges: [],
          inEdges: [],
        })
        .mockResolvedValueOnce(null)

      const result = await buildAgentContext({ country: 'KE', language: 'xx' })

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({ code: 'KE' })
    })
  })
})
