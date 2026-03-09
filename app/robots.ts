import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bekenya.com'

  return {
    rules: [
      {
        // Allow all crawlers on public pages
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/anchors/dashboard/',
          '/onboarding/',
          '/admin/',
        ],
        // Note: crawlDelay is not in the MetadataRoute.Robots type but is supported
        // by major crawlers via the raw output. See crawlDelay below per-bot.
      },
      // Per-bot crawl delay for well-known bots
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/anchors/dashboard/', '/onboarding/', '/admin/'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/anchors/dashboard/', '/onboarding/', '/admin/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'Slurp',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/anchors/dashboard/', '/onboarding/', '/admin/'],
        crawlDelay: 1,
      },
      {
        userAgent: 'DuckDuckBot',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/anchors/dashboard/', '/onboarding/', '/admin/'],
        crawlDelay: 1,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
