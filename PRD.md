# BeNetwork — Product Requirements Document

> **v6.0 · 2026-03-11 · Sessions completed: 14**
> Owner: Tobias | Platform: BeKenya → Be[Country]
> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [ROADMAP.md](./ROADMAP.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Vision

> **"Find where you belong. Go there."**

BeNetwork is an **identity-first life-routing platform** for people who want to work, experience, and belong across countries. It is not a job board. It is a compass.

**The deeper mission**: Reverse colonial economic flows. Empower people in the Global South to move, contribute, and thrive on their own terms — through open trade, fair compensation, and direct country-to-country connections. No intermediaries. No gatekeepers.

**Architecture**: One codebase → many countries via `NEXT_PUBLIC_COUNTRY_CODE`. Currently live as **BeKenya**. Next: BeGermany, BeNigeria.

---

## Design Decisions (Resolved)

### D1: Life platform, not job board

A job board lists vacancies. BeNetwork routes people. The Compass finds corridors (Kenya→Germany, Kenya→UAE) based on visa viability, demand score, and Pioneer identity. Safari experiences and professional Paths are unified in the same feed (Ventures) because the line between "work" and "experience" is artificial for a mobile generation.

### D2: Dark theme everywhere

ALL pages use dark theme. Background: `#0A0A0F`. The brand is night-sky dark + maroon warmth + gold light — this communicates premium, global, serious. **Status: ✅ Complete (Session 9).**

### D3: BeNetwork vocabulary only

The word "job" never appears in user-facing UI or API routes. User sees: Pioneer → Compass → Ventures (Paths + Experiences) → Chapter. Enforced in `lib/vocabulary.ts`. **Status: ✅ Complete (Session 14) — including Prisma schema and all API routes.**

### D4: Safari + Professional in same app

LinkedIn has no safaris. Airbnb has no professional placements. BeNetwork bridges work + experience because East Africa offers both. The unified Ventures feed is intentional and competitive.

### D5: M-Pesa hero, multi-payment

M-Pesa first (Kenya-native, 85%+ adult adoption). Stripe for international. Flutterwave for Nigeria/Ghana expansion. Each country gets its own payment config in `lib/countries.ts`.

### D6: PWA now, native later

Already responsive xs→4K with fluid typography. PWA installability first. React Native in Phase 5 after proof of daily active use.

### D7: UTAMADUNI is integral

KES 50 from every booking is structural redistribution, not charity marketing. Tracked in `Payment.utamaduniPct`. Shown at /charity.

### D8: Flat doc hierarchy, CLAUDE.md as gateway

All .md files flat in root. 10 files total (after cleanup): CLAUDE.md, PROGRESS.md, PRD.md, ROADMAP.md, DESIGN_SYSTEM.md, ARCHITECTURE.md, REQUIREMENTS.md, TESTING.md, HUMAN_MANUAL.md, README.md.

### D9: Playwright visual tests — three layers

1. **Smoke** (CI): all pages return 200, no console errors (15/15 ✅)
2. **Brand** (CI): no `#FF6B35` or `orange-*` in DOM (26/26 ✅)
3. **Responsive** (CI): no horizontal scroll at any breakpoint (48/48 ✅)

---

## BeNetwork Vocabulary

| BeNetwork   | Never say          | Description                                          |
| ----------- | ------------------ | ---------------------------------------------------- |
| **Pioneer** | user, job seeker   | Person looking for paths, experiences, or routes     |
| **Anchor**  | employer, company  | Organisation that opens opportunities for Pioneers   |
| **Path**    | job, vacancy       | What Anchors post; what Pioneers pursue              |
| **Chapter** | application        | A Pioneer opening a Path; the engagement record      |
| **Venture** | tour, booking, gig | Experience (safari, eco) OR professional placement   |
| **Compass** | search, filter     | 4-step smart route wizard; country-to-country engine |
| **Gate**    | country page       | `/be/[country]` landing (e.g. `/be/ke`, `/be/de`)    |
| **Route**   | migration path     | Country corridor: KE→DE, KE→GB, KE→AE, etc.          |

Source: `lib/vocabulary.ts` — IMPORT `VOCAB` from here, never hardcode strings.

---

## Target Users

### Pioneers (Primary — 80% of traffic)

**African Professional (25–38)**

- Has: Skills in tech, healthcare, eco-tourism, engineering, education
- Wants: International opportunity without gatekeepers or visa exploitation
- BeNetwork solves: Compass shows viable corridors + requirements; M-Pesa pays them

**International Explorer (28–55)**

- Has: Budget, curiosity, carbon guilt
- Wants: Authentic safari/experience that contributes to community
- BeNetwork solves: Verified Anchors, transparent UTAMADUNI contribution, local pricing

**Diaspora Returnee (30–45)**

- Has: Foreign skills + money, wants to invest back in East Africa
- Wants: Legitimate local Anchor to work with, community connection
- BeNetwork solves: Verified Anchor directory, Compass reverse routing (abroad → Kenya)

### Anchors (Secondary — 15% of traffic, 80% of revenue)

Safari lodges, international NGOs, tech companies, hospitals, European/Gulf employers.

### UTAMADUNI Partners (5% of traffic)

Conservation workers, local guides, cultural educators. Receive direct allocation from every booking.

---

## Core User Flows

### Flow 1: Pioneer Compass Journey

```
Homepage → Compass Step 1 (Countries) → Step 2 (Pioneer Type) → Step 3 (Skills) → Step 4 (Timeline) → Route Results → Browse Ventures → Open Chapter
```

### Flow 2: Safari Booking

```
Ventures feed → Experience card → /experiences/[id] → Date select → M-Pesa or Card → Confirmation → WhatsApp receipt
```

### Flow 3: Anchor Post-Path

```
Anchor signs up → /anchors/post-path → Fill wizard (5 steps) → Preview → Publish → Path live in Ventures feed
```

### Flow 4: Pioneer Onboarding

```
Sign up → /onboarding (5 steps: name, type, skills, countries, timeline) → /pioneers/dashboard
```

---

## Feature Status

### ✅ Complete (Phase 1)

| Feature                                         | Status |
| ----------------------------------------------- | ------ |
| 20+ pages, all dark theme, brand consistent     | ✅     |
| Compass wizard with CountryPrioritySelector     | ✅     |
| Ventures unified feed (Paths + Experiences)     | ✅     |
| Pioneer + Anchor dashboards (5 tabs each)       | ✅     |
| M-Pesa API client (sandbox ready)               | ✅     |
| Centralized mock data layer (14 modules)        | ✅     |
| Type system (domain + API + service interfaces) | ✅     |
| Playwright visual tests (89/89)                 | ✅     |
| Dev tooling (Prettier, ESLint, Husky)           | ✅     |
| Full BeNetwork vocabulary (UI + API + Prisma)   | ✅     |

### 🔄 Phase 2 — Needs Credentials

| Feature                       | Blocker          |
| ----------------------------- | ---------------- |
| Real database (Prisma + Neon) | DATABASE_URL     |
| Real auth (NextAuth + Google) | GOOGLE\_ keys    |
| Real M-Pesa payments          | MPESA\_ keys     |
| Real email (Resend)           | RESEND_API_KEY   |
| End-to-end booking flow       | All of the above |

### ❌ Not Built Yet

| Feature                               | Priority |
| ------------------------------------- | -------- |
| Kenya Offerings pages (/offerings/\*) | Medium   |
| Loading skeletons                     | Medium   |
| Error boundaries                      | Medium   |
| Progressive φ token adoption          | Low      |

---

## Revenue Model

| Stream                    | Mechanism        | Price        | Month-3 Target      |
| ------------------------- | ---------------- | ------------ | ------------------- |
| Anchor Path listing       | Per-post fee     | KES 500      | KES 50,000/mo       |
| Anchor subscription       | Monthly seat     | KES 2,500    | KES 25,000/mo       |
| Safari booking commission | 10% platform fee | Variable     | KES 30,000/mo       |
| Pioneer featured profile  | Promoted in feed | KES 200/week | KES 10,000/mo       |
| International transfers   | Stripe/FW spread | 0.5–1.5%     | KES 15,000/mo       |
| **Total Month-3 target**  |                  |              | **~KES 130,000/mo** |

---

## Technical Constraints

1. `'use client'` at line 1 for every file with `onClick`, `useState`, `useEffect`
2. `prisma generate` runs before `next build` (in `package.json`)
3. Mock data in `data/mock/` until `DATABASE_URL` is set
4. Country data in `lib/country-selector.ts` ONLY
5. Vocabulary in `lib/vocabulary.ts` ONLY
6. Brand colors in `tailwind.config.ts` — never `#FF6B35` or `orange-*`
7. Nav/Footer links in `lib/nav-structure.ts` ONLY

---

## Accessibility Requirements (Non-negotiable)

- WCAG AA minimum for all text (gold `#C9A227` on dark `#0A0A0F` = 8.9:1 ✅)
- Touch targets: 44px minimum (WCAG 2.5.5)
- Skip-to-content link on every page
- Focus-visible ring: 2px gold ring on all focusable elements
- `aria-label` on all icon-only buttons
- `alt` text on all images
- Keyboard navigation for all interactive elements

---

## Phase Summary

See [ROADMAP.md](./ROADMAP.md) for full strategic phases with milestones and success metrics.

**Current Phase: 2 — BeKenya Live**
**Blocker:** Human must provide credentials (see [HUMAN_MANUAL.md](./HUMAN_MANUAL.md))
**Next milestone:** Connect database + real auth → 5 real Anchor partners + 50 real Pioneers.

---

_Last updated: Session 15 (2026-03-11)_
