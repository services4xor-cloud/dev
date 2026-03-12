---
name: becountry-push
description: Push BeKenya.com branch to GitHub and verify Vercel deployment — runs pre-push checks, commits, pushes, and monitors deploy.
---

# BeKenya Push & Deploy

## When to Use

Run when the user says "push", "deploy", "ship it", or after completing a feature.

## Pre-Push Checklist

### 1. Code Quality (run in parallel)

- `npx tsc --noEmit` — 0 TypeScript errors required
- `npm test` — All Jest tests must pass
- `npx prettier --check .` — Code formatted

### 2. Sync Check (MANDATORY)

Run `becountry-sync` skill — code, docs, and skills MUST be in sync before push:

- Route/API/test/module counts in PROGRESS.md match reality
- ARCHITECTURE.md reflects current schema and API structure
- Skills reference correct file paths and processes
- CLAUDE.md repo map matches actual file structure
- **If anything is out of sync: fix it before pushing**

### 3. Git State

- `git status` — Check for uncommitted changes
- `git diff --stat` — Review what's changed
- If uncommitted: stage relevant files, commit with descriptive message

### 4. PROGRESS.md Update

- Read current PROGRESS.md
- Append session work summary if not already logged
- Commit the update

### 5. Push

- `git push origin main` — Push to GitHub
- Verify push succeeded

### 6. Deployment Verification

- Note: Vercel auto-deploys on push to main
- Project: `dev-git-main-tobias-projects-81752e2c.vercel.app`
- After push, wait 30 seconds then check deployment status

## Output Format

```
## 🚀 Push Report

### Pre-Push Checks
| Check | Status |
|-------|--------|
| TypeScript | ✅ 0 errors |
| Tests | ✅ X/Y pass |
| Format | ✅ Clean |

### Commit
- SHA: [hash]
- Message: [message]
- Files changed: N

### Push
- Branch: main → origin/main
- Status: ✅ Pushed

### Deploy
- URL: [vercel URL]
- Status: ✅ Building / ⏳ Pending
```

## Important

- NEVER push credentials or .env files
- NEVER force push to main
- Always run checks before pushing
- Update PROGRESS.md before pushing
