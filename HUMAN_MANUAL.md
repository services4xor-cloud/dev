# Be[Country] — Human Action Guide

> Steps only humans can do. Do these once, AI handles the rest.
> ← [CLAUDE.md](./CLAUDE.md) | [PROGRESS.md](./PROGRESS.md)

---

## Status

| #   | Task                          | Status   | Notes                                         |
| --- | ----------------------------- | -------- | --------------------------------------------- |
| 1   | Database (Neon)               | ✅ DONE  | Schema pushed, 15 tables live                 |
| 2   | NEXTAUTH_SECRET               | ✅ DONE  | Set in .env                                   |
| 3   | Google OAuth credentials      | ✅ DONE  | Client ID + Secret in .env                    |
| 4   | Resend email API key          | ✅ DONE  | `re_...` key in .env                          |
| 5   | Push env vars to Vercel       | ✅ DONE  | All env vars live on Vercel                   |
| 6   | **Google OAuth redirect URI** | ⏳ YOU   | Add production callback URL in Google Console |
| 7   | M-Pesa sandbox                | 🔜 LATER | Needed for KE payments                        |
| 8   | Stripe test keys              | 🔜 LATER | Needed for INT payments                       |
| 9   | Domain (bekenya.com)          | 🔜 LATER | Buy + DNS                                     |
| 10  | M-Pesa production             | 🔜 LATER | Requires KE business registration (2-4 weeks) |

---

## ⏳ Task 5: Push env vars to Vercel (5 min)

All credentials exist locally in `.env`. They need to be added to Vercel for production:

1. Go to https://vercel.com → Project `dev` → Settings → Environment Variables
2. Add these (copy values from your `.env` file):

```
DATABASE_URL          = (your Neon connection string)
NEXTAUTH_SECRET       = (your secret)
NEXTAUTH_URL          = https://dev-plum-rho.vercel.app
GOOGLE_CLIENT_ID      = (your Google client ID)
GOOGLE_CLIENT_SECRET  = (your Google client secret)
RESEND_API_KEY        = (your Resend key)
NEXT_PUBLIC_COUNTRY_CODE = KE
```

3. Redeploy: push any commit or click "Redeploy" in Vercel dashboard.

---

## ⏳ Task 6: Google OAuth redirect URI (2 min)

1. Go to https://console.cloud.google.com → APIs & Services → Credentials → your OAuth Client
2. Under "Authorized redirect URIs", add:
   ```
   https://dev-plum-rho.vercel.app/api/auth/callback/google
   ```
   (`http://localhost:3000/api/auth/callback/google` should already be there)
3. Save.

---

## 🔜 Later Tasks

### M-Pesa Sandbox

1. https://developer.safaricom.co.ke → My Apps → Create (Lipa na M-Pesa Sandbox)
2. Add to Vercel: `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`, etc.

### Stripe Test Keys

1. https://stripe.com → Developers → API Keys
2. Add to Vercel: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### Domain

Buy `bekenya.com` → Vercel Settings → Domains → Add DNS records.

### M-Pesa Production (2–4 weeks)

Requires: Kenyan business registration, Safaricom Till/Paybill, bank account, KRA PIN.

---

## Local Dev

```bash
npm install
npx prisma generate
npm run dev  # http://localhost:3000
```

---

_Last updated: Session 58 (2026-03-12)_
