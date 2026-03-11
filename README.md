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

- [x] 20+ pages — all dark theme, brand consistent
- [x] M-Pesa Daraja API v2 (STK Push + webhooks)
- [x] Smart compass with country-to-country routing (16 countries, 14 languages)
- [x] Real safari packages (Victoria Paradise, Tsavo, Maasai Mara)
- [x] UTAMADUNI CBO integration (% of every booking)
- [x] 12-country config system for expansion
- [x] Centralized type system + mock data layer
- [x] 25 Jest + 89 Playwright tests passing

---

## Tech Stack

| Layer      | Technology                                |
| ---------- | ----------------------------------------- |
| Framework  | Next.js 14 App Router (TypeScript)        |
| Styling    | Tailwind CSS + golden ratio design system |
| Database   | PostgreSQL (Neon) via Prisma              |
| Auth       | NextAuth.js v4                            |
| Payments   | M-Pesa Daraja v2, Stripe                  |
| Email      | Resend                                    |
| Testing    | Jest 30 + Playwright 1.58                 |
| Formatting | Prettier + ESLint + Husky                 |
| Deploy     | Vercel (auto-deploy on push)              |

---

## Getting Started

```bash
npm install
cp .env.example .env.local    # Fill in required values
npx prisma generate
npm run dev                   # http://localhost:3000
```

---

## Project Structure

```
app/          # Next.js pages (compass, ventures, pioneers, anchors, ...)
types/        # Domain types + API contracts
services/     # Service interfaces (mock → DB swap)
data/mock/    # Centralized mock data (14 modules)
lib/          # Core platform libraries
components/   # Shared UI components
prisma/       # Database schema + seed
__tests__/    # Jest test suite (25/25)
tests/visual/ # Playwright visual tests (89/89)
public/       # Static assets (logos, OG images)
```

---

## Documentation

| Doc                | Purpose                             |
| ------------------ | ----------------------------------- |
| `CLAUDE.md`        | AI operating manual (read first)    |
| `PROGRESS.md`      | Live build tracker                  |
| `PRD.md`           | Product requirements                |
| `ROADMAP.md`       | Strategic phases + sprints          |
| `DESIGN_SYSTEM.md` | Brand tokens + component patterns   |
| `ARCHITECTURE.md`  | Technical + conceptual architecture |
| `REQUIREMENTS.md`  | User requirements + decisions log   |
| `TESTING.md`       | Test strategy + CI integration      |
| `HUMAN_MANUAL.md`  | Setup guide for humans              |

---

## BeNetwork Vocabulary

| Platform Term | Meaning                                     |
| ------------- | ------------------------------------------- |
| Pioneer       | Person exploring paths across countries     |
| Anchor        | Organization offering paths and experiences |
| Path          | Work or business opportunity                |
| Chapter       | A Pioneer's engagement with a Path          |
| Venture       | An experience (safari, cultural, trade)     |
| Compass       | Smart routing system                        |

---

## Mission

Connect every country. Compensate history through trade. Build dignity everywhere.

---

## License

Private — BeKenya Family Ltd / UTAMADUNI CBO
