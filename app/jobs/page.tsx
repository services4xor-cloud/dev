'use client'

import Link from 'next/link'
import { Search, MapPin, Filter, Bookmark, Clock, Building2 } from 'lucide-react'

// Mock data — replace with DB queries
const MOCK_JOBS = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'Safaricom PLC',
    location: 'Nairobi, Kenya',
    type: 'Full-time',
    salary: 'KES 250,000 – 400,000/month',
    posted: '2 hours ago',
    logo: '📡',
    tags: ['React', 'Node.js', 'AWS'],
    isRemote: false,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Financial Analyst',
    company: 'Barclays UK',
    location: 'London, UK (Visa Sponsored)',
    type: 'Full-time',
    salary: '£45,000 – £60,000/year',
    posted: '5 hours ago',
    logo: '🏦',
    tags: ['Excel', 'Python', 'Bloomberg'],
    isRemote: false,
    isFeatured: true,
  },
  {
    id: '3',
    title: 'Remote Customer Support Lead',
    company: 'Shopify',
    location: 'Remote — Worldwide',
    type: 'Full-time',
    salary: '$40,000 – $55,000/year',
    posted: '1 day ago',
    logo: '🛍️',
    tags: ['Customer Service', 'Zendesk', 'Leadership'],
    isRemote: true,
    isFeatured: false,
  },
  {
    id: '4',
    title: 'Registered Nurse',
    company: 'NHS Scotland',
    location: 'Edinburgh, UK (Relocation Support)',
    type: 'Full-time',
    salary: '£28,000 – £36,000/year',
    posted: '2 days ago',
    logo: '🏥',
    tags: ['Nursing', 'ICU', 'NMC Registration'],
    isRemote: false,
    isFeatured: false,
  },
  {
    id: '5',
    title: 'Mobile App Developer (React Native)',
    company: 'M-Kopa Solar',
    location: 'Nairobi, Kenya (Hybrid)',
    type: 'Full-time',
    salary: 'KES 180,000 – 280,000/month',
    posted: '3 days ago',
    logo: '☀️',
    tags: ['React Native', 'TypeScript', 'Mobile'],
    isRemote: false,
    isFeatured: false,
  },
  {
    id: '6',
    title: 'Construction Site Manager',
    company: 'Jumia Properties',
    location: 'Dubai, UAE (Visa + Housing)',
    type: 'Contract',
    salary: 'AED 12,000 – 18,000/month',
    posted: '4 days ago',
    logo: '🏗️',
    tags: ['Construction', 'Safety', 'Project Management'],
    isRemote: false,
    isFeatured: false,
  },
]

const JOB_TYPES = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship']
const LOCATIONS = ['Worldwide', 'Kenya', 'UK', 'USA', 'UAE', 'Germany', 'Canada']

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-surface-light">
      {/* Header */}
      <div className="bg-gray-900 text-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-6">Find Your Perfect Job</h1>
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2">
            <div className="flex items-center gap-3 flex-1 px-4 py-2">
              <Search className="text-gray-400 flex-shrink-0" size={20} />
              <input
                type="text"
                placeholder="Job title, skill, or company..."
                className="flex-1 outline-none text-gray-900 text-base bg-transparent"
              />
            </div>
            <div className="flex items-center gap-3 flex-1 px-4 py-2 md:border-l border-gray-100">
              <MapPin className="text-gray-400 flex-shrink-0" size={20} />
              <input
                type="text"
                placeholder="Location or Remote"
                className="flex-1 outline-none text-gray-900 text-base bg-transparent"
              />
            </div>
            <button className="btn-primary rounded-xl">Search</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-6">
        {/* Filters sidebar */}
        <aside className="md:w-56 flex-shrink-0">
          <div className="card p-5 sticky top-20">
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-4">
              <Filter size={16} />
              Filters
            </div>

            <div className="mb-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Job Type</div>
              <div className="space-y-2">
                {JOB_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="type" className="accent-brand-orange" defaultChecked={type === 'All Types'} />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Location</div>
              <div className="space-y-2">
                {LOCATIONS.map((loc) => (
                  <label key={loc} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="accent-brand-orange" />
                    <span className="text-sm text-gray-700">{loc}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Job listings */}
        <main className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-gray-500">
              Showing <strong className="text-gray-900">12,400</strong> jobs
            </div>
            <select className="input text-sm py-2 w-auto">
              <option>Most Recent</option>
              <option>Most Relevant</option>
              <option>Highest Salary</option>
            </select>
          </div>

          <div className="space-y-4">
            {MOCK_JOBS.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="card p-5 flex gap-4 group block"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {job.isFeatured && (
                        <span className="badge bg-orange-50 text-brand-orange mb-1">⭐ Featured</span>
                      )}
                      <h3 className="font-semibold text-gray-900 group-hover:text-brand-orange transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                        <Building2 size={13} />
                        <span>{job.company}</span>
                        <span>·</span>
                        <MapPin size={13} />
                        <span>{job.location}</span>
                      </div>
                    </div>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                      onClick={(e) => e.preventDefault()}
                      aria-label="Save job"
                    >
                      <Bookmark size={16} className="text-gray-400" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="badge bg-gray-100 text-gray-700">{job.type}</span>
                    {job.isRemote && <span className="badge bg-green-50 text-green-700">🌍 Remote</span>}
                    {job.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="badge bg-blue-50 text-blue-700">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="font-semibold text-brand-orange text-sm">{job.salary}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      {job.posted}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Load more */}
          <div className="text-center mt-8">
            <button className="btn-secondary px-8">Load More Jobs</button>
          </div>
        </main>
      </div>
    </div>
  )
}
