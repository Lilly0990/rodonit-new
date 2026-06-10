import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Препарати для захисту і стимуляції рослин',
  description: 'Повна лінійка biostimulants та регуляторів росту: MIRA LIFE, Зеребра АГРО, Верно, Гідролип, Ризобакт та інші.',
}

const products = [
  {
    name: 'Зеребра АГРО',
    slug: 'zerebra-agro',
    desc: 'Стимулятор росту та системного імунітету рослин. Покращує проростання насіння, зміцнює кореневу систему.',
    tag: 'Biostimulant',
  },
  {
    name: 'MIRA LIFE S1',
    slug: 'mira-life-s1',
    desc: 'Комплексний препарат для зернових культур. Активує механізми природного захисту.',
    tag: 'Стимулятор',
  },
  {
    name: 'MIRA LIFE S2',
    slug: 'mira-life-s2',
    desc: 'Для просапних та овочевих культур. Підвищує стресостійкість і врожайність.',
    tag: 'Стимулятор',
  },
  {
    name: 'Верно СаВ',
    slug: 'verno-sav',
    desc: 'Корекція кальцію й бору. Запобігає розтріскуванню плодів та деформації стручків.',
    tag: 'Мікроелементи',
  },
  {
    name: 'Верно FG Cu30+Zn30',
    slug: 'verno-fg',
    desc: 'Фунгіцидна дія + мікроелементи міді та цинку. Для захисту від грибкових захворювань.',
    tag: 'Фунгіцид+мікро',
  },
  {
    name: 'НОРДОКС 75 WG',
    slug: 'nordoks',
    desc: 'Мідьвмісний контактний фунгіцид і бактерицид широкого спектру дії.',
    tag: 'Фунгіцид',
  },
  {
    name: 'Гідролип',
    slug: 'hydrolip',
    desc: "Прилипач-ад'ювант для пестицидів і добрив. Покращує змочування та утримання препаратів.",
    tag: "Ад'ювант",
  },
  {
    name: 'Міра РК',
    slug: 'mira-rk',
    desc: 'Регулятор кислотності. Знижує pH розчину для ефективного розчинення гербіцидів.',
    tag: "Ад'ювант",
  },
  {
    name: 'Міра ЛИП',
    slug: 'mira-lyp',
    desc: 'Прилипач для гербіцидів і фунгіцидів. Утримує краплі на поверхні листка.',
    tag: "Ад'ювант",
  },
  {
    name: 'Ризобакт',
    slug: 'rizobakt',
    desc: 'Гуміфікатор стерні. Прискорює розклад рослинних решток та збагачує ґрунт гумусом.',
    tag: 'Ґрунт',
  },
  {
    name: 'Лігногумат',
    slug: 'lignohumat',
    desc: 'Гумінове добриво. Стимулює розвиток кореневої системи та підвищує засвоєння поживних речовин.',
    tag: 'Добриво',
  },
]

export default function PreparatyPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-green-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Препарати Rodonit</h1>
            <p className="text-green-200">Лінійка biostimulants та препаратів для всіх основних культур</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <Link
                key={p.slug}
                href={`/preparaty/${p.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-green-300 transition-all group flex flex-col"
              >
                <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded w-fit mb-3">
                  {p.tag}
                </span>
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-green-700 mb-2">
                  {p.name}
                </h2>
                <p className="text-gray-500 text-sm flex-1">{p.desc}</p>
                <span className="mt-4 text-green-700 text-sm font-medium group-hover:underline">
                  Детальніше →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
