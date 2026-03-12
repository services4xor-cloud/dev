# ASK.md — Agent Questions for Owner

> Questions the agent needs answered. Owner reviews async.
> Updated: Session 58 (2026-03-12)
> **Status: ALL QUESTIONS RESOLVED**

---

## Resolved Decisions (Summary)

All previous decisions (D1–D10) have been resolved and implemented. Key outcomes:

- **D1:** Tribes are top-level (not nested under countries). URL: `/be/[slug]`
- **D2:** Dynamic SVG logos per identity
- **D3:** Mock data for KE tribes + locations created
- **D4:** Hybrid AI + Human agents
- **D6:** Revenue Model C — both Pioneer + Anchor pay platform fee (Airbnb model)
- **D7:** i18n priority: English → Swahili → German → Thai
- **D9:** UTAMADUNI CBO as social impact arm

## Infrastructure Status

- ✅ Database: Neon PostgreSQL live, 15 tables synced
- ✅ Auth: NextAuth with PrismaAdapter (Google OAuth + email/password)
- ✅ Env vars: All on Vercel
- ⏳ Google OAuth redirect URI: needs production callback added in Google Console
- 🔜 M-Pesa sandbox + Stripe test keys: when ready for payments

---

_(New questions go below this line.)_
