import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import DistributorFilter from '@/components/DistributorFilter'
import { getAllDistributors } from '@/lib/cms'
import type { DirectionUi } from '@/components/DistributorFilter'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Дистриб'ютори",
  description: "Офіційні дистриб'ютори Rodonit Agro по регіонах та напрямках діяльності.",
}

const DIRECTIONS: DirectionUi[] = [
  { slug: 'sady', name: 'Садівництво' },
  { slug: 'tehnichni-kultury', name: 'Технічні культури' },
  { slug: 'ovochivnytstvo', name: 'Овочівництво' },
  { slug: 'tsentralnyi-region', name: 'Центральний регіон' },
]

export default async function DistributorsPage() {
  const distributors = await getAllDistributors()

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-green-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Дистриб'ютори</h1>
            <p className="text-green-200">Офіційні партнери Rodonit Agro у вашому регіоні</p>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <DistributorFilter directions={DIRECTIONS} distributors={distributors} />
        </div>
      </main>
      <Footer />
    </>
  )
}
