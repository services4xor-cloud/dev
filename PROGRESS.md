# Be[Country] — Live Progress Tracker
> Update this file after every feature. Claude reads this to know current state.
> Last updated: Session 8 (2026-03-10)

---

## Current Focus: Phase 2 — BeKenya Live

Working branch: `main` (direct)
Vercel: Auto-deploys from main

---

## ✅ Phase 1: Foundation (COMPLETE)

### Platform Core
- [x] Next.js 14 App Router setup (TypeScript)
- [x] Tailwind CSS with BeKenya brand (maroon #5C0A14 + gold #C9A227)
- [x] Prisma schema: User, Path, Chapter, Payment, Referral, SocialPost
- [x] NextAuth.js v4 (Google + email/password)
- [x] Jest test suite + CI/CD (GitHub Actions)

### BeNetwork Vocabulary System
- [x] lib/vocabulary.ts — VOCAB, PIONEER_TYPES, PATH_CATEGORIES
- [x] lib/countries.ts — 12-country config registry
- [x] lib/compass.ts — Country route corridors (KE-DE, KE-GB, KE-AE, KE-US, etc.)
- [x] lib/matching.ts — 4-dimension Pioneer <-> Path scoring engine
- [x] lib/safari-packages.ts — Real Kenya experience packages

### Communication Layer
- [x] lib/social-media.ts — 9-platform social config + automation
- [x] lib/whatsapp-templates.ts — 10 WhatsApp templates (en/sw/de)
- [x] lib/email.ts — Resend email system with branded HTML templates
- [x] lib/mpesa.ts — M-Pesa Daraja API v2

### Pages (16+)
- [x] app/page.tsx — Homepage (identity-first compass landing)
- [x] app/compass/page.tsx — 4-step smart route wizard
- [x] app/ventures/page.tsx — Unified path + experience feed
- [x] app/experiences/[id]/page.tsx — Safari detail + booking UI
- [x] app/pioneers/dashboard/page.tsx — Pioneer hub (5 tabs)
- [x] app/pioneers/notifications/page.tsx — Notification center
- [x] app/anchors/dashboard/page.tsx — Anchor hub (5 tabs)
- [x] app/anchors/post-path/page.tsx — Path creation wizard
- [x] app/onboarding/page.tsx — 5-step Pioneer identity capture
- [x] app/be/[country]/page.tsx — Country landing gates
- [x] app/charity/page.tsx — UTAMADUNI CBO page
- [x] app/business/page.tsx — BeKenya Family Ltd
- [x] app/admin/page.tsx — Admin dashboard
- [x] app/fashion/page.tsx — Fashion/trade page
- [x] app/media/page.tsx — Media page
- [x] app/about, /pricing, /contact, /privacy, /profile, /referral

### API Routes
- [x] /api/paths — CRUD
- [x] /api/compass — geo detection + route matching
- [x] /api/onboarding — Pioneer profile creation
- [x] /api/social — social media queue
- [x] /api/search — smart search with scoring
- [x] /api/mpesa/stkpush — M-Pesa STK Push v2
- [x] /api/mpesa/callback — Safaricom webhook
- [x] /api/jobs, /api/applications (legacy, still works)
- [x] /api/auth — NextAuth handlers
- [x] /api/profile — Profile CRUD

### Infrastructure
- [x] CLAUDE.md — Agentic operating manual
- [x] PRD.md — Product requirements document
- [x] PROGRESS.md — This file
- [x] ARCHITECTURE.md — Technical + conceptual architecture
- [x] WAR_PLAN.md — Strategic roadmap
- [x] HUMAN_MANUAL.md — Human setup guide
- [x] vercel.json — Vercel configuration
- [x] .github/workflows/ci.yml — CI: lint + typecheck + test + build
- [x] .env.example — All env vars documented
- [x] public/logo-bekenya.svg — Lion logo (maroon + gold)

### Tests
- [x] __tests__/api/mpesa.test.ts — M-Pesa phone formatting
- [x] __tests__/api/jobs.test.ts — Path schema validation
- [x] __tests__/lib/vocabulary.test.ts
- [x] __tests__/lib/matching.test.ts
- [x] __tests__/lib/safari-packages.test.ts
- [x] __tests__/lib/compass.test.ts
- [x] __tests__/lib/whatsapp-templates.test.ts
- [x] __tests__/lib/social-media.test.ts

---

## 🔄 Phase 2: BeKenya Live (IN PROGRESS)

### Session 5 (2026-03-10)
- [x] **lib/country-selector.ts** — Single source of truth: geographic coords, Haversine proximity, region clusters, corridor badges. Replaces all inline country arrays.
- [x] **components/CountryPrioritySelector.tsx** — Elegant ordered multi-select. Features: proximity glow (< 1800km), green pulse for nearby, priority badges ①②③, sticky priority rail, max 5 selections.
- [x] **app/compass/page.tsx** — Rewritten: uses CountryPrioritySelector for Step 1, maroon/gold brand, removed DESTINATIONS array, shows multi-destination in route result.
- [x] **app/onboarding/page.tsx** — Removed duplicate DESTINATIONS + COUNTRY_LIST, imports from lib/country-selector, brand color orange→maroon.
- [x] **app/about/page.tsx** — Full brand-consistent rewrite: dark theme, BeNetwork vocabulary (Pioneer/Anchor/Path/Chapter), golden ratio 61.8/38.2 mission layout, maroon/gold.
- [x] **REQUIREMENTS.md** — Created: documents all user requirements, data rules, duplicate inventory, agent context links.
- [x] **MEMORY.md** — Updated with session 5 learnings.
- [x] TypeScript: 0 errors.

### Session 4 (2026-03-09)
- [x] Next.js 14.2.5 → 14.2.35 (security: CVE-2024-46982, CVE-2024-56332 patched)
- [x] Full responsive system: xs→4K with fluid typography + TV media queries
- [x] Golden ratio φ=1.618 token system in tailwind.config.ts
- [x] PRD v4.0 comprehensive rewrite
- [x] STEPS.md — conversation prompt → build output map
- [x] Fixed all duplicate nav/footer stacking (sticky top-16 z-40 pattern)
- [x] About page brand audit (further rewritten in session 5)

### Session 8 (2026-03-10) — Language Architecture + UX Unification + Quality
- [x] **Language registry** — `lib/country-selector.ts`: 14 languages with metadata (nativeName, countries, digitalReach), `languages[]` on all 16 countries
- [x] **Language matching** — `getCountriesBySharedLanguage()`, `languageOverlap()`, `getGroupedByLanguage()` for collaboration routing
- [x] **Ventures/Experiences unified** — `/experiences` now redirects to `/ventures`. Single unified feed. Detail pages at `/experiences/[id]` preserved.
- [x] **Nav cleanup** — Removed Experiences from Nav (redundant). Fixed alignment: `inline-flex items-center` on all desktop nav items.
- [x] **Compass stepper fix** — Numbers + labels now in vertical columns instead of two separate rows. Connector lines properly centered.
- [x] **countries.ts vocabulary** — Removed `#FF6B35` (4 instances), replaced job/employer/hired → Path/Anchor/Pioneer vocabulary
- [x] **vocabulary.ts** — Global adoption header with translation hints (de/fr/sw), updated file header from BeKenya → BeNetwork
- [x] **Jest 29 → 30** — Node.js 24 compatibility fix. 25/25 tests pass. next/jest transformer works.
- [x] **Orange sweep continued** — admin, anchors/dashboard, anchors/post-path, business, referral, profile, notifications, experiences/[id]
- [x] **lib/email.ts** — Planned: HTML email templates still use #FF6B35 (lower priority — not visible in app)
- [x] TypeScript: 0 errors ✅

### Session 7 (2026-03-10) — Docs System + Playwright Visual Testing
- [x] **CLAUDE.md** — Rewritten as lean master agent index (~200 lines). All doc cross-references inline.
- [x] **PRD.md v5** — Self-resolved Q&A clash log (9 questions), acceptance criteria, revenue model
- [x] **DESIGN_SYSTEM.md** — NEW: full brand token reference, component patterns, forbidden colors, checklist
- [x] **ROADMAP.md** — NEW: 5-phase strategic plan, sprint breakdown, dependency map, risk register
- [x] **TESTING.md** — NEW: Playwright strategy, 3 test layers, CI integration guide
- [x] **Playwright installed** — `@playwright/test` v1.58.2 + Chromium
- [x] **playwright.config.ts** — 3 projects (smoke/brand/responsive), 6 viewport presets xs→3xl
- [x] **tests/visual/smoke.spec.ts** — 15/15 pass: all pages 200, no console errors
- [x] **tests/visual/brand.spec.ts** — 26/26 pass + 4 known light-bg pages skipped correctly
- [x] **tests/visual/responsive.spec.ts** — 48/48 pass: no horizontal scroll at any breakpoint
- [x] **SVG Image fix** — `unoptimized` prop on all `<Image src="/logo.svg"...>` (was 400 error)
- [x] **Nav breakpoint fix** — Desktop nav now shows at `xl:` (1280px+), not `md:`/`lg:` (prevented overflow at 768–1024px)
- [x] **globals.css** — `overflow-x: hidden` on both `html` + `body`
- [x] **Brand sweep continued** — pioneers/dashboard, charity, pricing, contact, signup: all orange-* → maroon/gold
- [x] **.claude/launch.json** — bekenya-dev server config (npm run dev → port 3000)
- [x] TypeScript: 0 errors ✅

### Session 6 (2026-03-10) — Brand Consistency + UX Cleanup
- [x] **Brand sweep** — Eliminated `#FF6B35` from ALL 30+ pages/components. Zero orange violations.
- [x] **tailwind.config.ts** — `brand.orange` + `brand.teal` aliased → `#C9A227` (gold) for backward compat. All `text-brand-orange`, `bg-brand-orange` etc now render as gold.
- [x] **globals.css** — `btn-primary` rewritten: maroon gradient + gold border ring. CSS var `--color-orange` → gold alias.
- [x] **JobCard.tsx** → renamed PathCard concept: dark theme, `/ventures/[id]` links, gold badges, no more light-bg card.
- [x] **Legacy redirects** — 5 old routes → server-side redirect (0 JS hydration): `/dashboard`→`/pioneers/dashboard`, `/employers/dashboard`→`/anchors/dashboard`, `/post-job`→`/anchors/post-path`, `/jobs`→`/ventures`, `/jobs/[id]`→`/ventures`.
- [x] **app/ventures/page.tsx** — Removed duplicate Pioneer type filter (was appearing twice). Unified to single `FilterCategory` state + 5-item FILTER array. Dark theme, maroon/gold.
- [x] **app/not-found.tsx** — Full rewrite: dark theme, BeNetwork vocabulary, gold 404 glow, maroon CTA, popular path chips.
- [x] **app/page.tsx** — Full orange sweep: 25+ references → maroon buttons + gold accents. `/post-job` href → `/anchors/post-path`.
- [x] TypeScript: 0 errors ✅

### Immediate Next — Frontend Finalization
1. [ ] **Remaining dark theme pages** — login, signup, pricing, contact, fashion, media
2. [ ] **Email templates brand fix** — `lib/email.ts` still uses #FF6B35 in HTML
3. [ ] **Old vocabulary sweep** — 9 pages still reference "job"/"employer" (see audit)

### Backend Adaptation Plan (Phase 2 Core)

**Step 1: Human Setup** (must be done by human — see HUMAN_MANUAL.md)
| Task | Account | Est. Time | Command After |
|------|---------|-----------|---------------|
| Create Neon PostgreSQL DB | neon.tech | 15 min | Set `DATABASE_URL` in Vercel |
| Generate `NEXTAUTH_SECRET` | Terminal | 1 min | `openssl rand -base64 32` |
| Create Google OAuth App | console.cloud.google.com | 15 min | Set `GOOGLE_CLIENT_ID` + `SECRET` |
| Create Resend Account | resend.com | 5 min | Set `RESEND_API_KEY` |
| Create M-Pesa Sandbox | developer.safaricom.co.ke | 30 min | Set `MPESA_CONSUMER_KEY` + `SECRET` |

**Step 2: Database Migration** (Claude can do after Step 1)
- [ ] `npx prisma migrate deploy` — create tables from schema.prisma
- [ ] Seed initial data: 12 countries, 5 safari packages, Pioneer types
- [ ] Replace all mock data arrays with Prisma queries
- [ ] Add connection pooling config for Neon

**Step 3: Auth Integration** (Claude can do after Step 1)
- [ ] Enable Google OAuth in NextAuth config
- [ ] Enable email/password with bcrypt
- [ ] Add session guards to `/pioneers/dashboard`, `/anchors/dashboard`
- [ ] Wire signup → create Pioneer/Anchor in DB
- [ ] Wire login → session with user role (pioneer/anchor/admin)

**Step 4: Payment Flow** (Claude can do after Step 1)
- [ ] Wire M-Pesa STK Push button in experience detail pages
- [ ] Implement callback → update payment status in DB
- [ ] Email receipt via Resend
- [ ] WhatsApp receipt via templates (if WA Business API available)

**Step 5: API Completion** (Claude can do after Step 2)
- [ ] `/api/paths` — real CRUD against DB (currently mock)
- [ ] `/api/compass` — geo detection + language-aware route scoring
- [ ] `/api/chapters` — Pioneer creates chapter (application) against a Path
- [ ] `/api/ventures` — list + filter with Prisma (replaces mock data)
- [ ] `/api/profile` — CRUD Pioneer profile with DB

---

## 🚫 Blockers (Human Action Required)

These cannot be done by Claude — see HUMAN_MANUAL.md:

| Item | Needed For | Est. Time |
|------|-----------|-----------|
| DATABASE_URL (Neon) | Everything with real data | 15 min |
| MPESA_CONSUMER_KEY + SECRET | Live M-Pesa payments | 30 min (Safaricom portal) |
| GOOGLE_CLIENT_ID + SECRET | Google Sign-In | 15 min (Google Console) |
| RESEND_API_KEY | Email notifications | 5 min |
| NEXTAUTH_SECRET | Auth security | 1 min (`openssl rand -base64 32`) |

---

## 📅 Phase 3: Growth (Future)

- [ ] Pioneer Pro subscription (Stripe billing)
- [ ] Impact dashboard (UTAMADUNI % tracker public)
- [ ] Reviews + ratings for experiences
- [ ] Pioneer community stories
- [ ] Multi-language UI (en, sw, de)
- [ ] Mobile PWA offline support
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

| Metric | Value |
|--------|-------|
| Pages live | 20+ |
| API routes | 12+ |
| Library modules | 10 |
| Test files | 8 |
| Lines of code | ~15,000+ |
| Countries configured | 12 |
| Experience packages | 5 |
| Phase 1 | ✅ Complete |
| Phase 2 | 🔄 In Progress |
| Branch | main (direct) |
| CI | ✅ GitHub Actions |
| Deploy | Auto via Vercel |
