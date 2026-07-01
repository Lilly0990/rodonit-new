import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ContactForm from '@/components/ContactForm'
import { getSettings } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Контакти',
  description: "Зв'яжіться з нами: телефон, email, адреса. Консультація агронома.",
}

export default async function ContactsPage() {
  const settings = await getSettings()
  const phones = settings.phones ?? []

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
            {/* Контактна інформація з CMS */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Зв'яжіться з нами</h2>
              <div className="space-y-5 text-gray-600">

                {phones.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-800 mb-1">
                      {settings.siteName ?? 'Головний офіс'}
                    </p>
                    {phones.map((p) => (
                      <a
                        key={p.number}
                        href={`tel:${p.number.replace(/[^\d+]/g, '')}`}
                        className="block text-green-700 hover:underline"
                      >
                        {p.number}
                        {p.label ? (
                          <span className="text-gray-400 text-xs ml-2">— {p.label}</span>
                        ) : null}
                      </a>
                    ))}
                  </div>
                )}

                {settings.secretaryPhone && (
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Приймальна секретаря</p>
                    <a
                      href={`tel:${settings.secretaryPhone.replace(/[^\d+]/g, '')}`}
                      className="block text-green-700 hover:underline"
                    >
                      {settings.secretaryPhone}
                    </a>
                  </div>
                )}

                {settings.email && (
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Email</p>
                    <a href={`mailto:${settings.email}`} className="text-green-700 hover:underline">
                      {settings.email}
                    </a>
                  </div>
                )}

                {settings.address && (
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Поштова адреса</p>
                    <p className="whitespace-pre-line">{settings.address}</p>
                  </div>
                )}

                {(settings.facebook || settings.instagram || settings.telegram) && (
                  <div>
                    <p className="font-medium text-gray-800 mb-1">Соціальні мережі</p>
                    <div className="flex gap-4 mt-1 flex-wrap">
                      {settings.facebook && (
                        <a
                          href={settings.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:underline"
                        >
                          Facebook
                        </a>
                      )}
                      {settings.instagram && (
                        <a
                          href={settings.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:underline"
                        >
                          Instagram
                        </a>
                      )}
                      {settings.telegram && (
                        <a
                          href={
                            settings.telegram.startsWith('@')
                              ? `https://t.me/${settings.telegram.slice(1)}`
                              : settings.telegram
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-700 hover:underline"
                        >
                          Telegram
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Форма */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Напишіть нам</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
