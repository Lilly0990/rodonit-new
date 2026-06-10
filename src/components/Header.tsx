import Link from 'next/link'

const nav = [
  { label: 'Препарати', href: '/preparaty' },
  { label: 'Техносхеми', href: '/tehno-shemi' },
  { label: 'Результати', href: '/result' },
  { label: 'Проблеми', href: '/problem' },
  { label: 'Контакти', href: '/contacts' },
]

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-green-900 text-xl tracking-tight">
          Rodonit<span className="text-green-600">.</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
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
          className="hidden md:block bg-green-700 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition-colors"
        >
          Замовити консультацію
        </Link>
      </div>
    </header>
  )
}
