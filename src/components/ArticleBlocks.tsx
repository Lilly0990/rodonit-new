/**
 * Багаті блоки для статей блогу — вставляються в контент через маркери
 * ([[product:...]], [[synergy]], [[phases]]) і рендеряться у blog/[slug].
 * Стиль повторює дизайн-артефакт: бренд-зелень + томатний акцент.
 */
import { JSX } from 'react'

const TOMATO = '#c63d2f'

// ─── Product spotlight (склад препарату) ──────────────────────────────
export interface ProductStat { n: string; unit?: string; label: string; accent?: boolean }
export interface ProductCardData {
  name: string
  badge?: string
  subtitle?: string
  stats: ProductStat[]
  description: string
}

export function ProductCard({ data }: { data: ProductCardData }): JSX.Element {
  return (
    <div className="my-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_18px_40px_-30px_rgba(31,61,43,0.5)] md:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="m-0 text-2xl font-bold text-[var(--green-deep)]">{data.name}</h3>
        {data.badge && (
          <span className="rounded-full border border-[var(--green)]/25 bg-[var(--green-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--green)]">
            {data.badge}
          </span>
        )}
      </div>
      {data.subtitle && <p className="mt-2 mb-0 text-sm text-gray-500">{data.subtitle}</p>}
      <div className="my-5 grid grid-cols-3 gap-3">
        {data.stats.map((s, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-[var(--background)] px-2 py-4 text-center">
            <div className="text-3xl font-bold leading-none tabular-nums" style={{ color: s.accent ? TOMATO : 'var(--foreground)' }}>
              {s.n}{s.unit && <span className="text-base">{s.unit}</span>}
            </div>
            <div className="mt-1.5 text-xs uppercase tracking-wide text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="m-0 text-[15px] leading-relaxed text-gray-700">{data.description}</p>
    </div>
  )
}

// ─── Synergy cards (два елементи) ─────────────────────────────────────
export interface SynergyItem { symbol: string; sub: string; title: string; text: string }

export function SynergyCards({ items }: { items: SynergyItem[] }): JSX.Element {
  return (
    <div className="my-6 grid gap-4 sm:grid-cols-2">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-gray-200 bg-white p-5">
          <div className="mb-2 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold leading-none text-[var(--green)]">{it.symbol}</span>
            <span className="text-xs uppercase tracking-wider text-gray-500">{it.sub}</span>
          </div>
          <h4 className="mb-1 mt-0 text-base font-bold text-gray-900">{it.title}</h4>
          <p className="m-0 text-[15px] leading-relaxed text-gray-600">{it.text}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Phase table (таблиця фаз) ────────────────────────────────────────
export interface PhaseRow { phase: string; what: string; action: string }

export function PhaseTable({ rows, head }: { rows: PhaseRow[]; head: [string, string, string] }): JSX.Element {
  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-gray-200">
      <table className="w-full min-w-[30rem] border-collapse text-[15px]">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className="bg-[var(--green-deep)] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-white">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-[var(--background)]' : 'bg-white'}>
              <td className="whitespace-nowrap border-t border-gray-200 px-4 py-3 font-bold text-[var(--green)]">{r.phase}</td>
              <td className="border-t border-gray-200 px-4 py-3 align-top text-gray-700">{r.what}</td>
              <td className="border-t border-gray-200 px-4 py-3 align-top text-gray-700">{r.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
