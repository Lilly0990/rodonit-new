import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductFilter from '@/components/ProductFilter'
import { getAllProducts } from '@/lib/cms'
import type { CategoryUi } from '@/components/ProductFilter'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Препарати для захисту і стимуляції рослин',
  description:
    "Лінійка препаратів Rodonit за категоріями: стимулятори росту, мікродобрива, фунгіциди, ад'юванти.",
}

const CATEGORIES: CategoryUi[] = [
  { slug: 'stymulyatory', name: 'Стимулятори росту' },
  { slug: 'mikrodobryva', name: 'Мікродобрива' },
  { slug: 'fungitsydy', name: 'Фунгіциди' },
  { slug: 'adyuvanty', name: "Ад'юванти" },
]

export default async function PreparatyPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const initialCat = cat && CATEGORIES.some((c) => c.slug === cat) ? cat : 'all'
  const products = await getAllProducts()

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
          <ProductFilter categories={CATEGORIES} products={products} initialCat={initialCat} />
        </div>
      </main>
      <Footer />
    </>
  )
}
