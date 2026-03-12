---
name: becountry-security
description: Security audit for Be[Country] — auth, API routes, env vars, data exposure, OWASP checks, multi-country credential isolation.
---

# Be[Country] Security Audit

## When to Use

Run before deployment, after auth changes, or when the user asks for a security review.

## Multi-Country Awareness

Each Be[Country] deployment (BeKenya, BeGermany, etc.) has isolated credentials:

- Different DATABASE_URL per instance
- Different GOOGLE_CLIENT_ID/SECRET per OAuth app
- Different payment credentials (M-Pesa KE, SEPA DE, Flutterwave NG)
- Same codebase — env var swap via `NEXT_PUBLIC_COUNTRY_CODE`

## Audit Checklist

### 1. Credential Safety

- Grep for hardcoded secrets: `grep -r "sk_live\|pk_live\|CONSUMER_KEY\|API_KEY\|SECRET" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules`
- Verify `.env.local` is in `.gitignore`
- Check no `.env` files are committed: `git log --all --diff-filter=A -- "*.env*"`
- Verify `NEXTAUTH_SECRET` is set and sufficiently random (≥32 chars)

### 2. Authentication

- Read `lib/auth.ts` — verify PrismaAdapter only wired when `DATABASE_URL` exists
- Check JWT strategy is used (not session DB strategy)
- Verify Credentials provider hashes passwords with bcrypt (cost ≥10)
- Check `/api/auth/register` validates input with Zod
- Check `/api/auth/forgot-password` prevents email enumeration (always returns 200)
- Check `/api/auth/reset-password` uses time-constant token comparison + expiry
- Verify Google OAuth redirect URLs match deployment domain

### 3. API Route Protection

For each file in `app/api/**/route.ts`:

- Check if route requires authentication (session check)
- Check input validation (Zod schemas)
- Check for SQL injection (parameterized queries via Prisma)
- Check rate limiting exists or is planned
- Check CORS headers if applicable

### 4. Data Exposure

- Check API responses don't leak `passwordHash`, `access_token`, or internal IDs
- Verify `select` clauses in Prisma queries exclude sensitive fields
- Check client components don't import server-only modules
- Verify no `console.log` of sensitive data in production

### 5. OWASP Top 10 Quick Check

| Risk                      | Check                                  |
| ------------------------- | -------------------------------------- |
| Injection                 | Prisma parameterizes all queries ✅    |
| Broken Auth               | NextAuth handles session management ✅ |
| Sensitive Data Exposure   | Check API responses                    |
| XXE                       | Next.js handles XML parsing            |
| Broken Access Control     | Check route authorization              |
| Security Misconfiguration | Check headers, CORS                    |
| XSS                       | React auto-escapes JSX ✅              |
| Insecure Deserialization  | Check JSON parsing                     |
| Known Vulnerabilities     | Run `npm audit`                        |
| Insufficient Logging      | Check `lib/logger.ts`                  |

### 6. Multi-Country Isolation

- Verify each Vercel project has its own env vars
- Check no cross-country data leakage in shared DB
- Verify payment credentials are country-specific
- Check `getCountryConfig()` defaults safely

## Output Format

```
## 🔒 Security Audit — Be[Country]

### Credential Safety: ✅/❌
### Authentication: ✅/❌
### API Protection: ✅/❌
### Data Exposure: ✅/❌
### OWASP: ✅/⚠️/❌
### Country Isolation: ✅/❌

### Critical Issues (fix immediately)
1. [issue + fix]

### Warnings (fix before production)
1. [issue + fix]

### Security Score: X/10
```
