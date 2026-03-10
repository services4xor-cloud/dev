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
Phase 1 ✅ Foundation    — Platform built, design system, tested
Phase 2 🔄 BeKenya Live  — Real data, real payments, real users
Phase 3 📈 Traction      — 500+ Pioneers, 50+ Paths, 20 safaris/month
Phase 4 🌍 Expansion     — BeGermany + BeNigeria, multi-country
Phase 5 🚀 Platform      — Mobile app, AI compass, community
```

---

## Phase 1 — Foundation ✅ COMPLETE
*Sessions 1–6 · 2026-03-10*

**What was built:**
- 28+ pages, fully dark-themed, brand-consistent
- Compass routing engine with 4-dimension matching
- Country priority selector with Haversine proximity clustering
- Safari packages (Victoria, Tsavo, Mara)
- Anchor + Pioneer dashboards
- M-Pesa API client (sandbox ready)
- 8 test files, TypeScript strict, CI/CD
- Golden ratio design system (φ = 1.618 spacing + typography)
- Responsive xs → 4K
- Legacy route redirects (5 old URLs → modern equivalents)
- Brand sweep: #FF6B35 eliminated from all 30+ files

**Done when:** TypeScript 0 errors ✅, all pages render, CI green.

---

## Phase 2 — BeKenya Live 🔄 IN PROGRESS
*Target: 4 weeks after credentials*

### Sprint 2A — Infrastructure (Week 1)
**Dependencies:** Human must provide credentials first (see `HUMAN_MANUAL.md`)

| Task | Owner | Status |
|------|-------|--------|
| Neon PostgreSQL → `DATABASE_URL` | 🧑 Human | ⛔ Blocked |
| `prisma migrate deploy` | 🤖 Claude | Waiting |
| `GOOGLE_CLIENT_ID` + `SECRET` | 🧑 Human | ⛔ Blocked |
| `RESEND_API_KEY` | 🧑 Human | ⛔ Blocked |
| `MPESA_CONSUMER_KEY` + `SECRET` | 🧑 Human | ⛔ Blocked |
| `NEXTAUTH_SECRET` | 🧑 Human | ⛔ Blocked |

### Sprint 2B — Dark Theme Remaining Pages (Can do now)
| Page | Status |
|------|--------|
| `app/login/page.tsx` | ⏳ Light theme legacy |
| `app/signup/page.tsx` | ⏳ Light theme legacy |
| `app/pricing/page.tsx` | ⏳ Light theme legacy |
| `app/business/page.tsx` | ⏳ Light theme legacy |
| `app/contact/page.tsx` | ⏳ Light theme legacy |
| `app/profile/page.tsx` | ⏳ Light theme legacy |
| `app/referral/page.tsx` | ⏳ Light theme legacy |

### Sprint 2C — Kenya Offerings Pages (Can do now)
| Feature | Status |
|---------|--------|
| `/offerings/safaris` — Real package cards + book-now | ❌ Not built |
| `/offerings/eco-tourism` — Eco-lodge packages | ❌ Not built |
| `/offerings/trade` — Trade corridor info | ❌ Not built |

### Sprint 2D — End-to-End Booking (Needs 2A)
| Task | Depends On |
|------|-----------|
| Wire booking button → `/api/mpesa/stkpush` | 2A |
| M-Pesa confirmation → update DB | 2A |
| Email receipt via Resend | 2A |
| WhatsApp receipt via WA Business API | 2A |

### Sprint 2E — Visual Testing (Can do now)
| Task | Status |
|------|--------|
| `@playwright/test` install | 🔧 In progress |
| Smoke tests (all pages render) | 🔧 In progress |
| Brand validation tests | 🔧 In progress |
| Responsive screenshot suite | 🔧 In progress |

### Phase 2 Success Metrics
- [ ] 5 real Anchor accounts (not mock)
- [ ] 50 real Pioneer profiles
- [ ] 1 real safari booking via M-Pesa
- [ ] 0 TypeScript errors
- [ ] All pages dark-themed
- [ ] CI green including visual tests

---

## Phase 3 — Traction 📈
*Month 2–3 post-launch*

### Features to Build
| Feature | Value | Effort |
|---------|-------|--------|
| Push notifications — Pioneer gets Path match alerts | High | Medium |
| Pioneer ↔ Anchor direct message thread | High | High |
| Review system — Pioneers rate Anchors/Ventures | High | Medium |
| Referral program — KES reward per Chapter | Medium | Low |
| Social sharing — auto-generate route cards | Medium | Medium |
| Pioneer search + filter for Anchors | High | Medium |
| UTAMADUNI live impact counter | Medium | Low |
| Pricing page dark rewrite | Low | Low |

### Phase 3 Targets
| Metric | Target |
|--------|--------|
| Pioneer profiles | 500+ |
| Active Paths | 50+ |
| Safari bookings/month | 20+ |
| UTAMADUNI/month | KES 50,000+ |
| Anchor subscribers | 5+ |
| MRR | KES 120,000+ |
| NPS | > 40 |

---

## Phase 4 — Expansion 🌍
*Month 4–6*

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
| Metric | Target |
|--------|--------|
| Active countries | 3 (KE, DE, NG) |
| Cross-border Chapters | 50+ |
| Total Pioneer profiles | 5,000+ |
| International Anchors | 20+ |
| MRR | KES 500,000+ |

---

## Phase 5 — Platform 🚀
*Month 7–12*

| Feature | Why |
|---------|-----|
| React Native / Expo mobile app | 60%+ of African internet is mobile |
| AI Compass narrative (LLM + BeNetwork data) | Personalized route story in user's language |
| Live Anchor API (webhooks) | Safari lodge booking confirmation |
| UTAMADUNI live dashboard | Public impact transparency |
| BeNetwork community (Pioneer ↔ Pioneer) | Network effects, viral growth |
| Verified Anchor badge + background check | Trust and safety |
| Multi-language UI (EN/SW/DE/FR) | Accessibility for all Pioneers |
| PWA offline support | Low-connectivity Pioneers |

### Phase 5 Targets
| Metric | Target |
|--------|--------|
| Active Pioneers | 100,000+ |
| Countries | 10+ |
| Monthly bookings | 1,000+ |
| UTAMADUNI annual impact | $100,000+ |
| Team size | 5+ (2 eng, 1 design, 1 BD, 1 ops) |
| ARR | $1M+ |

---

## Technology Evolution Path

```
Now          → Phase 2    → Phase 3    → Phase 4    → Phase 5
─────────────────────────────────────────────────────────────
Next.js 14   → Next.js 15 → Keep       → Keep       → Keep
Tailwind CSS → Keep       → Keep       → Keep       → Keep
Prisma/Neon  → Add Redis  → Add Queue  → Multi-DB   → Multi-DB
NextAuth v4  → Keep       → Keep       → v5 upgrade → Keep
M-Pesa       → Live       → Keep       → Multi-rail  → API
Stripe       → Sandbox    → Live       → SEPA live  → FX engine
Jest only    → +Playwright→ +Load test → Keep       → Keep
Vercel 1     → Vercel 1   → Vercel 3   → Vercel N   → CDN+K8s
```

---

## Dependency Map

```
Sprint 2A (credentials) ──→ Sprint 2D (booking) ──→ Phase 3 (traction)
         │                                                  │
         └──→ Sprint 2C (offerings) ──→ Phase 3            │
                                                           ↓
Sprint 2B (dark theme) ──→ Phase 2 complete ──→ Phase 4 expansion
         │
Sprint 2E (visual tests) ──→ CI quality gate ──→ all phases
```

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| M-Pesa API approval delayed | Medium | High | Build mock payments, launch with Stripe card first |
| No Anchor early adopters | Medium | High | Direct outreach to 3 known safari operators |
| Visa corridor data incorrect | Low | Medium | Compass shows "verify requirements" disclaimer |
| DB performance at scale | Low | High | Neon autoscales, add Redis cache in Phase 3 |
| Brand copied by competitors | Low | Low | Mission + community are hard to copy |

---

*Last updated: Session 6 (2026-03-10)*
