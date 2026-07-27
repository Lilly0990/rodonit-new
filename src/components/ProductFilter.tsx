import Image from 'next/image'
import Link from 'next/link'
import type { CmsProduct } from '@/lib/cms'

export interface CategoryUi {
  slug: string
  name: string
}

function buildHref(cat: string, culture?: string) {
  const params = new URLSearchParams()
  if (cat !== 'all') params.set('cat', cat)
  if (culture) params.set('culture', culture)
  const qs = params.toString()
  return qs ? `/preparaty?${qs}` : '/preparaty'
}

export default function ProductFilter({
  categories,
  allProducts,
  products,
  activeCat = 'all',
  activeCulture,
}: {
  categories: CategoryUi[]
  /** повний список — потрібен лише щоб визначити, які таби показувати */
  allProducts: CmsProduct[]
  /** вже відфільтровані товари для показу в сітці */
  products: CmsProduct[]
  activeCat?: string
  activeCulture?: string
}) {
  // Показуємо таб лише якщо в категорії є хоча б один продукт
  const nonEmpty = categories.filter((c) => allProducts.some((p) => p.category === c.slug))
  const tabs = [{ slug: 'all', name: 'Усі препарати' }, ...nonEmpty]

  return (
    <div>
      {/* Таби-фільтри — реальні посилання, індексуються */}
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((t) => {
          const isActive = activeCat === t.slug
          return (
            <Link
              key={t.slug}
              href={buildHref(t.slug, activeCulture)}
              className={`text-sm font-medium px-5 py-2.5 rounded transition-colors ${
                isActive
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-green-400'
              }`}
            >
              {t.name}
            </Link>
          )
        })}
      </div>

      {/* Сітка карток */}
      {products.length === 0 ? (
        <p className="text-gray-500 py-12 text-center">
          У цій категорії/культурі поки немає препаратів.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => {
            const imgSrc = p.mainImage?.url ?? `/products/${p.slug}.png`
            return (
              <Link
                key={p.slug}
                href={`/preparaty/${p.slug}`}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-green-400 transition-all group flex flex-col"
              >
                <div className="h-52 bg-white border-b border-gray-100 flex items-center justify-center p-4">
                  <Image
                    src={imgSrc}
                    alt={p.mainImage?.alt ?? `${p.name} — препарат Rodonit для агробізнесу`}
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
            )
          })}
        </div>
      )}
    </div>
  )
}
