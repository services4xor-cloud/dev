import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bekenya.com'
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    // ── Core pages ──────────────────────────────────────────────────────────
    { url: baseUrl,                  priority: 1.0, changeFrequency: 'daily',   lastModified: now },
    { url: `${baseUrl}/jobs`,        priority: 0.9, changeFrequency: 'hourly',  lastModified: now },
    { url: `${baseUrl}/post-job`,    priority: 0.8, changeFrequency: 'weekly',  lastModified: now },
    { url: `${baseUrl}/pricing`,     priority: 0.7, changeFrequency: 'weekly',  lastModified: now },
    { url: `${baseUrl}/about`,       priority: 0.6, changeFrequency: 'monthly', lastModified: now },
    { url: `${baseUrl}/login`,       priority: 0.5, changeFrequency: 'monthly', lastModified: now },
    { url: `${baseUrl}/signup`,      priority: 0.5, changeFrequency: 'monthly', lastModified: now },

    // ── Platform navigation ──────────────────────────────────────────────────
    { url: `${baseUrl}/compass`,     priority: 0.9, changeFrequency: 'daily',   lastModified: now },
    { url: `${baseUrl}/ventures`,    priority: 0.9, changeFrequency: 'daily',   lastModified: now },
    { url: `${baseUrl}/experiences`, priority: 0.8, changeFrequency: 'weekly',  lastModified: now },
    { url: `${baseUrl}/charity`,     priority: 0.7, changeFrequency: 'weekly',  lastModified: now },
    { url: `${baseUrl}/business`,    priority: 0.6, changeFrequency: 'monthly', lastModified: now },
    { url: `${baseUrl}/onboarding`,  priority: 0.7, changeFrequency: 'monthly', lastModified: now },

    // ── Be[Country] landing pages ────────────────────────────────────────────
    { url: `${baseUrl}/be/ke`,       priority: 1.0, changeFrequency: 'daily',   lastModified: now },
    { url: `${baseUrl}/be/de`,       priority: 0.8, changeFrequency: 'weekly',  lastModified: now },
    { url: `${baseUrl}/be/us`,       priority: 0.8, changeFrequency: 'weekly',  lastModified: now },
    { url: `${baseUrl}/be/ng`,       priority: 0.8, changeFrequency: 'weekly',  lastModified: now },

    // ── Anchor / employer pages ──────────────────────────────────────────────
    { url: `${baseUrl}/anchors/dashboard`, priority: 0.5, changeFrequency: 'weekly', lastModified: now },

    // ── Safari experience URLs ───────────────────────────────────────────────
    { url: `${baseUrl}/experiences/victoria-deep-sea`,    priority: 0.8, changeFrequency: 'weekly', lastModified: now },
    { url: `${baseUrl}/experiences/victoria-tsavo-east`,  priority: 0.8, changeFrequency: 'weekly', lastModified: now },
    { url: `${baseUrl}/experiences/maasai-mara-3day`,     priority: 0.8, changeFrequency: 'weekly', lastModified: now },
  ]

  return staticPages
}
