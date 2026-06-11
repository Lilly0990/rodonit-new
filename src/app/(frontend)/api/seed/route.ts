import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import articlesData from '@/data/articles.json'

type RawArticle = {
  slug: string
  title: string
  category: string
  excerpt: string
  paragraphs: string[]
}

function isHeading(p: string, next: string): boolean {
  return (
    p.length < 85 &&
    !/[.!?,;:]$/.test(p.trim()) &&
    !/^[a-zа-яіїєґ]/.test(p.trim()) &&
    (next?.length ?? 0) > 120
  )
}

// Тимчасовий seed-роут. GET /api/seed?key=seed-rodonit-2026
export async function GET(req: Request) {
  const key = new URL(req.url).searchParams.get('key')
  if (key !== 'seed-rodonit-2026') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 })
  }

  const payload = await getPayload({ config })
  const articles = articlesData as RawArticle[]
  const result: { created: string[]; skipped: string[] } = { created: [], skipped: [] }

  for (const a of articles) {
    const existing = await payload.find({
      collection: 'articles',
      where: { slug: { equals: a.slug } },
      limit: 1,
    })
    if (existing.docs.length > 0) {
      result.skipped.push(a.slug)
      continue
    }
    const paragraphs = a.paragraphs.map((text, i) => ({
      text,
      isHeading: isHeading(text, a.paragraphs[i + 1] ?? ''),
    }))
    await payload.create({
      collection: 'articles',
      data: {
        title: a.title,
        slug: a.slug,
        category: a.category as 'Новини' | 'Стаття',
        excerpt: a.excerpt,
        paragraphs,
        _status: 'published',
      },
    })
    result.created.push(a.slug)
  }

  return NextResponse.json(result)
}
