'use client'

/**
 * useTranslation — React hook for language-aware UI text
 *
 * Reads the active language from identity context and returns a t() function.
 * When the user switches language (e.g. Deutsch → Swahili), all UI text
 * that uses t() automatically updates.
 *
 * Usage:
 *   const { t, language } = useTranslation()
 *   <h1>{t('hero.headline')}</h1>
 *   <p>{t('hero.subtitle', { brandName })}</p>
 */

import { useCallback } from 'react'
import { useIdentity } from '@/lib/identity-context'
import { translate } from '@/lib/i18n'

interface UseTranslationResult {
  /** Translate a key, with optional interpolation variables */
  t: (key: string, vars?: Record<string, string>) => string
  /** Current active language code */
  language: string
}

export function useTranslation(): UseTranslationResult {
  const { identity } = useIdentity()
  const language = identity.language || 'en'

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => translate(key, language, vars),
    [language]
  )

  return { t, language }
}
