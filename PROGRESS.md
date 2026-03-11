# Be[Country] — Progress Tracker

> Update after every feature. Agent reads this first.
> Last updated: Session 32 (2026-03-11)
> ← [CLAUDE.md](./CLAUDE.md) | [PRD.md](./PRD.md) · [ROADMAP.md](./ROADMAP.md)

---

## Current State

| Metric            | Value                                            |
| ----------------- | ------------------------------------------------ |
| Phase             | 2 (BeKenya Live) — DB live, KE/DE/CH seeded      |
| Branch            | `main` (direct push)                             |
| Deploy            | Vercel auto on push                              |
| Pages             | 20+                                              |
| API routes        | 12+                                              |
| Library modules   | 21 (incl. auth, hooks, threads, geo, emoji-map)  |
| Mock data modules | 17 (incl. config.ts, threads.ts)                 |
| Jest tests        | 160/160 ✅                                       |
| Playwright tests  | 102/102 ✅ (16 smoke + 32 brand + 54 responsive) |
| TypeScript errors | 0                                                |
| Countries config  | 13 (16 in selector, +CH)                         |
| Languages         | 14                                               |

---

## ✅ Phase 1: Foundation (COMPLETE)

Built in Sessions 1–19. Everything works with mock data.

**Core:** Next.js 14.2.35, TypeScript strict, Tailwind + φ tokens, Prisma schema, NextAuth.js v4, Jest 30, Playwright 1.58, Prettier + ESLint + Husky.

**Libraries (lib/):** vocabulary, country-selector (16 countries, 14 languages, Haversine), countries (12 configs), compass, matching (4-dim scoring), safari-packages, nav-structure, mpesa, email, whatsapp-templates, social-media, offerings.

**Types:** domain.ts, api.ts, services/types.ts.

**Data:** 15 mock modules in `data/mock/` with barrel export. Zero inline.

**Pages:** 20+ — dark theme, BeNetwork vocab, semantic color tokens, responsive xs→4K.

**Quality:** Skeletons, error boundaries, WCAG AA, φ spacing, mock booking flow, engagement nudges.

---

## 🔧 Phase 2: BeKenya Live (PARTIALLY UNBLOCKED)

✅ DB + Auth core ready → [HUMAN_MANUAL.md](./HUMAN_MANUAL.md) for remaining:

| Credential                | Status                  |
| ------------------------- | ----------------------- |
| DATABASE_URL (Neon)       | ✅ Connected            |
| NEXTAUTH_SECRET           | ✅ Set                  |
| GOOGLE_CLIENT_ID/SECRET   | ✅ Set (local + Vercel) |
| RESEND_API_KEY            | ✅ Set (local + Vercel) |
| MPESA_CONSUMER_KEY/SECRET | ⛔ Needed for M-Pesa    |

---

## 📅 Future Phases

- **Phase 3:** Traction (notifications, messaging, reviews, referrals)
- **Phase 4:** Expansion (BeGermany, BeNigeria, multi-country)
- **Phase 5:** Platform (mobile, AI compass, Be[Tribe]/Be[Location])

---

## Session Log

### Session 35 (2026-03-11) — Unified Identity, Email Wiring, GDPR, Smart Prefill

- [x] **Unified identity system**: Any selection (tribe, language, country) changes the entire experience — logo, brand name, page content. Selecting "Deutsch" → sets DE country, German language. Selecting "Maasai" → sets KE country, BeMaasai brand.
- [x] **Tribe tab restored**: 5 identity tabs (Countries, Tribes, Languages, Faith, Paths). User reconsidered 4-tab simplification.
- [x] **Brand follows identity**: Identity context now stores `threadBrandName`. Nav logo shows "BeMaasai" when Maasai tribe is active, "BeKenya" when country is active. Dynamic, not hardcoded.
- [x] **Language↔Country mapping**: `LANGUAGE_COUNTRY_MAP` + `TRIBE_COUNTRY_MAP` in Nav — clicking a language or tribe auto-sets the associated country.
- [x] **Balanced global threads**: 50+ threads across KE/DE/CH/NG/GB — tribes, languages, faith, interests, sciences, locations for all countries.
- [x] **Cookie consent (GDPR)**: `CookieConsent.tsx` — essential-only / accept-all, localStorage persistence, 1s delayed banner, accessible role="dialog".
- [x] **Smart form prefilling**: `usePrefill()` hook — propagates identity context (country, language, currency, phonePrefix) to forms. Signup, compass, onboarding all wired.
- [x] **Email wiring**: Registration → `pioneer_welcome`, Chapter → `chapter_opened`, Booking → `safari_booking_confirmation`. All fire-and-forget.
- [x] **Bookings API**: `POST /api/bookings` — Zod validation, session auth, confirmation email.
- [x] **Deployment-aware defaults**: API routes use `NEXT_PUBLIC_COUNTRY_CODE` (no hardcoded KE). Currency derives from country config.
- [x] Build: ✅ | TS: 0 errors

