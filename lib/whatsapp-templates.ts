/**
 * WhatsApp Business API Templates — BeNetwork
 *
 * Template messages must be pre-approved by Meta before sending.
 * These definitions are the source-of-truth for:
 *   1. Template registration requests to Meta
 *   2. API call payload construction
 *   3. Preview/test rendering in the admin dashboard
 *
 * Placeholder syntax: {{1}}, {{2}}, etc. (Meta standard)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WATemplate {
  name: string       // template name for Meta API (snake_case, max 512 chars)
  language: string   // 'en_US' | 'sw' | 'de'
  category: 'MARKETING' | 'UTILITY' | 'AUTHENTICATION'
  components: WAComponent[]
  description: string
}

export type WAComponent = {
  type: 'HEADER' | 'BODY' | 'FOOTER' | 'BUTTONS'
  text?: string
  parameters?: WAParameter[]
}

export type WAParameter = {
  type: 'text' | 'currency' | 'date_time' | 'image'
  text?: string
}

// ─── Template Definitions ─────────────────────────────────────────────────────

/** All templates use {{1}}, {{2}} etc. as ordered placeholders */
export const WA_TEMPLATES: WATemplate[] = [
  // ── 1. Pioneer Welcome ────────────────────────────────────────────────────
  {
    name: 'pioneer_welcome',
    language: 'en_US',
    category: 'UTILITY',
    description: 'Sent after a pioneer completes onboarding',
    components: [
      {
        type: 'HEADER',
        text: '🌍 Welcome to the BeNetwork, {{1}}!',
      },
      {
        type: 'BODY',
        text: "Your journey begins now. We've matched you with {{2}} open Paths based on your profile.\n\nYou're a {{3}} Pioneer — and there are Anchors ready to meet you.\n\n👉 See your matches: bekenya.com/ventures\n\n_BeKenya — Find where you belong. Go there._",
      },
      {
        type: 'FOOTER',
        text: 'Reply STOP to unsubscribe from notifications',
      },
    ],
  },

  // ── 2. New Path Match ─────────────────────────────────────────────────────
  {
    name: 'new_path_match',
    language: 'en_US',
    category: 'UTILITY',
    description: 'Sent when a new path matches a pioneer profile',
    components: [
      {
        type: 'HEADER',
        text: '🔥 New Path Match for You',
      },
      {
        type: 'BODY',
        text: '*{{1}}* at {{2}} is now open.\n\n📍 {{3}}\n💰 {{4}}\n⭐ Match Score: {{5}}%\n\nThis path matches your {{6}} skills.\n\n👉 Open this chapter: {{7}}',
      },
      {
        type: 'FOOTER',
        text: 'BeKenya — Your Compass Never Sleeps',
      },
    ],
  },

  // ── 3. Safari / Experience Booking Confirmation ───────────────────────────
  {
    name: 'safari_booking_confirmation',
    language: 'en_US',
    category: 'UTILITY',
    description: 'Sent when a safari/experience booking is confirmed',
    components: [
      {
        type: 'HEADER',
        text: '🦁 Your Venture is Confirmed!',
      },
      {
        type: 'BODY',
        text: '*{{1}}*\n\n📅 Date: {{2}}\n👥 Guests: {{3}}\n📍 Meeting point: {{4}}\n💰 Total: {{5}}\n\nWhat to bring:\n• Comfortable clothes\n• Camera/phone\n• Water & snacks\n• Sunscreen\n\nQuestions? Reply to this message.\n\n_Victoria Safari / BeKenya Experiences_',
      },
      {
        type: 'FOOTER',
        text: 'Booking ref: {{6}}',
      },
    ],
  },

  // ── 4. Chapter Opened (Pioneer → Anchor notification) ────────────────────
  {
    name: 'chapter_opened',
    language: 'en_US',
    category: 'UTILITY',
    description: 'Sent to anchor when a pioneer opens a chapter (applies)',
    components: [
      {
        type: 'HEADER',
        text: '📖 A Pioneer Opened a Chapter',
      },
      {
        type: 'BODY',
        text: '*{{1}}* has opened a chapter for:\n*{{2}}*\n\n🌍 From: {{3}}\n💼 Pioneer Type: {{4}}\n⭐ Match Score: {{5}}%\n\nView their profile and respond: {{6}}\n\n_BeNetwork — Connecting Pioneers and Anchors_',
      },
      {
        type: 'FOOTER',
        text: 'Reply within 48h for best results',
      },
    ],
  },

  // ── 5. Chapter Reviewed (Anchor → Pioneer notification) ──────────────────
  {
    name: 'chapter_reviewed',
    language: 'en_US',
    category: 'UTILITY',
    description: 'Sent to pioneer when anchor reviews their chapter',
    components: [
      {
        type: 'HEADER',
        text: '👀 Your Chapter Was Reviewed',
      },
      {
        type: 'BODY',
        text: '*{{1}}* has reviewed your chapter for:\n*{{2}}*\n\nStatus: *{{3}}*\n\n{{4}}\n\nView full details: {{5}}',
      },
      {
        type: 'FOOTER',
        text: 'BeKenya — Your Compass Never Sleeps',
      },
    ],
  },

  // ── 6. UTAMADUNI Donation Thank You ──────────────────────────────────────
  {
    name: 'utamaduni_donation_thanks',
    language: 'en_US',
    category: 'UTILITY',
    description: 'Sent after a donation to UTAMADUNI',
    components: [
      {
        type: 'HEADER',
        text: '🌱 Thank you, {{1}}!',
      },
      {
        type: 'BODY',
        text: "Your donation of *{{2}}* to UTAMADUNI has been received.\n\nThis will directly support:\n• {{3}} children in education programs\n• Conservation efforts in {{4}}\n• Women's empowerment training\n\nYour impact reference: {{5}}\n\nThank you for being part of the community.\n_UTAMADUNI CBO | BeKenya Family Ltd_",
      },
      {
        type: 'FOOTER',
        text: 'UTAMADUNI — Culture. Community. Change.',
      },
    ],
  },

  // ── 7. M-Pesa Payment Confirmation ───────────────────────────────────────
  {
    name: 'mpesa_payment_confirmed',
    language: 'en_US',
    category: 'UTILITY',
    description: 'Sent when an M-Pesa STK push payment is confirmed',
    components: [
      {
        type: 'HEADER',
        text: '✅ Payment Received',
      },
      {
        type: 'BODY',
        text: 'Your M-Pesa payment of *{{1}}* has been received.\n\n📋 Reference: {{2}}\n📅 Date: {{3}}\n🎯 For: {{4}}\n\nYour chapter has been opened. Anchors will be notified.\n\n👉 Track your chapter: {{5}}',
      },
      {
        type: 'FOOTER',
        text: 'BeKenya — Powered by M-Pesa',
      },
    ],
  },

  // ── 8. Pioneer Reminder — Incomplete Profile ──────────────────────────────
  {
    name: 'profile_completion_reminder',
    language: 'en_US',
    category: 'UTILITY',
    description: 'Sent 24h after signup if onboarding is incomplete',
    components: [
      {
        type: 'HEADER',
        text: '⏳ Your chapter is waiting, {{1}}',
      },
      {
        type: 'BODY',
        text: "You started your BeNetwork journey but didn't finish your profile.\n\nPioneers with complete profiles get *3x more* responses from Anchors.\n\nIt takes less than 3 minutes.\n\n👉 Complete your profile: bekenya.com/onboarding\n\n_BeKenya — Find where you belong. Go there._",
      },
      {
        type: 'FOOTER',
        text: 'Reply STOP to unsubscribe',
      },
    ],
  },

  // ── 9. Swahili — Karibu (Welcome) ─────────────────────────────────────────
  {
    name: 'pioneer_welcome_sw',
    language: 'sw',
    category: 'UTILITY',
    description: 'Swahili welcome message sent after onboarding',
    components: [
      {
        type: 'HEADER',
        text: '🌍 Karibu kwenye BeNetwork, {{1}}!',
      },
      {
        type: 'BODY',
        text: 'Safari yako inaanza sasa. Tumekupatia Njia {{2}} zinazofaa kulingana na wasifu wako.\n\nWewe ni Mwanzilishi wa aina ya {{3}} — na kuna Nanga wanaokungoja.\n\n👉 Ona mechi zako: bekenya.com/ventures\n\n_BeKenya — Pata mahali pako. Nenda huko._',
      },
      {
        type: 'FOOTER',
        text: 'Jibu STOP kuacha kupokea arifa',
      },
    ],
  },

  // ── 10. German — Wilkommen (Welcome) ─────────────────────────────────────
  {
    name: 'pioneer_welcome_de',
    language: 'de',
    category: 'UTILITY',
    description: 'German welcome message sent after onboarding',
    components: [
      {
        type: 'HEADER',
        text: '🌍 Willkommen im BeNetwork, {{1}}!',
      },
      {
        type: 'BODY',
        text: 'Deine Reise beginnt jetzt. Wir haben {{2}} offene Pfade für dein Profil gefunden.\n\nDu bist ein {{3}}-Pioneer — und es gibt Anker, die auf dich warten.\n\n👉 Sieh deine Matches: begermany.com/ventures\n\n_BeGermany — Finde deinen Platz. Geh dorthin._',
      },
      {
        type: 'FOOTER',
        text: 'Antworte STOP zum Abbestellen von Benachrichtigungen',
      },
    ],
  },
]

