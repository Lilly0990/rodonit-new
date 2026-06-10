'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <p className="text-sm text-gray-300 max-w-2xl">
          Ми використовуємо файли cookie для аналітики та коректної роботи сайту.
          Натискаючи «Прийняти», ви погоджуєтесь на їх використання відповідно до нашої{' '}
          <Link href="/privacy" className="underline hover:text-white">
            Політики конфіденційності
          </Link>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={decline}
            className="px-4 py-2 text-sm border border-gray-600 rounded hover:border-gray-400 transition-colors"
          >
            Відхилити
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm bg-green-600 rounded hover:bg-green-500 transition-colors font-medium"
          >
            Прийняти
          </button>
        </div>
      </div>
    </div>
  )
}
