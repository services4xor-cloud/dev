// app/api/social/route.ts
// Social media automation API
//
// GET  /api/social               — list all queued posts (optionally filter by status/country)
// POST /api/social               — create & queue a new social post
//
// This module uses an in-memory store until a real DB is connected (see TODO_HUMAN.md).
// When platform API keys are present in env, posts are dispatched immediately or scheduled.
//
// Platform dispatch is intentionally thin right now — add the real SDK calls per platform
// in the `dispatchPost` function below.  Each platform's required env vars are documented
// in lib/social-media.ts → SOCIAL_CONFIGS[platform].apiEnvVars

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import {
  SocialPost,
  SocialPlatform,
  PostType,
  PostStatus,
  generatePathPostCopy,
} from '@/lib/social-media'

// ──────────────────────────────────────────────
// In-memory store (replace with Prisma/DB later)
// ──────────────────────────────────────────────
const store: SocialPost[] = []

let idCounter = 1
function nextId(): string {
  return `post_${Date.now()}_${idCounter++}`
}

// ──────────────────────────────────────────────
// Zod schemas
// ──────────────────────────────────────────────

const SOCIAL_PLATFORMS = [
  'instagram',
  'tiktok',
  'facebook',
  'whatsapp_business',
  'twitter_x',
  'linkedin',
  'youtube',
  'telegram',
  'snapchat',
] as const

const POST_TYPES = [
  'new_path',
  'safari_package',
  'pioneer_success',
  'charity_update',
  'anchor_spotlight',
  'seasonal_promotion',
] as const

const CreatePostSchema = z.object({
  type: z.enum(POST_TYPES),
  title: z.string().min(1, 'Title is required').max(200),
  body: z.string().min(1, 'Body is required').max(2000),
  imageUrl: z.string().url().optional(),
  link: z.string().url().optional(),
  /** Which platforms to publish on */
  platforms: z
    .array(z.enum(SOCIAL_PLATFORMS))
    .min(1, 'At least one platform is required'),
  /** ISO-8601 datetime string — omit to post immediately */
  scheduledFor: z.string().datetime().optional(),
  /** ISO2 country code */
  countryCode: z.string().length(2).toUpperCase(),
  /**
   * If provided, auto-generate per-platform copy from a path/venture.
   * Overrides `body` per platform.
   */
  autoGenerate: z
    .object({
      pathTitle: z.string(),
      anchor: z.string(),
      location: z.string(),
      ventureType: z.string(),
    })
    .optional(),
})

type CreatePostInput = z.infer<typeof CreatePostSchema>

const GetQuerySchema = z.object({
  status: z.enum(['draft', 'scheduled', 'posted', 'failed']).optional(),
  countryCode: z.string().length(2).optional(),
  platform: z.enum(SOCIAL_PLATFORMS).optional(),
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
})

// ──────────────────────────────────────────────
// Platform dispatch stubs
// ──────────────────────────────────────────────

/**
 * Attempt to post to a single platform.
 *
 * Currently a stub — returns mock success.
 * Replace each `case` block with the real SDK / REST call once API keys are set.
 *
 * Required env vars per platform: see lib/social-media.ts → SOCIAL_CONFIGS[platform].apiEnvVars
 */
async function dispatchToPlatform(
  post: SocialPost,
  platform: SocialPlatform,
  copyOverride?: string,
): Promise<{ success: boolean; postId?: string; error?: string }> {
  const body = copyOverride ?? post.body

  switch (platform) {
    case 'instagram': {
      // TODO: Meta Graph API — POST /{ig-user-id}/media + /{ig-user-id}/media_publish
      // Requires: INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_BUSINESS_ACCOUNT_ID
      // Docs: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
      console.log('[social] instagram stub:', { title: post.title, body })
      return { success: true, postId: `ig_mock_${Date.now()}` }
    }

    case 'tiktok': {
      // TODO: TikTok Content Posting API — POST /v2/post/publish/video/init/
      // Requires: TIKTOK_ACCESS_TOKEN, TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET
      // Docs: https://developers.tiktok.com/doc/content-posting-api-get-started
      console.log('[social] tiktok stub:', { title: post.title, body })
      return { success: true, postId: `tt_mock_${Date.now()}` }
    }

    case 'whatsapp_business': {
      // TODO: Meta WhatsApp Cloud API — POST /{phone-number-id}/messages
      // Requires: WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_BUSINESS_ACCOUNT_ID
      // Note: For broadcasts you need approved message templates.
      // Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/messages
      console.log('[social] whatsapp_business stub:', { title: post.title, body })
      return { success: true, postId: `wa_mock_${Date.now()}` }
    }

    case 'facebook': {
      // TODO: Meta Pages API — POST /{page-id}/feed
      // Requires: FACEBOOK_PAGE_ACCESS_TOKEN, FACEBOOK_PAGE_ID
      // Docs: https://developers.facebook.com/docs/pages-api/posts
      console.log('[social] facebook stub:', { title: post.title, body })
      return { success: true, postId: `fb_mock_${Date.now()}` }
    }

    case 'twitter_x': {
      // TODO: Twitter/X API v2 — POST /2/tweets
      // Requires: TWITTER_API_KEY, TWITTER_API_SECRET, TWITTER_ACCESS_TOKEN, TWITTER_ACCESS_TOKEN_SECRET
      // Docs: https://developer.twitter.com/en/docs/twitter-api/tweets/manage-tweets/api-reference/post-tweets
      console.log('[social] twitter_x stub:', { title: post.title, body })
      return { success: true, postId: `x_mock_${Date.now()}` }
    }

    case 'linkedin': {
      // TODO: LinkedIn Marketing API — POST /ugcPosts or /shares
      // Requires: LINKEDIN_ACCESS_TOKEN, LINKEDIN_ORGANIZATION_ID
      // Docs: https://docs.microsoft.com/en-us/linkedin/marketing/integrations/community-management/shares/ugc-post-api
      console.log('[social] linkedin stub:', { title: post.title, body })
      return { success: true, postId: `li_mock_${Date.now()}` }
    }

    case 'youtube': {
      // TODO: YouTube Data API v3 — videos.insert (requires OAuth 2.0 + video file)
      // Requires: YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
      // Docs: https://developers.google.com/youtube/v3/docs/videos/insert
      console.log('[social] youtube stub:', { title: post.title, body })
      return { success: true, postId: `yt_mock_${Date.now()}` }
    }

    case 'telegram': {
      // TODO: Telegram Bot API — POST /bot{token}/sendMessage or /sendPhoto
      // Requires: TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID
      // Docs: https://core.telegram.org/bots/api#sendmessage
      const token = process.env.TELEGRAM_BOT_TOKEN
      const chatId = process.env.TELEGRAM_CHANNEL_ID
      if (token && chatId) {
        // Real call (enabled when keys are present):
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text: body, parse_mode: 'Markdown' }),
        })
        const data = await res.json() as { ok: boolean; result?: { message_id: number }; description?: string }
        if (data.ok && data.result) {
          return { success: true, postId: String(data.result.message_id) }
        }
        return { success: false, error: data.description ?? 'Telegram error' }
      }
      console.log('[social] telegram stub (no token):', { body })
      return { success: true, postId: `tg_mock_${Date.now()}` }
    }

    case 'snapchat': {
      // TODO: Snapchat Marketing API — ad creative endpoints
      // Requires: SNAPCHAT_ACCESS_TOKEN, SNAPCHAT_AD_ACCOUNT_ID
      // Docs: https://marketingapi.snapchat.com/docs/
      console.log('[social] snapchat stub:', { title: post.title, body })
      return { success: true, postId: `sc_mock_${Date.now()}` }
    }

    default:
      return { success: false, error: `Unknown platform: ${platform as string}` }
  }
}

