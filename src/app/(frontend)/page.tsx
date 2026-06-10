import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Rodonit Agro — Препарати для захисту та стимуляції рослин',
  description: 'Biostimulants та регулятори росту для агробізнесу України. MIRA LIFE, Зеребра АГРО, Верно, Гідролип та інші препарати.',
}

const products = [
  { name: 'Зеребра АГРО', slug: 'zerebra-agro', desc: 'Стимулятор росту та імунітету рослин' },
  { name: 'MIRA LIFE S1', slug: 'mira-life-s1', desc: 'Комплексний препарат для зернових' },
  { name: 'MIRA LIFE S2', slug: 'mira-life-s2', desc: 'Для просапних та овочевих культур' },
  { name: 'Верно СаВ', slug: 'verno-sav', desc: 'Корекція кальцію й бору' },
  { name: 'Гідролип', slug: 'hydrolip', desc: "Прилипач-ад'ювант для пестицидів" },
  { name: 'Ризобакт', slug: 'rizobakt', desc: 'Гуміфікатор стерні та ґрунту' },
]

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-green-900 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Препарати для<br />сучасного агробізнесу
            </h1>
            <p className="text-lg text-green-200 mb-8 max-w-xl">
              Biostimulants та регулятори росту для підвищення врожайності і захисту рослин.
              Перевірено на полях України.
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
                className="border border-white text-white px-6 py-3 rounded hover:bg-white/10 transition-colors"
              >
                Зв'язатись
              </Link>
            </div>
          </div>
        </section>

        {/* Products grid */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Наші препарати</h2>
            <p className="text-gray-500 mb-8">Широка лінійка для всіх основних культур</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <Link
                  key={p.slug}
                  href={`/preparaty/${p.slug}`}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-green-300 transition-all group"
                >
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 mb-2">
                    {p.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{p.desc}</p>
                  <span className="mt-4 inline-block text-green-700 text-sm font-medium group-hover:underline">
                    Детальніше →
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/preparaty"
                className="inline-block border border-green-700 text-green-700 px-6 py-3 rounded hover:bg-green-50 transition-colors"
              >
                Дивитись всі препарати
              </Link>
            </div>
          </div>
        </section>

        {/* Why us */}
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
        <section className="py-16 px-4 bg-green-900 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Маєте питання щодо препаратів?</h2>
            <p className="text-green-200 mb-6">Наші агрономи допоможуть обрати правильний препарат для вашої культури</p>
            <Link
              href="/contacts"
              className="bg-white text-green-900 font-semibold px-8 py-3 rounded hover:bg-green-50 transition-colors"
            >
              Зв'язатись з агрономом
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
