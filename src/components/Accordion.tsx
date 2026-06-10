'use client'

import { useState } from 'react'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

export default function Accordion({
  items,
  defaultOpen = 0,
}: {
  items: AccordionItem[]
  defaultOpen?: number | null
}) {
  const [open, setOpen] = useState<number | null>(defaultOpen)

  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              aria-expanded={isOpen}
            >
              <span className="font-medium text-gray-900">{item.title}</span>
              <svg
                className={`w-5 h-5 text-green-700 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && <div className="px-5 pb-5 text-sm text-gray-600">{item.content}</div>}
          </div>
        )
      })}
    </div>
  )
}
