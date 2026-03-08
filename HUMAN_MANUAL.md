# 🧑‍💼 BEKENYA.COM — Human Action Guide
> Everything Claude CANNOT do for you. Do these once and the AI handles the rest.

---

## 🚦 PRIORITY ORDER
Do these in order — each unlocks the next step.

| # | Task | Time | Blocks |
|---|------|------|--------|
| 1 | Fix GitHub push | 5 min | Everything |
| 2 | Connect Vercel | 10 min | Live preview URLs |
| 3 | Set up M-Pesa sandbox | 20 min | Payment testing |
| 4 | Set up database | 10 min | User accounts, jobs |
| 5 | Google OAuth | 10 min | Sign in with Google |
| 6 | Stripe | 10 min | Card payments |
| 7 | Domain | 15 min | bekenya.com live |
| 8 | M-Pesa production | 2–4 weeks | Real payments |

---

## 1. 🔑 FIX GITHUB — Push Access

**The problem:** Git push fails with 403 because `reactbias` account has no write access to `services4xor-cloud/dev`.

**Fix option A — Add collaborator (easiest):**
1. Go to: https://github.com/services4xor-cloud/dev/settings/access
2. Click **"Add people"**
3. Add: `reactbias`
4. Set role: **Write** or **Admin**
5. Check email for the invite and accept it

**Fix option B — Use your main account:**
Open terminal and run:
```bash
git remote set-url origin https://YOUR_GITHUB_USERNAME@github.com/services4xor-cloud/dev.git
cd C:\GIT\dev\.claude\worktrees\keen-jemison
git push -u origin claude/keen-jemison
```
It will prompt for your GitHub password (use a Personal Access Token).

**Create a GitHub Personal Access Token:**
1. Go to: https://github.com/settings/tokens/new
2. Note: "Bekenya push access"
3. Check: `repo` (full control)
4. Click **Generate token**
5. Copy the token (starts with `ghp_`)
6. Use it as the password when git prompts

**After push succeeds**, open the PR at:
```
https://github.com/services4xor-cloud/dev/compare/main...claude/keen-jemison
```

---

## 2. ▲ VERCEL — Deploy & Get Test URLs

This gives Claude live preview URLs to test against.

**Steps:**
1. Go to: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select `services4xor-cloud/dev`
4. Framework: **Next.js** (auto-detected)
5. Root Directory: leave empty (it's the repo root)
6. Click **Deploy**

**After deploy**, every PR gets an automatic preview URL like:
```
https://dev-git-claude-keen-jemison-services4xor.vercel.app
```

**Add environment variables in Vercel:**
1. Go to your project → **Settings → Environment Variables**
2. Add all variables from `.env.example` (fill in real values as you get them)
3. For now, add at minimum:
   ```
   NEXTAUTH_SECRET = (generate: run `openssl rand -base64 32` in terminal)
   NEXTAUTH_URL = https://your-vercel-url.vercel.app
   DATABASE_URL = (from step 4 below)
   ```

---

## 3. 📱 M-PESA SANDBOX — Test Payments

**This is free. No real money needed.**

**Steps:**
1. Go to: https://developer.safaricom.co.ke
2. Click **Sign Up** → create account
3. Go to **My Apps** → **Create New App**
4. App Name: `Bekenya Dev`
5. Check: ✅ Lipa na M-Pesa Sandbox
6. Click **Create App**
7. Copy your:
   - `Consumer Key`
   - `Consumer Secret`

**Add to Vercel env vars:**
```
MPESA_CONSUMER_KEY = (paste here)
MPESA_CONSUMER_SECRET = (paste here)
MPESA_BUSINESS_SHORT_CODE = 174379
MPESA_PASSKEY = bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_ENVIRONMENT = sandbox
MPESA_CALLBACK_URL = https://your-vercel-url.vercel.app/api/mpesa/callback
```

**Test M-Pesa payment (sandbox):**
- Use test phone: `254708374149`
- Use any amount
- The STK push goes to Safaricom's simulator, not a real phone

**Sandbox test page:** https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate

---

## 4. 🗄️ DATABASE — PostgreSQL on Neon (free tier)

**Steps:**
1. Go to: https://neon.tech
2. Sign up (free, no credit card)
3. Click **Create Project**
4. Project name: `bekenya`
5. Region: **EU Central** (closest to Kenya)
6. Click **Create Project**
7. Copy the connection string that looks like:
   ```
   postgresql://user:password@ep-xxx.eu-central-1.aws.neon.tech/bekenya
   ```

**Add to Vercel:**
```
DATABASE_URL = postgresql://...
```

**Then run migrations (in your terminal):**
```bash
cd C:\GIT\dev\.claude\worktrees\keen-jemison
npm install
npx prisma db push
```
This creates all the tables from prisma/schema.prisma.

---

## 5. 🔐 GOOGLE OAUTH — Sign in with Google

**Steps:**
1. Go to: https://console.cloud.google.com
2. Create a new project: **Bekenya**
3. Go to **APIs & Services → OAuth consent screen**
4. Choose **External** → Fill in:
   - App name: `Bekenya`
   - User support email: your email
   - Developer contact: your email
5. Go to **Credentials → Create Credentials → OAuth Client ID**
6. Application type: **Web application**
7. Authorized redirect URIs — add ALL of these:
   ```
   http://localhost:3000/api/auth/callback/google
   https://your-vercel-url.vercel.app/api/auth/callback/google
   https://bekenya.com/api/auth/callback/google
   ```
8. Copy `Client ID` and `Client Secret`

**Add to Vercel:**
```
GOOGLE_CLIENT_ID = (paste here)
GOOGLE_CLIENT_SECRET = (paste here)
```

---

## 6. 💳 STRIPE — Card Payments (USA, UK, EU)

**Steps:**
1. Go to: https://stripe.com → Sign up
2. Go to **Developers → API Keys**
3. Copy **Publishable key** (starts with `pk_test_`)
4. Copy **Secret key** (starts with `sk_test_`)
5. Go to **Developers → Webhooks → Add endpoint**
6. URL: `https://your-vercel-url.vercel.app/api/stripe/webhook`
7. Events to listen: `payment_intent.succeeded`, `payment_intent.payment_failed`
8. Copy **Webhook signing secret** (starts with `whsec_`)

**Add to Vercel:**
```
STRIPE_SECRET_KEY = sk_test_...
STRIPE_WEBHOOK_SECRET = whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
```

**Test card numbers:**
```
Success:  4242 4242 4242 4242  (any future date, any CVC)
Decline:  4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## 7. 🌍 DOMAIN — bekenya.com

**Buy the domain:**
1. Check availability: https://www.namecheap.com/domains/registration/results/?domain=bekenya.com
2. Or try: https://domains.google.com
3. Buy it (usually ~$10–15/year)

**Point to Vercel:**
1. In Vercel → your project → **Settings → Domains**
2. Add `bekenya.com` and `www.bekenya.com`
3. Vercel shows you DNS records to add
4. Go to your domain registrar's DNS settings
5. Add the records Vercel shows you
6. Wait 10–30 min for propagation

---

## 8. 📧 EMAIL — Resend (free tier: 3,000 emails/month)

**Steps:**
1. Go to: https://resend.com → Sign up
2. Go to **API Keys → Create API Key**
3. Name: `Bekenya`
4. Copy the key (starts with `re_`)
5. Go to **Domains → Add Domain** → add `bekenya.com`
6. Follow DNS setup instructions

**Add to Vercel:**
```
RESEND_API_KEY = re_...
```

---

## 9. 📲 SMS/WHATSAPP — Africa's Talking (Kenya SMS)

**Steps:**
1. Go to: https://africastalking.com → Sign up
2. Go to **API Key → Generate**
3. Copy your API key
4. For sandbox testing, username is `sandbox`

**Add to Vercel:**
```
AFRICASTALKING_API_KEY = (paste here)
AFRICASTALKING_USERNAME = sandbox
```

**Fund account for production:** Top up with real money to send real SMS/USSD in Kenya.

---

## 10. 🚀 M-PESA PRODUCTION — Real Money

> ⏱️ This takes 2–4 weeks. Start early.

**Requirements:**
- Kenyan registered business
- Safaricom M-Pesa Till or Paybill number
- Business bank account in Kenya
- KRA PIN certificate
- Certificate of incorporation

**Steps:**
1. Register at: https://developer.safaricom.co.ke/docs#going-live
2. Submit business documents
3. Safaricom reviews (1–2 weeks)
4. Get production credentials
5. Update env vars:
   ```
   MPESA_ENVIRONMENT = production
   MPESA_CONSUMER_KEY = (production key)
   MPESA_CONSUMER_SECRET = (production secret)
   MPESA_BUSINESS_SHORT_CODE = (your real paybill/till)
   MPESA_PASSKEY = (production passkey from Safaricom)
   ```

---

## 11. 📊 ANALYTICS — Know Your Users

**Google Analytics (free):**
1. Go to: https://analytics.google.com
2. Create account → Create property → Web
3. URL: `bekenya.com`
4. Copy `Measurement ID` (starts with `G-`)
5. Add to Vercel: `NEXT_PUBLIC_GA_ID = G-XXXXXXXXXX`

---

## 🔄 THE DAILY WORKFLOW (Once Set Up)

```
YOU                          CLAUDE
─────────────────────────────────────
Morning: Run bekenya-loop ──→ Builds features autonomously
         (Scheduled panel)

Check progress: /bekenya-status ──→ Shows what was built

Review output in:
C:\GIT\dev\.claude\worktrees\keen-jemison
  └── PROGRESS.md         (what's done)
  └── QA_REPORT.md        (bugs found/fixed)
  └── NEXT_SESSION.md     (what to do next)

Like what you see?
→ git push origin claude/keen-jemison  ──→ Goes live on Vercel preview

Want to try it?
→ Open the Vercel preview URL

Found a bug?
→ Run bekenya-qa  ──→ Finds and fixes it

Ready for production?
→ Merge the PR on GitHub  ──→ Goes live on bekenya.com
```

---

## 🧪 TEST LINKS (fill in after Vercel deploy)

```
Local dev:         http://localhost:3000
Vercel preview:    https://dev-git-claude-keen-jemison-XXX.vercel.app
Production:        https://bekenya.com (after domain setup)

M-Pesa sandbox:    https://developer.safaricom.co.ke/APIs/MpesaExpressSimulate
Stripe test:       https://dashboard.stripe.com/test/payments
Neon DB:           https://console.neon.tech
Vercel dashboard:  https://vercel.com/dashboard
```

---

## 📋 QUICK CHECKLIST

Copy this and tick off as you go:

```
MUST DO (for anything to work):
[ ] Fix GitHub push access (step 1)
[ ] Deploy to Vercel (step 2)
[ ] Set up Neon database (step 4)
[ ] Run: npx prisma db push

SHOULD DO (for full functionality):
[ ] M-Pesa sandbox credentials (step 3)
[ ] Google OAuth (step 5)
[ ] Stripe test keys (step 6)
[ ] Resend email (step 8)

NICE TO HAVE:
[ ] Buy bekenya.com domain (step 7)
[ ] Africa's Talking SMS (step 9)
[ ] Google Analytics (step 11)

LONG TERM:
[ ] M-Pesa production approval (step 10) — start NOW, takes weeks
[ ] Register Kenyan business entity
```

---

## 🆘 HELP & CONTACTS

| Service | Support |
|---------|---------|
| M-Pesa Daraja | developer.safaricom.co.ke/support |
| Vercel | vercel.com/support |
| Neon | neon.tech/docs |
| Stripe | support.stripe.com |
| Africa's Talking | africastalking.com/support |

**GitHub repo:** https://github.com/services4xor-cloud/dev
**Branch:** `claude/keen-jemison`
**Worktree:** `C:\GIT\dev\.claude\worktrees\keen-jemison`

---

*Last updated by Claude. Claude builds the code. You provide the credentials. Together we make Bekenya the world's best international job platform.* 🌍
