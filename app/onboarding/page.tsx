import { redirect } from 'next/navigation'

/** Onboarding redirects to signup — the actual onboarding flow is in Discovery */
export default function OnboardingRedirect() {
  redirect('/signup')
}
