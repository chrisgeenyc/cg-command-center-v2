/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // node-ical (and its rrule dependency) break when bundled by webpack
    serverComponentsExternalPackages: ['node-ical'],
  },
};

export default nextConfig;
