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
};
export default nextConfig;
