import { readFileSync } from 'fs'
import { join } from 'path'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageShell from '@/components/PageShell'
import { COUNTRY_OPTIONS, LANGUAGE_REGISTRY } from '@/lib/country-selector'

interface PageProps {
  params: Promise<{ code: string }>
}

function getCountry(code: string) {
  return COUNTRY_OPTIONS.find((c) => c.code === code) ?? null
}

/** Lookup country name from GeoJSON for countries not in COUNTRY_OPTIONS */
let _geoNames: Record<string, string> | null = null
function getGeoName(code: string): string | null {
  if (!_geoNames) {
    try {
      const raw = readFileSync(join(process.cwd(), 'public/geo/countries.json'), 'utf-8')
      const geo = JSON.parse(raw) as {
        features: { properties: { ISO_A2: string; name: string } }[]
      }
      _geoNames = {}
      for (const f of geo.features) {
        _geoNames[f.properties.ISO_A2] = f.properties.name
      }
    } catch {
      _geoNames = {}
    }
  }
  return _geoNames[code] ?? null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params
  const upperCode = code.toUpperCase()
  const country = getCountry(upperCode)
  const name = country?.name ?? getGeoName(upperCode) ?? upperCode
  return {
    title: `Be${name}`,
    description: `Explore ${name} on Be[X] — discover languages, culture, paths, and connections.`,
  }
}

export default async function CountryHubPage({ params }: PageProps) {
  const { code } = await params
  const upperCode = code.toUpperCase()
  const country = getCountry(upperCode)

  // Derive display values — works for both known and unknown countries
  const name = country?.name ?? getGeoName(upperCode) ?? upperCode
  const region = country?.region ?? null
  const currency = country?.currency ?? null
  const payments = country?.payment ?? []
  const visa = country?.visa ?? null
  const tz = country?.tz ? country.tz.replace(/^.*\//, '') : null
  const topSectors = country?.topSectors ?? []

  const languages = country
    ? (country.languages
        .map((lc) => {
          const lang = LANGUAGE_REGISTRY[lc]
          return lang ? { code: lc, name: lang.name, nativeName: lang.nativeName } : null
        })
        .filter(Boolean) as { code: string; name: string; nativeName: string }[])
    : []

  return (
    <PageShell backHref="/" backLabel="← Back to Map" title={`Be${name}`}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-surface via-brand-bg to-brand-bg">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-12 text-center sm:px-6 sm:py-20">
          <h1 className="mb-4 flex items-center justify-center gap-3 text-3xl font-bold tracking-tight text-brand-accent sm:mb-5 sm:text-5xl">
            <Image
              src={`https://flagcdn.com/w80/${upperCode.toLowerCase()}.png`}
              alt={`${name} flag`}
              width={48}
              height={36}
              className="inline-block rounded shadow-md sm:h-[48px] sm:w-[64px]"
              unoptimized
            />
            Be{name}
          </h1>
          {region && (
            <span className="inline-block rounded-full border border-brand-accent/30 bg-brand-accent/10 px-3 py-1 text-xs font-medium text-brand-accent sm:px-4 sm:text-sm">
              {region}
            </span>
          )}
          {(currency || payments.length > 0) && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5 sm:gap-2">
              {currency && (
                <span className="inline-block rounded-full border border-brand-accent/20 bg-brand-surface px-2.5 py-0.5 text-xs text-brand-text-muted sm:px-3 sm:py-1 sm:text-sm">
                  {currency}
                </span>
              )}
              {payments.map((p) => (
                <span
                  key={p}
                  className="inline-block rounded-full border border-brand-accent/20 bg-brand-surface px-2.5 py-0.5 text-xs text-brand-text-muted sm:px-3 sm:py-1 sm:text-sm"
                >
                  {p}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats bar — only if we have data */}
      {country && (
        <section className="border-y border-brand-accent/10 bg-brand-surface">
          <div className="mx-auto grid max-w-4xl grid-cols-2 divide-x divide-brand-accent/10 sm:grid-cols-4">
            {[
              { label: 'Languages', value: String(languages.length) },
              { label: 'Sectors', value: String(topSectors.length) },
              ...(visa ? [{ label: 'Visa', value: visa }] : []),
              ...(tz ? [{ label: 'Timezone', value: tz }] : []),
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center px-2 py-4 text-center sm:px-6 sm:py-5"
              >
                <span className="text-lg font-bold leading-tight text-brand-accent sm:text-2xl">
                  {value}
                </span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-widest text-brand-text-muted sm:text-xs">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:space-y-10 sm:px-6 sm:py-12">
        {/* Languages */}
        {languages.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {languages.map((lang) => (
                <span
                  key={lang.code}
                  className="rounded-full border border-brand-accent/25 bg-brand-surface px-3 py-1.5 text-sm font-medium text-brand-accent sm:px-5 sm:py-2 sm:text-base"
                >
                  {lang.name}
                  <span className="ml-1 text-xs text-brand-text-muted sm:ml-1.5 sm:text-sm">
                    ({lang.nativeName})
                  </span>
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Sectors */}
        {topSectors.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
              Top Sectors
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              {topSectors.map((sector) => (
                <span
                  key={sector}
                  className="rounded-xl border border-brand-accent/10 bg-brand-surface px-3 py-2 text-center text-xs text-brand-text sm:px-4 sm:text-sm"
                >
                  {sector}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Action Cards — harmonized with main nav */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-text-muted sm:mb-4">
            Discover
          </h2>
          <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
            <Link
              href="/agent"
              className="group rounded-xl border border-brand-accent/15 bg-brand-surface p-5 text-center transition hover:border-brand-accent/40 sm:p-6"
            >
              <div className="mb-2 text-2xl">🤖</div>
              <p className="text-sm font-semibold text-brand-text group-hover:text-brand-accent">
                Ask the Agent
              </p>
              <p className="mt-1 text-xs text-brand-text-muted">AI-guided routing for {name}</p>
            </Link>
            <Link
              href="/opportunities"
              className="group rounded-xl border border-brand-accent/15 bg-brand-surface p-5 text-center transition hover:border-brand-accent/40 sm:p-6"
            >
              <div className="mb-2 text-2xl">🚀</div>
              <p className="text-sm font-semibold text-brand-text group-hover:text-brand-accent">
                Browse Paths
              </p>
              <p className="mt-1 text-xs text-brand-text-muted">Opportunities in {name}</p>
            </Link>
            <Link
              href="/explorers"
              className="group rounded-xl border border-brand-accent/15 bg-brand-surface p-5 text-center transition hover:border-brand-accent/40 sm:p-6"
            >
              <div className="mb-2 text-2xl">👥</div>
              <p className="text-sm font-semibold text-brand-text group-hover:text-brand-accent">
                Meet Pioneers
              </p>
              <p className="mt-1 text-xs text-brand-text-muted">People connected to {name}</p>
            </Link>
          </div>
        </section>

        {/* Back to map — subtle, not the main CTA */}
        <div className="pt-2 text-center">
          <Link
            href="/"
            className="text-sm text-brand-text-muted transition hover:text-brand-accent"
          >
            ← Back to the Map
          </Link>
        </div>
      </div>
    </PageShell>
  )
}
