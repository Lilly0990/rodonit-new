import Image from 'next/image'
import Link from 'next/link'
import { getSettings } from '@/lib/cms'
import OrderButton from '@/components/OrderButton'

const navLinks = [
  { label: 'Препарати', href: '/preparaty' },
  { label: 'Блог', href: '/blog' },
  { label: "Дистриб'ютори", href: '/distributors' },
  { label: 'Про компанію', href: '/about' },
  { label: 'Контакти', href: '/contacts' },
]

export default async function Header() {
  const settings = await getSettings()
  const firstPhone = settings.phones?.[0]?.number ?? null

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      {/* Топ-бар: тільки контакти (телефон + email) */}
      {firstPhone && (
        <div className="bg-green-900 text-white text-xs hidden lg:block">
          <div className="max-w-6xl mx-auto px-4 py-1.5 flex items-center gap-4">
            <a
              href={`tel:${firstPhone.replace(/[^\d+]/g, '')}`}
              className="hover:text-green-200 transition-colors inline-flex items-center gap-1.5"
            >
              <span aria-hidden>📞</span>{firstPhone}
            </a>
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="hover:text-green-200 transition-colors inline-flex items-center gap-1.5"
              >
                <span aria-hidden>✉</span>{settings.email}
              </a>
            )}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Родоніт Агро" width={40} height={40} className="w-10 h-10" />
          <span className="flex flex-col leading-tight">
            <span className="font-bold text-green-900 text-lg tracking-tight">Родоніт Агро</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">
              Технології підвищення врожайності
            </span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-5">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-600 hover:text-green-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <OrderButton
          label="Замовити консультацію"
          className="hidden lg:block bg-green-700 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition-colors cursor-pointer"
        />

        {/* Мобільне меню */}
        <OrderButton label="Зв'язатись" className="lg:hidden text-green-700 text-sm font-medium cursor-pointer" />
      </div>
    </header>
  )
}
