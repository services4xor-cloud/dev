'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CountryData {
  label: string
  icon: string | null
  languages: string[]
  currencies: string[]
  region?: string
}

interface CountryPanelProps {
  countryCode: string | null
  onClose: () => void
}

export default function CountryPanel({ countryCode, onClose }: CountryPanelProps) {
  const [data, setData] = useState<CountryData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!countryCode) {
      setData(null)
      return
    }
    setLoading(true)
    fetch(`/api/country/${countryCode}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        setData(d)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [countryCode])

  if (!countryCode) return null

  return (
    <div className="fixed right-0 top-0 z-30 h-full w-80 overflow-y-auto border-l border-brand-accent/20 bg-brand-surface px-6 pb-6 pt-14 shadow-2xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-brand-text-muted hover:text-brand-text"
      >
        ✕
      </button>

      {loading ? (
        <p className="text-sm text-brand-text-muted">Loading...</p>
      ) : data ? (
        <>
          <h2 className="text-2xl font-bold text-brand-accent">
            {data.icon} Be{countryCode}
          </h2>
          <p className="mt-1 text-brand-text">{data.label}</p>

          {data.region && (
            <p className="mt-3 text-xs uppercase tracking-wide text-brand-text-muted">
              {data.region}
            </p>
          )}

          {data.languages.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                Languages
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.languages.map((lang) => (
                  <span
                    key={lang}
                    className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {data.currencies.length > 0 && (
            <div className="mt-4">
              <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-brand-text-muted">
                Currency
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {data.currencies.map((curr) => (
                  <span
                    key={curr}
                    className="rounded-full bg-brand-accent/10 px-2.5 py-1 text-xs text-brand-accent"
                  >
                    {curr}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/be/${countryCode.toLowerCase()}`}
            className="mt-6 block w-full rounded-lg bg-brand-primary py-2.5 text-center text-sm font-medium text-brand-accent transition hover:opacity-90"
          >
            Explore Be{countryCode}
          </Link>
        </>
      ) : (
        <h2 className="text-2xl font-bold text-brand-accent">Be{countryCode}</h2>
      )}
    </div>
  )
}
