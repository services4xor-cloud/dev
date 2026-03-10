import { redirect } from 'next/navigation'

/**
 * /anchors → redirect to Anchor dashboard
 * Used in media/fashion pages as a CTA link.
 */
export default function AnchorsRoot() {
  redirect('/anchors/dashboard')
}
