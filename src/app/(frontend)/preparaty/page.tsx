import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ProductFilter from '@/components/ProductFilter'
import { categories, products } from '@/data/products'

export const metadata: Metadata = {
  title: 'Препарати для захисту і стимуляції рослин',
  description:
    'Лінійка препаратів Rodonit за категоріями: стимулятори росту, мікродобрива, фунгіциди, ад’юванти та деструктори стерні.',
}

export default async function PreparatyPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const initialCat = cat && categories.some((c) => c.slug === cat) ? cat : 'all'

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
          <ProductFilter categories={categories} products={products} initialCat={initialCat} />
        </div>
      </main>
      <Footer />
    </>
  )
}