### Session 34 (2026-03-11) — i18n Endonym System + Identity Language Layer

- [x] **Endonym system**: `lib/endonyms.ts` — country names in en/de/fr/sw with `getLocalizedCountryName()`, `searchCountries()`, `getCountrySearchTerms()`. Scalable: add row per country, column per language.
- [x] **Identity context language**: `identity.language` dimension added. Defaults from country (KE→en, DE→de, CH→de). Persists in localStorage. Migrates old format.
- [x] **Localized logo**: Nav logo shows "BeDeutschland" in German context, "BeKenia" for Kenya in German, "BeGermany" for Germany in English. Driven by `useIdentity()`.
- [x] **Language thread → display language**: Selecting Swahili/German/French in identity dropdown sets global display language via `setLanguage()`.
- [x] **Scroll containment**: `overscroll-contain` on identity dropdown prevents page scroll when hovering over scrollbar.
- [x] **Identity dropdown conditional render**: Fixed `{identityOpen && (...)}` — zero DOM footprint when closed.
- [x] Build: ✅ | TS: 0 errors

### Session 33 (2026-03-11) — Auth Wiring + Identity-Driven Content

- [x] **Login page wired**: `signIn('google')` for OAuth, `signIn('credentials')` for email/password. Error handling with NextAuth error codes. Loading spinners.
- [x] **Signup page wired**: Two-step flow (role select → registration). POST `/api/auth/register` creates DB user with bcrypt hash, then auto `signIn('credentials')`. Google OAuth alternative.
- [x] **Registration API**: `app/api/auth/register/route.ts` — validates name/email/password, checks duplicates (409), hashes password (bcrypt 10 rounds), creates User with role/country/phone.
- [x] **Client hooks live**: `usePaths`, `useThreads`, `useThread` — all pages fetch from API with graceful mock fallback. Nav identity switcher uses DB data.
- [x] **Identity switcher → page content**: Thread/country selection in Nav now drives page-level data filtering via URL params and context.
- [x] Build: ✅ | TS: 0 errors

### Session 32 (2026-03-11) — DB Migration: KE/DE/CH Live

- [x] **Schema extended**: 5 new models (Account, Thread, ThreadMembership, Experience, SavedPath) + ThreadType enum. 12 models total.
- [x] **Switzerland (CH) added**: Full country config in `lib/countries.ts` (CHF, TWINT, 8 sectors), country-selector (Zurich coords, L/B permit), thread (BeSwitzerland).
- [x] **Auth wired**: NextAuth with PrismaAdapter, Google OAuth, bcrypt Credentials. JWT propagates role + country. `lib/auth.ts` extracted.
- [x] **Seed data live**: 9 anchors (3/country), 18 paths (6/country), 6 pioneers (2/country), 22 threads, 6 experiences — all in Neon.
- [x] **Service layer built**: `services/` with DB-first + mock fallback. `pathService`, `threadService`, `chapterService`.
- [x] **API routes updated**: `/api/paths` and `/api/chapters` now use service layer + real auth. `/api/threads` and `/api/threads/[slug]` created.
- [x] Build: ✅ | Jest: 160/160 ✅ | TS: 0 errors

### Session 31 (2026-03-11) — Identity Switcher Visual Fix

