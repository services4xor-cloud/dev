import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AGENT_MODEL } from '@/lib/ai'
import { awsWebIdentityToken, createAnthropicClient } from '@/lib/anthropic-client'

export const dynamic = 'force-dynamic'

type Step = { ok: boolean; detail: string }

/** Error name, status and message (plus cause), never tokens or keys. */
function describe(err: unknown): string {
  if (!(err instanceof Error)) return String(err)
  const status = (err as { status?: number }).status
  const cause =
    err.cause instanceof Error ? ` (cause: ${err.cause.name}: ${err.cause.message})` : ''
  return `${err.name}${status ? ` ${status}` : ''}: ${err.message}${cause}`.slice(0, 600)
}

async function step(run: () => Promise<string>): Promise<Step> {
  try {
    return { ok: true, detail: await run() }
  } catch (err) {
    return { ok: false, detail: describe(err) }
  }
}

/**
 * GET /api/admin/ai-check — admin-only diagnosis of the agent's Anthropic connection:
 * which credential is configured, whether AWS issues a web identity token, whether
 * Anthropic accepts it, and whether a one-token request goes through (billing).
 */
export async function GET() {
  const session = await getServerSession(authOptions)
  const user = session?.user as { role?: string } | undefined
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const federation = !!(
    process.env.ANTHROPIC_FEDERATION_RULE_ID && process.env.ANTHROPIC_ORGANIZATION_ID
  )
  const result: Record<string, unknown> = {
    credential: federation
      ? 'workload-identity-federation'
      : process.env.ANTHROPIC_API_KEY
        ? 'api-key'
        : 'none',
    region: process.env.AWS_REGION ?? null,
  }

  if (federation) {
    result.awsToken = await step(async () => {
      const token = await awsWebIdentityToken()
      return `token issued (${token.length} chars)`
    })
  }

  const client = createAnthropicClient()
  result.anthropicAuth = await step(async () => {
    const page = await client.models.list({ limit: 1 })
    return `authenticated (${page.data.length} model listed)`
  })
  result.anthropicRequest = await step(async () => {
    const res = await client.messages.create({
      model: AGENT_MODEL,
      max_tokens: 1,
      messages: [{ role: 'user', content: 'ping' }],
    })
    return `request ok (stop: ${res.stop_reason})`
  })

  return NextResponse.json(result)
}
