import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import CookieConsent from '@/components/CookieConsent'
import OrganizationSchema from '@/components/OrganizationSchema'
import '../globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], variable: '--font-inter' })

const SITE = process.env.NEXT_PUBLIC_SERVER_URL || 'https://rodonit-new.vercel.app'

export const metadata: Metadata = {
  title: {
    default: 'Rodonit Agro — препарати для захисту та живлення рослин',
    template: '%s | Rodonit Agro',
  },
  description:
    'Родоніт Агро — препарати для захисту й живлення рослин: мідні фунгіциди (Nordox 75 WG), мікродобрива Верно, стимулятори росту Silver Mix, Гідролип, Міра. Технології підвищення врожайності.',
  keywords: [
    'Родоніт Агро', 'Rodonit Agro', 'Nordox 75 WG', 'мідний фунгіцид', 'мікродобрива',
    'стимулятори росту', 'захист рослин', 'Silver Mix', 'Верно', 'Гідролип', 'агрохімія',
  ],
  metadataBase: new URL(SITE),
  // canonical тут НЕ ставити: його успадкує кожна сторінка без власного canonical
  // і вкаже на головну. Кожна сторінка задає свій alternates.canonical.
  openGraph: {
    siteName: 'Rodonit Agro',
    locale: 'uk_UA',
    type: 'website',
    title: 'Rodonit Agro — препарати для захисту та живлення рослин',
    description:
      'Мідні фунгіциди, мікродобрива, стимулятори росту та ад’юванти для сучасного агробізнесу України.',
    images: ['/og-image.jpg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rodonit Agro — препарати для захисту та живлення рослин',
    description: 'Технології підвищення врожайності: фунгіциди, мікродобрива, стимулятори росту.',
    images: ['/og-image.jpg'],
  },
  // 07.10.2026: rodonit-new — дубль. Основний сайт rodonit.com.ua працює на редизайні,
  // тож цей проєкт закрито від індексації (див. також X-Robots-Tag у next.config.ts).
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans">
        <OrganizationSchema />
        {children}
        <CookieConsent />
      </body>
    </html>
  )
}
