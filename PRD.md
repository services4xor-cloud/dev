# BeNetwork — Product Requirements Document
> **v5.0 · 2026-03-10 · Sessions completed: 6**
> Owner: Tobias | Platform: BeKenya → Be[Country]
> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [ROADMAP.md](./ROADMAP.md) · [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## Vision

> **"Find where you belong. Go there."**

BeNetwork is an **identity-first life-routing platform** for people who want to work, experience, and belong across countries. It is not a job board. It is a compass.

**The deeper mission**: Reverse colonial economic flows. Empower people in the Global South to move, contribute, and thrive on their own terms — through open trade, fair compensation, and direct country-to-country connections. No intermediaries. No gatekeepers.

**Architecture**: One codebase → many countries via `NEXT_PUBLIC_COUNTRY_CODE`. Currently live as **BeKenya**. Next: BeGermany, BeNigeria.

---

## Self-Resolved Questions & Clash Log

*Questions I asked myself, answered based on vision + repo state + user conversations.*

### Q1: Is this a job board or a life platform?
**A: Life platform first.** A job board lists vacancies. BeNetwork routes people. The Compass finds corridors (Kenya→Germany, Kenya→UAE) based on visa viability, demand score, and Pioneer identity — not just keyword matching. Safari experiences and professional Paths are unified in the same feed (Ventures) because the line between "work" and "experience" is artificial for a mobile generation.

### Q2: Dark theme everywhere, or mixed?
**A: Dark everywhere.** The few remaining light-themed pages (business, contact, login, signup, pricing, profile, referral) are legacy tech debt from early sessions. They must be rewritten dark. Rule: `background: #0A0A0F` on all pages, no exceptions. The brand is night-sky dark + maroon warmth + gold light — this communicates premium, global, serious.

### Q3: Job board vocabulary clash — do we have "jobs" or "paths"?
**A: Paths only.** The word "job" never appears in user-facing UI. API routes `/api/jobs` are internal plumbing — rename to `/api/paths` in Phase 3 refactor. User sees: Pioneer → Compass → Ventures (Paths + Experiences) → Chapter. This vocabulary is enforced in `lib/vocabulary.ts`.

### Q4: Safari/tourism + professional jobs in same app — doesn't that fragment focus?
**A: No — this is the differentiation.** LinkedIn has no safaris. Airbnb has no professional placements. BeNetwork bridges work + experience because East Africa offers both, and international Anchors (eco-lodges, NGOs, tech firms) need both Pioneers and Explorers. The unified Ventures feed is intentional and competitive.

### Q5: M-Pesa only or multi-payment?
**A: Multi-payment with M-Pesa as hero.** M-Pesa first because: it's Kenya-native, it signals "we built this for you not for the West", and 85%+ of Kenyan adults use it. Stripe for international Explorers. Flutterwave for expansion to Nigeria/Ghana. Each country gets its own payment config in `lib/countries.ts`.

### Q6: Mobile app now or later?
**A: PWA now, native later.** The platform is already responsive from xs(380px) to 4K. The `manifest.ts` + `theme_color` are already set. Build PWA installability first (it's free). React Native wrapper in Phase 5 only after proof of daily active use.

### Q7: Should UTAMADUNI be an integral feature or a marketing add-on?
**A: Integral.** KES 50 from every booking is not charity marketing — it's a structural redistribution mechanism. The platform routes money BACK to communities that generate the value (safari locations, conservation areas, cultural heritage). This is the moral core and the differentiation from exploitative booking platforms.

### Q8: What is the right agent documentation structure?
**A: Flat hierarchy, CLAUDE.md as gateway.** Too many deep nested docs = agents losing context. Structure:
- `CLAUDE.md` — read this FIRST, always. Contains inline rules + links to everything.
- All other .md files are FLAT in root. Agents know where to find them.
- No subdirectory docs except `__tests__/` test files.

### Q9: Playwright visual tests — what exactly to check?
**A: Three layers:**
1. **Smoke** (every CI run): all pages return 200, no console errors.
2. **Brand** (every CI run): no `#FF6B35` or `orange-*` visible in DOM.
3. **Visual** (weekly screenshots): capture at xs/sm/md/lg/3xl — human reviews diff.

---

## BeNetwork Vocabulary

| BeNetwork     | Never say          | Description                                          |
|---------------|--------------------|------------------------------------------------------|
| **Pioneer**   | user, job seeker   | Person looking for paths, experiences, or routes     |
| **Anchor**    | employer, company  | Organisation that opens opportunities for Pioneers   |
| **Path**      | job, vacancy       | What Anchors post; what Pioneers pursue              |
| **Chapter**   | application        | A Pioneer opening a Path; the engagement record      |
| **Venture**   | tour, booking, gig | Experience (safari, eco) OR professional placement   |
| **Compass**   | search, filter     | 4-step smart route wizard; country-to-country engine |
| **Gate**      | country page       | `/be/[country]` landing (e.g. `/be/ke`, `/be/de`)    |
| **Route**     | migration path     | Country corridor: KE→DE, KE→GB, KE→AE, etc.         |

Source: `lib/vocabulary.ts` — IMPORT `VOCAB` from here, never hardcode strings.

---

## Target Users

### Pioneers (Primary — 80% of traffic)
Real people, not personas. Three archetypes:

**African Professional (25–38)**
- Has: Skills in tech, healthcare, eco-tourism, engineering, education
- Wants: International opportunity without gatekeepers or visa exploitation
- Blocked by: Unclear visa routes, foreign-currency payment barriers, trust deficit
- BeNetwork solves: Compass shows viable corridors + requirements; M-Pesa pays them

**International Explorer (28–55)**
- Has: Budget, curiosity, carbon guilt
- Wants: Authentic safari/experience that isn't a resort, contributes to community
- Blocked by: Cannot distinguish legitimate operators from tourist traps
- BeNetwork solves: Verified Anchors, transparent UTAMADUNI contribution, local pricing

**Diaspora Returnee (30–45)**
- Has: Foreign skills + money, wants to invest back in East Africa
- Wants: Legitimate local Anchor to work with, community connection
- Blocked by: Doesn't know who to trust locally
- BeNetwork solves: Verified Anchor directory, Compass reverse routing (abroad → Kenya)

### Anchors (Secondary — 15% of traffic, 80% of revenue)
- Safari lodges (Sarova, Serena, eco-operators) — need multilingual guides, managers
- International NGOs (GIZ, DfID implementers) — need field staff
- Tech companies (Safaricom, Andela, MPESA APIs) — need global-mobile engineers
- Kenyan hospitals + schools — need certified diaspora staff
- European/Gulf employers — seeking East African professionals

### UTAMADUNI Partners (5% of traffic)
- Conservation workers, local guides, cultural educators
- Receive direct allocation from every booking — not charity, structural income

---

## Core User Flows (with Acceptance Criteria)

### Flow 1: Pioneer Compass Journey
```
Homepage → Country Select → Compass Step 1 (Countries) → Step 2 (Pioneer Type) → Step 3 (Skills) → Step 4 (Timeline) → Route Results → Browse Ventures → Open Chapter
```
**Acceptance Criteria:**
- [ ] Country selection uses `lib/country-selector.ts` with proximity clustering
- [ ] Proximity (< 1800km Haversine) shows green pulse badge
- [ ] Up to 5 countries in priority order
- [ ] Route results show real corridor data from `lib/compass.ts`
- [ ] Results filtered by Pioneer type (Explorer/Professional/etc.)
- [ ] "Start Compass" button present on every page that leads to `/compass`

### Flow 2: Safari Booking
```
Ventures feed → Experience card → /experiences/[id] → Date select → M-Pesa or Card → Confirmation → WhatsApp receipt
```
**Acceptance Criteria:**
- [ ] `formatPackagePrice(pkg)` shows correct KES/USD based on session
- [ ] M-Pesa button sends STK Push to user's phone
- [ ] Confirmation shows: Booking ID, UTAMADUNI contribution (KES 50), Anchor contact
- [ ] WhatsApp template sent from `lib/whatsapp-templates.ts`
- [ ] Email sent via `lib/email.ts` (Resend)

### Flow 3: Anchor Post-Path
```
Anchor signs up → /anchors/post-path → Fill wizard (5 steps) → Preview → Publish → Path live in Ventures feed
```
**Acceptance Criteria:**
- [ ] Path requires: title, description, category, salary range, requirements
- [ ] Category maps to Ventures filter (professional/explorer/creative/community)
- [ ] Published path appears in `/ventures` feed within 60s
- [ ] Anchor gets email confirmation + WhatsApp notification
- [ ] KES 500 payment charged at publish (M-Pesa or Stripe)

### Flow 4: Pioneer Onboarding
```
Sign up → /onboarding (5 steps: name, type, skills, countries, timeline) → /pioneers/dashboard
```
**Acceptance Criteria:**
- [ ] Step 3 uses `CountryPrioritySelector` component
- [ ] Pioneer type persisted to DB (when DB available)
- [ ] Dashboard shows personalized Paths based on Pioneer type + countries
- [ ] Progress bar shows onboarding completion %

---

## Feature Inventory (Current State)

### ✅ Phase 1 Complete

| Feature | File | Status |
|---------|------|--------|
| Homepage (identity-first) | `app/page.tsx` | ✅ Dark theme, brand consistent |
| Compass wizard (4 steps) | `app/compass/page.tsx` | ✅ Uses CountryPrioritySelector |
| Ventures unified feed | `app/ventures/page.tsx` | ✅ Single filter, no duplicates |
| Safari experience detail | `app/experiences/[id]/page.tsx` | ✅ Booking UI, gold brand |
| Pioneer dashboard | `app/pioneers/dashboard/page.tsx` | ✅ 5 tabs, dark theme |
| Anchor dashboard | `app/anchors/dashboard/page.tsx` | ✅ 5 tabs, dark theme |
| Post-Path wizard | `app/anchors/post-path/page.tsx` | ✅ Multi-step form |
| Pioneer onboarding | `app/onboarding/page.tsx` | ✅ 5 steps, country selector |
| Country Gate | `app/be/[country]/page.tsx` | ✅ 12 countries |
| About | `app/about/page.tsx` | ✅ Golden ratio layout |
| 404 | `app/not-found.tsx` | ✅ Dark theme, BeNetwork vocab |
| UTAMADUNI | `app/charity/page.tsx` | ✅ Brand sweep done |
| M-Pesa API | `app/api/mpesa/stkpush` | ✅ Coded, needs live keys |
| Country priority selector | `components/CountryPrioritySelector.tsx` | ✅ Proximity clustering |

### 🔄 Phase 2 In Progress

| Feature | File | Status |
|---------|------|--------|
| Dark theme rewrites | business, contact, login, signup, pricing, profile | ⏳ Legacy light theme |
| Real database | Prisma + Neon | ⛔ Needs DATABASE_URL |
| Real auth | NextAuth + Google | ⛔ Needs GOOGLE_ keys |
| Real M-Pesa | Daraja v2 live | ⛔ Needs MPESA_ keys |
| Real email | Resend | ⛔ Needs RESEND_API_KEY |
| Kenya Offerings pages | `/offerings/safaris` etc | ❌ Not built |
| E2E booking flow | frontend → API → payment | ❌ Not wired |
| Visual test suite | `tests/visual/` | 🔧 Being built now |

---

## Revenue Model

| Stream | Mechanism | Price | Month-3 Target |
|--------|-----------|-------|----------------|
| Anchor Path listing | Per-post fee | KES 500 | KES 50,000/mo |
| Anchor subscription | Monthly seat | KES 2,500 | KES 25,000/mo |
| Safari booking commission | 10% platform fee | Variable | KES 30,000/mo |
| Pioneer featured profile | Promoted in feed | KES 200/week | KES 10,000/mo |
| International transfers | Stripe/FW spread | 0.5–1.5% | KES 15,000/mo |
| **Total Month-3 target** | | | **~KES 130,000/mo** |

**Unit economics:** 1 safari booking (avg KES 52,000) = KES 5,200 revenue + KES 50 UTAMADUNI = 10% margin. Payback on pioneer acquisition < 1 booking.

---

## Technical Constraints & Rules

1. **`'use client'` at line 1** for every file with `onClick`, `useState`, `useEffect`
2. **`prisma generate`** runs before `next build` (in `package.json` build script)
3. **Mock data** in all pages until `DATABASE_URL` is set (see `lib/db.ts`)
4. **Country data** in `lib/country-selector.ts` ONLY — never inline in pages
5. **Vocabulary** in `lib/vocabulary.ts` ONLY — never hardcode BeNetwork terms
6. **Brand colors** in `tailwind.config.ts` — never use `#FF6B35` or `orange-*` classes
7. **Push after every commit** — Vercel auto-deploys from `main`

---

## Accessibility Requirements (Non-negotiable)

- WCAG AA minimum for all text (gold `#C9A227` on dark `#0A0A0F` = 8.9:1 ✅)
- Touch targets: 44px minimum (WCAG 2.5.5) — enforced in `globals.css`
- Skip-to-content link on every page (in `globals.css` `.skip-to-content`)
- Focus-visible ring: 2px gold ring on all focusable elements
- `aria-label` on all icon-only buttons
- `alt` text on all images
- Keyboard navigation for all interactive elements

---

## Phase Summary

See [ROADMAP.md](./ROADMAP.md) for full strategic phases with milestones and success metrics.

**Current Phase: 2 — BeKenya Live**
**Next milestone:** Connect database + real auth → 5 real Anchor partners + 50 real Pioneers.

---

*Last updated: Session 6 (2026-03-10)*
