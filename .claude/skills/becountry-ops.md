---
name: becountry-ops
description: Operations and debugging for Be[Country] — error diagnosis, performance checks, deployment monitoring, incident response.
---

# Be[Country] Operations

## When to Use

Run when debugging errors, investigating performance issues, or monitoring deployment health.

## Debugging Workflow

### 1. Error Diagnosis

When an error is reported:

1. Check TypeScript first: `npx tsc --noEmit 2>&1 | grep error`
2. Check build: `npm run build 2>&1 | tail -30`
3. Check tests: `npm test 2>&1 | grep -E "FAIL|PASS|Error"`
4. Check git for recent changes: `git log --oneline -10`
5. Check `OPERATIONS.md` mistake log for recurring patterns

### 2. Common Error Patterns

Read `OPERATIONS.md` and apply:

| Error                 | Cause                  | Fix                                             |
| --------------------- | ---------------------- | ----------------------------------------------- |
| Hydration mismatch    | Missing `'use client'` | Add at line 1                                   |
| Prisma client error   | Missing generate       | `npx prisma generate`                           |
| Module not found      | Path alias issue       | Check `tsconfig.json` `@/*`                     |
| Brand violation       | Wrong color            | Check `DESIGN_SYSTEM.md` forbidden list         |
| Auth redirect loop    | Wrong NEXTAUTH_URL     | Check `.env.local` matches domain               |
| DB connection timeout | Cold start             | Check Neon dashboard, retry                     |
| Build OOM             | Large page             | Check for unbounded `generateAllAgents()` calls |

### 3. Performance Checks

- Build size: Check `npm run build` output for oversized pages (>250kB first load)
- Bundle analysis: `npx next build --analyze` (if configured)
- Agent generation: `generateAllAgents()` produces ~700 agents — should be memoized
- Scoring engine: `scoreDimensions()` is O(1) per pair — fast
- Image optimization: All images should use `next/image`

### 4. Deployment Monitoring

- Vercel project: `dev-git-main-tobias-projects-81752e2c.vercel.app`
- Check deploy status: `vercel ls` or Vercel dashboard
- Check function logs: `vercel logs`
- Check edge function cold starts

### 5. Multi-Country Operations

When switching Be[Country] deployments:

- Verify `NEXT_PUBLIC_COUNTRY_CODE` is set correctly
- Verify country-specific payment credentials exist
- Verify `getCountryConfig()` returns correct values
- Test auth flow with country-specific Google OAuth app

### 6. Incident Response

1. **Identify** — What's broken? (auth, pages, API, DB)
2. **Contain** — Can we revert? `git log --oneline -5`
3. **Fix** — Apply minimal fix
4. **Test** — `npm test && npx tsc --noEmit`
5. **Deploy** — Push to trigger Vercel deploy
6. **Log** — Update `OPERATIONS.md` mistake log

## Output Format

```
## 🔧 Operations Report

### System Health
| Component | Status | Details |
|-----------|--------|---------|

### Issues Found
1. [severity] [description] — [fix]

### Performance
| Metric | Value | Threshold |
|--------|-------|-----------|

### Recent Deployments
| Commit | Date | Status |
|--------|------|--------|

### Ops Score: X/10
```
