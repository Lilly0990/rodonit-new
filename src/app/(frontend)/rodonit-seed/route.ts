/**
 * Одноразовий seed endpoint.
 * Виклик: POST /api/seed  з хедером Authorization: Bearer <SEED_SECRET>
 * Після використання — видалити цей файл і задеплоїти знову.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { products } from '@/data/products'
import type { Product } from '@/data/products'
import { distributors } from '@/data/distributors'
import type { Distributor } from '@/data/distributors'
import rawArticles from '@/data/articles.json'
import rawContent from '@/data/products-content.json'

interface ArticleJson {
  slug: string
  title: string
  category: string
  excerpt: string
  paragraphs: string[]
}

interface ContentEntry {
  subtitle?: string
  about?: string
  uniqueness?: string
  hazard?: string
  form?: string
  shelf?: string
  ingredient?: string
  purpose?: string
  cultures?: string[]
  sections?: { heading: string; paragraphs: string[] }[]
}

const articles = rawArticles as ArticleJson[]
const content = rawContent as Record<string, ContentEntry>

const SEED_SECRET = process.env.SEED_SECRET || 'rodonit-seed-2026'

export async function POST(req: NextRequest) {
  const auth = req.headers.get('Authorization')
  if (auth !== `Bearer ${SEED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const results: string[] = []

  try {
    // 1. Settings
    await payload.updateGlobal({
      slug: 'settings',
      data: {
        siteName: 'Родоніт Агро',
        phones: [
          { number: '+38 (044) 499-50-49', label: 'Відділ продажу' },
          { number: '+38 (044) 502-31-56', label: '' },
          { number: '+38 (044) 502-31-57', label: '' },
          { number: '+38 (044) 502-61-58', label: '' },
          { number: '+38 (044) 502-32-59', label: '' },
          { number: '+38 (067) 402-44-14', label: 'Відділ продажу' },
        ],
        secretaryPhone: '+38 (067) 325-72-54',
        email: 'info@rodonit-agro.com.ua',
        address: 'вул. Юрія Шумського, 1б, оф.117\nКиїв, 02098, Україна',
        facebook: 'https://facebook.com/RodonitCompany',
        instagram: 'https://instagram.com/rodonit_company',
        contactFormEmail: 'info@rodonit-agro.com.ua',
        seoDefault: {
          title: 'Rodonit Agro — Препарати для захисту і живлення рослин',
          description: "Офіційний сайт компанії Родоніт Агро. Біостимулятори, мікродобрива, фунгіциди та ад'юванти для сучасного агробізнесу України.",
        },
      } as Record<string, unknown>,
    })
    results.push('✅ settings')

    // 2. Products
    for (const p of products as Product[]) {
      const existing = await payload.find({
        collection: 'products',
        where: { slug: { equals: p.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        results.push(`⏭ product: ${p.name}`)
        continue
      }
      const c = content[p.slug] ?? {}
      await payload.create({
        collection: 'products',
        data: {
          slug: p.slug,
          name: p.name,
          category: p.category as 'stymulyatory' | 'mikrodobryva' | 'fungitsydy' | 'adyuvanty',
          shortDescription: p.shortDescription ?? '',
          subtitle: c.subtitle ?? '',
          about: p.about ?? c.about ?? '',
          uniqueness: p.uniqueness ?? c.uniqueness ?? '',
          activeIngredient: p.activeIngredient ?? c.ingredient ?? '',
          purpose: p.purpose ?? c.purpose ?? '',
          hazardClass: p.hazardClass ?? c.hazard ?? '',
          form: p.form ?? c.form ?? '',
          shelfLife: p.shelfLife ?? c.shelf ?? '',
          cultures: (c.cultures ?? []).map((name: string) => ({ name })),
          applications: (p.applications ?? []).map((row) => ({
            culture: row.culture,
            phase: row.phase,
            rate: row.rate,
          })),
          sections: (c.sections ?? []).map((s) => ({
            heading: s.heading,
            paragraphs: (s.paragraphs ?? []).map((text: string) => ({ text })),
          })),
          active: true,
          _status: 'published',
        } as Record<string, unknown>,
      })
      results.push(`✅ product: ${p.name}`)
    }

    // 3. Distributors
    for (const d of distributors as Distributor[]) {
      const existing = await payload.find({
        collection: 'distributors',
        where: { slug: { equals: d.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        results.push(`⏭ distributor: ${d.company}`)
        continue
      }
      await payload.create({
        collection: 'distributors',
        data: {
          slug: d.slug,
          company: d.company,
          direction: d.direction as 'sady' | 'tehnichni-kultury' | 'ovochivnytstvo' | 'tsentralnyi-region',
          directionLabel: d.directionLabel ?? '',
          region: d.region ?? '',
          phones: d.phones.map((number: string) => ({ number })),
          active: true,
        } as Record<string, unknown>,
      })
      results.push(`✅ distributor: ${d.company}`)
    }

    // 4. Articles
    for (const a of articles) {
      const existing = await payload.find({
        collection: 'articles',
        where: { slug: { equals: a.slug } },
        limit: 1,
      })
      if (existing.docs.length > 0) {
        results.push(`⏭ article: ${a.title.slice(0, 40)}`)
        continue
      }
      await payload.create({
        collection: 'articles',
        data: {
          slug: a.slug,
          title: a.title,
          category: a.category as 'Новини' | 'Стаття',
          excerpt: a.excerpt,
          paragraphs: (a.paragraphs ?? []).map((text: string) => ({
            text,
            isHeading: false,
          })),
          _status: 'published',
        } as Record<string, unknown>,
      })
      results.push(`✅ article: ${a.title.slice(0, 40)}`)
    }

    return NextResponse.json({ ok: true, results })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    const cause = err instanceof Error ? String((err as NodeJS.ErrnoException & { cause?: unknown }).cause ?? '') : ''
    return NextResponse.json({ ok: false, error: message, cause, results }, { status: 500 })
  }
}
