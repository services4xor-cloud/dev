# Be[Country] — Product Requirements Document

> **v7.0 · Session 20 · 2026-03-11**
> Owner: Tobias | Platform: BeKenya → Be[Country/Tribe/Location]
> ← [CLAUDE.md](./CLAUDE.md) | [ROADMAP.md](./ROADMAP.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Vision

> **"Find where you belong. Go there."**

Be[Country] is an **identity-first life-routing platform**. Not a job board. A compass.

**The deeper mission:** Reverse colonial economic flows. Empower people in the Global South to move, contribute, and thrive — through open trade, fair compensation, and direct connections.

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

### ✅ Complete

- 20+ pages, dark theme, brand consistent
- Compass wizard + CountryPrioritySelector
- Ventures unified feed (Paths + Experiences)
- Pioneer + Anchor dashboards (5 tabs each)
- M-Pesa API client (sandbox)
- Centralized mock data (15 modules)
- Type system (domain + API + services)
- International offerings (country-aware, purpose-driven)
- Semantic color token system
- Loading skeletons (reusable + dashboards + compass)
- Error boundaries (dashboards, compass, ventures)
- WCAG AA contrast enforcement
- Mock booking flow + engagement nudges
- Progressive φ token adoption
- 102 Playwright + 25 Jest tests
- Dev tooling (Prettier, ESLint, Husky)

### ⛔ Blocked on Credentials

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

## Constraints

1. `'use client'` for interactive files
2. Mock data in `data/mock/` until DB
3. Country data: `lib/country-selector.ts` only
4. Vocabulary: `lib/vocabulary.ts` only
5. Brand colors: Tailwind tokens only
6. Nav/Footer: `lib/nav-structure.ts` only
7. All design from `DESIGN_SYSTEM.md`

---

_Last updated: Session 20 (2026-03-11)_
