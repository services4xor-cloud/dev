# BeKenya — Human Action Guide

> Everything Claude CANNOT do for you. Do these once and the AI handles the rest.
> ← Back to [CLAUDE.md](./CLAUDE.md) | Related: [PROGRESS.md](./PROGRESS.md) · [ROADMAP.md](./ROADMAP.md)

---

## Priority Order

Do these in order — each unlocks the next step.

| #   | Task                     | Time      | Blocks                      |
| --- | ------------------------ | --------- | --------------------------- |
| 1   | Set up database (Neon)   | 10 min    | Everything with real data   |
| 2   | Generate NEXTAUTH_SECRET | 1 min     | Auth security               |
| 3   | Google OAuth             | 15 min    | Sign in with Google         |
| 4   | Resend email             | 5 min     | Path alert emails           |
| 5   | M-Pesa sandbox           | 20 min    | Payment testing             |
| 6   | Stripe test keys         | 10 min    | International card payments |
| 7   | Domain (bekenya.com)     | 15 min    | Production URL              |
| 8   | M-Pesa production        | 2–4 weeks | Real payments               |

---

## 1. Database — PostgreSQL on Neon (free tier)

**Steps:**

1. Go to: https://neon.tech
2. Sign up (free, no credit card)
3. Click **Create Project** → name: `bekenya` → region: **EU Central**
4. Copy the connection string:
   ```
   postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/bekenya
   ```

**Add to Vercel → Settings → Environment Variables:**

```
DATABASE_URL = postgresql://...
```

**Then run migrations:**

```bash
cd C:\GIT\dev
npx prisma db push
```

**What this unlocks:**

- Real Paths (6 pre-seeded: Safaricom, KCB Bank, Safari Guide, etc.)
- Pioneer registration + login
- Chapters stored in database
- Referral tracking

---

## 2. Auth Secret

```bash
openssl rand -base64 32
```

**Add to Vercel:**

```
NEXTAUTH_SECRET = (paste the generated value)
NEXTAUTH_URL = https://your-vercel-url.vercel.app
```

---

## 3. Google OAuth — Sign in with Google

**Steps:**

1. Go to: https://console.cloud.google.com
2. Create a new project: **Bekenya**
3. Go to **APIs & Services → OAuth consent screen** → External
4. Go to **Credentials → Create Credentials → OAuth Client ID** → Web application
5. Authorized redirect URIs — add:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-vercel-url.vercel.app/api/auth/callback/google
   https://bekenya.com/api/auth/callback/google
   ```

**Add to Vercel:**

```
GOOGLE_CLIENT_ID = (paste)
GOOGLE_CLIENT_SECRET = (paste)
```

---

## 4. Email — Resend (free tier: 3,000 emails/month)

**Steps:**

1. Go to: https://resend.com → Sign up
2. **API Keys → Create API Key** → name: `Bekenya`
3. Copy the key (starts with `re_`)
4. Optionally: **Domains → Add Domain** → `bekenya.com` (for custom sender)

**Add to Vercel:**

```
RESEND_API_KEY = re_...
```

---

## 5. M-Pesa Sandbox — Test Payments (free)

**Steps:**

1. Go to: https://developer.safaricom.co.ke
2. Sign Up → create account
3. **My Apps → Create New App** → check: Lipa na M-Pesa Sandbox
4. Copy your Consumer Key + Consumer Secret

**Add to Vercel:**

```
MPESA_CONSUMER_KEY = (paste)
MPESA_CONSUMER_SECRET = (paste)
MPESA_BUSINESS_SHORT_CODE = 174379
MPESA_PASSKEY = bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_ENVIRONMENT = sandbox
MPESA_CALLBACK_URL = https://your-vercel-url.vercel.app/api/mpesa/callback
```

**Test:** Use phone `254708374149` with any amount (goes to Safaricom simulator).

---

## 6. Stripe — Card Payments (international)

**Steps:**

1. Go to: https://stripe.com → Sign up
2. **Developers → API Keys** → copy Publishable + Secret key
3. **Developers → Webhooks → Add endpoint**:
   - URL: `https://your-vercel-url.vercel.app/api/stripe/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`

**Add to Vercel:**

```
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
```

