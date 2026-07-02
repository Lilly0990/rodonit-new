import type { MetadataRoute } from 'next'
import { getProductSlugs, getAllArticles } from '@/lib/cms'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rodonit-new.vercel.app'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE}/preparaty`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE}/distributors`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/contacts`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  let productPages: MetadataRoute.Sitemap = []
  let articlePages: MetadataRoute.Sitemap = []

  try {
    const slugs = await getProductSlugs()
    productPages = slugs.map((slug) => ({
      url: `${SITE}/preparaty/${slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  } catch {}

  try {
    const articles = await getAllArticles()
    articlePages = articles.map((a) => ({
      url: `${SITE}/blog/${a.slug}`,
      lastModified: a.publishedDate ? new Date(a.publishedDate) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  } catch {}

  return [...staticPages, ...productPages, ...articlePages]
}
