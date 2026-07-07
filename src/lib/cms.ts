import { getPayload } from 'payload'
import config from '@payload-config'

let cached: Awaited<ReturnType<typeof getPayload>> | null = null
async function payloadClient() {
  if (!cached) cached = await getPayload({ config })
  return cached
}

// ─── Articles ──────────────────────────────────────────────────────────────

export interface CmsArticle {
  id: string | number
  slug: string
  title: string
  category: string
  excerpt: string
  publishedDate?: string | null
  coverImage?: { url?: string; alt?: string } | null
  paragraphs: { text: string; isHeading?: boolean | null }[]
  embeds?: { url: string; caption?: string | null }[]
}

export async function getAllArticles(): Promise<CmsArticle[]> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    where: { _status: { equals: 'published' } },
    limit: 100,
    sort: '-publishedDate',
    depth: 1,
  })
  return docs as unknown as CmsArticle[]
}

export async function getArticleBySlug(slug: string): Promise<CmsArticle | null> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 1,
  })
  return (docs[0] as unknown as CmsArticle) ?? null
}

// ─── Products ──────────────────────────────────────────────────────────────

export interface CmsApplicationRow {
  culture: string
  phase: string
  rate: string
}

export interface CmsProductSection {
  heading: string
  paragraphs: { text: string }[]
}

export interface CmsProduct {
  id: string | number
  slug: string
  name: string
  category: 'stymulyatory' | 'mikrodobryva' | 'fungitsydy' | 'adyuvanty' | 'bioprodukty'
  mainImage?: { url?: string; alt?: string } | null
  shortDescription?: string | null
  subtitle?: string | null
  about?: string | null
  uniqueness?: string | null
  activeIngredient?: string | null
  purpose?: string | null
  hazardClass?: string | null
  form?: string | null
  shelfLife?: string | null
  cultures?: { name: string }[]
  applications?: CmsApplicationRow[]
  sections?: CmsProductSection[]
  metaTitle?: string | null
  metaDescription?: string | null
}

export async function getAllProducts(locale = 'uk'): Promise<CmsProduct[]> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { active: { equals: true } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 50,
    depth: 1,
    locale: locale as 'uk' | 'en',
  })
  return docs as unknown as CmsProduct[]
}

export async function getProductBySlug(slug: string, locale = 'uk'): Promise<CmsProduct | null> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 1,
    depth: 1,
    locale: locale as 'uk' | 'en',
  })
  return (docs[0] as unknown as CmsProduct) ?? null
}

export async function getProductSlugs(): Promise<string[]> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [
        { active: { equals: true } },
        { _status: { equals: 'published' } },
      ],
    },
    limit: 100,
    depth: 0,
  })
  return docs.map((d: Record<string, unknown>) => d.slug as string)
}

// ─── Distributors ──────────────────────────────────────────────────────────

export interface CmsDistributor {
  id: string | number
  slug: string
  company: string
  direction: 'sady' | 'tehnichni-kultury' | 'ovochivnytstvo' | 'tsentralnyi-region'
  directionLabel?: string | null
  region?: string | null
  phones: { number: string }[]
}

export async function getAllDistributors(): Promise<CmsDistributor[]> {
  const payload = await payloadClient()
  const { docs } = await payload.find({
    collection: 'distributors',
    where: { active: { equals: true } },
    limit: 50,
    depth: 0,
  })
  return docs as unknown as CmsDistributor[]
}

// ─── Settings ──────────────────────────────────────────────────────────────

export interface CmsSiteSettings {
  siteName?: string | null
  phones?: { number: string; label?: string | null }[]
  secretaryPhone?: string | null
  email?: string | null
  address?: string | null
  facebook?: string | null
  instagram?: string | null
  telegram?: string | null
  youtube?: string | null
  tiktok?: string | null
  contactFormEmail?: string | null
  contactFormTelegramChatId?: string | null
  seoDefault?: { title?: string | null; description?: string | null }
}

export async function getSettings(): Promise<CmsSiteSettings> {
  const payload = await payloadClient()
  const data = await payload.findGlobal({ slug: 'settings', depth: 0 })
  return data as unknown as CmsSiteSettings
}
