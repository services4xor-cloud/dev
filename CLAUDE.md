# Be[X] Platform — CLAUDE.md

> **READ THIS FIRST.** Agentic operating manual. Every session starts here.
> Branch: `main` | Repo: `services4xor-cloud/dev` | Deploy: Vercel auto on push

---

## 1. Mission

**Be[X]** is an identity-first life-routing platform. People define who they are — country, language, craft, faith — and the platform connects them to opportunities, people, and experiences that match their identity.

**Be[X]** where X = Country, Tribe, Location, Skill — anything the Explorer defines. One codebase, all countries and languages. The Explorer's profile dimensions determine their Be[X] context.

**Active deployments:** Kenya (KE), Germany (DE), Switzerland (CH) — same codebase, different `NEXT_PUBLIC_COUNTRY_CODE`.

---

## 2. Vocabulary — Enforce Always

Source of truth: `lib/vocabulary.ts` — import `VOCAB`, never hardcode.

| Say This        | Never Say                    | Meaning                           |
| --------------- | ---------------------------- | --------------------------------- |
| **Explorer**    | user, job seeker, candidate  | Person seeking opportunities      |
| **Host**        | employer, company, recruiter | Org offering Opportunities        |
| **Opportunity** | job, vacancy, listing        | What Hosts post                   |
| **Exchange**    | application, submission      | Explorer engaging an Opportunity  |
| **Experience**  | tour, booking, gig           | Cultural + professional placement |
| **Discovery**   | search, finder, filter       | Identity capture + matching       |
| **Hub**         | dashboard                    | Explorer or Host dashboard        |
| **Corridor**    | migration path               | Country route (KE→DE, KE→GB...)   |

**Legacy terms (removed from codebase, never reintroduce):** Pioneer, Anchor, Path, Chapter, Venture, Compass, Gate.

---

## 3. Autonomous Operation

**Full autonomous operation granted.** No approval needed for code.

**Always do:** Create/edit/delete files. Run npm/git/prisma/next/jest. Commit + push to `main`. Update `PROGRESS.md` after features. Write questions to `ASK.md`.

**Never do:** Real financial transactions. Expose credentials. Delete the repo or modify DNS.

---

## 4. Build Rules

1. **TDD** — Test first, implement, refactor
2. **`'use client'`** at line 1 for any file with `onClick`, `useState`, `useEffect`
3. **`prisma generate`** before `next build` (in `package.json`)
4. **Brand colors** via Tailwind tokens from `DESIGN_SYSTEM.md`
5. **Single source of truth** per domain (see `lib/` modules)
6. **KISS** — DRY, YAGNI, no over-engineering

---

## 5. Brand Quick Ref

```
Primary:    #5C0A14  → bg-brand-primary
Accent:     #C9A227  → text-brand-accent, border-brand-accent/30
Background: #0A0A0F  → bg-brand-bg
Surface:    #111118  → bg-brand-surface
```

Full rules → `DESIGN_SYSTEM.md`

---

## 6. Tech Stack

| Layer      | Tech                                            |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 14 App Router (TypeScript)              |
| Styling    | Tailwind CSS + golden ratio φ=1.618 tokens      |
| DB         | Prisma 5 + PostgreSQL (Neon) — hybrid graph     |
| Auth       | NextAuth.js v4 (Google OAuth + Magic Link)      |
| AI         | Anthropic Claude API (claude-sonnet-4-20250514) |
| Payments   | M-Pesa Daraja v2 (KE) · Stripe (INT)            |
| Email      | Resend                                          |
| Testing    | Jest 30 (247/247, 21 suites) · Playwright       |
| CI/CD      | GitHub Actions → Vercel (auto-deploy on push)   |
| Formatting | Prettier + ESLint + Husky pre-commit            |

---

## 7. Architecture

**Hybrid graph model:** Node + Edge tables in PostgreSQL (triple-store pattern) alongside relational auth/payment/messaging.

**14 Prisma models:** User, Account, Session, VerificationToken, Node, Edge, Payment, Conversation, Message, AgentChat, Referral, Review, Notification, NotificationPreference

**Data flow:** Map (country selection) → sessionStorage → Agent/Opportunities pages. Dimensions flow as filters between pages via `bex-map-enriched`, `bex-map-filters`, `bex-map-enriched-names`.

