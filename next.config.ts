import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'rodonit.com.ua' },
    ],
  },
}

export default withPayload(nextConfig)
