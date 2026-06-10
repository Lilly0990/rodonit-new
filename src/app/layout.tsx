import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rodonit Agro',
  description: 'Препарати для агробізнесу',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  )
}
