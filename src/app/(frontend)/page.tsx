import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CategoryIcon from '@/components/CategoryIcon'
import { categories, products, getProductsByCategory } from '@/data/products'
import { productsCount } from '@/lib/plural'

export const metadata: Metadata = {
  title: 'Rodonit Agro — Препарати для захисту та стимуляції рослин',
  description:
    'Препарати для агробізнесу України: стимулятори росту, мікродобрива, фунгіциди, ад’юванти. Зеребра АГРО, MIRA LIFE, Верно, Гідролип та інші.',
}

// Три «Є» — філософія компанії (категорія 3E з оригінального сайту)
const threeE = [
  { letter: 'Е', title: 'Ефективність', text: 'Препарати з підтвердженою польовою ефективністю — приріст урожайності та якості продукції.' },
  { letter: 'Е', title: 'Економія', text: 'Зниження норм ЗЗР і добрив, менше обробок — реальна економія коштів господарства.' },
  { letter: 'Е', title: 'Екологічність', text: 'Рішення, придатні для органічного виробництва (сертифікати ECOCERT, OMRI, Органік Стандарт).' },
]

const news = [
  { date: '2026', title: 'Лінійка VERNO: корекція дефіциту елементів живлення', excerpt: 'Мікродобрива VERNO CaB та Cu30+Zn30 — швидкий старт і пролонгований ефект для всіх культур.', href: '/preparaty?cat=mikrodobryva' },
  { date: '2026', title: 'НОРДОКС 75 WG — найконцентрованіша мідь на ринку', excerpt: '75% чистої біологічно активної міді, сертифікат OMRI для органічного виробництва.', href: '/preparaty/nordoks' },
  { date: '2026', title: 'Зеребра АГРО — стимулятор на основі колоїдного срібла', excerpt: 'Єдиний у світі препарат на основі колоїдного срібла з фунгіцидним і бактерицидним ефектом.', href: '/preparaty/zerebra-agro' },
]

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

        {/* Про компанію + три «Є» (3E) */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                <span className="text-sm font-medium text-green-700">Про компанію</span>
                <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                  Технології підвищення врожайності
                </h2>
                <p className="text-gray-600 mb-4">
                  ТОВ «Родоніт Агро» розробляє і постачає препарати для захисту та стимуляції рослин —
                  від біостимуляторів і мікродобрив до фунгіцидів та ад’ювантів. Наші рішення допомагають
                  господарствам підвищувати врожайність, знижувати витрати на ЗЗР і вирощувати якісну продукцію.
                </p>
                <p className="text-gray-600 mb-6">
                  Ми працюємо з усіма основними культурами України та надаємо технічний супровід агронома
                  на кожному етапі — від підбору схеми до контролю результату в полі.
                </p>
                <Link
                  href="/about"
                  className="text-green-700 font-medium hover:underline"
                >
                  Детальніше про компанію →
                </Link>
              </div>

              {/* Три «Є» */}
              <div className="space-y-4">
                {threeE.map((e) => (
                  <div key={e.title} className="flex gap-4 bg-[var(--green-soft)] rounded-lg p-5">
                    <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold shrink-0">
                      {e.letter}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{e.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{e.text}</p>
                    </div>
                  </div>
                ))}
              </div>
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

        {/* Новини / Блог */}
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Новини та статті</h2>
                <p className="text-gray-500 mt-1">Корисне про препарати, агрономію та результати</p>
              </div>
              <Link href="/blog" className="text-green-700 text-sm font-medium hover:underline whitespace-nowrap">
                Усі статті →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((n) => (
                <Link
                  key={n.title}
                  href={n.href}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-400 transition-all group flex flex-col"
                >
                  <div className="h-40 bg-[var(--green-soft)] flex items-center justify-center">
                    <span className="text-green-700/40 text-5xl font-bold">R</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs text-gray-400 mb-2">{n.date}</span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 mb-2">{n.title}</h3>
                    <p className="text-sm text-gray-500 flex-1">{n.excerpt}</p>
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
