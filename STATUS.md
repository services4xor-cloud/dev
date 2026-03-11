# Be[Country] — Live Status Dashboard

> Single source of truth for project health. Updated every session.
> Last updated: Session 32 (2026-03-11)

---

## Health Check

| Metric         | Value                               |
| -------------- | ----------------------------------- |
| **Build**      | ✅ Passes                           |
| **TypeScript** | ✅ 0 errors                         |
| **Jest**       | ✅ 160/160                          |
| **Playwright** | ✅ 102/102                          |
| **Deploy**     | ✅ Vercel auto on push              |
| **DB**         | ✅ Neon PostgreSQL connected        |
| **Auth**       | ✅ NextAuth + Google OAuth + bcrypt |

---

## Inventory

| Category         | Count | Details                                           |
| ---------------- | ----- | ------------------------------------------------- |
| Pages            | 35    | incl. dynamic routes ([id], [slug], [country])    |
| API routes       | 12    | paths, chapters, threads, auth, compass, search…  |
| Components       | 10    | Nav, Footer, PathCard, WizardShell, Skeleton…     |
| Library modules  | 21    | auth, countries, matching, compass, hooks…        |
| Service layer    | 6     | paths, threads, chapters, db, types, index        |
| Mock data        | 17    | 15 domain modules + config + threads              |
| Prisma models    | 12    | User, Profile, Path, Chapter, Thread, Experience… |
| Countries config | 13    | +CH added (16 in selector)                        |
| Languages        | 14    | Swahili, German, French, English…                 |

---

## DB State (Neon)

| Entity      | Count | Countries                                                         |
| ----------- | ----- | ----------------------------------------------------------------- |
| Anchors     | 9     | KE×3, DE×3, CH×3                                                  |
| Paths       | 18    | KE×6, DE×6, CH×6                                                  |
| Pioneers    | 6     | KE×2, DE×2, CH×2                                                  |
| Threads     | 22    | 5 country, 3 tribe, 2 language, 6 interest, 2 science, 4 location |
| Experiences | 6     | KE only (eco-tourism)                                             |

---

## Credentials

| Credential                | Status                    |
| ------------------------- | ------------------------- |
| DATABASE_URL (Neon)       | ✅ Local + Vercel         |
| NEXTAUTH_SECRET           | ✅ Local + Vercel         |
| GOOGLE_CLIENT_ID/SECRET   | ✅ Local + Vercel         |
| RESEND_API_KEY            | ✅ Local + Vercel         |
| NEXTAUTH_URL              | ⚠️ Vercel still localhost |
| MPESA_CONSUMER_KEY/SECRET | ⛔ Not configured         |

---

## Recent Commits

```
881db60 Wire auth: login + signup + registration API
370dd21 feat: wire login page to NextAuth signIn (Google + credentials)
86c642e feat: wire UI to DB API — ventures, threads, Nav identity switcher
f0060f4 docs: add STATUS.md health dashboard, update PROGRESS + ROADMAP
6eeba89 feat: DB migration — schema, auth, seed, service layer for KE/DE/CH
```

---

## Phase Progress

| Phase | Name         | Status  | Notes                                                               |
| ----- | ------------ | ------- | ------------------------------------------------------------------- |
| 1     | Foundation   | ✅ 100% | All pages, mock data, tests, CI/CD                                  |
| 2     | BeKenya Live | 🔧 ~80% | DB + auth + seed + API + login/signup wired. Identity switcher next |
| 3     | Traction     | ⏳ 0%   | Notifications, messaging, reviews                                   |
| 4     | Expansion    | ⏳ 0%   | BeGermany, BeNigeria live deployments                               |
| 5     | Platform     | ⏳ 0%   | Mobile, AI compass, Be[Tribe]                                       |

---

## Active Priorities

1. ~~Test locally~~ ✅ — DB features, API endpoints, auth verified
2. ~~Wire Nav to DB~~ ✅ — identity switcher + pages fetch from API
3. ~~Auth wiring~~ ✅ — Login/Signup wired to NextAuth + registration API
4. **Identity switcher → page data** — selecting a thread/country filters page content
5. **User preferences flow** — post-login preference selection → personalized feed
6. **Fix NEXTAUTH_URL** — set to production URL on Vercel
7. **Social auto-posting** — WhatsApp/TikTok/Insta/FB for Anchors (Phase 3)

---

## Blockers (Human Action Required)

- [ ] Set `NEXTAUTH_URL=https://dev-plum-rho.vercel.app` on Vercel
- [ ] Configure M-Pesa sandbox credentials (when ready for KE payments)

---

_Auto-generated. See PROGRESS.md for detailed session logs._
