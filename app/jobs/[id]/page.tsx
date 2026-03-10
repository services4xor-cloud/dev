/**
 * Legacy /jobs/[id] redirect → /ventures
 * Individual job IDs may not map 1:1, redirect to the ventures feed.
 */
import { redirect } from 'next/navigation'

export default function LegacyJobDetail() {
  redirect('/ventures')
}
