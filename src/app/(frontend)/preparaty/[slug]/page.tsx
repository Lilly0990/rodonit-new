import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Accordion from '@/components/Accordion'
import { products, getProduct, getCategory } from '@/data/products'

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) return { title: 'Препарат не знайдено' }
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: [{ url: product.image }],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const category = getCategory(product.category)

  // Блок характеристик (праворуч від короткого опису)
  const specs = [
    ['Діюча речовина', product.activeIngredient],
    ['Призначення', product.purpose],
    ['Клас небезпеки', product.hazardClass],
    ['Форма випуску', product.form],
    ['Термін придатності', product.shelfLife],
  ].filter(([, v]) => v) as [string, string][]

  // Акордеон «Опис продукту»
  const accordionItems = []

  const descBlocks: React.ReactNode[] = []
  if (product.about) descBlocks.push(<p key="about" className="mb-3">{product.about}</p>)
  if (product.uniqueness)
    descBlocks.push(
      <div key="uniq">
        <p className="font-medium text-gray-800 mb-1">Унікальність препарату</p>
        <p>{product.uniqueness}</p>
      </div>,
    )
  if (descBlocks.length) {
    accordionItems.push({ title: 'Опис продукту', content: <div className="space-y-3">{descBlocks}</div> })
  }

  if (specs.length) {
    accordionItems.push({
      title: 'Характеристики',
      content: (
        <dl className="divide-y divide-gray-100">
          {specs.map(([k, v]) => (
            <div key={k} className="flex flex-col sm:flex-row sm:gap-4 py-2">
              <dt className="text-gray-500 sm:w-48 shrink-0">{k}</dt>
              <dd className="text-gray-800">{v}</dd>
            </div>
          ))}
        </dl>
      ),
    })
  }

  if (product.applications?.length) {
    accordionItems.push({
      title: 'Регламент застосування',
      content: (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-green-50 text-left">
                <th className="border border-gray-200 px-3 py-2 font-medium text-gray-700">Культура</th>
                <th className="border border-gray-200 px-3 py-2 font-medium text-gray-700">Фаза розвитку</th>
                <th className="border border-gray-200 px-3 py-2 font-medium text-gray-700 whitespace-nowrap">Норма</th>
              </tr>
            </thead>
            <tbody>
              {product.applications.map((row, i) => (
                <tr key={i} className="align-top">
                  <td className="border border-gray-200 px-3 py-2 font-medium text-gray-800">{row.culture}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-600">{row.phase}</td>
                  <td className="border border-gray-200 px-3 py-2 text-gray-800 whitespace-nowrap">{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    })
  }

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Хлібні крихти */}
        <div className="border-b border-gray-200 bg-white/60">
          <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-2 flex-wrap">
            <Link href="/" className="hover:text-green-700">Головна</Link>
            <span>/</span>
            <Link href="/preparaty" className="hover:text-green-700">Препарати</Link>
            <span>/</span>
            <Link href={`/preparaty?cat=${product.category}`} className="hover:text-green-700">
              {category?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Фото */}
            <div className="bg-white rounded-lg border border-gray-100 flex items-center justify-center p-8 min-h-[360px]">
              <Image
                src={product.image}
                alt={`${product.name} — ${category?.name.toLowerCase()} для агробізнесу від Rodonit`}
                width={394}
                height={518}
                className="object-contain max-h-[480px] w-auto"
                priority
              />
            </div>

            {/* Інфо */}
            <div>
              <span className="text-xs font-medium text-green-800 bg-green-100 px-2.5 py-1 rounded">
                {category?.name}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.shortDescription}</p>

              {specs.length > 0 && (
                <dl className="space-y-2.5 border-t border-gray-200 pt-6">
                  {specs.slice(0, 3).map(([k, v]) => (
                    <div key={k} className="flex flex-col sm:flex-row sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500 sm:w-44 shrink-0">{k}</dt>
                      <dd className="text-sm text-gray-800">{v}</dd>
                    </div>
                  ))}
                </dl>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contacts"
                  className="bg-green-700 text-white font-medium px-6 py-3 rounded hover:bg-green-800 transition-colors"
                >
                  Замовити консультацію
                </Link>
                <Link
                  href="/preparaty"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded hover:border-green-400 transition-colors"
                >
                  ← Усі препарати
                </Link>
              </div>
            </div>
          </div>

          {/* Акордеон з повним описом */}
          {accordionItems.length > 0 && (
            <div className="mt-12 max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Детальна інформація</h2>
              <Accordion items={accordionItems} defaultOpen={0} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
