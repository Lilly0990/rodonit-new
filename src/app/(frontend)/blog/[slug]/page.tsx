import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { articles, getArticle } from '@/data/articles'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) return { title: 'Статтю не знайдено' }
  const url = `${SITE}/blog/${article.slug}`
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
    },
  }
}

// Евристика: короткий рядок без кінцевої пунктуації, з великої літери,
// за яким іде розгорнутий абзац → підзаголовок (H2)
type Block = { type: 'heading' | 'paragraph'; text: string }

function toBlocks(paragraphs: string[]): Block[] {
  const blocks: Block[] = []
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i].trim()
    const next = paragraphs[i + 1]?.trim() ?? ''
    const looksLikeHeading =
      p.length < 85 &&
      !/[.!?,;:]$/.test(p) &&
      !/^[a-zа-яіїєґ]/.test(p) &&
      next.length > 120
    blocks.push({ type: looksLikeHeading ? 'heading' : 'paragraph', text: p })
  }
  return blocks
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  const url = `${SITE}/blog/${article.slug}`
  const blocks = toBlocks(article.paragraphs)

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': article.category === 'Новини' ? 'NewsArticle' : 'Article',
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    inLanguage: 'uk-UA',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Organization', name: 'Родоніт Агро' },
    publisher: {
      '@type': 'Organization',
      name: 'ТОВ «Родоніт Агро»',
      logo: { '@type': 'ImageObject', url: `${SITE}/logo.png` },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Головна', item: SITE },
      { '@type': 'ListItem', position: 2, name: 'Новини', item: `${SITE}/blog` },
      { '@type': 'ListItem', position: 3, name: article.title, item: url },
    ],
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />

        {/* Хлібні крихти */}
        <nav aria-label="Хлібні крихти" className="border-b border-gray-200 bg-white/60">
          <div className="max-w-3xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-2 flex-wrap">
            <Link href="/" className="hover:text-green-700">Головна</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-green-700">Новини</Link>
            <span>/</span>
            <span className="text-gray-800 line-clamp-1">{article.title}</span>
          </div>
        </nav>

        <article className="max-w-3xl mx-auto px-4 py-12">
          <header className="mb-8">
            <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded">
              {article.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 leading-tight">
              {article.title}
            </h1>
            <p className="text-lg text-gray-600 mt-4">{article.excerpt}</p>
          </header>

          <div className="space-y-4 text-gray-700 leading-relaxed">
            {blocks.map((b, i) =>
              b.type === 'heading' ? (
                <h2 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-2">
                  {b.text}
                </h2>
              ) : (
                <p key={i}>{b.text}</p>
              ),
            )}
          </div>

          <footer className="mt-12 pt-8 border-t border-gray-200">
            <Link href="/blog" className="text-green-700 font-medium hover:underline">
              ← Усі статті
            </Link>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  )
}
