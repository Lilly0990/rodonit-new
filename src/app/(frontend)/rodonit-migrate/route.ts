// @ts-nocheck
/**
 * Тимчасовий міграційний endpoint. ВИДАЛИТИ ПІСЛЯ ЗАВЕРШЕННЯ CMS-задач.
 * POST /rodonit-migrate  body {"sql":["...","..."]}  — виконує raw SQL по черзі.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SECRET = 'rodonit-migrate-2026'

async function exec(db: any, sql: string) {
  const { sql: drizzleSql } = await import('drizzle-orm')
  const raw = drizzleSql.raw(sql)
  const drz = db?.drizzle ?? db?.db
  if (drz && typeof drz.execute === 'function') {
    const r = await drz.execute(raw)
    return Array.isArray(r) ? { rows: r } : r
  }
  if (typeof db?.pool?.unsafe === 'function') return { rows: await db.pool.unsafe(sql) }
  if (typeof db?.pool?.query === 'function') return db.pool.query(sql)
  throw new Error('no exec surface: ' + Object.keys(db ?? {}).join(','))
}

export async function POST(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${SECRET}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  try {
    const payload = await getPayload({ config })
    const db = payload.db as any
    let body: any = null
    try { body = await req.json() } catch {}
    const stmts: string[] = Array.isArray(body?.sql) ? body.sql : body?.sql ? [body.sql] : []
    const out: any[] = []
    for (const s of stmts) {
      try {
        const r = await exec(db, s)
        out.push({ ok: true, sql: s.slice(0, 70), rows: r?.rows ?? r })
      } catch (e: any) {
        out.push({ ok: false, sql: s.slice(0, 70), error: e?.message })
      }
    }
    return NextResponse.json({ ok: true, out })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? String(err) })
  }
}
