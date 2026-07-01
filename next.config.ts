import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'rodonit.com.ua' },
    ],
  },
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Keep drizzle-kit external so Turbopack doesn't hash-transform require('drizzle-kit/api')
  serverExternalPackages: ['drizzle-kit'],
}

export default withPayload(nextConfig)
