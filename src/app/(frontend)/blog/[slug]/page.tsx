import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { articles, getArticle } from '@/data/articles'

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
  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticle(slug)
  if (!article) notFound()

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="border-b border-gray-200 bg-white/60">
          <div className="max-w-3xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-2 flex-wrap">
            <Link href="/" className="hover:text-green-700">Головна</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-green-700">Новини</Link>
            <span>/</span>
            <span className="text-gray-800 line-clamp-1">{article.title}</span>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-4 py-12">
          <span className="text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded">
            {article.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-8">{article.title}</h1>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            {article.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap gap-3">
            <Link href="/blog" className="text-green-700 font-medium hover:underline">
              ← Усі статті
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  )
}
