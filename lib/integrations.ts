/**
 * External Integrations — OpenClaw + n8n + WhatsApp Business
 *
 * Architecture:
 *   Anchor posts Path → n8n generates social content → OpenClaw sends preview
 *   Agent gets notified → WhatsApp Business API delivers demand signals
 *
 * All integrations are optional. Platform works without them.
 * Set env vars to enable each service.
 */

// ─── Integration Status ──────────────────────────────────────────────────────

export interface IntegrationStatus {
  name: string
  enabled: boolean
  envVars: string[]
  description: string
  docsUrl: string
}

export function getIntegrationStatus(): IntegrationStatus[] {
  return [
    {
      name: 'OpenClaw',
      enabled: !!process.env.OPENCLAW_API_URL,
      envVars: ['OPENCLAW_API_URL', 'OPENCLAW_API_KEY'],
      description: 'AI assistant for agent notifications via WhatsApp/Telegram',
      docsUrl: 'https://github.com/open-claw/open-claw',
    },
    {
      name: 'n8n',
      enabled: !!process.env.N8N_WEBHOOK_URL,
      envVars: ['N8N_WEBHOOK_URL', 'N8N_API_KEY'],
      description: 'Workflow automation for social media posting and content generation',
      docsUrl: 'https://docs.n8n.io',
    },
    {
      name: 'WhatsApp Business',
      enabled: !!process.env.WHATSAPP_TOKEN,
      envVars: ['WHATSAPP_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'],
      description: 'Direct messaging to agents and pioneers via WhatsApp',
      docsUrl: 'https://developers.facebook.com/docs/whatsapp/cloud-api',
    },
    {
      name: 'Resend',
      enabled: !!process.env.RESEND_API_KEY,
      envVars: ['RESEND_API_KEY'],
      description: 'Transactional email for notifications and confirmations',
      docsUrl: 'https://resend.com/docs',
    },
  ]
}

// ─── Agent Notification System ───────────────────────────────────────────────

export interface DemandNotification {
  pathId: string
  title: string
  company: string
  location: string
  country: string
  salary: string
  pioneersNeeded: number
  sector: string
  forwardLink: string
}

/**
 * Notify agents about new demand (new Path posted).
 * Tries WhatsApp first, falls back to email, logs if neither is available.
 */
export async function notifyAgentsOfDemand(
  notification: DemandNotification,
  agentPhones: string[],
  agentEmails: string[]
): Promise<{ sent: number; channel: string }> {
  // Try WhatsApp Business API first
  if (process.env.WHATSAPP_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    let sent = 0
    for (const phone of agentPhones) {
      try {
        await fetch(
          `https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: phone,
              type: 'template',
              template: {
                name: 'agent_demand_alert',
                language: { code: 'en' },
                components: [
                  {
                    type: 'body',
                    parameters: [
                      { type: 'text', text: notification.title },
                      { type: 'text', text: notification.company },
                      { type: 'text', text: notification.location },
                      { type: 'text', text: notification.salary },
                      { type: 'text', text: String(notification.pioneersNeeded) },
                    ],
                  },
                  {
                    type: 'button',
                    sub_type: 'url',
                    index: 0,
                    parameters: [{ type: 'text', text: notification.forwardLink }],
                  },
                ],
              },
            }),
          }
        )
        sent++
      } catch {
        // Individual send failure — continue with others
      }
    }
    return { sent, channel: 'whatsapp' }
  }

  // Try OpenClaw if configured (sends via WhatsApp/Telegram through OpenClaw)
  if (process.env.OPENCLAW_API_URL) {
    try {
      const res = await fetch(`${process.env.OPENCLAW_API_URL}/api/notify`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENCLAW_API_KEY || ''}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'demand_alert',
          recipients: agentPhones.map((p) => ({ phone: p })),
          message: `New demand: ${notification.title} at ${notification.company} (${notification.location}). ${notification.pioneersNeeded} pioneers needed. ${notification.salary}. Forward: ${notification.forwardLink}`,
        }),
      })
      const data = (await res.json()) as { delivered?: number }
      return { sent: data.delivered || agentPhones.length, channel: 'openclaw' }
    } catch {
      // Fall through to email
    }
  }

  // Fallback: email via Resend
  if (process.env.RESEND_API_KEY) {
    let sent = 0
    for (const email of agentEmails) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'BeNetwork Agents <agents@bekenya.com>',
            to: [email],
            subject: `New demand: ${notification.title} — ${notification.pioneersNeeded} pioneers needed`,
            html: `
              <h2>New Path Posted</h2>
              <p><strong>${notification.title}</strong> at ${notification.company}</p>
              <p>Location: ${notification.location} (${notification.country})</p>
              <p>Salary: ${notification.salary}</p>
              <p>Pioneers needed: ${notification.pioneersNeeded}</p>
              <p><a href="${notification.forwardLink}">Forward to your network</a></p>
            `,
          }),
        })
        sent++
      } catch {
        // Continue
      }
    }
    return { sent, channel: 'email' }
  }

  // No notification channel available
  return { sent: 0, channel: 'none' }
}

// ─── n8n Social Automation ────────────────────────────────────────────────────

/**
 * Trigger an n8n workflow when a new Path is posted.
 * n8n handles: content generation → watermarking → social posting.
 */
export async function triggerN8nWorkflow(
  webhookId: string,
  payload: Record<string, unknown>
): Promise<boolean> {
  const baseUrl = process.env.N8N_WEBHOOK_URL
  if (!baseUrl) return false

  try {
    const res = await fetch(`${baseUrl}/${webhookId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}

// ─── Webhook for n8n path-created trigger ─────────────────────────────────────

export const N8N_WEBHOOKS = {
  PATH_CREATED: 'path-created',
  CHAPTER_OPENED: 'chapter-opened',
  PLACEMENT_CONFIRMED: 'placement-confirmed',
  AGENT_FORWARD: 'agent-forward',
} as const
