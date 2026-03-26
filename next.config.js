/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
      // OAuth provider profile pictures
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: '**.fbcdn.net' },
      { protocol: 'https', hostname: '**.twimg.com' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Compression
  compress: true,
  // Power by header removal
  poweredByHeader: false,
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
  // Redirects: legacy routes → current vocabulary
  async redirects() {
    return [
      { source: '/jobs', destination: '/opportunities', permanent: true },
      { source: '/jobs/:path*', destination: '/opportunities/:path*', permanent: true },
      { source: '/ventures', destination: '/opportunities', permanent: true },
      { source: '/ventures/:path*', destination: '/opportunities/:path*', permanent: true },
      { source: '/employers/dashboard', destination: '/host', permanent: true },
      { source: '/anchors/dashboard', destination: '/host', permanent: true },
      { source: '/post-job', destination: '/host', permanent: true },
      { source: '/anchors/post-path', destination: '/host', permanent: true },
    ]
  },
  // Experimental
  experimental: {
    optimizePackageImports: ['lucide-react'],
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

module.exports = nextConfig
