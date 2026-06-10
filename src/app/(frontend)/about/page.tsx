import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Про компанію',
  description:
    'ТОВ «Родоніт Агро» — технології підвищення врожайності. Препарати для захисту та стимуляції рослин для агробізнесу України.',
}

const threeE = [
  { title: 'Ефективність', text: 'Препарати з підтвердженою польовою ефективністю — приріст урожайності та якості продукції на всіх основних культурах.' },
  { title: 'Економія', text: 'Зниження норм ЗЗР і добрив, менша кількість обробок — реальна економія коштів господарства.' },
  { title: 'Екологічність', text: 'Рішення, придатні для органічного виробництва: сертифікати ECOCERT, OMRI, Органік Стандарт.' },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-[var(--green-deep)] text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Про компанію</h1>
            <p className="text-green-100/80">Технології підвищення врожайності</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
            <p>
              <strong>ТОВ «Родоніт Агро»</strong> розробляє і постачає препарати для захисту та
              стимуляції рослин — від біостимуляторів і мікродобрив до фунгіцидів та ад’ювантів.
            </p>
            <p>
              Наші рішення допомагають господарствам підвищувати врожайність, знижувати витрати на
              засоби захисту рослин і вирощувати якісну продукцію. Ми працюємо з усіма основними
              культурами України та надаємо технічний супровід агронома на кожному етапі — від підбору
              схеми застосування до контролю результату в полі.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Наша філософія — три «Є»</h2>
          <div className="space-y-4">
            {threeE.map((e) => (
              <div key={e.title} className="flex gap-4 bg-[var(--green-soft)] rounded-lg p-5">
                <div className="w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold shrink-0">
                  Є
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{e.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{e.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/preparaty" className="bg-green-700 text-white font-medium px-6 py-3 rounded hover:bg-green-800 transition-colors">
              Переглянути препарати
            </Link>
            <Link href="/contacts" className="border border-gray-300 text-gray-700 px-6 py-3 rounded hover:border-green-400 transition-colors">
              Контакти
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
