/**
 * lib/email.ts — Unit tests for email template system
 *
 * Tests template rendering, sendEmail logic, and convenience wrappers.
 * No real API calls — RESEND_API_KEY is not set in test env.
 */

import {
  sendEmail,
  sendPioneerWelcome,
  sendPasswordReset,
  sendDonationReceipt,
  EMAIL_TEMPLATES,
  type EmailTemplate,
} from '@/lib/email'

// Ensure mock fallback is used — no real Resend API calls
const originalResendKey = process.env.RESEND_API_KEY
beforeAll(() => {
  delete process.env.RESEND_API_KEY
})
afterAll(() => {
  if (originalResendKey) process.env.RESEND_API_KEY = originalResendKey
})

describe('EMAIL_TEMPLATES', () => {
  const allTemplates: EmailTemplate[] = [
    'pioneer_welcome',
    'chapter_opened',
    'chapter_status_update',
    'safari_booking_confirmation',
    'new_path_match',
    'anchor_new_chapter',
    'weekly_digest',
    'password_reset',
    'utamaduni_donation_receipt',
  ]

  it('has 9 registered templates', () => {
    expect(Object.keys(EMAIL_TEMPLATES)).toHaveLength(9)
  })

  it.each(allTemplates)('template "%s" returns subject and html', (template) => {
    const fn = EMAIL_TEMPLATES[template]
    const result = fn({ name: 'Test', email: 'test@example.com' })
    expect(result.subject).toBeTruthy()
    expect(result.html).toContain('<!DOCTYPE html>')
    expect(result.html).toContain('BeKenya')
  })

  it('pioneer_welcome includes the pioneer name in subject', () => {
    const { subject } = EMAIL_TEMPLATES.pioneer_welcome({ name: 'Alice' })
    expect(subject).toContain('Alice')
  })

  it('chapter_opened includes path title in subject', () => {
    const { subject } = EMAIL_TEMPLATES.chapter_opened({ pathTitle: 'Safari Guide' })
    expect(subject).toContain('Safari Guide')
  })

  it('chapter_status_update renders accepted badge for accepted status', () => {
    const { html } = EMAIL_TEMPLATES.chapter_status_update({
      status: 'accepted',
      pioneerName: 'Bob',
    })
    expect(html).toContain('Accepted!')
    expect(html).toContain('Congratulations')
  })

  it('safari_booking_confirmation includes booking details', () => {
    const { html, subject } = EMAIL_TEMPLATES.safari_booking_confirmation({
      packageName: 'Masai Mara 3-Day',
      bookingRef: 'BK-001',
      guestName: 'Jane',
    })
    expect(subject).toContain('Masai Mara 3-Day')
    expect(html).toContain('BK-001')
    expect(html).toContain('Jane')
  })

  it('password_reset includes reset link', () => {
    const { html } = EMAIL_TEMPLATES.password_reset({
      email: 'user@test.com',
      resetUrl: 'https://bekenya.com/auth/reset?token=abc123',
    })
    expect(html).toContain('token=abc123')
    expect(html).toContain('1 hour')
  })

  it('utamaduni_donation_receipt includes donor details', () => {
    const { html, subject } = EMAIL_TEMPLATES.utamaduni_donation_receipt({
      donorName: 'Grace',
      amount: 'KES 5,000',
      receiptRef: 'UTM-12345',
    })
    expect(subject).toContain('UTM-12345')
    expect(html).toContain('Grace')
    expect(html).toContain('KES 5,000')
  })
})

describe('sendEmail', () => {
  it('returns mock result when RESEND_API_KEY is not set', async () => {
    const result = await sendEmail('test@example.com', 'pioneer_welcome', {
      name: 'Test Pioneer',
    })
    expect(result.success).toBe(true)
    expect(result.mock).toBe(true)
    expect(result.id).toMatch(/^mock-/)
  })

  it('returns error for unknown template', async () => {
    const result = await sendEmail('test@example.com', 'nonexistent_template' as EmailTemplate, {})
    expect(result.success).toBe(false)
    expect(result.error).toContain('Unknown template')
  })
})

describe('Convenience wrappers', () => {
  it('sendPioneerWelcome returns mock success', async () => {
    const result = await sendPioneerWelcome('alice@test.com', 'Alice', 5, 'Dreamer')
    expect(result.success).toBe(true)
    expect(result.mock).toBe(true)
  })

  it('sendPasswordReset returns mock success', async () => {
    const result = await sendPasswordReset('user@test.com', 'reset-token-123')
    expect(result.success).toBe(true)
    expect(result.mock).toBe(true)
  })

  it('sendDonationReceipt returns mock success', async () => {
    const result = await sendDonationReceipt(
      'donor@test.com',
      'Grace',
      'KES 5,000',
      'M-Pesa',
      'REC123',
      '10',
      'Nairobi'
    )
    expect(result.success).toBe(true)
    expect(result.mock).toBe(true)
  })
})
