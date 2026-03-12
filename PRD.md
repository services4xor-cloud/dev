# Be[Country] — Product Requirements Document

> **v8.0 · Session 24 · 2026-03-11**
> Owner: Tobias | Platform: BeKenya → Be[Country/Tribe/Location]
> ← [CLAUDE.md](./CLAUDE.md) | [ROADMAP.md](./ROADMAP.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Vision

> **"Find where you belong. Go there."**

Be[Country] is an **identity-first life-routing platform**. Not a job board. A compass.

**The deeper mission:** Connect everyone to paths, people, and experiences that match their identity — through open trade, fair compensation, and direct connections.

**Scale vision:** Be[Country] → Be[Tribe] → Be[Location]. One codebase serves countries (BeKenya), tribes (BeMaasai), and locations (BeNairobi). Architecture supports all three levels from day one. Currently live as **BeKenya**.

---

## Design Decisions

| ID  | Decision                         | Status   | Detail                                                          |
| --- | -------------------------------- | -------- | --------------------------------------------------------------- |
| D1  | Life platform, not job board     | ✅ Final | Compass routes people. Ventures = Paths + Experiences unified.  |
| D2  | Dark theme everywhere            | ✅ Done  | `#0A0A0F` bg. All 20+ pages. No exceptions.                     |
| D3  | BeNetwork vocabulary only        | ✅ Done  | Pioneer/Anchor/Path/Chapter/Venture/Compass. UI + API + Prisma. |
| D4  | Safari + Professional in one app | ✅ Final | Unified Ventures feed.                                          |
| D5  | M-Pesa hero, multi-payment       | ✅ Final | M-Pesa first (KE). Stripe (INT). Flutterwave (NG/GH).           |
| D6  | PWA now, native later            | ✅ Final | Responsive xs→4K. React Native in Phase 5.                      |
| D7  | UTAMADUNI is integral            | ✅ Final | KES 50 from every booking. Tracked in `Payment.utamaduniPct`.   |
| D8  | Flat doc hierarchy               | ✅ Final | All .md in root. CLAUDE.md gateway. ASK.md for questions.       |
| D9  | Three-layer visual tests         | ✅ Done  | Smoke (16) + Brand (32) + Responsive (54) = 102 tests.          |

---

## Vocabulary

| Term        | Never Say         | Description                               |
| ----------- | ----------------- | ----------------------------------------- |
| **Pioneer** | user, job seeker  | Person exploring paths across countries   |
| **Anchor**  | employer, company | Organization offering paths + experiences |
| **Path**    | job, vacancy      | What Anchors post; what Pioneers pursue   |
| **Chapter** | application       | Pioneer engaging a Path                   |
| **Venture** | tour, booking     | Experience or professional placement      |
| **Compass** | search, filter    | 4-step smart route wizard                 |
| **Gate**    | country page      | `/be/[country]` landing                   |
| **Route**   | migration path    | Country corridor (KE→DE, KE→GB, etc.)     |

Source: `lib/vocabulary.ts`

---

## Target Users

### Pioneers (80% of traffic)

- **African Professional (25–38):** Skills in tech, healthcare, eco-tourism. Wants international opportunity without gatekeepers.
- **International Explorer (28–55):** Budget + curiosity. Wants authentic experiences that contribute to community.
- **Diaspora Returnee (30–45):** Foreign skills + money. Wants to invest back in East Africa.

### Anchors (15% of traffic, 80% of revenue)

Safari lodges, international NGOs, tech companies, hospitals, European/Gulf employers.

### UTAMADUNI Partners (5%)

Conservation workers, local guides, cultural educators. Direct allocation from bookings.

---

## Core Flows

1. **Pioneer Compass:** Homepage → Compass (4 steps) → Route Results → Ventures → Open Chapter
2. **Safari Booking:** Ventures → Experience → Detail → Date → M-Pesa/Card → Confirmation
3. **Anchor Post-Path:** Signup → Post-Path wizard (5 steps) → Publish
4. **Pioneer Onboarding:** Signup → Onboarding (5 steps) → Dashboard

---

## Feature Status

### ✅ Phase 1 Complete

- 20+ pages, dark theme, brand consistent
- World-class nav with rotating Be[Country] teaser
- Compass wizard + CountryPrioritySelector
- Ventures unified feed (Paths + Experiences)
- Pioneer + Anchor dashboards (5 tabs each)
- M-Pesa API client (sandbox)
- Centralized mock data (16 modules incl. config)
- Type system (domain + API + services)
- International offerings (country-aware, purpose-driven)
- Semantic color token system + brand border tokens
- Loading skeletons (reusable + dashboards + compass)
- Error boundaries (dashboards, compass, ventures)
- WCAG AA + focus-visible + aria-labels
- Mock booking flow + engagement nudges
- Progressive φ token adoption
- 102 Playwright + 25 Jest tests
- Dev tooling (Prettier, ESLint, Husky)

### 🔧 Phase 1.5 — Agent-Ready Tasks (No Credentials Needed)

These tasks can be done NOW by agents, in parallel, without waiting for credentials.

#### A. Testing & Quality

| ID   | Task                                          | Files                          | Effort |
| ---- | --------------------------------------------- | ------------------------------ | ------ |
| T-01 | Unit tests for `lib/matching.ts`              | `__tests__/matching.test.ts`   | Medium |
| T-02 | Unit tests for `lib/compass.ts`               | `__tests__/compass.test.ts`    | Medium |
| T-03 | Unit tests for `lib/offerings.ts`             | `__tests__/offerings.test.ts`  | Low    |
| T-04 | Unit tests for `lib/vocabulary.ts`            | `__tests__/vocab.test.ts`      | Low    |
| T-05 | Unit tests for `lib/nav-structure.ts`         | `__tests__/nav.test.ts`        | Low    |
| T-06 | Component tests for `PathCard`, `Skeleton`    | `__tests__/components/`        | Medium |
| T-07 | API route tests for `/api/paths`, `/api/auth` | `__tests__/api/`               | Medium |
| T-08 | E2E: Compass wizard flow                      | `tests/e2e/compass.spec.ts`    | High   |
| T-09 | E2E: Onboarding wizard flow                   | `tests/e2e/onboarding.spec.ts` | High   |
| T-10 | E2E: Anchor post-path wizard flow             | `tests/e2e/post-path.spec.ts`  | High   |

#### B. Code Quality & Architecture

| ID   | Task                                           | Files                          | Effort |
| ---- | ---------------------------------------------- | ------------------------------ | ------ |
| C-01 | Extract shared form components (input, select) | `components/ui/`               | Medium |
| C-02 | Extract shared wizard shell component          | `components/WizardShell.tsx`   | Medium |
| C-03 | Create shared hero gradient component          | `components/HeroSection.tsx`   | Low    |
| C-04 | Centralize form validation utilities           | `lib/validation.ts`            | Medium |
| C-05 | Extract dashboard tab pattern into shared comp | `components/DashboardTabs.tsx` | Medium |
| C-06 | Move all remaining inline styles to tokens     | Multiple pages                 | Low    |
| C-07 | Add JSDoc to all lib/ exports                  | `lib/*.ts`                     | Low    |

#### C. Innovation & UX

| ID   | Task                                            | Files                        | Effort |
| ---- | ----------------------------------------------- | ---------------------------- | ------ |
| I-01 | Footer redesign (match nav quality)             | `components/Footer.tsx`      | Medium |
| I-02 | Animated page transitions (framer-motion)       | `app/layout.tsx`, components | High   |
| I-03 | Pioneer profile cards (for ventures feed)       | `components/PioneerCard.tsx` | Medium |
| I-04 | "Stories" section on homepage (Pioneer success) | `app/page.tsx`, `data/mock/` | Medium |
| I-05 | Country Gate page redesign (immersive)          | `app/be/[country]/page.tsx`  | High   |
| I-06 | Add micro-animations to Compass steps           | `app/compass/page.tsx`       | Medium |
| I-07 | Dark mode polish pass (contrast + depth)        | Multiple pages               | Low    |

#### D. Scalability Prep

| ID   | Task                                         | Files                         | Effort |
| ---- | -------------------------------------------- | ----------------------------- | ------ |
| S-01 | Service layer abstraction (mock → real swap) | `services/*.ts`               | High   |
| S-02 | API client with error handling + retry       | `lib/api-client.ts`           | Medium |
| S-03 | i18n infrastructure (next-intl or similar)   | `lib/i18n.ts`, `messages/`    | High   |
| S-04 | Tribe/Location data model + mock data        | `lib/tribes.ts`, `data/mock/` | Medium |
| S-05 | SEO meta tags on all pages                   | `app/*/page.tsx` (metadata)   | Medium |
| S-06 | OpenGraph images per page                    | `app/*/opengraph-image.tsx`   | Medium |
| S-07 | PWA manifest + service worker                | `public/manifest.json`        | Low    |

### ⛔ Phase 2 — Blocked on Credentials

| Feature            | Blocker        |
| ------------------ | -------------- |
| Real DB (Neon)     | DATABASE_URL   |
| Real auth (Google) | GOOGLE\_ keys  |
| Real M-Pesa        | MPESA\_ keys   |
| Real email         | RESEND_API_KEY |

→ [HUMAN_MANUAL.md](./HUMAN_MANUAL.md)

---

## Revenue Model

| Stream                  | Mechanism | Price        |
| ----------------------- | --------- | ------------ |
| Anchor Path listing     | Per-post  | KES 500      |
| Anchor subscription     | Monthly   | KES 2,500    |
| Safari commission       | 10% fee   | Variable     |
| Pioneer featured        | Promoted  | KES 200/week |
| International transfers | Spread    | 0.5–1.5%     |

---

## Accessibility (Non-negotiable)

- WCAG AA minimum all text
- Touch targets ≥ 44px
- Skip-to-content link
- Focus-visible: 2px gold ring
- `aria-label` on icon-only buttons
- Keyboard navigation

---

## Experience Architecture

### Psychology & Trust Framework

The platform experience follows a deliberate psychological progression:

```
DISCOVER → TRUST → ENGAGE → BELONG → ADVOCATE
```

| Stage    | Psychology           | UX Pattern                                       | Pages                          |
| -------- | -------------------- | ------------------------------------------------ | ------------------------------ |
| Discover | Curiosity + Identity | Hero with rotating Be[X] teaser, country gates   | Homepage, `/be/[country]`      |
| Trust    | Social proof + Auth  | Reviews, UTAMADUNI transparency, SSL badges      | About, Charity, Pricing        |
| Engage   | Purpose-driven       | Compass wizard, personalized routes              | Compass, Ventures, Offerings   |
| Belong   | Community + Identity | Dashboards, profile, tribe/interest communities  | Dashboards, Profile, Community |
| Advocate | Referral + Impact    | Refer & Earn, impact stories, success narratives | Referral, Media, Stories       |

### Community Threading (Reddit-inspired)

The platform organizes people into **threads** — shared interest/identity groups that cross countries:

```
Be[Country]   → Geographic identity    → BeKenya, BeGermany
Be[Tribe]     → Cultural identity      → BeMaasai, BeKikuyu
Be[Language]  → Linguistic identity    → BeSwahili, BeDeutsch
Be[Interest]  → Professional interest  → BeTech, BeEcoTourism
Be[Religion]  → Spiritual identity     → BeMuslim, BeChristian
Be[Science]   → Knowledge identity     → BeMedical, BeEngineering
```

Each thread gets its own **Gate page** (`/be/[slug]`), curated Ventures feed, community discussion, and success stories. The architecture is generic — same component renders any identity thread.

### Navigation UX Principles

1. **Progressive disclosure** — show less, reveal more on intent
2. **Identity-first** — the rotating teaser in nav constantly reinforces "you belong here"
3. **3-click rule** — any Pioneer can reach relevant Ventures in ≤3 clicks
4. **Sticky context** — nav always shows where you are + quick escape
5. **Mobile-first** — thumb-zone navigation, bottom sheet menus

### Marketing & Sales Integration

| Page     | Sales Function            | Conversion Goal                  |
| -------- | ------------------------- | -------------------------------- |
| Homepage | Awareness + Identity hook | Start Compass or Browse Ventures |
| Compass  | Qualification             | Complete wizard → Route results  |
| Ventures | Product showcase          | Open a Chapter (apply/book)      |
| Pricing  | Anchor conversion         | Start posting Paths              |
| Referral | Viral growth              | Share referral link              |
| Charity  | Trust building            | Emotional investment             |

### Security & Privacy Design

- All forms validate client + server side
- No PII stored without consent (GDPR-ready)
- Payment data never touches our servers (M-Pesa STK / Stripe Checkout)
- Cookie consent with privacy-first defaults
- Clear data retention policy on Privacy page
- Session tokens (not permanent cookies) for auth

---

## Constraints

1. `'use client'` for interactive files
2. Mock data in `data/mock/` until DB
3. Country data: `lib/country-selector.ts` only
4. Vocabulary: `lib/vocabulary.ts` only
5. Brand colors: Tailwind tokens only
6. Nav/Footer: `lib/nav-structure.ts` only
7. All design from `DESIGN_SYSTEM.md`
8. Generic architecture — same component serves any identity thread
9. No hardcoded country/tribe names in components

---

_Last updated: Session 24 (2026-03-11)_
