'use client'

import { useRouter } from 'next/navigation'

export default function LocaleSwitcher({ current }: { current: 'uk' | 'en' }) {
  const router = useRouter()

  function toggle() {
    const next = current === 'uk' ? 'en' : 'uk'
    document.cookie = `locale=${next}; path=/; max-age=31536000; SameSite=Lax`
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      className="text-xs font-semibold uppercase tracking-wide text-gray-500 hover:text-green-700 border border-gray-200 rounded px-2 py-1 transition-colors"
      title={current === 'uk' ? 'Switch to English' : 'Перейти на українську'}
    >
      {current === 'uk' ? 'EN' : 'УК'}
    </button>
  )
}
