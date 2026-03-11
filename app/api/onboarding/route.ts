/* eslint-disable no-console */
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { hasDatabase } from '@/services/db'
import { buildWhatsAppPayload } from '@/lib/whatsapp-templates'
import { rankPathsForPioneer, MOCK_PATHS } from '@/lib/matching'
import type { PioneerProfile } from '@/lib/matching'

// ─── Validation Schema ────────────────────────────────────────────────────────
const OnboardingSchema = z.object({
  pioneerType: z.enum(['explorer', 'professional', 'artisan', 'guardian', 'creator', 'healer'], {
    errorMap: () => ({ message: 'Please select a valid Pioneer type' }),
  }),
  fromCountry: z.string().min(2, 'Origin country is required').max(10),
  toCountries: z.array(z.string().min(2).max(10)).min(1, 'Select at least one destination').max(8),
  skills: z.array(z.string().min(1).max(100)).min(3, 'Select at least 3 skills').max(50),
  headline: z.string().min(5, 'Headline must be at least 5 characters').max(200),
  bio: z.string().max(1000).optional().default(''),
  phone: z
    .string()
    .max(20)
    .optional()
    .transform((val) => {
      if (!val) return undefined
      // Normalise: strip non-digits except leading +
      const cleaned = val.replace(/[^\d+]/g, '')
      return cleaned.length >= 7 ? cleaned : undefined
    }),
})

export type OnboardingPayload = z.infer<typeof OnboardingSchema>

// ─── WhatsApp Queue (mock — real impl when WA_TOKEN is set) ──────────────────
async function queueWelcomeWhatsApp(
  phone: string,
  pioneerName: string,
  pioneerType: string,
  matchCount: number
): Promise<void> {
  const waToken = process.env.WHATSAPP_TOKEN
  const waPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID

  if (!waToken || !waPhoneId) {
    // Sandbox mode: log payload for review
    const payload = buildWhatsAppPayload(phone, 'pioneer_welcome', 'en_US', [
      pioneerName,
      String(matchCount),
      pioneerType.charAt(0).toUpperCase() + pioneerType.slice(1),
    ])
    console.log(
      '[WhatsApp mock] Would send pioneer_welcome to',
      phone,
      JSON.stringify(payload, null, 2)
    )
    return
  }

  // Real send when credentials exist
  const payload = buildWhatsAppPayload(phone, 'pioneer_welcome', 'en_US', [
    pioneerName,
    String(matchCount),
    pioneerType.charAt(0).toUpperCase() + pioneerType.slice(1),
  ])

  try {
    const res = await fetch(`https://graph.facebook.com/v18.0/${waPhoneId}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${waToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[WhatsApp] Send failed:', err)
    } else {
      console.log('[WhatsApp] pioneer_welcome sent to', phone)
    }
  } catch (err) {
    console.error('[WhatsApp] Network error:', err)
  }
}

// ─── DB Save (real or mock) ───────────────────────────────────────────────────
async function savePioneerProfile(data: OnboardingPayload): Promise<string> {
  if (!hasDatabase) {
    // Mock mode: generate a deterministic-ish ID
    const mockId = `pioneer-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
    console.log(
      '[DB mock] Would save pioneer profile:',
      JSON.stringify({ id: mockId, ...data }, null, 2)
    )
    return mockId
  }

  // Real DB save: update user profile with onboarding data
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    // No session — still save locally via mock mode
    return `pioneer-anon-${Date.now().toString(36)}`
  }

  // Update user with onboarding preferences
  const user = await db.user.update({
    where: { id: session.user.id },
    data: {
      country: data.fromCountry,
      phone: data.phone ?? null,
    },
  })

  // Upsert profile with pioneer-specific data
  await db.profile.upsert({
    where: { userId: session.user.id },
    create: {
      userId: session.user.id,
      headline: data.headline,
      bio: data.bio ?? '',
      skills: data.skills,
      pioneerType: data.pioneerType,
    },
    update: {
      headline: data.headline,
      bio: data.bio ?? '',
      skills: data.skills,
      pioneerType: data.pioneerType,
    },
  })

  return user.id
}

// ─── POST /api/onboarding ─────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Parse body
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate
  const parsed = OnboardingSchema.safeParse(body)
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors
    const firstError = Object.values(fieldErrors).flat()[0] ?? 'Validation failed'
    return NextResponse.json({ success: false, error: firstError, fieldErrors }, { status: 422 })
  }

  const data = parsed.data

  // Compute match count using matching engine
  const pioneerProfile: PioneerProfile = {
    pioneerType: data.pioneerType,
    fromCountry: data.fromCountry,
    toCountries: data.toCountries,
    skills: data.skills,
    headline: data.headline,
  }
  const matches = rankPathsForPioneer(pioneerProfile, MOCK_PATHS)
  const strongMatches = matches.filter((m) => m.score >= 40)

  // Save profile (mock or real)
  let pioneerId: string
  try {
    pioneerId = await savePioneerProfile(data)
  } catch (err) {
    console.error('[Onboarding] DB save failed:', err)
    return NextResponse.json(
      { success: false, error: 'Failed to save profile. Please try again.' },
      { status: 500 }
    )
  }

  // Queue WhatsApp welcome (fire-and-forget — don't block the response)
  if (data.phone) {
    const nameFromHeadline = data.headline.split('|')[0].trim().split(' ').slice(0, 2).join(' ')
    queueWelcomeWhatsApp(
      data.phone,
      nameFromHeadline || 'Pioneer',
      data.pioneerType,
      strongMatches.length
    ).catch((err) => console.error('[WhatsApp queue] Error:', err))
  }

  // Build welcome message based on pioneer type
  const welcomeMessages: Record<string, string> = {
    explorer: 'Your wilderness begins now. The wild is calling.',
    professional: 'Your network is ready. Time to make your mark.',
    artisan: 'Your craft has a global stage. Let&apos;s find your audience.',
    guardian: 'The world needs its guardians. Your path is open.',
    creator: 'Your story is ready to be told. The camera is rolling.',
    healer: 'Your calling has found you. Lives are waiting.',
  }

  return NextResponse.json(
    {
      success: true,
      pioneerId,
      matchCount: strongMatches.length,
      topMatch: matches[0] ?? null,
      welcomeMessage: welcomeMessages[data.pioneerType] ?? 'Welcome to the BeNetwork, Pioneer!',
      nextStep: '/ventures',
      whatsAppQueued: Boolean(data.phone),
    },
    { status: 201 }
  )
}

// ─── GET /api/onboarding — health check ──────────────────────────────────────
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/onboarding',
    method: 'POST',
    status: 'active',
    dbConnected: Boolean(process.env.DATABASE_URL),
    whatsAppConfigured: Boolean(process.env.WHATSAPP_TOKEN),
  })
}
