# Be[Country] — Architecture

> Technical blueprint. Read before touching lib/ or API.
> ← [CLAUDE.md](./CLAUDE.md) | [PRD.md](./PRD.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

---

## 1. Core Insight

The same human desire — to build a good life — takes different paths in different countries, tribes, and locations.

**Grouping priority:** Language + Culture first. Distance second. A Maasai in Tanzania and a Maasai in Kenya are culturally "closer" than two different tribes in the same city. This is identity-first routing, not geography-first.

```
One Codebase
     ↓
Identity Config (language / culture / country / location)
     ↓
Localized Experience (currency, payment, language, sectors, routes)
```

**Purpose:** Bring people together AND lever potentials.

**Scale:** Be[Country] → Be[Tribe] → Be[Location]. Architecture supports all three levels.

---

## 2. System Layers

```
┌────────────────────────────────────────────┐
│              Platform Engines              │
│  Compass · Matching · Social · Offerings   │
├────────────────────────────────────────────┤
│              Core Config                   │
│  Countries · Vocabulary · Email/WA         │
├────────────────────────────────────────────┤
│              Type Layer                    │
│  types/domain.ts · types/api.ts · services │
├────────────────────────────────────────────┤
│              Data Layer                    │
│  data/mock/* (now) → Prisma ORM (after DB) │
├────────────────────────────────────────────┤
│           Identity Layer                   │
│  BeKenya    BeGermany    BeNigeria          │
│  M-Pesa     SEPA         Flutterwave       │
│  KES        EUR          NGN               │
└────────────────────────────────────────────┘
```

---

## 3. Core Libraries

| Library                     | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `lib/vocabulary.ts`         | BeNetwork terms. Single source. Never hardcode. |
| `lib/countries.ts`          | 12 deployment configs (payment, sectors, brand) |
| `lib/country-selector.ts`   | 16 countries, 14 languages, Haversine proximity |
| `lib/compass.ts`            | Route corridors (KE→DE, KE→GB, etc.)            |
| `lib/matching.ts`           | 4-dim scoring (culture > distance in weighting) |
| `lib/nav-structure.ts`      | Nav + Footer links (single source)              |
| `lib/safari-packages.ts`    | Kenya experience packages                       |
| `lib/offerings.ts`          | Country-aware, purpose-driven recommendations   |
| `lib/mpesa.ts`              | M-Pesa Daraja API v2                            |
| `lib/email.ts`              | Resend branded templates                        |
| `lib/whatsapp-templates.ts` | 10 templates (en/sw/de)                         |

---

## 4. Type System

**`types/domain.ts`** — Entities: Pioneer, Anchor, Path, Chapter, Payment, MatchResult + enums.

**`types/api.ts`** — Contracts: ApiResponse<T>, PaginatedResponse<T>, all request/response types.

**`services/types.ts`** — Interfaces: IPathService, IPioneerService, etc. Clean mock → DB swap.

---

## 5. Data Layer

**Current:** `data/mock/` — 15 modules, barrel export via `index.ts`. Pages import from `@/data/mock`.

**Future:** When `DATABASE_URL` is set, service implementations swap to Prisma queries. Interfaces stay the same.

| Module                                        | Contents              |
| --------------------------------------------- | --------------------- |
| paths, pioneers, admin                        | Core entity mock data |
| skills, pricing                               | Config data           |
| homepage, about, charity, business            | Page-specific content |
| anchors-dashboard, anchors-post-path, profile | Dashboard data        |
| media, fashion, offerings                     | Specialized content   |

---

## 6. Data Model (Prisma)

```
User (id, role: PIONEER|ANCHOR|ADMIN, profile, chapters, postedPaths, payments)
Path (id, title, country, pathType, anchorId, chapters)
Chapter (id, pioneerId, pathId, status: OPEN→REVIEWING→ACCEPTED→PLACED, openedAt)
Payment (id, provider: mpesa|stripe|flutterwave, amount, currency, utamaduniPct)
```

---

## 7. API Routes

```
/api/paths          GET | POST
/api/paths/[id]     GET | PATCH | DELETE
/api/chapters       POST (Pioneer opens Chapter)
/api/compass        POST (geo-detect + route match)
/api/search         GET (full-text + scored)
/api/onboarding     POST (Pioneer profile)
/api/mpesa/stkpush  POST (initiate payment)
/api/mpesa/callback POST (Safaricom webhook)
/api/auth/[...]     NextAuth handlers
/api/profile        GET | PATCH
/api/social         POST (queue social posts)
```

All routes: Zod validation, typed responses (`ApiResponse<T>`), proper HTTP codes.

---

## 8. Payment Architecture

**Kenya:** M-Pesa STK Push → User confirms on phone → Callback → Activate booking.

**International:** Stripe Checkout → Card → Webhook → Activate.

**Impact:** Every payment routes 5–10% to UTAMADUNI CBO via `Payment.utamaduniPct`.

---

## 9. Multi-Identity Deployment

```
NEXT_PUBLIC_COUNTRY_CODE=KE → BeKenya  (bekenya.com)
NEXT_PUBLIC_COUNTRY_CODE=DE → BeGermany (begermany.com)
NEXT_PUBLIC_COUNTRY_CODE=NG → BeNigeria (benigeria.com)
```

Same repo, different Vercel projects. Future: tribe and location layers within each country.

---

## 10. File Ownership

| File/Directory          | Stability                          |
| ----------------------- | ---------------------------------- |
| lib/vocabulary.ts       | Never change terms                 |
| lib/countries.ts        | Add countries, don't rename fields |
| lib/country-selector.ts | Add countries/languages, keep API  |
| types/                  | Extend, don't break contracts      |
| data/mock/              | Transitional → Prisma queries      |

---

## 11. Testing

Jest 25/25 (lib functions) + Playwright 102/102 (smoke + brand + responsive).

CI: lint → typecheck → jest → build → playwright.

→ [TESTING.md](./TESTING.md)

---

_Last updated: Session 20 (2026-03-11)_
