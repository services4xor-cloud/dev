# BeKenya WAR PLAN
## Vision: Be[Country] — One Mission. Every Country. Every Community.

### THE MISSION
Not a job board. Not a platform. A Compass.
Identity-first life routing for Pioneers who want to move, grow, and belong somewhere extraordinary.
Every purchase, every booking, every connection — a % goes to UTAMADUNI community development.

### THE VOCABULARY (Our Language, Not Silicon Valley's)
| Our Word | What Others Call It |
|---|---|
| Pioneer | Job Seeker / User |
| Anchor | Employer / Company |
| Path | Job / Position |
| Chapter | Application |
| Venture | Experience / Safari / Booking |
| Compass | Smart Search / Routing |
| The BeNetwork | The Platform |
| Gate | Country Entry Point |
| Route | Country Corridor |

### ARCHITECTURE OVERVIEW
```
BeNetwork Core:
├── lib/vocabulary.ts        — Our language layer
├── lib/countries.ts         — 12-country config
├── lib/compass.ts           — Route corridors
├── lib/matching.ts          — Pioneer <-> Path scoring
├── lib/safari-packages.ts   — Real experience data
├── lib/social-media.ts      — 9-platform automation
├── lib/whatsapp-templates.ts — 10 message templates
├── lib/email.ts             — Email automation (Resend)
└── prisma/schema.prisma     — Data models

Pages:
├── / (homepage)             — Identity-first compass landing
├── /compass                 — 4-step route finder
├── /ventures                — Unified path + experience feed
├── /experiences/[id]        — Safari detail + booking
├── /onboarding              — 5-step Pioneer capture
├── /pioneers/dashboard      — Pioneer personal hub
├── /pioneers/notifications  — Notification center
├── /anchors/dashboard       — Anchor management
├── /anchors/post-path       — Path creation wizard
├── /charity                 — UTAMADUNI CBO
├── /business                — BeKenya Family Ltd
├── /be/[country]            — Country landing pages
├── /admin                   — Platform admin
└── /compass, /pricing, /about, /contact, etc.

APIs:
├── /api/paths               — Path CRUD
├── /api/compass             — Geo detection + routing
├── /api/onboarding          — Pioneer profile capture
├── /api/social              — Social media queue
├── /api/search              — Smart search with matching
├── /api/mpesa/stkpush       — M-Pesa STK Push v2
├── /api/mpesa/callback      — M-Pesa webhook
├── /api/auth                — NextAuth (Google + credentials)
└── /api/profile             — Profile CRUD
```

### BUSINESS STRUCTURE
- BeKenya Family Ltd (Kenya, eCitizen registration)
- Shareholders: Foreign founder 80% / Kenya partner 20%
- Banking: KCB/Equity dual-signature
- M-Pesa: Safaricom Business Till (Chapa)
- UTAMADUNI: Registered CBO for community impact

### REVENUE MODEL
1. Path listings: KES 500 (Basic) / KES 2,000 (Featured) / KES 5,000 (Premium)
2. Safari/Experience bookings: Commission (15-30%) on Victoria Paradise, FessyTours
3. Pioneer Pro: KES 500/mo for enhanced compass features
4. Anchor subscription: KES 2,000/mo for unlimited paths
5. UTAMADUNI donations: Voluntary contributions

### PHASE 1 CHECKLIST (Current)
- [x] Next.js 14 foundation (16+ pages)
- [x] Revolutionary vocabulary (BeNetwork language)
- [x] Be[Country] architecture (12 countries)
- [x] Lion logo + maroon/gold brand identity
- [x] Safari packages (real pricing from Victoria Safari/FessyTours)
- [x] Smart matching engine (4-dimension scoring)
- [x] Social media automation (9 platforms)
- [x] WhatsApp templates (10, en/sw/de)
- [x] M-Pesa Daraja v2 STK Push
- [x] Email automation (Resend)
- [x] UTAMADUNI charity page
- [x] BeKenya Family Ltd business page
- [x] Pioneer onboarding (5 steps)
- [x] Anchor dashboard + Post-a-Path wizard
- [x] Pioneer dashboard + notifications
- [x] Admin dashboard
- [x] CI/CD (GitHub Actions)
- [x] SEO (OG tags, sitemap, robots)
- [x] Accessibility (WCAG 2.1 AA)
- [x] PWA manifest
- [ ] DATABASE_URL (Neon PostgreSQL) — Human task
- [ ] M-Pesa live credentials — Human task
- [ ] Social media API keys — Human task
- [ ] BeKenya Family Ltd registration — Human task

### PHASE 2 GOALS
- Real-time matching (when DB connected)
- Social media live posting
- Mobile app (React Native from same codebase)
- BeGermany launch
- BeNigeria launch
- Stripe Connect for international anchors

### COUNTRY EXPANSION SEQUENCE
1. Kenya — BeKenya (NOW — test & learn)
2. Germany — BeGermany (Q2 — high demand for KE professionals)
3. Nigeria — BeNigeria (Q2 — Flutterwave ready)
4. UK — BeUK (Q3 — NHS Pioneer corridor)
5. USA — BeAmerica (Q4 — H1B pioneers)
6. UAE — BeUAE (Q4 — hospitality corridor)

---

## Technical Decisions Log

### Why Next.js 14 App Router
- Server components reduce JS bundle (critical for Kenya 3G)
- Edge functions for geo-routing (Compass feature)
- Vercel deployment with zero config
- TypeScript strict mode throughout

### Why Neon PostgreSQL
- Serverless branching matches Vercel preview deployments
- Prisma ORM for type-safe queries
- Free tier sufficient for MVP

### Why M-Pesa Daraja v2
- Only API for Kenya mobile money (market leader, 30M+ users)
- STK Push = best UX (no app switching)
- Sandbox available for development

### Why Resend for Email
- Developer-first, simple API
- React Email templates
- Kenya email deliverability verified

---

## Key Differentiators vs LinkedIn/Indeed

| Feature | LinkedIn | Indeed | The BeNetwork |
|---------|----------|--------|---------------|
| M-Pesa payments | No | No | Yes |
| Africa-first UX | No | Partial | Yes |
| Vocabulary-first identity | No | No | Yes |
| Safari/experience booking | No | No | Yes |
| UTAMADUNI impact | No | No | Yes |
| WhatsApp notifications | No | No | Yes |
| Be[Country] multi-market | No | Limited | Yes |
| Pioneer/Anchor/Path language | No | No | Yes |

---

*The BeNetwork — Identity-first life routing. Not a job board. A Compass.*
