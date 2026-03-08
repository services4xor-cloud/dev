'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Clock, DollarSign, Briefcase, Globe, Building2, Star, Share2, Bookmark, ChevronRight, CheckCircle } from 'lucide-react'

// Mock data — replace with API call when DB is ready
const mockJob = {
  id: '1',
  title: 'Senior Software Engineer',
  company: 'Safaricom PLC',
  logo: '📱',
  location: 'Nairobi, Kenya',
  isRemote: true,
  jobType: 'FULL_TIME',
  salaryMin: 180000,
  salaryMax: 280000,
  currency: 'KES',
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'PostgreSQL'],
  description: `We are looking for a Senior Software Engineer to join our fast-growing fintech team. You will work on the M-Pesa platform serving 30M+ users across East Africa.

## About the role
You'll be responsible for building and maintaining critical payment infrastructure that processes billions of shillings daily. This is a high-impact role with significant autonomy.

## What you'll do
- Lead development of new M-Pesa features and integrations
- Architect scalable, high-availability payment systems
- Mentor junior developers and conduct code reviews
- Collaborate with product and design teams on UX improvements
- Participate in on-call rotation for production systems

## What we're looking for
- 5+ years of software engineering experience
- Strong TypeScript/Node.js and React skills
- Experience with distributed systems and microservices
- Understanding of payment systems or fintech (preferred)
- Excellent communication skills`,
  requirements: [
    '5+ years of software engineering experience',
    'Proficient in TypeScript, Node.js, React',
    'Experience with AWS or similar cloud platforms',
    'Strong understanding of REST APIs and microservices',
    'Bachelor\'s degree in Computer Science or equivalent experience',
  ],
  benefits: [
    'KES 180k–280k monthly salary',
    'Annual performance bonus (up to 20%)',
    'Medical insurance for you and family',
    'Flexible working hours + remote option',
    'Learning & development budget KES 50k/year',
    'Stock options after 12 months',
  ],
  postedAt: '2 days ago',
  expiresAt: 'March 31, 2024',
  applications: 47,
  tier: 'FEATURED',
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const [applied, setApplied] = useState(false)
  const [saved, setSaved] = useState(false)
  const job = mockJob // TODO: fetch by params.id

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-orange">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/jobs" className="hover:text-brand-orange">Jobs</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 truncate">{job.title}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                      <div className="flex items-center gap-2 mt-1">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 font-medium">{job.company}</span>
                        {job.tier === 'FEATURED' && (
                          <span className="badge bg-orange-100 text-brand-orange text-xs">⭐ Featured</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => setSaved(!saved)}
                        className={`p-2 rounded-xl border transition-colors ${saved ? 'border-brand-orange bg-orange-50 text-brand-orange' : 'border-gray-200 text-gray-400 hover:border-gray-300'}`}
                      >
                        <Bookmark className="w-5 h-5" fill={saved ? 'currentColor' : 'none'} />
                      </button>
                      <button className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:border-gray-300 transition-colors">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="badge bg-gray-100 text-gray-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {job.location}
                    </span>
                    {job.isRemote && (
                      <span className="badge bg-teal-50 text-brand-teal flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Remote OK
                      </span>
                    )}
                    <span className="badge bg-gray-100 text-gray-600 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> {job.jobType.replace('_', ' ')}
                    </span>
                    <span className="badge bg-green-50 text-green-700 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {job.currency} {(job.salaryMin / 1000).toFixed(0)}k–{(job.salaryMax / 1000).toFixed(0)}k/mo
                    </span>
                    <span className="badge bg-gray-100 text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Posted {job.postedAt}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Job Description</h2>
              <div className="prose prose-sm max-w-none text-gray-600 whitespace-pre-line">
                {job.description}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Requirements</h2>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-600">
                    <CheckCircle className="w-4 h-4 text-brand-teal mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Benefits & Perks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {job.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-600">
                    <Star className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <div className="text-center mb-4">
                <div className="text-3xl font-black text-gray-900">
                  {job.currency} {(job.salaryMin / 1000).toFixed(0)}k–{(job.salaryMax / 1000).toFixed(0)}k
                </div>
                <div className="text-gray-500 text-sm">per month</div>
              </div>

              {applied ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="font-semibold text-green-700">Application Sent!</div>
                  <div className="text-sm text-green-600 mt-1">The employer will review and contact you.</div>
                </div>
              ) : (
                <button
                  onClick={() => setApplied(true)}
                  className="btn-primary w-full py-4 text-lg"
                >
                  Apply Now →
                </button>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Applications</span>
                  <span className="font-medium text-gray-700">{job.applications} so far</span>
                </div>
                <div className="flex justify-between">
                  <span>Deadline</span>
                  <span className="font-medium text-gray-700">{job.expiresAt}</span>
                </div>
                <div className="flex justify-between">
                  <span>Job Type</span>
                  <span className="font-medium text-gray-700">{job.jobType.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills.map(skill => (
                  <span key={skill} className="badge bg-orange-50 text-brand-orange">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Back to listings */}
            <Link href="/jobs" className="btn-secondary w-full text-center block py-3">
              ← Back to All Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
