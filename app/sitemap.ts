import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bekenya.com'
  const now = new Date()

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${baseUrl}/jobs`, priority: 0.9, changeFrequency: 'hourly' as const },
    { url: `${baseUrl}/post-job`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/pricing`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/about`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/login`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/signup`, priority: 0.5, changeFrequency: 'monthly' as const },
  ]

  return staticPages.map(page => ({
    ...page,
    lastModified: now,
  }))
}
