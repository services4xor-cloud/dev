# BeNetwork — Strategic Roadmap

> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [PRD.md](./PRD.md) · [PROGRESS.md](./PROGRESS.md)
> Living document. Updated each phase.

---

## Mission: Reverse the Flow

BeNetwork reverses colonial economic flows by empowering people in the Global South to move, work, and thrive on their own terms. Every Pioneer placed. Every safari booked. Every KES 50 to UTAMADUNI. This is not charity — this is structural change through technology.

**The 5-year vision:** 1 million Pioneers routed. 50 countries. $50M+ in value delivered to African communities.

---

## Phase Overview

```
Phase 1 ✅ Foundation    — Platform built, design system, tested, vocabulary complete
Phase 2 🔄 BeKenya Live  — Real data, real payments, real users (blocked on credentials)
Phase 3 📈 Traction      — 500+ Pioneers, 50+ Paths, 20 safaris/month
Phase 4 🌍 Expansion     — BeGermany + BeNigeria, multi-country
Phase 5 🚀 Platform      — Mobile app, AI compass, community
```

---

## Phase 1 — Foundation ✅ COMPLETE

_Sessions 1–14 · 2026-03-09 to 2026-03-10_

**What was built:**

- 20+ pages, fully dark-themed, brand-consistent (zero orange/amber violations)
- Full BeNetwork vocabulary in UI, API routes, and Prisma schema
- Compass routing engine with 4-dimension matching + language-aware proximity
- Country priority selector with Haversine proximity clustering (16 countries, 14 languages)
- Safari packages (Victoria, Tsavo, Mara)
- Anchor + Pioneer dashboards (5 tabs each)
- M-Pesa API client (sandbox ready)
- Centralized type system (types/domain.ts, types/api.ts, services/types.ts)
- Centralized mock data layer (data/mock/ — 14 modules, zero inline data in pages)
- 25 Jest tests + 89 Playwright visual tests passing
- Dev tooling: Prettier, ESLint, Husky pre-commit, .editorconfig
- Golden ratio design system (φ = 1.618 spacing + typography tokens)
- Responsive xs(380px) → 4K(2560px) with fluid typography
- Legacy route redirects (5 old URLs → modern equivalents)

**Done when:** TypeScript 0 errors ✅, all pages render ✅, CI green ✅, all tests pass ✅.

---

## Phase 2 — BeKenya Live 🔄 IN PROGRESS

_Target: 4 weeks after credentials_

### Sprint 2A — Infrastructure (BLOCKED)

**Dependencies:** Human must provide credentials first (see [HUMAN_MANUAL.md](./HUMAN_MANUAL.md))

| Task                             | Owner     | Status        |
| -------------------------------- | --------- | ------------- |
| Neon PostgreSQL → `DATABASE_URL` | 🧑 Human  | ⛔ Blocked    |
| `NEXTAUTH_SECRET`                | 🧑 Human  | ⛔ Blocked    |
| `GOOGLE_CLIENT_ID` + `SECRET`    | 🧑 Human  | ⛔ Blocked    |
| `RESEND_API_KEY`                 | 🧑 Human  | ⛔ Blocked    |
| `MPESA_CONSUMER_KEY` + `SECRET`  | 🧑 Human  | ⛔ Blocked    |
| `prisma migrate deploy`          | 🤖 Claude | Waiting on 2A |

### Sprint 2B — Dark Theme ✅ COMPLETE (Session 9)

All pages converted to dark theme. Zero light-bg pages remaining.

### Sprint 2C — Kenya Offerings Pages (Can do now)

| Feature                                              | Status       |
| ---------------------------------------------------- | ------------ |
| `/offerings/safaris` — Real package cards + book-now | ❌ Not built |
| `/offerings/eco-tourism` — Eco-lodge packages        | ❌ Not built |
| `/offerings/trade` — Trade corridor info             | ❌ Not built |

### Sprint 2D — End-to-End Booking (Needs 2A)

| Task                                       | Depends On |
| ------------------------------------------ | ---------- |
| Wire booking button → `/api/mpesa/stkpush` | 2A         |
| M-Pesa confirmation → update DB            | 2A         |
| Email receipt via Resend                   | 2A         |
| WhatsApp receipt via WA Business API       | 2A         |

### Sprint 2E — Visual Testing ✅ COMPLETE (Session 7)

- 15/15 smoke tests passing
- 26/26 brand tests passing
- 48/48 responsive tests passing

### Phase 2 Success Metrics

- [ ] 5 real Anchor accounts (not mock)
- [ ] 50 real Pioneer profiles
- [ ] 1 real safari booking via M-Pesa
- [x] 0 TypeScript errors
- [x] All pages dark-themed
- [x] CI green including visual tests

