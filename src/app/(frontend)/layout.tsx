import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import CookieConsent from '@/components/CookieConsent'
import '../globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: {
    default: 'Rodonit Agro — Препарати для захисту рослин',
    template: '%s | Rodonit Agro',
  },
  description: 'Biostimulants та препарати для агробізнесу. Зеребра АГРО, MIRA LIFE, Верно та інші.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'),
  openGraph: {
    siteName: 'Rodonit Agro',
    locale: 'uk_UA',
    type: 'website',
  },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
