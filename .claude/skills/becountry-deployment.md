# Be[Country] Deployment & Pipeline

> Manages deployment pipeline, environment configuration, CI/CD, and release process.

## When to Use

- Before deploying to production
- When setting up new environments
- When debugging deploy failures
- When configuring CI/CD pipeline

## Process

### 1. Pre-Deploy Checklist

```bash
# All must pass before deploy:
npm run typecheck          # TypeScript: 0 errors
npm run test               # Jest: 25/25 pass
npx playwright test        # Playwright: 102/102 pass
npm run build              # Next.js build succeeds
```

### 2. Environment Architecture

| Environment    | URL            | Branch      | Auto-Deploy  |
| -------------- | -------------- | ----------- | ------------ |
| **Production** | bekenya.com    | `main`      | Yes (Vercel) |
| **Preview**    | \*.vercel.app  | PR branches | Yes (Vercel) |
| **Local**      | localhost:3000 | any         | Manual       |

### 3. Environment Variables

#### Required for All Environments

```env
DATABASE_URL=              # Neon PostgreSQL connection string
NEXTAUTH_SECRET=           # Session encryption key
NEXTAUTH_URL=              # Base URL (https://bekenya.com)
NEXT_PUBLIC_COUNTRY_CODE=  # KE, DE, NG, etc.
```

#### Auth Providers

```env
GOOGLE_CLIENT_ID=          # Google OAuth
GOOGLE_CLIENT_SECRET=      # Google OAuth
```

#### Email

```env
RESEND_API_KEY=            # Resend email service
EMAIL_FROM=                # Sender address
```

#### Payment (per country)

```env
# Kenya (M-Pesa)
MPESA_CONSUMER_KEY=        # Daraja API
MPESA_CONSUMER_SECRET=     # Daraja API
MPESA_PASSKEY=             # Online passkey
MPESA_SHORTCODE=           # Business shortcode

# International (Stripe)
STRIPE_SECRET_KEY=         # Stripe API
NEXT_PUBLIC_STRIPE_KEY=    # Stripe publishable
```

### 4. CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
trigger: push to main, pull requests
steps: 1. Install dependencies (npm ci)
  2. Prisma generate
  3. TypeScript check
  4. ESLint
  5. Jest tests
  6. Playwright tests
  7. Build
  8. Deploy (Vercel auto on push)
```

### 5. Multi-Country Deployment

Each country = separate Vercel project, same repo:

```
BeKenya:   NEXT_PUBLIC_COUNTRY_CODE=KE → bekenya.com
BeGermany: NEXT_PUBLIC_COUNTRY_CODE=DE → begermany.com
BeNigeria: NEXT_PUBLIC_COUNTRY_CODE=NG → benigeria.com
```

To deploy a new country:

1. Run `/becountry-country-deploy` skill
2. Create Vercel project with country env vars
3. Configure domain
4. Set payment provider credentials for that country
5. Verify country-specific content loads correctly

### 6. Deploy Troubleshooting

| Issue               | Cause                       | Fix                                   |
| ------------------- | --------------------------- | ------------------------------------- |
| Build fails         | Prisma client not generated | Add `prisma generate` to build script |
| Hydration error     | Missing `'use client'`      | Add directive to component            |
| 500 on API routes   | Missing env vars            | Check Vercel env config               |
| CSS not loading     | Tailwind purge issue        | Check `content` in tailwind.config    |
| Auth redirect fails | Wrong `NEXTAUTH_URL`        | Set to production domain              |

### 7. Rollback Procedure

```bash
# Vercel instant rollback:
# Dashboard → Deployments → Pick previous → Promote to Production

# Git rollback (if needed):
git revert HEAD    # Revert last commit
git push           # Auto-deploys reverted state
```

### 8. Post-Deploy Verification

After every deploy:

1. Visit production URL — homepage loads
2. Check `/api/health` endpoint (if exists)
3. Test login flow (Google OAuth + email/password)
4. Test one critical path (Compass wizard or Path listing)
5. Check browser console for errors
6. Verify correct country branding shows

### 9. Output Format

```markdown
## Deployment Report

### Environment: [Production/Preview]

- **URL:** [deployed URL]
- **Commit:** [SHA]
- **Build:** ✅ Success | ❌ Failed

### Pre-Deploy Checks

- TypeScript: ✅/❌
- Jest: ✅/❌ ([pass]/[total])
- Playwright: ✅/❌ ([pass]/[total])
- Build: ✅/❌

### Post-Deploy Verification

- Homepage: ✅/❌
- Auth: ✅/❌
- Critical path: ✅/❌
- Console errors: ✅ None | ❌ [errors]
```
