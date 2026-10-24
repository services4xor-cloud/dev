/**
 * Password + email-verification helpers for email/password accounts.
 *
 * Passwords: bcrypt, cost 12. Verification tokens: random 32 bytes, only the
 * SHA-256 hash is stored (VerificationToken table), valid 24h, single use.
 */
import { createHash, randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

export const PASSWORD_MIN = 10
export const PASSWORD_MAX = 128
const BCRYPT_COST = 12
export const VERIFY_PREFIX = 'verify-email:'
const VERIFY_TTL_MS = 24 * 60 * 60 * 1000

export function validatePassword(password: unknown): string | null {
  if (typeof password !== 'string') return 'Password is required'
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters`
  if (password.length > PASSWORD_MAX) return `Password must be at most ${PASSWORD_MAX} characters`
  return null
}

export function normalizeEmail(email: unknown): string | null {
  if (typeof email !== 'string') return null
  const e = email.trim().toLowerCase()
  if (e.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return null
  return e
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST)
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex')
}

/** Returns the raw token (for the email link) and what to store. */
export function newVerificationToken(email: string) {
  const raw = randomBytes(32).toString('hex')
  return {
    raw,
    record: {
      identifier: `${VERIFY_PREFIX}${email}`,
      token: hashToken(raw),
      expires: new Date(Date.now() + VERIFY_TTL_MS),
    },
  }
}
