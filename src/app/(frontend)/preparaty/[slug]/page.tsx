import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
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

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Хлібні крихти */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 py-3 text-sm text-gray-500 flex gap-2 flex-wrap">
            <Link href="/" className="hover:text-green-700">Головна</Link>
            <span>/</span>
            <Link href="/preparaty" className="hover:text-green-700">Препарати</Link>
            <span>/</span>
            <Link href={`/preparaty#${product.category}`} className="hover:text-green-700">
              {category?.name}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Фото */}
            <div className="bg-gray-50 rounded-lg flex items-center justify-center p-8 min-h-[360px]">
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
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                {category?.name}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-4">{product.name}</h1>
              <p className="text-gray-600 mb-6">{product.shortDescription}</p>

              <dl className="space-y-3 border-t border-gray-200 pt-6">
                {product.activeIngredient && (
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 sm:w-44 shrink-0">Діюча речовина</dt>
                    <dd className="text-sm text-gray-800">{product.activeIngredient}</dd>
                  </div>
                )}
                {product.purpose && (
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 sm:w-44 shrink-0">Призначення</dt>
                    <dd className="text-sm text-gray-800">{product.purpose}</dd>
                  </div>
                )}
                {product.hazardClass && (
                  <div className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="text-sm font-medium text-gray-500 sm:w-44 shrink-0">Клас небезпеки</dt>
                    <dd className="text-sm text-gray-800">{product.hazardClass}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contacts"
                  className="bg-green-700 text-white font-medium px-6 py-3 rounded hover:bg-green-600 transition-colors"
                >
                  Замовити консультацію
                </Link>
                <Link
                  href="/preparaty"
                  className="border border-gray-300 text-gray-700 px-6 py-3 rounded hover:border-green-300 transition-colors"
                >
                  ← Усі препарати
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
