'use client'

import { useState } from 'react'

export interface ApplicationRow {
  culture: string
  phase: string
  rate: string
}

/**
 * Інтерактивний регламент застосування: зліва список культур,
 * клік по культурі → норми і фази внесення для неї.
 * (за побажанням Олега: клік соняшник/кукурудза → відповідна інформація)
 */
export default function ApplicationsInteractive({ rows }: { rows: ApplicationRow[] }) {
  // Групуємо рядки за культурою, зберігаючи порядок появи
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
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Список культур */}
      <div className="flex sm:flex-col gap-2 flex-wrap sm:w-56 sm:shrink-0">
        {cultures.map((c) => {
          const isActive = c === active
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`text-left text-sm font-medium px-4 py-2.5 rounded transition-colors ${
                isActive
                  ? 'bg-green-700 text-white'
                  : 'bg-green-50 text-gray-700 hover:bg-green-100'
              }`}
            >
              {c}
            </button>
          )
        })}
      </div>

      {/* Норми для обраної культури */}
      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-3">{active}</h4>
        <div className="space-y-3">
          {(byCulture[active] ?? []).map((r, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 pb-3 border-b border-gray-100 last:border-0 last:pb-0">
              <div className="text-sm text-gray-500 sm:w-1/2">
                <span className="text-gray-400">Фаза: </span>
                {r.phase}
              </div>
              <div className="text-sm font-medium text-green-800 sm:w-1/2">
                <span className="text-gray-400 font-normal">Норма: </span>
                {r.rate}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
