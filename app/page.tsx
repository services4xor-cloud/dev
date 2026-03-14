'use client'

import { useState } from 'react'
import WorldMap from '@/components/WorldMap'
import DimensionFilters from '@/components/DimensionFilters'
import CountryPanel from '@/components/CountryPanel'
import type { DimensionFilter, MapCountry } from '@/types/domain'

export default function HomePage() {
  const [filters, setFilters] = useState<DimensionFilter[]>([])
  const [countries] = useState<MapCountry[]>([])
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <WorldMap countries={countries} onCountryClick={setSelectedCountry} />

      <div className="absolute left-4 top-4 z-20">
        <h1 className="text-xl font-bold text-brand-accent">Be[X]</h1>
      </div>

      <DimensionFilters activeFilters={filters} onFilterChange={setFilters} />

      <CountryPanel countryCode={selectedCountry} onClose={() => setSelectedCountry(null)} />
    </main>
  )
}
