import { redirect } from 'next/navigation'

/**
 * /experiences → redirect to Ventures feed (Explorer filter)
 *
 * Ventures is the unified feed for all Paths + Experiences.
 * Individual experience detail pages remain at /experiences/[id].
 */
export default function ExperiencesRedirect() {
  redirect('/ventures')
}
