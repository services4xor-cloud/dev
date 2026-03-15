---
name: bex-security
description: Security audit — auth, API routes, env vars, OWASP checks
---

# Security Audit

## Credential Safety

- No secrets in committed code: grep for API keys, DB URLs, secrets in lib/ app/ components/
- `.env` in `.gitignore`
- No hardcoded API keys

## Auth

- All sensitive API routes check `getServerSession(authOptions)` from `@/lib/auth`
- Password hashing uses bcrypt (if email/password auth)
- CSRF protection via NextAuth

## API Routes

- Input validation with Zod (`lib/validation.ts`)
- No SQL injection (Prisma parameterized queries)
- Rate limiting on public endpoints
- Proper error responses (no stack traces leaked)

## OWASP Top 10

- XSS: React auto-escapes, no raw HTML injection
- Injection: Prisma ORM, no raw SQL
- Auth: NextAuth session management
- SSRF: No user-controlled URLs in server fetches