- [x] **Dropdown background**: Replaced transparent `bg-brand-surface/98 backdrop-blur-xl` with fully opaque `bg-[#16161e]` — now readable on all backgrounds and devices.
- [x] **Dynamic logo on hover**: Logo area now reacts to hovered thread — shows thread icon + brand name (e.g. 🦁 BeMaasai, 🏙️ BeNairobi). Resets when mouse leaves.
- [x] **Responsive dropdown width**: Changed from fixed `w-80` to `w-[calc(100vw-2rem)] sm:w-96 max-w-[24rem]` — scales properly on small screens.
- [x] **Consistent dropdown styling**: Applied same opaque background to Anchors/About dropdowns.
- [x] Build: ✅ | Jest: 160/160 ✅ | TS: 0 errors

### Session 30 (2026-03-11) — Google OAuth, Resend, Vercel Env Vars

- [x] **Google OAuth configured**: Created OAuth client "BeKenya Web" in Google Cloud Console. Redirect URIs: `dev-plum-rho.vercel.app` (production) + `localhost:3000` (dev). Client ID + Secret added to `.env.local` and Vercel.
- [x] **Resend API key**: Added to `.env.local` and Vercel for transactional email.
- [x] **Vercel env vars**: Added 5 vars (DATABASE_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, RESEND_API_KEY, NEXT_PUBLIC_COUNTRY_CODE). Deployment auto-triggered.
- [x] **Credential status**: 5/6 credentials now live. Only M-Pesa sandbox remaining.

### Session 29 (2026-03-11) — Database Live, Logo Identity Switcher, Docs Update

- [x] **Neon database connected**: Schema pushed to Neon PostgreSQL (7 tables: User, Profile, Path, Chapter, Payment, Referral, SocialPost). `.env.local` configured with `DATABASE_URL` and `NEXTAUTH_SECRET`.
- [x] **Logo identity switcher**: Replaced passive rotating country teaser in Nav with active dropdown. Click the logo → opens panel with tabs for Countries, Languages, Tribes, Interests, Sciences, Locations. Each tab shows threads sorted by member count. Links to thread pages or country Gates.
- [x] **Mobile identity tabs**: Mobile menu updated with quick identity filter chips linking to thread pages.
- [x] **ROADMAP.md updated**: Phase 2 status changed from BLOCKED to UNBLOCKED. Thread features marked as built. Session 28-29 progress documented.
- [x] **PROGRESS.md updated**: Session 29 logged. Phase status updated.
- [x] Build: ✅ | TS: 0 errors

### Session 28 (2026-03-11) — Venture Detail, Identity Flags, Country Gate

- [x] **Venture detail page**: Created `app/ventures/[id]/page.tsx` — core conversion page with path details (description, responsibilities, requirements, benefits), sticky sidebar with "Open Chapter" CTA, success state, similar paths sidebar. Uses shared StatusBadge and VOCAB constants.
- [x] **Identity flags system**: New `lib/identity-flags.ts` — stores Pioneer identity (type, origin, destinations, skills) in localStorage after onboarding. Provides `saveIdentityFlags()`, `loadIdentityFlags()`, `getCompassUrl()`, `getVenturesUrl()` helpers.
- [x] **Onboarding → Ventures flow**: Updated onboarding to save flags locally (works without DB) and redirect to personalized Ventures feed with pre-filtered URL params.
- [x] **Homepage returning Pioneer**: Homepage detects returning Pioneers (completed onboarding) and links to personalized Ventures instead of generic Compass.
- [x] **Country Gate dynamic links**: "Other Be[Country]" cross-links at bottom of Gate pages now iterate `Object.keys(COUNTRIES)` instead of hardcoded array.
- [x] Build: ✅ | TS: 0 errors

### Session 27 (2026-03-11) — Unify Compass, KISS Anchor Dashboard, Consistency

- [x] **Unified Compass flow**: Replaced homepage 3-dropdown "Live Compass" duplicate with streamlined CTA. Homepage auto-detects country, passes `?from=XX` to Compass. Compass reads URL param to pre-fill origin. No more duplicate questions.
- [x] **Removed FROM_COUNTRIES/TO_COUNTRIES**: Homepage no longer uses hardcoded string arrays — uses canonical COUNTRY_OPTIONS
- [x] **KISS Anchor dashboard**: Rewrote from 1,144 → 420 lines (63% reduction). Sidebar → top tabs. 5 tabs → 3 (Paths, Chapters, Insights). Uses shared StatusBadge. Settings removed (future separate page).
- [x] **Nav/Footer consistency**: Unified padding (px-4 xl:px-8 everywhere), replaced Footer hardcoded #9D9BAA with gray-400 tokens, SectionHeader uses font-display + responsive sizing
- [x] **Anchor dashboard max-width**: Aligned with nav/footer (max-w-6xl xl:px-8)
- [x] Build: ✅ | TS: 0 errors

