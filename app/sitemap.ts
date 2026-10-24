import type { MetadataRoute } from 'next'

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? 'https://becountry.com'

const PAGES: [path: string, freq: 'daily' | 'monthly', priority: number][] = [
  ['', 'daily', 1],
  ['/opportunities', 'daily', 0.8],
  ['/agent', 'monthly', 0.6],
  ['/about', 'monthly', 0.5],
  ['/contact', 'monthly', 0.4],
  ['/privacy', 'monthly', 0.3],
  ['/login', 'monthly', 0.3],
  ['/signup', 'monthly', 0.3],
]

export default function sitemap(): MetadataRoute.Sitemap {
  return PAGES.map(([path, changeFrequency, priority]) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
