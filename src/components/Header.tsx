import Image from 'next/image'
import Link from 'next/link'

const nav = [
  { label: 'Препарати', href: '/preparaty' },
  { label: 'Техносхеми', href: '/tehno-shemi' },
  { label: 'Результати', href: '/result' },
  { label: 'Новини', href: '/blog' },
  { label: 'Про компанію', href: '/about' },
  { label: 'Контакти', href: '/contacts' },
]

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Родоніт Агро" width={40} height={40} className="w-10 h-10" />
          <span className="flex flex-col leading-tight">
            <span className="font-bold text-green-900 text-lg tracking-tight">Родоніт Агро</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">Технології підвищення врожайності</span>
          </span>
        </Link>
        <nav className="hidden lg:flex items-center gap-5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-gray-600 hover:text-green-700 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/contacts"
          className="hidden lg:block bg-green-700 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Замовити консультацію
        </Link>
      </div>
    </header>
  )
}
