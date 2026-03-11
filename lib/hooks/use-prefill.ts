'use client'

/**
 * Smart Form Prefilling — propagates identity context to forms
 *
 * When a user selects Germany in the Nav, all forms pre-fill:
 *   - Country → DE
 *   - Language → de
 *   - Currency → EUR
 *   - Phone prefix → +49
 *
 * When logged in, additional data is pulled from the session:
 *   - Name, email, phone
 *
 * Usage:
 *   const prefill = usePrefill()
 *   <input defaultValue={prefill.country} />
 *   <input defaultValue={prefill.phonePrefix} />
 */

import { useIdentity } from '@/lib/identity-context'
import { COUNTRIES, type CountryCode } from '@/lib/countries'
import { useSession } from 'next-auth/react'

export interface PrefillData {
  // From identity context
  country: string
  countryName: string
  language: string
  currency: string
  currencySymbol: string
  phonePrefix: string
  locale: string

  // From session (if logged in)
  name: string
  email: string
  phone: string

  // Derived
  isLoggedIn: boolean
}

export function usePrefill(): PrefillData {
  const { identity, countryName } = useIdentity()
  const { data: session } = useSession()

  const config = COUNTRIES[identity.country as CountryCode]

  return {
    // Identity-driven defaults
    country: identity.country,
    countryName,
    language: identity.language,
    currency: config?.currency ?? 'KES',
    currencySymbol: config?.currencySymbol ?? 'KES',
    phonePrefix: config?.phonePrefix ?? '+254',
    locale: config?.locale ?? 'en-KE',

    // Session data (empty strings if not logged in)
    name: session?.user?.name ?? '',
    email: session?.user?.email ?? '',
    phone: '',

    // Convenience flag
    isLoggedIn: !!session?.user,
  }
}
