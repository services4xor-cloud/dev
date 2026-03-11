# Be[Country] Platform — CLAUDE.md

> **READ THIS FIRST.** Agentic operating manual. Every session starts here.
> Branch: `main` | Repo: `services4xor-cloud/dev` | Deploy: Vercel auto on push

---

## 1. Mission in One Paragraph

**Be[Country]** is an identity-first life-routing platform that reverses colonial economic flows by empowering people in the Global South to move, work, and thrive on their own terms. Current deployment: **BeKenya**. One codebase → many countries via `NEXT_PUBLIC_COUNTRY_CODE`. Every Pioneer placed, every safari booked, every KES 50 to UTAMADUNI is structural change through technology.

---

## 2. Document Index (read in order if uncertain)

| Doc                            | Purpose                                                   | When to Read                  |
| ------------------------------ | --------------------------------------------------------- | ----------------------------- |
| **`CLAUDE.md`** ← YOU ARE HERE | Master agent gateway                                      | Every session start           |
| **`PROGRESS.md`**              | Live state tracker — what's done, what's next, blockers   | Before building anything      |
| **`PRD.md`**                   | Product requirements, user flows, acceptance criteria     | Before adding features        |
| **`ROADMAP.md`**               | Strategic phases, sprints, success metrics, risk register | Phase/sprint planning         |
| **`DESIGN_SYSTEM.md`**         | Brand tokens, component patterns, design rules            | Before writing any UI         |
| **`ARCHITECTURE.md`**          | Technical structure, data model, API patterns             | Before touching lib/ or API   |
| **`REQUIREMENTS.md`**          | User requirements, data rules, decisions log              | Before refactoring            |
| **`TESTING.md`**               | Jest + Playwright strategy, test files, CI integration    | Before writing tests          |
| **`HUMAN_MANUAL.md`**          | Steps only humans can do (DB, OAuth, Payments)            | When hitting env-var blockers |

**Update `PROGRESS.md` after every completed feature. This is not optional.**

---

## 3. Vocabulary — Enforce Always

| Say This    | Never Say                    | Meaning                             |
| ----------- | ---------------------------- | ----------------------------------- |
| **Pioneer** | user, job seeker, candidate  | Person seeking paths/experiences    |
| **Anchor**  | employer, company, recruiter | Org offering Paths                  |
| **Path**    | job, vacancy, listing        | What Anchors post                   |
| **Chapter** | application, submission      | Pioneer engaging a Path             |
| **Venture** | tour, booking, gig           | Experience + professional placement |
| **Compass** | search, finder, filter       | 4-step smart route wizard           |
| **Gate**    | country page                 | `/be/[country]` landing             |
| **Route**   | migration path               | Country corridor (KE→DE, KE→GB…)    |

Source: `lib/vocabulary.ts` — import `VOCAB`, never hardcode these strings.

---

## 4. Autonomous Operation Rules

**Owner has granted full autonomous operation.** No approval needed for code.

### Always do:

- Create / edit / delete any file in this repo
- Run `npm`, `git`, `prisma`, `next`, `jest` commands freely
- Commit + push to `main` after every meaningful change
- Update `PROGRESS.md` after completing each feature

### Never do:

- Real financial transactions (live M-Pesa / Stripe charges)
- Expose credentials in committed code
- Delete the GitHub repository or modify DNS

---

## 5. Critical Build Rules

1. **`'use client'`** at line 1 for any file with `onClick`, `useState`, `useEffect`
2. **`prisma generate`** runs before `next build` — already in `package.json`
3. **`autoprefixer`** in devDependencies — required by `postcss.config.js`
4. **Mock data** lives in `data/mock/` — all pages import from there until `DATABASE_URL` is set
5. **Push after every commit** — Vercel auto-deploys from `main`
6. **Country data** in `lib/country-selector.ts` ONLY — never inline in pages
7. **Brand colors** via Tailwind tokens — never use `#FF6B35` or `orange-*`
8. **Nav/Footer links** in `lib/nav-structure.ts` — never inline in components

---

## 6. Brand Quick Reference

```
Maroon primary:  #5C0A14   → bg-[#5C0A14], btn-primary class
Gold accent:     #C9A227   → text-[#C9A227], border-[#C9A227]/30
Page background: #0A0A0F   → bg-[#0A0A0F]
Card surface:    #111118   → bg-gray-900/60
NEVER use:       #FF6B35, orange-*, amber-*, yellow-*
```

Full brand rules, component patterns, spacing scale → **`DESIGN_SYSTEM.md`**

---

## 7. Tech Stack

| Layer        | Tech                                                  |
| ------------ | ----------------------------------------------------- |
| Framework    | Next.js 14 App Router (TypeScript)                    |
| Styling      | Tailwind CSS + golden ratio φ=1.618 token system      |
| ORM          | Prisma 5 + PostgreSQL (Neon hosted)                   |
| Auth         | NextAuth.js v4 (Google + email/password)              |
| Payments KE  | M-Pesa Daraja API v2 (sandbox ready)                  |
| Payments INT | Stripe (test keys ready)                              |
| Email        | Resend (branded HTML templates)                       |
| Testing      | Jest 30 + Playwright 1.58 visual tests                |
| CI/CD        | GitHub Actions → Vercel (auto-deploy on push to main) |
| Formatting   | Prettier + ESLint + Husky pre-commit hooks            |

