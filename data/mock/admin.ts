/**
 * Mock Admin Data — single source of truth
 *
 * Used by: admin dashboard
 */

import type { Anchor, AdminPath, PlatformStats } from '@/types/domain'

// ─── Platform Stats ──────────────────────────────────────────────────────────

export const MOCK_PLATFORM_STATS: PlatformStats = {
  pioneers: 847,
  anchors: 23,
  openPaths: 156,
  chapters: 89,
  venturesBooked: 12,
  revenueKES: 124500,
  mpesaPending: 3,
}

// ─── All Anchors ─────────────────────────────────────────────────────────────

export const MOCK_ALL_ANCHORS: Anchor[] = [
  {
    id: 'a1',
    name: 'Orpul Safaris',
    country: 'KE',
    openPaths: 4,
    totalChapters: 12,
    verified: true,
  },
  {
    id: 'a2',
    name: 'Victoria Paradise',
    country: 'KE',
    openPaths: 3,
    totalChapters: 8,
    verified: true,
  },
  {
    id: 'a3',
    name: 'SafariTech Solutions',
    country: 'KE',
    openPaths: 5,
    totalChapters: 15,
    verified: true,
  },
  {
    id: 'a4',
    name: 'BeKenya Fashion',
    country: 'KE',
    openPaths: 2,
    totalChapters: 6,
    verified: false,
  },
  {
    id: 'a5',
    name: 'UTAMADUNI CBO',
    country: 'KE',
    openPaths: 1,
    totalChapters: 9,
    verified: true,
  },
  {
    id: 'a6',
    name: 'African Wildlife Foundation',
    country: 'KE',
    openPaths: 3,
    totalChapters: 5,
    verified: false,
  },
]

// ─── All Paths (Admin view) ──────────────────────────────────────────────────

export const MOCK_ALL_PATHS: AdminPath[] = [
  {
    id: 'pt1',
    title: 'Safari Guide & Wildlife Educator',
    anchor: 'Orpul Safaris',
    type: 'Explorer',
    chapters: 12,
    matchAvg: 78,
    status: 'Open',
    posted: '2024-01-10',
  },
  {
    id: 'pt2',
    title: 'Eco-Lodge Operations Manager',
    anchor: 'Victoria Paradise',
    type: 'Explorer/Pro',
    chapters: 8,
    matchAvg: 82,
    status: 'Open',
    posted: '2024-01-15',
  },
  {
    id: 'pt3',
    title: 'Software Engineer — Fintech',
    anchor: 'SafariTech Solutions',
    type: 'Professional',
    chapters: 15,
    matchAvg: 86,
    status: 'Open',
    posted: '2024-01-20',
  },
  {
    id: 'pt4',
    title: 'Fashion Designer & Brand Developer',
    anchor: 'BeKenya Fashion',
    type: 'Artisan',
    chapters: 6,
    matchAvg: 71,
    status: 'Paused',
    posted: '2024-02-01',
  },
  {
    id: 'pt5',
    title: 'Community Health Worker',
    anchor: 'UTAMADUNI CBO',
    type: 'Healer',
    chapters: 9,
    matchAvg: 90,
    status: 'Open',
    posted: '2024-02-10',
  },
  {
    id: 'pt6',
    title: 'Security Operations Lead',
    anchor: 'KCC',
    type: 'Guardian',
    chapters: 3,
    matchAvg: 65,
    status: 'Closed',
    posted: '2023-11-01',
  },
]

// ─── Social Media Platforms ──────────────────────────────────────────────────

export const MOCK_SOCIAL_PLATFORMS = [
  { name: 'Twitter/X', icon: '🐦', envKey: 'TWITTER_BEARER_TOKEN', connected: false },
  { name: 'Instagram', icon: '📸', envKey: 'INSTAGRAM_ACCESS_TOKEN', connected: false },
  { name: 'Facebook', icon: '👥', envKey: 'FACEBOOK_ACCESS_TOKEN', connected: false },
  { name: 'LinkedIn', icon: '💼', envKey: 'LINKEDIN_ACCESS_TOKEN', connected: false },
  { name: 'TikTok', icon: '🎵', envKey: 'TIKTOK_ACCESS_TOKEN', connected: false },
  { name: 'YouTube', icon: '▶️', envKey: 'YOUTUBE_API_KEY', connected: false },
  { name: 'Pinterest', icon: '📌', envKey: 'PINTEREST_ACCESS_TOKEN', connected: false },
  { name: 'Telegram', icon: '✈️', envKey: 'TELEGRAM_BOT_TOKEN', connected: false },
  { name: 'WhatsApp', icon: '💬', envKey: 'WHATSAPP_API_TOKEN', connected: false },
]

export const MOCK_SOCIAL_QUEUE = [
  {
    id: 1,
    platform: 'Twitter/X',
    content: 'New safari guide path at Orpul Safaris — 92% match score!',
    status: 'pending',
    created: '2024-03-09',
  },
  {
    id: 2,
    platform: 'Instagram',
    content: 'Victoria Paradise is looking for an Eco-Lodge Operations Manager',
    status: 'failed',
    created: '2024-03-08',
  },
  {
    id: 3,
    platform: 'LinkedIn',
    content: 'Safaricom opens Software Engineer path — remote-friendly!',
    status: 'posted',
    created: '2024-03-07',
  },
]

// ─── Environment Variables Status ────────────────────────────────────────────

export const MOCK_ENV_VARS = [
  { key: 'DATABASE_URL', status: 'missing' as const, note: 'Neon DB connection string' },
  { key: 'NEXTAUTH_SECRET', status: 'set' as const, note: 'Auth secret' },
  { key: 'NEXTAUTH_URL', status: 'set' as const, note: 'Auth base URL' },
  { key: 'MPESA_CONSUMER_KEY', status: 'missing' as const, note: 'Daraja API consumer key' },
  { key: 'MPESA_CONSUMER_SECRET', status: 'missing' as const, note: 'Daraja API consumer secret' },
  { key: 'MPESA_BUSINESS_SHORT_CODE', status: 'set' as const, note: 'Sandbox: 174379' },
  { key: 'MPESA_ENVIRONMENT', status: 'set' as const, note: 'sandbox' },
  { key: 'GOOGLE_CLIENT_ID', status: 'missing' as const, note: 'Google OAuth' },
  { key: 'GOOGLE_CLIENT_SECRET', status: 'missing' as const, note: 'Google OAuth' },
  { key: 'STRIPE_SECRET_KEY', status: 'missing' as const, note: 'Stripe test key' },
  { key: 'WHATSAPP_API_TOKEN', status: 'missing' as const, note: 'WhatsApp Business API' },
  { key: 'TWITTER_BEARER_TOKEN', status: 'missing' as const, note: 'Twitter/X API' },
]
