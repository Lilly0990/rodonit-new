import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductFilter from '@/components/ProductFilter'
import CultureFilter from '@/components/CultureFilter'
import PhasesPortfolio from '@/components/PhasesPortfolio'
import { getAllProducts } from '@/lib/cms'
import { slugifyUk } from '@/lib/slug'
import type { CategoryUi } from '@/components/ProductFilter'
import type { CultureUi } from '@/components/CultureFilter'

export const dynamic = 'force-dynamic'

const CATEGORIES: CategoryUi[] = [
  { slug: 'stymulyatory', name: 'Стимулятори росту' },
  { slug: 'mikrodobryva', name: 'Мікродобрива' },
  { slug: 'fungitsydy', name: 'Фунгіциди' },
  { slug: 'adyuvanty', name: 'Прилипачі' },
  // Зарезервована категорія — таб зʼявиться автоматично, коли Олег додасть перший продукт «Біопродукти»
  { slug: 'bioprodukty', name: 'Біопродукти' },
]

type SearchParams = { cat?: string; culture?: string }

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}): Promise<Metadata> {
  const { cat, culture } = await searchParams
  const catName = CATEGORIES.find((c) => c.slug === cat)?.name

  let cultureName: string | undefined
  if (culture) {
    const products = await getAllProducts()
    cultureName = products
      .flatMap((p) => p.cultures ?? [])
      .find((c) => slugifyUk(c.name) === culture)?.name
  }

  // Назва культури лишається в називному відмінку в лапках — уникає ручного
  // відмінювання («для сої», «для соняшника»), яке важко зробити правильно програмно.
  if (catName && cultureName) {
    return {
      title: `${catName} — культура «${cultureName}» | Rodonit`,
      description: `${catName} Rodonit для культури «${cultureName}»: підбір препаратів, норми внесення, регламент застосування.`,
    }
  }
  if (cultureName) {
    return {
      title: `Препарати Rodonit для культури «${cultureName}»`,
      description: `Підбір препаратів Rodonit (стимулятори, мікродобрива, фунгіциди) для культури «${cultureName}».`,
    }
  }
  if (catName) {
    return {
      title: `${catName} Rodonit`,
      description: `${catName} Rodonit: повний перелік препаратів, склад, норми і регламент застосування.`,
    }
  }
  return {
    title: 'Препарати для захисту і стимуляції рослин',
    description:
      'Лінійка препаратів Rodonit за категоріями: стимулятори росту, мікродобрива, фунгіциди, прилипачі.',
  }
}

export default async function PreparatyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const { cat, culture } = await searchParams
  const activeCat = cat && CATEGORIES.some((c) => c.slug === cat) ? cat : 'all'
  const products = await getAllProducts()

  // Унікальні культури з усіх активних товарів — для пікера «Підбір по культурах»
  const cultureMap = new Map<string, CultureUi>()
  for (const p of products) {
    for (const c of p.cultures ?? []) {
      const slug = slugifyUk(c.name)
      const existing = cultureMap.get(slug)
      if (existing) existing.count += 1
      else cultureMap.set(slug, { slug, name: c.name, count: 1 })
    }
  }
  const cultures = [...cultureMap.values()].sort((a, b) => a.name.localeCompare(b.name, 'uk'))
  const activeCulture = culture && cultureMap.has(culture) ? culture : undefined

  const byCat = activeCat === 'all' ? products : products.filter((p) => p.category === activeCat)
  const visible = activeCulture
    ? byCat.filter((p) => (p.cultures ?? []).some((c) => slugifyUk(c.name) === activeCulture))
    : byCat

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-[var(--green-deep)] text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Препарати Rodonit</h1>
            <p className="text-green-100/80">
              Препарати за категоріями призначення — від стимуляторів росту до захисту рослин
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <CultureFilter cultures={cultures} activeCat={activeCat} activeCulture={activeCulture} />
          <ProductFilter
            categories={CATEGORIES}
            allProducts={products}
            products={visible}
            activeCat={activeCat}
            activeCulture={activeCulture}
          />
        </div>

        {/* Портфель за фазами застосування */}
        <PhasesPortfolio />
      </main>
      <Footer />
    </>
  )
}
