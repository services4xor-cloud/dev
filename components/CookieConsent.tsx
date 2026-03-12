'use client'

/**
 * Cookie Consent Banner — GDPR / ePrivacy compliant
 *
 * Shows a non-intrusive bottom banner on first visit.
 * Stores consent in localStorage. Respects user choice:
 *   - "essential" = only functional cookies (session, identity)
 *   - "all" = analytics + marketing cookies (future)
 *   - null = not yet decided (banner shows)
 *
 * Privacy-first: defaults to rejecting non-essential cookies.
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/lib/hooks/use-translation'

const CONSENT_KEY = 'be-cookie-consent'

type ConsentLevel = 'essential' | 'all'

interface ConsentState {
  level: ConsentLevel
  timestamp: string
}

/** Check if user has given cookie consent */
export function getCookieConsent(): ConsentLevel | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) return null
    const parsed: ConsentState = JSON.parse(stored)
    return parsed.level
  } catch {
    return null
  }
}

/** Check if analytics/marketing cookies are allowed */
export function hasAnalyticsConsent(): boolean {
  return getCookieConsent() === 'all'
}

export default function CookieConsent() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show banner only if no consent stored
    const consent = getCookieConsent()
    if (!consent) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  function saveConsent(level: ConsentLevel) {
    try {
      const state: ConsentState = {
        level,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem(CONSENT_KEY, JSON.stringify(state))
    } catch {
      // localStorage unavailable
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[60] p-4 animate-in slide-in-from-bottom duration-300"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto rounded-2xl bg-[#16161e] border border-white/10 shadow-2xl shadow-black/60 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Text */}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium mb-1">🍪 {t('cookie.title')}</p>
            <p className="text-white/50 text-xs leading-relaxed">
              {t('cookie.description')}{' '}
              <Link href="/privacy" className="text-brand-accent hover:underline">
                {t('cookie.privacyLink')}
              </Link>{' '}
              {t('cookie.forDetails')}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => saveConsent('essential')}
              className="px-4 py-2 rounded-lg text-xs font-medium text-white/60 border border-white/10
                         hover:bg-white/5 hover:text-white transition-colors duration-150"
            >
              {t('cookie.essentialOnly')}
            </button>
            <button
              type="button"
              onClick={() => saveConsent('all')}
              className="px-4 py-2 rounded-lg text-xs font-bold text-brand-bg
                         transition-colors duration-150 hover:opacity-90"
              style={{
                background:
                  'linear-gradient(135deg, var(--color-accent), var(--color-accent-light))',
              }}
            >
              {t('cookie.acceptAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