---

## 8. Repository Map

```
app/
├── page.tsx                  # Homepage — identity-first Compass landing
├── compass/                  # 4-step route wizard
├── ventures/                 # Unified Paths + Experiences feed
├── experiences/[id]/         # Safari detail + M-Pesa booking
├── pioneers/dashboard/       # Pioneer hub (5 tabs)
├── pioneers/notifications/   # Notification center
├── anchors/dashboard/        # Anchor hub (5 tabs)
├── anchors/post-path/        # Path creation wizard
├── onboarding/               # 5-step Pioneer identity capture
├── be/[country]/             # Country Gates (/be/ke, /be/de, …)
├── charity/                  # UTAMADUNI CBO
├── about, pricing, contact,  # Info pages (all dark theme ✅)
│   business, login, signup,
│   profile, referral, privacy
├── fashion/, media/          # Specialized content pages
├── admin/                    # Admin dashboard
└── api/                      # API routes (paths, chapters, compass, mpesa, auth…)

types/
├── domain.ts                 # Core domain types (Pioneer, Path, Chapter, Payment…)
└── api.ts                    # API contract types (requests, responses, pagination)

services/
└── types.ts                  # Service interfaces (IPathService, IPioneerService…)

data/mock/                    # Centralized mock data (single source of truth)
├── paths.ts, pioneers.ts, admin.ts, skills.ts, pricing.ts
├── homepage.ts, about.ts, charity.ts, business.ts
├── anchors-dashboard.ts, anchors-post-path.ts, profile.ts
├── media.ts, fashion.ts
└── index.ts                  # Barrel export

lib/
├── vocabulary.ts             # BeNetwork terms — single source of truth
├── country-selector.ts       # Geographic data + proximity engine + language registry
├── countries.ts              # 12-country config registry
├── compass.ts                # Route corridors
├── matching.ts               # 4-dimension scoring engine
├── safari-packages.ts        # Kenya experience packages
├── nav-structure.ts          # Nav + Footer link arrays (single source)
├── mpesa.ts                  # M-Pesa Daraja v2
├── email.ts                  # Resend templates
├── whatsapp-templates.ts     # WhatsApp (en/sw/de)
└── db.ts                     # Prisma singleton

components/                   # Nav, Footer, PathCard, CountryPrioritySelector, SectionHeader…
__tests__/                    # Jest unit tests (25/25 pass)
tests/visual/                 # Playwright smoke + brand + responsive tests (89/89 pass)
prisma/schema.prisma          # DB schema (BeNetwork vocabulary throughout)
```

---

## 9. Country Architecture

```typescript
// lib/countries.ts
NEXT_PUBLIC_COUNTRY_CODE=KE  → BeKenya  (M-Pesa, KES, maroon #5C0A14)
NEXT_PUBLIC_COUNTRY_CODE=DE  → BeGermany (Stripe SEPA, EUR)
NEXT_PUBLIC_COUNTRY_CODE=NG  → BeNigeria  (Flutterwave, NGN)
// Same codebase — different Vercel projects
```

---

## 10. Common Commands

```bash
npm run dev             # Dev server → localhost:3000
npm run build           # Prod build (prisma generate + next build)
npm run test            # Jest unit tests (25/25)
npm run format          # Prettier format all files
npm run format:check    # Check formatting without writing
npm run typecheck       # TypeScript strict check
npx playwright test     # Visual smoke + brand + responsive tests (89/89)
npx prisma db push      # Sync schema to DB
```

---

## 11. Agentic Session Workflow

```
1. Read PROGRESS.md → understand current state + blockers
2. Read PRD.md      → understand what to build next
3. Build            → follow phase order, use DESIGN_SYSTEM.md for all UI
4. Test             → npm run test && npx playwright test
5. Update           → PROGRESS.md (features done), REQUIREMENTS.md (new rules)
6. Commit + push    → Vercel auto-deploys
```

### Common error fixes

| Error                 | Fix                                       |
| --------------------- | ----------------------------------------- |
| Hydration error       | Add `'use client'` at line 1              |
| Prisma client error   | `npx prisma generate`                     |
| Build blocked         | Check `HUMAN_MANUAL.md` (missing env var) |
| Module not found      | Check `tsconfig.json` `@/*` paths         |
| Brand color violation | Check `DESIGN_SYSTEM.md` forbidden list   |
| Lint/format error     | `npm run format` then re-stage            |

---

## 12. Deployment

```
GitHub push → CI (lint + typecheck + jest + playwright) → Vercel deploy
Vercel project: tobias-projects-81752e2c / dev
Main alias: dev-git-main-tobias-projects-81752e2c.vercel.app
```

Vercel env vars must be set via dashboard — see `HUMAN_MANUAL.md` for list.

---

_Last updated: Session 15 (2026-03-11)_
