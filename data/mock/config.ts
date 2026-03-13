/**
 * Re-export platform config from canonical source.
 * All new code should import from '@/lib/platform-config' directly.
 */
export {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_MISSION,
  IMPACT_PARTNER,
  REFERRAL_BONUS,
  CONTACT,
  LEGAL,
  REFERRAL,
  PAYMENT_BADGES,
} from '@/lib/platform-config'

/** @deprecated Use IMPACT_PARTNER.sharePercent */
export { IMPACT_PARTNER as _IP } from '@/lib/platform-config'
import { IMPACT_PARTNER } from '@/lib/platform-config'
export const UTAMADUNI_SHARE = IMPACT_PARTNER.sharePercent
export const UTAMADUNI_AMOUNT = IMPACT_PARTNER.contributionAmount

// ── Mock Profile (actual mock data — stays here) ────────────────
import { COUNTRIES } from '@/lib/countries'
const CC = (process.env.NEXT_PUBLIC_COUNTRY_CODE || 'KE').toUpperCase() as keyof typeof COUNTRIES
const country = COUNTRIES[CC]

export const MOCK_PROFILE = {
  name: 'John Kamau',
  email: 'john@example.com',
  phone: '0712345678',
  country: country?.name ?? 'Kenya',
  city: 'Nairobi',
  bio: '',
  headline: '',
  linkedin: '',
} as const
