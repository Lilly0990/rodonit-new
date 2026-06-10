import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Контакти',
  description: "Зв'яжіться з нами: телефон, email, адреса. Консультація агронома.",
}

export default function ContactsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="bg-green-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Контакти</h1>
            <p className="text-green-200">Ми готові проконсультувати по будь-яких питаннях</p>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Зв'яжіться з нами</h2>
              <div className="space-y-4 text-gray-600">
                <div>
                  <p className="font-medium text-gray-800">Відділ збуту</p>
                  <a href="tel:+380445023156" className="block text-green-700 hover:underline">+38 (044) 502-31-56</a>
                  <a href="tel:+380445023157" className="block text-green-700 hover:underline">+38 (044) 502-31-57</a>
                  <a href="tel:+380674024414" className="block text-green-700 hover:underline">+38 (067) 402-44-14</a>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email</p>
                  <a href="mailto:info@rodonit-agro.com.ua" className="text-green-700 hover:underline">
                    info@rodonit-agro.com.ua
                  </a>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Поштова адреса</p>
                  <p>вул. Ю. Шумського, 1-б, оф. 117<br />Київ, 02140, Україна</p>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Соціальні мережі</p>
                  <div className="flex gap-4 mt-1">
                    <a href="https://facebook.com/RodonitCompany" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">
                      Facebook
                    </a>
                    <a href="https://instagram.com/rodonit_company" target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline">
                      Instagram
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Напишіть нам</h2>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Ваше ім'я
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Іван Петренко"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Телефон
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="+380 XX XXX XX XX"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Запитання
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Опишіть вашу культуру і проблему..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-green-700 text-white font-medium py-2 rounded hover:bg-green-600 transition-colors"
                >
                  Надіслати
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
