'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Eye, Users, Clock, TrendingUp, CheckCircle, PauseCircle, Bell, BarChart3, Briefcase } from 'lucide-react'

const mockJobs = [
  {
    id: '1', title: 'Senior Software Engineer', applicants: 47, views: 312,
    status: 'ACTIVE', tier: 'FEATURED', posted: '3 days ago', expires: '42 days',
  },
  {
    id: '2', title: 'Marketing Manager', applicants: 23, views: 156,
    status: 'ACTIVE', tier: 'BASIC', posted: '1 week ago', expires: '23 days',
  },
  {
    id: '3', title: 'Sales Representative (Nairobi)', applicants: 89, views: 520,
    status: 'PAUSED', tier: 'BASIC', posted: '2 weeks ago', expires: '15 days',
  },
]

const tierColors: Record<string, string> = {
  BASIC: 'bg-gray-100 text-gray-600',
  FEATURED: 'bg-orange-50 text-brand-orange',
  PREMIUM: 'bg-purple-50 text-purple-600',
}

const statusIcons: Record<string, React.ComponentType<{className?: string}>> = {
  ACTIVE: CheckCircle,
  PAUSED: PauseCircle,
}

export default function EmployerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants' | 'analytics'>('jobs')

  const totalApplicants = mockJobs.reduce((sum, j) => sum + j.applicants, 0)
  const totalViews = mockJobs.reduce((sum, j) => sum + j.views, 0)
  const activeJobs = mockJobs.filter(j => j.status === 'ACTIVE').length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            <span className="text-gray-900">Beke</span>
            <span className="text-brand-orange">nya</span>
            <span className="ml-2 text-sm text-gray-400 font-normal">Employer</span>
          </Link>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:text-gray-700">
              <Bell className="w-5 h-5" />
            </button>
            <Link href="/post-job" className="btn-primary px-4 py-2 text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Post Job
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Briefcase, label: 'Active Jobs', value: activeJobs, color: 'text-brand-orange bg-orange-50' },
            { icon: Users, label: 'Total Applicants', value: totalApplicants, color: 'text-blue-500 bg-blue-50' },
            { icon: Eye, label: 'Job Views', value: totalViews, color: 'text-brand-teal bg-teal-50' },
            { icon: TrendingUp, label: 'Avg. per Job', value: Math.round(totalApplicants / mockJobs.length), color: 'text-green-500 bg-green-50' },
          ].map(stat => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            {([
              { key: 'jobs', label: 'Job Posts', icon: Briefcase },
              { key: 'applicants', label: 'Applicants', icon: Users },
              { key: 'analytics', label: 'Analytics', icon: BarChart3 },
            ] as const).map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center justify-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-brand-orange text-brand-orange'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="p-6">
            {activeTab === 'jobs' && (
              <div className="space-y-3">
                {mockJobs.map(job => {
                  const StatusIcon = statusIcons[job.status] || Clock
                  return (
                    <div key={job.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{job.title}</span>
                          <span className={`badge text-xs ${tierColors[job.tier]}`}>{job.tier}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" /> {job.applicants} applicants
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" /> {job.views} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {job.expires} left
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`flex items-center gap-1 text-xs font-medium ${job.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-400'}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {job.status}
                        </span>
                        <Link href={`/jobs/${job.id}`} className="btn-secondary text-xs py-1.5 px-3">
                          View
                        </Link>
                      </div>
                    </div>
                  )
                })}

                <Link href="/post-job" className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-colors">
                  <Plus className="w-4 h-4" />
                  Post a new job
                </Link>
              </div>
            )}

            {activeTab === 'applicants' && (
              <div className="text-center py-12 text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-gray-500 font-medium mb-1">Applicant management</p>
                <p className="text-sm">Review, shortlist and contact applicants — coming soon.</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12 text-gray-400">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-gray-500 font-medium mb-1">Analytics dashboard</p>
                <p className="text-sm">View job performance, click-through rates and more — coming soon.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
