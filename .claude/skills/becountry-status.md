---
name: becountry-status
description: Show full status of the Be[Country] platform — DB health, deployed pages, auth state, email readiness, seed data, and test results.
---

# Be[Country] Platform Status

When invoked, perform a comprehensive platform health check:

## Checklist (run all in parallel where possible)

1. **Database Health** — Run Prisma/DB checks for User, Profile, Path, Thread, AgentProfile, Experience (see `prisma/schema.prisma` for model list)
2. **Auth Status** — Check .env.local for NEXTAUTH_SECRET, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
3. **Email Status** — Check .env.local for RESEND_API_KEY
4. **TypeScript** — Run `npx tsc --noEmit 2>&1 | tail -5`
5. **Tests** — Run `npm test 2>&1 | tail -10`
6. **Git Status** — Run `git status --short` and `git log --oneline -3`
7. **Page Inventory** — Glob for `app/**/page.tsx` and count
8. **API Routes** — Glob for `app/api/**/route.ts` and count

## Output Format

Present results as a clean status table:

| Component  | Status | Details                     |
| ---------- | ------ | --------------------------- |
| Database   | ✅/❌  | X users, Y paths, Z threads |
| Auth       | ✅/❌  | Google OAuth + Credentials  |
| Email      | ✅/❌  | Resend configured           |
| TypeScript | ✅/❌  | 0 errors                    |
| Tests      | ✅/❌  | X/Y passing                 |
| Pages      | ✅     | N pages                     |
| API Routes | ✅     | N routes                    |
| Git        | ✅/❌  | Clean/dirty, last commit    |
