import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Про компанію',
  description:
    'ТОВ «Родоніт Агро» — понад 20 років на аграрному ринку України. Унікальні препарати, власні дослідження, технологія «Три-Е».',
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-[var(--green-deep)] text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Про компанію</h1>
            <p className="text-green-100/80">Перейшовши 20-річний рубіж, «Родоніт Агро» відкриває нові горизонти</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="space-y-4 text-gray-700">
            <p>
              Після створення компанія була націлена на продаж продукції різного плану. Були важкі часи —
              перебудова, нікому невідома компанія… Треба було виживати та розвиватись. З ходом розвитку
              зміщувались акценти й визначались пріоритети.
            </p>
            <p>
              Сьогодні основним напрямком для компанії «Родоніт Агро» є <strong>аграрний</strong>. За два
              десятиріччя ми зібрали для аграріїв місткий портфель продукції з понад 20 найменувань, де
              «Родоніт Агро» є реєстрантом. Частина продуктів — наше власне виробництво, деякі виробляються
              на аутсорсингу, частина — імпортні за ексклюзивними контрактами, придбати які можна тільки у нас.
            </p>
            <p>
              «Родоніт Агро» завжди орієнтована на інновації. Ми знаходимось у постійному пошуку нових
              продуктів та прогресивних, екологічних технологій. Розумні ціни на товари та високий ефект від
              їх застосування — це найкращий аргумент для аграріїв.
            </p>
            <p>
              Наукова робота — вагомий складовий елемент у нашій діяльності. Ми співпрацюємо з науковими
              підрозділами партнерів і постачальників. Наші науковці — фахівці з глибокою компетенцією в
              агрономії. Щороку ми закладаємо 50–60 науково-виробничих дослідів, щоб і надалі забезпечувати
              клієнтів якісними рішеннями для аграрного виробництва.
            </p>
          </div>

          {/* Статистика */}
          <div className="grid grid-cols-3 gap-4 my-10">
            {[
              { value: '20+', label: 'років на ринку' },
              { value: '20+', label: 'найменувань препаратів' },
              { value: '50–60', label: 'дослідів щороку' },
            ].map((s) => (
              <div key={s.label} className="bg-[var(--green-soft)] rounded-lg p-6 text-center">
                <div className="text-2xl font-bold text-green-800">{s.value}</div>
                <div className="text-xs text-gray-600 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-10 mb-3">Технологія «Три-Е»</h2>
          <p className="text-gray-700 mb-6">
            Власна запатентована технологія «Три-Е» — <strong>Екологічно. Економічно. Ефективно.</strong> Це
            підхід, що дозволяє вирощувати екологічно чисту продукцію, відновлювати родючість ґрунту й
            захищати майбутній урожай від хімічних і токсичних стресів — за оптимальних витрат.
          </p>

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
