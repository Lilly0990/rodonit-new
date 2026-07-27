import Link from 'next/link'

export interface CultureUi {
  slug: string
  name: string
  count: number
}

function buildHref(cat: string, culture?: string) {
  const params = new URLSearchParams()
  if (cat !== 'all') params.set('cat', cat)
  if (culture) params.set('culture', culture)
  const qs = params.toString()
  return qs ? `/preparaty?${qs}` : '/preparaty'
}

export default function CultureFilter({
  cultures,
  activeCat = 'all',
  activeCulture,
}: {
  cultures: CultureUi[]
  activeCat?: string
  activeCulture?: string
}) {
  if (cultures.length === 0) return null

  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
        Підбір по культурах
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 [scrollbar-width:thin]">
        <Link
          href={buildHref(activeCat)}
          className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
            !activeCulture
              ? 'bg-green-700 text-white border-green-700'
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
          }`}
        >
          Всі культури
        </Link>
        {cultures.map((c) => {
          const isActive = activeCulture === c.slug
          return (
            <Link
              key={c.slug}
              href={buildHref(activeCat, c.slug)}
              className={`shrink-0 text-sm font-medium px-4 py-2 rounded-full border transition-colors ${
                isActive
                  ? 'bg-green-700 text-white border-green-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
              }`}
            >
              {c.name}
              <span className={isActive ? 'text-green-100' : 'text-gray-400'}> · {c.count}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
