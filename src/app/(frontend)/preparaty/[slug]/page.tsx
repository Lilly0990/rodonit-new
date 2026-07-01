import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductDetails from '@/components/ProductDetails'
import type { ContentSection } from '@/components/ProductDetails'
import { getAllProducts, getProductBySlug } from '@/lib/cms'

export const dynamic = 'force-dynamic'

const CATEGORY_NAMES: Record<string, string> = {
  stymulyatory: 'Стимулятори росту',
  mikrodobryva: 'Мікродобрива',
  fungitsydy: 'Фунгіциди',
  adyuvanty: "Ад'юванти",
}

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Препарат не знайдено' }
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || undefined,
    openGraph: {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.shortDescription || undefined,
      images: product.mainImage?.url ? [{ url: product.mainImage.url }] : [],
    },
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const categoryName = CATEGORY_NAMES[product.category] ?? product.category
  const imgSrc = product.mainImage?.url ?? `/products/${product.slug}.png`
  const imgAlt =
    product.mainImage?.alt ?? `${product.name} — ${categoryName.toLowerCase()} для агробізнесу`

  // Характеристики
  const specs = [
    ['Діюча речовина', product.activeIngredient],
    ['Призначення', product.purpose],
    ['Клас небезпеки', product.hazardClass],
    ['Форма випуску', product.form],
    ['Термін придатності', product.shelfLife],
  ].filter(([, v]) => v) as [string, string][]

  // Акордеон-секції з Payload (sections array)
  const sections: ContentSection[] = (product.sections ?? []).map((s) => ({
    heading: s.heading,
    paragraphs: (s.paragraphs ?? []).map((p) => p.text),
  }))

  // Таблиця регламентів
  const applications = (product.applications ?? []).map((row) => ({
    culture: row.culture,
    phase: row.phase,
    rate: row.rate,
  }))

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
              {categoryName}
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
                src={imgSrc}
                alt={imgAlt}
                width={394}
                height={518}
                className="object-contain max-h-[480px] w-auto"
                priority
              />
            </div>

            {/* Інфо */}
            <div>
              <span className="text-xs font-medium text-green-800 bg-green-100 px-2.5 py-1 rounded">
                {categoryName}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-3">{product.name}</h1>
              {(product.subtitle || product.shortDescription) && (
                <p className="text-gray-600 mb-6">
                  {product.subtitle || product.shortDescription}
                </p>
              )}

              {/* Про препарат */}
              {(product.about || product.uniqueness) && (
                <div className="space-y-3 mb-6 text-sm text-gray-600">
                  {product.about && <p>{product.about}</p>}
                  {product.uniqueness && (
                    <div>
                      <p className="font-medium text-gray-800 mb-1">Унікальність препарату</p>
                      <p>{product.uniqueness}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Характеристики */}
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
          {(product.cultures ?? []).length > 0 && (
            <div className="mt-12">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Застосування на культурах</h2>
              <div className="flex flex-wrap gap-2">
                {(product.cultures ?? []).map((cult) => (
                  <span
                    key={cult.name}
                    className="text-sm bg-green-50 text-green-800 px-3 py-1.5 rounded-full"
                  >
                    {cult.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Детальна інформація — акордеон */}
          {(sections.length > 0 || applications.length > 0) && (
            <div className="mt-10 max-w-4xl">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Детальна інформація</h2>
              <ProductDetails sections={sections} applications={applications} />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
