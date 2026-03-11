# Be[Country] — Live Progress Tracker

> Update this file after every feature. Claude reads this to know current state.
> Last updated: Session 19 (2026-03-11)
> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [PRD.md](./PRD.md) · [ROADMAP.md](./ROADMAP.md)

---

## Current Focus: Phase 2 — BeKenya Live

Working branch: `main` (direct)
Vercel: Auto-deploys from main

---

## ✅ Phase 1: Foundation (COMPLETE — Sessions 1–14)

### What Was Built

**Platform Core:**

- Next.js 14.2.35 App Router (TypeScript strict, 0 errors)
- Tailwind CSS with BeKenya brand (maroon #5C0A14 + gold #C9A227)
- Prisma schema with full BeNetwork vocabulary (Path, Chapter, Pioneer, Anchor)
- NextAuth.js v4 (Google + email/password)
- Jest 30 test suite (25/25 pass) + Playwright visual tests (102/102 pass)
- CI/CD via GitHub Actions (lint → typecheck → test → build)
- Dev tooling: Prettier, ESLint, Husky pre-commit hooks, .editorconfig

**Library Layer (lib/):**

- `vocabulary.ts` — VOCAB, PIONEER_TYPES, PATH_CATEGORIES
- `country-selector.ts` — 16 countries, 14 languages, Haversine proximity, language matching
- `countries.ts` — 12-country deployment config registry
- `compass.ts` — Country route corridors (KE-DE, KE-GB, KE-AE, KE-US, etc.)
- `matching.ts` — 4-dimension Pioneer↔Path scoring engine
- `safari-packages.ts` — Real Kenya experience packages
- `nav-structure.ts` — Single source for Nav + Footer links
- `mpesa.ts` — M-Pesa Daraja API v2
- `email.ts` — Resend branded HTML templates (maroon/gold)
- `whatsapp-templates.ts` — 10 WhatsApp templates (en/sw/de)
- `social-media.ts` — 9-platform social config + automation

**Type System:**

- `types/domain.ts` — Pioneer, Path, Chapter, Payment, MatchResult, enums
- `types/api.ts` — ApiResponse<T>, PaginatedResponse<T>, all request/response contracts
- `services/types.ts` — Service interfaces (IPathService, IPioneerService, etc.)

**Mock Data Layer (data/mock/):**

- Centralized mock data directory (single source of truth for all pages)
- 14 module files: paths, pioneers, admin, skills, pricing, homepage, about, charity, business, anchors-dashboard, anchors-post-path, profile, media, fashion
- Zero inline mock data remaining in any page file

**Pages (20+):**

- All pages: dark theme (bg-brand-bg), BeNetwork vocabulary, semantic color tokens (zero hardcoded brand hex)
- Homepage, Compass, Ventures, Experiences, Pioneer/Anchor dashboards, Onboarding, Country Gates, Charity, Business, Admin, Fashion, Media, About, Pricing, Contact, Privacy, Profile, Referral, Login, Signup, 404

**API Routes (12+):**

- `/api/paths` — CRUD
- `/api/chapters` — Pioneer opens Chapter on Path
- `/api/compass` — geo detection + route matching
- `/api/onboarding` — Pioneer profile creation
- `/api/search` — smart search with scoring
- `/api/mpesa/stkpush` + `/api/mpesa/callback` — M-Pesa STK Push v2
- `/api/social` — social media queue
- `/api/auth` — NextAuth handlers
- `/api/profile` — Profile CRUD

**Tests (25 Jest + 102 Playwright):**

- Jest: mpesa, paths, vocabulary, matching, safari-packages, compass, whatsapp-templates, social-media
- Playwright: smoke (16/16), brand (32/32), responsive (54/54)

---

## 🔄 Phase 2: BeKenya Live (IN PROGRESS)

### ⛔ Blocked — Human Action Required

These cannot be done by Claude — see [HUMAN_MANUAL.md](./HUMAN_MANUAL.md):

| Item                        | Needed For                | Est. Time |
| --------------------------- | ------------------------- | --------- |
| DATABASE_URL (Neon)         | Everything with real data | 15 min    |
| NEXTAUTH_SECRET             | Auth security             | 1 min     |
| GOOGLE_CLIENT_ID + SECRET   | Google Sign-In            | 15 min    |
| RESEND_API_KEY              | Email notifications       | 5 min     |
| MPESA_CONSUMER_KEY + SECRET | Live M-Pesa payments      | 30 min    |

### Can Build Now (no credentials needed)

- [x] International offerings system — country-aware, purpose-driven recommendations (R15, R16)
- [x] Centralized semantic color token system (session 18)
- [x] Responsive scaling — watch to TV across all key pages (session 18)
- [x] Ventures loading skeleton (session 18)
- [x] End-to-end mock booking flow with engagement nudges (session 19)
- [ ] Loading skeletons for remaining data-fetching pages
- [ ] Error boundaries on all dashboard pages
- [ ] Progressive φ token adoption in Nav, Footer, cards

### After Credentials (Claude can do)

**Database Migration:**

- [ ] `npx prisma migrate deploy` — create tables from schema.prisma
- [ ] Seed initial data: 12 countries, 5 safari packages, Pioneer types
- [ ] Replace mock data arrays with Prisma queries in all pages
- [ ] Add connection pooling config for Neon

**Auth Integration:**

- [ ] Enable Google OAuth in NextAuth config
- [ ] Enable email/password with bcrypt
- [ ] Add session guards to `/pioneers/dashboard`, `/anchors/dashboard`
- [ ] Wire signup → create Pioneer/Anchor in DB
- [ ] Wire login → session with user role (pioneer/anchor/admin)

**Payment Flow:**

- [ ] Wire M-Pesa STK Push button in experience detail pages
- [ ] Implement callback → update payment status in DB
- [ ] Email receipt via Resend
- [ ] WhatsApp receipt via templates

**API Completion:**

- [ ] `/api/paths` — real CRUD against DB
- [ ] `/api/compass` — geo detection + language-aware route scoring
- [ ] `/api/chapters` — real Chapter creation with DB
- [ ] `/api/ventures` — list + filter with Prisma
- [ ] `/api/profile` — CRUD Pioneer profile with DB

---

## 📅 Phase 3: Growth (Future)

- [ ] Pioneer Pro subscription (Stripe billing)
- [ ] Push notifications — Pioneer gets Path match alerts
- [ ] Pioneer ↔ Anchor direct message thread
- [ ] Review system — Pioneers rate Anchors/Ventures
- [ ] Impact dashboard (UTAMADUNI % tracker public)
- [ ] Multi-language UI (en, sw, de)
- [ ] SEO content (Kenya guides, route stories, blog)

---

## 🌍 Phase 4: Be[Country] Expansion (Future)

- [ ] BeGermany (SEPA, EUR, German job market)
- [ ] BeNigeria (Flutterwave, NGN, Lagos tech scene)
- [ ] BeAmerica (Stripe/ACH, USD, US visa sponsors)
- [ ] Multi-country Pioneer profiles
- [ ] Cross-border path matching API

---

## 📊 Current Stats

| Metric                | Value                                     |
| --------------------- | ----------------------------------------- |
| Pages live            | 20+                                       |
| API routes            | 12+                                       |
| Library modules       | 13                                        |
| Mock data modules     | 15                                        |
| Type definition files | 3                                         |
| Jest tests            | 25/25 ✅                                  |
| Playwright tests      | 102 (16 smoke + 32 brand + 54 responsive) |
| TypeScript errors     | 0                                         |
| Countries configured  | 12 (16 in selector)                       |
| Languages             | 14                                        |
| Experience packages   | 6                                         |
| Phase 1               | ✅ Complete                               |
| Phase 2               | 🔄 Blocked on credentials                 |
| Branch                | main (direct)                             |
| CI                    | ✅ GitHub Actions                         |
| Deploy                | Auto via Vercel                           |

---

## Session Log (Reverse Chronological)

### Session 19 (2026-03-11) — End-to-End Mock Booking Flow

- [x] Booking state machine: browsing → paying → confirmed (experience detail page)
- [x] M-Pesa modal wired to "Book This Venture" button (was dead/disconnected)
- [x] MpesaModal updated: `venture` item type, API body aligned to STK Push schema
- [x] Mock card payment flow (2.5s simulated processing → confirmation)
- [x] Confirmation receipt UI with booking ref, celebration CheckCircle, UTAMADUNI impact
- [x] UX engagement nudges: scarcity ("Only X spots left"), social proof ("X Pioneers booked"), live viewers, urgency (next departure date)
- [x] Trust signals: 48hr free cancel, verified provider badges
- [x] Seeded deterministic randomness per package ID (no hydration flicker)
- [x] Compass cross-sell CTA in booking sidebar
- [x] Build: TS 0 errors, preview verified, Vercel auto-deploy

### Session 18 (2026-03-11) — Centralized Semantic Color System + Responsive

- [x] Removed stale `KNOWN_LIGHT_BG_PAGES` brand test skip list (all 32 tests now execute)
- [x] Ventures page loading skeleton (shimmer UI, 600ms simulated load)
- [x] Fixed broken homepage safari links (`/ventures/` → `/experiences/`)
- [x] Responsive scaling: watch → TV across 10 key pages (`3xl:max-w-[1600px]`, heading cascades)
- [x] Fixed profile grid mobile breakpoint (`grid-cols-2` → `grid-cols-1 sm:grid-cols-2`)
- [x] **Centralized color system** — CSS vars in `globals.css` :root as single source of truth
- [x] **Semantic token naming** — `brand-primary`/`brand-accent` (not `brand-maroon`/`brand-gold`)
- [x] Tailwind brand colors mapped to CSS vars with `<alpha-value>` opacity support
- [x] Replaced ~830 hardcoded hex references across 53 files
- [x] Added `surface-elevated`, `success` derivative tokens
- [x] OG image route: JS constants with "keep in sync" comment (Satori can't use CSS vars)
- [x] All inline `style={{}}` hex values → `var(--color-*)` references
- [x] All `rgba(201,162,39,...)` → `rgb(var(--color-accent-rgb) / N)`
- [x] Build: TS 0 errors, Jest 25/25, production build clean

### Session 17 (2026-03-11) — Quality Overhaul: Agents, Code, UI

- [x] Created `OPERATIONS.md` — agent reading order, decision tree, mistake log (transparency)
- [x] Fixed test counts across ALL docs (89/100 → 102 actual: 16 smoke + 32 brand + 54 responsive)
- [x] Fixed ARCHITECTURE.md country list (AU/FR/NL → GH/UG/TZ to match actual countries.ts)
- [x] Fixed `tradeCorrridors` typo (triple 'r') — 9 occurrences across offerings.ts + page
- [x] Replaced hardcoded country list in signup with canonical `COUNTRY_OPTIONS` (rule 5.6)
- [x] Fixed Netherlands incorrectly listed as German-speaking in language registry
- [x] Removed dead export `FEATURED_VENTURES` (defined, barrel-exported, never imported)
- [x] Fixed duplicate score arrays in pioneer dashboard (74 vs 78 → single source)
- [x] Converted onboarding page to dark theme (was cream/white — massive brand violation)
- [x] Fixed all invalid Tailwind opacity syntax (`bg-[#5C0A14/5]` → `bg-[#5C0A14]/5`)
- [x] Replaced teal custom skills badge with gold brand tokens
- [x] Added `OPERATIONS.md` + `/offerings` to CLAUDE.md doc index + repo map
- [x] Updated PROGRESS.md, TESTING.md, ARCHITECTURE.md, README.md session timestamps

### Session 16 (2026-03-11) — Brand Cleanup + International Offerings

- [x] Final amber/yellow sweep — 11 remaining violations fixed across 5 files (zero remaining)
- [x] `lib/offerings.ts` — country-aware, purpose-driven offerings engine
- [x] `data/mock/offerings.ts` — eco-tourism + trade corridor data
- [x] `/offerings` page — auto-detect country, changeable, purpose tabs, route recommendations
- [x] R15 + R16 added to REQUIREMENTS.md (international scale + smart recommendations)
- [x] Nav + Footer updated with offerings link
- [x] Playwright tests updated: `/offerings` in smoke, brand, responsive (89→100 tests)

### Session 15 (2026-03-11) — Documentation Overhaul

- [x] Audited all 13 .md files for accuracy and cross-linking
- [x] Deleted 3 redundant files: TODO_HUMAN.md, WAR_PLAN.md, STEPS.md
- [x] Updated all remaining .md files to reflect sessions 7-14

### Session 14 (2026-03-10) — BeNetwork Vocabulary Migration

- [x] Prisma schema: full vocabulary rewrite (Job→Path, Application→Chapter, etc.)
- [x] Deleted legacy /api/jobs/ + /api/applications/
- [x] New /api/chapters/route.ts
- [x] PathCard.tsx + profile + tests updated

### Session 13 (2026-03-10) — Component Cleanup + Nav Centralization

- [x] PathCard rename (JobCard→PathCard), SectionHeader component
- [x] lib/nav-structure.ts — single source for Nav + Footer links
- [x] data/mock/media.ts + fashion.ts extracted

### Session 12 (2026-03-10) — Inline Data Centralization

- [x] Extracted 6 more mock data modules (anchors-dashboard, about, charity, business, anchors-post-path, profile)

### Session 11 (2026-03-10) — Brand Sweep: amber/yellow → gold

- [x] Replaced amber-400/500 → #C9A227 across be/[country], charity, ventures, compass, anchors

### Session 10 (2026-03-10) — Backend-Ready Architecture + Dev Tooling

- [x] types/domain.ts, types/api.ts, services/types.ts
- [x] data/mock/ centralized directory (14 modules)
- [x] Prettier, ESLint, Husky, lint-staged, .editorconfig, .nvmrc

### Session 9 (2026-03-10) — Frontend Finalization

- [x] ALL pages dark theme, ALL vocabulary complete, zero brand-orange references

### Session 8 (2026-03-10) — Language Architecture + UX Unification

- [x] Language registry (14 languages), Ventures/Experiences unified, Jest 29→30

### Session 7 (2026-03-10) — Docs System + Playwright Visual Testing

- [x] CLAUDE.md, PRD v5, DESIGN_SYSTEM.md, ROADMAP.md, TESTING.md created
- [x] Playwright 89/89 tests passing

### Sessions 1–6 — Foundation

- [x] Platform foundation, brand sweep, responsive system, golden ratio, SEO, logo
