/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {}, // keep as empty object, not true
  },
  webpack(config) {
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
    };
    return config;
  },
  turbopack: false, // disable Turbopack to ensure Node.js runtime works
};

module.exports = nextConfig;
