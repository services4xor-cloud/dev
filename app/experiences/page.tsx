import { redirect } from 'next/navigation'

/**
 * /experiences → redirect to Exchange feed (Explorer filter)
 *
 * Exchange is the unified feed for all Paths + Experiences.
 * Individual experience detail pages remain at /experiences/[id].
 */
export default function ExperiencesRedirect() {
  redirect('/exchange')
}
