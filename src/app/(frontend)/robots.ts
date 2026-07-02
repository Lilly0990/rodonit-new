import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rodonit-new.vercel.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Пошукові та AI-боти (GEO/AEO): дозволяємо все, крім службового
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
