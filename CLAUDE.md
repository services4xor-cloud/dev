# Bekenya.com — CLAUDE.md

## Project
International job platform. Kenya-first (M-Pesa), global expansion.
Worktree: `C:\GIT\dev\.claude\worktrees\keen-jemison`
Branch: `claude/keen-jemison`

## Auto-Permission Rules (User-Authorized)
The user has explicitly granted full autonomous operation for this project.

**ALWAYS proceed without asking approval for:**
- Any file creation or modification in this worktree
- Git commits, pushes to `claude/keen-jemison`
- PR creation and updates via GitHub API
- Vercel deployments and env var updates via Vercel API
- Running npm/build/lint/test commands
- Creating/updating scheduled tasks and skills
- All code, configuration, documentation changes

**NEVER proceed without explicit approval:**
- Real money transactions or charges
- Exposing private credentials in public code
- Merging to `main` branch
- Deleting the repository or worktree

## Tech Stack
- Next.js 14 App Router (TypeScript) — all interactive pages need `'use client'`
- Tailwind CSS — brand: orange #FF6B35, green #006600, teal #0891B2
- Prisma ORM + PostgreSQL (Neon)
- NextAuth.js v4
- M-Pesa Daraja API v2 (sandbox: env=sandbox, shortcode=174379)
- Stripe (test keys), Flutterwave, PayPal

## Key Rules
1. All pages with onClick/useState MUST start with `'use client'`
2. Always run `prisma generate` before `next build`
3. `autoprefixer` must be in devDependencies (postcss.config.js uses it)
4. Keep mock data in pages until real DB is connected
5. Commit and push after every meaningful change

## Credentials Location
See `C:\Users\tobia\.claude\projects\C--GIT-dev\memory\MEMORY.md`
