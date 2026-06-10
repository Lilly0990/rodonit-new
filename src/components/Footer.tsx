import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[var(--green-deep)] text-green-100/70 py-12 px-4 mt-auto">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="font-bold text-white text-lg mb-2">Rodonit Agro</p>
          <p className="text-sm">Препарати для сучасного агробізнесу України</p>
        </div>
        <div>
          <p className="font-semibold text-white mb-3">Навігація</p>
          <ul className="space-y-2 text-sm">
            {[
              ['Препарати', '/preparaty'],
              ['Техносхеми', '/tehno-shemi'],
              ['Результати', '/result'],
              ['Про компанію', '/about'],
              ['Контакти', '/contacts'],
            ].map(([label, href]) => (
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
          <p className="text-sm">rodonit.com.ua</p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://facebook.com/RodonitCompany"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a
              href="https://instagram.com/rodonit_company"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-white/10 flex flex-wrap justify-between gap-4 text-xs text-green-100/50">
        <p>© {new Date().getFullYear()} Rodonit Agro. Всі права захищені.</p>
        <Link href="/privacy" className="hover:text-gray-400 transition-colors">
          Політика конфіденційності
        </Link>
      </div>
    </footer>
  )
}
