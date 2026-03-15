---
name: bex-push
description: Pre-push quality checks + deploy verification for Be[X] platform
---

# Push to Production

## Pre-Push Checks

```bash
npx tsc --noEmit          # 0 errors
npm run test              # all pass
npm run format -- --check # no diffs
```

## Push

```bash
git push origin main
```

## Verify Deploy

Vercel auto-deploys on push. Check:

- https://dev-git-main-tobias-projects-81752e2c.vercel.app/
- Build log in Vercel dashboard

## After Push

Update `PROGRESS.md` with what changed.
