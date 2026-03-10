/**
 * Mock data for the Anchor Dashboard
 *
 * Extracted from app/anchors/dashboard/page.tsx
 * Will be replaced by service calls when DB is connected.
 */

import type { PioneerType } from '@/lib/vocabulary'

// Re-export local types used by the mock data
export type PathStatus = 'open' | 'paused' | 'closed'
export type ChapterStatus = 'new' | 'reviewed' | 'shortlisted' | 'declined'

export const MOCK_ANCHOR = {
  name: 'Ol Pejeta Conservancy',
  logo: '🦏',
  country: 'Kenya',
  sector: 'Safari & Wildlife',
  verified: true,
  memberSince: 'March 2024',
}

export const MOCK_PATHS = [
  {
    id: 'p1',
    title: 'Senior Wildlife Guide — Big Five',
    category: 'safari',
    type: 'Full Path',
    chapters: 14,
    status: 'open' as PathStatus,
    posted: '3 days ago',
    postedDate: '2026-03-05',
    matchScoreAvg: 87,
    views: 312,
    topMatches: [
      {
        id: 'pn001',
        alias: 'Pioneer #2847',
        type: 'explorer',
        score: 96,
        headline: 'Bush guide, 8 yrs Maasai Mara',
        country: 'Kenya',
      },
      {
        id: 'pn002',
        alias: 'Pioneer #1193',
        type: 'explorer',
        score: 91,
        headline: 'FGASA Level 3, fluent German',
        country: 'South Africa',
      },
      {
        id: 'pn003',
        alias: 'Pioneer #3341',
        type: 'explorer',
        score: 89,
        headline: 'Conservation MSc, tracking specialist',
        country: 'Kenya',
      },
    ],
  },
  {
    id: 'p2',
    title: 'Eco-Lodge Operations Manager',
    category: 'ecotourism',
    type: 'Full Path',
    chapters: 7,
    status: 'open' as PathStatus,
    posted: '1 week ago',
    postedDate: '2026-03-01',
    matchScoreAvg: 79,
    views: 184,
    topMatches: [
      {
        id: 'pn004',
        alias: 'Pioneer #0921',
        type: 'professional',
        score: 88,
        headline: 'Hospitality GM, 6-lodge portfolio',
        country: 'Kenya',
      },
      {
        id: 'pn005',
        alias: 'Pioneer #4412',
        type: 'professional',
        score: 82,
        headline: 'Sustainability manager, eco-certified',
        country: 'Tanzania',
      },
      {
        id: 'pn006',
        alias: 'Pioneer #2203',
        type: 'guardian',
        score: 77,
        headline: 'Ops lead, camp logistics expert',
        country: 'Uganda',
      },
    ],
  },
  {
    id: 'p3',
    title: 'Content Creator — Safari Stories',
    category: 'media',
    type: 'Part Path',
    chapters: 22,
    status: 'open' as PathStatus,
    posted: '2 weeks ago',
    postedDate: '2026-02-22',
    matchScoreAvg: 74,
    views: 521,
    topMatches: [
      {
        id: 'pn007',
        alias: 'Pioneer #5501',
        type: 'creator',
        score: 93,
        headline: 'Wildlife photographer, 2M IG followers',
        country: 'Germany',
      },
      {
        id: 'pn008',
        alias: 'Pioneer #3388',
        type: 'creator',
        score: 85,
        headline: 'Video journalist, BBC contributor',
        country: 'UK',
      },
      {
        id: 'pn009',
        alias: 'Pioneer #1024',
        type: 'creator',
        score: 81,
        headline: 'Drone pilot + editor, 50+ safari reels',
        country: 'Kenya',
      },
    ],
  },
  {
    id: 'p4',
    title: 'Community Health Liaison',
    category: 'health',
    type: 'Full Path',
    chapters: 4,
    status: 'paused' as PathStatus,
    posted: '3 weeks ago',
    postedDate: '2026-02-15',
    matchScoreAvg: 68,
    views: 97,
    topMatches: [],
  },
]

