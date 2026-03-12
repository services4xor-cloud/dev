# Be[Country] — Strategic Roadmap

> ← [CLAUDE.md](./CLAUDE.md) | [PRD.md](./PRD.md) · [PROGRESS.md](./PROGRESS.md)
> Updated: Session 29 (2026-03-11)

---

## Mission

Identity-first life-routing for everyone. Every Pioneer placed, every experience booked, every connection made is structural change.

**5-year vision:** 1M Pioneers routed. 50 countries. $50M+ value to African communities.

**Scale path:** Be[Country] → Be[Tribe] → Be[Location] → Be[Interest]. Countries first, then identity layers. Think Reddit threads but for life-routing — each thread is an identity group.

---

## Phase Overview

```
Phase 1   ✅ Foundation     — Platform built, tested, vocabulary complete
Phase 1.5 🔧 Polish & Scale — Agent-executable quality + architecture work
Phase 2   ⛔ BeKenya Live   — Real data + payments (blocked on credentials)
Phase 3   📈 Traction       — 500 Pioneers, 50 Paths, 20 safaris/month
Phase 4   🌍 Expansion      — BeGermany + BeNigeria
Phase 5   🚀 Platform       — Mobile, AI, Be[Tribe], Be[Location], Be[Interest]
```

---

## Phase 1 — Foundation ✅ COMPLETE

Sessions 1–23. 20+ pages, world-class nav, full vocabulary, type system, mock data, 127 tests, responsive xs→4K, WCAG AA, loading skeletons, error boundaries, mock booking flow, hero gradients, brand consistency.

---

## Phase 1.5 — Polish & Scale-Ready 🔧 ACTIVE

**No credentials needed.** These are concrete, agent-executable tasks organized by sprint.

### Sprint 1.5A — Testing Coverage (Priority: HIGH)

Goal: Move from 25 Jest tests to 50+, add E2E for all wizards.

| Task | Description                                       | Files                          | Agent-Ready |
| ---- | ------------------------------------------------- | ------------------------------ | ----------- |
| T-01 | Unit tests for `lib/matching.ts` (4-dim scoring)  | `__tests__/matching.test.ts`   | ✅          |
| T-02 | Unit tests for `lib/compass.ts` (route corridors) | `__tests__/compass.test.ts`    | ✅          |
| T-03 | Unit tests for `lib/offerings.ts` (country-aware) | `__tests__/offerings.test.ts`  | ✅          |
| T-04 | Unit tests for `lib/vocabulary.ts` (term mapping) | `__tests__/vocab.test.ts`      | ✅          |
| T-05 | Unit tests for `lib/nav-structure.ts` (link gen)  | `__tests__/nav.test.ts`        | ✅          |
| T-06 | Component tests: PathCard, Skeleton               | `__tests__/components/`        | ✅          |
| T-07 | API route tests: /api/paths, /api/compass         | `__tests__/api/`               | ✅          |
| T-08 | E2E: Compass wizard complete flow                 | `tests/e2e/compass.spec.ts`    | ✅          |
| T-09 | E2E: Onboarding wizard complete flow              | `tests/e2e/onboarding.spec.ts` | ✅          |
| T-10 | E2E: Post-Path wizard complete flow               | `tests/e2e/post-path.spec.ts`  | ✅          |

**Success:** 50+ Jest, 120+ Playwright, 0 failures.

### Sprint 1.5B — Code Quality (Priority: HIGH)

Goal: Extract shared patterns, eliminate duplication, add documentation.

| Task | Description                                              | Files                          | Agent-Ready |
| ---- | -------------------------------------------------------- | ------------------------------ | ----------- |
| C-01 | Extract `<HeroSection>` shared component                 | `components/HeroSection.tsx`   | ✅          |
| C-02 | Extract `<WizardShell>` shared component                 | `components/WizardShell.tsx`   | ✅          |
| C-03 | Extract shared form components (Input, Select, Textarea) | `components/ui/`               | ✅          |
| C-04 | Extract `<DashboardTabs>` shared component               | `components/DashboardTabs.tsx` | ✅          |
| C-05 | Centralize form validation utilities                     | `lib/validation.ts`            | ✅          |
| C-06 | Add JSDoc to all lib/ exports                            | `lib/*.ts`                     | ✅          |
| C-07 | Remove all inline hex colors (use tokens)                | Multiple pages                 | ✅          |