// ─── Template Lookup Helpers ──────────────────────────────────────────────────

/** Look up a template by name and language */
export function getTemplate(name: string, language = 'en_US'): WATemplate | undefined {
  return WA_TEMPLATES.find(t => t.name === name && t.language === language)
}

/** Get all templates for a given category */
export function getTemplatesByCategory(category: WATemplate['category']): WATemplate[] {
  return WA_TEMPLATES.filter(t => t.category === category)
}

// ─── fillTemplate ─────────────────────────────────────────────────────────────

/**
 * Fill a template's BODY component with actual values.
 * Replaces {{1}}, {{2}}, ... with the provided values array (0-indexed).
 *
 * @example
 * fillTemplate(WA_TEMPLATES[0], ['Alice', '5', 'Explorer'])
 */
export function fillTemplate(template: WATemplate, values: string[]): string {
  const bodyComponent = template.components.find(c => c.type === 'BODY')
  if (!bodyComponent?.text) return ''

  let filled = bodyComponent.text
  values.forEach((val, idx) => {
    filled = filled.replace(new RegExp(`\\{\\{${idx + 1}\\}\\}`, 'g'), val)
  })
  return filled
}

// ─── buildWhatsAppPayload ─────────────────────────────────────────────────────

/**
 * Build the full WhatsApp Cloud API payload for a template message.
 * Returns the JSON object ready to POST to:
 *   https://graph.facebook.com/v18.0/{phone_number_id}/messages
 *
 * @param toPhoneNumber  E.164 format, e.g. '+254712345678'
 * @param templateName   Must match a registered Meta template name
 * @param languageCode   e.g. 'en_US', 'sw', 'de'
 * @param parameterValues  Ordered values for {{1}}, {{2}}, ... placeholders
 */
