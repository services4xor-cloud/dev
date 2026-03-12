---
name: becountry-country-deploy
description: Deploy a new Be[Country] instance — env var setup, payment config, language check, agent verification, brand customization.
---

# Be[Country] Deployment

## When to Use

Run when deploying a new country instance (BeGermany, BeNigeria, etc.) or verifying an existing one.

## Architecture Reminder

- **One codebase** → multiple Vercel projects
- **Country code** drives everything via `NEXT_PUBLIC_COUNTRY_CODE`
- **Same DB schema** → can share or separate Neon projects
- **Brand auto-generates** from country name (BeKenya, BeDeutschland, BeNigeria)

## Deployment Checklist

### 1. Country Configuration Exists

Check `lib/countries.ts` for the target country:

```typescript
// Must have entry in COUNTRIES object:
{
  ;(code,
    name,
    brandName,
    domain,
    flag,
    currency,
    currencySymbol,
    locale,
    phonePrefix,
    primaryColor,
    impactPartner,
    paymentMethods,
    featuredSectors,
    popularSearches,
    heroTagline,
    statsBar)
}
```

### 2. Language Support

Check `lib/country-selector.ts`:

- Country exists in `COUNTRY_OPTIONS` with lat/lng/languages
- Languages listed in `LANGUAGE_REGISTRY`
- Endonyms exist in `lib/endonyms.ts` for the country
- i18n translations available for primary language(s)

### 3. Agent Generation

Check `lib/agents.ts`:

- Country code produces agents via `generateAllAgents()`
- Names sound authentic for the region (name pools per region)
- Cities are correct (top cities per country)
- Languages assigned match country's real languages

### 4. Vercel Project Setup

For each new Be[Country]:

1. Create new Vercel project linked to same GitHub repo
2. Set environment variables:
   ```
   NEXT_PUBLIC_COUNTRY_CODE=[XX]
   NEXTAUTH_URL=https://be[country].com
   NEXTAUTH_SECRET=[unique per instance]
   DATABASE_URL=[can share or separate]
   GOOGLE_CLIENT_ID=[country-specific OAuth app]
   GOOGLE_CLIENT_SECRET=[country-specific]
   RESEND_API_KEY=[shared or separate]
   ```
3. Set custom domain: `be[country].com`
4. Deploy: push to trigger build

### 5. Payment Provider Setup

| Country | Provider         | Credentials Needed                        |
| ------- | ---------------- | ----------------------------------------- |
| KE      | M-Pesa Daraja v2 | MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET |
| DE      | Stripe SEPA      | STRIPE_SECRET_KEY                         |
| NG      | Flutterwave      | FLUTTERWAVE_SECRET_KEY                    |
| CH      | Stripe + TWINT   | STRIPE_SECRET_KEY                         |
| TH      | Bank Transfer    | Manual / PromptPay QR                     |
| US      | Stripe           | STRIPE_SECRET_KEY                         |
| GB      | Stripe           | STRIPE_SECRET_KEY                         |

### 6. Brand Verification

After deployment, verify:

- Logo shows correct brand name (BeKenya, BeDeutschland, etc.)
- Currency displays correctly (KES, EUR, NGN, CHF, etc.)
- Payment methods match country
- Hero tagline is localized
- Sectors match country's economy
- Impact partner is country-specific

### 7. Smoke Test

1. Visit homepage → correct brand + hero
2. Start Discovery → country pre-selected
3. Browse Exchange → agents from target country prominent
4. Check pricing → correct currency
5. Try signup → auth works
6. Check /be/[country] gate → correct content

## Output Format

```
## 🌐 Be[Country] Deployment Report

### Country: [XX] — [Name] — [Brand]

### Configuration
| Item | Status | Value |
|------|--------|-------|
| Country config | ✅/❌ | lib/countries.ts |
| Language support | ✅/❌ | X languages |
| Agent generation | ✅/❌ | Y agents |
| Vercel project | ✅/❌ | URL |
| Payment provider | ✅/❌ | Provider name |
| Brand name | ✅/❌ | Be[X] |

### Smoke Test
| Step | Status |
|------|--------|

### Deploy Score: X/10
### Blockers:
1. [what's needed — who needs to act]
```
