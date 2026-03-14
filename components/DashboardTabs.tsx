'use client'

import { useState } from 'react'

interface Tab {
  key: string
  label: string
}

interface DashboardTabsProps {
  tabs: Tab[]
  defaultTab?: string
  children: (activeTab: string) => React.ReactNode
}

export default function DashboardTabs({ tabs, defaultTab, children }: DashboardTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.key || '')

  return (
    <div>
      <div className="flex gap-1 border-b border-brand-accent/20">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'border-b-2 border-brand-accent text-brand-accent'
                : 'text-brand-text-muted hover:text-brand-text'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-4">{children(activeTab)}</div>
    </div>
  )
}
