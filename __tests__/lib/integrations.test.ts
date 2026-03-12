/**
 * Integrations Tests
 *
 * Validates:
 *   - Integration status returns all 4 services
 *   - N8N webhook constants
 *   - Integration config structure
 */

import { getIntegrationStatus, N8N_WEBHOOKS } from '@/lib/integrations'

describe('Integrations — getIntegrationStatus', () => {
  it('returns 4 integration statuses', () => {
    const statuses = getIntegrationStatus()
    expect(statuses).toHaveLength(4)
  })

  it('includes OpenClaw, n8n, WhatsApp Business, Resend', () => {
    const statuses = getIntegrationStatus()
    const names = statuses.map((s) => s.name)
    expect(names).toContain('OpenClaw')
    expect(names).toContain('n8n')
    expect(names).toContain('WhatsApp Business')
    expect(names).toContain('Resend')
  })

  it('every status has name, enabled (bool), envVars, description, docsUrl', () => {
    const statuses = getIntegrationStatus()
    for (const s of statuses) {
      expect(s.name).toBeTruthy()
      expect(typeof s.enabled).toBe('boolean')
      expect(s.envVars.length).toBeGreaterThan(0)
      expect(s.description).toBeTruthy()
      expect(s.docsUrl).toMatch(/^https?:\/\//)
    }
  })

  it('returns disabled when env vars not set', () => {
    const statuses = getIntegrationStatus()
    // In test environment, no env vars are set
    for (const s of statuses) {
      if (s.name !== 'Resend') {
        // Resend might be set in CI
        expect(s.enabled).toBe(false)
      }
    }
  })
})

describe('Integrations — N8N_WEBHOOKS', () => {
  it('exports webhook constants', () => {
    expect(N8N_WEBHOOKS.PATH_CREATED).toBe('path-created')
    expect(N8N_WEBHOOKS.CHAPTER_OPENED).toBe('chapter-opened')
    expect(N8N_WEBHOOKS.PLACEMENT_CONFIRMED).toBe('placement-confirmed')
    expect(N8N_WEBHOOKS.AGENT_FORWARD).toBe('agent-forward')
  })
})