/**
 * Dispatch a post to all its platforms.
 * Returns updated post with results filled in.
 */
async function dispatchPost(
  post: SocialPost,
  copyMap?: Partial<Record<SocialPlatform, string>>,
): Promise<SocialPost> {
  const results: SocialPost['results'] = {}

  await Promise.allSettled(
    post.platforms.map(async platform => {
      try {
        results[platform] = await dispatchToPlatform(post, platform, copyMap?.[platform])
      } catch (err) {
        results[platform] = { success: false, error: String(err) }
      }
    }),
  )

  const allFailed = Object.values(results).every(r => !r?.success)
  const anyFailed = Object.values(results).some(r => !r?.success)

  return {
    ...post,
    results,
    status: allFailed ? 'failed' : anyFailed ? 'posted' : 'posted',
    updatedAt: new Date(),
  }
}

// ──────────────────────────────────────────────
// Route handlers
// ──────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const parsed = GetQuerySchema.safeParse(Object.fromEntries(searchParams.entries()))

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { status, countryCode, platform, limit, offset } = parsed.data

  let filtered = store

  if (status) {
    filtered = filtered.filter(p => p.status === (status as PostStatus))
  }
  if (countryCode) {
    filtered = filtered.filter(p => p.countryCode === countryCode.toUpperCase())
  }
  if (platform) {
    filtered = filtered.filter(p => p.platforms.includes(platform as SocialPlatform))
  }

  const total = filtered.length
  const page = filtered.slice(offset, offset + limit)

  return NextResponse.json({ posts: page, total, limit, offset })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = CreatePostSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const input: CreatePostInput = parsed.data
  const now = new Date()

  // Build per-platform copy map if autoGenerate was provided
  let copyMap: Partial<Record<SocialPlatform, string>> | undefined
  if (input.autoGenerate) {
    const { pathTitle, anchor, location, ventureType } = input.autoGenerate
    const allCopy = generatePathPostCopy(pathTitle, anchor, location, ventureType)
    // Only include the requested platforms
    copyMap = {} as Partial<Record<SocialPlatform, string>>
    for (const p of input.platforms) {
      copyMap[p] = allCopy[p]
    }
  }

  const post: SocialPost = {
    id: nextId(),
    type: input.type as PostType,
    title: input.title,
    body: input.body,
    imageUrl: input.imageUrl,
    link: input.link,
    platforms: input.platforms as SocialPlatform[],
    scheduledFor: input.scheduledFor ? new Date(input.scheduledFor) : undefined,
    status: input.scheduledFor ? 'scheduled' : 'draft',
    countryCode: input.countryCode,
    createdAt: now,
    updatedAt: now,
  }

  store.push(post)

  // If no scheduledFor, dispatch immediately
  if (!input.scheduledFor) {
    const dispatched = await dispatchPost(post, copyMap)
    // Update in store
    const idx = store.findIndex(p => p.id === dispatched.id)
    if (idx !== -1) store[idx] = dispatched

    return NextResponse.json({ post: dispatched }, { status: 201 })
  }

  // Scheduled: return the queued post
  // A cron/queue worker (e.g. Vercel Cron) should call dispatchPost at scheduledFor time
  return NextResponse.json({ post }, { status: 201 })
}
