# 📋 BEKENYA — Human Task List

> Everything Claude CANNOT do. Organized by when and what you need.
> All other building, coding, testing = Claude handles it.

---

## 🔴 CRITICAL — Do First (30 min total)

### 1. Database (10 min) — BLOCKS real job data
Without this, the site runs on mock/demo data only.

**Option A: Neon (Recommended, free)**
```
1. Go to: neon.tech
2. Click "Create Project" → name it "bekenya" → region: EU Central
3. Copy the connection string (looks like: postgresql://user:pass@host/db)
4. Add to Vercel: Settings → Environment Variables → DATABASE_URL = [paste]
5. Open terminal → cd C:\GIT\dev\.claude\worktrees\keen-jemison
6. Run: npm install && npx prisma db push && npm run db:seed
```

**Option B: Local (for testing on your PC only)**
```
# If you have PostgreSQL installed locally:
DATABASE_URL="postgresql://postgres:password@localhost:5432/bekenya"
# Then run: npx prisma db push && npm run db:seed
```

**What this unlocks:**
- Real job listings (6 pre-seeded: Safaricom, KCB Bank, Safari Guide, etc.)
- User registration and login
- Job applications stored in database
- Referral tracking

---

### 2. M-Pesa Sandbox Credentials (20 min) — BLOCKS payment testing
Free, no real money needed.

```
1. Go to: developer.safaricom.co.ke
2. Sign Up → create account (free)
3. My Apps → Create New App → check "Lipa na M-Pesa Sandbox"
4. Copy Consumer Key + Consumer Secret
```

**Add to Vercel → Settings → Environment Variables:**
```
MPESA_CONSUMER_KEY = (paste from Safaricom)
MPESA_CONSUMER_SECRET = (paste from Safaricom)
```
(MPESA_BUSINESS_SHORT_CODE and MPESA_PASSKEY already added ✅)

**What this unlocks:**
- Test M-Pesa payments (fake money, real STK Push to Safaricom simulator)
- Employer job post payment flow
- Premium upgrade payment

---

## 🟡 IMPORTANT — Do This Week (1.5 hr total)

### 3. Google OAuth (15 min) — BLOCKS "Sign in with Google"
```
1. console.cloud.google.com → Create project "Bekenya"
2. APIs & Services → OAuth consent screen → External
3. Credentials → Create OAuth Client ID → Web application
4. Authorized redirect URIs, add:
   https://dev-git-claude-keen-jemison-tobias-projects-81752e2c.vercel.app/api/auth/callback/google
   https://bekenya.com/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
```
**Add to Vercel:**
```
GOOGLE_CLIENT_ID = (paste)
GOOGLE_CLIENT_SECRET = (paste)
```

### 4. Stripe Test Keys (10 min) — BLOCKS card payments from international employers
```
1. stripe.com → Sign up
2. Dashboard → Developers → API Keys
3. Copy Publishable key (pk_test_...) + Secret key (sk_test_...)
```
**Add to Vercel:**
```
STRIPE_SECRET_KEY = sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
```

### 5. Resend Email API (10 min) — BLOCKS job alert emails
```
1. resend.com → Sign up (3,000 emails/month free)
2. API Keys → Create key → name "Bekenya"
3. Copy key (re_...)
```
**Add to Vercel:**
```
RESEND_API_KEY = re_...
```

### 6. Flutterwave Test (15 min) — BLOCKS Nigeria/Ghana payments
```
1. flutterwave.com/developer → Create account
2. API Keys → Copy Public Key + Secret Key
```
**Add to Vercel:**
```
FLUTTERWAVE_PUBLIC_KEY = FLWPUBK_TEST-...
FLUTTERWAVE_SECRET_KEY = FLWSECK_TEST-...
```

---

## 🟢 NICE TO HAVE — Eventually

### 7. Buy bekenya.com domain (~$12/year)
- namecheap.com → search "bekenya.com"
- Connect to Vercel → Settings → Domains

### 8. Africa's Talking (Kenya SMS)
- africastalking.com → signup → API Key
- `AFRICASTALKING_API_KEY` + `AFRICASTALKING_USERNAME=sandbox`

### 9. Google Analytics
- analytics.google.com → Create → copy Measurement ID (G-XXXXXXXXXX)
- `NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX`

---

## 🌍 FUTURE — Be[Country] Expansion (No rush)

When BeKenya is running, same codebase powers each new country:
| Country | Brand | Payment | Extra Setup |
|---------|-------|---------|-------------|
| Germany | BeGermany | SEPA/Stripe | German business registration |
| USA | BeAmerica | Stripe/ACH | - |
| Nigeria | BeNigeria | Flutterwave/Paystack | Paystack account |
| Uganda | BeUganda | Airtel Money + MTN | Airtel API |

---

## ✅ ALREADY DONE BY CLAUDE (no action needed)

- ✅ GitHub push access
- ✅ Vercel deployment connected
- ✅ Vercel env vars: NEXTAUTH_SECRET, MPESA sandbox (public keys)
- ✅ 16+ pages built and deployed
- ✅ M-Pesa STK Push code (needs your Consumer Key to test)
- ✅ Database schema (Prisma) — just needs a URL to connect
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ SEO (robots.txt, sitemap, Open Graph)
- ✅ Test data seed script (run once after DB is set up)
- ✅ Multi-country config system (lib/countries.ts)

---

## 🖥️ Local Development (Run on your PC)

```bash
# 1. Install dependencies
cd C:\GIT\dev\.claude\worktrees\keen-jemison
npm install

# 2. Copy env file and fill in YOUR values
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Start database (if using local Postgres)
npx prisma db push

# 4. Seed test data
npm run db:seed

# 5. Start dev server
npm run dev

# 6. Visit: http://localhost:3000
```

---

**Preview URL (live now):**
https://dev-git-claude-keen-jemison-tobias-projects-81752e2c.vercel.app

*Last updated by Claude — Claude builds the code. You provide the keys. Together we make Bekenya the world's best job platform.* 🌍
