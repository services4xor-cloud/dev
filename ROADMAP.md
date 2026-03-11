# Be[Country] — Strategic Roadmap

> ← [CLAUDE.md](./CLAUDE.md) | [PRD.md](./PRD.md) · [PROGRESS.md](./PROGRESS.md)

---

## Mission

Reverse colonial economic flows. Every Pioneer placed, every safari booked, every KES 50 to UTAMADUNI is structural change.

**5-year vision:** 1M Pioneers routed. 50 countries. $50M+ value to African communities.

**Scale path:** Be[Country] → Be[Tribe] → Be[Location]. Countries first, then identity layers.

---

## Phase Overview

```
Phase 1 ✅ Foundation    — Platform built, tested, vocabulary complete
Phase 2 ⛔ BeKenya Live  — Real data + payments (blocked on credentials)
Phase 3 📈 Traction      — 500 Pioneers, 50 Paths, 20 safaris/month
Phase 4 🌍 Expansion     — BeGermany + BeNigeria
Phase 5 🚀 Platform      — Mobile, AI, Be[Tribe], Be[Location]
```

---

## Phase 1 — Foundation ✅ COMPLETE

Sessions 1–19. 20+ pages, full vocabulary, type system, mock data, 127 tests passing, responsive xs→4K, WCAG AA, loading skeletons, error boundaries, mock booking flow.

---

## Phase 2 — BeKenya Live ⛔ BLOCKED

**Blocker:** Human must provide credentials ([HUMAN_MANUAL.md](./HUMAN_MANUAL.md))

| Sprint | Task                  | Status       |
| ------ | --------------------- | ------------ |
| 2A     | DB + Auth credentials | ⛔ Human     |
| 2B     | Prisma migrate + seed | Waiting on A |
| 2C     | Real auth flow        | Waiting on A |
| 2D     | Real booking + M-Pesa | Waiting on A |

**Success:** 5 real Anchors, 50 real Pioneers, 1 real M-Pesa booking.

---

## Phase 3 — Traction 📈

_Month 2–3 post-launch_

| Feature                           | Value  | Effort |
| --------------------------------- | ------ | ------ |
| Push notifications (Path matches) | High   | Medium |
| Pioneer ↔ Anchor messaging        | High   | High   |
| Review system                     | High   | Medium |
| Referral program                  | Medium | Low    |
| UTAMADUNI live impact counter     | Medium | Low    |

**Targets:** 500 Pioneers, 50 Paths, 20 bookings/month, KES 120K MRR.

---

## Phase 4 — Expansion 🌍

_Month 4–6_

| Country   | Payment     | Currency | Config                      |
| --------- | ----------- | -------- | --------------------------- |
| BeGermany | Stripe SEPA | EUR      | Tech, Manufacturing, Health |
| BeNigeria | Flutterwave | NGN      | Tech, Trade, Creative       |

Same codebase, different Vercel projects + `NEXT_PUBLIC_COUNTRY_CODE`.

**Targets:** 3 countries, 5000 Pioneers, 20 international Anchors, KES 500K MRR.

---

## Phase 5 — Platform 🚀

_Month 7–12_

| Feature                     | Why                             |
| --------------------------- | ------------------------------- |
| React Native / Expo         | 60%+ African internet is mobile |
| AI Compass (LLM)            | Personalized route narratives   |
| Be[Tribe] identity layer    | BeMaasai, BeKikuyu, BeLuo…      |
| Be[Location] layer          | BeNairobi, BeMombasa, BeLagos…  |
| Multi-language UI           | EN/SW/DE/FR                     |
| UTAMADUNI live dashboard    | Public impact transparency      |
| Community (Pioneer↔Pioneer) | Network effects                 |

**Targets:** 100K Pioneers, 10+ countries, $1M ARR.

---

## Risks

| Risk                       | Impact   | Mitigation                          |
| -------------------------- | -------- | ----------------------------------- |
| M-Pesa API delayed         | High     | Launch with Stripe card first       |
| No early Anchor adopters   | High     | Direct outreach to safari operators |
| Credentials never provided | Critical | Simplify HUMAN_MANUAL, self-service |
| DB at scale                | High     | Neon autoscales, add Redis Phase 3  |

---

_Last updated: Session 20 (2026-03-11)_
