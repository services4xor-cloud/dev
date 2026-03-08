'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Briefcase, Bell, Star, ChevronRight, MapPin, Clock, TrendingUp, CheckCircle, XCircle, Eye, ArrowRight } from 'lucide-react'
import JobCard from '@/components/JobCard'

// Mock data — wire up to API when DB is ready
const mockUser = { name: 'John Kamau', email: 'john@example.com', role: 'JOB_SEEKER' }

const mockApplications = [
  { id: '1', title: 'Senior Software Engineer', company: 'Safaricom', status: 'SHORTLISTED', appliedAt: '2 days ago', logo: '📱' },
  { id: '2', title: 'Frontend Developer', company: 'KCB Bank', status: 'REVIEWED', appliedAt: '5 days ago', logo: '🏦' },
  { id: '3', title: 'Full Stack Engineer', company: 'Andela', status: 'PENDING', appliedAt: '1 week ago', logo: '🚀' },
  { id: '4', title: 'React Developer', company: 'Twiga Foods', status: 'REJECTED', appliedAt: '2 weeks ago', logo: '🌽' },
]

const suggestedJobs = [
  { id: '5', title: 'DevOps Engineer', company: 'Cellulant', logo: '⚙️', location: 'Nairobi', isRemote: true, jobType: 'FULL_TIME', salaryMin: 150000, salaryMax: 200000, currency: 'KES', skills: ['AWS', 'Docker', 'Kubernetes'], posted: '1 day ago', isFeatured: false },
  { id: '6', title: 'Mobile Developer', company: 'M-Kopa Solar', logo: '☀️', location: 'Nairobi', isRemote: false, jobType: 'FULL_TIME', salaryMin: 120000, salaryMax: 180000, currency: 'KES', skills: ['Flutter', 'Kotlin', 'iOS'], posted: '3 days ago', isFeatured: true },
]

const statusConfig: Record<string, { label: string; color: string; icon: React.ComponentType<{className?: string}> }> = {
  PENDING: { label: 'Under Review', color: 'bg-yellow-50 text-yellow-700', icon: Clock },
  REVIEWED: { label: 'Viewed', color: 'bg-blue-50 text-blue-700', icon: Eye },
  SHORTLISTED: { label: 'Shortlisted ⭐', color: 'bg-green-50 text-green-700', icon: CheckCircle },
  REJECTED: { label: 'Not Selected', color: 'bg-gray-50 text-gray-500', icon: XCircle },
  HIRED: { label: 'Hired! 🎉', color: 'bg-orange-50 text-brand-orange', icon: Star },
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'saved' | 'profile'>('applications')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="text-gray-900">Beke</span>
            <span className="text-brand-orange">nya</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-brand-orange rounded-full" />
            </button>
            <div className="w-9 h-9 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold text-sm">
              {mockUser.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-3">
                {mockUser.name.charAt(0)}
              </div>
              <h2 className="font-bold text-gray-900">{mockUser.name}</h2>
              <p className="text-sm text-gray-500">{mockUser.email}</p>
              <div className="mt-3 flex items-center justify-center gap-1 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-green-600">Profile visible to employers</span>
              </div>
              <Link href="/profile" className="mt-4 btn-secondary block text-sm py-2">
                Edit Profile
              </Link>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
              <h3 className="font-semibold text-gray-900 text-sm">Activity</h3>
              {[
                { label: 'Applications', value: mockApplications.length, icon: Briefcase, color: 'text-brand-orange' },
                { label: 'Profile views', value: 24, icon: Eye, color: 'text-brand-teal' },
                { label: 'Shortlisted', value: 1, icon: Star, color: 'text-green-500' },
              ].map(stat => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Icon className={`w-4 h-4 ${stat.color}`} />
                      {stat.label}
                    </div>
                    <span className="font-bold text-gray-900">{stat.value}</span>
                  </div>
                )
              })}
            </div>

            {/* Quick actions */}
            <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
              <div className="flex items-center gap-2 text-brand-orange font-medium text-sm mb-2">
                <TrendingUp className="w-4 h-4" />
                Quick actions
              </div>
              <Link href="/jobs" className="flex items-center justify-between text-sm text-gray-700 hover:text-brand-orange py-2 border-b border-orange-100">
                Browse new jobs <ChevronRight className="w-4 h-4" />
              </Link>
              <Link href="/profile" className="flex items-center justify-between text-sm text-gray-700 hover:text-brand-orange py-2">
                Complete profile <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {([
                  { key: 'applications', label: `Applications (${mockApplications.length})` },
                  { key: 'saved', label: 'Saved Jobs' },
                  { key: 'profile', label: 'Profile' },
                ] as const).map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${
                      activeTab === tab.key
                        ? 'border-brand-orange text-brand-orange'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'applications' && (
                  <div className="space-y-3">
                    {mockApplications.map(app => {
                      const status = statusConfig[app.status]
                      const StatusIcon = status.icon
                      return (
                        <div key={app.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl border border-gray-100">
                            {app.logo}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{app.title}</div>
                            <div className="text-sm text-gray-500">{app.company} · Applied {app.appliedAt}</div>
                          </div>
                          <span className={`badge flex items-center gap-1 text-xs ${status.color}`}>
                            <StatusIcon className="w-3 h-3" />
                            {status.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                {activeTab === 'saved' && (
                  <div className="text-center py-8 text-gray-400">
                    <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>No saved jobs yet</p>
                    <Link href="/jobs" className="text-brand-orange hover:underline text-sm mt-2 block">
                      Browse jobs →
                    </Link>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-700">
                      Complete your profile to get 5× more views from employers
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Work Experience', done: false },
                        { label: 'Education', done: false },
                        { label: 'Skills', done: true },
                        { label: 'Resume/CV', done: false },
                        { label: 'Profile Photo', done: false },
                        { label: 'Phone Number', done: true },
                      ].map(item => (
                        <div key={item.label} className="flex items-center gap-2 text-sm">
                          {item.done
                            ? <CheckCircle className="w-4 h-4 text-green-500" />
                            : <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          }
                          <span className={item.done ? 'text-gray-600' : 'text-gray-400'}>{item.label}</span>
                        </div>
                      ))}
                    </div>
                    <Link href="/profile" className="btn-primary block text-center py-3">
                      Complete Profile <ArrowRight className="inline w-4 h-4 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Suggested jobs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recommended for you</h3>
                <Link href="/jobs" className="text-brand-orange text-sm hover:underline">See all →</Link>
              </div>
              <div className="space-y-3">
                {suggestedJobs.map(job => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
