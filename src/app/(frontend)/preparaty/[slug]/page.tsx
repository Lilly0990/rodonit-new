import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetails, { ContentSection } from '@/components/ProductDetails'
import { products, getProduct, getCategory } from '@/data/products'
import contentData from '@/data/products-content.json'

type ProductContent = {
  subtitle: string
  about: string
  uniqueness: string
  hazard: string
  form: string
  shelf: string
  ingredient: string
  purpose: string
  cultures: string[]
  sections: ContentSection[]
}

const content: Record<string, ProductContent> = contentData as Record<string, ProductContent>

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
  const c = content[slug]
  const subtitle = c?.subtitle || product.shortDescription

  // Характеристики (праворуч від фото)
  const specs = [
    ['Діюча речовина', product.activeIngredient || c?.ingredient],
    ['Призначення', product.purpose || c?.purpose],
    ['Клас небезпеки', product.hazardClass || c?.hazard],
    ['Форма випуску', product.form || c?.form],
    ['Термін придатності', product.shelfLife || c?.shelf],
  ].filter(([, v]) => v) as [string, string][]

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
            <div className="rounded-lg border border-gray-100 flex items-center justify-center p-8 min-h-[360px]" style={{ background: '#f6f4ec' }}>
              <Image
                src={product.image}
                alt={`${product.name} — ${category?.name.toLowerCase()} для агробізнесу від Rodonit`}
                width={394}
                height={518}
                className="object-contain max-h-[480px] w-auto"
                style={{ mixBlendMode: 'multiply' }}
                priority
              />
            </div>

            {/* Інфо */}
            <div>
              <span className="text-xs font-medium text-green-800 bg-green-100 px-2.5 py-1 rounded">
                {category?.name}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-3">{product.name}</h1>
              {subtitle && <p className="text-gray-600 mb-6">{subtitle}</p>}

              {/* Опис / Унікальність (короткий вступ) */}
              {(c?.about || c?.uniqueness) && (
                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  {c.about && <p>{c.about}</p>}
                  {c.uniqueness && (
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Унікальність препарату</p>
                      <p>{c.uniqueness}</p>
                    </div>
                  )}
                </div>
              )}

              {specs.length > 0 && (
                <dl className="space-y-2.5 border-t border-gray-200 pt-6">
                  {specs.map(([k, v]) => (
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

          {/* Культури застосування */}
          {c?.cultures?.length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Застосування на культурах</h2>
              <div className="flex flex-wrap gap-2">
                {c.cultures.map((cult) => (
                  <span key={cult} className="text-sm bg-green-50 text-green-800 px-3 py-1.5 rounded-full">
                    {cult}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Повний опис — акордеон */}
          {c?.sections?.length > 0 && (
            <div className="mt-10 max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Детальна інформація</h2>
              <ProductDetails sections={c.sections} applications={product.applications} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
