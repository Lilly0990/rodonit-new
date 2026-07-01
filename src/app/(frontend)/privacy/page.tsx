import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Політика конфіденційності',
  description: 'Політика конфіденційності та використання файлів cookie на сайті Rodonit Agro',
}

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Політика конфіденційності</h1>
        <div className="prose prose-sm max-w-none text-gray-700 space-y-4">
          <p>
            Цей сайт використовує файли cookie та аналітичні інструменти (Google Analytics, Facebook Pixel)
            для аналізу відвідувань та покращення роботи сайту.
          </p>
          <h2 className="text-lg font-semibold text-gray-900 mt-6">Які дані ми збираємо</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Технічні дані браузера та пристрою</li>
            <li>Сторінки, які ви переглядали</li>
            <li>Дані контактної форми (тільки якщо ви їх надали)</li>
          </ul>
          <h2 className="text-lg font-semibold text-gray-900 mt-6">Файли cookie</h2>
          <p>
            Ви можете відхилити необов'язкові файли cookie через банер при першому відвіданні сайту.
            Технічні cookie, необхідні для роботи сайту, використовуються завжди.
          </p>
          <h2 className="text-lg font-semibold text-gray-900 mt-6">Контакт</h2>
          <p>
            З питань конфіденційності звертайтесь через форму на сторінці{' '}
            <a href="/contacts" className="text-green-700 underline">Контакти</a>.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
