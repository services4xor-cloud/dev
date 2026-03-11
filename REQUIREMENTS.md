# Be[Country] Platform — Requirements & Decisions Log

> Living document. Records user requirements and architectural decisions.
> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [PRD.md](./PRD.md) · [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
> Last updated: Session 15 (2026-03-11)

---

## 1. User Requirements (from conversation history)

### R1 — Country Selection as First Action

**Source**: Session 5

**Requirement**: The very first interaction a Pioneer has is selecting destination countries in **priority order**. First choice = highest match score. Allow up to 5 selections.

**Implementation**: `components/CountryPrioritySelector.tsx`

- Used in: `app/compass/page.tsx` (Step 1), `app/onboarding/page.tsx` (Step 3)
- Data source: `lib/country-selector.ts` (single source of truth)
- **Status: ✅ Complete**

### R2 — Proximity Clustering (Nearby Countries)

**Source**: Session 5

**Requirement**: Countries geographically close (< 1800km, Haversine) get green pulse animation, glow border, "Nearby" badge.

**Implementation**: `lib/country-selector.ts` → `distanceKm()`, `isNearby()`, `getGroupedCountries()`

- **Status: ✅ Complete**

### R3 — No Duplicate Country Data

**Source**: Code audit session 5

**Requirement**: ONE canonical source of country data. All pages MUST import from `lib/country-selector.ts`.

**Eliminated duplicates**: DESTINATIONS in compass, DESTINATIONS + COUNTRY_LIST in onboarding, ORIGIN_COUNTRIES in anchors/post-path.

- **Status: ✅ Complete**

### R4 — Responsive: Watch → TV

**Source**: Session 4

**Implementation**: Custom screens `xs: 380px`, `3xl: 1920px`, `4xl: 2560px`. Fluid typography with `clamp()`. TV media queries.

- **Status: ✅ Complete**

### R5 — Golden Ratio Design System (φ = 1.618)

**Source**: Session 4

**Implementation**: `tailwind.config.ts` — spacing, fontSize, borderRadius, lineHeight phi tokens.

- **Status: ✅ Tokens added. Progressive adoption ongoing.**

### R6 — Brand Consistency (No Old Orange)

**Source**: Brand guidelines

**Requirement**: No `#FF6B35`, `orange-*`, `amber-*`, `yellow-*` Tailwind classes.

- **Status: ✅ Complete (Session 6 orange sweep, Session 11 amber/yellow sweep)**

### R7 — BeNetwork Vocabulary Everywhere

**Source**: CLAUDE.md section 3

**Requirement**: Never use old terms (job, employer, application). Always use Pioneer/Anchor/Path/Chapter/Venture/Compass.

**Implementation**: `lib/vocabulary.ts` — import `VOCAB`, `PIONEER_TYPES`.

- **Status: ✅ Complete — including Prisma schema, API routes, all UI (Session 14)**

### R8 — No Duplicate Navs / Footers

**Source**: Session 4 UX audit

**Rule**: `app/layout.tsx` provides global Nav + Footer. Pages never include their own. Secondary sticky elements use `sticky top-16 z-40`.

- **Status: ✅ Complete**

### R9 — Security: Next.js Patched

**Source**: Session 4

Next.js 14.2.5 → 14.2.35 (patches CVE-2024-46982, CVE-2024-56332, CVE-2024-34351, CVE-2024-46798).

- **Status: ✅ Complete**

### R10 — Preserve Functionality Before Removal

**Source**: Session 4

**Rule**: Before removing any UI element, verify: is it redundant? is it unique? Document the decision.

- **Status: ✅ Enforced**

### R11 — Dark Theme All Pages

**Source**: Session 6 (PRD D2)

**Requirement**: ALL pages use bg-[#0A0A0F] dark theme. No exceptions.

- **Status: ✅ Complete (Session 9) — all 20+ pages converted**

### R12 — Legacy Route Redirects

**Source**: Session 6

**Requirement**: Old URLs 307-redirect to modern equivalents using Next.js `redirect()`.

| Old URL                | New URL               |
| ---------------------- | --------------------- |
| `/dashboard`           | `/pioneers/dashboard` |
| `/employers/dashboard` | `/anchors/dashboard`  |
| `/post-job`            | `/anchors/post-path`  |
| `/jobs`                | `/ventures`           |
| `/jobs/[id]`           | `/ventures`           |
| `/experiences`         | `/ventures`           |

- **Status: ✅ Complete**

### R13 — Centralized Mock Data

**Source**: Session 10

**Requirement**: All mock data in `data/mock/` directory with barrel export. Zero inline arrays in pages.

- **Status: ✅ Complete (14 modules)**

### R14 — Centralized Nav/Footer Links

**Source**: Session 13

**Requirement**: All Nav + Footer link arrays in `lib/nav-structure.ts`. Components import from there.

- **Status: ✅ Complete**

---

## 2. Architecture Rules (Enforced)

### Data Sources — Single Source of Truth

| Data                              | Source                    | Never                         |
| --------------------------------- | ------------------------- | ----------------------------- |
| Country data (geographic)         | `lib/country-selector.ts` | Inline in pages               |
| Country config (payment, sectors) | `lib/countries.ts`        | Inline in pages               |
| Pioneer types + vocabulary        | `lib/vocabulary.ts`       | Hardcode strings              |
| Route corridors                   | `lib/compass.ts`          | Inline in pages               |
| Nav/Footer links                  | `lib/nav-structure.ts`    | Inline in components          |
| Mock data                         | `data/mock/`              | Inline in pages               |
| Domain types                      | `types/domain.ts`         | Ad-hoc type definitions       |
| API contracts                     | `types/api.ts`            | Ad-hoc request/response types |

### Navigation Architecture

```
app/layout.tsx
├── <Nav />          ← sticky top-0 z-50 (global, always present)
├── {children}       ← all page content here
└── <Footer />       ← always present
```

Secondary sticky elements use `sticky top-16 z-40`.

---

## 3. Next Steps (Priority Order)

### Blocked on Human Credentials

See [HUMAN_MANUAL.md](./HUMAN_MANUAL.md):

1. DATABASE_URL (Neon PostgreSQL) → enables real Prisma queries
2. NEXTAUTH_SECRET → enables auth security
3. GOOGLE_CLIENT_ID + SECRET → enables Google Sign-In
4. RESEND_API_KEY → enables real email
5. MPESA_CONSUMER_KEY + SECRET → enables real M-Pesa payments

### Can Build Now

1. Kenya Offerings pages (`/offerings/safaris`, `/offerings/eco-tourism`, `/offerings/trade`)
2. End-to-end mock booking flow
3. Loading skeletons + error boundaries
4. Progressive φ token adoption in Nav, Footer, cards

---

## 4. Document Index

| Doc                                    | Purpose                                   |
| -------------------------------------- | ----------------------------------------- |
| [CLAUDE.md](./CLAUDE.md)               | Master agent gateway                      |
| [PROGRESS.md](./PROGRESS.md)           | Live execution tracker                    |
| [PRD.md](./PRD.md)                     | Product requirements                      |
| [ROADMAP.md](./ROADMAP.md)             | Strategic phases + sprints                |
| [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) | Brand tokens + component patterns         |
| [ARCHITECTURE.md](./ARCHITECTURE.md)   | Technical structure                       |
| [REQUIREMENTS.md](./REQUIREMENTS.md)   | This file — user requirements + decisions |
| [TESTING.md](./TESTING.md)             | Test strategy + test files                |
| [HUMAN_MANUAL.md](./HUMAN_MANUAL.md)   | Human-only setup steps                    |

---

_Last updated: Session 15 (2026-03-11)_
