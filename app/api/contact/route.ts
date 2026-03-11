import { NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, country } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // If Resend is configured, send email
    if (RESEND_API_KEY) {
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
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Country:</strong> ${country || 'Not specified'}</p>
            <p><strong>Subject:</strong> ${subject || 'General inquiry'}</p>
            <hr/>
            <p>${message.replace(/\n/g, '<br/>')}</p>
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
