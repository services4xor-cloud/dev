# Be[Country] Skill Audit — 2026-03-14

> Test and verify every skill; recommend remove / adapt / add. Kept in sync with `.claude/skills/` and PROGRESS.md.

---

## Summary

| Action     | Count | Notes                                               |
| ---------- | ----- | --------------------------------------------------- |
| **Keep**   | 22    | All 22 skills have distinct roles; none removed.    |
| **Adapt**  | 9     | Stale refs and wording fixed (see below).           |
| **Remove** | 0     | No skill merged or deleted.                         |
| **Add**    | 0     | No new skill added; current set covers the process. |

---

## Verification (tests run)

- **Jest:** 872 tests, 46 suites ✅
- **Playwright:** 159 tests, 7 files ✅
- **Docs referenced by skills:** ROADMAP.md, ROADMAP-LIVE.md, HUMAN_MANUAL.md, OPERATIONS.md, REQUIREMENTS.md, DESIGN_SYSTEM.md, ARCHITECTURE.md, PRD.md, TESTING.md, PROGRESS.md — all exist at repo root.

---

## Remove

**None.** Each skill has a clear purpose:

- **Process:** process, sync (orchestration).
- **Planning:** sprint, requirements, big-picture.
- **Build:** architecture, data, implement.
- **Design:** design-review (brand/consistency), ui-review (components/interactions), ux-workflow (flows/journeys).
- **Quality:** testing, e2e-test, security.
- **Business:** business-review.
- **Deploy:** deployment, push, country-deploy.
- **Ops:** ops, human-tasks, status.

Design vs UI vs UX could be merged into one “design-review” skill, but keeping three allows focused invocation (brand vs components vs flows). No removal recommended.

---

## Adapted (changes made)

| Skill                       | Change                                                                                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **becountry-ui-review**     | Removed reference to deleted `StatusBadge`. Replaced “102 tests” with “all Playwright tests must pass”.                                                                                                                                                |
| **becountry-design-review** | Title “BeKenya Design Review” → “Be[Country] Design Review”.                                                                                                                                                                                           |
| **becountry-deployment**    | Pre-deploy checklist: “Jest 25/25, Playwright 102/102” → “npm test / npx playwright test (see PROGRESS.md for counts)”.                                                                                                                                |
| **becountry-testing**       | Updated test table to 872 tests, 46 suites (Jest) and 159 tests, 7 files (Playwright).                                                                                                                                                                 |
| **becountry-ux-workflow**   | Removed obsolete “Apply to Path \| app/ventures/”; kept Connect → Message and Book Experience. Flows table now exchange-centric.                                                                                                                       |
| **becountry-data**          | Model list 16 → current schema (User, Account, Session, VerificationToken, Profile, Path, Chapter, Experience, SavedPath, Payment, Referral, Thread, ThreadMembership, AgentProfile, Forward, SocialPost, Conversation, Message, Friendship, XPEvent). |
| **becountry-e2e-test**      | Title “BeKenya E2E” → “Be[Country] E2E”.                                                                                                                                                                                                               |
| **becountry-push**          | Title “BeKenya Push & Deploy” → “Be[Country] Push & Deploy”.                                                                                                                                                                                           |
| **becountry-status**        | DB health step: generic “Path, Thread, Experience” → “User, Profile, Path, Thread, AgentProfile, Experience” and pointer to schema.                                                                                                                    |

---

## Add

**None.** Current 22 skills cover:

- Entry point and sync (process, sync)
- Planning and strategy (sprint, requirements, big-picture)
- Build and data (architecture, data, implement)
- Design and UX (design-review, ui-review, ux-workflow)
- Quality (testing, e2e-test, security)
- Business and deploy (business-review, deployment, push, country-deploy)
- Ops and humans (ops, human-tasks, status)
- Cleanup (cleanup)

Optional future adds (only if needed):

- **becountry-i18n** — If translation/locale work becomes a recurring focus.
- **becountry-compass** — Dedicated Compass (4-step wizard) flow; currently covered by ux-workflow.

---

## Skill ↔ doc references (verified)

- ROADMAP-LIVE.md: referenced by becountry-sprint, becountry-big-picture, becountry-human-tasks ✅
- DESIGN_SYSTEM.md: design-review, ui-review ✅
- PRD.md, REQUIREMENTS.md: ux-workflow, requirements, business-review, big-picture ✅
- ARCHITECTURE.md: architecture, data, security, deployment, country-deploy ✅
- HUMAN_MANUAL.md: human-tasks, deployment ✅
- OPERATIONS.md: ops ✅
- TESTING.md: testing, e2e-test ✅
- PROGRESS.md: status, sync, process ✅

---

## How to re-verify

1. Run: `npm test` → expect 872 pass, 46 suites.
2. Run: `npx playwright test --list` → expect 159 tests, 7 files.
3. Confirm PROGRESS.md “Current State” matches these counts and route/API/skill counts.
4. After any code or doc change: run **becountry-sync** so skills and docs stay aligned.
