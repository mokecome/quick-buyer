/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    '0.0.0.0',
    '127.0.0.1',
    'localhost',
  ],
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig
