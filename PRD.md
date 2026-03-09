# Be[Country] — Product Requirements Document
> Living document. Update as the product evolves.
> Owner: Tobias | Platform: BeKenya (Kenya-first) | Version: 0.2.0

---

## 1. Vision

**Be[Country]** is an identity-first life-routing platform that lets people experience the possibilities of building their life, work, and business across countries.

It's not a job board. Not a travel site. Not a marketplace.

It's a **Compass** — a smart routing system that matches people (Pioneers) with the right opportunities, experiences, and communities in any country, starting with Kenya.

> "Not where you are. Where you could be."

---

## 2. The Problem

People want to explore life in other countries — work there, do business there, experience it — but the path is fragmented:
- Jobs sites don't show cultural fit or local realities
- Travel sites don't connect to work or business opportunities
- No single platform connects income, lifestyle, and community impact

Kenyan workers, entrepreneurs, and explorers deserve a world-class compass for their journey.

---

## 3. Users

### Pioneers (Seekers)
People looking to explore paths in a new country — work, business, experiences.

**Sub-types:**
- **Explorer Pioneer**: Wants to experience Kenya (safari, culture, eco-tourism) before committing
- **Work Pioneer**: Seeking employment or remote work in/from Kenya
- **Entrepreneur Pioneer**: Building a business that touches Kenya (import/export, tech, hospitality)
- **Return Pioneer**: Kenyan diaspora returning home
- **Local Pioneer**: Kenyan seeking paths domestically or to other countries

### Anchors (Providers)
Organizations and individuals offering paths to Pioneers.

**Sub-types:**
- **Lodge Anchor**: Safari lodges, eco-resorts offering jobs + bookings
- **Business Anchor**: Companies offering employment paths
- **Community Anchor**: CBOs like UTAMADUNI offering volunteer/impact paths
- **Experience Anchor**: Tour operators offering ventures

---

## 4. Core Platform — BeNetwork (Generic Layer)

These features work for ALL countries.

### 4.1 Compass (Smart Routing)
- **Route Wizard**: 4-step flow — Who are you? → Where from? → Where going? → What seeking?
- **Country Routes**: Predefined corridors (KE-DE, KE-GB, KE-AE, KE-US, KE-NG, etc.)
- **Scoring Engine**: Match Pioneers to Paths using 4 dimensions (skills, location, culture, intent)
- **Geo Detection**: Auto-detect Pioneer's country from IP, show relevant routes

### 4.2 Ventures Feed
- Unified feed mixing Paths (jobs) + Experiences (safaris, culture)
- Filter by: country, category, payment method, type
- Sort by: relevance score, recency, featured

### 4.3 Pioneer Identity
- 5-step onboarding: name → origin → intent → skills → compass setup
- Pioneer profile with: bio, skills, country interests, payment preferences
- Dashboard: active chapters, saved paths, notifications, compass history

### 4.4 Anchor Dashboard
- Post Paths (job listings) with pricing tiers
- View Chapters (applications) with Pioneer profiles
- Analytics: path views, chapter rate, Pioneer demographics
- Featured placement payments

### 4.5 Be[Country] Gates
- `/be/ke` — BeKenya gate
- `/be/de` — BeGermany gate
- `/be/us` — BeAmerica gate
- Each gate shows: active paths, key experiences, route options, local currency/payment

---

## 5. BeKenya — Kenya-Specific Features

### 5.1 Safari & Experience Packages
Real packages with real pricing:

| Package | Type | Price | Duration |
|---------|------|-------|---------|
| Victoria Paradise | Fishing + Lodge | €350/night | Flexible |
| Tsavo Safari | Classic safari | €290/person | 3 days |
| Maasai Mara Classic | Masai + game drives | $1,040/2pax | 3 days |
| Maasai Mara Grand | Premium circuit | $1,800/2pax | 5 days |
| Cultural Immersion | UTAMADUNI + community | Custom | Flexible |

### 5.2 M-Pesa Integration
- STK Push for KES payments (safaris, paths, subscriptions)
- Callback handler for payment confirmation
- Sandbox: shortcode 174379, env=sandbox
- Production: BeKenya Family Ltd Till (Chapa)

### 5.3 UTAMADUNI Integration
- 5-10% of every booking goes to UTAMADUNI CBO
- Community development projects visible to Pioneers
- Donation portal at `/charity`
- Impact counter on homepage

### 5.4 Kenyan Business Structure
- **BeKenya Family Ltd** (eCitizen registration pending)
- Shareholders: Foreign founder 80% / Kenya partner 20%
- Banking: KCB/Equity dual-signature
- Payment methods: M-Pesa, Stripe, PayPal, bank transfer

### 5.5 Kenya-Specific Routes
Active corridors (already in lib/compass.ts):
- KE → DE (Germany — skilled workers, hospitality)
- KE → GB (UK — healthcare, hospitality, tech)
- KE → AE (UAE — construction, hospitality, domestic)
- KE → US (USA — tech, academia, diaspora)
- KE → CA (Canada — permanent residency paths)
- DE → KE (Germans seeking Kenya experience)

