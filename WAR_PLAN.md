# 🌍 Bekenya.com — War Plan: World's Best International Job Platform

> **Mission:** Make Bekenya.com the #1 destination for international job seekers and employers — starting with Kenya (M-Pesa) and expanding to the world's biggest economies. Fast, fun, mobile-first, money-making.

---

## 🎯 Vision

A global job marketplace that:
- Works seamlessly on any phone (mobile-first)
- Pays and gets paid via **M-Pesa, Stripe, Flutterwave, PayPal, UPI** and more
- Connects Kenyan talent with global employers — and vice versa
- Makes the job hunt **fun** (gamified progress, instant notifications, swipe UX)
- Earns revenue for the platform AND for job seekers

---

## 🗺️ Phase Roadmap

### Phase 1 — Foundation (Weeks 1–4)
**Goal:** Functional MVP on Vercel, mobile-ready, M-Pesa live

- [ ] Next.js 14 App Router scaffold
- [ ] Tailwind CSS + shadcn/ui design system
- [ ] Job listings (browse, search, filter)
- [ ] Employer posting flow
- [ ] Job seeker profile + resume upload
- [ ] **M-Pesa STK Push** (Kenya) — pay for premium listings
- [ ] Basic auth (email + Google OAuth)
- [ ] Vercel deployment with preview URLs

### Phase 2 — Global Payments (Weeks 5–8)
**Goal:** Accept money from everywhere

| Market | Payment Method | API |
|--------|---------------|-----|
| 🇰🇪 Kenya | M-Pesa | Safaricom Daraja |
| 🇺🇸 USA | Credit/Debit, ACH | Stripe |
| 🇬🇧 UK | Cards, Open Banking | Stripe |
| 🇳🇬 Nigeria | Cards, Bank Transfer | Flutterwave |
| 🇮🇳 India | UPI, Cards | Razorpay |
| 🇧🇷 Brazil | PIX, Cards | Stripe |
| 🇩🇪 Germany | SEPA, Cards | Stripe |
| 🌍 Africa-wide | Mobile Money | Flutterwave |

### Phase 3 — Smart Features (Weeks 9–16)
**Goal:** Best UX, AI-powered matching

- [ ] AI job matching (Claude API) — match candidates to jobs by skills
- [ ] Swipe-to-apply mobile interface (Tinder for jobs)
- [ ] Instant WhatsApp/SMS notifications when matched
- [ ] Video intro for job seekers (30-second pitch)
- [ ] Employer dashboard with analytics
- [ ] Verified badges for employers and top candidates
- [ ] Referral program — earn M-Pesa / cash for referring

### Phase 4 — Scale (Weeks 17–24)
**Goal:** 100K users, profitable

- [ ] Multi-language (Swahili, French, Spanish, Hindi, Portuguese)
- [ ] Remote job board (global)
- [ ] Skills assessment + certificates
- [ ] Gig/freelance marketplace
- [ ] Corporate accounts (bulk hiring)
- [ ] Mobile app (React Native)

---

## 💰 Revenue Streams

| Stream | Model | Price |
|--------|-------|-------|
| Job Posting | Employer pays per post | $10–$50 |
| Premium Listing | Featured/boosted jobs | $25–$100 |
| Candidate Premium | Job seeker subscription | $5–15/month |
| Referral Bounties | Platform earns % of hire | 5–15% salary |
| AI Resume Review | One-time fee | $9.99 |
| Skills Badges | Certification fee | $19.99 |

**M-Pesa pricing in KES** (Kenya Shillings) for all Kenya transactions.

---

## 🏗️ Technical Architecture

```
bekenya.com
├── Frontend: Next.js 14 (App Router) + TypeScript
├── Styling: Tailwind CSS + shadcn/ui
├── Database: PostgreSQL (Neon / Supabase)
├── Auth: NextAuth.js (Google, Email, Phone)
├── Payments:
│   ├── M-Pesa: Safaricom Daraja API v2 (STK Push)
│   ├── Global: Stripe (cards, bank transfers)
│   └── Africa: Flutterwave
├── AI: Claude API (job matching, resume parsing)
├── Storage: Cloudflare R2 (resumes, profile pics)
├── Email: Resend
├── SMS/WhatsApp: Africa's Talking / Twilio
└── Deploy: Vercel (edge functions for speed)
```

---

## 🇰🇪 M-Pesa Integration Plan

### How It Works
1. User selects "Pay with M-Pesa"
2. Enter phone number (07XX XXX XXX)
3. Safaricom sends STK Push to their phone
4. User enters M-Pesa PIN — done!
5. Webhook confirms payment → unlock feature

### Daraja API Flow
```
App → POST /mpesa/stkpush → Safaricom Daraja
Safaricom → STK Push → User's Phone
User → Enters PIN
Safaricom → Webhook Callback → App
App → Unlock Premium Feature
```

### Sandbox Testing
- Daraja sandbox: `https://sandbox.safaricom.co.ke`
- Test credentials available at developer.safaricom.co.ke
- Live production requires business verification

---

## 📱 Mobile-First Design Principles

1. **Thumb zone** — all primary actions within thumb reach
2. **Speed** — <2s load on 3G (critical in Kenya/Africa)
3. **Offline-ready** — cache job listings for offline browse
4. **WhatsApp-style** — familiar UI patterns for African users
5. **Low data mode** — compressed images, lazy loading
6. **USSD fallback** (Phase 4) — for feature phones

---

## 🚀 Go-to-Market Strategy

### Kenya Launch
- Partner with universities (top engineering/business schools)
- WhatsApp groups outreach
- M-Pesa referral bonuses (earn KES 500 per hire)
- Nairobi tech community (iHub, Andela alumni)

### Global Expansion
- LinkedIn competitor positioning
- Remote-first job boards
- Diaspora communities (Kenyans abroad hiring back home)
- Embassy job boards partnerships

---

## 🔑 Key Differentiators vs LinkedIn/Indeed

| Feature | LinkedIn | Indeed | **Bekenya** |
|---------|----------|--------|------------|
| M-Pesa payments | ❌ | ❌ | ✅ |
| Africa-first | ❌ | Partial | ✅ |
| Swipe UX | ❌ | ❌ | ✅ |
| Video intros | ❌ | ❌ | ✅ |
| WhatsApp notifications | ❌ | ❌ | ✅ |
| AI matching | Limited | Limited | ✅ |
| Gamified progress | ❌ | ❌ | ✅ |
| Multi-currency | ❌ | USD only | ✅ |

---

## ✅ Week 1 Sprint — Build Now

1. `package.json` — Next.js 14 + dependencies
2. `app/layout.tsx` — Root layout with fonts, theme
3. `app/page.tsx` — Landing page (hero, features, CTA)
4. `app/jobs/page.tsx` — Job listings with search
5. `app/post-job/page.tsx` — Employer job posting form
6. `components/` — JobCard, SearchBar, PaymentModal
7. `lib/mpesa.ts` — M-Pesa Daraja API client
8. `app/api/mpesa/` — STK Push + callback webhook
9. `.env.example` — All required environment variables
10. Deploy to Vercel → live preview

---

*Built with ❤️ for Kenya and the world. Bekenya.com — Where Talent Meets Opportunity.*
