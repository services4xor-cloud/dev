/**
 * Anthropic API client for the server.
 *
 * On AWS (Amplify SSR compute role) the client authenticates with Workload
 * Identity Federation: the role requests a short-lived STS web identity token
 * and the SDK exchanges it for an Anthropic access token. No API key is
 * stored. Set ANTHROPIC_FEDERATION_RULE_ID, ANTHROPIC_ORGANIZATION_ID,
 * ANTHROPIC_SERVICE_ACCOUNT_ID (and ANTHROPIC_WORKSPACE_ID) to turn it on.
 * Without them (local dev) ANTHROPIC_API_KEY is used.
 *
 * Setup: https://platform.claude.com/docs/en/manage-claude/wif-providers/aws
 */
import Anthropic from '@anthropic-ai/sdk'
import { oidcFederationProvider } from '@anthropic-ai/sdk/lib/credentials/oidc-federation'
import { GetWebIdentityTokenCommand, STSClient } from '@aws-sdk/client-sts'

const AUDIENCE = 'https://api.anthropic.com'

/** STS web identity token for the workload's IAM role (regional endpoint, 15 minutes). */
export async function awsWebIdentityToken(): Promise<string> {
  const sts = new STSClient({ region: process.env.AWS_REGION ?? 'eu-central-1' })
  const res = await sts.send(
    new GetWebIdentityTokenCommand({
      Audience: [AUDIENCE],
      SigningAlgorithm: 'RS256',
      DurationSeconds: 900,
    })
  )
  if (!res.WebIdentityToken) throw new Error('STS returned no web identity token')
  return res.WebIdentityToken
}

export function createAnthropicClient(): Anthropic {
  const federationRuleId = process.env.ANTHROPIC_FEDERATION_RULE_ID
  const organizationId = process.env.ANTHROPIC_ORGANIZATION_ID
  if (federationRuleId && organizationId) {
    return new Anthropic({
      credentials: oidcFederationProvider({
        identityTokenProvider: awsWebIdentityToken,
        federationRuleId,
        organizationId,
        serviceAccountId: process.env.ANTHROPIC_SERVICE_ACCOUNT_ID,
        workspaceId: process.env.ANTHROPIC_WORKSPACE_ID,
        baseURL: process.env.ANTHROPIC_BASE_URL ?? AUDIENCE,
        fetch: globalThis.fetch,
      }),
    })
  }
  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}
