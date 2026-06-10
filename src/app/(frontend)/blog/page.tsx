import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Новини та статті',
  description:
    'Новини компанії Rodonit Agro, статті про препарати, агрономію та результати застосування на культурах.',
}

// Поки рубрики-заглушки; контент наповнюватиметься через Payload CMS
const posts = [
  { date: '2026', tag: 'Препарати', title: 'Лінійка VERNO: корекція дефіциту елементів живлення', excerpt: 'Мікродобрива VERNO CaB та Cu30+Zn30 — швидкий старт і пролонгований ефект для всіх культур.', href: '/preparaty?cat=mikrodobryva' },
  { date: '2026', tag: 'Препарати', title: 'НОРДОКС 75 WG — найконцентрованіша мідь на ринку', excerpt: '75% чистої біологічно активної міді, сертифікат OMRI для органічного виробництва.', href: '/preparaty/nordoks' },
  { date: '2026', tag: 'Препарати', title: 'Зеребра АГРО — стимулятор на основі колоїдного срібла', excerpt: 'Єдиний у світі препарат на основі колоїдного срібла з фунгіцидним і бактерицидним ефектом.', href: '/preparaty/zerebra-agro' },
]

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-[var(--green-deep)] text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Новини та статті</h1>
            <p className="text-green-100/80">Корисне про препарати, агрономію та результати застосування</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {posts.map((p) => (
              <Link
                key={p.title}
                href={p.href}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-400 transition-all group flex flex-col"
              >
                <div className="h-40 bg-[var(--green-soft)] flex items-center justify-center">
                  <span className="text-green-700/40 text-5xl font-bold">R</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">{p.tag}</span>
                    <span className="text-xs text-gray-400">{p.date}</span>
                  </div>
                  <h2 className="font-semibold text-gray-900 group-hover:text-green-700 mb-2">{p.title}</h2>
                  <p className="text-sm text-gray-500 flex-1">{p.excerpt}</p>
                  <span className="mt-4 text-green-700 text-sm font-medium group-hover:underline">Читати →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
