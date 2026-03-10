/**
 * Legacy /dashboard redirect → /pioneers/dashboard
 * Permanent server-side redirect — no client JS needed.
 */
import { redirect } from 'next/navigation'

export default function LegacyDashboard() {
  redirect('/pioneers/dashboard')
}
