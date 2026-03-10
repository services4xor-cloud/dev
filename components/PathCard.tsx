'use client'

/**
 * PathCard — BeNetwork dark-theme card for a Path (formerly "job")
 * Links to /ventures/[id] — the unified Ventures feed.
 * Props kept identical for backward compatibility — callers can rename gradually.
 */

import Link from 'next/link'
import { MapPin, Clock, DollarSign, Globe, Star } from 'lucide-react'

interface PathCardProps {
  id: string
  title: string
  company: string
  logo: string
  location: string
  isRemote: boolean
  jobType: string
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
  jobType,
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
      className={`block rounded-2xl p-5 border-2 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/30 ${
        isFeatured
          ? 'bg-[#5C0A14]/20 border-[#C9A227]/40 hover:border-[#C9A227]/70'
          : 'bg-gray-900/60 border-gray-800 hover:border-[#C9A227]/30'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-gray-700">
          {logo}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-white truncate">{title}</h3>
              <p className="text-sm text-gray-400">{company}</p>
            </div>
            {isFeatured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/20 flex-shrink-0">
                <Star className="w-3 h-3" fill="currentColor" />
                Featured
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3 h-3" />
              {location}
            </span>
            {isRemote && (
              <span className="flex items-center gap-1 text-xs text-[#C9A227]">
                <Globe className="w-3 h-3" />
                Remote
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {posted}
            </span>
            {salaryMin && (
              <span className="flex items-center gap-1 text-xs text-[#C9A227] font-medium">
                <DollarSign className="w-3 h-3" />
                {currency} {(salaryMin / 1000).toFixed(0)}k
                {salaryMax ? `–${(salaryMax / 1000).toFixed(0)}k` : '+'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-400 border border-gray-700"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-xs bg-gray-800 text-gray-500 border border-gray-700">
                +{skills.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
