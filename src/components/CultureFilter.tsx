import Link from 'next/link'

export interface CultureUi {
  slug: string
  name: string
  count: number
}

// Агрономічне групування культур для компактного, читабельного вигляду пікера.
// Нову культуру, якої немає в жодній групі, автоматично відносить до «Інші культури»
// (не ламається, якщо Олег додасть нову культуру в адмінці — просто потрапить туди,
// поки хтось не впише її сюди явно).
const CULTURE_GROUPS: { label: string; names: string[] }[] = [
  {
    label: 'Польові культури',
    names: ['Зернові культури', 'Кукурудза', 'Соняшник', 'Соя', 'Ріпак', 'Горох', 'Буряк цукровий'],
  },
  {
    label: 'Овочеві культури',
    names: [
      'Томат', 'Огірок', 'Перець', 'Баклажан', 'Капуста', 'Цибуля', 'Картопля',
      'Баштанні культури', 'Буряк столовий',
    ],
  },
  {
    label: 'Плодово-ягідні',
    names: ['Виноград', 'Малина', 'Полуниця', 'Кісточкові культури', 'Зерняткові'],
  },
  {
    label: 'Квіткові та декоративні',
    names: ['Квіткові культури'],
  },
]

function buildHref(cat: string, culture?: string) {
  const params = new URLSearchParams()
  if (cat !== 'all') params.set('cat', cat)
  if (culture) params.set('culture', culture)
  const qs = params.toString()
  return qs ? `/preparaty?${qs}` : '/preparaty'
}

function CulturePill({
  href,
  isActive,
  name,
  count,
}: {
  href: string
  isActive: boolean
  name: string
  count: number
}) {
  return (
    <Link
      href={href}
      className={`text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
        isActive
          ? 'bg-green-700 text-white border-green-700'
          : 'bg-white text-gray-600 border-gray-200 hover:border-green-400 hover:text-green-700'
      }`}
    >
      {name}
      <span className={isActive ? 'text-green-100' : 'text-gray-400'}> · {count}</span>
    </Link>
  )
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

  const used = new Set<string>()
  const groups = CULTURE_GROUPS.map((g) => ({
    label: g.label,
    items: g.names
      .map((name) => cultures.find((c) => c.name === name))
      .filter((c): c is CultureUi => {
        if (!c) return false
        used.add(c.slug)
        return true
      }),
  })).filter((g) => g.items.length > 0)

  const rest = cultures.filter((c) => !used.has(c.slug))
  if (rest.length > 0) groups.push({ label: 'Інші культури', items: rest })

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Підбір по культурах
        </h2>
        <Link
          href={buildHref(activeCat)}
          className={`text-sm font-medium px-3.5 py-1.5 rounded-full border transition-colors ${
            !activeCulture
              ? 'bg-green-700 text-white border-green-700'
              : 'bg-white text-gray-600 border-gray-200 hover:border-green-400'
          }`}
        >
          Всі культури
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white border border-gray-200 rounded-xl p-5">
        {groups.map((g) => (
          <div key={g.label}>
            <h3 className="text-xs font-semibold text-green-800/70 uppercase tracking-wide mb-2.5">
              {g.label}
            </h3>
            <div className="flex flex-wrap gap-2">
              {g.items.map((c) => (
                <CulturePill
                  key={c.slug}
                  href={buildHref(activeCat, c.slug)}
                  isActive={activeCulture === c.slug}
                  name={c.name}
                  count={c.count}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
