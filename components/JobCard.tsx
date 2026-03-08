'use client'

import Link from 'next/link'
import { MapPin, Clock, DollarSign, Globe, Star } from 'lucide-react'

interface JobCardProps {
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

export default function JobCard({
  id, title, company, logo, location, isRemote,
  jobType, salaryMin, salaryMax, currency, skills, posted, isFeatured, tier
}: JobCardProps) {
  return (
    <Link
      href={`/jobs/${id}`}
      className={`block bg-white rounded-2xl p-5 shadow-sm border-2 transition-all hover:-translate-y-0.5 hover:shadow-md ${
        isFeatured ? 'border-brand-orange/30 bg-orange-50/30' : 'border-gray-100'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-xl flex-shrink-0 border border-gray-100">
          {logo}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate">{title}</h3>
              <p className="text-sm text-gray-500">{company}</p>
            </div>
            {isFeatured && (
              <span className="badge bg-orange-100 text-brand-orange flex items-center gap-1 flex-shrink-0">
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
              <span className="flex items-center gap-1 text-xs text-brand-teal">
                <Globe className="w-3 h-3" />
                Remote
              </span>
            )}
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              {posted}
            </span>
            {salaryMin && (
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <DollarSign className="w-3 h-3" />
                {currency} {(salaryMin / 1000).toFixed(0)}k{salaryMax ? `–${(salaryMax / 1000).toFixed(0)}k` : '+'}
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {skills.slice(0, 4).map(skill => (
              <span key={skill} className="badge bg-gray-100 text-gray-600 text-xs py-0.5">
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="badge bg-gray-100 text-gray-400 text-xs py-0.5">
                +{skills.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
