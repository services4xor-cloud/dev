---
name: bex-status
description: Full platform health check — DB, tests, types, git state
---

# Platform Status Check

Run all checks and report:

```bash
npx tsc --noEmit                    # TypeScript errors
npm run test                        # Jest suite (expect 361+ pass, 24 suites)
git status                          # Clean working tree?
git log --oneline -5                # Recent commits
npx prisma db push --dry-run        # Schema in sync?
```

## What to Report

- TypeScript: X errors
- Tests: X/X pass (X suites)
- Git: clean/dirty, branch, last commit
- DB: schema sync status
- Pages: count `app/*/page.tsx`
- API routes: count `app/api/*/route.ts`
