'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import MapCanvas, { type MapPin, type MapProjectionMode } from '@/components/map/MapCanvas'
import CountryPanel, { type CountryData, type HighlightMode } from '@/components/map/CountryPanel'
import ComparePanel from '@/components/map/ComparePanel'
import KindDot from '@/components/map/KindDot'
import OpportunityCard from '@/components/OpportunityCard'
import { COUNTRY_OPTIONS } from '@/lib/country-selector'
import { formatPrice, KIND_LABELS, type OpportunityDTO } from '@/lib/opportunities'
import { getSelected, SELECTION_EVENT, setSelected, toggleSelected } from '@/lib/selection'
import { setAgentCountries } from '@/lib/agent-context'
import { bridgeCountries, compareCountries, MAX_COMPARE } from '@/lib/compare'

const COUNTRY = new Map(COUNTRY_OPTIONS.map((c) => [c.code, c]))
const PROJECTION_KEY = 'bex-map-projection'

/** Replace ?country / ?select in the address bar so the current view can be shared. */
function syncUrl(countries: string[], open: OpportunityDTO | null) {
  const url = new URL(window.location.href)
  if (countries.length) url.searchParams.set('country', countries.join(','))
  else url.searchParams.delete('country')
  if (open) url.searchParams.set('select', open.code || open.id)
  else url.searchParams.delete('select')
  window.history.replaceState(null, '', url.pathname + url.search)
}

/**
 * The map: offerings as pins, countries with live facts, and the way into the agent.
 * Desktop: panel on the left, offering card on the right. Phone: one bottom sheet.
 */
