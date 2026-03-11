# Be[Country] — Architecture Document

> The technical and conceptual blueprint of the platform.
> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [PRD.md](./PRD.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

---

## 1. The Core Idea

Be[Country] is built on a single architectural insight:

**The same human desire — to build a good life — takes different paths in different countries.**

Instead of building separate apps for Kenya, Germany, America, and Nigeria, we build one smart engine that speaks every country's language:

```
One Codebase
     ↓
Country Config (lib/countries.ts)
     ↓
Localized Experience
(currency, payment, language, sectors, routes)
```

---

## 2. System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   BeNetwork Platform                  │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │   Compass   │  │  Matching   │  │   Social    │  │
│  │  (Routing)  │  │  (Scoring)  │  │ (Automation)│  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
│                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Countries  │  │ Vocabulary  │  │   Email/WA  │  │
│  │  (Config)   │  │  (Language) │  │ (Comms)     │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                    Type Layer                         │
│  types/domain.ts    types/api.ts    services/types.ts│
│  (entities)         (contracts)     (interfaces)     │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│                    Data Layer                         │
│  data/mock/*  (current)  →  Prisma ORM (after DB)   │
│  14 modules, barrel export via index.ts              │
└─────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────┐
│              Country Layer (Be[Country])              │
│                                                       │
│  BeKenya         BeGermany       BeNigeria            │
│  M-Pesa/KES      SEPA/EUR        Flutterwave/NGN      │
│  Safari/Eco      Tech/Mfg        Tech/Trade           │
│  UTAMADUNI       Local partners  Lagos network        │
└─────────────────────────────────────────────────────┘
```

---

## 3. Core Libraries

### lib/vocabulary.ts — The Language Engine

Every word in the platform is defined here. This prevents drift across sessions.

```typescript
export const VOCAB = {
  pioneer: 'Pioneer', // Never: user, job seeker
  anchor: 'Anchor', // Never: employer, company
  path: 'Path', // Never: job, vacancy
  chapter: 'Chapter', // Never: application
  venture: 'Venture', // Never: tour, booking
  compass: 'Compass', // Never: search, finder
}
```

### lib/countries.ts — The Country Registry

12 deployment configs: KE, DE, GB, US, AE, NG, GH, ZA, UG, TZ, CA, IN.

### lib/country-selector.ts — Geographic Intelligence

16 countries with full geographic data, 14 languages with metadata. Provides:

- `distanceKm()` — Haversine great-circle distance
- `isNearby()` — proximity check (< 1800km threshold)
- `getGroupedCountries()` — region-grouped with isNearby flags
- `languageOverlap()` — collaboration score 0–1
- `getGroupedByLanguage()` — language-first UI grouping
- `LANGUAGE_REGISTRY` — 14 languages with nativeName, countries, digitalReach

### lib/compass.ts — Route Corridors

Predefined country-to-country routes with demand, sectors, visa types.

### lib/matching.ts — The Scoring Engine

4-dimension scoring for Pioneer-Path matching:

```
Score = (skillMatch × 0.35) + (locationFit × 0.25) + (culturalFit × 0.20) + (intentAlign × 0.20)
```

### lib/nav-structure.ts — Navigation Data

Single source of truth for all Nav + Footer link arrays (primary, pioneer, anchor, about, footer columns). Components import from here — never inline links.

### lib/safari-packages.ts — Kenya Experiences

Real packages with real pricing, real operators.

---

## 4. Type System

### types/domain.ts — Core Entities

```typescript
// Enums: UserRole, PathType, PathStatus, ChapterStatus, PaymentStatus, PaymentProvider
// Types: Pioneer, PioneerProfile, Anchor, Path, PathListItem, Chapter, Payment,
//        MatchResult, PlatformStats, AdminPioneer, AdminPath, PricingPlan, FilterCategory
```

### types/api.ts — API Contracts

```typescript
// Generic: ApiResponse<T>, PaginatedResponse<T>
// Requests: CreatePathRequest, UpdatePathRequest, OnboardingRequest, CompassRequest,
//           OpenChapterRequest, MpesaStkPushRequest, SearchRequest, UpdateProfileRequest
// Responses: CompassResponse, MpesaStkPushResponse, SearchResponse, AdminDashboardResponse
```

### services/types.ts — Service Interfaces

```typescript
// IPathService, IPioneerService, IAnchorService, IChapterService,
// ICompassService, IPaymentService, IAdminService, IPricingService, IStaticDataService
// Clean contracts for mock → real DB swap
```

---

## 5. Data Layer

### Current: Centralized Mock Data (data/mock/)

All mock data lives in `data/mock/` with a barrel export via `index.ts`.

| Module                 | Contents                                                    |
| ---------------------- | ----------------------------------------------------------- |
| `paths.ts`             | MOCK_VENTURE_PATHS, MOCK_MATCHING_PATHS                     |
| `pioneers.ts`          | MOCK_CURRENT_PIONEER, MOCK_CHAPTERS, admin data             |
| `admin.ts`             | MOCK_PLATFORM_STATS, MOCK_ALL_ANCHORS, MOCK_ALL_PATHS       |
| `skills.ts`            | SKILLS_BY_TYPE (6 Pioneer types × ~24 skills)               |
| `pricing.ts`           | PRICING_PLANS, PAYMENT_METHODS                              |
| `homepage.ts`          | COUNTRY_GREETINGS, ROTATING_FLAGS, BENETWORK_PILLARS, etc.  |
| `about.ts`             | Values, sectors, payments, stats, vocab                     |
| `charity.ts`           | Impact, pillars, stories, partners                          |
| `business.ts`          | Divisions, countries, shares                                |
| `anchors-dashboard.ts` | 8 mock arrays for Anchor dashboard                          |
| `anchors-post-path.ts` | Currencies, payments, skills, steps                         |
| `profile.ts`           | Skills suggestions                                          |
| `media.ts`             | MEDIA_PATHS, MEDIA_FEATURED_PROJECTS, MEDIA_PLATFORMS       |
| `fashion.ts`           | FASHION_PATHS, FASHION_PARTNER_ANCHORS, FASHION_PROTECTIONS |

**Rule:** Pages import from `@/data/mock` — never define inline arrays.

### Future: Prisma + Neon PostgreSQL

When `DATABASE_URL` is set, service implementations swap from mock data to Prisma queries. The service interfaces in `services/types.ts` define the contract — the implementation changes, not the API.

---

## 6. Data Model (Prisma Schema)

```prisma
model User {
  id            String      @id
  role          Role        // PIONEER | ANCHOR | ADMIN
  profile       Profile?
  chapters      Chapter[]   // As Pioneer
  postedPaths   Path[]      // As Anchor
  payments      Payment[]
}

model Path {                // What Anchors post
  id            String      @id
  title         String
  country       String      // ISO code
  pathType      PathType    // FULL_PATH | CONTRACT | VENTURE | REMOTE
  anchorId      String
  anchor        User        @relation(fields: [anchorId])
  chapters      Chapter[]
}

model Chapter {             // What Pioneers open
  id            String      @id
  pioneerId     String
  pioneer       User        @relation(fields: [pioneerId])
  pathId        String
  path          Path        @relation(fields: [pathId])
  status        ChapterStatus  // OPEN | REVIEWING | ACCEPTED | DECLINED | PLACED
  openedAt      DateTime
}

model Payment {
  id            String      @id
  provider      String      // mpesa | stripe | flutterwave
  amount        Float
  currency      String
  utamaduniPct  Float       // % routed to community
}
```

---

## 7. API Architecture

All routes under `app/api/`:

```
/api/paths          GET (list + filter) | POST (create)
/api/paths/[id]     GET | PATCH | DELETE
/api/chapters       POST → Pioneer opens Chapter on a Path
/api/compass        POST → geo-detect + route matching
/api/search         GET → full-text + scored results
/api/onboarding     POST → Pioneer profile creation
/api/social         POST → queue social media posts
/api/mpesa/stkpush  POST → initiate M-Pesa payment
/api/mpesa/callback POST → Safaricom webhook (signature verified)
/api/auth/[...nextauth] → NextAuth handlers
/api/profile        GET | PATCH → Pioneer/Anchor profile
```

Every API route:

- Validates input with Zod schemas
- Returns typed JSON responses (`ApiResponse<T>` from `types/api.ts`)
- Handles errors with proper HTTP codes
- Logs to console (Vercel logs)

---

## 8. Payment Architecture

### Kenya: M-Pesa Daraja API v2

```
Pioneer/Anchor → STK Push request
                      ↓
           Safaricom sends push to phone
                      ↓
           User confirms on phone (PIN)
                      ↓
        Safaricom → /api/mpesa/callback
                      ↓
          Verify signature → activate Path/booking
```

### International: Stripe

```
Anchor → Stripe Checkout session
             ↓
     Card payment (saved or new)
             ↓
     Stripe → webhook → activate Path
```

### Impact Routing (UTAMADUNI)

Every payment: 5-10% routed to UTAMADUNI CBO.
Tracked in `Payment.utamaduniPct` field.
Shown in impact dashboard at /charity.

---

## 9. Multi-Country Deployment Strategy

```
GitHub repo: services4xor-cloud/dev (one repo)
                    ↓
            Push to main branch
                    ↓
┌──────────────────────────────────────┐
│         Vercel Build Triggers        │
├──────────────┬───────────────────────┤
│  BeKenya     │  BeGermany (future)   │
│  COUNTRY=KE  │  COUNTRY=DE           │
│  bekenya.com │  begermany.com        │
└──────────────┴───────────────────────┘
```

Each Vercel project builds the same code with different env vars.

---

## 10. File Ownership by Layer

| File/Directory          | Layer        | Stability                                |
| ----------------------- | ------------ | ---------------------------------------- |
| lib/vocabulary.ts       | Core         | Never change terms                       |
| lib/countries.ts        | Core         | Add countries, don't rename fields       |
| lib/country-selector.ts | Core         | Add countries/languages, keep interfaces |
| lib/compass.ts          | Core         | Add routes, don't change interface       |
| lib/matching.ts         | Core         | Tune weights, keep 4-dimension model     |
| lib/nav-structure.ts    | Core         | Add links, keep structure                |
| types/                  | Core         | Extend, don't break contracts            |
| services/types.ts       | Core         | Add methods, don't remove                |
| data/mock/              | Transitional | Will be replaced by Prisma queries       |
| app/page.tsx            | BeKenya      | Change freely                            |
| app/be/[country]/       | Platform     | Add countries here                       |
| prisma/schema.prisma    | Data         | Migrate carefully                        |

---

## 11. Testing Strategy

```
Unit tests:  __tests__/ — lib/* functions, API schemas (25/25 ✅)
Visual tests: tests/visual/ — Playwright smoke + brand + responsive (102/102 ✅)
```

All tests pass. Run with `npm run test` (Jest) and `npx playwright test` (Playwright).
CI enforces: lint → typecheck → test → build (in that order).
See [TESTING.md](./TESTING.md) for full details.

---

## 12. Dev Tooling

| Tool         | Config              | Purpose                                             |
| ------------ | ------------------- | --------------------------------------------------- |
| Prettier     | `.prettierrc.json`  | No semis, single quotes, trailing commas, 100 chars |
| ESLint       | `.eslintrc.json`    | next/core-web-vitals + prettier + strict rules      |
| Husky        | `.husky/pre-commit` | Pre-commit: Prettier + ESLint on staged files       |
| lint-staged  | `package.json`      | Run formatters on staged .ts/.tsx/.json/.md/.css    |
| EditorConfig | `.editorconfig`     | 2-space indent, LF, UTF-8, trim trailing            |
| nvmrc        | `.nvmrc`            | Node 20 locked                                      |

---

## 13. The Mission Architecture (Conceptual)

```
Colonial Economics (historic):
  Resources → Developing World → Developed World (one-way)

Be[Country] Architecture (reversal):
  Skills + Culture + Products → Any Country (multi-directional)

  Kenya Pioneer ←→ German Anchor (direct, fair, no middlemen)
  Kenyan Safari ←→ Dutch Explorer (direct booking, lodges paid)
  Kenyan Goods ←→ US Market (direct trade, no extraction)
```

---

_Last updated: Session 17 (2026-03-11)_
