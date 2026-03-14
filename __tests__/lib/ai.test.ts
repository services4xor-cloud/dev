/**
 * Tests for lib/ai.ts — AI agent persona builder
 */
import { buildPersonaPrompt } from '@/lib/ai'

// Mock Anthropic SDK before any imports
jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      messages: {
        create: jest.fn(),
        stream: jest.fn(),
      },
    })),
  }
})

// Mock the graph module
jest.mock('@/lib/graph', () => ({
  buildAgentContext: jest.fn(),
}))

describe('AI agent', () => {
  beforeEach(() => jest.clearAllMocks())

  describe('buildPersonaPrompt', () => {
    test('returns a prompt string with dimension info', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([
        {
          type: 'COUNTRY',
          label: 'Kenya',
          connections: [{ relation: 'OFFICIAL_LANG', target: 'Swahili' }],
        },
        {
          type: 'LANGUAGE',
          label: 'Swahili',
          connections: [],
        },
      ])

      const prompt = await buildPersonaPrompt({ country: 'KE', language: 'sw' })

      expect(typeof prompt).toBe('string')
      expect(prompt).toContain('Be[X] agent')
      expect(prompt).toContain('COUNTRY: Kenya')
      expect(prompt).toContain('LANGUAGE: Swahili')
      expect(prompt).toContain('Swahili (OFFICIAL_LANG)')
    })

    test('filters out empty dimension values before calling buildAgentContext', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([
        {
          type: 'COUNTRY',
          label: 'Germany',
          connections: [],
        },
      ])

      await buildPersonaPrompt({ country: 'DE', language: undefined, faith: '' })

      // Only non-empty values should be passed
      expect(buildAgentContext).toHaveBeenCalledWith({ country: 'DE' })
    })

    test('includes rules in the prompt', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([])

      const prompt = await buildPersonaPrompt({})

      expect(prompt).toContain('Rules:')
      expect(prompt).toContain('culturally aware')
      expect(prompt).toContain('Never make up statistics')
    })

    test('handles empty context gracefully', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([])

      const prompt = await buildPersonaPrompt({ country: 'ZZ' })

      expect(typeof prompt).toBe('string')
      expect(prompt).toContain('Be[X] agent')
    })

    test('includes Connected to line when connections exist', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([
        {
          type: 'FAITH',
          label: 'Islam',
          connections: [
            { relation: 'DOMINANT_FAITH', target: 'Kenya' },
            { relation: 'DOMINANT_FAITH', target: 'Morocco' },
          ],
        },
      ])

      const prompt = await buildPersonaPrompt({ faith: 'islam' })

      expect(prompt).toContain('FAITH: Islam')
      expect(prompt).toContain('Connected to:')
      expect(prompt).toContain('Kenya (DOMINANT_FAITH)')
      expect(prompt).toContain('Morocco (DOMINANT_FAITH)')
    })
  })
})
