/**
 * Form Validation Utilities
 *
 * Common, reusable validation and sanitization functions for API routes
 * and server-side logic. Framework-free, TypeScript strict, no `any`.
 *
 * Usage:
 *   import { sanitizeString, validateEmail, validateAmount } from '@/lib/validation'
 */

/**
 * Trim and cap a string value. Returns '' for non-string input.
 */
export function sanitizeString(value: unknown, maxLength = 200): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

/**
 * Basic RFC-5322-lite email check (no DNS lookup).
 * Accepts: local@domain.tld
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export interface AmountResult {
  valid: boolean
  value: number
  error?: string
}

/**
 * Validate a monetary amount.
 * - Must be a finite positive number
 * - Must not exceed 1,000,000
 * - Rounds to the nearest integer (e.g. for minor currency units)
 */
export function validateAmount(amount: unknown): AmountResult {
  const num = Number(amount)
  if (!Number.isFinite(num) || num <= 0) {
    return { valid: false, value: 0, error: 'Amount must be greater than 0' }
  }
  if (num > 1_000_000) {
    return { valid: false, value: 0, error: 'Amount must not exceed 1,000,000' }
  }
  return { valid: true, value: Math.round(num) }
}

/**
 * Ensure a value is an array and cap its length.
 * Returns [] for non-array input.
 */
export function capArray<T>(arr: unknown, maxItems = 20): T[] {
  if (!Array.isArray(arr)) return []
  return arr.slice(0, maxItems) as T[]
}

/**
 * Validate an ISO 3166-1 alpha-2 or alpha-3 country code.
 * Returns the uppercased code, or null if invalid.
 */
export function validateCountryCode(code: unknown): string | null {
  if (typeof code !== 'string') return null
  const upper = code.trim().toUpperCase()
  if (upper.length < 2 || upper.length > 3) return null
  if (!/^[A-Z]{2,3}$/.test(upper)) return null
  return upper
}

/**
 * Validate a currency code (1–3 uppercase letters, e.g. KES, EUR, $).
 * Returns the uppercased code, or null if invalid.
 */
export function validateCurrency(code: unknown): string | null {
  if (typeof code !== 'string') return null
  const upper = code.trim().toUpperCase()
  if (upper.length < 1 || upper.length > 3) return null
  return upper
}

/**
 * Parse a JSON request body safely.
 * Returns { data } on success, { data: null, error } on failure.
 */
export async function parseJsonBody<T>(
  request: Request
): Promise<{ data: T | null; error?: string }> {
  try {
    const data = (await request.json()) as T
    return { data }
  } catch {
    return { data: null, error: 'Invalid JSON body' }
  }
}
