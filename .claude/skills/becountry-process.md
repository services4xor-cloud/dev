# Be[Country] Master Process Orchestrator

> **The skill that tells you which skills to use.** This is the entry point for all Be[Country] platform work.

## When to Use

Invoke this skill when starting ANY work session on the Be[X] platform, or when unsure which skill to use for a task.

## SYNC RULE (Non-negotiable)

**After EVERY change — code, docs, or skills — run `becountry-sync`.**
Code changes → docs update. Docs change → code follows. Skills change → both align.
This is what makes the system self-learning and self-maintaining.

## Process Map

```
USER REQUEST
    │
    ├── "What's the status?"
    │     └── /becountry-status
    │
    ├── "Plan a sprint / what's next?"
    │     └── /becountry-sprint
    │         Reads: PROGRESS.md, ROADMAP.md, PRD.md
    │
    ├── "Build a feature"
    │     ├── 1. /becountry-architecture  (design check)
    │     ├── 2. /becountry-ux-workflow   (user flow design)
    │     ├── 3. /becountry-implement     (build it — real DB, tests, sync)
    │     ├── 4. /becountry-ui-review     (visual/interaction check)
    │     ├── 5. /becountry-testing       (automated tests)
    │     ├── 6. /becountry-e2e-test      (full flow test)
    │     ├── 7. /becountry-sync          (code ↔ docs ↔ skills)
    │     └── 8. /becountry-push          (commit + deploy)
    │
    ├── "Review the product"
    │     ├── /becountry-design-review    (brand + design system)
    │     ├── /becountry-business-review  (revenue + growth)
    │     └── /becountry-big-picture      (strategic alignment)
    │
    ├── "Security audit"
    │     └── /becountry-security
    │         Reads: ARCHITECTURE.md
    │
    ├── "Deploy to new country"
    │     └── /becountry-country-deploy
    │         Reads: ARCHITECTURE.md, lib/countries.ts
    │
    ├── "Check requirements"
    │     └── /becountry-requirements
    │         Reads: REQUIREMENTS.md, PRD.md
    │
    ├── "Data / DB work"
    │     └── /becountry-data
    │         Reads: ARCHITECTURE.md, prisma/schema.prisma
    │
    ├── "Deployment / ops"
    │     ├── /becountry-deployment       (deploy pipeline)
    │     └── /becountry-ops              (monitoring + health)
    │
    ├── "What needs human action?"
    │     └── /becountry-human-tasks
    │         Reads: HUMAN_MANUAL.md
    │
    ├── "Sync everything"
    │     └── /becountry-sync
    │         Ensures code ↔ docs ↔ skills are aligned
    │
    └── "Full process review"
          Run ALL skills in sequence:
          1. /becountry-status
          2. /becountry-sync
          3. /becountry-security
          4. /becountry-architecture
          5. /becountry-design-review
          6. /becountry-ui-review
          7. /becountry-ux-workflow
          8. /becountry-testing
          9. /becountry-business-review
         10. /becountry-big-picture
         11. /becountry-requirements
         12. /becountry-data
         13. /becountry-ops
```

## Skill ↔ Documentation Map

| Skill                       | Primary .MD Files                     | Purpose                          |
| --------------------------- | ------------------------------------- | -------------------------------- |
| `becountry-status`          | PROGRESS.md                           | Current state of platform        |
| `becountry-sprint`          | ROADMAP.md, PRD.md, PROGRESS.md       | Sprint planning + prioritization |
| `becountry-architecture`    | ARCHITECTURE.md                       | Technical structure validation   |
| `becountry-design-review`   | DESIGN_SYSTEM.md                      | Brand + visual consistency       |
| `becountry-ui-review`       | DESIGN_SYSTEM.md, PRD.md              | UI functionality + interaction   |
| `becountry-ux-workflow`     | PRD.md, REQUIREMENTS.md               | User flow + journey mapping      |
| `becountry-testing`         | TESTING.md                            | Test strategy + coverage         |
| `becountry-e2e-test`        | TESTING.md, PRD.md                    | End-to-end scenario testing      |
| `becountry-security`        | ARCHITECTURE.md                       | Security audit + hardening       |
| `becountry-business-review` | ROADMAP.md, PRD.md                    | Revenue + growth metrics         |
| `becountry-big-picture`     | ROADMAP.md, PRD.md                    | Strategic vision alignment       |
| `becountry-requirements`    | REQUIREMENTS.md, PRD.md               | Requirements traceability        |
| `becountry-data`            | ARCHITECTURE.md, prisma/schema.prisma | Data model + integrity           |
| `becountry-implement`       | All code files                        | Build features with real DB      |
| `becountry-ops`             | OPERATIONS.md                         | Monitoring + incident response   |
| `becountry-deployment`      | ARCHITECTURE.md, HUMAN_MANUAL.md      | Deploy pipeline + environments   |
| `becountry-country-deploy`  | ARCHITECTURE.md, lib/countries.ts     | Multi-country rollout            |
| `becountry-human-tasks`     | HUMAN_MANUAL.md                       | Tasks requiring human action     |
| `becountry-sync`            | All .MD + all skills                  | Bidirectional code↔docs↔skills   |
| `becountry-push`            | —                                     | Git commit + Vercel deploy       |

## Multi-Country Awareness

All skills operate in Be[Country] mode:

- Read `NEXT_PUBLIC_COUNTRY_CODE` to determine active country
- Use `lib/countries.ts` for country-specific config
- Use `lib/country-selector.ts` for language/locale
- Brand name computed from country code (KE→BeKenya, DE→BeGermany, GB→BeUK)
- Agent language follows country's primary language

## Workflow Patterns

### Feature Development Workflow

```
/becountry-sprint → pick task
/becountry-architecture → validate approach
/becountry-ux-workflow → design user flow
  → implement feature
/becountry-ui-review → check visuals
/becountry-testing → write + run tests
/becountry-e2e-test → full scenario test
/becountry-design-review → brand compliance
/becountry-push → deploy
```

### Release Readiness Workflow

```
/becountry-testing → all tests pass?
/becountry-security → no vulnerabilities?
/becountry-design-review → brand compliant?
/becountry-business-review → metrics healthy?
/becountry-requirements → all PRD items met?
/becountry-deployment → deploy pipeline ready?
/becountry-push → ship it
```

### Strategic Review Workflow

```
/becountry-status → where are we?
/becountry-big-picture → aligned with vision?
/becountry-business-review → revenue on track?
/becountry-requirements → gaps in coverage?
/becountry-sprint → plan next iteration
```
