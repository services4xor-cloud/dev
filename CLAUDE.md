# Be[Country] Platform — CLAUDE.md
> Agentic operating manual. Every Claude session reads this first.
> Branch: `main` | Repo: `services4xor-cloud/dev`

---

## 1. What Is This?

**Be[Country]** is an identity-first life-routing platform for people who want to experience possibilities across countries — work, business, trade, and community.

**The deeper mission**: Reverse colonial economic flows through open trade, fair compensation, and direct country-to-country connections. No intermediaries. No gatekeepers.

Current live deployment: **BeKenya** (Kenya-first)
Architecture: One codebase → many countries via `NEXT_PUBLIC_COUNTRY_CODE`

Key docs:
- `PRD.md` — what to build and why
- `ARCHITECTURE.md` — how it's structured and why
- `PROGRESS.md` — live execution tracker (UPDATE THIS as you build)
- `HUMAN_MANUAL.md` — things only humans can do (DB, OAuth, etc.)

---

## 2. Autonomous Operation Rules

The owner has granted **full autonomous operation** for this project.

### ALWAYS do without asking:
- Create, edit, delete any file in this repo
- Run `npm`, `git`, `prisma`, `next`, `jest` commands
- Commit and push to `main` after every meaningful change
- Create PRs, trigger Vercel deploys, update env vars via API
- Update `PROGRESS.md` after completing every feature

### NEVER do without explicit human instruction:
- Real financial transactions (live M-Pesa charges)
- Expose credentials in committed code
- Delete the GitHub repository
- Modify DNS / domain registrar settings

---

## 3. Tech Stack

| Layer | Tech | Notes |
|-------|------|-------|
| Framework | Next.js 14 App Router | TypeScript, all pages |
| Styling | Tailwind CSS | Maroon + gold brand |
| ORM | Prisma + PostgreSQL | Neon hosted |
| Auth | NextAuth.js v4 | Google + email/password |
| Payments KE | M-Pesa Daraja API v2 | Sandbox ready |
| Payments INT | Stripe | Test keys ready |
| Email | Resend | Branded HTML templates |
| Testing | Jest + Testing Library | CI enforced |
| CI/CD | GitHub Actions → Vercel | Auto on push to main |

### Critical build rules (memorize these):
1. **`'use client'` at line 1** for every file with `onClick`, `useState`, `useEffect`
2. **`prisma generate`** runs before `next build` (already in package.json)
3. **`autoprefixer`** stays in `devDependencies` — it's in postcss.config.js
4. **Mock data** in pages until `DATABASE_URL` env var is set
5. **Push after every commit** — Vercel auto-deploys from main

---

## 4. Vocabulary — Use These Always

| BeNetwork Term | Meaning | Never Say |
|---|---|---|
| **Pioneer** | Person seeking paths | user, job seeker, candidate |
| **Anchor** | Org offering paths | employer, company, recruiter |
| **Path** | An opportunity | job, vacancy, listing |
| **Chapter** | An engagement/application | application, submission |
| **Venture** | Experience + professional path | tour, booking, gig |
| **Compass** | Smart routing system | search, finder, filter |
| **BeNetwork** | The platform | the app, the platform |
| **Gate** | Country entry point | country page |
| **Route** | Country-to-country corridor | migration path |

---

## 5. Repository Map

```
app/
├── page.tsx                  # Homepage (identity-first compass landing)
├── compass/                  # 4-step route wizard
├── ventures/                 # Unified feed (paths + experiences)
├── experiences/[id]/         # Safari/experience detail + booking
├── pioneers/dashboard/       # Pioneer hub (chapters, saved, compass)
├── pioneers/notifications/   # Notification center
├── anchors/dashboard/        # Anchor hub (paths, chapters, analytics)
├── anchors/post-path/        # Path creation wizard
├── onboarding/               # 5-step Pioneer identity capture
├── be/[country]/             # Country landing gates (/be/ke, /be/de, ...)
├── charity/                  # UTAMADUNI CBO
├── business/                 # BeKenya Family Ltd
├── admin/                    # Admin panel
└── api/                      # All API routes

lib/
├── vocabulary.ts             # BeNetwork terms (single source of truth)
├── countries.ts              # 12-country config registry
├── compass.ts                # Route corridors
├── matching.ts               # 4-dimension scoring engine
├── safari-packages.ts        # Kenya experience data
├── social-media.ts           # 9-platform automation
├── whatsapp-templates.ts     # Templates (en/sw/de)
├── email.ts                  # Resend email system
├── mpesa.ts                  # M-Pesa Daraja v2
└── db.ts                     # Prisma singleton

prisma/schema.prisma          # DB schema
components/                   # Shared UI (Nav, Footer, Cards, Modals)
__tests__/                    # Jest tests
public/                       # Logos, OG images
```

---

## 6. Country Architecture

```typescript
// lib/countries.ts — single config per country
export const COUNTRIES = {
  KE: { name: 'Kenya', currency: 'KES', payment: 'mpesa', color: '#5C0A14' },
  DE: { name: 'Germany', currency: 'EUR', payment: 'stripe', color: '#000000' },
  // Add new countries here
}
```

`NEXT_PUBLIC_COUNTRY_CODE=KE` → BeKenya
`NEXT_PUBLIC_COUNTRY_CODE=DE` → BeGermany
Same codebase, different Vercel projects.

---

## 7. Commands

```bash
npm run dev          # Dev server → localhost:3000
npm run build        # Production build (includes prisma generate)
npm run lint         # ESLint
npm run test         # Jest
npm run test:coverage # Coverage report

npx prisma generate  # Regenerate client
npx prisma db push   # Sync schema to DB
npx prisma studio    # Visual DB browser

git add -A && git commit -m "feat: ..." && git push
```

---

## 8. Deployment

- Push to `main` → Vercel auto-deploys (no manual steps needed)
- Vercel project: `https://vercel.com/tobias-projects-81752e2c/dev`
- GitHub repo: `services4xor-cloud/dev`
- Preview URL (main): auto-generated on each deploy

---

## 9. BeKenya Brand

- **Maroon** `#5C0A14` — primary (Kenya flag red, strength)
- **Gold** `#C9A227` — accent (prosperity, sun)
- **Logo**: `public/logo-bekenya.svg` (Lion)
- **Fonts**: Inter (body) + Plus Jakarta Sans (headings)

Do NOT use orange/teal/green from old job board design.

---

## 10. Agentic Workflow

Every session should:
1. Read `PROGRESS.md` → understand state
2. Read `PRD.md` → understand what's next
3. Build the next item in phase order
4. Update `PROGRESS.md` after each feature
5. Commit and push

Common errors:
- Hydration error → add `'use client'` at top of file
- Prisma client error → run `npx prisma generate`
- Build blocked → check HUMAN_MANUAL.md (likely needs env var)
- Module not found → check tsconfig.json @/* paths
