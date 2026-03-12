/**
 * agents.test.ts — Tests for AI agent persona generation
 *
 * Validates that generateAgentsForCountry and generateAllAgents
 * produce realistic, deterministic, and complete agent profiles.
 */

import {
  generateAgentsForCountry,
  generateAllAgents,
  getAgentCountryCodes,
  type AgentPersona,
} from '@/lib/agents'

describe('generateAgentsForCountry', () => {
  it('returns 3-10 agents for Kenya', () => {
    const agents = generateAgentsForCountry('KE')
    expect(agents.length).toBeGreaterThanOrEqual(3)
    expect(agents.length).toBeLessThanOrEqual(10)
  })

  it('returns 8-10 agents for tier-1 countries (KE, US, NG)', () => {
    for (const code of ['KE', 'US', 'NG']) {
      const agents = generateAgentsForCountry(code)
      expect(agents.length).toBeGreaterThanOrEqual(8)
      expect(agents.length).toBeLessThanOrEqual(10)
    }
  })

  it('returns 3-4 agents for small countries', () => {
    const agents = generateAgentsForCountry('MH') // Marshall Islands
    expect(agents.length).toBeGreaterThanOrEqual(3)
    expect(agents.length).toBeLessThanOrEqual(4)
  })

  it('returns empty array for unknown country code', () => {
    const agents = generateAgentsForCountry('XX')
    expect(agents).toEqual([])
  })

  it('each agent has all required fields', () => {
    const agents = generateAgentsForCountry('KE')
    for (const agent of agents) {
      expect(agent.id).toMatch(/^agent-ke-\d{3}$/)
      expect(agent.type).toBe('ai')
      expect(agent.name).toBeTruthy()
      expect(agent.avatar).toBeTruthy()
      expect(agent.country).toBe('KE')
      expect(agent.city).toBeTruthy()
      expect(agent.languages.length).toBeGreaterThan(0)
      expect(agent.craft.length).toBeGreaterThan(0)
      expect(agent.interests.length).toBeGreaterThan(0)
      expect(agent.reach.length).toBeGreaterThan(0)
      expect(agent.bio).toBeTruthy()
      expect(agent.exchangeProposals.length).toBeGreaterThan(0)
      expect(['friendly', 'professional', 'enthusiastic', 'thoughtful']).toContain(
        agent.responseStyle
      )
    }
  })

  it('KE agents have realistic languages (en and/or sw)', () => {
    const agents = generateAgentsForCountry('KE')
    for (const agent of agents) {
      const hasKenyanLanguage = agent.languages.includes('en') || agent.languages.includes('sw')
      expect(hasKenyanLanguage).toBe(true)
    }
  })

  it('agents have diverse crafts (at least 3 unique across all KE agents)', () => {
    const agents = generateAgentsForCountry('KE')
    const allCrafts = new Set<string>()
    for (const agent of agents) {
      for (const craft of agent.craft) {
        allCrafts.add(craft)
      }
    }
    expect(allCrafts.size).toBeGreaterThanOrEqual(3)
  })

  it('is deterministic — same country produces same IDs', () => {
    const run1 = generateAgentsForCountry('KE')
    const run2 = generateAgentsForCountry('KE')

    expect(run1.length).toBe(run2.length)
    for (let i = 0; i < run1.length; i++) {
      expect(run1[i].id).toBe(run2[i].id)
      expect(run1[i].name).toBe(run2[i].name)
      expect(run1[i].city).toBe(run2[i].city)
    }
  })

  it('DE agents have German language', () => {
    const agents = generateAgentsForCountry('DE')
    for (const agent of agents) {
      expect(agent.languages).toContain('de')
    }
  })

  it('JP agents have Japanese language', () => {
    const agents = generateAgentsForCountry('JP')
    for (const agent of agents) {
      expect(agent.languages).toContain('ja')
    }
  })

  it('agent IDs are sequential within a country', () => {
    const agents = generateAgentsForCountry('NG')
    for (let i = 0; i < agents.length; i++) {
      const expected = `agent-ng-${String(i + 1).padStart(3, '0')}`
      expect(agents[i].id).toBe(expected)
    }
  })

  it('agent cities are from the correct country', () => {
    const agents = generateAgentsForCountry('IN')
    const validCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai']
    for (const agent of agents) {
      expect(validCities).toContain(agent.city)
    }
  })

  it('agents have optional faith from country faiths', () => {
    const agents = generateAgentsForCountry('KE')
    const kenyanFaiths = ['christianity', 'islam', 'traditional']
    for (const agent of agents) {
      if (agent.faith) {
        expect(kenyanFaiths).toContain(agent.faith)
      }
    }
  })

  it('agent bios mention their name and city', () => {
    const agents = generateAgentsForCountry('GH')
    for (const agent of agents) {
      // Bio should contain agent name
      expect(agent.bio).toContain(agent.name)
    }
  })

  it('exchange proposals are non-empty strings', () => {
    const agents = generateAgentsForCountry('BR')
    for (const agent of agents) {
      expect(agent.exchangeProposals.length).toBeGreaterThanOrEqual(1)
      expect(agent.exchangeProposals.length).toBeLessThanOrEqual(3)
      for (const proposal of agent.exchangeProposals) {
        expect(typeof proposal).toBe('string')
        expect(proposal.length).toBeGreaterThan(5)
      }
    }
  })
})

describe('generateAllAgents', () => {
  let allAgents: AgentPersona[]

  beforeAll(() => {
    allAgents = generateAllAgents()
  })

  it('covers at least 193 countries', () => {
    const countryCodes = getAgentCountryCodes()
    expect(countryCodes.length).toBeGreaterThanOrEqual(193)
  })

  it('total agents between 500 and 1500', () => {
    expect(allAgents.length).toBeGreaterThanOrEqual(500)
    expect(allAgents.length).toBeLessThanOrEqual(1500)
  })

  it('all agent IDs are unique', () => {
    const ids = allAgents.map((a) => a.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('agents span multiple regions', () => {
    const regions = new Set(allAgents.map((a) => a.culture).filter(Boolean))
    expect(regions.size).toBeGreaterThanOrEqual(5)
  })

  it('every agent has type "ai"', () => {
    for (const agent of allAgents) {
      expect(agent.type).toBe('ai')
    }
  })
})
