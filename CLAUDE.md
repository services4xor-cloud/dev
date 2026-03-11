# Be[Country] Platform — CLAUDE.md

> **READ THIS FIRST.** Agentic operating manual. Every session starts here.
> Branch: `main` | Repo: `services4xor-cloud/dev` | Deploy: Vercel auto on push

---

## 1. Mission

**Be[Country]** is an identity-first life-routing platform that reverses colonial economic flows. People in the Global South move, work, and thrive on their own terms.

**Scale vision:** Be[Country] → Be[Tribe] → Be[Location]. One codebase, infinite identities. Start with countries (BeKenya), expand to tribes (BeMaasai) and locations (BeNairobi). The architecture must support all three levels from day one.

**Current deployment:** BeKenya. `NEXT_PUBLIC_COUNTRY_CODE=KE`.

---

## 2. Document Index

| Doc                    | Purpose                            | When to Read         |
| ---------------------- | ---------------------------------- | -------------------- |
| **`CLAUDE.md`** ←      | Master agent gateway               | Every session        |
| **`PROGRESS.md`**      | What's done, what's next, blockers | Before building      |
| **`PRD.md`**           | Product requirements + user flows  | Before features      |
| **`ROADMAP.md`**       | Phases, sprints, metrics, risks    | Planning             |
| **`DESIGN_SYSTEM.md`** | Brand tokens, components, rules    | Before any UI        |
| **`ARCHITECTURE.md`**  | Tech structure, data model, APIs   | Before lib/ or API   |
| **`REQUIREMENTS.md`**  | User requirements + decisions log  | Before refactoring   |
| **`TESTING.md`**       | Jest + Playwright strategy         | Before tests         |
| **`HUMAN_MANUAL.md`**  | Steps only humans can do           | Env-var blockers     |
| **`OPERATIONS.md`**    | Agent decision tree + mistake log  | Debug agent behavior |
| **`ASK.md`**           | Agent questions for owner (async)  | When questions arise |

**After every feature:** Update `PROGRESS.md`. Not optional.
**Questions for owner:** Write to `ASK.md`. Never interrupt the session.

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

Source: `lib/vocabulary.ts` — import `VOCAB`, never hardcode.

---

## 4. Autonomous Operation

**Full autonomous operation granted.** No approval needed for code.

### Always do:

- Create / edit / delete any file
- Run `npm`, `git`, `prisma`, `next`, `jest` commands
- Commit + push to `main` after every meaningful change
- Update `PROGRESS.md` after completing each feature
- Write questions to `ASK.md` (never interrupt session)

### Never do:

- Real financial transactions (live M-Pesa / Stripe)
- Expose credentials in committed code
- Delete the GitHub repository or modify DNS

---

## 5. Build Rules

1. **`'use client'`** at line 1 for any file with `onClick`, `useState`, `useEffect`
2. **`prisma generate`** before `next build` (in `package.json`)
3. **Mock data** in `data/mock/` — all pages import from there until `DATABASE_URL` is set
4. **Country data** in `lib/country-selector.ts` ONLY — never inline
5. **Brand colors** via Tailwind tokens — never `#FF6B35`, `orange-*`, `amber-*`, `yellow-*`
6. **Nav/Footer links** in `lib/nav-structure.ts` — never inline
7. **All design** from `DESIGN_SYSTEM.md` — no ad-hoc styling
8. **KISS** — keep it simple, no over-engineering

---

## 6. Brand Quick Ref

```
Primary:    #5C0A14  → bg-brand-primary, btn-primary
Accent:     #C9A227  → text-brand-accent, border-brand-accent/30
Background: #0A0A0F  → bg-brand-bg
Surface:    #111118  → bg-brand-surface
NEVER:      #FF6B35, orange-*, amber-*, yellow-*
```

Full rules → **`DESIGN_SYSTEM.md`**

---

## 7. Tech Stack

| Layer      | Tech                                          |
| ---------- | --------------------------------------------- |
| Framework  | Next.js 14 App Router (TypeScript)            |
| Styling    | Tailwind CSS + golden ratio φ=1.618 tokens    |
| ORM        | Prisma 5 + PostgreSQL (Neon)                  |
| Auth       | NextAuth.js v4 (Google + email/password)      |
| Payments   | M-Pesa Daraja v2 (KE) · Stripe (INT)          |
| Email      | Resend (branded templates)                    |
| Testing    | Jest 30 (25/25) · Playwright 1.58 (102/102)   |
| CI/CD      | GitHub Actions → Vercel (auto-deploy on push) |
| Formatting | Prettier + ESLint + Husky pre-commit          |

---

## 8. Repo Map

```
app/
├── page.tsx                  # Homepage
├── compass/                  # 4-step route wizard
├── ventures/                 # Unified Paths + Experiences feed
├── experiences/[id]/         # Detail + booking
├── pioneers/dashboard/       # Pioneer hub (5 tabs)
├── anchors/dashboard/        # Anchor hub (5 tabs)
├── anchors/post-path/        # Path creation wizard
├── onboarding/               # 5-step Pioneer identity capture
├── be/[country]/             # Country Gates
├── offerings/                # International offerings
├── charity/                  # UTAMADUNI CBO
├── admin/                    # Admin dashboard
├── about, pricing, contact, business, login, signup,
│   profile, referral, privacy, fashion/, media/
└── api/                      # API routes

lib/                          # Core libraries (vocabulary, countries, compass, matching, etc.)
types/                        # domain.ts + api.ts
services/                     # Service interfaces
data/mock/                    # 15 mock modules + barrel export
components/                   # Shared UI
__tests__/                    # Jest (25/25)
tests/visual/                 # Playwright (102/102)
prisma/schema.prisma          # DB schema
```

---

## 9. Country Architecture

```typescript
NEXT_PUBLIC_COUNTRY_CODE=KE  → BeKenya   (M-Pesa, KES)
NEXT_PUBLIC_COUNTRY_CODE=DE  → BeGermany (Stripe SEPA, EUR)
NEXT_PUBLIC_COUNTRY_CODE=NG  → BeNigeria (Flutterwave, NGN)
// Same codebase → different Vercel projects
```

**Future:** Be[Tribe] and Be[Location] layers within each country.

---

## 10. Commands

```bash
npm run dev             # localhost:3000
npm run build           # prisma generate + next build
npm run test            # Jest (25/25)
npm run format          # Prettier
npm run typecheck       # TypeScript strict
npx playwright test     # Playwright (102/102)
npx prisma db push      # Sync schema
```

---

## 11. Session Workflow

```
1. Read PROGRESS.md    → current state
2. Read PRD.md         → what to build
3. Build               → follow DESIGN_SYSTEM.md for UI
4. Test                 → npm run test && npx playwright test
5. Update PROGRESS.md  → log what's done
6. Commit + push       → Vercel auto-deploys
```

| Error               | Fix                                     |
| ------------------- | --------------------------------------- |
| Hydration error     | Add `'use client'` at line 1            |
| Prisma client error | `npx prisma generate`                   |
| Build blocked       | Check `HUMAN_MANUAL.md` (env var)       |
| Module not found    | Check `tsconfig.json` `@/*` paths       |
| Brand violation     | Check `DESIGN_SYSTEM.md` forbidden list |

---

## 12. Deploy

```
GitHub push → CI (lint + typecheck + jest + playwright) → Vercel
Project: tobias-projects-81752e2c / dev
```

---

_Last updated: Session 20 (2026-03-11)_
