'use client'

import { useState } from 'react'
import type { CmsDistributor } from '@/lib/cms'

export interface DirectionUi {
  slug: string
  name: string
}

export default function DistributorFilter({
  directions,
  distributors,
}: {
  directions: DirectionUi[]
  distributors: CmsDistributor[]
}) {
  const [active, setActive] = useState<string>('all')

  const tabs = [{ slug: 'all', name: 'Усі напрямки' }, ...directions]
  const visible = active === 'all' ? distributors : distributors.filter((d) => d.direction === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        {tabs.map((t) => {
          const isActive = active === t.slug
          return (
            <button
              key={t.slug}
              onClick={() => setActive(t.slug)}
              className={`text-sm font-medium px-5 py-2.5 rounded transition-colors ${
                isActive
                  ? 'bg-green-700 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-green-400'
              }`}
            >
              {t.name}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {visible.map((d) => (
          <div
            key={d.slug}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:border-green-400 hover:shadow-md transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{d.company}</h3>
            {d.directionLabel && (
              <p className="text-sm text-green-700 mb-3">{d.directionLabel}</p>
            )}
            {d.region && <p className="text-sm text-gray-500 mb-3">{d.region}</p>}
            <div className="flex flex-col gap-1">
              {(d.phones ?? []).map((p) => (
                <a
                  key={p.number}
                  href={`tel:${p.number.replace(/[^\d+]/g, '')}`}
                  className="text-sm text-gray-700 hover:text-green-700 font-medium"
                >
                  {p.number}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
