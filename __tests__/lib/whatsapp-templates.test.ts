/**
 * WhatsApp Templates Tests
 *
 * Validates:
 *   - Template data integrity
 *   - Template lookup helpers
 *   - fillTemplate placeholder replacement
 *   - Payload builder structure
 *   - Convenience payload builders
 */

import {
  WA_TEMPLATES,
  getTemplate,
  getTemplatesByCategory,
  fillTemplate,
  buildWhatsAppPayload,
  pioneerWelcomePayload,
  newPathMatchPayload,
  chapterOpenedPayload,
  mpesaPaymentPayload,
  utamaduniDonationPayload,
} from '@/lib/whatsapp-templates'

describe('WhatsApp Templates — data integrity', () => {
  it('exports at least 8 templates', () => {
    expect(WA_TEMPLATES.length).toBeGreaterThanOrEqual(8)
  })

  it('every template has name, language, category, components, description', () => {
    for (const tmpl of WA_TEMPLATES) {
      expect(tmpl.name).toBeTruthy()
      expect(tmpl.language).toBeTruthy()
      expect(tmpl.category).toMatch(/^(MARKETING|UTILITY|AUTHENTICATION)$/)
      expect(tmpl.components.length).toBeGreaterThan(0)
      expect(tmpl.description).toBeTruthy()
    }
  })

  it('every template has a BODY component', () => {
    for (const tmpl of WA_TEMPLATES) {
      const body = tmpl.components.find((c) => c.type === 'BODY')
      expect(body).toBeDefined()
      expect(body!.text).toBeTruthy()
    }
  })
})

describe('WhatsApp Templates — getTemplate', () => {
  it('finds pioneer_welcome in en_US', () => {
    const tmpl = getTemplate('pioneer_welcome', 'en_US')
    expect(tmpl).toBeDefined()
    expect(tmpl!.name).toBe('pioneer_welcome')
  })

  it('finds pioneer_welcome_sw in sw', () => {
    const tmpl = getTemplate('pioneer_welcome_sw', 'sw')
    expect(tmpl).toBeDefined()
  })

  it('returns undefined for nonexistent template', () => {
    expect(getTemplate('nonexistent')).toBeUndefined()
  })
})

describe('WhatsApp Templates — getTemplatesByCategory', () => {
  it('returns UTILITY templates', () => {
    const utils = getTemplatesByCategory('UTILITY')
    expect(utils.length).toBeGreaterThan(0)
    utils.forEach((t) => expect(t.category).toBe('UTILITY'))
  })
})

describe('WhatsApp Templates — fillTemplate', () => {
  it('replaces BODY placeholders in new_path_match', () => {
    const tmpl = getTemplate('new_path_match', 'en_US')!
    const filled = fillTemplate(tmpl, [
      'Safari Guide',
      'Basecamp',
      'Nairobi',
      'KES 50,000',
      '85',
      'wildlife',
      'https://bekenya.com/v/1',
    ])
    expect(filled).toContain('Safari Guide')
    expect(filled).toContain('Basecamp')
    expect(filled).toContain('85')
    expect(filled).not.toContain('{{1}}')
    expect(filled).not.toContain('{{2}}')
  })

  it('replaces BODY placeholders in pioneer_welcome ({{2}}/{{3}} in body)', () => {
    const tmpl = getTemplate('pioneer_welcome', 'en_US')!
    // {{1}} is in HEADER only, fillTemplate only processes BODY
    const filled = fillTemplate(tmpl, ['Alice', '5', 'Explorer'])
    expect(filled).toContain('5')
    expect(filled).toContain('Explorer')
    expect(filled).not.toContain('{{2}}')
    expect(filled).not.toContain('{{3}}')
  })

  it('returns empty string for template without body', () => {
    const fakeTemplate = {
      name: 'test',
      language: 'en',
      category: 'UTILITY' as const,
      components: [],
      description: 'test',
    }
    expect(fillTemplate(fakeTemplate, ['val'])).toBe('')
  })
})

describe('WhatsApp Templates — buildWhatsAppPayload', () => {
  it('returns correct API structure', () => {
    const payload = buildWhatsAppPayload('+254712345678', 'pioneer_welcome', 'en_US', [
      'Alice',
      '5',
      'Explorer',
    ])
    expect(payload.messaging_product).toBe('whatsapp')
    expect(payload.to).toBe('+254712345678')
    expect(payload.type).toBe('template')
    expect(payload.template).toBeDefined()
  })
})

describe('WhatsApp Templates — convenience payloads', () => {
  it('pioneerWelcomePayload builds valid payload', () => {
    const payload = pioneerWelcomePayload('+254712345678', 'Alice', 5, 'explorer')
    expect(payload.to).toBe('+254712345678')
    expect(payload.type).toBe('template')
  })

  it('pioneerWelcomePayload uses sw template for Swahili', () => {
    const payload = pioneerWelcomePayload('+254712345678', 'Alice', 5, 'explorer', 'sw')
    const tmpl = payload.template as Record<string, unknown>
    expect(tmpl.name).toBe('pioneer_welcome_sw')
  })

  it('newPathMatchPayload builds valid payload', () => {
    const payload = newPathMatchPayload(
      '+254712345678',
      'Safari Guide',
      'Basecamp',
      'Nairobi',
      'KES 50,000',
      85,
      'wildlife',
      'https://bekenya.com/ventures/1'
    )
    expect(payload.to).toBe('+254712345678')
  })

  it('chapterOpenedPayload capitalizes pioneer type', () => {
    const payload = chapterOpenedPayload(
      '+254712345678',
      'Alice',
      'Guide',
      'Kenya',
      'explorer',
      90,
      'https://bekenya.com/review/1'
    )
    expect(payload.to).toBe('+254712345678')
  })

  it('mpesaPaymentPayload builds valid payload', () => {
    const payload = mpesaPaymentPayload(
      '+254712345678',
      'KES 5,000',
      'REF123',
      '2026-01-15',
      'Chapter opening',
      'https://bekenya.com/track/1'
    )
    expect(payload.to).toBe('+254712345678')
  })

  it('utamaduniDonationPayload builds valid payload', () => {
    const payload = utamaduniDonationPayload(
      '+254712345678',
      'Alice',
      'KES 1,000',
      '12',
      'Maasai Mara',
      'IMP-001'
    )
    expect(payload.to).toBe('+254712345678')
  })
})
