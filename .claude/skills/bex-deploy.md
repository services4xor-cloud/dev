---
name: bex-deploy
description: Deployment pipeline + multi-country setup
---

# Deployment

## Single Country Deploy

Each country = separate Vercel project, same codebase.

```
NEXT_PUBLIC_COUNTRY_CODE=KE  → BeKenya   (M-Pesa, KES)
NEXT_PUBLIC_COUNTRY_CODE=DE  → BeGermany (Stripe SEPA, EUR)
NEXT_PUBLIC_COUNTRY_CODE=CH  → BeSwitzerland (Stripe, CHF)
```

## Required Env Vars

```
DATABASE_URL              # Neon PostgreSQL
NEXTAUTH_URL              # https://domain.com
NEXTAUTH_SECRET           # openssl rand -base64 32
GOOGLE_CLIENT_ID          # OAuth
GOOGLE_CLIENT_SECRET      # OAuth
ANTHROPIC_API_KEY         # Claude AI agent
RESEND_API_KEY            # Email
NEXT_PUBLIC_COUNTRY_CODE  # KE, DE, CH, etc.
```

## New Country Checklist

1. Create Vercel project with env vars
2. Verify country exists in `lib/country-selector.ts` (COUNTRY_OPTIONS)
3. Verify country config in `lib/countries.ts`
4. Check payment provider setup (M-Pesa for KE, Stripe for others)
5. Deploy and smoke test: map loads, country glows, agent works
