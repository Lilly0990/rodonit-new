'use client'

import { useState } from 'react'
import type { ApplicationRow } from '@/data/products'
import ApplicationsInteractive from '@/components/ApplicationsInteractive'

export interface ContentSection {
  heading: string
  paragraphs: string[]
}

// Секції, які рендеряться як марковані списки переваг
const LIST_SECTIONS = new Set([
  'Переваги',
  'Переваги препарату',
  'Ключові переваги (що важливо агроному)',
])

// Кращі назви секцій для UI
const HEADING_LABELS: Record<string, string> = {
  'Діюча речовина препарату': 'Склад / діюча речовина',
  Застосування: 'Застосування',
  'Методи застосування': 'Методи застосування',
  'Механізм дії': 'Механізм дії',
  Переваги: 'Переваги',
  'Переваги препарату': 'Переваги препарату',
  'Ключові переваги (що важливо агроному)': 'Ключові переваги для агронома',
  'Особливості застосування': 'Особливості застосування',
  'Умови зберігання': 'Умови зберігання',
  'Вирішує проблеми': 'Вирішує проблеми',
  'Де застосовується': 'Де застосовується',
  'Норми та строки': 'Норми та строки',
  'Для кого цей продукт': 'Для кого цей продукт',
  'Як готувати робочий розчин': 'Як готувати робочий розчин',
  'Сумісність і безпечність': 'Сумісність і безпечність',
  'Рекомендації щодо застосування': 'Рекомендації щодо застосування',
  'Приготування та норма витрати препарату, робочого розчину:': 'Приготування робочого розчину',
}

function SectionBody({ section }: { section: ContentSection }) {
  if (LIST_SECTIONS.has(section.heading)) {
    return (
      <ul className="space-y-2">
        {section.paragraphs.map((p, i) => (
          <li key={i} className="flex gap-2 text-sm text-gray-600">
            <svg className="w-4 h-4 text-green-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    )
  }

  // «Вирішує проблеми»: чергуються короткий підзаголовок + розкриття
  if (section.heading === 'Вирішує проблеми') {
    const blocks: { title: string; text: string }[] = []
    for (let i = 0; i < section.paragraphs.length; i++) {
      const p = section.paragraphs[i]
      const isTitle = p.length < 70 && /[.!]$/.test(p)
      if (isTitle && i + 1 < section.paragraphs.length) {
        blocks.push({ title: p, text: section.paragraphs[i + 1] })
        i++
      } else {
        blocks.push({ title: '', text: p })
      }
    }
    return (
      <div className="space-y-4">
        {blocks.map((b, i) => (
          <div key={i}>
            {b.title && <p className="font-medium text-gray-800 mb-1">{b.title}</p>}
            <p className="text-sm text-gray-600">{b.text}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {section.paragraphs.map((p, i) => (
        <p key={i} className="text-sm text-gray-600">{p}</p>
      ))}
    </div>
  )
}

export default function ProductDetails({
  sections,
  applications,
}: {
  sections: ContentSection[]
  applications?: ApplicationRow[]
}) {
  // зібрати пункти акордеону: спочатку склад+застосування+механізм як «Опис продукту»,
  // потім окремі секції
  const items: { title: string; render: () => React.ReactNode }[] = []

  const descGroup = sections.filter((s) =>
    ['Діюча речовина препарату', 'Застосування', 'Методи застосування', 'Механізм дії', 'Де застосовується', 'Для кого цей продукт', 'Норми та строки'].includes(s.heading),
  )
  const benefits = sections.filter((s) => LIST_SECTIONS.has(s.heading) || s.heading === 'Ключові переваги (що важливо агроному)')
  const rest = sections.filter(
    (s) => !descGroup.includes(s) && !benefits.includes(s) && s.heading !== 'Вирішує проблеми',
  )
  const problems = sections.find((s) => s.heading === 'Вирішує проблеми')

  if (descGroup.length) {
    items.push({
      title: 'Опис продукту',
      render: () => (
        <div className="space-y-5">
          {descGroup.map((s) => (
            <div key={s.heading}>
              <p className="font-semibold text-gray-800 mb-2">{HEADING_LABELS[s.heading] || s.heading}</p>
              <SectionBody section={s} />
            </div>
          ))}
        </div>
      ),
    })
  }

  if (benefits.length) {
    items.push({
      title: 'Переваги',
      render: () => (
        <div className="space-y-5">
          {benefits.map((s) => (
            <SectionBody key={s.heading} section={s} />
          ))}
        </div>
      ),
    })
  }

  if (applications?.length) {
    items.push({
      title: 'Регламент застосування',
      render: () => <ApplicationsInteractive rows={applications} />,
    })
  }

  for (const s of rest) {
    items.push({ title: HEADING_LABELS[s.heading] || s.heading, render: () => <SectionBody section={s} /> })
  }

  if (problems) {
    items.push({ title: 'Вирішує проблеми', render: () => <SectionBody section={problems} /> })
  }

  const [open, setOpen] = useState<number>(0)

  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg overflow-hidden bg-white">
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
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
            {isOpen && <div className="px-5 pb-6 pt-1">{item.render()}</div>}
          </div>
        )
      })}
    </div>
  )
}
