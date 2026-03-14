/**
 * lib/email.ts — Email automation using Resend
 *
 * All emails are styled with Be[Country] brand colors:
 *   Maroon:  #5C0A14  (primary — buttons, step indicators)
 *   Gold:    #C9A227  (accent — highlights, stat values, footer brand)
 *   Green:   #006600  (success — donation, accepted badges)
 *   Teal:    #0891B2  (info — secondary CTAs)
 *
 * Falls back to console.log when RESEND_API_KEY is not set (development mode).
 *
 * Usage:
 *   import { sendEmail } from '@/lib/email'
 *   await sendEmail('user@example.com', 'pioneer_welcome', { name: 'Alice', ... })
 */

// eslint-disable-next-line no-console
const logger = { info: console.log, warn: console.warn, error: console.error, debug: console.log }

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type EmailTemplate =
  | 'pioneer_welcome'
  | 'chapter_opened'
  | 'chapter_status_update'
  | 'safari_booking_confirmation'
  | 'new_path_match'
  | 'anchor_new_chapter'
  | 'weekly_digest'
  | 'password_reset'
  | 'utamaduni_donation_receipt'

export interface EmailResult {
  success: boolean
  id?: string
  error?: string
  mock?: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared HTML Layout Helpers
// ─────────────────────────────────────────────────────────────────────────────

function emailWrapper(content: string, previewText = ''): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BeKenya</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
  <style>
    body { margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 24px 16px; }
    .card { background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
    .hero { background: linear-gradient(135deg, #5C0A14 0%, #3a0610 100%); padding: 40px 32px; text-align: center; }
    .hero-brand { color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; margin: 0 0 4px; }
    .hero-tagline { color: rgba(255,255,255,0.9); font-size: 14px; margin: 0; }
    .body { padding: 32px; }
    .h1 { font-size: 24px; font-weight: 700; color: #111827; margin: 0 0 16px; line-height: 1.3; }
    .h2 { font-size: 18px; font-weight: 600; color: #374151; margin: 24px 0 8px; }
    .p { font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0 0 16px; }
    .p-sm { font-size: 13px; color: #6b7280; line-height: 1.5; margin: 0 0 8px; }
    .badge { display: inline-block; background: #fdf2f3; color: #5C0A14; border: 1px solid #e8c4c8; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    .badge-green { display: inline-block; background: #f0fdf4; color: #006600; border: 1px solid #bbf7d0; border-radius: 20px; padding: 4px 12px; font-size: 12px; font-weight: 600; margin-bottom: 16px; }
    .cta-block { text-align: center; margin: 32px 0; }
    .cta-btn { display: inline-block; background: #5C0A14; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; letter-spacing: 0.2px; }
    .cta-btn-teal { display: inline-block; background: #0891B2; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; }
    .cta-btn-green { display: inline-block; background: #006600; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; }
    .info-card { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .info-row { display: flex; margin-bottom: 8px; }
    .info-label { font-size: 13px; font-weight: 600; color: #6b7280; width: 130px; flex-shrink: 0; }
    .info-value { font-size: 13px; color: #111827; }
    .steps { list-style: none; padding: 0; margin: 16px 0; }
    .steps li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 16px; font-size: 14px; color: #374151; }
    .step-num { width: 24px; height: 24px; background: #5C0A14; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .stat-bar { display: flex; background: #f9fafb; border-radius: 8px; overflow: hidden; margin: 20px 0; }
    .stat { flex: 1; padding: 16px; text-align: center; border-right: 1px solid #e5e7eb; }
    .stat:last-child { border-right: none; }
    .stat-value { font-size: 20px; font-weight: 800; color: #C9A227; display: block; }
    .stat-label { font-size: 11px; color: #6b7280; display: block; margin-top: 2px; }
    .footer { background: #111827; padding: 24px 32px; text-align: center; }
    .footer-brand { color: #C9A227; font-size: 16px; font-weight: 700; margin: 0 0 8px; }
    .footer-links { color: #9ca3af; font-size: 12px; margin: 0 0 8px; }
    .footer-links a { color: #9ca3af; text-decoration: none; margin: 0 8px; }
    .footer-unsub { color: #6b7280; font-size: 11px; margin: 0; }
    .highlight { color: #C9A227; font-weight: 700; }
    .teal { color: #0891B2; font-weight: 700; }
    .green { color: #006600; font-weight: 700; }
    .score-bar { background: #e5e7eb; border-radius: 4px; height: 8px; margin: 4px 0 16px; overflow: hidden; }
    .score-fill { background: linear-gradient(90deg, #5C0A14, #C9A227); height: 100%; border-radius: 4px; }
  </style>
</head>
<body>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;color:#ffffff;">${previewText}</div>` : ''}
  <div class="wrapper">
    <div class="card">
      ${content}
    </div>
    <p style="text-align:center;font-size:11px;color:#9ca3af;margin:16px 0 0;">
      BeKenya — Find where you belong. Go there.<br/>
      &copy; ${new Date().getFullYear()} BeKenya Family Ltd. Nairobi, Kenya.
    </p>
  </div>
</body>
</html>`
}

function emailHeader(brandName = 'BeKenya', tagline = 'Find where you belong. Go there.'): string {
  return `<div class="hero">
    <p class="hero-brand">${brandName}</p>
    <p class="hero-tagline">${tagline}</p>
  </div>`
}

function emailFooter(
  unsubscribeText = 'You received this because you signed up at bekenya.com.'
): string {
  return `<div class="footer">
    <p class="footer-brand">BeKenya</p>
    <p class="footer-links">
      <a href="https://bekenya.com">Home</a>
      <a href="https://bekenya.com/ventures">Paths</a>
      <a href="https://bekenya.com/compass">Compass</a>
      <a href="https://bekenya.com/about">About</a>
    </p>
    <p class="footer-unsub">${unsubscribeText}</p>
  </div>`
}

// ─────────────────────────────────────────────────────────────────────────────
// Email Templates
// ─────────────────────────────────────────────────────────────────────────────

export const EMAIL_TEMPLATES: Record<
  EmailTemplate,
  (data: Record<string, string>) => { subject: string; html: string }
> = {
  // ── 1. Pioneer Welcome ──────────────────────────────────────────────────────
  pioneer_welcome: (data) => ({
    subject: `Welcome to the BeNetwork, ${data.name || 'Pioneer'}!`,
    html: emailWrapper(
      `${emailHeader()}
      <div class="body">
        <div class="badge">${data.pioneerType || 'Pioneer'} Pioneer</div>
        <h1 class="h1">Welcome to the BeNetwork, ${data.name || 'Pioneer'}!</h1>
        <p class="p">
          You've taken the first step on your journey. The Compass is calibrated,
          your profile is live, and Anchors are ready to meet you.
        </p>

        <div class="info-card">
          <p class="p-sm" style="margin:0 0 12px;font-weight:600;color:#374151;">Your quick stats</p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <div style="flex:1;min-width:100px;text-align:center;background:#fdf2f3;border-radius:8px;padding:12px;">
              <span style="font-size:24px;font-weight:800;color:#5C0A14;">${data.matchCount || '0'}</span>
              <span style="display:block;font-size:11px;color:#9ca3af;margin-top:2px;">Path Matches</span>
            </div>
            <div style="flex:1;min-width:100px;text-align:center;background:#f0fdf4;border-radius:8px;padding:12px;">
              <span style="font-size:24px;font-weight:800;color:#006600;">${data.countryFrom || 'KE'}</span>
              <span style="display:block;font-size:11px;color:#9ca3af;margin-top:2px;">Your Origin</span>
            </div>
            <div style="flex:1;min-width:100px;text-align:center;background:#eff6ff;border-radius:8px;padding:12px;">
              <span style="font-size:24px;font-weight:800;color:#0891B2;">${data.targetCountry || 'Global'}</span>
              <span style="display:block;font-size:11px;color:#9ca3af;margin-top:2px;">Target Market</span>
            </div>
          </div>
        </div>

        <h2 class="h2">Your next 3 steps</h2>
        <ol class="steps">
          <li>
            <div class="step-num">1</div>
            <div>
              <strong>Complete your Compass profile</strong><br/>
              <span style="font-size:13px;color:#6b7280;">Add your skills, experience, and target role. Better profiles = more Anchor responses.</span>
            </div>
          </li>
          <li>
            <div class="step-num">2</div>
            <div>
              <strong>Browse your matched Paths</strong><br/>
              <span style="font-size:13px;color:#6b7280;">The Compass has matched you with ${data.matchCount || 'open'} Paths. Explore them and open a Chapter.</span>
            </div>
          </li>
          <li>
            <div class="step-num">3</div>
            <div>
              <strong>Connect with an Anchor</strong><br/>
              <span style="font-size:13px;color:#6b7280;">Anchors are employers and guides who open their Paths to Pioneers like you.</span>
            </div>
          </li>
        </ol>

        <div class="cta-block">
          <a href="${data.ctaUrl || 'https://bekenya.com/compass'}" class="cta-btn">
            Start Your Compass &rarr;
          </a>
        </div>

        <hr class="divider" />
        <p class="p-sm" style="text-align:center;">
          Questions? Reply to this email or reach us at
          <a href="mailto:hello@bekenya.com" style="color:#5C0A14;">hello@bekenya.com</a>
        </p>
      </div>
      ${emailFooter()}`,
      `Welcome, ${data.name || 'Pioneer'}! Your journey starts now.`
    ),
  }),

  // ── 2. Chapter Opened (Pioneer notified when chapter is created) ───────────
  chapter_opened: (data) => ({
    subject: `Chapter opened: ${data.pathTitle || 'Your Application'}`,
    html: emailWrapper(
      `${emailHeader()}
      <div class="body">
        <div class="badge-green">Chapter Opened</div>
        <h1 class="h1">Your chapter is live, ${data.pioneerName || 'Pioneer'}!</h1>
        <p class="p">
          You've successfully opened a Chapter for <strong>${data.pathTitle || 'this Path'}</strong>.
          The Anchor has been notified and will respond within 48 hours.
        </p>

        <div class="info-card">
          <p style="margin:0 0 12px;font-size:13px;font-weight:600;color:#374151;">Chapter Details</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:130px;">Path</td><td style="font-size:13px;color:#111827;font-weight:600;">${data.pathTitle || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Anchor</td><td style="font-size:13px;color:#111827;">${data.anchorName || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Location</td><td style="font-size:13px;color:#111827;">${data.location || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Match Score</td><td style="font-size:13px;color:#5C0A14;font-weight:700;">${data.matchScore || '—'}%</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Reference</td><td style="font-size:13px;color:#111827;">${data.chapterId || '—'}</td></tr>
          </table>
          ${data.matchScore ? `<div class="score-bar"><div class="score-fill" style="width:${Math.min(100, Number(data.matchScore))}%;"></div></div>` : ''}
        </div>

        <p class="p">
          While you wait, make sure your profile is complete — Anchors look at your
          skills, experience, and the message you wrote in your chapter.
        </p>

        <div class="cta-block">
          <a href="${data.chapterUrl || 'https://bekenya.com/compass'}" class="cta-btn">
            View Your Chapter
          </a>
        </div>
      </div>
      ${emailFooter()}`,
      `Your chapter for ${data.pathTitle || 'this Path'} is now live.`
    ),
  }),

  // ── 3. Chapter Status Update (Anchor responded) ───────────────────────────
  chapter_status_update: (data) => ({
    subject: `Chapter update: ${data.status || 'New update'} on ${data.pathTitle || 'your application'}`,
    html: emailWrapper(
      `${emailHeader()}
      <div class="body">
        <div class="${data.status === 'accepted' ? 'badge-green' : 'badge'}">
          ${data.status === 'accepted' ? 'Accepted!' : data.status === 'reviewing' ? 'Under Review' : 'Update'}
        </div>
        <h1 class="h1">
          ${
            data.status === 'accepted'
              ? `Congratulations, ${data.pioneerName || 'Pioneer'}!`
              : `Update on your chapter, ${data.pioneerName || 'Pioneer'}`
          }
        </h1>
        <p class="p">
          ${data.anchorName || 'The Anchor'} has reviewed your chapter for
          <strong>${data.pathTitle || 'the Path'}</strong>.
        </p>

        <div class="info-card" style="${data.status === 'accepted' ? 'border-color:#86efac;background:#f0fdf4;' : ''}">
          <p style="margin:0 0 8px;font-size:16px;font-weight:700;color:${data.status === 'accepted' ? '#006600' : '#374151'};">
            Status: ${data.status || 'Updated'}
          </p>
          ${data.anchorMessage ? `<p class="p-sm" style="margin-top:12px;font-style:italic;">"${data.anchorMessage}"</p>` : ''}
          ${data.nextStep ? `<p class="p-sm" style="margin-top:8px;"><strong>Next step:</strong> ${data.nextStep}</p>` : ''}
        </div>

        <div class="cta-block">
          <a href="${data.chapterUrl || 'https://bekenya.com/compass'}" class="cta-btn${data.status === 'accepted' ? '-green' : ''}">
            ${data.status === 'accepted' ? 'View Your Offer' : 'View Chapter Details'}
          </a>
        </div>
      </div>
      ${emailFooter()}`,
      `${data.anchorName || 'An Anchor'} has responded to your chapter.`
    ),
  }),

  // ── 4. Safari Booking Confirmation ────────────────────────────────────────
  safari_booking_confirmation: (data) => ({
    subject: `Booking confirmed: ${data.packageName || 'Your Safari'} — Ref ${data.bookingRef || ''}`,
    html: emailWrapper(
      `${emailHeader('BeKenya Experiences', 'Wildlife. Adventure. Memory.')}
      <div class="body">
        <div class="badge-green">Booking Confirmed</div>
        <h1 class="h1">Your adventure is booked, ${data.guestName || 'Explorer'}!</h1>
        <p class="p">
          Your M-Pesa payment has been received and your safari is confirmed.
          We can't wait to see you in the wild.
        </p>

        <div class="info-card" style="border-color:#bbf7d0;background:#f0fdf4;">
          <p style="font-size:18px;font-weight:700;color:#006600;margin:0 0 16px;">
            ${data.packageName || 'Safari Experience'}
          </p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:130px;">Date</td><td style="font-size:13px;color:#111827;font-weight:600;">${data.date || 'To be confirmed'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Guests</td><td style="font-size:13px;color:#111827;">${data.guests || '1'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Meeting Point</td><td style="font-size:13px;color:#111827;">${data.meetingPoint || 'Nairobi — details to follow'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Amount Paid</td><td style="font-size:13px;color:#006600;font-weight:700;">${data.amount || ''}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">M-Pesa Receipt</td><td style="font-size:13px;color:#111827;font-family:monospace;">${data.mpesaReceipt || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Booking Ref</td><td style="font-size:13px;color:#111827;font-family:monospace;">${data.bookingRef || '—'}</td></tr>
          </table>
        </div>

        <h2 class="h2">What to bring</h2>
        <ul style="padding-left:20px;margin:0 0 20px;color:#374151;font-size:14px;line-height:2;">
          <li>Comfortable clothes (layers for morning/evening)</li>
          <li>Camera or phone with charged battery</li>
          <li>Water &amp; light snacks</li>
          <li>Sunscreen and insect repellent</li>
          <li>This booking reference</li>
        </ul>

        <div class="cta-block">
          <a href="${data.bookingUrl || 'https://bekenya.com/experiences'}" class="cta-btn-green">
            View Booking Details
          </a>
        </div>

        <hr class="divider" />
        <p class="p-sm" style="text-align:center;">
          Questions about your booking? WhatsApp us or reply to this email.<br/>
          We're here to make your safari unforgettable.
        </p>
      </div>
      ${emailFooter('You received this because you made a booking at bekenya.com/experiences.')}`,
      `Your safari is confirmed! Ref: ${data.bookingRef || ''}`
    ),
  }),

  // ── 5. New Path Match ──────────────────────────────────────────────────────
  new_path_match: (data) => ({
    subject: `New match: ${data.pathTitle || 'A Path'} at ${data.anchorName || 'an Anchor'} (${data.matchScore || '—'}% match)`,
    html: emailWrapper(
      `${emailHeader()}
      <div class="body">
        <div class="badge">New Match</div>
        <h1 class="h1">The Compass found a new Path for you!</h1>
        <p class="p">
          Based on your profile, <strong>${data.anchorName || 'an Anchor'}</strong> has opened a Path
          that matches your skills and goals.
        </p>

        <div class="info-card">
          <p style="font-size:18px;font-weight:700;color:#111827;margin:0 0 8px;">
            ${data.pathTitle || 'Untitled Path'}
          </p>
          <p style="font-size:13px;color:#5C0A14;font-weight:600;margin:0 0 16px;">
            ${data.anchorName || 'Anchor'} &bull; ${data.location || 'Location TBC'}
          </p>
          ${data.salary ? `<p style="font-size:14px;color:#374151;margin:0 0 16px;"><strong>Compensation:</strong> ${data.salary}</p>` : ''}

          <p style="font-size:13px;color:#6b7280;font-weight:600;margin:0 0 4px;">Match Score</p>
          <div style="display:flex;align-items:center;gap:12px;">
            <div class="score-bar" style="flex:1;">
              <div class="score-fill" style="width:${Math.min(100, Number(data.matchScore || 0))}%;"></div>
            </div>
            <span style="font-size:20px;font-weight:800;color:#5C0A14;">${data.matchScore || '—'}%</span>
          </div>

          ${data.topSkill ? `<p class="p-sm" style="margin-top:8px;">Your <strong>${data.topSkill}</strong> skill is a key match for this role.</p>` : ''}
        </div>

        <p class="p">
          This Path won't stay open forever — ${data.openDays || 'a limited number of'} Pioneers can
          open a Chapter. Be one of the first to reach out.
        </p>

        <div class="cta-block">
          <a href="${data.pathUrl || 'https://bekenya.com/compass'}" class="cta-btn">
            Open a Chapter &rarr;
          </a>
        </div>
      </div>
      ${emailFooter()}`,
      `${data.matchScore || '—'}% match: ${data.pathTitle || 'A new path'} at ${data.anchorName || 'an Anchor'}`
    ),
  }),

  // ── 6. Anchor: New Chapter Notification ────────────────────────────────────
  anchor_new_chapter: (data) => ({
    subject: `New chapter opened by ${data.pioneerName || 'a Pioneer'} — ${data.matchScore || '—'}% match`,
    html: emailWrapper(
      `${emailHeader('BeNetwork Anchor Hub', 'Your Pioneers are waiting.')}
      <div class="body">
        <div class="badge">New Chapter</div>
        <h1 class="h1">A Pioneer opened a chapter on your Path</h1>
        <p class="p">
          <strong>${data.pioneerName || 'A Pioneer'}</strong> from <strong>${data.pioneerCountry || '—'}</strong>
          has applied to your Path: <strong>${data.pathTitle || '—'}</strong>.
        </p>

        <div class="info-card">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:130px;">Pioneer</td><td style="font-size:13px;color:#111827;font-weight:600;">${data.pioneerName || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">From</td><td style="font-size:13px;color:#111827;">${data.pioneerCountry || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Type</td><td style="font-size:13px;color:#111827;">${data.pioneerType || '—'} Pioneer</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Path</td><td style="font-size:13px;color:#111827;">${data.pathTitle || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Match Score</td><td style="font-size:13px;color:#5C0A14;font-weight:700;">${data.matchScore || '—'}%</td></tr>
          </table>
          ${data.matchScore ? `<div class="score-bar"><div class="score-fill" style="width:${Math.min(100, Number(data.matchScore))}%;"></div></div>` : ''}
          ${data.pioneerMessage ? `<p class="p-sm" style="margin-top:12px;font-style:italic;border-left:3px solid #5C0A14;padding-left:12px;">"${data.pioneerMessage}"</p>` : ''}
        </div>

        <p class="p">
          Respond within <strong>48 hours</strong> for the best results. Pioneers who get
          fast responses are 4x more likely to complete their journey with you.
        </p>

        <div class="cta-block">
          <a href="${data.reviewUrl || 'https://bekenya.com/dashboard'}" class="cta-btn">
            Review &amp; Respond
          </a>
        </div>
      </div>
      ${emailFooter('You received this because you are an Anchor on bekenya.com.')}`,
      `${data.pioneerName || 'A Pioneer'} wants to join your path.`
    ),
  }),

  // ── 7. Weekly Digest ──────────────────────────────────────────────────────
  weekly_digest: (data) => ({
    subject: `Your BeNetwork weekly digest — ${data.weekOf || new Date().toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}`,
    html: emailWrapper(
      `${emailHeader()}
      <div class="body">
        <h1 class="h1">Your week in the BeNetwork</h1>
        <p class="p">Here's what happened on the platform this week:</p>

        <div class="stat-bar">
          <div class="stat">
            <span class="stat-value">${data.newMatches || '0'}</span>
            <span class="stat-label">New Matches</span>
          </div>
          <div class="stat">
            <span class="stat-value">${data.openChapters || '0'}</span>
            <span class="stat-label">Open Chapters</span>
          </div>
          <div class="stat">
            <span class="stat-value">${data.profileViews || '0'}</span>
            <span class="stat-label">Profile Views</span>
          </div>
        </div>

        ${
          data.topPathTitle
            ? `
        <div class="info-card">
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;">Top Match This Week</p>
          <p style="font-size:16px;font-weight:700;color:#111827;margin:0 0 4px;">${data.topPathTitle}</p>
          <p style="font-size:13px;color:#5C0A14;margin:0;">${data.topPathAnchor || ''} &bull; ${data.topPathScore || '—'}% match</p>
        </div>`
            : ''
        }

        ${
          data.platformJobCount
            ? `
        <p class="p">
          <span class="highlight">${data.platformJobCount}</span> new opportunities were posted on the platform this week.
          Your Compass is continuously scanning for the best matches.
        </p>`
            : ''
        }

        <div class="cta-block">
          <a href="${data.digestUrl || 'https://bekenya.com/compass'}" class="cta-btn">
            View Your Matches
          </a>
        </div>

        <hr class="divider" />
        <p class="p-sm" style="text-align:center;">
          <a href="${data.unsubscribeUrl || 'https://bekenya.com/settings'}" style="color:#9ca3af;">
            Manage digest frequency
          </a>
        </p>
      </div>
      ${emailFooter()}`,
      `${data.newMatches || '0'} new matches, ${data.openChapters || '0'} open chapters this week.`
    ),
  }),

  // ── 8. Password Reset ──────────────────────────────────────────────────────
  password_reset: (data) => ({
    subject: 'Reset your BeKenya password',
    html: emailWrapper(
      `${emailHeader()}
      <div class="body">
        <h1 class="h1">Reset your password</h1>
        <p class="p">
          We received a request to reset the password for your BeKenya account
          associated with <strong>${data.email || 'your email'}</strong>.
        </p>
        <p class="p">
          Click the button below to choose a new password. This link expires in
          <strong>1 hour</strong>.
        </p>

        <div class="cta-block">
          <a href="${data.resetUrl || 'https://bekenya.com/auth/reset'}" class="cta-btn">
            Reset Password
          </a>
        </div>

        <hr class="divider" />
        <p class="p-sm" style="text-align:center;">
          If you didn't request this, you can safely ignore this email.
          Your password will not change unless you click the link above.<br/><br/>
          For security: this link is valid for 1 hour and can only be used once.
        </p>
      </div>
      ${emailFooter('You received this because a password reset was requested for your BeKenya account.')}`,
      'Reset link inside — expires in 1 hour.'
    ),
  }),

  // ── 9. UTAMADUNI Donation Receipt ─────────────────────────────────────────
  utamaduni_donation_receipt: (data) => ({
    subject: `Thank you for supporting UTAMADUNI — Receipt ${data.receiptRef || ''}`,
    html: emailWrapper(
      `${emailHeader('UTAMADUNI', 'Culture. Community. Change.')}
      <div class="body">
        <div class="badge-green">Donation Received</div>
        <h1 class="h1">Thank you, ${data.donorName || 'friend'}!</h1>
        <p class="p">
          Your generosity directly supports children's education, conservation efforts,
          and women's empowerment in Kenya.
        </p>

        <div class="info-card" style="border-color:#bbf7d0;background:#f0fdf4;">
          <p style="font-size:18px;font-weight:700;color:#006600;margin:0 0 16px;">
            Official Donation Receipt
          </p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;width:130px;">Donor</td><td style="font-size:13px;color:#111827;">${data.donorName || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Amount</td><td style="font-size:16px;color:#006600;font-weight:700;">${data.amount || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Payment</td><td style="font-size:13px;color:#111827;">${data.paymentMethod || 'M-Pesa'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Date</td><td style="font-size:13px;color:#111827;">${data.date || new Date().toLocaleDateString('en-KE')}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Receipt Ref</td><td style="font-size:13px;color:#111827;font-family:monospace;">${data.receiptRef || '—'}</td></tr>
            <tr><td style="padding:6px 0;font-size:13px;color:#6b7280;">Organization</td><td style="font-size:13px;color:#111827;">UTAMADUNI CBO | BeKenya Family Ltd</td></tr>
          </table>
        </div>

        <h2 class="h2">Your impact</h2>
        <ul style="padding-left:20px;margin:0 0 20px;color:#374151;font-size:14px;line-height:2;">
          ${data.childrenCount ? `<li>Supports <strong>${data.childrenCount}</strong> children in education programs</li>` : ''}
          ${data.region ? `<li>Conservation work in <strong>${data.region}</strong></li>` : ''}
          <li>Women's empowerment and skills training</li>
          <li>Community cultural preservation</li>
        </ul>

        <div class="cta-block">
          <a href="${data.impactUrl || 'https://bekenya.com/utamaduni'}" class="cta-btn-green">
            See Your Impact
          </a>
        </div>

        <hr class="divider" />
        <p class="p-sm" style="text-align:center;color:#6b7280;">
          UTAMADUNI CBO is registered in Kenya. This receipt serves as your
          official donation acknowledgment. Keep it for your records.
        </p>
      </div>
      ${emailFooter('You received this because you made a donation to UTAMADUNI via bekenya.com.')}`,
      `Your donation of ${data.amount || ''} to UTAMADUNI has been received.`
    ),
  }),
}

// ─────────────────────────────────────────────────────────────────────────────
// sendEmail — Main function
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Send an email using Resend (or console.log fallback in development).
 *
 * @param to      Recipient email address
 * @param template Template name (must be in EmailTemplate type)
 * @param data    Template data (varies by template — see EMAIL_TEMPLATES above)
 * @param from    Optional sender override (defaults to noreply@bekenya.com)
 */
export async function sendEmail(
  to: string,
  template: EmailTemplate,
  data: Record<string, string>,
  from = 'BeKenya <noreply@bekenya.com>'
): Promise<EmailResult> {
  const templateFn = EMAIL_TEMPLATES[template]
  if (!templateFn) {
    return { success: false, error: `Unknown template: ${template}` }
  }

  const { subject, html } = templateFn(data)

  // Development fallback — log to console when Resend key not set
  if (!process.env.RESEND_API_KEY) {
    logger.debug('[Email MOCK]', { template, to, subject })
    return {
      success: true,
      id: `mock-${Date.now()}`,
      mock: true,
    }
  }

  // Send via Resend API
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
      }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      logger.error('[Email] Resend API error', { status: res.status, body: errorText })
      return { success: false, error: `Resend API error: ${res.status}` }
    }

    const result = (await res.json()) as { id?: string }
    return { success: true, id: result.id, mock: false }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown send error'
    logger.error('[Email] Send failed', { error: message })
    return { success: false, error: message }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience wrappers — pre-typed data for common send scenarios
// ─────────────────────────────────────────────────────────────────────────────

/** Send pioneer welcome email after onboarding completion */
export async function sendPioneerWelcome(
  email: string,
  name: string,
  matchCount: number,
  pioneerType: string,
  countryFrom = 'KE',
  targetCountry = 'Global'
): Promise<EmailResult> {
  return sendEmail(email, 'pioneer_welcome', {
    name,
    matchCount: String(matchCount),
    pioneerType,
    countryFrom,
    targetCountry,
    ctaUrl: 'https://bekenya.com/compass',
  })
}

/** Notify pioneer when a new path matches their profile */
export async function sendNewPathMatch(
  email: string,
  pioneerName: string,
  pathTitle: string,
  anchorName: string,
  location: string,
  matchScore: number,
  salary: string,
  topSkill: string,
  pathUrl: string
): Promise<EmailResult> {
  return sendEmail(email, 'new_path_match', {
    pioneerName,
    pathTitle,
    anchorName,
    location,
    matchScore: String(matchScore),
    salary,
    topSkill,
    pathUrl,
    openDays: '7',
  })
}

/** Notify anchor when a pioneer opens a chapter on their path */
export async function sendAnchorChapterNotification(
  anchorEmail: string,
  pioneerName: string,
  pioneerCountry: string,
  pioneerType: string,
  pathTitle: string,
  matchScore: number,
  pioneerMessage: string,
  reviewUrl: string
): Promise<EmailResult> {
  return sendEmail(anchorEmail, 'anchor_new_chapter', {
    pioneerName,
    pioneerCountry,
    pioneerType,
    pathTitle,
    matchScore: String(matchScore),
    pioneerMessage,
    reviewUrl,
  })
}

/** Send safari booking confirmation after M-Pesa payment */
export async function sendSafariBookingConfirmation(
  email: string,
  guestName: string,
  packageName: string,
  date: string,
  guests: number,
  meetingPoint: string,
  amount: string,
  mpesaReceipt: string,
  bookingRef: string,
  bookingUrl: string
): Promise<EmailResult> {
  return sendEmail(email, 'safari_booking_confirmation', {
    guestName,
    packageName,
    date,
    guests: String(guests),
    meetingPoint,
    amount,
    mpesaReceipt,
    bookingRef,
    bookingUrl,
  })
}

/** Send UTAMADUNI donation receipt */
export async function sendDonationReceipt(
  email: string,
  donorName: string,
  amount: string,
  paymentMethod: string,
  mpesaReceipt: string,
  childrenCount: string,
  region: string
): Promise<EmailResult> {
  const receiptRef = `UTM-${mpesaReceipt || Date.now()}`
  return sendEmail(email, 'utamaduni_donation_receipt', {
    donorName,
    amount,
    paymentMethod,
    date: new Date().toLocaleDateString('en-KE', { dateStyle: 'long' }),
    receiptRef,
    childrenCount,
    region,
    impactUrl: 'https://bekenya.com/utamaduni',
  })
}

/** Send password reset email */
export async function sendPasswordReset(email: string, resetToken: string): Promise<EmailResult> {
  const resetUrl = `https://bekenya.com/auth/reset?token=${resetToken}`
  return sendEmail(email, 'password_reset', { email, resetUrl })
}
