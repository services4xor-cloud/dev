# Be[Country] — Life Routing Platform

> Identity-first compass for Pioneers who want to move, build, and belong.

**Not a job board. Not a travel site. A Compass.**

Be[Country] connects people with the real possibilities of life in another country — work, business, experiences, community. Starting with **BeKenya**.

---

## The Vision

Colonial economics moved resources one way. Be[Country] moves them every way.

Pioneers from anywhere can discover, connect, and build their path in Kenya (and soon: Germany, Nigeria, America, UAE). Direct connections. Fair compensation. Community impact built-in.

---

## Live: BeKenya

Kenya-first. Safari lodges, eco-tourism, professional paths, community impact.

- [x] 20+ pages across the full pioneer journey
- [x] M-Pesa Daraja API v2 (STK Push + webhooks)
- [x] Smart compass with country-to-country routing
- [x] Real safari packages (Victoria Paradise, Tsavo, Maasai Mara)
- [x] UTAMADUNI CBO integration (% of every booking)
- [x] 12-country config system for expansion

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router (TypeScript) |
| Styling | Tailwind CSS |
| Database | PostgreSQL (Neon) via Prisma |
| Auth | NextAuth.js v4 |
| Payments | M-Pesa Daraja v2, Stripe |
| Email | Resend |
| Deploy | Vercel |

---

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in the required values (see .env.example)

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
app/          # Next.js pages (compass, ventures, pioneers, anchors, ...)
lib/          # Core platform libraries
components/   # Shared UI components
prisma/       # Database schema + seed
__tests__/    # Jest test suite
public/       # Static assets (logos, OG images)
```

Key docs:
- `CLAUDE.md` — AI operating manual
- `PRD.md` — Product requirements
- `ARCHITECTURE.md` — Technical + conceptual architecture
- `PROGRESS.md` — Live build tracker
- `HUMAN_MANUAL.md` — Setup guide for humans

---

## BeNetwork Vocabulary

| Platform Term | Meaning |
|--------------|---------|
| Pioneer | Person exploring paths across countries |
| Anchor | Organization offering paths and experiences |
| Path | Work or business opportunity |
| Chapter | A Pioneer's engagement with a Path |
| Venture | An experience (safari, cultural, trade) |
| Compass | Smart routing system |

---

## Mission

Connect every country. Compensate history through trade. Build dignity everywhere.

---

## License

Private — BeKenya Family Ltd / UTAMADUNI CBO
