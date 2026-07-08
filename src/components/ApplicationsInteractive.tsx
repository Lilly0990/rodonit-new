'use client'

import { useState } from 'react'

export interface ApplicationRow {
  culture: string
  phase: string
  rate: string
}

/**
 * Блок «Застосування на культурах»: клікабельні теги культур,
 * під ними — регламент (фаза + норма) для обраної культури.
 * За замовчуванням відкрита перша культура (напр. соняшник).
 */
export default function ApplicationsInteractive({ rows }: { rows: ApplicationRow[] }) {
  // Групуємо регламент за культурою, зберігаючи порядок появи
  const cultures: string[] = []
  const byCulture: Record<string, ApplicationRow[]> = {}
  for (const r of rows) {
    if (!byCulture[r.culture]) {
      byCulture[r.culture] = []
      cultures.push(r.culture)
    }
    byCulture[r.culture].push(r)
  }

  const [active, setActive] = useState(cultures[0] ?? '')

  if (cultures.length === 0) return null

  return (
    <div>
      {/* Теги культур */}
      <div className="flex flex-wrap gap-2 mb-5">
        {cultures.map((c) => {
          const isActive = c === active
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors cursor-pointer ${
                isActive
                  ? 'bg-green-700 text-white'
                  : 'bg-green-50 text-green-800 hover:bg-green-100'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>

      {/* Регламент для обраної культури */}
      <div className="bg-green-50/60 border border-green-100 rounded-lg p-5">
        <h3 className="font-semibold text-gray-900 mb-3">{active}</h3>
        <div className="space-y-2">
          {(byCulture[active] ?? []).map((r, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed">
              <span className="text-gray-400">Регламент застосування: </span>
              {r.rate}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
