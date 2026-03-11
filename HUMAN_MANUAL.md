# Be[Country] — Human Action Guide

> Steps only humans can do. Do these once, AI handles the rest.
> ← [CLAUDE.md](./CLAUDE.md) | [PROGRESS.md](./PROGRESS.md)

---

## Priority Order

| #   | Task              | Time   | Unlocks              |
| --- | ----------------- | ------ | -------------------- |
| 1   | Database (Neon)   | 10 min | Everything with data |
| 2   | NEXTAUTH_SECRET   | 1 min  | Auth security        |
| 3   | Google OAuth      | 15 min | Google Sign-In       |
| 4   | Resend email      | 5 min  | Email notifications  |
| 5   | M-Pesa sandbox    | 20 min | Payment testing      |
| 6   | Stripe test keys  | 10 min | International cards  |
| 7   | Domain            | 15 min | Production URL       |
| 8   | M-Pesa production | 2–4 wk | Real payments        |

---

## 1. Database (Neon — free)

1. https://neon.tech → Sign up → Create Project `bekenya` → EU Central
2. Copy connection string
3. Add to Vercel → Settings → Environment Variables:
   ```
   DATABASE_URL = postgresql://...
   ```
4. Run: `npx prisma db push`

---

## 2. Auth Secret

```bash
openssl rand -base64 32
```

Add to Vercel:

```
NEXTAUTH_SECRET = (value)
NEXTAUTH_URL = https://your-url.vercel.app
```

---

## 3. Google OAuth

1. https://console.cloud.google.com → Create project → OAuth consent → Credentials → OAuth Client ID
2. Redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-url.vercel.app/api/auth/callback/google
   ```
3. Add to Vercel:
   ```
   GOOGLE_CLIENT_ID = (value)
   GOOGLE_CLIENT_SECRET = (value)
   ```

---

## 4. Email (Resend — free 3K/month)

1. https://resend.com → API Keys → Create → Copy `re_...`
2. Add to Vercel: `RESEND_API_KEY = re_...`

---

## 5. M-Pesa Sandbox (free)

1. https://developer.safaricom.co.ke → My Apps → Create (Lipa na M-Pesa Sandbox)
2. Add to Vercel:
   ```
   MPESA_CONSUMER_KEY = (value)
   MPESA_CONSUMER_SECRET = (value)
   MPESA_BUSINESS_SHORT_CODE = 174379
   MPESA_PASSKEY = bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
   MPESA_ENVIRONMENT = sandbox
   MPESA_CALLBACK_URL = https://your-url.vercel.app/api/mpesa/callback
   ```

Test phone: `254708374149`

---

## 6. Stripe (test keys)

1. https://stripe.com → Developers → API Keys
2. Webhook: `https://your-url.vercel.app/api/stripe/webhook`
3. Add to Vercel:
   ```
   STRIPE_SECRET_KEY = sk_test_...
   STRIPE_WEBHOOK_SECRET = whsec_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
   ```

---

## 7. Domain

Buy `bekenya.com` → Vercel Settings → Domains → Add DNS records.

---

## 8. M-Pesa Production (2–4 weeks)

Requires: Kenyan business registration, Safaricom Till/Paybill, bank account, KRA PIN. Apply at https://developer.safaricom.co.ke/docs#going-live

---

## Optional

- **Analytics:** `NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX`
- **SMS:** Africa's Talking API
- **WhatsApp:** Meta Cloud API
- **Social:** Instagram, TikTok, Twitter, LinkedIn, Telegram API keys

---

## Local Dev

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev  # http://localhost:3000
```

---

_Last updated: Session 20 (2026-03-11)_
