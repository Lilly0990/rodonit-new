import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { products } from '@/data/products'
import { getSettings, DEFAULT_STATS } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Про компанію',
  description:
    'ТОВ «Родоніт Агро» (засн. 2019) — аграрний сектор України. Шість препаратів для захисту й живлення рослин, власні науково-виробничі досліди.',
}

export default async function AboutPage() {
  const settings = await getSettings()
  const stats =
    settings.statistics && settings.statistics.length > 0
      ? settings.statistics
      : [
          DEFAULT_STATS[0],
          { value: String(products.length), label: 'препаратів у каталозі' },
          DEFAULT_STATS[1],
        ]
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-[var(--green-deep)] text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Про компанію</h1>
            <p className="text-green-100/80">«Родоніт Агро» — поруч із аграрієм на кожному етапі технології</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-4 text-gray-700">
            <p>
              Компанія «Родоніт Агро» заснована у 2019 році. На початковому етапі напрямок діяльності був
              широким: компанія працювала з різними видами продукції, щоб закріпитися на ринку та сформувати
              стабільну клієнтську базу. З часом фокус змістився, і сьогодні основним напрямком роботи
              «Родоніт Агро» є <strong>аграрний сектор</strong>.
            </p>
            <p>
              Сьогодні продуктовий портфель компанії налічує <strong>шість препаратів</strong>. Це усвідомлений
              вибір: замість широкого асортименту ми зосередились на продуктах, які закривають ключові потреби
              аграріїв у захисті рослин та живленні — від контролю хвороб до профілактики дефіциту
              мікроелементів на основних культурах українського виробництва.
            </p>
            <p>
              Препарати «Родоніт Агро» орієнтовані на практичний результат для аграрія: зниження хімічного
              навантаження на продукцію та стабільність урожайності при обґрунтованій вартості технології.
            </p>
            <p>
              Наука є складовою частиною нашої роботи. Ми співпрацюємо з науковими підрозділами партнерів і
              постачальників, а фахівці компанії мають профільну агрономічну підготовку та практичний досвід
              застосування продуктів у польових умовах. Щороку ми закладаємо науково-виробничі досліди,
              результати яких використовуємо для вдосконалення продуктової лінійки та рекомендацій для клієнтів.
            </p>
            <p>
              Ми продовжуємо шукати нові продукти та технології, які відповідають актуальним запитам аграрного
              виробництва в Україні.
            </p>
            <p className="text-green-800 font-medium">
              «Родоніт Агро» — поруч із аграрієм на кожному етапі технології.
            </p>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4 my-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-[var(--green-soft)] rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-800">{s.value}</div>
                <div className="text-xs text-gray-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
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
