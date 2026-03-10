/**
 * Legacy /post-job redirect → /anchors/post-path
 * "Job" is old vocab. "Path" is the BeNetwork term.
 */
import { redirect } from 'next/navigation'

export default function LegacyPostJob() {
  redirect('/anchors/post-path')
}
