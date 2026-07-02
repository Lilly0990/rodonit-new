import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getArticleBySlug } from '@/lib/cms'
import VideoEmbed from '@/components/VideoEmbed'
import { JSX } from 'react'

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'

export const dynamic = 'force-dynamic'

// Рендерить блоки статті: заголовки → h2, рядки з "• " групуються в <ul>, решта → <p>
function renderBlocks(blocks: { text: string; isHeading?: boolean | null }[]): JSX.Element[] {
  const out: JSX.Element[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) {
      out.push(
        <ul key={`ul-${out.length}`} className="list-disc pl-6 space-y-2 marker:text-green-600">
          {list.map((t, j) => <li key={j}>{t}</li>)}
        </ul>,
      )
      list = []
    }
  }
  for (const b of blocks) {
    const text = b.text ?? ''
    if (!b.isHeading && text.startsWith('• ')) {
      list.push(text.slice(2))
      continue
    }
    flush()
    if (b.isHeading) {
      out.push(
        <h2 key={`h-${out.length}`} className="text-2xl font-bold text-gray-900 mt-10 mb-3 leading-snug">
          {text}
        </h2>,
      )
    } else {
      out.push(<p key={`p-${out.length}`}>{text}</p>)
    }
  }
  flush()
  return out
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Статтю не знайдено' }
  const url = `${SITE}/blog/${article.slug}`
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: url },
    openGraph: { type: 'article', title: article.title, description: article.excerpt, url },
    twitter: { card: 'summary_large_image', title: article.title, description: article.excerpt },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const url = `${SITE}/blog/${article.slug}`

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': article.category === 'Новини' ? 'NewsArticle' : 'Article',
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    inLanguage: 'uk-UA',
    ...(article.publishedDate ? { datePublished: article.publishedDate } : {}),
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-4 leading-tight">{article.title}</h1>
            <p className="text-lg text-gray-600 mt-4">{article.excerpt}</p>
          </header>

          {/* Обкладинка */}
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-green-50">
            <Image
              src={article.coverImage?.url ?? `/blog/${article.slug}.jpg`}
              alt={article.coverImage?.alt ?? article.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>

          <div className="space-y-5 text-[17px] text-gray-700 leading-[1.8]">
            {renderBlocks(article.paragraphs)}
          </div>

          {/* Відео YouTube / TikTok */}
          {(article.embeds ?? []).length > 0 && (
            <div className="mt-8">
              {(article.embeds ?? []).map((embed, i) => (
                <VideoEmbed key={i} url={embed.url} caption={embed.caption} />
              ))}
            </div>
          )}

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
