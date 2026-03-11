import { NextResponse } from 'next/server'
import { z } from 'zod'

const RESEND_API_KEY = process.env.RESEND_API_KEY

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address').max(320),
  subject: z.string().max(200).optional(),
  message: z.string().min(1, 'Message is required').max(5000),
  country: z.string().max(10).optional(),
})

/** Escape HTML special characters to prevent XSS in email templates */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 }
    )
  }

  const { name, email, subject, message, country } = parsed.data

  try {
    // If Resend is configured, send email
    if (RESEND_API_KEY) {
      const safeName = escapeHtml(name)
      const safeEmail = escapeHtml(email)
      const safeCountry = escapeHtml(country || 'Not specified')
      const safeSubject = escapeHtml(subject || 'General inquiry')
      const safeMessage = escapeHtml(message).replace(/\n/g, '<br/>')

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'BeNetwork Contact <noreply@bekenya.com>',
          to: ['contact@bekenya.com'],
          reply_to: email,
          subject: `[${country || 'Contact'}] ${subject || 'New message'} from ${name}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${safeName}</p>
            <p><strong>Email:</strong> ${safeEmail}</p>
            <p><strong>Country:</strong> ${safeCountry}</p>
            <p><strong>Subject:</strong> ${safeSubject}</p>
            <hr/>
            <p>${safeMessage}</p>
          `,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
