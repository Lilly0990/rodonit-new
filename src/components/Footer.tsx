import Link from 'next/link'
import { getSettings } from '@/lib/cms'

const navLinks = [
  ['Препарати', '/preparaty'],
  ['Блог', '/blog'],
  ["Дистриб'ютори", '/distributors'],
  ['Про компанію', '/about'],
  ['Контакти', '/contacts'],
]

export default async function Footer() {
  const settings = await getSettings()
  const phones = settings.phones ?? []
  const mainPhones = phones.slice(0, 2)

  return (
    <footer className="bg-[var(--green-deep)] text-green-100/70 py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-white text-lg mb-2">
            {settings.siteName ?? 'Rodonit Agro'}
          </p>
          <p className="text-sm">Препарати для сучасного агробізнесу України</p>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">Навігація</p>
          <ul className="space-y-2 text-sm">
            {navLinks.map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-white mb-3">Контакти</p>
          <ul className="space-y-1.5 text-sm">
            {mainPhones.map((p) => (
              <li key={p.number}>
                <a
                  href={`tel:${p.number.replace(/[^\d+]/g, '')}`}
                  className="hover:text-white transition-colors"
                >
                  {p.number}
                </a>
              </li>
            ))}
            {settings.email && (
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-white transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="text-green-100/60 whitespace-pre-line">{settings.address}</li>
            )}
          </ul>

          <div className="flex gap-4 mt-4 flex-wrap">
            {settings.facebook && (
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                Facebook
              </a>
            )}
            {settings.instagram && (
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                Instagram
              </a>
            )}
            {settings.telegram && (
              <a
                href={settings.telegram.startsWith('@')
                  ? `https://t.me/${settings.telegram.slice(1)}`
                  : settings.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-white transition-colors"
              >
                Telegram
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/10 flex flex-wrap justify-between gap-4 text-xs text-green-100/50">
        <p>© {new Date().getFullYear()} {settings.siteName ?? 'Rodonit Agro'}. Всі права захищені.</p>
        <Link href="/privacy" className="hover:text-gray-400 transition-colors">
          Політика конфіденційності
        </Link>
      </div>
    </footer>
  )
}
