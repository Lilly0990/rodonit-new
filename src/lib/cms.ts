import { getPayload } from 'payload'
import config from '@payload-config'

export interface CmsArticle {
  slug: string
  title: string
  category: string
  excerpt: string
  publishedDate?: string | null
  paragraphs: { text: string; isHeading?: boolean | null }[]
}

let cached: Awaited<ReturnType<typeof getPayload>> | null = null
async function payloadClient() {
  if (!cached) cached = await getPayload({ config })
  return cached
}

export async function getAllArticles(): Promise<CmsArticle[]> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    limit: 100,
    sort: '-publishedDate',
    depth: 0,
  })
  return docs as unknown as CmsArticle[]
}

export async function getArticleBySlug(slug: string): Promise<CmsArticle | null> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 0,
  })
  return (docs[0] as unknown as CmsArticle) ?? null
}
