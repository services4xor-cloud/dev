# ASK.md — Agent Questions for Owner

> Questions the agent needs answered. Owner reviews async. Don't interrupt sessions.
> Updated: Session 34 (2026-03-11)
> **Status: ALL QUESTIONS RESOLVED** — Owner delegated all decisions to agent (Session 34).

---

## Pluggability Audit — Status (Session 28)

| System                                | Pluggable? | How                                                                                       | What's Needed                                  |
| ------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------- |
| **Payments**                          | ✅ Yes     | `lib/payments.ts` — `getPaymentPlug('KE')` → M-Pesa, `getPaymentPlug('DE')` → SEPA/Stripe | Add new plug per country (PayPal for CH, etc.) |
| **Country content**                   | ✅ Yes     | `lib/countries.ts` — `CountryConfig` per country with sectors, payments, stats, hero      | Add config entry per country                   |
| **Experiences**                       | ✅ Yes     | `data/mock/offerings.ts` — per-country experiences with registry pattern                  | ✅ Done — KE, DE, CH, TH all have offerings    |
| **Identity threads**                  | ✅ Yes     | `data/mock/threads.ts` — data-driven, zero code changes to add                            | Add entries per country                        |
| **Vocabulary**                        | ✅ Yes     | `lib/vocabulary.ts` — language-agnostic terms                                             | ✅ i18n layer exists in `lib/i18n.ts`          |
| **Nav/Footer**                        | ✅ Yes     | `lib/nav-structure.ts` — reads country from env                                           | Works per deployment                           |
| **Matching engine**                   | ✅ Yes     | `lib/matching.ts` — country-agnostic scoring                                              | Works globally                                 |
| **Mock paths**                        | ✅ Yes     | `data/mock/paths.ts` — KE, DE, CH, TH all have paths                                      | ✅ Done — 4 countries covered                  |
| **Currency formatting**               | ✅ Yes     | `PaymentPlug.formatAmount()` per country                                                  | Works via plug system                          |
| **Logo/Identity switch**              | ✅ Yes     | Dynamic SVG logo generated per identity                                                   | ✅ Implementing Session 34                     |
| **Offerings/Experiences per country** | ✅ Yes     | `data/mock/offerings.ts` — modular per-country experiences                                | ✅ Done — KE, DE, CH, TH                       |

---

## Resolved Decisions (Session 34)

### D1 — Identity Hierarchy: Top-Level Tribes ✅

**Decision:** Tribes are **top-level**, not nested under countries.

**URL structure:**

- `/be/ke` → BeKenya (country)
- `/be/maasai` → BeMaasai (tribe — spans KE + TZ)
- `/be/nairobi` → BeNairobi (location — within KE)
- `/be/thai` → BeThai (language community)

**Rationale:** Owner's #1 principle is "language + culture first, distance second." A Maasai in Tanzania and a Maasai in Kenya are culturally closer than two different tribes in the same city. Nesting under countries would subordinate culture to geography — the opposite of our mission.

**Implementation:** Thread `slug` is the URL key. Thread `type` determines level (COUNTRY, TRIBE, LOCATION, LANGUAGE). Thread `countries[]` maps which countries a tribe spans. Route: `/be/[slug]` → single dynamic route handles all levels.

**Word choice:** "Community" (not "tribe") in user-facing text — more inclusive, avoids colonial connotations. Internal data model uses `ThreadType.TRIBE` for specificity.

---

### D2 — Logo: Dynamic SVG Template ✅

**Decision:** Dynamic template-generated logos per identity.

**Format:** `Be` + identity name in brand font, with identity icon/emoji.

