# Be[Country] — Life Routing Platform

> Identity-first compass for Pioneers who want to move, build, and belong.

**Not a job board. Not a travel site. A Compass.**

Be[Country] connects people with real possibilities — work, business, experiences, community. Starting with **BeKenya**. Scaling to Be[Tribe] and Be[Location].

---

## Vision

Colonial economics moved resources one way. Be[Country] moves them every way.

Pioneers from anywhere can discover, connect, and build their path. Direct connections. Fair compensation. Community impact built-in.

---

## Live: BeKenya

- 20+ pages — dark theme, brand consistent
- M-Pesa Daraja v2 (STK Push + webhooks)
- Smart compass (16 countries, 14 languages, Haversine routing)
- Safari packages (Victoria, Tsavo, Mara)
- UTAMADUNI CBO integration (% of every booking)
- 12-country config for expansion
- 25 Jest + 102 Playwright tests

---

## Tech Stack

| Layer     | Technology                         |
| --------- | ---------------------------------- |
| Framework | Next.js 14 App Router (TypeScript) |
| Styling   | Tailwind CSS + φ design system     |
| Database  | PostgreSQL (Neon) via Prisma       |
| Auth      | NextAuth.js v4                     |
| Payments  | M-Pesa Daraja v2 · Stripe          |
| Testing   | Jest 30 · Playwright 1.58          |
| Deploy    | Vercel (auto on push)              |

---

## Quick Start

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev  # http://localhost:3000
```

---

## Structure

```
app/          # Pages (compass, ventures, pioneers, anchors, ...)
lib/          # Core libraries (vocabulary, countries, compass, matching)
types/        # Domain types + API contracts
data/mock/    # 15 mock modules
components/   # Shared UI
__tests__/    # Jest (25/25)
tests/visual/ # Playwright (102/102)
```

---

## Docs

| Doc                | Purpose                    |
| ------------------ | -------------------------- |
| `CLAUDE.md`        | Agent operating manual     |
| `PROGRESS.md`      | Live build tracker         |
| `PRD.md`           | Product requirements       |
| `ROADMAP.md`       | Strategic phases           |
| `DESIGN_SYSTEM.md` | Brand + component patterns |
| `ARCHITECTURE.md`  | Technical architecture     |
| `REQUIREMENTS.md`  | User requirements + rules  |
| `TESTING.md`       | Test strategy              |
| `HUMAN_MANUAL.md`  | Human-only setup steps     |
| `OPERATIONS.md`    | Agent decision tree        |
| `ASK.md`           | Agent questions for owner  |

---

## Vocabulary

| Term    | Meaning                                 |
| ------- | --------------------------------------- |
| Pioneer | Person exploring paths across countries |
| Anchor  | Organization offering paths             |
| Path    | Work or business opportunity            |
| Chapter | Pioneer's engagement with a Path        |
| Venture | Experience or placement                 |
| Compass | Smart routing system                    |

---

## License

Private — BeKenya Family Ltd / UTAMADUNI CBO
