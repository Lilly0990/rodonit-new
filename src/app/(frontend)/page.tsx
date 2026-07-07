import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryIcon from '@/components/CategoryIcon'
import type { CategorySlug } from '@/data/products'
import { getAllProducts, getAllArticles } from '@/lib/cms'
import { productsCount } from '@/lib/plural'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Rodonit Agro — Препарати для захисту та стимуляції рослин',
  description:
    "Препарати для агробізнесу України: стимулятори росту, мікродобрива, фунгіциди, прилипачі. Сільвер Мікс, Міра РК, Верно, Гідролип та інші.",
}

const CATEGORIES = [
  { slug: 'stymulyatory' as CategorySlug, name: 'Стимулятори росту', description: 'Активують природні процеси рослини: проростання, кореневу систему, імунітет.' },
  { slug: 'mikrodobryva' as CategorySlug, name: 'Мікродобрива', description: 'Корекція дефіциту кальцію, бору, міді, цинку та гумінових речовин.' },
  { slug: 'fungitsydy' as CategorySlug, name: 'Фунгіциди', description: 'Мідьвмісний захист рослин від грибкових і бактеріальних хвороб.' },
  { slug: 'adyuvanty' as CategorySlug, name: 'Прилипачі', description: 'Покращують утримання й дію робочих розчинів на рослині.' },
]

export default async function HomePage() {
  const [products, latestArticles] = await Promise.all([
    getAllProducts(),
    getAllArticles().then((a) => a.slice(0, 3)),
  ])

  const stats = [
    { value: '20+', label: 'років на ринку' },
    { value: String(products.length), label: 'препаратів у каталозі' },
    { value: '100+', label: 'дослідів щороку' },
  ]

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[var(--green-deep)] text-white py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <p className="text-green-300 font-medium mb-3 uppercase tracking-wide text-sm">
              Оптимальні витрати — максимальний урожай
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Технології<br />підвищення врожайності
            </h1>
            <p className="text-lg text-green-100/80 mb-8 max-w-xl">
              Стимулятори росту, мікродобрива та засоби захисту рослин для аграріїв України.
              Економічно, екологічно, ефективно.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/preparaty"
                className="bg-white text-green-900 font-semibold px-6 py-3 rounded hover:bg-green-50 transition-colors"
              >
                Каталог препаратів
              </Link>
              <Link
                href="/contacts"
                className="border border-white/60 text-white px-6 py-3 rounded hover:bg-white/10 transition-colors"
              >
                Зв'язатись
              </Link>
            </div>
          </div>
        </section>

        {/* Категорії */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Категорії препаратів</h2>
            <p className="text-gray-500 mb-8">
              {products.length} препаратів у {CATEGORIES.length} категоріях для всіх основних культур
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((c) => {
                const count = products.filter((p) => p.category === c.slug).length
                return (
                  <Link
                    key={c.slug}
                    href={`/preparaty?cat=${c.slug}`}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-green-400 transition-all group flex flex-col items-center text-center"
                  >
                    <div className="w-14 h-14 rounded-full bg-[var(--green-soft)] text-green-700 flex items-center justify-center mb-4 group-hover:bg-green-700 group-hover:text-white transition-colors">
                      <CategoryIcon slug={c.slug} />
                    </div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 text-sm mb-2">
                      {c.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">{c.description}</p>
                    <p className="text-xs text-green-700 font-medium mt-3">{productsCount(count)}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Про компанію */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-medium text-green-700">Про компанію</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                Вітаємо на сайті «Родоніт Агро»!
              </h2>
              <p className="text-gray-600 mb-4">
                Головна мета нашої компанії — забезпечити виробників сільськогосподарської продукції
                економічними та ефективними технологіями, інноваційними й унікальними препаратами,
                здатними вирішити проблеми рослинництва з мінімальними витратами.
              </p>
              <p className="text-gray-600 mb-6">
                За понад 20 років діяльності ми сформували місткий портфель високоякісних препаратів,
                де «Родоніт Агро» є реєстрантом.
              </p>
              <Link
                href="/about"
                className="inline-block bg-green-700 text-white font-medium px-6 py-3 rounded hover:bg-green-800 transition-colors"
              >
                Дізнатись більше про компанію →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-[var(--green-soft)] rounded-lg p-6 text-center">
                  <div className="text-3xl font-bold text-green-800">{s.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Новини / Статті */}
        {latestArticles.length > 0 && (
          <section className="py-16 px-4 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Новини та статті</h2>
                  <p className="text-gray-500 mt-1">Події компанії та корисне про агрономію</p>
                </div>
                <Link href="/blog" className="text-green-700 text-sm font-medium hover:underline whitespace-nowrap">
                  Усі статті →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {latestArticles.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/blog/${a.slug}`}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-400 transition-all group flex flex-col"
                  >
                    <div className="relative h-44 bg-[var(--green-soft)] overflow-hidden">
                      <Image
                        src={a.coverImage?.url ?? `/blog/${a.slug}.jpg`}
                        alt={a.coverImage?.alt ?? a.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded w-fit mb-2">
                        {a.category}
                      </span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 mb-2 line-clamp-2">
                        {a.title}
                      </h3>
                      <p className="text-sm text-gray-500 flex-1 line-clamp-3">{a.excerpt}</p>
                      <span className="mt-4 text-green-700 text-sm font-medium group-hover:underline">
                        Читати →
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 px-4 bg-[var(--green-deep)] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Маєте питання щодо препаратів?</h2>
            <p className="text-green-100/80 mb-6">
              Наші консультанти допоможуть обрати правильний препарат для вашої культури
            </p>
            <Link
              href="/contacts"
              className="bg-white text-green-900 font-semibold px-8 py-3 rounded hover:bg-green-50 transition-colors"
            >
              Зв'язатися з консультантом
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