### Session 26 (2026-03-11) — Code Quality: Extract Shared Utilities

- [x] **lib/geo.ts**: Extracted timezone→country detection from app/page.tsx (hardcoded 8-line if-chain) and app/onboarding/page.tsx (inline function) into shared utility using canonical COUNTRY_OPTIONS
- [x] **lib/emoji-map.ts**: Extracted 23-line sector→emoji if-chain from app/be/[country]/page.tsx into regex-based lookup table — single source of truth
- [x] **PIONEER_TYPE_OPTIONS**: Moved derived select-options array from app/page.tsx to lib/vocabulary.ts — shared across any dropdown that needs Pioneer types
- [x] **CSS --gradient-experience**: Replaced hardcoded hex gradients (#3D1A00, #7B3F00) in offerings + ventures pages with CSS variable from globals.css
- [x] **Net result**: −58 lines removed, +105 lines added (including JSDoc), 39 fewer lines of duplication across 7 files
- [x] Build: ✅ | Jest: 107/107 ✅ | TS: 0 errors

### Session 25 (2026-03-11) — Impact Partner Abstraction, WizardShell, Component Cleanup

- [x] **Impact Partner generic**: Added `ImpactPartner` interface to `CountryConfig` — UTAMADUNI is now Kenya-specific, each country has its own social impact org (Brücken e.V. for Germany, Ọmọ Foundation for Nigeria, Pathways Foundation for USA)
- [x] **IMPACT_PARTNER export**: `data/mock/config.ts` now exports generic `IMPACT_PARTNER` from country config. Old `UTAMADUNI_SHARE`/`UTAMADUNI_AMOUNT` deprecated but still work
- [x] **WizardShell component**: Created `components/WizardShell.tsx` — shared step progress indicator (circles + connectors), percentage bar, fixed nav footer with back/continue, scroll-to-top, submitting state. Used by Compass (4), Onboarding (5), Post-Path (6)
- [x] **WizardProgressBar**: Standalone progress bar export for pages wanting bar-only (Onboarding backward compat)
- [x] **globals.css**: Added btn-outline, btn-ghost, btn-accent, btn-sm, btn-lg, badge-success, badge-warning, badge-accent
- [x] **Dead code**: Deleted LoadingSkeleton.tsx (unused, replaced by Skeleton.tsx)
- [x] **COMPONENTS.md**: Updated WizardShell status from TODO to Done
- [x] Build: ✅ | Jest: 107/107 ✅ | TS: 0 errors

### Session 24 (2026-03-11) — Architecture, Testing, Agent-Ready Plans

- [x] **Thread system**: Created `lib/threads.ts` — identity-based community architecture (country/tribe/language/interest/religion/science/location)
- [x] **Mock threads**: 18 threads across all 7 types (BeKenya, BeMaasai, BeSwahili, BeTech, BeMedical, BeNairobi, etc.)
- [x] **Journey stages**: Defined 5-stage psychological progression (Discover → Trust → Engage → Belong → Advocate)
- [x] **HeroSection component**: Extracted shared hero gradient into reusable `components/HeroSection.tsx` — used by Contact, Privacy, Profile
- [x] **Footer dynamic**: Fixed hardcoded "BeKenya" in nav-structure.ts footer links → now uses `BRAND_NAME` from country config
- [x] **Jest 25 → 107**: Added 4 new test suites (matching.test.ts, compass.test.ts, vocabulary.test.ts, threads.test.ts) — 82 new tests
- [x] **PRD v8**: Added Experience Architecture section (psychology, marketing, community threading, navigation UX, security/privacy design)
- [x] **PRD task breakdown**: 28 agent-ready tasks in 4 sprints (Testing, Code Quality, Innovation, Scalability)
- [x] **ROADMAP rewrite**: Added Phase 1.5 with concrete sprint items, thread architecture in Phase 5, agent instructions
- [x] Build: ✅ | Jest: 107/107 ✅ | TS: 0 errors

### Session 23 (2026-03-11) — Nav Redesign + Border/A11y Sweep

- [x] **Nav redesign**: Fixed position with scroll-aware background (transparent → solid)
- [x] **Rotating Be[Country] teaser**: Cycles 12 countries every 3s under logo — reinforces platform vision
- [x] **Mobile menu**: Identity ticker ("One platform, every identity — BeGermany · BeKenya · BeYou")
- [x] **CTA shimmer**: Gold pill button with hover shimmer effect
- [x] **Gold accent line**: Subtle gradient line at top of nav
- [x] **Breakpoint lowered**: Desktop nav now shows at `lg` (1024px) instead of `xl` (1280px)
- [x] **Border sweep**: All `border-gray-800` → `border-brand-primary/30` (16 files, 0 remaining)
- [x] **Accessibility**: Global `focus-visible` ring, aria-labels on icon-only buttons, skip-to-content verified
- [x] **R24 (automation agent)** + **R25 (nav redesign)** added to REQUIREMENTS.md
- [x] Build: ✅ | Jest: 25/25 ✅ | TS: 0 errors

### Session 22 (2026-03-11) — Design Consistency + Wizard Audit

- [x] Added hero gradient sections to Contact, Privacy, Profile pages (matching world-class pages)
- [x] All pages now have consistent hero gradient pattern: `bg-gradient-to-b from-brand-primary to-brand-bg`
- [x] Audited all wizard pages: Compass (4-step), Onboarding (5-step), Post-Path (6-step) — all already have numbered steps + "Continue →" pattern
- [x] Updated border tokens on Privacy card (gray-800 → brand-primary/30)
- [x] Build: ✅ | Jest: 25/25 ✅ | TS: 0 errors

### Session 21 (2026-03-11) — Centralize Config + Color Compliance

- [x] Created `data/mock/config.ts`: single source for brand, contact, legal, referral, profile
- [x] Updated 10+ pages to import from config (Footer, Login, Signup, Contact, Profile, Referral, Privacy, Business, Homepage)
- [x] Fixed all teal-400/500/900 color violations → brand-accent/brand-primary (anchors/dashboard, post-path, notifications)
- [x] Replaced all hardcoded "BeKenya" in page files with dynamic BRAND_NAME (about, charity, fashion, media, be/[country], business, layout)
- [x] Homepage: BRAND_NAME, UTAMADUNI_AMOUNT, PAYMENT_BADGES from config
- [x] Removed duplicate navs from profile and referral pages
- [x] Zero teal/orange/amber/yellow violations remaining
- [x] Only 3 acceptable "BeKenya" references remain: error.tsx (console), og/route.tsx (domain), layout.tsx (fallback URL)

### Session 20 (2026-03-11) — MD Cleanup + Vision Update

- [x] Audited all 11 MD files for inconsistencies
- [x] Created ASK.md for async owner questions
- [x] Updated vision: Be[Country] → Be[Country/Tribe/Location]
- [x] Rewrote all MD files: removed redundancy, fixed stale counts, KISS

### Session 19 (2026-03-11) — Booking, UX, WCAG, Skeletons

- Booking state machine, M-Pesa modal, mock card flow, confirmation UI
- Engagement nudges, trust signals, WCAG contrast fix (143 occurrences)
- Reusable Skeleton (8 primitives), error boundaries, φ tokens, mobile CTA

### Session 18 (2026-03-11) — Color Token System + Responsive

- Centralized CSS vars, semantic naming, ~830 hex replacements across 53 files
- Responsive watch→TV scaling

### Session 17 (2026-03-11) — Quality Overhaul

- OPERATIONS.md, test count fixes, typo fixes, dark theme fixes, dead code removal

### Session 16 (2026-03-11) — International Offerings

- lib/offerings.ts, /offerings page, auto-detect country, purpose tabs

### Session 15 (2026-03-11) — Documentation Overhaul

- Audited 13 .md files, deleted 3 redundant, updated all

### Sessions 1–14 — Foundation Build

- Platform from scratch: pages, vocab migration, brand sweep, country system, type system, mock data, testing, dev tooling

---

_Last updated: Session 21 (2026-03-11)_
