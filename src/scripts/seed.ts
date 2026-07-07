/**
 * Seed script — заповнює Payload CMS початковими даними.
 * Запуск: npm run seed
 * Для прод (Neon): POSTGRES_URL="..." npm run seed
 */
import { getPayload } from 'payload'
import config from '../payload.config'
import { products } from '../data/products'
import type { Product } from '../data/products'
import { distributors } from '../data/distributors'
import type { Distributor } from '../data/distributors'
import rawArticles from '../data/articles.json'
import rawContent from '../data/products-content.json'

// ── Типи ───────────────────────────────────────────────────────────────────

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

// ── Допоміжна: пропустити якщо вже існує ──────────────────────────────────

async function exists(payload: Awaited<ReturnType<typeof getPayload>>, collection: string, slug: string): Promise<boolean> {
  try {
    const { docs } = await payload.find({
      collection: collection as 'products',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return docs.length > 0
  } catch {
    return false
  }
}

// ── Головна функція ─────────────────────────────────────────────────────────

async function seed() {
  console.log('🌱 Починаю seed...\n')
  const payload = await getPayload({ config })

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. Settings global
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('📋 Налаштування (settings global)...')
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
        description: 'Офіційний сайт компанії Родоніт Агро. Біостимулятори, мікродобрива, фунгіциди та ад\'юванти для сучасного агробізнесу України.',
      },
    },
  })
  console.log('  ✅ Settings оновлено\n')

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. Препарати (products)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('🧪 Препарати (products)...')
  for (const p of products as Product[]) {
    if (await exists(payload, 'products', p.slug)) {
      console.log(`  ⏭  ${p.name} — вже існує, пропускаю`)
      continue
    }

    const c = content[p.slug] ?? {}

    await payload.create({
      collection: 'products',
      data: {
        slug: p.slug,
        name: p.name,
        category: p.category as 'stymulyatory' | 'mikrodobryva' | 'fungitsydy' | 'adyuvanty' | 'bioprodukty',
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
    console.log(`  ✅ ${p.name}`)
  }
  console.log()

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. Дистриб'ютори (distributors)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log("🏢 Дистриб'ютори (distributors)...")
  for (const d of distributors as Distributor[]) {
    if (await exists(payload, 'distributors', d.slug)) {
      console.log(`  ⏭  ${d.company} — вже існує, пропускаю`)
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
    console.log(`  ✅ ${d.company}`)
  }
  console.log()

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. Статті (articles)
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('📰 Статті (articles)...')
  for (const a of articles) {
    if (await exists(payload, 'articles', a.slug)) {
      console.log(`  ⏭  "${a.title}" — вже існує, пропускаю`)
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
    console.log(`  ✅ ${a.title.slice(0, 60)}`)
  }
  console.log()

  console.log('🎉 Seed завершено успішно!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed помилка:', err)
  process.exit(1)
})
