# ASK.md — Agent Questions for Owner

> Questions the agent needs answered. Owner reviews async. Don't interrupt sessions.
> Updated: Session 28 (2026-03-11)

---

## Pluggability Audit — Status (Session 28)

| System                                | Pluggable? | How                                                                                       | What's Needed                                                     |
| ------------------------------------- | ---------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Payments**                          | ✅ Yes     | `lib/payments.ts` — `getPaymentPlug('KE')` → M-Pesa, `getPaymentPlug('DE')` → SEPA/Stripe | Add new plug per country (PayPal for CH, etc.)                    |
| **Country content**                   | ✅ Yes     | `lib/countries.ts` — `CountryConfig` per country with sectors, payments, stats, hero      | Add config entry per country                                      |
| **Experiences**                       | ⚠️ Partial | `lib/safari-packages.ts` — hardcoded to Kenya packages                                    | Need per-country experience modules (skiing for CH, etc.)         |
| **Identity threads**                  | ✅ Yes     | `data/mock/threads.ts` — data-driven, zero code changes to add                            | Add entries per country                                           |
| **Vocabulary**                        | ✅ Yes     | `lib/vocabulary.ts` — language-agnostic terms                                             | Needs i18n layer for Swahili/German/etc. translations             |
| **Nav/Footer**                        | ✅ Yes     | `lib/nav-structure.ts` — reads country from env                                           | Works per deployment                                              |
| **Matching engine**                   | ✅ Yes     | `lib/matching.ts` — country-agnostic scoring                                              | Works globally                                                    |
| **Mock paths**                        | ⚠️ Partial | `data/mock/paths.ts` — mixed Kenya + international                                        | Need per-country path modules                                     |
| **Currency formatting**               | ✅ Yes     | `PaymentPlug.formatAmount()` per country                                                  | Works via plug system                                             |
| **Logo/Identity switch**              | ❌ Missing | Logo is static                                                                            | Need logo dropdown with country/thread switcher (new requirement) |
| **Offerings/Experiences per country** | ⚠️ Partial | `lib/offerings.ts` exists but safari data is Kenya-only                                   | Need modular experience loading per country                       |

### To make fully pluggable:

1. **Experience modules**: Refactor `lib/safari-packages.ts` → `lib/experiences/kenya.ts`, `lib/experiences/switzerland.ts` etc. with a registry
2. **Path modules**: Split `data/mock/paths.ts` → per-country files with a loader
3. **i18n layer**: Add translation keys so UI text can be Swahili/English/German per deployment
4. **Logo dropdown**: Nav logo becomes thread/country switcher (new requirement from owner)

---

## Open Questions

### Q1 — Identity Hierarchy: URL Structure

Owner clarified: **Language + Culture = primary**, Distance = secondary.

**Current:** `/be/ke` → BeKenya (country level only)

**Possible URL structures for tribes/locations:**

- `/be/ke/maasai` → BeMaasai (tribe within Kenya)
- `/be/ke/nairobi` → BeNairobi (location within Kenya)
- `/be/maasai` → BeMaasai (tribe as top-level, cross-country — Maasai span KE+TZ)

**What I need to know:**

1. Should tribes be nested under countries (`/be/ke/maasai`) or top-level (`/be/maasai`)?
2. What's the word preference: "tribe", "community", "culture", "people"?
3. Does each tribe/location get its own Gate page with unique content?

---

### Q2 — Logo Variants

You mentioned "adapt the logo." Questions:

1. Does each Be[X] get a unique logo variant?
2. Dynamic (template-generated) or manually designed?
3. Should frontpage logo change based on detected identity?

---

### Q3 — Mock Data Scope

"Ensure all data visible that is not generic is placed in mock."

1. Should tribe-level mock data be created now? (Maasai, Kikuyu, Luo, etc.)
2. Location-level? (Nairobi, Mombasa, Nakuru)
3. Any specific content on current pages that needs to move to mock?

---

### Q4 — Automation Agent System for Offerings (Session 21)

**Owner said:** "For each offering I need automation to not rely on partner for digital part. They will have a form to input data that's ideal for the agent system to pick up and facilitate everything."

**Interpretation:**

- Each offering/venture gets an **Anchor intake form** (structured data)
- Agent system picks up form data and automates the digital workflow (posting, distribution, scheduling)
- Reduces dependency on partner organizations for digital execution
- Form fields should be designed for machine-readable structured data

**Questions:**

1. Is "agent" an AI agent (LLM-powered) or a human operations agent?
2. Which offerings get automation first? (Safari, Media, Fashion, Professional?)
3. What does "facilitate everything" include? (Social media posting, booking confirmation, email sequences, content scheduling?)

**Status:** Added to main feature roadmap — implement after current UI steps.

---

### Q5 — Agentic Infrastructure: Paperclip + OpenClaw + n8n (Session 33)

**Owner said:** "Leverage open source Paperclip, OpenClaw.ai and n8n for the agentic features planned."

**Research findings:**

| Tool          | What It Is                                                                                                            | Stars | How We Use It                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------------- | ----- | ------------------------------------------------------------------------------------------------- |
| **Paperclip** | MIT-licensed agent orchestration — org charts, budgets, approval gates for AI agents                                  | 14.6k | Orchestrate our social posting agents, content moderation, Anchor automation                      |
| **OpenClaw**  | Open-source personal AI assistant (302k stars). Runs locally, integrates 50+ services via WhatsApp/Telegram/Slack     | 302k  | Chat-based content review for Anchors. WhatsApp/Telegram bot for reviewing + approving auto-posts |
| **n8n**       | Open-source workflow automation. 490+ social media templates. Multi-platform posting (TikTok, Insta, FB, LinkedIn, X) | 60k+  | Anchor auto-posting pipeline: template → watermark → cut → review → post                          |

**Proposed architecture for Anchor social auto-posting:**

```
Anchor creates Path/Venture
    ↓
n8n workflow triggers
    ↓
AI generates platform-specific content (GPT/Claude)
    ↓
Apply BeNetwork watermark + brand templates
    ↓
OpenClaw sends preview to Anchor via WhatsApp/Telegram
    ↓
Anchor approves/edits in chat
    ↓
n8n posts to TikTok, Instagram, Facebook, LinkedIn
    ↓
Paperclip tracks costs, manages agent budgets
```

**Questions for owner:**

1. Self-host n8n or use n8n Cloud?
2. Which platforms first? (WhatsApp Business + Instagram + TikTok seems highest impact)
3. Budget for API costs (OpenAI/Claude for content generation, platform APIs)?
4. Watermark design — use existing logo + gold accent?

---

## Answered / Recorded

### A1 — Grouping Priority (Session 20)

**Owner said:** "The most important is Language and culture. Based on that we want to bring people together but also lever potentials. Distance is also a factor."

**Recorded as:** Language + Culture = primary grouping. Distance = secondary. Purpose: connect people AND lever potentials.

**Impact on architecture:**

- Matching engine should weight cultural/language affinity higher than geographic distance
- Country is a deployment unit, but identity (tribe/culture/language) is the connection layer
- A Maasai in Tanzania and a Maasai in Kenya are culturally "closer" than two different tribes in same city
- This is the core differentiator: identity-first routing, not geography-first

---

_(Move questions to Answered once resolved)_
