import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  images: {
    qualities: [75, 90, 95, 100],
  },
}

export default nextConfig
