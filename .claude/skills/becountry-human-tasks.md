---
name: becountry-human-tasks
description: Track tasks only humans can do — credential setup, OAuth apps, payment provider registration, domain DNS, Vercel config.
---

# Be[Country] Human Tasks

## When to Use

Run when hitting a blocker that requires human action, or to review all pending human tasks.

## Process

### 1. Read Current Blockers

- Read `HUMAN_MANUAL.md` for documented human-only steps
- Read `ASK.md` for pending owner questions
- Read `ROADMAP-LIVE.md` for items marked ⛔ Blocked

### 2. Credential Inventory

Check `.env.local` and `.env.example` for all required credentials:

| Credential            | Status           | Human Action Needed                     |
| --------------------- | ---------------- | --------------------------------------- |
| DATABASE_URL          | Check .env.local | Create Neon project if missing          |
| NEXTAUTH_SECRET       | Check .env.local | Generate with `openssl rand -base64 32` |
| GOOGLE_CLIENT_ID      | Check .env.local | Create OAuth app in Google Console      |
| GOOGLE_CLIENT_SECRET  | Check .env.local | Same as above                           |
| RESEND_API_KEY        | Check .env.local | Create Resend account + verify domain   |
| MPESA_CONSUMER_KEY    | Check .env.local | Register on Safaricom Daraja portal     |
| MPESA_CONSUMER_SECRET | Check .env.local | Same as above                           |
| STRIPE_SECRET_KEY     | Check .env.local | Create Stripe account                   |

### 3. Per-Country Human Tasks

For each Be[Country] deployment, humans must:

1. **Google OAuth**: Create a new OAuth 2.0 app per domain
   - Add authorized redirect: `https://be[country].com/api/auth/callback/google`
   - Add authorized origin: `https://be[country].com`
2. **Vercel**: Create project, link to repo, set env vars
3. **Domain**: Purchase `be[country].com`, point DNS to Vercel
4. **Payment**: Register with local payment provider
5. **Email**: Verify sending domain in Resend (`be[country].com`)

### 4. Write to ASK.md

If new human tasks are discovered, append to `ASK.md`:

```
### [Date] — [Topic]
**Context:** [what was being built]
**Question:** [what the human needs to do]
**Urgency:** [blocking | nice-to-have]
```

## Output Format

```
## 👤 Human Tasks — Be[Country]

### Blocking Tasks (must do before launch)
1. [task — instructions — who]

### Nice-to-Have (can launch without)
1. [task — benefit]

### Credential Status
| Credential | Set? | Blocks |
|-----------|------|--------|

### Pending Owner Questions (ASK.md)
1. [question — context]
```
