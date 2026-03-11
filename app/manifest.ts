import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'BeKenya — Find Where You Belong. Go There.',
    short_name: 'BeKenya',
    description:
      'Identity-first life-routing platform. Find paths, experiences, and community — Kenya-first, globally connected.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#5C0A14',
    orientation: 'portrait',
    icons: [
      {
        src: '/logo-bekenya-circle.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo-bekenya.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['business', 'productivity'],
    lang: 'en',
    dir: 'ltr',
  }
}