---

## 6. Revenue Model

### Tier 1: Path Listings (Anchors pay to post)
| Tier | Price | Validity | Features |
|------|-------|---------|---------|
| Basic | KES 500 / €3 | 30 days | Standard listing |
| Featured | KES 2,000 / €12 | 60 days | Top of feed, highlighted |
| Premium | KES 5,000 / €30 | 90 days | Featured + WhatsApp + social push |

### Tier 2: Experience Bookings (Commission)
- Safari/experience bookings: 15-30% commission
- Direct from experience Anchors (lodges, tour operators)

### Tier 3: Pioneer Subscriptions
- Pioneer Pro: KES 500/mo — enhanced compass, priority matching
- Pioneer Elite: KES 1,500/mo — visa guidance, concierge routing

### Tier 4: Anchor Subscriptions
- Anchor Basic: Free (3 paths/mo)
- Anchor Pro: KES 2,000/mo — unlimited paths + analytics

### Tier 5: Community Impact
- UTAMADUNI donations: Voluntary add-on at checkout
- Impact Packages: Bundle donation with experience booking

---

## 7. Feature Roadmap

### Phase 1 — Foundation (DONE ✅)
- [x] Next.js 14 platform with all core pages
- [x] BeNetwork vocabulary and architecture
- [x] M-Pesa Daraja API v2 integration
- [x] Compass routing system
- [x] Pioneers/Anchors dashboards
- [x] Safari package library
- [x] Social media automation (9 platforms)
- [x] WhatsApp templates (en/sw/de)
- [x] Email automation (Resend)
- [x] 12-country config system
- [x] Admin dashboard
- [x] UTAMADUNI CBO page
- [x] BeKenya Family Ltd page

### Phase 2 — BeKenya Live (IN PROGRESS 🔄)
- [ ] **Kenya offering pages** — detailed safari + experience content
- [ ] **Booking flow** — end-to-end M-Pesa booking with confirmation
- [ ] **Pioneer onboarding** — full 5-step flow with DB persistence
- [ ] **Database live** — Neon PostgreSQL connected
- [ ] **Real auth** — Google OAuth + email/password working
- [ ] **Path listing live** — Anchors can post real paths
- [ ] **Compass working** — geo detection + route matching live
- [ ] **WhatsApp notifications** — booking + application alerts

### Phase 3 — Growth Features
- [ ] Pioneer Pro subscription with Stripe
- [ ] Impact dashboard (UTAMADUNI % tracker)
- [ ] Reviews + ratings for experiences
- [ ] Pioneer community (chapters, stories)
- [ ] Mobile PWA experience
- [ ] Multi-language UI (en, sw, de)
- [ ] SEO content: Kenya guides, route stories

### Phase 4 — Be[Country] Expansion
- [ ] BeGermany (SEPA payments, German job market)
- [ ] BeNigeria (Flutterwave, Lagos tech scene)
- [ ] BeAmerica (ACH/Stripe, US visa sponsors)
- [ ] Multi-country Pioneer profiles
- [ ] Cross-border path matching

---

## 8. Technical Requirements

### Performance
- First Contentful Paint < 2s (Vercel Edge)
- Core Web Vitals: all green
- PWA: offline support for compass

### Accessibility
- WCAG 2.1 AA minimum
- aria-labels on all interactive elements
- skip-to-content link on all pages
- focus-visible on all focusable elements

### SEO
- OpenGraph + Twitter cards on all pages
- Structured data (JSON-LD) for experiences
- Sitemap.xml auto-generated
- robots.txt configured

### Security
- No credentials in code (env vars only)
- M-Pesa callback signature verification
- NextAuth CSRF protection
- Prisma parameterized queries (no SQL injection)

### Internationalization
- Currency: KES (Kenya), EUR (Europe), USD (US/global)
- Phone: +254 format enforced for M-Pesa
- Dates: ISO 8601 in DB, locale-aware in UI
- Language: English primary, Swahili secondary

---

## 9. Known Constraints

### Human-Blocked Items (see HUMAN_MANUAL.md)
- `DATABASE_URL` — Neon PostgreSQL setup
- `MPESA_CONSUMER_KEY` + `MPESA_CONSUMER_SECRET` — Safaricom developer account
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — Google OAuth console
- `RESEND_API_KEY` — Resend account
- BeKenya Family Ltd eCitizen registration
- UTAMADUNI CBO registration

### Technical Limitations
- Prisma migrations disabled in Vercel (use `db push` for now)
- M-Pesa sandbox: 20s timeout on STK Push response
- WhatsApp Business API: requires Facebook approval (use template workaround)

---

## 10. Success Metrics (Phase 2)

| Metric | Target |
|--------|--------|
| Pioneers registered | 100 |
| Paths listed | 20 |
| Bookings completed | 5 |
| M-Pesa transactions | 10 |
| Monthly page views | 1,000 |
| UTAMADUNI donations | KES 10,000 |
