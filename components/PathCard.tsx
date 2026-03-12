'use client'

import Link from 'next/link'
import { MapPin, Clock, DollarSign, Globe, Star } from 'lucide-react'
import SkillChip from '@/components/ui/SkillChip'

interface PathCardProps {
  id: string
  title: string
  company: string
  logo: string
  location: string
  isRemote: boolean
  pathType: string
  salaryMin?: number
  salaryMax?: number
  currency: string
  skills: string[]
  posted: string
  isFeatured: boolean
  tier?: string
}

export default function PathCard({
  id,
  title,
  company,
  logo,
  location,
  isRemote,
  pathType,
  salaryMin,
  salaryMax,
  currency,
  skills,
  posted,
  isFeatured,
  tier,
}: PathCardProps) {
  return (
    <Link
      href={`/ventures/${id}`}
      className={`block p-phi-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-accent/10 ${
        isFeatured ? 'glass-strong gradient-border' : 'glass'
      }`}
    >
      <div className="flex items-start gap-phi-4">
        <div className="w-12 h-12 glass-subtle rounded-xl flex items-center justify-center text-xl flex-shrink-0">
          {logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-phi-2">
            <div>
              <h3 className="font-semibold text-white truncate">{title}</h3>
              <p className="text-phi-sm text-gray-400">{company}</p>
            </div>
            {isFeatured && (
              <span className="badge-accent flex-shrink-0">
                <Star className="w-3 h-3" fill="currentColor" />
                Featured
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-phi-2 mt-phi-2">
            <span className="flex items-center gap-1 text-phi-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
            {isRemote && (
              <span className="flex items-center gap-1 text-phi-xs text-brand-accent">
                <Globe className="w-3 h-3" />
                Remote
              </span>
            )}
            <span className="flex items-center gap-1 text-phi-xs text-gray-400">
              <Clock className="w-3 h-3" />
              {posted}
            </span>
            {salaryMin && (
              <span className="flex items-center gap-1 text-phi-xs text-brand-accent font-medium">
                <DollarSign className="w-3 h-3" />
                {currency} {(salaryMin / 1000).toFixed(0)}k
                {salaryMax ? `–${(salaryMax / 1000).toFixed(0)}k` : '+'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-phi-1 mt-phi-2">
            {skills.slice(0, 4).map((skill) => (
              <SkillChip key={skill} label={skill} />
            ))}
            {skills.length > 4 && <SkillChip label={`+${skills.length - 4}`} variant="muted" />}
          </div>
        </div>
      </div>
    </Link>
  )
}
