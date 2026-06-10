import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getAllArticles } from '@/lib/cms'

export const metadata: Metadata = {
  title: 'Новини та статті',
  description:
    'Новини компанії Rodonit Agro, статті про препарати, агрономію та результати застосування на культурах.',
}

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const articles = await getAllArticles()

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-[var(--green-deep)] text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Новини та статті</h1>
            <p className="text-green-100/80">Події компанії та корисне про агрономію і захист рослин</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          {articles.length === 0 ? (
            <p className="text-gray-500">Поки немає опублікованих статей.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((a) => (
                <Link
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-400 transition-all group flex flex-col"
                >
                  <div className="h-40 bg-[var(--green-soft)] flex items-center justify-center">
                    <span className="text-green-700/40 text-5xl font-bold">R</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded w-fit mb-2">
                      {a.category}
                    </span>
                    <h2 className="font-semibold text-gray-900 group-hover:text-green-700 mb-2 line-clamp-3">
                      {a.title}
                    </h2>
                    <p className="text-sm text-gray-500 flex-1 line-clamp-3">{a.excerpt}</p>
                    <span className="mt-4 text-green-700 text-sm font-medium group-hover:underline">Читати →</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
