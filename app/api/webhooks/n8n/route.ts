import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { event?: string; data?: unknown }

    // Verify webhook secret
    const secret = request.headers.get('x-webhook-secret')
    if (process.env.N8N_WEBHOOK_SECRET && secret !== process.env.N8N_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Handle different event types from n8n
    const { event } = body

    switch (event) {
      case 'social_posted':
        // n8n confirms social media post was published
        // TODO: Update SocialPost status in DB
        return NextResponse.json({ received: true, event })

      case 'content_generated':
        // n8n generated content for review
        // TODO: Queue for agent approval via OpenClaw
        return NextResponse.json({ received: true, event })

      default:
        return NextResponse.json({ received: true, event: 'unknown' })
    }
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
}