---

## 8. Repo Map

```
app/
├── page.tsx              # Homepage — fullscreen map (MapLibre GL JS, 177 countries)
├── agent/                # AI route advisor (Claude API)
├── opportunities/        # Opportunity feed + dimension filtering
├── profile/              # Explorer profile
├── discovery/            # Identity capture + matching
├── exchange/[id]/        # Exchange detail
├── explorers/            # Explorer directory
├── host/                 # Host dashboard
├── onboarding/           # Identity onboarding flow
├── be/[country]/         # Country detail pages
├── me/                   # Explorer hub
├── messages/             # Messaging
├── notifications/        # Notifications
├── payments/             # Payment management
├── admin/                # Admin dashboard
├── about/ pricing/ contact/ login/ signup/ referral/
│   privacy/ settings/ offline/
└── api/                  # 19 API route groups
    ├── auth/ map/ agent/ identity/ onboarding/
    ├── opportunities/ exchanges/ explorers/ host/
    ├── messages/ notifications/ payments/ referral/
    ├── discovery/ reviews/ users/ impact/ admin/ country/
    └── ...

lib/                      # Core libraries (11 modules)
├── vocabulary.ts         # Be[X] terms (Explorer/Host/Opportunity/...)
├── country-selector.ts   # 185 countries, 100+ languages, proximity engine
├── ai.ts                 # Claude AI agent — persona builder + chat
├── graph.ts              # Graph queries (Node/Edge)
├── auth.ts               # NextAuth config (authOptions)
├── db.ts                 # Prisma client
├── dimensions.ts         # Dimension filter logic
├── mpesa.ts              # M-Pesa integration
├── geo.ts                # Geography utils
├── notifications.ts      # Notification helpers
└── country-api.ts        # Country API client

types/domain.ts           # Core entities + enums
components/               # Shared UI components
__tests__/                # Jest (247 tests, 21 suites)
prisma/schema.prisma      # DB schema (14 models)
```

---

## 9. Commands

```bash
npm run dev             # localhost:3000
npm run build           # prisma generate + next build
npm run test            # Jest (247/247)
npm run format          # Prettier
npm run typecheck       # TypeScript strict
npx playwright test     # Playwright E2E
npx prisma db push      # Sync schema to Neon
npx prisma generate     # Regenerate Prisma client
```

---

## 10. Session Workflow

```
1. Read PROGRESS.md    → current state
2. Build               → follow DESIGN_SYSTEM.md for UI
3. Test                → npm run test
4. Update PROGRESS.md  → log what's done
5. Commit + push       → Vercel auto-deploys
```

| Error               | Fix                                     |
| ------------------- | --------------------------------------- |
| Hydration error     | Add `'use client'` at line 1            |
| Prisma client error | `npx prisma generate`                   |
| Build blocked       | Check `HUMAN_MANUAL.md` (env var)       |
| Module not found    | Check `tsconfig.json` `@/*` paths       |
| Brand violation     | Check `DESIGN_SYSTEM.md` forbidden list |

---

## 11. Deploy

```
GitHub push → CI (lint + typecheck + jest) → Vercel
Project: tobias-projects-81752e2c / dev
```

---

## 12. Skills (6)

Skills live in `.claude/skills/*.md`. Only these exist:

| Skill          | Purpose                                   |
| -------------- | ----------------------------------------- |
| `bex-push`     | Pre-push checks + deploy verification     |
| `bex-status`   | Full platform health check                |
| `bex-security` | Security audit (auth, API, OWASP)         |
| `bex-cleanup`  | Boy Scout Rule — leave code cleaner       |
| `bex-deploy`   | Deployment pipeline + multi-country setup |
| `bex-review`   | Design + UI review (brand, a11y, vocab)   |

---

## 13. Docs

| Doc                    | Purpose                            |
| ---------------------- | ---------------------------------- |
| **`PROGRESS.md`**      | What's done, what's next, blockers |
| **`DESIGN_SYSTEM.md`** | Brand tokens, components, rules    |
| **`HUMAN_MANUAL.md`**  | Steps only humans can do           |
| **`ASK.md`**           | Agent questions for owner (async)  |

---

_Last updated: Session 76 (2026-03-27)_
