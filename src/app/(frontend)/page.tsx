import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryIcon from '@/components/CategoryIcon'
import { categories, products, getProductsByCategory } from '@/data/products'
import { latestArticles } from '@/data/articles'
import { productsCount } from '@/lib/plural'

export const metadata: Metadata = {
  title: 'Rodonit Agro — Препарати для захисту та стимуляції рослин',
  description:
    'Препарати для агробізнесу України: стимулятори росту, мікродобрива, фунгіциди, ад’юванти. Зеребра АГРО, MIRA LIFE, Верно, Гідролип та інші.',
}

// «Три-Е» — запатентована технологія компанії (з оригінального сайту)
const threeE = [
  { letter: 'Е', title: 'Екологічно', text: 'Вирощування екологічно чистої продукції, відновлення родючості ґрунту, захист урожаю від хімічних і токсичних стресів.' },
  { letter: 'Е', title: 'Економічно', text: 'Оптимальні витрати — максимальний урожай. Зниження кількості пестицидів і хімічного навантаження на ґрунт.' },
  { letter: 'Е', title: 'Ефективно', text: 'Підтверджена ефективність препаратів: вищі прибутки, врожайність, якість продукції та родючість ґрунтів.' },
]

const stats = [
  { value: '20+', label: 'років на ринку' },
  { value: String(products.length), label: 'препаратів у каталозі' },
  { value: '100+', label: 'дослідів щороку' },
]

export default function HomePage() {
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
                Зв’язатись
              </Link>
            </div>
          </div>
        </section>

        {/* Категорії — один ряд з іконками */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Категорії препаратів</h2>
            <p className="text-gray-500 mb-8">
              {products.length} препаратів у {categories.length} категоріях для всіх основних культур
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((c) => {
                const count = getProductsByCategory(c.slug).length
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

        {/* Про компанію — вітальний текст + статистика + кнопка */}
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

        {/* Технологія «Три-Е» */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900">Технологія «Три-Е»</h2>
              <p className="text-gray-500 mt-2">Запатентована філософія роботи компанії</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {threeE.map((e) => (
                <div key={e.title} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold mb-4">
                    {e.letter}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{e.title}</h3>
                  <p className="text-sm text-gray-600">{e.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Новини / Статті — реальні */}
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
                  <div className="h-40 bg-[var(--green-soft)] flex items-center justify-center">
                    <span className="text-green-700/40 text-5xl font-bold">R</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded w-fit mb-2">{a.category}</span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 mb-2 line-clamp-2">{a.title}</h3>
                    <p className="text-sm text-gray-500 flex-1 line-clamp-3">{a.excerpt}</p>
                    <span className="mt-4 text-green-700 text-sm font-medium group-hover:underline">Читати →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 bg-[var(--green-deep)] text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Маєте питання щодо препаратів?</h2>
            <p className="text-green-100/80 mb-6">Наші агрономи допоможуть обрати правильний препарат для вашої культури</p>
            <Link
              href="/contacts"
              className="bg-white text-green-900 font-semibold px-8 py-3 rounded hover:bg-green-50 transition-colors"
            >
              Зв’язатись з агрономом
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
