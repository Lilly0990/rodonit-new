/**
 * Секція «Портфель за фазами застосування» — інфографіка фаз росту рослини
 * та які препарати Rodonit застосовувати на кожній фазі (дані з регламентів).
 * Чисті SVG-іконки у зеленій палітрі сайту.
 */

const GREEN = '#1f6b3a'
const SOIL = '#b98a5a'

// ── SVG-іконки рослини по фазах ──────────────────────────────────────────────
function Seedling() {
  return (
    <svg viewBox="0 0 96 96" className="w-16 h-16" fill="none" aria-hidden>
      <rect x="8" y="76" width="80" height="12" rx="2" fill={SOIL} />
      <path d="M48 76V52" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 58c-8 0-14-5-16-13 9-1 15 3 16 13Z" fill={GREEN} />
      <path d="M48 54c8-1 13-6 15-14-9 0-14 4-15 14Z" fill="#3e9c5f" />
    </svg>
  )
}
function Vegetative() {
  return (
    <svg viewBox="0 0 96 96" className="w-16 h-16" fill="none" aria-hidden>
      <rect x="8" y="76" width="80" height="12" rx="2" fill={SOIL} />
      <path d="M48 76V34" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 60c-10 0-17-6-19-16 11-1 18 4 19 16Z" fill={GREEN} />
      <path d="M48 50c10-1 16-7 18-17-11 0-17 5-18 17Z" fill="#3e9c5f" />
      <path d="M48 40c-8 0-13-5-15-12 8-1 14 3 15 12Z" fill={GREEN} />
      <path d="M48 34c8-1 12-6 14-13-8 0-13 4-14 13Z" fill="#3e9c5f" />
    </svg>
  )
}
function Flowering() {
  return (
    <svg viewBox="0 0 96 96" className="w-16 h-16" fill="none" aria-hidden>
      <rect x="8" y="76" width="80" height="12" rx="2" fill={SOIL} />
      <path d="M48 76V40" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 62c-10 0-17-6-19-15 11-1 18 4 19 15Z" fill={GREEN} />
      <path d="M48 52c10-1 16-6 18-16-11 0-17 5-18 16Z" fill="#3e9c5f" />
      <circle cx="48" cy="30" r="7" fill="#e8b93a" />
      <g fill="#f2d06b">
        <circle cx="48" cy="19" r="4" /><circle cx="48" cy="41" r="4" />
        <circle cx="37" cy="30" r="4" /><circle cx="59" cy="30" r="4" />
      </g>
      <circle cx="48" cy="30" r="4" fill="#c9962a" />
    </svg>
  )
}
function Ripening() {
  return (
    <svg viewBox="0 0 96 96" className="w-16 h-16" fill="none" aria-hidden>
      <rect x="8" y="76" width="80" height="12" rx="2" fill={SOIL} />
      <path d="M48 76V38" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
      <path d="M48 60c-10 0-17-6-19-15 11-1 18 4 19 15Z" fill={GREEN} />
      <path d="M48 50c10-1 16-6 18-16-11 0-17 5-18 16Z" fill="#3e9c5f" />
      <circle cx="40" cy="30" r="8" fill="#e5484d" />
      <circle cx="57" cy="34" r="7" fill="#e5484d" />
      <path d="M40 22v-4M57 27v-4" stroke={GREEN} strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

interface Phase {
  title: string
  subtitle: string
  icon: React.ReactNode
  products: string[]
}

const PHASES: Phase[] = [
  {
    title: 'Обробка насіння',
    subtitle: 'Старт і коренева система',
    icon: <Seedling />,
    products: ['Міра РК', 'Верно FG', 'Гідролип'],
  },
  {
    title: 'Вегетація',
    subtitle: 'Ріст і живлення',
    icon: <Vegetative />,
    products: ['Верно FG', 'Верно СаВ', 'Нордокс 75 WG', 'Міра РК', 'Гідролип'],
  },
  {
    title: 'Цвітіння та налив',
    subtitle: 'Формування врожаю',
    icon: <Flowering />,
    products: ['Верно СаВ', 'Нордокс 75 WG'],
  },
  {
    title: 'Дозрівання',
    subtitle: 'Захист урожаю',
    icon: <Ripening />,
    products: ['Гідролип', 'Нордокс 75 WG'],
  },
]

export default function PhasesPortfolio() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-3">
          <span className="inline-block bg-green-700 text-white text-sm font-medium px-4 py-1.5 rounded-full">
            Портфель за фазами застосування
          </span>
        </div>
        <p className="text-center text-gray-500 mb-10 max-w-2xl mx-auto">
          Препарати Rodonit супроводжують культуру на кожному етапі — від обробки насіння до захисту врожаю.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PHASES.map((p, i) => (
            <div key={p.title} className="relative">
              {/* Зʼєднувальна лінія між фазами (desktop) */}
              {i < PHASES.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-px bg-green-200" aria-hidden />
              )}
              <div className="relative bg-[var(--green-soft)] rounded-2xl p-6 h-full flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                  {p.icon}
                </div>
                <h3 className="font-bold text-gray-900">{p.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{p.subtitle}</p>
                <div className="flex flex-wrap gap-1.5 justify-center mt-auto">
                  {p.products.map((pr) => (
                    <span key={pr} className="text-xs bg-white text-green-800 px-2.5 py-1 rounded-full border border-green-100">
                      {pr}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