export const MOCK_ANCHOR_CHAPTERS = [
  {
    id: 'ch001',
    alias: 'Pioneer #2847',
    pathTitle: 'Senior Wildlife Guide — Big Five',
    pathId: 'p1',
    type: 'explorer' as PioneerType,
    matchScore: 96,
    skills: ['Big Five tracking', 'Bush safety', 'German language', 'FGASA L3'],
    headline: 'Bush guide with 8 years in the Maasai Mara ecosystem',
    status: 'new' as ChapterStatus,
    openedAt: '2 hours ago',
    country: 'Kenya',
  },
  {
    id: 'ch002',
    alias: 'Pioneer #5501',
    pathTitle: 'Content Creator — Safari Stories',
    pathId: 'p3',
    type: 'creator' as PioneerType,
    matchScore: 93,
    skills: ['Wildlife photography', 'Drone operation', 'Instagram reels', 'Adobe Suite'],
    headline: 'Wildlife photographer with 2M+ Instagram followers',
    status: 'shortlisted' as ChapterStatus,
    openedAt: '5 hours ago',
    country: 'Germany',
  },
  {
    id: 'ch003',
    alias: 'Pioneer #0921',
    pathTitle: 'Eco-Lodge Operations Manager',
    pathId: 'p2',
    type: 'professional' as PioneerType,
    matchScore: 88,
    skills: ['Lodge management', 'P&L ownership', 'Eco-certification', 'Staff training'],
    headline: 'Hospitality GM with 6-lodge portfolio across East Africa',
    status: 'reviewed' as ChapterStatus,
    openedAt: '1 day ago',
    country: 'Kenya',
  },
  {
    id: 'ch004',
    alias: 'Pioneer #1193',
    pathTitle: 'Senior Wildlife Guide — Big Five',
    pathId: 'p1',
    type: 'explorer' as PioneerType,
    matchScore: 91,
    skills: ['FGASA L3', 'German', 'Botany', 'Night drives'],
    headline: 'South African guide, fluent German, 5-star private reserves',
    status: 'new' as ChapterStatus,
    openedAt: '1 day ago',
    country: 'South Africa',
  },
  {
    id: 'ch005',
    alias: 'Pioneer #3388',
    pathTitle: 'Content Creator — Safari Stories',
    pathId: 'p3',
    type: 'creator' as PioneerType,
    matchScore: 85,
    skills: ['Video journalism', 'Documentary', 'Final Cut Pro', 'Swahili'],
    headline: 'BBC contributor and video journalist covering East Africa',
    status: 'declined' as ChapterStatus,
    openedAt: '2 days ago',
    country: 'UK',
  },
  {
    id: 'ch006',
    alias: 'Pioneer #4412',
    pathTitle: 'Eco-Lodge Operations Manager',
    pathId: 'p2',
    type: 'professional' as PioneerType,
    matchScore: 82,
    skills: ['Sustainability', 'Carbon offsetting', 'Team leadership', 'Swahili'],
    headline: 'Sustainability manager, eco-certified, Tanzania experience',
    status: 'new' as ChapterStatus,
    openedAt: '3 days ago',
    country: 'Tanzania',
  },
  {
    id: 'ch007',
    alias: 'Pioneer #2203',
    pathTitle: 'Eco-Lodge Operations Manager',
    pathId: 'p2',
    type: 'guardian' as PioneerType,
    matchScore: 77,
    skills: ['Camp logistics', 'Vehicle fleet', 'Supply chain', 'Radio comms'],
    headline: 'Ops lead specialising in remote camp logistics and safety',
    status: 'reviewed' as ChapterStatus,
    openedAt: '4 days ago',
    country: 'Uganda',
  },
]

export const MOCK_COMPASS_RECOMMENDATIONS = [
  {
    id: 'pn010',
    alias: 'Pioneer #7731',
    type: 'explorer' as PioneerType,
    score: 98,
    headline: 'Master tracker, 12yr Amboseli, FGASA L3+',
    country: 'Kenya',
    matchedPath: 'Senior Wildlife Guide',
  },
  {
    id: 'pn011',
    alias: 'Pioneer #6642',
    type: 'creator' as PioneerType,
    score: 94,
    headline: 'Wildlife filmmaker — Netflix credits, 4K drone',
    country: 'South Africa',
    matchedPath: 'Content Creator — Safari Stories',
  },
  {
    id: 'pn012',
    alias: 'Pioneer #4499',
    type: 'professional' as PioneerType,
    score: 91,
    headline: 'Eco-lodge GM, Aman & Four Seasons background',
    country: 'UK',
    matchedPath: 'Eco-Lodge Operations Manager',
  },
]

export const MOCK_ACTIVITY = [
  {
    pioneer: 'Pioneer #2847',
    path: 'Senior Wildlife Guide — Big Five',
    when: '2 hours ago',
    score: 96,
  },
  {
    pioneer: 'Pioneer #5501',
    path: 'Content Creator — Safari Stories',
    when: '5 hours ago',
    score: 93,
  },
  {
    pioneer: 'Pioneer #1193',
    path: 'Senior Wildlife Guide — Big Five',
    when: '1 day ago',
    score: 91,
  },
  {
    pioneer: 'Pioneer #0921',
    path: 'Eco-Lodge Operations Manager',
    when: '1 day ago',
    score: 88,
  },
  {
    pioneer: 'Pioneer #4412',
    path: 'Eco-Lodge Operations Manager',
    when: '3 days ago',
    score: 82,
  },
]

export const COUNTRY_BREAKDOWN = [
  { country: 'Kenya', flag: '🇰🇪', count: 21, pct: 45 },
  { country: 'South Africa', flag: '🇿🇦', count: 9, pct: 19 },
  { country: 'Germany', flag: '🇩🇪', count: 6, pct: 13 },
  { country: 'Tanzania', flag: '🇹🇿', count: 5, pct: 11 },
  { country: 'United Kingdom', flag: '🇬🇧', count: 4, pct: 9 },
  { country: 'Uganda', flag: '🇺🇬', count: 2, pct: 4 },
]

export const ROUTE_CORRIDORS = [
  { route: 'Kenya → Germany', count: 6, trend: '+2 this week' },
  { route: 'Kenya → UAE', count: 4, trend: '+1 this week' },
  { route: 'South Africa → Kenya', count: 3, trend: 'Stable' },
  { route: 'Tanzania → Kenya', count: 3, trend: '+3 this week' },
  { route: 'Uganda → Kenya', count: 2, trend: 'New' },
]

export const PIONEER_TYPE_BREAKDOWN: { type: PioneerType; count: number }[] = [
  { type: 'explorer', count: 18 },
  { type: 'professional', count: 12 },
  { type: 'creator', count: 9 },
  { type: 'guardian', count: 4 },
  { type: 'artisan', count: 3 },
  { type: 'healer', count: 1 },
]