**Success:** Zero duplication in wizard/hero/form patterns. All lib/ functions documented.

### Sprint 1.5C — Innovation & UX (Priority: MEDIUM)

Goal: World-class UX that sells, builds trust, creates fans.

| Task | Description                                                | Files                                  | Agent-Ready |
| ---- | ---------------------------------------------------------- | -------------------------------------- | ----------- |
| I-01 | Footer redesign (match nav world-class quality)            | `components/Footer.tsx`                | ✅          |
| I-02 | Homepage "Pioneer Stories" section (trust + social proof)  | `app/page.tsx`, `data/mock/stories.ts` | ✅          |
| I-03 | Country Gate page redesign (immersive, identity-first)     | `app/be/[country]/page.tsx`            | ✅          |
| I-04 | Micro-animations on Compass wizard steps                   | `app/compass/page.tsx`                 | ✅          |
| I-05 | "Impact Counter" on homepage (UTAMADUNI live stats)        | `app/page.tsx`, `data/mock/impact.ts`  | ✅          |
| I-06 | Trust badges section (security, privacy, verified Anchors) | `components/TrustBadges.tsx`           | ✅          |
| I-07 | Loading states with branded skeleton animations            | `components/Skeleton.tsx`              | ✅          |

**Success:** Every page tells a story. Psychology: Discover → Trust → Engage → Belong → Advocate.

### Sprint 1.5D — Scalability Prep (Priority: MEDIUM)

Goal: Architecture ready for multi-country, multi-identity deployment.

| Task | Description                                                 | Files                                    | Agent-Ready |
| ---- | ----------------------------------------------------------- | ---------------------------------------- | ----------- |
| S-01 | Service layer abstraction (mock → real swap)                | `services/*.ts`                          | ✅          |
| S-02 | API client with error handling + retry                      | `lib/api-client.ts`                      | ✅          |
| S-03 | Generic Gate page (`/be/[slug]`) for Country/Tribe/Location | `app/be/[slug]/page.tsx`                 | ✅          |
| S-04 | Thread/identity data model + mock data                      | `lib/threads.ts`, `data/mock/threads.ts` | ✅          |
| S-05 | SEO: metadata + OpenGraph on all pages                      | `app/*/page.tsx`                         | ✅          |
| S-06 | PWA manifest + service worker                               | `public/manifest.json`                   | ✅          |
| S-07 | i18n infrastructure (EN/SW/DE/FR)                           | `lib/i18n.ts`, `messages/`               | ✅          |

**Success:** Deploy BeGermany with only env var change. Identity threads architecture ready.

---

## Phase 2 — BeKenya Live 🔧 UNBLOCKED

**Database + Auth:** ✅ Neon DB connected, schema pushed, NEXTAUTH_SECRET set.
**Remaining:** Google OAuth, Resend, M-Pesa sandbox, Stripe test keys.

| Sprint | Task                  | Status                    |
| ------ | --------------------- | ------------------------- |
| 2A     | DB + Auth credentials | ✅ DB live, NEXTAUTH set  |
| 2B     | Prisma seed data      | Ready to go               |
| 2C     | Real auth flow        | Waiting on Google OAuth   |
| 2D     | Real booking + M-Pesa | Waiting on M-Pesa sandbox |

**Session 28-29 Progress (Phase 1.5):**