export function buildWhatsAppPayload(
  toPhoneNumber: string,
  templateName: string,
  languageCode: string,
  parameterValues: string[]
): Record<string, unknown> {
  return {
    messaging_product: 'whatsapp',
    to: toPhoneNumber,
    type: 'template',
    template: {
      name: templateName,
      language: {
        code: languageCode,
      },
      components: [
        {
          type: 'body',
          parameters: parameterValues.map(val => ({
            type: 'text',
            text: val,
          })),
        },
      ],
    },
  }
}

// ─── Convenience Senders (payload builders) ───────────────────────────────────

/** Payload for pioneer_welcome */
export function pioneerWelcomePayload(
  phone: string,
  name: string,
  matchCount: number,
  pioneerType: string,
  language = 'en_US'
): Record<string, unknown> {
  const templateName = language === 'sw' ? 'pioneer_welcome_sw'
    : language === 'de' ? 'pioneer_welcome_de'
    : 'pioneer_welcome'
  return buildWhatsAppPayload(phone, templateName, language, [
    name,
    String(matchCount),
    pioneerType.charAt(0).toUpperCase() + pioneerType.slice(1),
  ])
}

/** Payload for new_path_match */
export function newPathMatchPayload(
  phone: string,
  pathTitle: string,
  anchorName: string,
  location: string,
  salary: string,
  matchScore: number,
  topSkill: string,
  pathUrl: string
): Record<string, unknown> {
  return buildWhatsAppPayload(phone, 'new_path_match', 'en_US', [
    pathTitle,
    anchorName,
    location,
    salary,
    String(matchScore),
    topSkill,
    pathUrl,
  ])
}

/** Payload for chapter_opened (sent to anchor) */
export function chapterOpenedPayload(
  anchorPhone: string,
  pioneerName: string,
  pathTitle: string,
  pioneerOrigin: string,
  pioneerType: string,
  matchScore: number,
  reviewUrl: string
): Record<string, unknown> {
  return buildWhatsAppPayload(anchorPhone, 'chapter_opened', 'en_US', [
    pioneerName,
    pathTitle,
    pioneerOrigin,
    pioneerType.charAt(0).toUpperCase() + pioneerType.slice(1),
    String(matchScore),
    reviewUrl,
  ])
}

/** Payload for mpesa_payment_confirmed */
export function mpesaPaymentPayload(
  phone: string,
  amount: string,
  reference: string,
  date: string,
  purpose: string,
  trackingUrl: string
): Record<string, unknown> {
  return buildWhatsAppPayload(phone, 'mpesa_payment_confirmed', 'en_US', [
    amount,
    reference,
    date,
    purpose,
    trackingUrl,
  ])
}

/** Payload for utamaduni_donation_thanks */
export function utamaduniDonationPayload(
  phone: string,
  donorName: string,
  amount: string,
  childrenCount: string,
  region: string,
  impactRef: string
): Record<string, unknown> {
  return buildWhatsAppPayload(phone, 'utamaduni_donation_thanks', 'en_US', [
    donorName,
    amount,
    childrenCount,
    region,
    impactRef,
  ])
}
