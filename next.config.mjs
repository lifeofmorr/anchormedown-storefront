/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      // Higgsfield campaign CDN — the website's campaign films/stills
      // (lib/campaign.ts) are referenced at their live URLs, never re-hosted.
      { protocol: 'https', hostname: 'd2ol7oe51mr4n9.cloudfront.net' },
    ],
  },
  // Wave 2 (blog parity): the live store serves the journal at
  // /blogs/news/<handle>; this app serves it at /blog/<handle>.
  // Rewrites keep the live URL shape resolving to the same article.
  async rewrites() {
    return [
      { source: '/blogs/news', destination: '/blog' },
      { source: '/blogs/news/:handle', destination: '/blog/:handle' },
    ];
  },
  // Elevation v2: baseline security headers on every response.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
};
export default nextConfig;
