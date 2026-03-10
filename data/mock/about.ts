/**
 * Mock / static data for the About page
 *
 * Extracted from app/about/page.tsx
 */

import { Heart, Globe, Shield, Leaf, Users, Anchor, Compass, BookOpen } from 'lucide-react'

export const ABOUT_VALUES = [
  {
    icon: Heart,
    title: 'Dignity First',
    desc: 'Every Pioneer deserves meaningful, dignified paths. We connect talent to opportunity — no matter where you start or where you are going.',
  },
  {
    icon: Globe,
    title: 'Global Reach, Local Roots',
    desc: 'Born in Kenya, built for the world. We understand African payment systems and global markets equally — M-Pesa to SEPA.',
  },
  {
    icon: Shield,
    title: 'Safe & Verified',
    desc: 'Every Anchor is vetted. Every Path is real. We protect Pioneers from exploitation — no gatekeepers, no hidden fees.',
  },
  {
    icon: Leaf,
    title: 'Regenerative Impact',
    desc: "We prioritize eco-tourism, conservation, and sustainable industries — because the planet is everyone's workplace.",
  },
]

export const ABOUT_SECTORS = [
  { emoji: '🦁', name: 'Safari & Wildlife' },
  { emoji: '🌿', name: 'Eco-Tourism' },
  { emoji: '💻', name: 'Technology' },
  { emoji: '🏥', name: 'Healthcare' },
  { emoji: '⚙️', name: 'Engineering' },
  { emoji: '🏦', name: 'Finance & Banking' },
  { emoji: '📚', name: 'Education' },
  { emoji: '🍽️', name: 'Hospitality' },
  { emoji: '🎨', name: 'Creative & Media' },
  { emoji: '🌾', name: 'Agriculture' },
  { emoji: '⛽', name: 'Energy' },
  { emoji: '🚛', name: 'Logistics & Trade' },
]

export const ABOUT_PAYMENT_METHODS = [
  { name: 'M-Pesa', desc: 'Kenya, Tanzania, Mozambique', icon: '📱' },
  { name: 'Flutterwave', desc: 'Pan-African payments', icon: '🌍' },
  { name: 'SEPA', desc: 'Europe bank transfer', icon: '🏦' },
  { name: 'Stripe', desc: 'Cards worldwide', icon: '💳' },
  { name: 'Wise', desc: 'Global transfers, low fee', icon: '🔄' },
  { name: 'Paystack', desc: 'Nigeria & Ghana', icon: '🇳🇬' },
]

export const ABOUT_STATS = [
  { value: '12,400+', label: 'Active Paths' },
  { value: '50+', label: 'Countries' },
  { value: '3,200', label: 'Pioneers Placed This Month' },
  { value: '12', label: 'Country Gates Open' },
]

export const ABOUT_VOCAB_ITEMS = [
  { icon: Users, label: 'Pioneers', desc: 'People seeking paths across borders' },
  { icon: Anchor, label: 'Anchors', desc: 'Organisations offering real paths' },
  { icon: Compass, label: 'Compass', desc: 'Smart routing from origin to destination' },
  { icon: BookOpen, label: 'Chapters', desc: 'Every engagement, documented fairly' },
]
