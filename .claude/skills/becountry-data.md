# Be[Country] Data Management

> Manages database schema, data integrity, migrations, seeding, and data architecture.

## When to Use

- Before/after modifying `prisma/schema.prisma`
- When adding new data models or relationships
- When debugging data issues
- When reviewing data integrity
- When seeding or resetting the database

## Process

### 1. Schema Review

Read `prisma/schema.prisma` and `ARCHITECTURE.md`:

#### Current Models (see `prisma/schema.prisma`)

```
User, Account, Session, VerificationToken, Profile
Path, Chapter, Experience, SavedPath, Payment, Referral
Thread, ThreadMembership, AgentProfile, Forward, SocialPost
Conversation, Message, Friendship, XPEvent
```

#### Check Schema Quality

- [ ] All models have `id` (cuid), `createdAt`, `updatedAt`
- [ ] Relations use proper `@relation` with `onDelete` cascade rules
- [ ] Indexes on frequently queried fields (`@@index`)
- [ ] Unique constraints where needed (`@@unique`)
- [ ] Enums for fixed value sets (PathStatus, ExperienceType, etc.)
- [ ] No unused models or orphaned fields

### 2. Data Integrity Rules

#### User Data

- Email must be unique across all users
- `passwordHash` required for credential auth, null for OAuth
- Profile is 1:1 with User (optional until onboarding)

#### Path Data

- Path belongs to an Anchor (User with role ANCHOR)
- Path must have country code matching deployment
- Salary fields use integer cents (no floating point currency)

#### Chapter Data (Applications)

- Chapter links Pioneer to Path (many-to-many via Chapter)
- Status enum: DRAFT, SUBMITTED, REVIEWING, ACCEPTED, REJECTED
- Cannot have duplicate Chapter for same Pioneer+Path

#### Payment Data

- Amount stored as integer (cents/smallest unit)
- Currency from country config (`lib/countries.ts`)
- Provider: MPESA (KE), STRIPE (INT), FLUTTERWAVE (NG)

### 3. Mock Data Layer

Current: `data/mock/` with 15 modules + barrel export `index.ts`

Mock modules:

```
anchors.ts, chapters.ts, experiences.ts,
messages.ts, notifications.ts, paths.ts,
payments.ts, pioneers.ts, profiles.ts,
referrals.ts, reviews.ts, safari.ts,
savedPaths.ts, stats.ts, threads.ts
```

Rule: Pages import from `data/mock/` until real DB is connected. Service layer (`services/types.ts`) defines interfaces for swap.

### 4. Migration Workflow

```bash
# After schema changes:
npx prisma format              # Format schema file
npx prisma validate            # Validate schema
npx prisma db push             # Push to Neon (dev)
npx prisma generate            # Regenerate client
npx prisma migrate dev --name "description"  # Create migration (production)
```

### 5. Seed Data

`prisma/seed.ts` creates realistic test data:

- 11 Anchors with company profiles
- 22 Paths across sectors (Tech, Healthcare, Education, Agriculture)
- 8 Pioneers with completed profiles
- 53 Threads with messages
- 6 Experiences (safari packages)

Run seed: `npx prisma db seed`

### 6. Multi-Country Data Architecture

Data must support Be[Country] → Be[Tribe] → Be[Location]:

```
User
  └── countryCode: "KE" | "DE" | "NG" | ...
  └── Profile
        └── tribeId?: string    (future: Be[Tribe])
        └── locationId?: string (future: Be[Location])

Path
  └── countryCode: "KE"
  └── corridor?: "KE→DE" | "KE→GB" (Route)

Experience
  └── countryCode: "KE"
  └── location: "Nairobi" | "Mombasa"
```

### 7. Output Format

```markdown
## Data Review

### Schema Health

- Models: [count] | Relations: [count] | Indexes: [count]
- Issues: [list any problems]

### Data Integrity

- [ ] All foreign keys valid
- [ ] No orphaned records
- [ ] Enum values consistent
- [ ] Timestamps populated

### Recommendations

1. [Schema change needed]
2. [Index to add]
3. [Data cleanup needed]
```

### 8. Sensitive Data Rules

- **NEVER** log or expose: passwords, tokens, payment details
- **ALWAYS** hash: passwords (bcrypt), reset tokens (SHA-256)
- **ALWAYS** use parameterized queries (Prisma handles this)
- **NEVER** store raw credit card numbers (use payment provider tokens)