export default function MapExplorer() {
  const router = useRouter()
  const { data: session } = useSession()
  const userId = (session?.user as { id?: string } | undefined)?.id

  const [offerings, setOfferings] = useState<OpportunityDTO[] | null>(null)
  /** One country: its panel. Two or three: compared side by side. */
  const [countries, setCountries] = useState<string[]>([])
  /** Waiting for the next country click to add it to the comparison */
  const [comparing, setComparing] = useState(false)
  const country = countries.length === 1 ? countries[0] : null
  const [countryData, setCountryData] = useState<CountryData | null>(null)
  const [highlightMode, setHighlightMode] = useState<HighlightMode>('language')
  const [openId, setOpenId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [projection, setProjection] = useState<MapProjectionMode>('mercator')
  const [flyTo, setFlyTo] = useState<{
    lng: number
    lat: number
    zoom?: number
    key: number
  } | null>(null)
  const [sheetOpen, setSheetOpen] = useState(false)

  // Load offerings, then apply a deep link: /map?select=<code|id>,…&country=CC
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(PROJECTION_KEY) as MapProjectionMode | null
      if (saved === 'globe' || saved === 'mercator') setProjection(saved)
    } catch {
      // storage unavailable
    }
    setSelectedIds(getSelected())
    const sync = () => setSelectedIds(getSelected())
    window.addEventListener(SELECTION_EVENT, sync)

    fetch('/api/opportunities')
      .then((r) => (r.ok ? (r.json() as Promise<OpportunityDTO[]>) : []))
      .catch(() => [] as OpportunityDTO[])
      .then((list) => {
        setOfferings(list)
        const params = new URLSearchParams(window.location.search)
        const wanted = (params.get('select') ?? '')
          .split(',')
          .map((k) => list.find((o) => o.id === k || o.code === k))
          .filter((o): o is OpportunityDTO => !!o)
        if (wanted.length) {
          setSelected(Array.from(new Set([...wanted.map((o) => o.id), ...getSelected()])))
          setOpenId(wanted[0].id)
          setSheetOpen(true)
        }
        const ccs = (params.get('country') ?? wanted[0]?.properties.countryCode ?? '')
          .toUpperCase()
          .split(',')
          .filter((cc) => COUNTRY.has(cc))
          .slice(0, MAX_COMPARE)
        if (ccs.length) {
          setCountries(Array.from(new Set(ccs)))
          const c = COUNTRY.get(ccs[0])!
          setFlyTo({ lng: c.lng, lat: c.lat, zoom: ccs.length > 1 ? 1.8 : 3, key: Date.now() })
        }
      })
    return () => window.removeEventListener(SELECTION_EVENT, sync)
  }, [])

  const all = useMemo(() => offerings ?? [], [offerings])
  const open = all.find((o) => o.id === openId) ?? null

  useEffect(() => {
    if (offerings) syncUrl(countries, open)
  }, [offerings, countries, open])

  // ── Filtering: free text; a selected country narrows the list ──
  const q = query.trim().toLowerCase()
  const filtered = useMemo(
    () =>
      all.filter((o) => {
        if (!q) return true
        const p = o.properties
        const countryName = p.countryCode ? COUNTRY.get(p.countryCode)?.name : ''
        return [o.label, p.description, p.location, p.sector, countryName, o.host?.label].some(
          (v) => v?.toLowerCase().includes(q)
        )
      }),
    [all, q]
  )
  const countryMatches = useMemo(
    () =>
      q.length < 2
        ? []
        : COUNTRY_OPTIONS.filter((c) => c.name.toLowerCase().includes(q))
            .sort(
              (a, b) =>
                Number(!a.name.toLowerCase().startsWith(q)) -
                Number(!b.name.toLowerCase().startsWith(q))
            )
            .slice(0, 4),
    [q]
  )
  const inCountry = useMemo(
    () => (country ? all.filter((o) => o.properties.countryCode === country) : []),
    [all, country]
  )

  const pins = useMemo<MapPin[]>(
    () =>
      filtered
        .filter((o) => o.lat !== null && o.lng !== null)
        .map((o) => ({
          id: o.id,
          label: o.label,
          lat: o.lat as number,
          lng: o.lng as number,
          kind: o.properties.kind,
          selected: o.id === openId || selectedIds.includes(o.id),
        })),
    [filtered, openId, selectedIds]
  )
  const activeCountries = useMemo(
    () => new Set(all.map((o) => o.properties.countryCode).filter((c): c is string => !!c)),
    [all]
  )
  const comparison = useMemo(() => compareCountries(countries), [countries])
  const highlight = useMemo(() => {
    if (comparison) return bridgeCountries(comparison)
    const out: Record<string, number> = {}
    if (!countryData || countryData.code !== country) return out
    if (highlightMode === 'language') {
      const max = Math.max(1, ...countryData.sharedLanguage.map((c) => c.languages.length))
      for (const c of countryData.sharedLanguage) out[c.code] = c.languages.length / max
    } else if (highlightMode === 'currency') {
      for (const c of countryData.sharedCurrency) out[c.code] = 1
    }
    return out
  }, [comparison, countryData, country, highlightMode])

  // ── Actions ──
  const selectCountry = useCallback((code: string) => {
    setCountries([code])
    setComparing(false)
    setSheetOpen(true)
    const c = COUNTRY.get(code)
    if (c) setFlyTo({ lng: c.lng, lat: c.lat, zoom: 2.6, key: Date.now() })
  }, [])
  /**
   * A country picked on the map, in search or in a list. It joins the comparison when
   * one is running, "Compare" was pressed, or shift/ctrl/cmd was held; else it replaces.
   * Picking a selected country again takes it out.
   */
  const pickCountry = useCallback(
    (code: string, additive = false) => {
      setSheetOpen(true)
      setComparing(false)
      if (countries.includes(code)) {
        setCountries(countries.filter((c) => c !== code))
        return
      }
      if (countries.length && (additive || comparing || countries.length >= 2)) {
        setCountries([...countries.slice(0, MAX_COMPARE - 1), code].slice(-MAX_COMPARE))
        return
      }
      selectCountry(code)
    },
    [countries, comparing, selectCountry]
  )
  const clearCountries = useCallback(() => {
    setCountries([])
    setComparing(false)
    setCountryData(null)
  }, [])
  const openOffering = useCallback(
    (id: string) => {
      setOpenId(id)
      setSheetOpen(true)
      const o = all.find((x) => x.id === id)
      if (o && o.lng !== null && o.lat !== null)
        setFlyTo({ lng: o.lng, lat: o.lat, zoom: 3.5, key: Date.now() })
    },
    [all]
  )
  const askAgent = useCallback(() => {
    setAgentCountries(countries)
    router.push('/agent')
  }, [countries, router])
  const toggleProjection = () => {
    setProjection((p) => {
      const next = p === 'mercator' ? 'globe' : 'mercator'
      try {
        sessionStorage.setItem(PROJECTION_KEY, next)
      } catch {
        // storage unavailable
      }
      return next
    })
  }
  const onCountryData = useCallback((d: CountryData | null) => setCountryData(d), [])

  const selectedCount = selectedIds.length

  // Search: top of the panel, and on phones right in the collapsed sheet
  const searchField = (
    <label className="relative block">
      <span className="sr-only">Search countries and offerings</span>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-text-muted"
      >
        <path
          d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.58 3.58-1.06 1.06-3.58-3.58A7 7 0 0 1 2 9Z"
          fill="currentColor"
        />
      </svg>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setSheetOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && countryMatches[0] && !filtered.length) {
            pickCountry(countryMatches[0].code)
            setQuery('')
          }
        }}
        placeholder="Search a country or an offering"
        className="input pl-9"
      />
    </label>
  )

  // ── Panel body (shared by desktop panel and phone sheet) ──
  const list = (
    <OfferingList
      items={filtered}
      total={all.length}
      loading={offerings === null}
      openId={openId}
      selectedIds={selectedIds}
      onOpen={openOffering}
      onClearFilters={() => {
        setQuery('')
      }}
      filtered={!!q}
    />
  )

  const panelHead = (
    <div className="space-y-3 border-b border-brand-line p-4">
      {searchField}
      {countryMatches.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {countryMatches.map((c) => (
            <button
              key={c.code}
              onClick={() => {
                pickCountry(c.code)
                setQuery('')
              }}
              className="rounded-md border border-brand-line bg-brand-surface-2 px-2.5 py-1 text-sm text-brand-text hover:border-brand-accent"
            >
              {c.flag} {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )

  const panelBody = (
    <>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        {comparison ? (
          <ComparePanel
            codes={comparison.codes}
            offerings={all}
            onRemove={(code) => setCountries((cs) => cs.filter((c) => c !== code))}
            onClear={clearCountries}
            onOpenOffering={openOffering}
            onAskAgent={askAgent}
          />
        ) : country ? (
          <CountryPanel
            key={country}
            code={country}
            offerings={inCountry}
            highlightMode={highlightMode}
            onHighlightMode={setHighlightMode}
            onData={onCountryData}
            onOpenOffering={openOffering}
            onSelectCountry={pickCountry}
            onClose={clearCountries}
            onAskAgent={askAgent}
            onCompare={() => {
              setComparing((v) => !v)
              setSheetOpen(false)
            }}
            comparing={comparing}
          />
        ) : (
          <>
            <div className="mb-4">
              <p className="eyebrow mb-2">Explore</p>
              <h1 className="font-display text-2xl font-medium leading-tight text-brand-text">
                No borders, just differences.
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-text-muted">
                Pick a country to see its economy, languages and who it connects with. Add a second
                or third (shift-click, or Compare) to see what they share and where they differ.
              </p>
            </div>
            {list}
          </>
        )}
        {countries.length > 0 && filtered.length > 0 && (
          <details className="mt-6">
            <summary className="cursor-pointer text-sm text-brand-text-muted hover:text-brand-text">
              All offerings worldwide ({filtered.length})
            </summary>
            <div className="mt-3">{list}</div>
          </details>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center justify-between gap-3 border-t border-brand-line bg-brand-surface-2 px-4 py-3">
          <span className="text-sm text-brand-text-muted">
            {selectedCount} selected for the agent
          </span>
          <button onClick={askAgent} className="btn btn-primary btn-sm">
            Ask the agent
          </button>
        </div>
      )}
    </>
  )

  const panel = (
    <>
      {panelHead}
      {panelBody}
    </>
  )

  const card = open && (
    <div className="relative">
      <button
        onClick={() => setOpenId(null)}
        aria-label="Close offering"
        className="absolute right-3 top-3 z-10 rounded-md px-2 py-0.5 text-xl leading-none text-brand-text-muted hover:bg-white/5 hover:text-brand-text"
      >
        ×
      </button>
      <OpportunityCard
        opp={open}
        selected={selectedIds.includes(open.id)}
        onToggleSelect={(id) => setSelectedIds(toggleSelected(id))}
        isOwn={!!userId && open.host?.userId === userId}
        onShowCountry={
          open.properties.countryCode
            ? () => selectCountry(open.properties.countryCode!)
            : undefined
        }
      />
    </div>
  )

  return (
    <div className="absolute inset-0 overflow-hidden">
      <MapCanvas
        pins={pins}
        selectedCountries={countries}
        highlight={highlight}
        activeCountries={activeCountries}
        onCountryClick={(code, _name, additive) => pickCountry(code, additive)}
        onPinClick={openOffering}
        onBackgroundClick={() => setOpenId(null)}
        projection={projection}
        flyTo={flyTo}
      />

      <button
        onClick={toggleProjection}
        className="absolute bottom-[8.5rem] right-2.5 z-10 rounded-md border border-brand-line bg-brand-surface/95 px-2.5 py-1.5 text-xs text-brand-text shadow hover:border-brand-accent md:bottom-[8.25rem]"
      >
        {projection === 'mercator' ? 'Globe' : 'Flat map'}
      </button>

      {/* Desktop and tablet */}
      <aside className="card absolute bottom-3 left-3 top-3 z-20 hidden w-[384px] flex-col overflow-hidden md:flex">
        {panel}
      </aside>
      {card && (
        <div className="absolute right-3 top-3 z-20 hidden max-h-[calc(100%-1.5rem)] w-[380px] overflow-y-auto md:block">
          {card}
        </div>
      )}

      {/* Phone: one bottom sheet; the offering card takes it over while open */}
      <section
        aria-label="Explore"
        className={`card absolute inset-x-2 bottom-2 z-20 flex flex-col overflow-hidden pb-[env(safe-area-inset-bottom)] transition-[max-height] duration-300 md:hidden ${
          sheetOpen ? 'max-h-[75%]' : 'max-h-[8rem]'
        }`}
      >
        <button
          onClick={() => setSheetOpen((v) => !v)}
          aria-expanded={sheetOpen}
          aria-label={sheetOpen ? 'Collapse panel' : 'Expand panel'}
          className="flex w-full shrink-0 justify-center pb-1 pt-2"
        >
          <span className="h-1 w-10 rounded-full bg-white/25" />
        </button>
        {/* Collapsed with nothing picked: the search itself, so it is one tap away. It stays
            the same element when the sheet opens, so the keyboard and typed text survive. */}
        {!open && (sheetOpen || !countries.length) ? (
          <>
            {panelHead}
            {sheetOpen && panelBody}
          </>
        ) : !sheetOpen ? (
          <button
            onClick={() => setSheetOpen(true)}
            className="flex items-center gap-3 px-4 pb-4 pt-1 text-left"
          >
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-lg text-brand-text">
                {open
                  ? open.label
                  : countries.length
                    ? countries
                        .map((c) => `${COUNTRY.get(c)?.flag ?? ''} ${COUNTRY.get(c)?.name ?? c}`)
                        .join(' · ')
                    : 'No borders, just differences'}
              </span>
              <span className="block truncate text-xs text-brand-text-muted">
                {open
                  ? `${KIND_LABELS[open.properties.kind]} · tap for details`
                  : comparing
                    ? 'Now tap a second country on the map'
                    : countries.length > 1
                      ? 'What connects them, where they differ · tap to open'
                      : country
                        ? 'Economy, languages and connections · tap to open'
                        : `${all.length} offerings · search a country or tap one on the map`}
              </span>
            </span>
            <span className="btn btn-sm">Open</span>
          </button>
        ) : (
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{card}</div>
        )}
      </section>
    </div>
  )
}

function OfferingList({
  items,
  total,
  loading,
  openId,
  selectedIds,
  onOpen,
  onClearFilters,
  filtered,
}: {
  items: OpportunityDTO[]
  total: number
  loading: boolean
  openId: string | null
  selectedIds: string[]
  onOpen: (id: string) => void
  onClearFilters: () => void
  filtered: boolean
}) {
  if (loading)
    return (
      <div className="grid gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-lg bg-brand-surface-2" />
        ))}
      </div>
    )
  if (!items.length)
    return (
      <p className="rounded-lg border border-dashed border-brand-line p-4 text-sm text-brand-text-muted">
        {total ? 'Nothing matches.' : 'No offerings yet.'}{' '}
        {filtered && (
          <button onClick={onClearFilters} className="text-brand-accent hover:underline">
            Clear filters
          </button>
        )}
      </p>
    )
  return (
    <>
      <p className="mb-2 text-xs text-brand-text-muted">
        {items.length === total ? `${total} offerings` : `${items.length} of ${total} offerings`}
      </p>
      <ul className="grid grid-cols-1 gap-2">
        {items.map((o) => {
          const c = o.properties.countryCode ? COUNTRY.get(o.properties.countryCode) : null
          const price = formatPrice(o.properties)
          const on = o.id === openId
          return (
            <li key={o.id}>
              <button
                onClick={() => onOpen(o.id)}
                aria-current={on ? 'true' : undefined}
                className={`w-full rounded-lg border px-3 py-2.5 text-left transition ${
                  on
                    ? 'border-brand-accent bg-brand-accent/10'
                    : 'border-brand-line bg-brand-surface-2 hover:border-brand-accent/60'
                }`}
              >
                <span className="flex items-center gap-2 text-[0.72rem] text-brand-text-muted">
                  <KindDot kind={o.properties.kind} />
                  {KIND_LABELS[o.properties.kind]}
                  {c && (
                    <span>
                      · {c.flag} {c.name}
                    </span>
                  )}
                  {selectedIds.includes(o.id) && (
                    <span className="ml-auto text-brand-accent">✓ for agent</span>
                  )}
                </span>
                <span className="mt-1 block font-medium leading-snug text-brand-text">
                  {o.label}
                </span>
                <span className="mt-0.5 block text-xs text-brand-text-muted">
                  {[o.host?.label, price].filter(Boolean).join(' · ')}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </>
  )
}
