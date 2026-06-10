import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { categories, getProductsByCategory } from '@/data/products'

export const metadata: Metadata = {
  title: 'Препарати для захисту і стимуляції рослин',
  description:
    'Лінійка препаратів Rodonit за категоріями: стимулятори росту, мікродобрива, фунгіциди, ад’юванти та деструктори стерні.',
}

export default function PreparatyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-green-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Препарати Rodonit</h1>
            <p className="text-green-200">
              Препарати за категоріями призначення — від стимуляторів росту до захисту рослин
            </p>
          </div>
        </div>

        {/* Якоря категорій */}
        <div className="border-b border-gray-200 bg-white sticky top-16 z-30">
          <div className="max-w-6xl mx-auto px-4 flex gap-2 overflow-x-auto py-3">
            {categories.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="whitespace-nowrap text-sm text-gray-600 hover:text-green-700 border border-gray-200 hover:border-green-300 rounded-full px-4 py-1.5 transition-colors"
              >
                {c.name}
              </a>
            ))}
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
          {categories.map((category) => {
            const items = getProductsByCategory(category.slug)
            return (
              <section key={category.slug} id={category.slug} className="scroll-mt-32">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                  <p className="text-gray-500 mt-1 max-w-3xl">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((p) => (
                    <Link
                      key={p.slug}
                      href={`/preparaty/${p.slug}`}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-300 transition-all group flex flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-gray-50 flex items-center justify-center p-4">
                        <Image
                          src={p.image}
                          alt={`${p.name} — ${category.name.toLowerCase()} Rodonit`}
                          width={200}
                          height={260}
                          className="object-contain h-full w-auto"
                        />
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 mb-2">
                          {p.name}
                        </h3>
                        <p className="text-gray-500 text-sm flex-1">{p.shortDescription}</p>
                        <span className="mt-4 text-green-700 text-sm font-medium group-hover:underline">
                          Детальніше →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}
