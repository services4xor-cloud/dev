'use client'

/**
 * useTranslation — React hook for language-aware UI text
 *
 * Uses session language when available, defaults to 'en'.
 * Will be enhanced when identity context is rebuilt.
 */

import { useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { translate } from '@/lib/i18n'

interface UseTranslationResult {
  t: (key: string, vars?: Record<string, string>) => string
  language: string
}

export function useTranslation(): UseTranslationResult {
  const { data: session } = useSession()
  const language = (session?.user as { language?: string })?.language || 'en'

  const t = useCallback(
    (key: string, vars?: Record<string, string>) => translate(key, language, vars),
    [language]
  )

  return { t, language }
}
