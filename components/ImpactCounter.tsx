'use client'

import { useEffect, useState, useRef } from 'react'

interface ImpactStats {
  totalExplorers: number
  totalCountries: number
  totalConnections: number
  totalExchanges: number
  utamaduniContribution: number
}

function useCountUp(target: number, duration = 1200) {
  const [current, setCurrent] = useState(0)
  const frameRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    if (target === 0) return

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(eased * target))
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      }
    }

    frameRef.current = requestAnimationFrame(animate)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [target, duration])

  return current
}

function StatItem({
  value,
  label,
  format,
}: {
  value: number
  label: string
  format?: (n: number) => string
}) {
  const count = useCountUp(value)
  const display = format ? format(count) : count.toLocaleString()

  return (
    <div className="flex flex-col items-center gap-1 px-4">
      <span className="text-3xl font-bold text-brand-accent tabular-nums">{display}</span>
      <span className="text-xs text-brand-text-muted text-center leading-snug">{label}</span>
    </div>
  )
}

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `KES ${(amount / 1_000_000).toFixed(1)}M`
  if (amount >= 1_000) return `KES ${(amount / 1_000).toFixed(0)}K`
  return `KES ${amount.toLocaleString()}`
}

export default function ImpactCounter() {
  const [stats, setStats] = useState<ImpactStats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/impact')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json() as Promise<ImpactStats>
      })
      .then(setStats)
      .catch(() => setError(true))
  }, [])

  if (error) return null

  if (!stats) {
    return (
      <div className="flex justify-center py-8">
        <span className="text-sm text-brand-text-muted">Loading impact data…</span>
      </div>
    )
  }

  return (
    <div className="w-full rounded-2xl border border-brand-accent/20 bg-brand-surface py-8 px-4">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-brand-text-muted">
        Platform Impact
      </p>
      <div className="flex flex-wrap justify-center gap-6 sm:gap-0 sm:divide-x sm:divide-brand-accent/10">
        <StatItem value={stats.totalExplorers} label="Explorers Connected" />
        <StatItem value={stats.totalCountries} label="Countries Represented" />
        <StatItem value={stats.totalConnections} label="Connections Made" />
        <StatItem value={stats.totalExchanges} label="Exchanges Made" />
        <StatItem
          value={stats.utamaduniContribution}
          label="UTAMADUNI Contribution"
          format={formatCurrency}
        />
      </div>
    </div>
  )
}
