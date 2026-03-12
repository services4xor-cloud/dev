---
name: becountry-business-review
description: Review BeKenya revenue model, pricing, conversion flows, and business metrics readiness.
---

# BeKenya Business Review

## When to Use

Run to audit revenue readiness, pricing strategy, and business model implementation.

## Review Process

### 1. Revenue Model Audit

Check implementation of all revenue streams:

- **Anchor subscriptions** ($29-99/mo) — Check `app/pricing/page.tsx` for tier display
- **Agent commission** (10% on placements) — Check `prisma/schema.prisma` for `AgentProfile.commissionRate`
- **Experience bookings** — Check `app/experiences/` for booking flow
- **Path posting fees** — Check tier system in schema (`PathTier`: BASIC, FEATURED, PREMIUM)

### 2. Conversion Flow Analysis

Trace each user journey and identify friction:

- **Pioneer signup → Discovery → Exchange → Connect → Chapter** — Is each step implemented?
- **Anchor signup → Post Path → Review Chapters → Place Pioneer** — Is each step implemented?
- **Visitor → Pricing → Signup** — Does pricing CTA lead to signup?
- **Experience browse → Detail → Book → Pay** — Is M-Pesa/Stripe wired?

### 3. Payment Readiness

- Check `.env.local` for payment credentials (MPESA_CONSUMER_KEY, STRIPE_SECRET_KEY)
- Check `app/api/` for payment routes
- Check schema for Payment model completeness

### 4. Metrics Readiness

- Are key events trackable? (signup, chapter_opened, path_posted, payment_completed)
- Is PostHog or analytics wired?
- Can we measure: DAU, conversion rate, ARPU, churn?

### 5. Competitive Positioning

Review against PRD.md for:

- Unique value props implemented (identity-first, 8-dimension scoring, complementary matching)
- Differentiators visible to users (not just backend)

## Output Format

```
## 💼 Business Review

### Revenue Streams
| Stream | Implemented | Status | Blocker |
|--------|-------------|--------|---------|

### Conversion Funnels
| Funnel | Steps Working | Drop-off Risk |
|--------|---------------|---------------|

### Payment Status
| Provider | Configured | Test Mode | Production |
|----------|------------|-----------|------------|

### Business Score: X/10
### Top 3 Revenue Blockers:
1. [with fix]
```
