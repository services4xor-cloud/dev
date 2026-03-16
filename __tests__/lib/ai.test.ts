/**
 * Tests for lib/ai.ts — AI agent persona builder (enriched with COUNTRY_OPTIONS)
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
          code: 'KE',
          label: 'Kenya',
          connections: [{ relation: 'OFFICIAL_LANG', target: 'Swahili', targetType: 'LANGUAGE' }],
          enriched: {
            topSectors: ['Agriculture and Tea Export', 'Technology and M-Pesa'],
            visa: 'N/A (home country)',
            payment: ['M-Pesa', 'Airtel Money'],
            currency: 'KES',
          },
        },
        {
          type: 'LANGUAGE',
          code: 'sw',
          label: 'Swahili',
          connections: [],
          enriched: {
            nativeName: 'Kiswahili',
            countriesCount: 6,
          },
        },
      ])

      const prompt = await buildPersonaPrompt({ country: 'KE', language: 'sw' })

      expect(typeof prompt).toBe('string')
      expect(prompt).toContain('Route Advisor')
      expect(prompt).toContain('COUNTRY: Kenya')
      expect(prompt).toContain('LANGUAGE: Swahili')
      // Enriched data should be in the prompt
      expect(prompt).toContain('Technology and M-Pesa')
      expect(prompt).toContain('M-Pesa')
      expect(prompt).toContain('Kiswahili')
    })

    test('filters out empty dimension values before calling buildAgentContext', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([
        {
          type: 'COUNTRY',
          code: 'DE',
          label: 'Germany',
          connections: [],
        },
      ])

      await buildPersonaPrompt({ country: 'DE', language: undefined, faith: '' })

      // Only non-empty values should be passed
      expect(buildAgentContext).toHaveBeenCalledWith({ country: 'DE' })
    })

    test('includes behavior rules in the prompt', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([])

      const prompt = await buildPersonaPrompt({})

      expect(prompt).toContain('Your behavior')
      expect(prompt).toContain('culturally aware')
      expect(prompt).toContain('Never make up statistics')
      expect(prompt).toContain('Be[X] vocabulary')
    })

    test('handles empty context gracefully', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([])

      const prompt = await buildPersonaPrompt({ country: 'ZZ' })

      expect(typeof prompt).toBe('string')
      expect(prompt).toContain('Route Advisor')
    })

    test('groups connections by relation type', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([
        {
          type: 'FAITH',
          code: 'islam',
          label: 'Islam',
          connections: [
            { relation: 'DOMINANT_FAITH', target: 'Kenya', targetType: 'COUNTRY' },
            { relation: 'DOMINANT_FAITH', target: 'Morocco', targetType: 'COUNTRY' },
          ],
        },
      ])

      const prompt = await buildPersonaPrompt({ faith: 'islam' })

      expect(prompt).toContain('FAITH: Islam')
      expect(prompt).toContain('DOMINANT_FAITH: Kenya, Morocco')
    })

    test('includes visa and payment info for country dimensions', async () => {
      const { buildAgentContext } = require('@/lib/graph')
      buildAgentContext.mockResolvedValue([
        {
          type: 'COUNTRY',
          code: 'DE',
          label: 'Germany',
          connections: [],
          enriched: {
            topSectors: ['Automotive Manufacturing', 'Mechanical Engineering'],
            visa: 'Schengen visa required',
            payment: ['SEPA', 'PayPal', 'Apple Pay'],
            currency: 'EUR',
            corridorStrength: 'direct',
            languages: [
              { code: 'de', name: 'German', nativeName: 'Deutsch' },
              { code: 'en', name: 'English', nativeName: 'English' },
            ],
          },
        },
      ])

      const prompt = await buildPersonaPrompt({ country: 'DE' })

      expect(prompt).toContain('Schengen visa required')
      expect(prompt).toContain('Apple Pay')
      expect(prompt).toContain('Automotive Manufacturing')
      expect(prompt).toContain('Corridor strength: direct')
      expect(prompt).toContain('German (Deutsch)')
    })
  })
})
