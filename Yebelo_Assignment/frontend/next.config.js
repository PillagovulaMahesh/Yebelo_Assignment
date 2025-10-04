/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    // Ignore build errors temporarily (optional)
    ignoreBuildErrors: false,
  },
  images: {
    domains: [], // Add domains if fetching images externally
  },
};

module.exports = nextConfig;
