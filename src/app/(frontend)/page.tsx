import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { categories, products, getProductsByCategory } from '@/data/products'
import { productsCount } from '@/lib/plural'

export const metadata: Metadata = {
  title: 'Rodonit Agro — Препарати для захисту та стимуляції рослин',
  description:
    'Препарати для агробізнесу України: стимулятори росту, мікродобрива, фунгіциди, ад’юванти. Зеребра АГРО, MIRA LIFE, Верно, Гідролип та інші.',
}

// Для вітрини беремо по одному найхарактернішому препарату з кожної категорії
const featured = categories
  .map((c) => getProductsByCategory(c.slug)[0])
  .filter(Boolean)

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-[var(--green-deep)] text-white py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Препарати для<br />сучасного агробізнесу
            </h1>
            <p className="text-lg text-green-100/80 mb-8 max-w-xl">
              Стимулятори росту, мікродобрива та засоби захисту рослин для підвищення
              врожайності. Перевірено на полях України.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/preparaty"
                className="bg-white text-green-900 font-semibold px-6 py-3 rounded hover:bg-green-50 transition-colors"
              >
                Всі препарати
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

        {/* Категорії — один ряд з фото */}
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
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-400 transition-all group flex flex-col text-center"
                  >
                    <div className="h-32 bg-[var(--green-soft)] flex items-center justify-center p-3">
                      <Image
                        src={c.image}
                        alt={`${c.name} Rodonit`}
                        width={90}
                        height={110}
                        className="object-contain max-h-28 w-auto"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-semibold text-gray-900 group-hover:text-green-700 text-sm mb-1">
                        {c.name}
                      </h3>
                      <p className="text-xs text-gray-400 mt-auto">{productsCount(count)}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Вітрина препаратів */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Популярні препарати</h2>
                <p className="text-gray-500 mt-1">По одному з кожної категорії</p>
              </div>
              <Link href="/preparaty" className="text-green-700 text-sm font-medium hover:underline whitespace-nowrap">
                Дивитись всі →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <Link
                  key={p.slug}
                  href={`/preparaty/${p.slug}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-400 transition-all group flex flex-col"
                >
                  <div className="h-52 bg-white border-b border-gray-100 flex items-center justify-center p-4">
                    <Image
                      src={p.image}
                      alt={`${p.name} — препарат Rodonit для агробізнесу`}
                      width={180}
                      height={200}
                      className="object-contain max-h-44 w-auto"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 mb-2">
                      {p.name}
                    </h3>
                    <p className="text-gray-500 text-sm flex-1 line-clamp-3">{p.shortDescription}</p>
                    <span className="mt-4 text-green-700 text-sm font-medium group-hover:underline">
                      Детальніше →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Чому ми */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-10">Чому обирають Rodonit</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Ефективність', text: 'Підтверджена результатами польових досліджень на всіх основних культурах України' },
                { title: 'Технологічні схеми', text: 'Детальні схеми застосування для кожної культури і фази розвитку рослин' },
                { title: 'B2B партнерство', text: 'Гнучкі умови для дилерів і великих господарств. Технічна підтримка агронома' },
              ].map((item) => (
                <div key={item.title} className="border-l-4 border-green-600 pl-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.text}</p>
                </div>
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