**Test cards:** `4242 4242 4242 4242` (success), `4000 0000 0000 0002` (decline)

---

## 7. Domain — bekenya.com

1. Buy at namecheap.com or domains.google.com (~$10–15/year)
2. In Vercel → **Settings → Domains** → add `bekenya.com` + `www.bekenya.com`
3. Add DNS records Vercel shows you at your registrar
4. Wait 10–30 min for propagation

---

## 8. M-Pesa Production — Real Money

> This takes 2–4 weeks. Start early.

**Requirements:** Kenyan registered business, Safaricom M-Pesa Till/Paybill, business bank account, KRA PIN certificate, certificate of incorporation.

**Steps:**

1. Register at: https://developer.safaricom.co.ke/docs#going-live
2. Submit business documents → Safaricom reviews (1–2 weeks)
3. Get production credentials
4. Update env vars: `MPESA_ENVIRONMENT = production` + production keys

---

## Optional: Analytics

Google Analytics → https://analytics.google.com → Create property → copy Measurement ID

```
NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX
```

---

## Optional: SMS/WhatsApp

**Africa's Talking (Kenya SMS):**

1. https://africastalking.com → Sign up → API Key

```
AFRICASTALKING_API_KEY = (paste)
AFRICASTALKING_USERNAME = sandbox
```

**WhatsApp Business API (Meta Cloud):**

1. https://developers.facebook.com/docs/whatsapp/cloud-api

```
WHATSAPP_ACCESS_TOKEN = (paste)
WHATSAPP_PHONE_NUMBER_ID = (paste)
```

---

## Optional: Social Media API Keys

| Platform           | Portal                  | Key Names                                          |
| ------------------ | ----------------------- | -------------------------------------------------- |
| Instagram/Facebook | developers.facebook.com | INSTAGRAM_ACCESS_TOKEN, FACEBOOK_PAGE_ACCESS_TOKEN |
| TikTok             | developers.tiktok.com   | TIKTOK_CLIENT_KEY, TIKTOK_CLIENT_SECRET            |
| Twitter/X          | developer.twitter.com   | TWITTER_API_KEY, TWITTER_API_SECRET                |
| LinkedIn           | linkedin.com/developers | LINKEDIN_ACCESS_TOKEN, LINKEDIN_ORGANIZATION_ID    |
| Telegram           | @BotFather on Telegram  | TELEGRAM_BOT_TOKEN, TELEGRAM_CHANNEL_ID            |

Once keys are added → Claude automatically posts new Ventures, safari packages, and Pioneer success stories.

---

## BeKenya Family Ltd — Legal Setup

### Kenya Company Registration

1. https://ecitizen.go.ke → Business Registration → "BeKenya Family Ltd"
2. Partner's ID + KRA PIN, your passport (foreign shareholder 80%)
3. Get: CR1, CR12, CR8 documents

### Bank Account

KCB or Equity Bank → Dual Signature (without you = no withdrawal) → online access + OTP

### M-Pesa Business Till

Partner → Safaricom Shop → Company documents → Install CHAPA App → set you as Finance Controller

### UTAMADUNI CBO Registration

Ministry of Interior → Social Services → ~KES 2,000 → links UTAMADUNI to BeKenya Family Ltd

---

## Already Done by Claude

- 20+ pages built (all dark theme, brand consistent)
- Full BeNetwork vocabulary (Prisma schema, API routes, all UI)
- M-Pesa STK Push code (needs your Consumer Key to test)
- Database schema (Prisma) — just needs a URL to connect
- CI/CD pipeline (GitHub Actions)
- SEO (robots.txt, sitemap, Open Graph)
- Test data seed script
- Multi-country config system
- Centralized type system + mock data layer
- Dev tooling (Prettier, ESLint, Husky pre-commit hooks)

---

## Local Development

```bash
cd C:\GIT\dev
npm install
cp .env.example .env.local   # Fill in your credentials
npx prisma generate
npx prisma db push            # Only if DATABASE_URL is set
npm run dev                   # http://localhost:3000
```

---

**Vercel dashboard:** https://vercel.com/dashboard
**GitHub repo:** https://github.com/services4xor-cloud/dev

_Last updated: Session 15 (2026-03-11)_