- ✅ S-04: Thread/identity data model + 22 mock threads (countries/tribes/languages/interests/sciences/locations)
- ✅ Venture detail page (`/ventures/[id]`) — core conversion page
- ✅ Identity flags system (localStorage bridge for Pioneer identity)
- ✅ Onboarding → Ventures personalized flow
- ✅ PaymentPlug abstraction (M-Pesa, Stripe, SEPA, Flutterwave)
- ✅ Logo identity switcher dropdown (Countries/Languages/Tribes/Interests/Sciences/Locations)
- ✅ BeKenya content expansion (agriculture, marine, engineering — 16 paths, 22 threads)
- ✅ Pluggability audit completed

**Success:** 5 real Anchors, 50 real Pioneers, 1 real M-Pesa booking.

---

## Phase 3 — Traction 📈

_Month 2–3 post-launch_

| Feature                           | Value  | Effort |
| --------------------------------- | ------ | ------ |
| Push notifications (Path matches) | High   | Medium |
| Pioneer ↔ Anchor messaging        | High   | High   |
| Review system                     | High   | Medium |
| Referral program (live)           | Medium | Low    |
| UTAMADUNI live impact counter     | Medium | Low    |
| Community threads (like Reddit)   | High   | High   |
| **Anchor social auto-posting**    | High   | Medium |
| **n8n workflow automation**       | High   | Medium |

**Anchor Auto-Posting (leveraging open-source):**

- **n8n** (self-hosted) — workflow engine for content generation → watermarking → multi-platform posting
- **OpenClaw** — chat-based review. Anchor approves/edits posts via WhatsApp or Telegram before publishing
- **Paperclip** — agent orchestration layer. Manages posting agents with budget caps, audit logs, approval gates
- Platforms: WhatsApp Business, TikTok, Instagram, Facebook, LinkedIn
- Templates with BeNetwork watermark, automatic content cutting from Path/Venture data

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

| Feature                    | Why                               | Status     |
| -------------------------- | --------------------------------- | ---------- |
| React Native / Expo        | 60%+ African internet is mobile   | Phase 5    |
| AI Compass (LLM)           | Personalized route narratives     | Phase 5    |
| Be[Tribe] identity threads | BeMaasai, BeKikuyu, BeLuo…        | ✅ Built   |
| Be[Location] threads       | BeNairobi, BeMombasa, BeLagos…    | ✅ Built   |
| Be[Interest] threads       | BeTech, BeEcoTourism, BeMedical…  | ✅ Built   |
| Be[Language] threads       | BeSwahili, BeDeutsch, BeFrançais… | ✅ Built   |
| Be[Religion] threads       | Respectful community spaces       | Data-ready |
| Multi-language UI          | EN/SW/DE/FR                       | Phase 5    |
| UTAMADUNI live dashboard   | Public impact transparency        | Phase 5    |
| Logo identity switcher     | Nav dropdown for all threads      | ✅ Built   |

**Thread Architecture:** Every identity group (country/tribe/location/interest/language/religion) is a "thread" — same component, same data model, different content. Generic by design. Like subreddits but for life-routing.

**Targets:** 100K Pioneers, 10+ countries, $1M ARR.

---

## Risks

| Risk                       | Impact   | Mitigation                          |
| -------------------------- | -------- | ----------------------------------- |
| M-Pesa API delayed         | High     | Launch with Stripe card first       |
| No early Anchor adopters   | High     | Direct outreach to safari operators |
| Credentials never provided | Critical | Simplify HUMAN_MANUAL, self-service |
| DB at scale                | High     | Neon autoscales, add Redis Phase 3  |
| Identity thread complexity | Medium   | Generic architecture from day one   |

---

## Agent Instructions

**How to pick up work from this roadmap:**

1. Find a task marked ✅ Agent-Ready in Phase 1.5
2. Read the referenced files first
3. Follow CLAUDE.md build rules + DESIGN_SYSTEM.md
4. Write tests (T-\* tasks come first)
5. Update PROGRESS.md when done
6. Commit + push

**Parallelizable:** Sprints 1.5A–D can run concurrently. Within each sprint, tasks are independent unless noted.

---

_Last updated: Session 29 (2026-03-11)_