---

## Phase 3 — Traction 📈

_Month 2–3 post-launch_

### Features to Build

| Feature                                             | Value  | Effort |
| --------------------------------------------------- | ------ | ------ |
| Push notifications — Pioneer gets Path match alerts | High   | Medium |
| Pioneer ↔ Anchor direct message thread              | High   | High   |
| Review system — Pioneers rate Anchors/Ventures      | High   | Medium |
| Referral program — KES reward per Chapter           | Medium | Low    |
| Social sharing — auto-generate route cards          | Medium | Medium |
| Pioneer search + filter for Anchors                 | High   | Medium |
| UTAMADUNI live impact counter                       | Medium | Low    |

### Phase 3 Targets

| Metric                | Target       |
| --------------------- | ------------ |
| Pioneer profiles      | 500+         |
| Active Paths          | 50+          |
| Safari bookings/month | 20+          |
| UTAMADUNI/month       | KES 50,000+  |
| Anchor subscribers    | 5+           |
| MRR                   | KES 120,000+ |
| NPS                   | > 40         |

---

## Phase 4 — Expansion 🌍

_Month 4–6_

### BeGermany (First Expansion)

```bash
NEXT_PUBLIC_COUNTRY_CODE=DE
```

- New Vercel project: `begermany.com`
- SEPA payment rail (Stripe SEPA Debit)
- German sectors in `lib/countries.ts` (Tech, Manufacturing, Healthcare, Engineering)
- `/be/de` Gate in German language
- KE→DE Route corridor live in `lib/compass.ts` ✅ (already coded)

### BeNigeria (Parallel)

```bash
NEXT_PUBLIC_COUNTRY_CODE=NG
```

- Flutterwave NGN payment rail
- Lagos tech sector config
- Nollywood/Media creative sector
- NG→AE, NG→GB corridors

### Phase 4 Targets

| Metric                 | Target         |
| ---------------------- | -------------- |
| Active countries       | 3 (KE, DE, NG) |
| Cross-border Chapters  | 50+            |
| Total Pioneer profiles | 5,000+         |
| International Anchors  | 20+            |
| MRR                    | KES 500,000+   |

---

## Phase 5 — Platform 🚀

_Month 7–12_

| Feature                                     | Why                                         |
| ------------------------------------------- | ------------------------------------------- |
| React Native / Expo mobile app              | 60%+ of African internet is mobile          |
| AI Compass narrative (LLM + BeNetwork data) | Personalized route story in user's language |
| Live Anchor API (webhooks)                  | Safari lodge booking confirmation           |
| UTAMADUNI live dashboard                    | Public impact transparency                  |
| BeNetwork community (Pioneer ↔ Pioneer)     | Network effects, viral growth               |
| Verified Anchor badge + background check    | Trust and safety                            |
| Multi-language UI (EN/SW/DE/FR)             | Accessibility for all Pioneers              |
| PWA offline support                         | Low-connectivity Pioneers                   |

### Phase 5 Targets

| Metric                  | Target                            |
| ----------------------- | --------------------------------- |
| Active Pioneers         | 100,000+                          |
| Countries               | 10+                               |
| Monthly bookings        | 1,000+                            |
| UTAMADUNI annual impact | $100,000+                         |
| Team size               | 5+ (2 eng, 1 design, 1 BD, 1 ops) |
| ARR                     | $1M+                              |

---

## Dependency Map

```
Sprint 2A (credentials) ──→ Sprint 2D (booking) ──→ Phase 3 (traction)
         │                                                  │
         └──→ Sprint 2C (offerings) ──→ Phase 3            │
                                                           ↓
Sprint 2B (dark theme) ✅ ──→ Phase 2 complete ──→ Phase 4 expansion
Sprint 2E (visual tests) ✅ ──→ CI quality gate ──→ all phases
```

---

## Risk Register

| Risk                         | Likelihood | Impact   | Mitigation                                         |
| ---------------------------- | ---------- | -------- | -------------------------------------------------- |
| M-Pesa API approval delayed  | Medium     | High     | Build mock payments, launch with Stripe card first |
| No Anchor early adopters     | Medium     | High     | Direct outreach to 3 known safari operators        |
| Visa corridor data incorrect | Low        | Medium   | Compass shows "verify requirements" disclaimer     |
| DB performance at scale      | Low        | High     | Neon autoscales, add Redis cache in Phase 3        |
| Brand copied by competitors  | Low        | Low      | Mission + community are hard to copy               |
| Credentials never provided   | Medium     | Critical | Document self-service setup, simplify HUMAN_MANUAL |

---

_Last updated: Session 15 (2026-03-11)_
