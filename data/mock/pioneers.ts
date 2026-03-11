/**
 * Mock Pioneer Data — single source of truth
 *
 * Used by: pioneer dashboard, admin dashboard, search results
 */

import type { PioneerProfile, AdminPioneer, Chapter, AdminChapter } from '@/types/domain'
import type { PioneerType } from '@/lib/vocabulary'

// ─── Pioneer Dashboard Mock ──────────────────────────────────────────────────

export const MOCK_CURRENT_PIONEER: PioneerProfile = {
  id: 'pioneer-amara',
  name: 'Amara Osei',
  pioneerType: 'explorer' as PioneerType,
  fromCountry: 'KE',
  toCountries: ['DE', 'GB'],
  route: 'Kenya → Germany',
  routeStrength: 'Direct Route',
  profileComplete: 78,
  referralCode: 'PIONEER-AMARA',
  phone: '+254 712 345 678',
  headline: 'Safari Guide & Wildlife Educator with 5 years in Maasai Mara',
  bio: "Passionate about connecting people with Kenya's breathtaking wildlife. Specializing in eco-tourism and conservation storytelling.",
  skills: ['Wildlife knowledge', 'Swahili', 'First Aid', 'Guest relations', 'Photography'],
  yearsExperience: 5,
  joinedDate: 'Jan 2024',
}

// ─── Pioneer Chapters ────────────────────────────────────────────────────────

export const MOCK_CHAPTERS: Chapter[] = [
  {
    id: 'ch-001',
    pioneerId: 'pioneer-amara',
    pathId: 'path-001',
    pathTitle: 'Safari Guide & Wildlife Educator',
    anchorName: 'Orpul Safaris',
    openedAt: '2024-03-01',
    status: 'SHORTLISTED',
    matchScore: 92,
  },
  {
    id: 'ch-002',
    pioneerId: 'pioneer-amara',
    pathId: 'path-008',
    pathTitle: 'Wildlife Photographer — Conservation Storytelling',
    anchorName: 'African Wildlife Foundation',
    openedAt: '2024-02-20',
    status: 'REVIEWED',
    matchScore: 87,
  },
  {
    id: 'ch-003',
    pioneerId: 'pioneer-amara',
    pathId: 'path-002',
    pathTitle: 'Eco-Lodge Operations Manager',
    anchorName: 'Victoria Paradise',
    openedAt: '2024-02-10',
    status: 'PENDING',
    matchScore: 74,
  },
]

// ─── Admin: Recent Pioneer Signups ───────────────────────────────────────────

export const MOCK_RECENT_PIONEERS = [
  { id: 'p1', name: 'Amara Osei', country: 'KE → DE', type: 'Explorer', joined: '2024-03-08' },
  {
    id: 'p2',
    name: 'Priya Sharma',
    country: 'KE → GB',
    type: 'Professional',
    joined: '2024-03-07',
  },
  { id: 'p3', name: 'James Mwangi', country: 'KE → KE', type: 'Guardian', joined: '2024-03-07' },
  { id: 'p4', name: 'Fatuma Ali', country: 'KE → DE', type: 'Healer', joined: '2024-03-06' },
  { id: 'p5', name: 'David Kiprop', country: 'KE → US', type: 'Creator', joined: '2024-03-06' },
]

// ─── Admin: All Pioneers Table ───────────────────────────────────────────────

export const MOCK_ALL_PIONEERS: AdminPioneer[] = [
  {
    id: 'p1',
    name: 'Amara Osei',
    type: 'Explorer',
    from: 'KE',
    to: 'DE',
    skills: 5,
    chapters: 2,
    joined: '2024-01-15',
    status: 'Active',
  },
  {
    id: 'p2',
    name: 'Priya Sharma',
    type: 'Professional',
    from: 'KE',
    to: 'GB',
    skills: 8,
    chapters: 3,
    joined: '2024-01-20',
    status: 'Active',
  },
  {
    id: 'p3',
    name: 'James Mwangi',
    type: 'Guardian',
    from: 'KE',
    to: 'KE',
    skills: 4,
    chapters: 1,
    joined: '2024-02-01',
    status: 'Active',
  },
  {
    id: 'p4',
    name: 'Fatuma Ali',
    type: 'Healer',
    from: 'KE',
    to: 'DE',
    skills: 6,
    chapters: 4,
    joined: '2024-02-10',
    status: 'Active',
  },
  {
    id: 'p5',
    name: 'David Kiprop',
    type: 'Creator',
    from: 'KE',
    to: 'US',
    skills: 7,
    chapters: 2,
    joined: '2024-02-15',
    status: 'Active',
  },
  {
    id: 'p6',
    name: 'Sarah Otieno',
    type: 'Artisan',
    from: 'KE',
    to: 'FR',
    skills: 3,
    chapters: 0,
    joined: '2024-03-01',
    status: 'Incomplete',
  },
  {
    id: 'p7',
    name: 'Moses Kipchoge',
    type: 'Explorer',
    from: 'KE',
    to: 'ZA',
    skills: 2,
    chapters: 1,
    joined: '2024-03-05',
    status: 'Active',
  },
]

// ─── Admin: Recent Chapters ──────────────────────────────────────────────────

export const MOCK_RECENT_CHAPTERS: AdminChapter[] = [
  {
    pioneer: 'Amara Osei',
    path: 'Safari Guide & Wildlife Educator',
    anchor: 'Orpul Safaris',
    score: 92,
    status: 'Shortlisted',
  },
  {
    pioneer: 'Priya Sharma',
    path: 'Software Engineer — Fintech',
    anchor: 'SafariTech Solutions',
    score: 88,
    status: 'Under Review',
  },
  {
    pioneer: 'James Mwangi',
    path: 'Security Operations Lead',
    anchor: 'Kenyatta Conference Centre',
    score: 79,
    status: 'New',
  },
  {
    pioneer: 'David Kiprop',
    path: 'Content Creator & Social Media Manager',
    anchor: 'Safari & Wild Media',
    score: 85,
    status: 'Offer',
  },
  {
    pioneer: 'Fatuma Ali',
    path: 'Community Health Worker',
    anchor: 'UTAMADUNI CBO',
    score: 95,
    status: 'Shortlisted',
  },
]
