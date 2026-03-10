/**
 * Legacy /employers/dashboard redirect → /anchors/dashboard
 * "Employers" is old vocab. Anchors is the BeNetwork term.
 */
import { redirect } from 'next/navigation'

export default function LegacyEmployersDashboard() {
  redirect('/anchors/dashboard')
}
