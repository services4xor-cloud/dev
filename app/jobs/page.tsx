/**
 * Legacy /jobs redirect → /ventures
 * All Paths and Experiences are unified under /ventures.
 */
import { redirect } from 'next/navigation'

export default function LegacyJobs() {
  redirect('/ventures')
}