- BeKenya 🇰🇪 | BeMaasai 🦁 | BeNairobi 🏙️ | BeGermany 🇩🇪
- Color: Always brand-primary (#5C0A14) text + brand-accent (#C9A227) accent
- Logo changes based on active identity in IdentitySwitcher

**Rationale:** Manual design doesn't scale to hundreds of identities. Template ensures brand consistency while allowing unlimited expansion. SVG keeps it crisp at all sizes.

---

### D3 — Mock Data: Tribes + Locations NOW ✅

**Decision:** Create tribe + location mock data for Kenya immediately. Other countries follow.

**Kenya tribes (Phase 1):** Maasai, Kikuyu, Luo, Kalenjin, Luhya, Kamba
**Kenya locations:** Nairobi, Mombasa, Nakuru, Kisumu
**Germany communities:** Berlin, Munich, Hamburg
**Switzerland:** Zurich, Geneva, Basel

**Rationale:** Tribes are the differentiator. Without tribe data, the platform looks like any other job board. With tribes, it's identity-first — unique in the market.

---

### D4 — Automation: Hybrid AI + Human Agents ✅

**Decision:** "Agent" means BOTH:

1. **Human Agents** (real people who forward paths via WhatsApp) — already built
2. **AI Agents** (automated workflows that handle digital operations)

**Automation priority:**

1. **Professional paths** first (highest revenue potential)
2. **Safari/experiences** second (highest engagement)
3. **Media/fashion** third (brand building)

**"Facilitate everything" means:**

- Auto-generate social media posts when Anchor creates a Path
- Auto-send booking confirmations via email (Resend)
- Auto-notify matching Agents via WhatsApp when new demand appears
- Auto-schedule content calendar for the week
- Human reviews/approves before publish (OpenClaw chat interface)

**Anchor intake form fields:**

- Company name, logo, description
- Path details (title, skills, salary range, location)
- Contact person + approval method (WhatsApp/email)
- Content preferences (tone, language, platforms)

---

### D5 — Agentic Infrastructure ✅

**Decision:**

1. **n8n: Self-hosted** on a $5/mo VPS (Hetzner/Railway) — zero ongoing platform costs, full control
2. **Platforms first:** WhatsApp Business API + Instagram + TikTok (highest reach in target markets: KE, DE, TH)
3. **Budget:** Start with Claude API (Anthropic) for content generation — ~$10/mo at launch volume. Scale to $50/mo as volume grows.
4. **Watermark:** Existing maroon/gold branding. Logo + "Be[Country]" text overlay, bottom-right corner, 20% opacity.

**Architecture confirmed:**

```
Anchor creates Path → webhook to n8n → Claude generates platform copy →
Apply watermark → OpenClaw sends preview to Anchor WhatsApp →
Anchor approves → n8n posts to Instagram/TikTok/Facebook →
Paperclip logs cost per post
```

---

### D6 — Payment Model ✅

**Decision:** Freemium with anchor-pays model.

- **Pioneers:** FREE to browse, apply, and get matched
- **Anchors:** Free for 1 Basic path. Paid tiers for Featured ($29/mo) and Premium ($99/mo)
- **Agents:** 10% commission on successful placements (paid by Anchor as part of placement fee)
- **Experiences:** Booking fee (10% platform commission on experience price)

**Payment providers:**

- KE: M-Pesa (primary) + Stripe (backup for international cards)
- DE/CH: Stripe SEPA (primary) + PayPal (backup)
- TH: Stripe (primary) + PromptPay (future)

**Rationale:** Pioneer-free removes all friction for the supply side. Anchor-pays aligns with B2B SaaS model. Agent commission incentivizes quality matches.

---

### D7 — i18n Priority ✅

**Decision:** 4 languages in order:

1. **English** (global default, already done)
2. **Swahili** (KE — differentiator, shows cultural authenticity)
3. **German** (DE/CH — required for those markets)
4. **Thai** (TH — future)

**Method:** Machine translation (DeepL API) for initial pass, then human review for key pages (homepage, onboarding, pricing). i18n framework already exists in `lib/i18n.ts`.

---

### D8 — Real Anchors for Launch ✅

**Decision:** Use **realistic but fictional** anchor companies for launch demo. Named to sound real but avoid trademark issues.

**KE:** SafariTech Solutions, Nairobi General Hospital, Mombasa Logistics Hub
**DE:** Berlin Digital GmbH, Munich MedTech AG, Hamburg Port Services
**CH:** Zurich FinTech AG, Geneva Pharma SA, Basel Innovation Lab

**Rationale:** Real company names (Safaricom, SAP) create legal risk. Realistic fictional names demonstrate the platform credibly without trademark issues. Replace with real partners as they onboard.

---

### D9 — Charity / UTAMADUNI CBO ✅

**Decision:** UTAMADUNI is the platform's social impact arm — treat as real.

- Per-country impact partners: UTAMADUNI (KE), Brücken Schweiz (CH), Integration durch Arbeit (DE)
- Donation model: Fixed micro-donation per transaction (KES 50 / EUR 2 / CHF 2)
- Impact data: Use realistic projected numbers until actual data is available

---

### D10 — Hosting & Infrastructure ✅

**Decision:**

- **Neon DB:** Stay on free tier until 100+ active users, then scale ($19/mo Pro)
- **Vercel:** Stay — great DX, auto-deploy, edge functions. One project per country deployment.
- **Domains:** `bekenya.com` (primary), subdomains for others: `de.benetwork.com`, `ch.benetwork.com` (acquire `benetwork.com`)
- **Analytics:** PostHog (self-hosted free tier) for product analytics. No Google Analytics.

---

---

## New Feature Designs (Session 57 — 2026-03-12)

### F1 — Custom Tags System (CEO input)

**Context:** CEO says tags are too limited — users should create their own tags for interests, craft, reach, faith. Tags become searchable and grow organically.

**Proposed Design:**

- Tags are free-text strings stored as `string[]` on identity
- When a user types a new tag, it's added to a global tag registry (DB table)
- Autocomplete suggests existing tags as you type
- Popular tags surface first; rare tags still work
- No predefined lists — FAITH_OPTIONS, CRAFT arrays become seed data only
- Tags shared across dimensions: craft tags, interest tags, faith tags, reach tags

**Status:** Awaiting confirmation. Will implement once DB is connected.

### F2 — Topic Focus Mode (CEO input)

**Context:** CEO wants to switch focus within the app to a topic and see all feeds filtered by it. Like a "lens" — click "Engineering" and Exchange, Messages, World all filter to engineering-related content.

**Proposed Design:**

- Add `focusTopic?: string` to identity context
- Nav gets a "Focus" dropdown showing user's tags + popular topics
- When focus is set, all feeds filter: Exchange shows only matching paths, Messages shows relevant threads, World graph highlights matching nodes
- Clear focus → back to full feeds
- Works with both human and agent (bot) content

**Status:** Awaiting confirmation. Architectural work (identity context change) can start now.

### F3 — MVC Enforcement (CEO input)

**Context:** CEO wants strict Model-View-Controller separation. Views should MAXIMALLY leverage Model data (score, rank, filter, personalize — not just display). Controller layer should support 200+ parallel agents working on the codebase.

**Status:** ✅ Skill `bex-mvc-enrichment` created. Enforced via skill on every page build.

_(All questions resolved. New questions go below this line.)_
