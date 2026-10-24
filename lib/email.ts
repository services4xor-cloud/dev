/**
 * Transactional email via Resend. Without RESEND_API_KEY (local dev) the
 * message is logged instead of sent, so sign-up and verification still work.
 */
import { Resend } from 'resend'

const FROM = process.env.EMAIL_FROM ?? 'Be[X] <onboarding@resend.dev>'

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  /** Where the recipient's "Reply" goes, e.g. the visitor who wrote */
  replyTo?: string
}): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    if (process.env.NODE_ENV === 'production') throw new Error('RESEND_API_KEY not configured')
    // eslint-disable-next-line no-console
    console.info(`[email:dev] to=${to} replyTo=${replyTo ?? '-'} subject="${subject}"\n${html}`)
    return
  }
  const { error } = await new Resend(key).emails.send({
    from: FROM,
    to,
    subject,
    html,
    ...(replyTo ? { reply_to: replyTo } : {}),
  })
  if (error) throw new Error(`Email failed: ${error.message}`)
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
}

/** Simple branded layout with one call-to-action button. Text arguments are plain text. */
export function actionEmail(title: string, body: string, ctaLabel: string, url: string): string {
  title = escapeHtml(title)
  body = escapeHtml(body).replace(/\n/g, '<br>')
  ctaLabel = escapeHtml(ctaLabel)
  url = escapeHtml(url)
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
      <h1 style="color: #5C0A14; font-size: 22px; margin: 0 0 24px; text-align: center;">${title}</h1>
      <p style="color: #333; font-size: 16px; line-height: 1.5;">${body}</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${url}" style="background: #5C0A14; color: #C9A227; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">${ctaLabel}</a>
      </div>
      <p style="color: #888; font-size: 13px; line-height: 1.4;">If you didn't request this email, you can safely ignore it.</p>
    </div>
  `
}
